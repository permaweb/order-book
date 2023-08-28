import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AssetType, CursorEnum } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { Select } from 'components/atoms/Select';
import { Paginator } from 'components/molecules/Paginator';
import { AssetsGrid } from 'components/organisms/AssetsGrid';
import { AssetsList } from 'components/organisms/AssetsList';
import { ASSET_SORT_OPTIONS, ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import { REDUX_TABLES } from 'helpers/redux';
import { SelectOptionType } from 'helpers/types';
import { RootState } from 'store';
import * as assetActions from 'store/assets/actions';
import { ReduxAssetsUpdate } from 'store/assets/ReduxAssetsUpdate';
import * as cursorActions from 'store/cursors/actions';

import * as S from './styles';
import { IProps } from './types';

export default function AssetsTable(props: IProps) {
	const dispatch = useDispatch();
	const cursorsReducer = useSelector((state: RootState) => state.cursorsReducer);

	const scrollRef = React.useRef(null);

	const [filterListings, setFilterListings] = React.useState<boolean>(false);

	const [currentPage, setCurrentPage] = React.useState(1);
	const [recordsPerPage] = React.useState(props.recordsPerPage);

	const [currentTableCursor, setCurrentTableCursor] = React.useState<string | null>(null);
	const [currentRecords, setCurrentRecords] = React.useState<AssetType[] | null>(null);
	const [nPages, setNPages] = React.useState<number | null>(null);

	const [activeSortOption, setActiveSortOption] = React.useState<SelectOptionType | null>(ASSET_SORT_OPTIONS[0]);

	const lastRecordIndex = currentPage * recordsPerPage;
	const firstRecordIndex = lastRecordIndex - recordsPerPage;

	React.useEffect(() => {
		if (props.assets) {
			setCurrentRecords(props.assets ? props.assets.slice(firstRecordIndex, lastRecordIndex) : null);
			setNPages(props.assets ? Math.ceil(props.assets.length / recordsPerPage) : null);
		}
	}, [props.assets]);

	React.useEffect(() => {
		if (cursorsReducer[CursorEnum.idGQL][props.reduxCursor].groups.length) {
			setCurrentTableCursor(cursorsReducer[CursorEnum.idGQL][props.reduxCursor].groups[0].index);
		}
	}, [cursorsReducer[CursorEnum.idGQL]]);

	function handlePageFetch() {
		switch (props.apiFetch) {
			case 'contract':
				dispatch(assetActions.setAssets({ contractData: null }));
				break;
			case 'user':
				dispatch(
					assetActions.setAssets({ accountData: { address: props.address ? props.address : null, data: null } })
				);
				break;
			case 'collection':
				dispatch(assetActions.setAssets({ collectionData: null }));
				break;
		}
	}

	function getPaginatorAction(action: 'next' | 'prev') {
		if (currentTableCursor && cursorsReducer[CursorEnum.idGQL][props.reduxCursor].groups.length) {
			const reducer = cursorsReducer[CursorEnum.idGQL][props.reduxCursor].groups;
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
						handleCursorFetch={(cursor: string | null) => {
							handlePageFetch();
							setCurrentTableCursor(cursor);
						}}
						cursors={{
							next: getPaginatorAction('next'),
							previous: getPaginatorAction('prev'),
						}}
						useIcons={useIcons}
						disabled={props.loading}
					/>
				);
			}
		}
	}

	function clearAssets() {
		dispatch(
			assetActions.setAssets({
				contractData: null,
				featuredData: null,
				accountData: { address: null, data: null },
				collectionData: null,
			})
		);
		dispatch(
			cursorActions.setCursors({
				[REDUX_TABLES[props.reduxCursor]]: { featuredGroup: [], groups: [], count: 0 },
			})
		);
		return;
	}

	function getActions() {
		if (props.showFilters) {
			return (
				<>
					<Select
						activeOption={activeSortOption}
						setActiveOption={(option: SelectOptionType) => {
							clearAssets();
							setActiveSortOption(option);
						}}
						options={ASSET_SORT_OPTIONS.map((option: SelectOptionType) => option)}
						disabled={!props.assets || props.loading}
					/>
					<Button
						type={'primary'}
						label={language.activeListings}
						handlePress={() => {
							clearAssets();
							setFilterListings(!filterListings);
						}}
						icon={filterListings ? ASSETS.close : null}
						active={filterListings}
						disabled={!props.assets || props.loading}
						height={40}
						width={165}
					/>
				</>
			);
		} else return null;
	}

	function getTable() {
		switch (props.tableType) {
			case 'grid':
				return <AssetsGrid assets={currentRecords} autoLoad={false} loaderCount={9} loading={props.loading} />;
			case 'list':
				return <AssetsList assets={currentRecords} loading={props.loading} />;
			default:
				return null;
		}
	}

	return (
		<ReduxAssetsUpdate
			address={props.address}
			apiFetch={props.apiFetch}
			reduxCursor={props.reduxCursor}
			cursorObject={CursorEnum.idGQL}
			currentTableCursor={currentTableCursor}
			collectionId={props.collectionId}
			getFeaturedData={props.getFeaturedData}
			filterListings={filterListings}
			activeSort={activeSortOption.id}
		>
			<div className={'view-wrapper max-cutoff'}>
				<S.Wrapper ref={scrollRef}>
					{props.header && <h2>{props.header}</h2>}
					<S.PAWrapper>
						<S.PWrapper>{getPaginator(true)}</S.PWrapper>
						<S.AWrapper>{getActions()}</S.AWrapper>
					</S.PAWrapper>
					{getTable()}
					<S.PBWrapper>{getPaginator(false)}</S.PBWrapper>
				</S.Wrapper>
			</div>
		</ReduxAssetsUpdate>
	);
}
