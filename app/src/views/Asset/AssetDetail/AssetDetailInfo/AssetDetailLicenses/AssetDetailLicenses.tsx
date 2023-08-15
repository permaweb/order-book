// import React from 'react';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

// import Payments from '@permaweb/payments';
// import { InjectedArweaveSigner } from 'warp-contracts-plugin-signature';
import { STORAGE, TAGS, UDL_LICENSE_VALUE } from 'permaweb-orderbook';

import { Drawer } from 'components/atoms/Drawer';
import { TxAddress } from 'components/atoms/TxAddress';
import { ASSETS, REDIRECTS, UDL_ICONS_MAP } from 'helpers/config';
import { language } from 'helpers/language';
import { formatDisplayString } from 'helpers/utils';

// import { useArweaveProvider } from 'providers/ArweaveProvider';
// import { useOrderBookProvider } from 'providers/OrderBookProvider';
import { IAProps } from '../../types';

import * as S from './styles';

export default function AssetDetailLicenses(props: IAProps) {
	// const arProvider = useArweaveProvider();
	// const orProvider = useOrderBookProvider();

	// const [payments, setPayments] = React.useState<any>(null);
	// const [isLicensed, setIsLicensed] = React.useState<any>(null);

	// React.useEffect(() => {
	// 	if (orProvider.orderBook) {
	// 		setPayments(
	// 			Payments.init({
	// 				warp: orProvider.orderBook.env.arClient.warpDefault,
	// 				wallet: arProvider.walletAddress ? new InjectedArweaveSigner(arProvider.walletAddress) : 'use_wallet',
	// 				gateway: 'https://arweave.net/graphql',
	// 			})
	// 		);
	// 	}
	// }, [orProvider.orderBook, arProvider.walletAddress]);

	// React.useEffect(() => {
	// 	(async function () {
	// 		if (
	// 			props.asset &&
	// 			props.asset.data.udl &&
	// 			props.asset.data.license &&
	// 			props.asset.data.license !== STORAGE.none &&
	// 			payments
	// 		) {
	// 			console.log(await payments.isLicensed(props.asset.data.license, props.asset.data.id));
	// 		}
	// 	})();
	// }, [props.asset, payments]);

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
							</>
						)}
						{props.asset.data.license &&
							props.asset.data.license !== STORAGE.none &&
							props.asset.data.license.toLowerCase() !== UDL_LICENSE_VALUE.toLowerCase() && (
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
