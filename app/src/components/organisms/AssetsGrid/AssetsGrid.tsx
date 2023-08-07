import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AssetType, getTxEndpoint, STORAGE } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { IconButton } from 'components/atoms/IconButton';
import { Loader } from 'components/atoms/Loader';
import { AssetData } from 'components/organisms/AssetData';
import { AssetOrders } from 'components/organisms/AssetOrders';
import { StampWidget } from 'components/organisms/StampWidget';
import { ASSETS } from 'helpers/config';
import { getRendererEndpoint } from 'helpers/endpoints';
import { language } from 'helpers/language';
import { AssetRenderType, ContentType } from 'helpers/types';
import * as urls from 'helpers/urls';

import * as S from './styles';
import { IProps } from './types';

function AssetTile(props: { asset: AssetType; index: number; autoLoad: boolean }) {
	const navigate = useNavigate();
	const redirect = `${urls.asset}${props.asset.data.id}`;

	const [assetRender, setAssetRender] = React.useState<AssetRenderType | null>(null);
	const [loadRenderer, setLoadRenderer] = React.useState<boolean>(false);

	React.useEffect(() => {
		(async function () {
			const renderWith =
				props.asset.data?.renderWith && props.asset.data.renderWith !== STORAGE.none
					? props.asset.data.renderWith
					: '[]';
			let parsedRenderWith: string | null = null;
			try {
				parsedRenderWith = JSON.parse(renderWith);
			} catch (e: any) {
				parsedRenderWith = renderWith;
			}
			if (parsedRenderWith && parsedRenderWith.length) {
				setAssetRender({
					url: getRendererEndpoint(parsedRenderWith, props.asset.data.id),
					type: 'renderer',
					contentType: 'renderer',
				});
			} else {
				const assetResponse = await fetch(getTxEndpoint(props.asset.data.id));
				const contentType = assetResponse.headers.get('content-type');
				if (assetResponse.status === 200 && contentType) {
					setAssetRender({
						url: assetResponse.url,
						type: 'raw',
						contentType: contentType as ContentType,
					});
				}
			}
		})();
	}, [props.asset]);

	return (
		<S.PICWrapper>
			<S.PCLink>
				<Link to={redirect} />
			</S.PCLink>
			<S.PCWrapper>
				<AssetData asset={props.asset} frameMinHeight={350} autoLoad={props.autoLoad} loadRenderer={loadRenderer} />
			</S.PCWrapper>
			<S.ICWrapper>
				<S.ICFlex>
					<S.AssetData>
						<Link to={redirect}>
							<p>{props.asset.data.title}</p>
						</Link>
					</S.AssetData>
					<IconButton
						type={'alt1'}
						src={ASSETS.details}
						handlePress={() => navigate(redirect)}
						tooltip={language.viewDetails}
						dimensions={{
							wrapper: 37.5,
							icon: 22.5,
						}}
					/>
				</S.ICFlex>
				<S.ICBottom>
					<S.AssetDataAlt>
						<AssetOrders asset={props.asset} />
					</S.AssetDataAlt>
					<S.ICWidgetIcons>
						{assetRender && assetRender.type === 'renderer' && !props.autoLoad && (
							<S.Icon>
								<Button
									type={'primary'}
									label={language.load}
									handlePress={() => setLoadRenderer(true)}
									tooltip={language.loadAssetData}
									noMinWidth
									height={37.5}
								/>
							</S.Icon>
						)}
						<StampWidget
							assetId={props.asset.data.id}
							title={props.asset.data.title}
							stamps={props.asset.stamps ? props.asset.stamps : null}
						/>
					</S.ICWidgetIcons>
				</S.ICBottom>
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
		if (!assets || props.loading) {
			const keys = Array.from({ length: props.loaderCount }, (_, i) => i + 1);
			const elements = keys.map((element) => (
				<S.PICWrapper key={`pic_${element}`}>
					<S.PCLoader key={`pc_${element}`}>
						<Loader placeholder />
					</S.PCLoader>
					<S.ICLoader key={`ic_${element}`}>
						<Loader placeholder />
					</S.ICLoader>
				</S.PICWrapper>
			));
			return <>{elements}</>;
		} else {
			if (assets) {
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
				return null;
			}
		}
	}

	return (
		<S.Wrapper>
			{props.title && (
				<S.Header>
					<S.Header1>
						<p>{props.title.toUpperCase()}</p>
					</S.Header1>
				</S.Header>
			)}
			{getData()}
		</S.Wrapper>
	);
}
