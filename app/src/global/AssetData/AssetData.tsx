import React from 'react';

import * as OrderBook from 'permaweb-orderbook';

import { AssetRenderType, ContentType } from 'helpers/types';

import * as S from './styles';
import { IProps } from './types';

export default function AssetData(props: IProps) {
	const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

	const [assetRender, setAssetRender] = React.useState<AssetRenderType | null>(null);

    // TODO: add all raw types
	React.useEffect(() => {
		(async function () {
			const renderWith =
				props.asset.data?.renderWith && props.asset.data.renderWith !== OrderBook.STORAGE.none
					? props.asset.data.renderWith
					: '[]';
			const parsedRenderWith = JSON.parse(renderWith);
			if (parsedRenderWith.length) {
				setAssetRender({
					url: OrderBook.getRendererEndpoint(parsedRenderWith, props.asset.data.id),
					type: 'renderer',
					contentType: 'renderer',
				});
			} else {
				const assetResponse = await fetch(OrderBook.getTxEndpoint(props.asset.data.id));
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

	function getData() {
		if (assetRender) {
			switch (assetRender.type) {
				case 'renderer':
					return <S.Frame ref={iframeRef} src={assetRender.url} allowFullScreen />;
				case 'raw':
					switch (assetRender.contentType) {
						case 'image/png':
							return <S.Image src={assetRender.url} />;
						default:
							return null;
					}
				default:
					return null;
			}
		}
	}

	return <S.Wrapper>{getData()}</S.Wrapper>;
}
