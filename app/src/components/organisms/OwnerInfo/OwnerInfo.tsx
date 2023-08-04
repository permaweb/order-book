import React from 'react';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { Loader } from 'components/atoms/Loader';
import { OrderCancel } from 'components/organisms/OrderCancel';
import { ASSETS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import * as urls from 'helpers/urls';
import { formatAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';

import * as S from './styles';

export default function OwnerInfo({ owner, asset, isSaleOrder, handleUpdate, loading }) {
	const arProvider = useArweaveProvider();

	const [hasError, setHasError] = React.useState(false);
	const [redirect, setRedirect] = React.useState<string | null>(null);

	React.useEffect(() => {
		function getAddress() {
			if (owner.address) return owner.address;
			else if (owner.walletAddress) return owner.walletAddress;
			else return null;
		}
		if (owner) setRedirect(`${urls.account}${getAddress()}`);
	}, [owner]);

	const handleError = () => {
		setHasError(true);
	};

	const avatar =
		!hasError && owner && owner.avatar ? (
			<img src={getTxEndpoint(owner.avatar)} onError={handleError} />
		) : (
			<ReactSVG src={ASSETS.user} />
		);

	function getOwnerOrder() {
		if (!arProvider.walletAddress || !isSaleOrder) return false;
		if (owner && asset && asset.orders && asset.orders.length) {
			for (let i = 0; i < asset.orders.length; i++) {
				if (owner.address === arProvider.walletAddress && asset.orders[i].creator === arProvider.walletAddress) {
					return true;
				}
			}
		}
		return false;
	}

	return owner && !loading ? (
		<S.DCLineHeader>
			<S.AvatarWrapper>
				<S.ALink>
					<Link to={redirect} />
				</S.ALink>
				<S.Avatar>{avatar}</S.Avatar>
			</S.AvatarWrapper>
			<Link to={redirect}>
				<S.NoWrap>{owner && owner.handle ? owner.handle : formatAddress(owner.address, false)}</S.NoWrap>
			</Link>
			{getOwnerOrder() && (
				<S.OrderCancel>
					<OrderCancel asset={asset} handleUpdate={handleUpdate} />
				</S.OrderCancel>
			)}
		</S.DCLineHeader>
	) : (
		<S.DCLineHeader>
			<S.AvatarWrapper>
				<S.Avatar>
					<Loader placeholder />
				</S.Avatar>
			</S.AvatarWrapper>
			<S.OLoader>
				<Loader placeholder />
			</S.OLoader>
		</S.DCLineHeader>
	);
}
