import React from 'react';
import { ReactSVG } from 'react-svg';
import Stamps from '@permaweb/stampjs';

import { Button } from 'components/atoms/Button';
import { FormField } from 'components/atoms/FormField';
import { IconButton } from 'components/atoms/IconButton';
import { Modal } from 'components/molecules/Modal';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import * as S from './styles';
import { IProps } from './types';

function StampAction(props: { balance: number; handleSubmit: (amount: number) => void; handleClose: () => void }) {
	const [amount, setAmount] = React.useState<string>('0');

	const invalid = Number(amount) > props.balance;

	return (
		<S.SAContainer>
			<S.SAInfoContainer>
				<S.SABalanceContainer>
					<ReactSVG src={ASSETS.stamp.super} />
					<p>{props.balance}</p>
				</S.SABalanceContainer>
				<S.SACloseContainer>
					<IconButton type={'primary'} sm warning src={ASSETS.close} handlePress={props.handleClose} />
				</S.SACloseContainer>
			</S.SAInfoContainer>
			<S.SAFormContainer onSubmit={() => props.handleSubmit(Number(amount))}>
				<S.SAInput>
					<FormField
						type={'number'}
						value={amount}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
						disabled={false}
						invalid={{
							status: invalid,
							message: invalid ? language.amountExceedsBalance : null,
						}}
						sm
					/>
				</S.SAInput>
				<S.SASubmit>
					<Button
						type={'alt1'}
						label={'Submit'}
						handlePress={() => props.handleSubmit(Number(amount))}
						disabled={invalid || Number(amount) <= 0 || Number(amount) % 1 !== 0}
						formSubmit
						noMinWidth
					/>
				</S.SASubmit>
			</S.SAFormContainer>
		</S.SAContainer>
	);
}

export default function StampWidget(props: IProps) {
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [disabled, setDisabled] = React.useState<boolean>(false);
	const [count, setCount] = React.useState<any>(null);
	const [updateCount, setUpdateCount] = React.useState<boolean>(false);
	const [stamps, setStamps] = React.useState<any>(null);
	const [stampNotification, setStampNotification] = React.useState<any>(null);
	const [showStampAction, setShowStampAction] = React.useState<boolean>(false);
	const [balance, setBalance] = React.useState<number>(0);

	const orProvider = useOrderBookProvider();

	// TODO: add
	React.useEffect(() => {
		if (orProvider.orderBook) {
			setStamps(
				Stamps.init({
					warp: orProvider.orderBook.env.arClient.warpDefault,
					arweave: orProvider.orderBook.env.arClient.arweavePost,
				})
			);
		}
	}, [orProvider.orderBook]);

	// React.useEffect(() => {
	// 	(async function () {
	// 		if (props.assetId) {
	// 			try {
	// 				setCount(await stamps.count(props.assetId));
	// 				const hasStamped = await stamps.hasStamped(props.assetId);
	// 				if (hasStamped) {
	// 					setDisabled(true);
	// 				}
	// 				setBalance(await stamps.balance());
	// 			} catch {}
	// 		}
	// 	})();
	// }, [stamps, props.assetId, updateCount]);

	function handleModalOpen(event: any) {
		event.preventDefault();
		setShowModal(true);
	}

	function handleModalClose() {
		setShowModal(false);
	}

	const handleStamp = React.useCallback(
		async (amount?: number) => {
			if (props.assetId) {
				setDisabled(true);

				let stamp: any = await stamps.stamp(props.assetId, amount ? amount : 0, [{ name: '', value: '' }]);
				let stampSuccess = stamp && stamp.bundlrResponse && stamp.bundlrResponse.id;
				if (!stampSuccess) {
					// response different in firefox it seemed
					stampSuccess = stamp && stamp.id;
				}

				setUpdateCount(!updateCount);

				if (!stampSuccess) {
					setDisabled(false);
				}

				setStampNotification({
					status: stampSuccess ? 200 : 500,
					message: stampSuccess ? language.assetStamped : language.errorOccurred,
				});
			}
		},
		[stamps, updateCount, props]
	);

	function handleStampAction(amount: number) {
		handleStamp(amount);
		setShowStampAction(false);
	}

	return (
		<>
			<S.Wrapper onClick={handleModalOpen}>
				<p>{count ? count.total.toString() : '0'}</p>
				<div className={'s-divider'} />
				<ReactSVG src={ASSETS.stamps} />
			</S.Wrapper>
			{showModal && (
				<Modal header={language.stampCount} handleClose={() => handleModalClose()}>
					{showStampAction && (
						<StampAction
							balance={balance}
							handleClose={() => setShowStampAction(false)}
							handleSubmit={(amount: number) => handleStampAction(amount)}
						/>
					)}
					<S.ButtonWrapper>
						<IconButton
							type={'alt1'}
							src={ASSETS.stamp.default}
							handlePress={() => handleStamp()}
							disabled={disabled}
							info={count ? count.total.toString() : '0'}
							tooltip={language.stampCount}
						/>

						<IconButton
							type={'alt1'}
							src={ASSETS.stamp.super}
							handlePress={() => setShowStampAction(!showStampAction)}
							disabled={disabled || showStampAction}
							tooltip={language.superStamp}
						/>

						<IconButton
							type={'alt3'}
							src={ASSETS.stamp.vouched}
							handlePress={null}
							disabled={true}
							info={count ? count.vouched.toString() : '0'}
							tooltip={language.stampsVouched}
						/>
					</S.ButtonWrapper>
					{stampNotification && <S.NotifWrapper>{stampNotification.message}</S.NotifWrapper>}
				</Modal>
			)}
		</>
	);
}
