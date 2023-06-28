import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { AssetType, STORAGE } from 'permaweb-orderbook';

import { IconButton } from 'components/atoms/IconButton';
import { Loader } from 'components/atoms/Loader';
import { AssetData } from 'global/AssetData';
import { AssetOrders } from 'global/AssetOrders';
import { StampWidget } from 'global/StampWidget';
import { ASSETS, FEATURE_COUNT } from 'helpers/config';
import { language } from 'helpers/language';
import * as urls from 'helpers/urls';

import * as S from './styles';
import { IProps } from './types';

function AssetTile(props: { asset: AssetType; index: number; autoLoad: boolean }) {
	const navigate = useNavigate();
	return (
		<S.PICWrapper>
			<S.HCWrapper>
				{/* <ReactSVG src={TEMP_FRACTION_SVG} /> */}
				{props.asset.data.renderWith && props.asset.data.renderWith !== STORAGE.none && (
					<S.RendererSVG>
						<ReactSVG src={ASSETS.renderer} />
					</S.RendererSVG>
				)}
				<StampWidget assetId={props.asset.data.id} />
			</S.HCWrapper>
			<S.PCWrapper>
				<AssetData asset={props.asset} frameMinHeight={350} autoLoad={props.autoLoad} />
			</S.PCWrapper>
			<S.ICWrapper>
				<S.ICFlex>
					<S.AssetData>
						<span>{props.index}</span>
						<div className={'a-divider'} />
						<p>{props.asset.data.title}</p>
					</S.AssetData>
					<IconButton
						type={'alt1'}
						src={ASSETS.details}
						handlePress={() => navigate(`${urls.asset}${props.asset.data.id}`)}
						dimensions={{
							wrapper: 50,
							icon: 25,
						}}
					/>
				</S.ICFlex>
				{props.asset.orders && (
					<S.AssetDataAlt>
						<span>{language.listing}</span>
						<div className={'a-divider'} />
						{props.asset.orders.length > 0 ? <AssetOrders asset={props.asset} /> : <p>{language.none}</p>}
					</S.AssetDataAlt>
				)}
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
				return assets.map((asset: AssetType, index: number) => {
					return <AssetTile key={asset.data.id} asset={asset} index={index + 1} autoLoad={props.autoLoad} />;
				});
			} else {
				return null;
			}
		} else {
			const keys = Array.from({ length: FEATURE_COUNT }, (_, i) => i + 1);
			const elements = keys.map((element) => (
				<S.PICWrapper key={`pic_${element}`}>
					<S.HCLoader key={`hc_${element}`}>
						<Loader placeholder />
					</S.HCLoader>
					<S.PCWrapper key={`pc_${element}`}>
						<Loader placeholder />
					</S.PCWrapper>
					<S.ICLoader key={`ic_${element}`}>
						<Loader placeholder />
					</S.ICLoader>
				</S.PICWrapper>
			));
			return <>{elements}</>;
		}
	}

	return <S.Wrapper>{getData()}</S.Wrapper>;
}
