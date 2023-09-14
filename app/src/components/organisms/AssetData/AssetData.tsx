import React from 'react';
import { ReactSVG } from 'react-svg';

import * as OrderBook from 'permaweb-orderbook';

import { ASSETS, ORDERBOOK_ASSET_PATH, STAMP_ASSET_PATH } from 'helpers/config';
import { getRendererEndpoint, getTxEndpoint } from 'helpers/endpoints';
import { AssetRenderType, ContentType } from 'helpers/types';
import { checkAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';

import * as S from './styles';
import { IProps } from './types';

export default function AssetData(props: IProps) {
	const arProvider = useArweaveProvider();

	const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

	const [assetRender, setAssetRender] = React.useState<AssetRenderType | null>(null);

	const [loadError, setLoadError] = React.useState<boolean>(false);

	function getAssetPath(assetResponse: any) {
		if (props.asset) {
			if (props.asset.data.id === OrderBook.ORDERBOOK_CONTRACT) return ORDERBOOK_ASSET_PATH;
			if (props.asset.data.id === OrderBook.STAMP_CONTRACT) return STAMP_ASSET_PATH;
			return assetResponse.url;
		} else return '';
	}

	React.useEffect(() => {
		(async function () {
			if (props.asset) {
				const renderWith =
					props.asset.data?.renderWith && props.asset.data.renderWith !== OrderBook.STORAGE.none
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
							url: getAssetPath(assetResponse),
							type: 'raw',
							contentType: props.asset.data.id === OrderBook.STAMP_CONTRACT ? 'image' : (contentType as ContentType),
						});
					}
				}
			}
		})();
	}, [props.asset]);

	React.useEffect(() => {
		function sendWalletConnection() {
			if (iframeRef && iframeRef.current) {
				iframeRef.current.contentWindow.postMessage(
					{
						type: 'setHeight',
						height: `${props.frameMinHeight}px`,
						walletConnection: arProvider.walletAddress ? 'connected' : 'none',
					},
					'*'
				);
			}
		}

		sendWalletConnection();
	}, [arProvider.walletAddress]);

	const handleError = () => {
		setLoadError(true);
	};

	function getUnsupportedWrapper() {
		return (
			<S.UnsupportedWrapper>
				<ReactSVG src={ASSETS.unsupported} />
			</S.UnsupportedWrapper>
		);
	}

	function getRendererIcon() {
		if (props.asset && props.asset.data) {
			if (
				props.asset.data.thumbnail &&
				props.asset.data.thumbnail !== OrderBook.STORAGE.none &&
				checkAddress(props.asset.data.thumbnail)
			) {
				return <img src={getTxEndpoint(props.asset.data.thumbnail)} />;
			} else {
				return <ReactSVG src={ASSETS.renderer} />;
			}
		}
		return <ReactSVG src={ASSETS.renderer} />;
	}

	function getData() {
		if (assetRender) {
			switch (assetRender.type) {
				case 'renderer':
					if (!props.preview) {
						return props.loadRenderer || props.autoLoad ? (
							<S.Frame
								ref={iframeRef}
								src={assetRender.url}
								allowFullScreen
								onLoad={() => {
									if (iframeRef.current && iframeRef.current.contentWindow && props.frameMinHeight) {
										iframeRef.current.contentWindow.postMessage(
											{
												type: 'setHeight',
												height: `${props.frameMinHeight}px`,
												walletConnection: arProvider.walletAddress ? 'connected' : 'none',
											},
											'*'
										);
									}
								}}
								onError={handleError}
							/>
						) : (
							<S.FramePreview>{getRendererIcon()}</S.FramePreview>
						);
					} else {
						return <S.Preview>{getRendererIcon()}</S.Preview>;
					}
				case 'raw':
					if (loadError) {
						return getUnsupportedWrapper();
					}
					if (assetRender.contentType.includes('html')) {
						if (!props.preview && props.autoLoad)
							return <S.Frame src={assetRender.url} ref={iframeRef} allowFullScreen onError={handleError} />;
						else {
							return (
								<S.Preview>
									<ReactSVG src={ASSETS.html} />
								</S.Preview>
							);
						}
					}
					if (assetRender.contentType.includes('image')) {
						return <S.Image src={assetRender.url} onError={handleError} />;
					}
					if (assetRender.contentType.includes('audio')) {
						if (!props.preview) {
							return (
								<S.AudioWrapper>
									<ReactSVG src={ASSETS.audio} />
									<S.Audio controls onError={handleError}>
										<source src={assetRender.url} type={assetRender.contentType} />
									</S.Audio>
								</S.AudioWrapper>
							);
						} else {
							return (
								<S.Preview>
									<ReactSVG src={ASSETS.audio} />
								</S.Preview>
							);
						}
					}
					if (assetRender.contentType.includes('video')) {
						if (!props.preview && props.autoLoad) {
							return (
								<S.Video controls onError={handleError}>
									<source src={assetRender.url} type={assetRender.contentType} />
								</S.Video>
							);
						} else {
							return (
								<S.Preview>
									<ReactSVG src={ASSETS.video} />
								</S.Preview>
							);
						}
					} else {
						return getUnsupportedWrapper();
					}
				default:
					return getUnsupportedWrapper();
			}
		} else return null;
	}

	return <S.Wrapper>{getData()}</S.Wrapper>;
}
