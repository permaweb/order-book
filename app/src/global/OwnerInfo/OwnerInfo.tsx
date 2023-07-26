import React from 'react';
import { ReactSVG } from 'react-svg';

import { TxAddress } from 'components/atoms/TxAddress';
import { OrderCancel } from 'global/OrderCancel';
import { ASSETS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { useArweaveProvider } from 'providers/ArweaveProvider';

import * as S from './styles';

export default function OwnerInfo({ owner, asset, isSaleOrder, updateAsset }) {
	const arProvider = useArweaveProvider();

	const [hasError, setHasError] = React.useState(false);

	const handleError = () => {
		setHasError(true);
	};

	const avatar =
		!hasError && owner.avatar ? (
			<S.Avatar>
				<img src={getTxEndpoint(owner.avatar)} onError={handleError} />
			</S.Avatar>
		) : (
			<S.Avatar>
				<ReactSVG src={ASSETS.user} />
			</S.Avatar>
		);

	function getOwnerOrder() {
		if (!arProvider.walletAddress || !isSaleOrder) return false;
		if (asset && asset.orders && asset.orders.length) {
			for (let i = 0; i < asset.orders.length; i++) {
				if (owner.address === arProvider.walletAddress && asset.orders[i].creator === arProvider.walletAddress) {
					return true;
				}
			}
		}
		return false;
	}

	return (
		<>
			<S.DCLineHeader>
				{avatar}
				{owner.handle ? <S.NoWrap>{owner.handle}</S.NoWrap> : <TxAddress address={owner.address} wrap={false} />}
				{getOwnerOrder() && (
					<S.OrderCancel hasHandle={owner.handle !== null}>
						<OrderCancel asset={asset} updateAsset={updateAsset} />
					</S.OrderCancel>
				)}
			</S.DCLineHeader>
		</>
	);
}
