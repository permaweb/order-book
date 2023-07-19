import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { UDL_LICENSE_VALUE } from 'permaweb-orderbook';

import { Drawer } from 'components/atoms/Drawer';
import { TxAddress } from 'components/atoms/TxAddress';
import { ASSETS, REDIRECTS } from 'helpers/config';
import { language } from 'helpers/language';
import { formatDisplayString } from 'helpers/utils';

import * as S from './styles';
import { IProps } from './types';

export default function AssetLicenses(props: IProps) {
	return props.asset && (props.asset.data.udl || props.asset.data.license) ? (
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
									<Link target={'_blank'} to={REDIRECTS.udl}>
										License Information
									</Link>
								</S.HeaderFlex>
								{Object.keys(props.asset.data.udl).map((key: string, index: number) => {
									return (
										<S.DCLine key={index}>
											<S.DCLineHeader>
												<p>{props.asset.data.udl[key].key}</p>
											</S.DCLineHeader>
											<S.DCLineDetail>{formatDisplayString(props.asset.data.udl[key].value)}</S.DCLineDetail>
										</S.DCLine>
									);
								})}
							</>
						)}
						{(props.asset.data.license && (props.asset.data.license.toLowerCase() !== UDL_LICENSE_VALUE.toLowerCase())) && (
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
