import React from 'react';

import { ActivityElementType } from 'permaweb-orderbook';

import { useOrderBookProvider } from 'providers/OrderBookProvider';

import { IAProps } from '../../../types';

import { AssetDetailActivityChart } from './AssetDetailActivityChart';
import * as S from './styles';

export default function AssetDetailActivity(props: IAProps) {
	const orProvider = useOrderBookProvider();

	const [activity, setActivity] = React.useState<ActivityElementType[] | null>(null);

	React.useEffect(() => {
		(async function () {
			if (props.asset && orProvider) {
				const activityFetch = await orProvider.orderBook.api.getActivity({ id: props.asset.data.id });
				setActivity(activityFetch.activity);
			}
		})();
	}, [props.asset]);

	return (
		<S.Wrapper className={'border-wrapper'}>
			<AssetDetailActivityChart asset={props.asset} activity={activity} />
		</S.Wrapper>
	);
}
