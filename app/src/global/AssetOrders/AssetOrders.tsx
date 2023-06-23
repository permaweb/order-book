import React from 'react';
import { ReactSVG } from 'react-svg';

import { OrderBookPairOrderType } from 'permaweb-orderbook';

import TEMP_FRACTION_SVG from 'assets/temp-fraction.svg';
import { ASSETS, CURRENCY_ICONS } from 'helpers/config';

import * as S from './styles';
import { IProps } from './types';

// TODO: get percentage
// TODO: set current order
export default function AssetOrders(props: IProps) {
	const [currentOrder, setCurrentOrder] = React.useState<OrderBookPairOrderType | null>(null);

	React.useEffect(() => {
		if (props.asset.orders && props.asset.orders.length) {
			setCurrentOrder(props.asset.orders[0]);
		}
	}, [props.asset]);

	function handlePress(e: any) {
		e.preventDefault();
		console.log('Set Current Order');
	}

	return currentOrder ? (
		<S.Wrapper>
			<S.DropdownAction onClick={(e: any) => handlePress(e)}>
				<S.Currency>
					<p>{currentOrder.price / 1e6}</p>
					{currentOrder.currency && (
						<ReactSVG src={CURRENCY_ICONS[currentOrder.currency] ? CURRENCY_ICONS[currentOrder.currency] : ''} />
					)}
				</S.Currency>
				<S.C2>
					<S.Percentage>
						<p>75%</p>
						<ReactSVG src={TEMP_FRACTION_SVG} />
					</S.Percentage>
					<ReactSVG src={ASSETS.arrowDown} />
				</S.C2>
			</S.DropdownAction>
		</S.Wrapper>
	) : null;
}
