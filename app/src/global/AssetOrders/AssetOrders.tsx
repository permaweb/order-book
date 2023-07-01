import React from 'react';
import { ReactSVG } from 'react-svg';

import { OrderBookPairOrderType } from 'permaweb-orderbook';

import { CURRENCY_ICONS } from 'helpers/config';
import { language } from 'helpers/language';
import { CloseHandler } from 'wrappers/CloseHandler';

import * as S from './styles';
import { IProps } from './types';

export default function AssetOrders(props: IProps) {
	const [currentOrder, setCurrentOrder] = React.useState<OrderBookPairOrderType | null>(null);
	const [remainingOrders, setRemainingOrders] = React.useState<OrderBookPairOrderType[] | null>(null);
	const [showDropdown, setShowDropdown] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (props.asset.orders && props.asset.orders.length) {
			setCurrentOrder(props.asset.orders[0]);
		}
	}, [props.asset]);

	React.useEffect(() => {
		if (props.asset.orders && props.asset.orders.length && currentOrder) {
			const orderIndex = props.asset.orders.findIndex((order: OrderBookPairOrderType) => order.id === currentOrder.id);
			if (orderIndex !== -1) {
				const newOrders = props.asset.orders.filter((_: OrderBookPairOrderType, index: number) => {
					return (
						index !== orderIndex
					)
				});
				setRemainingOrders(newOrders);
			}
		}
	}, [props.asset, currentOrder]);

	function handlePress(e: any) {
		e.preventDefault();
		setShowDropdown(!showDropdown);
	}

	function handleChangeOrder(e: any, order: OrderBookPairOrderType) {
		e.preventDefault();
		setCurrentOrder(order);
		setShowDropdown(!showDropdown);
	}

	return (
		<S.Wrapper>
			{currentOrder ? (
				<>
					<S.DropdownAction disabled={!remainingOrders || !remainingOrders.length} onClick={(e: any) => handlePress(e)}>
						<S.Currency>
							<p>{currentOrder.price / 1e6}</p>
							{currentOrder.currency && (
								<ReactSVG src={CURRENCY_ICONS[currentOrder.currency] ? CURRENCY_ICONS[currentOrder.currency] : ''} />
							)}
						</S.Currency>
						{/* <S.C2>{remainingOrders && remainingOrders.length > 0 && <ReactSVG src={ASSETS.arrowDown} />}</S.C2> */}
					</S.DropdownAction>
					{showDropdown && remainingOrders && remainingOrders.length > 0 && (
						<CloseHandler active={showDropdown} callback={() => setShowDropdown(false)} disabled={false}>
							<S.Dropdown>
								{remainingOrders.map((order: OrderBookPairOrderType, index: number) => {
									return (
										<S.DropdownSubAction key={index} onClick={(e: any) => handleChangeOrder(e, order)}>
											<S.Currency>
												<p>{order.price / 1e6}</p>
												{order.currency && (
													<ReactSVG src={CURRENCY_ICONS[order.currency] ? CURRENCY_ICONS[order.currency] : ''} />
												)}
											</S.Currency>
										</S.DropdownSubAction>
									);
								})}
							</S.Dropdown>
						</CloseHandler>
					)}
				</>
			) : (
				<S.Message>
					<p>{language.noListings}</p>
				</S.Message>
			)}
		</S.Wrapper>
	);
}
