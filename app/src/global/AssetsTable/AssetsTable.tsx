import React from 'react';
import { useSelector } from 'react-redux';

import { AssetType, CursorEnum } from 'permaweb-orderbook';

import { Loader } from 'components/atoms/Loader';
import { Paginator } from 'components/molecules/Paginator';
import { AssetsGrid } from 'global/AssetsGrid';
import { AssetsList } from 'global/AssetsList';
import { language } from 'helpers/language';
import { RootState } from 'store';
import { ReduxAssetsUpdate } from 'store/assets/ReduxAssetsUpdate';

import * as S from './styles';
import { IProps } from './types';

export default function AssetsTable(props: IProps) {
	const cursorsReducer = useSelector((state: RootState) => state.cursorsReducer);

	const scrollRef = React.useRef(null);

	const [currentPage, setCurrentPage] = React.useState(1);
	const [recordsPerPage] = React.useState(props.recordsPerPage);

	const [currentTableCursor, setCurrentTableCursor] = React.useState<string | null>(null);
	const [currentRecords, setCurrentRecords] = React.useState<AssetType[] | null>(null);
	const [nPages, setNPages] = React.useState<number | null>(null);

	const lastRecordIndex = currentPage * recordsPerPage;
	const firstRecordIndex = lastRecordIndex - recordsPerPage;

	React.useEffect(() => {
		if (props.assets) {
			setCurrentRecords(props.assets ? props.assets.slice(firstRecordIndex, lastRecordIndex) : null);
			setNPages(props.assets ? Math.ceil(props.assets.length / recordsPerPage) : null);
		}
	}, [props.assets]);

	React.useEffect(() => {
		if (cursorsReducer[CursorEnum.idGQL][props.reduxCursor].length) {
			setCurrentTableCursor(cursorsReducer[CursorEnum.idGQL][props.reduxCursor][0].index);
		}
	}, [cursorsReducer[CursorEnum.idGQL]]);

	function getPaginatorAction(action: 'next' | 'prev') {
		if (currentTableCursor && cursorsReducer[CursorEnum.idGQL][props.reduxCursor].length) {
			const reducer = cursorsReducer[CursorEnum.idGQL][props.reduxCursor];
			const currentIndex = reducer.findIndex(
				(element: { index: string; ids: string[] }) => element.index === currentTableCursor
			);
			switch (action) {
				case 'next':
					return reducer.length > currentIndex + 1 ? reducer[currentIndex + 1].index : null;
				case 'prev':
					return currentIndex > 0 ? reducer[currentIndex - 1].index : null;
				default:
					return null;
			}
		} else {
			return null;
		}
	}

	function getPaginator(useIcons: boolean) {
		if (currentRecords && nPages) {
			if (currentRecords.length <= 0) {
				return null;
			} else {
				return (
					<Paginator
						scrollRef={scrollRef}
						nPages={nPages}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						showPageNumbers={props.showPageNumbers}
						handleCursorFetch={(cursor: string | null) => setCurrentTableCursor(cursor)}
						cursors={{
							next: getPaginatorAction('next'),
							previous: getPaginatorAction('prev'),
						}}
						useIcons={useIcons}
					/>
				);
			}
		}
	}

	function getTable() {
		if (!currentRecords) {
			return <Loader />;
		} else {
			if (currentRecords.length <= 0) {
				if (props.showNoResults) {
					return (
						<S.NoAssetsContainer>
							<p>{language.noAssets}</p>
						</S.NoAssetsContainer>
					);
				} else {
					return null;
				}
			} else if (currentRecords.length > 0) {
				switch (props.tableType) {
					case 'grid':
						return <AssetsGrid assets={currentRecords} />;
					case 'list':
						return <AssetsList assets={currentRecords} />;
					default:
						return null;
				}
			} else {
				if (props.showNoResults) {
					return (
						<S.NoAssetsContainer>
							<p>{language.noAssets}</p>
						</S.NoAssetsContainer>
					);
				}
			}
		}
	}

	return (
		<ReduxAssetsUpdate
			apiFetch={props.apiFetch}
			reduxCursor={props.reduxCursor}
			cursorObject={CursorEnum.idGQL}
			currentTableCursor={currentTableCursor}
		>
			<div className={'view-wrapper max-cutoff'}>
				<S.Wrapper>
					{props.header && <h2>{props.header}</h2>}
					{getPaginator(true)}
					{getTable()}
					{getPaginator(false)}
				</S.Wrapper>
			</div>
		</ReduxAssetsUpdate>
	);
}
