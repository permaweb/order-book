import React from 'react';
import { useSelector } from 'react-redux';

import { CollectionType, PAGINATOR } from 'permaweb-orderbook';

import { Loader } from 'components/atoms/Loader';
import { CollectionsTable } from 'components/organisms/CollectionsTable';
import { getCollections } from 'gql';
import { REDUX_TABLES } from 'helpers/redux';
import { getStampData } from 'helpers/utils';
import { RootState } from 'store';

export default function Collections() {
	const dreReducer = useSelector((state: RootState) => state.dreReducer);

	const [collections, setCollections] = React.useState<CollectionType[] | null>(null);

	const [cursor, setCursor] = React.useState<string | null>(null);
	const [cursorState, setCursorState] = React.useState<any>({
		next: null,
		previous: null,
		list: null,
	});

	React.useEffect(() => {
		(async function () {
			setCollections(null);
			const collectionsFetch = await getCollections({
				cursor: cursor,
			});
			const collections = await getStampData(
				collectionsFetch.collections,
				window.arweaveWallet,
				true,
				dreReducer.source
			);

			setCursorState(handleCursors(cursor, collectionsFetch.nextCursor, cursorState.list));
			setCollections(collections);
		})();
	}, [dreReducer.source, cursor]);

	function handlePageFetch(updatedCursor: string | null) {
		setCursor(updatedCursor);
	}

	function getData() {
		if (collections) {
			return (
				<CollectionsTable
					collections={collections}
					recordsPerPage={PAGINATOR}
					reduxCursor={REDUX_TABLES.collectionAssets}
					showPageNumbers={false}
					cursors={{
						next: cursorState.next,
						previous: cursorState.previous,
					}}
					handlePageFetch={(cursor: string | null) => handlePageFetch(cursor)}
				/>
			);
		} else {
			return <Loader />;
		}
	}

	return (
		<div className={'background-wrapper'}>
			<div className={'view-wrapper max-cutoff'}>{getData()}</div>
		</div>
	);
}

function handleCursors(cursor: string | null, nextCursor: string | null, cursorListArg: any) {
	let cursorState: any = {};
	let cursorList: (string | null)[] = cursorListArg ? cursorListArg : [];

	let nextCount = 0;
	let tempCursorList = [];

	if (nextCursor && cursorList[cursorList.length - 1] !== nextCursor) cursorList.push(nextCursor);

	if (cursorList.length >= 3) {
		for (let i = 0; i < cursorList.length; i++) {
			if (nextCursor) {
				tempCursorList[i] = cursorList[i];
				if (cursorList[i] === nextCursor) {
					nextCount++;
				}
			}
		}

		if (nextCount > 1) {
			cursorList = [...tempCursorList].slice(0, tempCursorList.length - 2);
		} else {
			cursorList = [...tempCursorList];
		}

		let previousCount = 3;

		cursorState.next = cursorList[cursorList.length - 1];
		cursorState.previous = cursorList[cursorList.length - previousCount];
	} else {
		if (cursorList.length === 1) {
			cursorState.next = cursorList[0];
			cursorState.previous = null;
		}
		if (cursorList.length === 2) {
			cursorState.next = cursorList[1];
			cursorState.previous = 'P1';
			tempCursorList.push(cursorState.previous);
			for (let i = 0; i < cursorList.length; i++) {
				tempCursorList[i + 1] = cursorList[i];
			}
			cursorList = [...tempCursorList];
		}
	}

	if (cursor) {
		if (cursor === 'P1') {
			cursorState.next = nextCursor;
			cursorState.previous = null;
			cursorList = [nextCursor];
		}
	}

	return {
		next: cursorState.next,
		previous: cursorState.previous,
		list: cursorList,
	};
}
