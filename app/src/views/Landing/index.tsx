import React from 'react';
import { useSelector } from 'react-redux';

import { AssetType, CursorEnum, PAGINATOR } from 'permaweb-orderbook';

import { Loader } from 'components/atoms/Loader';
import { AssetsGrid } from 'global/AssetsGrid';
import { AssetsTable } from 'global/AssetsTable';
import { FEATURE_COUNT } from 'helpers/config';
import { REDUX_TABLES } from 'helpers/redux';
import { RootState } from 'store';
import { ReduxAssetsUpdate } from 'store/assets/ReduxAssetsUpdate';

export default function Landing() {
	const assetsReducer = useSelector((state: RootState) => state.assetsReducer);

	const [assets, setAssets] = React.useState<AssetType[] | null>(null);
	const [featuredAssets, setFeaturedAssets] = React.useState<AssetType[] | null>(null);
	const [tableAssets, setTableAssets] = React.useState<AssetType[] | null>(null);

	const [loading, setLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (assetsReducer.data) {
			setLoading(true);
			setAssets(assetsReducer.data);
			setLoading(false);
		}
	}, [assetsReducer.data]);

	// TODO: get featured
	React.useEffect(() => {
		if (assets) {
			if (assets.length >= FEATURE_COUNT) {
				setFeaturedAssets(assets.slice(0, FEATURE_COUNT));
				setTableAssets(assets.slice(FEATURE_COUNT));
			} else {
				setFeaturedAssets(assets);
				setTableAssets([]);
			}
		}
	}, [assets]);

	function getAssets() {
		if (assets) {
			return (
				<>
					{/* {getFeaturedAssets()} */}
					{getAssetsTable()}
				</>
			);
		} else {
			if (loading) {
				return <Loader />;
			} else return null;
		}
	}

	function getFeaturedAssets() {
		if (featuredAssets) {
			return (
				<div className={'background-wrapper'}>
					<div className={'view-wrapper max-cutoff'}>
						<AssetsGrid assets={featuredAssets} />
					</div>
				</div>
			);
		} else {
			return null;
		}
	}

	// TODO: assets={tableAssets}
	function getAssetsTable() {
		if (tableAssets) {
			return (
				<AssetsTable
					assets={assets}
					cursors={{
						next: null,
						previous: null,
					}}
					handleCursorFetch={(cursor: string | null) => console.log(cursor)}
					recordsPerPage={PAGINATOR}
					showPageNumbers={false}
					tableType={'list'}
					showNoResults={true}
				/>
			);
		} else {
			return null;
		}
	}

	return (
		<ReduxAssetsUpdate reduxCursor={REDUX_TABLES.contractAssets} cursorObject={CursorEnum.idGQL}>
			{getAssets()}
		</ReduxAssetsUpdate>
	);
}
