import React from 'react';
import { ReactSVG } from 'react-svg';

import * as OrderBook from 'permaweb-orderbook';

import { ASSETS } from 'helpers/config';
import { getRendererEndpoint, getTxEndpoint } from 'helpers/endpoints';
import { AssetRenderType, ContentType } from 'helpers/types';

import * as S from './styles';
import { IProps } from './types';

export default function AssetData(props: IProps) {
	const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

	const [assetRender, setAssetRender] = React.useState<AssetRenderType | null>(null);

	const [loadError, setLoadError] = React.useState<boolean>(false);

	const handleError = () => {
		setLoadError(true);
	};

	React.useEffect(() => {
		(async function () {
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
						url: assetResponse.url,
						type: 'raw',
						contentType: contentType as ContentType,
					});
				}
			}
		})();
	}, [props.asset]);

	function getUnsupportedWrapper() {
		return (
			<S.UnsupportedWrapper>
				<ReactSVG src={ASSETS.unsupported} />
			</S.UnsupportedWrapper>
		);
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
											{ type: 'setHeight', height: `${props.frameMinHeight}px` },
											'*'
										);
									}
								}}
							/>
						) : (
							<S.FramePreview>
								<ReactSVG src={ASSETS.renderer} />
							</S.FramePreview>
						);
					} else {
						return (
							<S.Preview>
								<ReactSVG src={ASSETS.renderer} />
							</S.Preview>
						);
					}
				case 'raw':
					if (loadError) {
						return getUnsupportedWrapper();
					}
					if (assetRender.contentType.includes('html')) {
						return <S.Frame src={assetRender.url} ref={iframeRef} allowFullScreen onError={handleError} />;
					}
					if (assetRender.contentType.includes('image')) {
						return <S.Image src={assetRender.url} onError={handleError} />;
					}
					if (assetRender.contentType.includes('audio')) {
						return (
							<S.AudioWrapper>
								<ReactSVG src={ASSETS.audio} />
								<S.Audio controls onError={handleError}>
									<source src={assetRender.url} type={assetRender.contentType} />
								</S.Audio>
							</S.AudioWrapper>
						);
					}
					if (assetRender.contentType.includes('video')) {
						return (
							<S.Video controls onError={handleError}>
								<source src={assetRender.url} type={assetRender.contentType} />
							</S.Video>
						);
					} else {
						return getUnsupportedWrapper();
					}
				default:
					return getUnsupportedWrapper();
			}
		}
	}

	return <S.Wrapper>{getData()}</S.Wrapper>;
}
