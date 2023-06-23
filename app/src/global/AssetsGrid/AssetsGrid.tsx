import React from 'react';

import { AssetType, OrderBook } from 'permaweb-orderbook';

import { ButtonLink } from 'components/atoms/ButtonLink';
import { Loader } from 'components/atoms/Loader';
import { AssetData } from 'global/AssetData';
import { ASSETS, FEATURE_COUNT } from 'helpers/config';
import { language } from 'helpers/language';
import * as urls from 'helpers/urls';

import * as S from './styles';
import { IProps } from './types';

// TODO: add title
// TODO: add orders list
function AssetTile(props: { asset: AssetType }) {
	return (
		<S.PICWrapper>
			<S.HCWrapper>

			</S.HCWrapper>
			<S.PCWrapper>
				<AssetData asset={props.asset} />
			</S.PCWrapper>
			<S.ICWrapper>
				<S.ICFlex>
					<S.AssetData>
						<span># 1</span>
						<p>{props.asset.data.title}</p>
					</S.AssetData>
				</S.ICFlex>
				{/* <S.AssetPrice></S.AssetPrice>
				<ButtonLink
					type={'primary'}
					label={language.details}
					href={`${urls.asset}${props.asset.data.id}`}
					icon={ASSETS.details}
					iconLeftAlign
					noMinWidth
				/> */}
			</S.ICWrapper>
		</S.PICWrapper>
	);
}

export default function AssetsGrid(props: IProps) {
	const [assets, setAssets] = React.useState<AssetType[] | null>(null);

	// TODO: filters
	React.useEffect(() => {
		if (props.assets) {
			setAssets(props.assets);
		}
	}, [props.assets]);

	function getData() {
		if (assets) {
			if (assets.length > 0) {
				return assets.map((asset: AssetType) => {
					return <AssetTile asset={asset} key={asset.data.id} />;
				});
			} else {
				return (
					<S.NoAssetsContainer>
						<p>{language.noAssets}</p>
					</S.NoAssetsContainer>
				);
			}
		} else {
			// TODO: get count
			const keys = Array.from({ length: FEATURE_COUNT }, (_, i) => i + 1);
			const elements = keys.map((element) => (
				<S.PICWrapper key={`pic_${element}`}>
					<S.PCWrapper key={`pc_${element}`}>
						<Loader placeholder />
					</S.PCWrapper>
					<S.ICWrapper key={`ic_${element}`} />
				</S.PICWrapper>
			));
			return <>{elements}</>;
		}
	}

	return (
		<div className={'view-wrapper max-cutoff'}>
			<S.Wrapper>{getData()}</S.Wrapper>
		</div>
	);
}
