import { ReactSVG } from 'react-svg';
import Stamps from '@permaweb/stampjs';

import { ASSETS } from 'helpers/config';

import { Modal } from 'components/molecules/Modal';
import * as S from './styles';
import { IProps } from './types';
import { language } from 'helpers/language';
import React from 'react';
import { IconButton } from 'components/atoms/IconButton';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';


export default function StampWidget(props: IProps) {
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [disabled, setDisabled] = React.useState<boolean>(false);
	const [count, setCount] = React.useState<any>(null);
	const [updateCount, setUpdateCount] = React.useState<boolean>(false);
	const [stamps, setStamps] = React.useState<any>(null);
	const [stampNotification, setStampNotification] = React.useState<any>(null);

	const orProvider = useOrderBookProvider();

	React.useEffect(() => {
		if(orProvider.orderBook) {
			setStamps(
				Stamps.init({ 
					warp: orProvider.orderBook.env.arClient.warpDefault, 
					arweave: orProvider.orderBook.env.arClient.arweavePost 
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
					if (hasStamped) {
						setDisabled(true);
					}
				} catch {}
			}
		})();
	}, [stamps, props.assetId, updateCount]);

	function handleModalOpen(event: any) {
		event.preventDefault();
		setShowModal(true);
	}

	function handleModalClose () {
		setShowModal(false);
	}

	const handleStamp = React.useCallback(
		async (amount?: number) => {
			if (props.assetId) {
				setDisabled(true);

				let stamp: any = await stamps.stamp(
					props.assetId, 
					amount ? amount : 0, 
					[{ name: '', value: '' }]
				);
				let stampSuccess = stamp && stamp.bundlrResponse && stamp.bundlrResponse.id;
				if(!stampSuccess){
					// response different in firefox it seemed
					stampSuccess = stamp && stamp.id;
				}
				
				setUpdateCount(!updateCount);

				if(!stampSuccess) {
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

	return (
		<>
			<S.Wrapper onClick={handleModalOpen}>
				<p>{count ? count.total.toString() : '0'}</p>
				<div className={'s-divider'} />
				<ReactSVG src={ASSETS.stamps} />
			</S.Wrapper>
			{showModal && (
				<Modal
					header={language.stampCount}
					handleClose={() => handleModalClose()}
				>
					<S.ButtonWrapper>
						<IconButton
							type={'alt1'}
							src={ASSETS.stamp.default}
							handlePress={() => handleStamp()}
							disabled={disabled}
							info={count ? count.total.toString() : '0'}
							tooltip={language.stampCount}
						/>

						{/* <IconButton
							type={'alt1'}
							src={ASSETS.stamp.super}
							handlePress={() => setShowStampAction(!showStampAction)}
							disabled={disabled || balance <= 0 || showStampAction}
							tooltip={language.superStamp}
						/> */}

						<IconButton
							type={'alt3'}
							src={ASSETS.stamp.vouched}
							handlePress={null}
							disabled={true}
							info={count ? count.vouched.toString() : '0'}
							tooltip={language.stampsVouched}
						/> 
					</S.ButtonWrapper>
					{stampNotification && 
						<S.NotifWrapper>
							{stampNotification.message}
						</S.NotifWrapper>
					}
				</Modal>
			)}
		</>
	);
}
