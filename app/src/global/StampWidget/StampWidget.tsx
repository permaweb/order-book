import React from 'react';
import { ReactSVG } from 'react-svg';
import Stamps from '@permaweb/stampjs';

import { Button } from 'components/atoms/Button';
import { FormField } from 'components/atoms/FormField';
import { Notification } from 'components/atoms/Notification';
import { Modal } from 'components/molecules/Modal';
import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';
import { ResponseType } from 'helpers/types';
import { formatFloat } from 'helpers/utils';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import * as S from './styles';
import { IProps } from './types';

function StampAction(props: {
	balance: number;
	handleSubmit: (amount: number) => void;
	handleClose: () => void;
	disabled: boolean;
}) {
	const [amount, setAmount] = React.useState<string>('0');

	const invalid = Number(amount) > props.balance;

	const [disabled, setDisabled] = React.useState<boolean>(false);

	function handleSubmit(e: any) {
		e.preventDefault();
		setDisabled(true);
		props.handleSubmit(Number(amount));
	}

	return (
		<S.SAContainer>
			<S.SAInfoContainer>
				<S.SABalanceContainer>
					<ReactSVG src={ASSETS.stamp.super} />
					<p>{formatFloat(props.balance, 2)}</p>
				</S.SABalanceContainer>
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
					/>
				</S.SAInput>
				<S.SAActions>
					<Button
						type={'alt1'}
						label={language.close}
						handlePress={(e: any) => {
							e.preventDefault();
							props.handleClose();
						}}
						disabled={false}
						formSubmit
						noMinWidth
					/>
					<Button
						type={'primary'}
						label={language.submit}
						handlePress={(e: any) => handleSubmit(e)}
						disabled={invalid || Number(amount) <= 0 || Number(amount) % 1 !== 0 || disabled || props.disabled}
						formSubmit
						noMinWidth
					/>
				</S.SAActions>
			</S.SAFormContainer>
		</S.SAContainer>
	);
}

export default function StampWidget(props: IProps) {
	const orProvider = useOrderBookProvider();

	const [stamps, setStamps] = React.useState<any>(null);

	const [count, setCount] = React.useState<any>(null);
	const [balance, setBalance] = React.useState<number>(0);
	const [hasStamped, setHasStamped] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState<boolean>(false);

	const [updateCount, setUpdateCount] = React.useState<boolean>(false);
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [disabled, setDisabled] = React.useState<boolean>(false);

	const [stampNotification, setStampNotification] = React.useState<ResponseType | null>(null);
	const [showStampAction, setShowStampAction] = React.useState<boolean>(false);

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

	React.useEffect(() => {
		(async function () {
			if (props.assetId) {
				try {
					setCount(await stamps.count(props.assetId));
					const hasStamped = await stamps.hasStamped(props.assetId);
					setHasStamped(hasStamped);
					if (hasStamped) {
						setDisabled(true);
					}
					setBalance(await stamps.balance());
				} catch {}
			}
		})();
	}, [stamps, props.assetId, updateCount]);

	function handleModalOpen(e: any) {
		e.preventDefault();
		setShowModal(true);
	}

	function handleModalClose() {
		setShowModal(false);
	}

	const handleStamp = React.useCallback(
		async (amount?: number) => {
			setLoading(true);
			if (props.assetId) {
				setDisabled(true);

				let stamp: any = await stamps.stamp(props.assetId, amount ? amount : 0, [{ name: '', value: '' }]);
				let stampSuccess = stamp && stamp.bundlrResponse && stamp.bundlrResponse.id;
				if (!stampSuccess) {
					stampSuccess = stamp && stamp.id;
				}

				setUpdateCount(!updateCount);

				if (!stampSuccess) {
					setDisabled(false);
				}

				setStampNotification({
					status: stampSuccess,
					message: stampSuccess ? language.assetStamped : language.errorOccurred,
				});
			}
			setLoading(false);
		},
		[stamps, updateCount, props]
	);

	function handleStampAction(amount: number) {
		handleStamp(amount);
	}

	return (
		<>
			<S.Wrapper onClick={handleModalOpen}>
				<p>{count ? count.total.toString() : '0'}</p>
				<ReactSVG src={ASSETS.stamps} />
			</S.Wrapper>
			{showModal && (
				<Modal header={props.title} handleClose={() => handleModalClose()}>
					<S.DetailLine>
						<span>{`${language.stampCount}:`}</span>
						<p>{count ? count.total.toString() : '0'}</p>
					</S.DetailLine>
					<S.DetailLine>
						<span>{`${language.stampsVouched}:`}</span>
						<p>{count ? count.vouched.toString() : '0'}</p>
					</S.DetailLine>
					<S.FlexActions>
						<Button
							type={'primary'}
							label={language.stamp}
							handlePress={(e: any) => {
								e.preventDefault();
								handleStamp();
							}}
							disabled={disabled}
							icon={ASSETS.stamp.default}
						/>
						<Button
							type={'alt2'}
							label={language.superStamp}
							handlePress={(e: any) => {
								e.preventDefault();
								setShowStampAction(!showStampAction);
							}}
							disabled={disabled}
							icon={ASSETS.stamp.super}
							width={180}
						/>
					</S.FlexActions>
					{showStampAction && (
						<StampAction
							balance={balance}
							handleClose={() => setShowStampAction(false)}
							handleSubmit={(amount: number) => handleStampAction(amount)}
							disabled={stampNotification !== null}
						/>
					)}
					{(hasStamped || loading) && (
						<S.Message loading={loading ? 'true' : 'false'}>
							<p>{hasStamped ? language.assetStamped : `${language.loading}...`}</p>
						</S.Message>
					)}
					{stampNotification && stampNotification.message && (
						<Notification
							message={stampNotification.message}
							type={stampNotification.status ? 'success' : 'warning'}
							callback={() => setStampNotification(null)}
						/>
					)}
				</Modal>
			)}
		</>
	);
}
