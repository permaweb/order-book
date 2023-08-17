import React from 'react';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import Payments from '@permaweb/payments';
import { InjectedArweaveSigner } from 'warp-contracts-plugin-signature';

import { STORAGE, TAGS } from 'permaweb-orderbook';

import { Button } from 'components/atoms/Button';
import { Drawer } from 'components/atoms/Drawer';
import { TxAddress } from 'components/atoms/TxAddress';
// import { Modal } from 'components/molecules/Modal';
import { API_CONFIG, ASSETS, REDIRECTS, UDL_ICONS_MAP } from 'helpers/config';
import { language } from 'helpers/language';
import { ResponseType } from 'helpers/types';
import { formatDisplayString, getHost } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useOrderBookProvider } from 'providers/OrderBookProvider';

import { IAProps } from '../../types';

import * as S from './styles';

export default function AssetDetailLicenses(props: IAProps) {
	const arProvider = useArweaveProvider();
	const orProvider = useOrderBookProvider();

	const [payments, setPayments] = React.useState<any>(null);

	const [licensePaid, setLicensePaid] = React.useState<boolean>(false);
	const [containsLicense, setContainsLicense] = React.useState<boolean>(false);

	const [loading, setLoading] = React.useState<boolean>(false);
	// const [showConfirmation, setShowConfirmation] = React.useState<boolean>(false);
	const [initialDisabled, setInitialDisabled] = React.useState<boolean>(true);

	const [paymentResponse, setPaymentResponse] = React.useState<ResponseType | null>(null);

	React.useEffect(() => {
		(async function () {
			if (orProvider.orderBook) {
				let signer: any = null;
				if (arProvider.walletAddress) {
					signer = new InjectedArweaveSigner(arProvider.wallet);
					signer.getAddress = window.arweaveWallet.getActiveAddress;
					await signer.setPublicKey();
				}

				setPayments(
					Payments.init({
						warp: orProvider.orderBook.env.arClient.warpDefault,
						wallet: signer ? signer : 'use_wallet',
						gateway: `${API_CONFIG.protocol}://${getHost()}/graphql`,
					})
				);
			}
		})();
	}, [orProvider.orderBook, arProvider.walletAddress]);

	React.useEffect(() => {
		(async function () {
			if (
				props.asset &&
				props.asset.data.udl &&
				props.asset.data.udl.license &&
				props.asset.data.udl.license.value !== STORAGE.none &&
				payments
			) {
				setContainsLicense(true);
				setLicensePaid(await payments.isLicensed(props.asset.data.id, arProvider.walletAddress));
				setInitialDisabled(false);
			}
		})();
	}, [props.asset, payments, loading]);

	React.useEffect(() => {
		if (licensePaid) {
			setPaymentResponse({
				status: true,
				message: `${language.licensePaid}!`,
			});
		}
	}, [licensePaid]);

	async function handlePay() {
		(async function () {
			if (
				props.asset &&
				props.asset.data.udl &&
				props.asset.data.udl.license &&
				props.asset.data.udl.license.value !== STORAGE.none &&
				payments
			) {
				try {
					setLoading(true);
					const payment = await payments.pay(props.asset.data.id, arProvider.walletAddress);
					console.log(payment);

					setLoading(false);
					setPaymentResponse({
						status: true,
						message: `${language.licensePaid}!`,
					});
				} catch (e: any) {
					let message: any = e.message ? e.message : language.errorOccurred;
					if (e.message) console.error(e.message);
					else console.error(e);
					setLoading(false);
					setPaymentResponse({
						status: true,
						message: message,
					});
				}
			}
		})();
	}

	return props.asset &&
		(props.asset.data.udl || (props.asset.data.license && props.asset.data.license !== STORAGE.none)) ? (
		<S.Wrapper>
			<Drawer
				title={language.assetRights}
				icon={ASSETS.license}
				content={
					<S.DrawerContent>
						{props.asset.data.udl && (
							<>
								<S.HeaderFlex>
									<S.Logo>
										<ReactSVG src={ASSETS.udl} />
									</S.Logo>
									<S.HeaderLink>
										<Link target={'_blank'} to={REDIRECTS.udl}>
											{language.licenseText}
										</Link>
									</S.HeaderLink>
								</S.HeaderFlex>
								{containsLicense && (
									<S.ActionContainer>
										<Button
											type={'alt1'}
											label={language.payLicense}
											handlePress={handlePay}
											disabled={
												!arProvider.walletAddress ||
												licensePaid ||
												loading ||
												paymentResponse !== null ||
												initialDisabled
											}
											loading={loading}
											noMinWidth
										/>
									</S.ActionContainer>
								)}
								{Object.keys(props.asset.data.udl).map((key: string, index: number) => {
									return props.asset.data.udl[key].key !== TAGS.keys.udl.license &&
										props.asset.data.udl[key].value !== STORAGE.none ? (
										<S.DCLine key={index}>
											<S.DCLineHeader>
												<p>{props.asset.data.udl[key].key}</p>
											</S.DCLineHeader>
											<S.DCLineFlex>
												<S.DCLineDetail>{`${formatDisplayString(props.asset.data.udl[key].value)}${
													!props.asset.data.udl[key].icon && props.asset.data.udl[key].endText
														? ` ${props.asset.data.udl[key].endText}`
														: ''
												}`}</S.DCLineDetail>
												{props.asset.data.udl[key].icon && (
													<S.DCLineIcon>
														<ReactSVG src={UDL_ICONS_MAP[props.asset.data.udl[key].icon]} />
													</S.DCLineIcon>
												)}
											</S.DCLineFlex>
										</S.DCLine>
									) : null;
								})}

								{/* {showConfirmation && (
									<Modal header={language.confirmPayment} handleClose={() => setShowConfirmation(false)}>
										<Button
											type={'alt1'}
											label={paymentResponse ? paymentResponse.message : language.confirm}
											handlePress={handlePay}
											disabled={
												!arProvider.walletAddress ||
												licensePaid ||
												loading ||
												paymentResponse !== null ||
												initialDisabled
											}
											loading={loading}
											noMinWidth
										/>
									</Modal>
								)} */}
							</>
						)}
						{props.asset.data.license && props.asset.data.license !== STORAGE.none && (
							<S.DCLine>
								<S.DCLineHeader>
									<p>{language.license}</p>
								</S.DCLineHeader>
								<TxAddress address={props.asset.data.license} wrap={false} view viewIcon={ASSETS.details} />
							</S.DCLine>
						)}
					</S.DrawerContent>
				}
			/>
		</S.Wrapper>
	) : null;
}
