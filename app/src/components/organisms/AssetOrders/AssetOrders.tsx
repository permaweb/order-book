import React from 'react';
import { ReactSVG } from 'react-svg';

import { ORDERBOOK_CONTRACT, OrderBookPairOrderType } from 'permaweb-orderbook';

import { CURRENCY_ICONS } from 'helpers/config';
import { language } from 'helpers/language';
import { formatPrice } from 'helpers/utils';
import { CloseHandler } from 'wrappers/CloseHandler';

import * as S from './styles';
import { IProps } from './types';

export default function AssetOrders(props: IProps) {
	const [currentOrder, setCurrentOrder] = React.useState<OrderBookPairOrderType | null>(null);

	const [orders, setOrders] = React.useState<OrderBookPairOrderType[] | null>(null);

	const [remainingOrders, setRemainingOrders] = React.useState<OrderBookPairOrderType[] | null>(null);
	const [showDropdown, setShowDropdown] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (props.asset.orders && props.asset.orders.length) {
			setOrders(props.asset.orders.filter((order: OrderBookPairOrderType) => order.creator !== ORDERBOOK_CONTRACT));
		}
	}, [props.asset]);

	React.useEffect(() => {
		if (orders && orders.length) {
			setCurrentOrder(orders[0]);
		}
	}, [orders]);

	React.useEffect(() => {
		if (orders && orders.length && currentOrder) {
			const orderIndex = orders.findIndex((order: OrderBookPairOrderType) => order.id === currentOrder.id);
			if (orderIndex !== -1) {
				const newOrders = orders.filter((_: OrderBookPairOrderType, index: number) => {
					return index !== orderIndex;
				});
				setRemainingOrders(newOrders);
			}
		}
	}, [orders, currentOrder]);

	function handlePress(e: any) {
		e.stopPropagation();
		e.preventDefault();
		setShowDropdown(!showDropdown);
	}

	function handleChangeOrder(e: any, order: OrderBookPairOrderType) {
		e.stopPropagation();
		e.preventDefault();
		setCurrentOrder(order);
		setShowDropdown(!showDropdown);
	}

	return (
		<S.Wrapper>
			{currentOrder ? (
				<CloseHandler active={showDropdown} callback={() => setShowDropdown(false)} disabled={false}>
					<S.DropdownAction disabled={!remainingOrders || !remainingOrders.length} onClick={(e: any) => handlePress(e)}>
						<S.Currency>
							<p>
								{formatPrice(
									props.asset.data.id === ORDERBOOK_CONTRACT ? currentOrder.price * 1e6 : currentOrder.price
								)}
							</p>
							{currentOrder.currency && (
								<ReactSVG src={CURRENCY_ICONS[currentOrder.currency] ? CURRENCY_ICONS[currentOrder.currency] : ''} />
							)}
						</S.Currency>
					</S.DropdownAction>
					{showDropdown && remainingOrders && remainingOrders.length > 0 && (
						<S.Dropdown>
							{remainingOrders.map((order: OrderBookPairOrderType, index: number) => {
								return (
									<S.DropdownSubAction key={index} onClick={(e: any) => handleChangeOrder(e, order)}>
										<S.Currency>
											<p>{formatPrice(props.asset.data.id === ORDERBOOK_CONTRACT ? order.price * 1e6 : order.price)}</p>
											{order.currency && (
												<ReactSVG src={CURRENCY_ICONS[order.currency] ? CURRENCY_ICONS[order.currency] : ''} />
											)}
										</S.Currency>
									</S.DropdownSubAction>
								);
							})}
						</S.Dropdown>
					)}
				</CloseHandler>
			) : (
				<S.Message>
					<p>{language.noListings}</p>
				</S.Message>
			)}
		</S.Wrapper>
	);
}
