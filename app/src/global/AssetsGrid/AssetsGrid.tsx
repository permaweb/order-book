import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { AssetType, STORAGE } from 'permaweb-orderbook';

import { IconButton } from 'components/atoms/IconButton';
import { Loader } from 'components/atoms/Loader';
import { AssetData } from 'global/AssetData';
import { AssetOrders } from 'global/AssetOrders';
import { StampWidget } from 'global/StampWidget';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import * as urls from 'helpers/urls';

import * as S from './styles';
import { IProps } from './types';

function AssetTile(props: { asset: AssetType; index: number; autoLoad: boolean }) {
	const navigate = useNavigate();
	return (
		<S.PICWrapper>
			<S.HCWrapper>
				<S.Index>
					<p>{props.index}</p>
				</S.Index>
				<S.HCEnd>
					{props.asset.data.renderWith && props.asset.data.renderWith !== STORAGE.none && (
						<S.RendererSVG>
							<ReactSVG src={ASSETS.renderer} />
						</S.RendererSVG>
					)}
					<StampWidget
						assetId={props.asset.data.id}
						title={props.asset.data.title}
						stamps={props.asset.stamps ? props.asset.stamps : null}
					/>
				</S.HCEnd>
			</S.HCWrapper>
			<S.PCWrapper>
				<AssetData asset={props.asset} frameMinHeight={350} autoLoad={props.autoLoad} />
			</S.PCWrapper>
			<S.ICWrapper>
				<S.ICFlex>
					<S.AssetData>
						<p>{props.asset.data.title}</p>
					</S.AssetData>
					<IconButton
						type={'primary'}
						src={ASSETS.details}
						handlePress={() => navigate(`${urls.asset}${props.asset.data.id}`)}
						tooltip={language.viewDetails}
					/>
				</S.ICFlex>
				<S.AssetDataAlt>
					<AssetOrders asset={props.asset} />
				</S.AssetDataAlt>
			</S.ICWrapper>
		</S.PICWrapper>
	);
}

export default function AssetsGrid(props: IProps) {
	const [assets, setAssets] = React.useState<AssetType[] | null>(null);

	React.useEffect(() => {
		if (props.assets) {
			setAssets(props.assets);
		}
	}, [props.assets]);

	function getData() {
		if (assets && !props.loading) {
			if (assets.length > 0) {
				return assets.map((asset: AssetType, index: number) => {
					return <AssetTile key={asset.data.id} asset={asset} index={index + 1} autoLoad={props.autoLoad} />;
				});
			} else {
				return (
					<div className={'view-wrapper max-cutoff'}>
						<S.NoAssetsContainer>
							<p>{language.noAssets}</p>
						</S.NoAssetsContainer>
					</div>
				);
			}
		} else {
			const keys = Array.from({ length: props.loaderCount }, (_, i) => i + 1);
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
