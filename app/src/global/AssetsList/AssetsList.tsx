import React from 'react';

import { OrderBook, AssetType } from 'permaweb-orderbook';

import { Loader } from 'components/atoms/Loader';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';

import * as S from './styles';
import { IProps } from './types';

// TODO: add title
// TODO: add orders list
function AssetRow(props: { asset: AssetType }) {
	return <p>Asset Row</p>;
}

export default function AssetsList(props: IProps) {
	const [assets, setAssets] = React.useState<AssetType[] | null>(null);

	// TODO: filters
	React.useEffect(() => {
		if (props.assets) {
			setAssets(props.assets);
		}
	}, [props.assets]);

	function getData() {
		const keys = Array.from({ length: 3 }, (_, i) => i + 1);
		const elements = keys.map((element) => (
			<S.PICWrapper key={`pic_${element}`}>
				<S.PCWrapper key={`pc_${element}`}>
					<Loader placeholder />
				</S.PCWrapper>
			</S.PICWrapper>
		));
		return <>{elements}</>;

		// if (assets) {
		// 	if (assets.length > 0) {
		// 		return assets.map((asset: AssetType) => {
		// 			return <AssetRow asset={asset} key={asset.data.id} />;
		// 		});
		// 	} else {
		// 		return (
		// 			<S.NoAssetsContainer>
		// 				<p>{language.noAssets}</p>
		// 			</S.NoAssetsContainer>
		// 		);
		// 	}
		// } else {
		// 	// TODO: get count
		// 	const keys = Array.from({ length: 3 }, (_, i) => i + 1);
		// 	const elements = keys.map((element) => (
		// 		<S.PICWrapper key={`pic_${element}`}>
		// 			<S.PCWrapper key={`pc_${element}`}>
		// 				<Loader placeholder />
		// 			</S.PCWrapper>
		// 		</S.PICWrapper>
		// 	));
		// 	return <>{elements}</>;
		// }
	}

	return (
		<div className={'view-wrapper max-cutoff'}>
			<S.Wrapper>{getData()}</S.Wrapper>
		</div>
	);
}
