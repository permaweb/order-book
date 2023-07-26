import React from 'react';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { TxAddress } from 'components/atoms/TxAddress';
import { OrderCancel } from 'global/OrderCancel';
import { ASSETS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import * as urls from 'helpers/urls';
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
			<img src={getTxEndpoint(owner.avatar)} onError={handleError} />
		) : (
			<ReactSVG src={ASSETS.user} />
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
				<S.AvatarWrapper>
					<S.ALink>
						<Link to={`${urls.account}${owner.address}`} />
					</S.ALink>
					<S.Avatar>{avatar}</S.Avatar>
				</S.AvatarWrapper>
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
