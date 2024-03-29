import React from 'react';

import { ActivityElementType } from 'permaweb-orderbook';

import { getActivity } from 'gql';

import { IAProps } from '../../../types';

import { AssetDetailActivityChart } from './AssetDetailActivityChart';
import { AssetDetailActivityMicroscope } from './AssetDetailActivityMicroscope';
import * as S from './styles';

export default function AssetDetailActivity(props: IAProps) {
	const [activity, setActivity] = React.useState<ActivityElementType[] | null>(null);

	React.useEffect(() => {
		(async function () {
			if (props.asset) {
				const activityFetch = await getActivity({ id: props.asset.data.id });
				setActivity(activityFetch.activity);
			}
		})();
	}, [props.asset]);

	return (
		<S.Wrapper>
			<AssetDetailActivityChart asset={props.asset} activity={activity} />
			<AssetDetailActivityMicroscope asset={props.asset} activity={activity} />
		</S.Wrapper>
	);
}
