import React from 'react';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { OrderCancel } from 'global/OrderCancel';
import { ASSETS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import * as urls from 'helpers/urls';
import { formatAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';

import * as S from './styles';

export default function OwnerInfo({ owner, asset, isSaleOrder, handleUpdate }) {
	const arProvider = useArweaveProvider();
	const redirect = `${urls.account}${owner.address}`;

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
						<Link to={redirect} />
					</S.ALink>
					<S.Avatar>{avatar}</S.Avatar>
				</S.AvatarWrapper>
				<Link to={redirect}>
					<S.NoWrap>{owner.handle ? owner.handle : formatAddress(owner.address, false)}</S.NoWrap>
				</Link>
				{getOwnerOrder() && (
					<S.OrderCancel>
						<OrderCancel asset={asset} handleUpdate={handleUpdate} />
					</S.OrderCancel>
				)}
			</S.DCLineHeader>
		</>
	);
}
