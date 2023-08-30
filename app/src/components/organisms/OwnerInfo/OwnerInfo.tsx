import React from 'react';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { Loader } from 'components/atoms/Loader';
import { OrderCancel } from 'components/organisms/OrderCancel';
import { AR_PROFILE, ASSETS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import * as urls from 'helpers/urls';
import { formatAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';

import * as S from './styles';
import { IProps } from './types';

export default function OwnerInfo(props: IProps) {
	const arProvider = useArweaveProvider();

	const [hasError, setHasError] = React.useState(false);
	const [redirect, setRedirect] = React.useState<string | null>(null);

	React.useEffect(() => {
		function getAddress() {
			if (props.owner.address) return props.owner.address;
			else if (props.owner.walletAddress) return props.owner.walletAddress;
			else return null;
		}
		if (props.owner) setRedirect(`${urls.account}${getAddress()}`);
	}, [props.owner]);

	const handleError = () => {
		setHasError(true);
	};

	const avatar =
		!hasError && props.owner && props.owner.avatar && props.owner.avatar !== AR_PROFILE.defaultAvatar ? (
			<img src={getTxEndpoint(props.owner.avatar)} onError={handleError} />
		) : (
			<ReactSVG src={ASSETS.user} />
		);

	function getOwnerOrder() {
		if (!arProvider.walletAddress || !props.isSaleOrder) return false;
		if (props.owner && props.asset && props.asset.orders && props.asset.orders.length) {
			for (let i = 0; i < props.asset.orders.length; i++) {
				if (
					props.owner.address === arProvider.walletAddress &&
					props.asset.orders[i].creator === arProvider.walletAddress
				) {
					return true;
				}
			}
		}
		return false;
	}

	function getLabel() {
		if (props.owner) {
			if (props.owner.handle) return `${props.owner.handle}`;
			else return `${formatAddress(props.owner.address, false)}`;
		} else return null;
	}

	return props.owner && !props.loading ? (
		<S.DCLineHeader>
			<S.AvatarWrapper>
				<S.ALink>
					<Link onClick={() => (props.useCallback ? props.useCallback() : {})} to={redirect} />
				</S.ALink>
				<S.Avatar>{avatar}</S.Avatar>
			</S.AvatarWrapper>
			<Link onClick={() => (props.useCallback ? props.useCallback() : {})} to={redirect}>
				<S.NoWrap>{getLabel()}</S.NoWrap>
			</Link>
			{getOwnerOrder() && !props.hideOrderCancel && (
				<S.OrderCancel>
					<OrderCancel asset={props.asset} handleUpdate={props.handleUpdate} />
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
