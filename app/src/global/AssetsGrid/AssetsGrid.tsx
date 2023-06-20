import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { AssetType } from 'permaweb-orderbook';

import TEMP_FRACTION_SVG from 'assets/temp-fraction.svg';
import { IconButton } from 'components/atoms/IconButton';
import { Loader } from 'components/atoms/Loader';
import { AssetData } from 'global/AssetData';
import { AssetOrders } from 'global/AssetOrders';
import { ASSETS, FEATURE_COUNT } from 'helpers/config';
import { language } from 'helpers/language';
import * as urls from 'helpers/urls';

import * as S from './styles';
import { IProps } from './types';

// TODO: add title
// TODO: add orders list
function AssetTile(props: { asset: AssetType; index: number }) {
	const navigate = useNavigate();

	const orders = [
		{
			id: 'ELes3ZaBgPS5v0pREaolBIBpL0B55B2gTAKIDkjA6mU',
			transfer: 'tEByke-Kkjp5CKJ_d5uDMNj_CxtVCFz8fPwl6KpILgY',
			creator: 'YWECbIrjlJpc7ZhwTQCGjPAQyP4CgE_3YIDd8I0wgJ0',
			token: 'F8tPKDNS-c6mXD1a0FqPXlbiQ2Yl4MhN1ltIdkMI3O8',
			price: 10000,
			quantity: 99.99,
			originalQuantity: 100,
			currency: 'rO8f4nTVarU6OtU2284C8-BIH6HscNd-srhWznUllTk',
		},
		{
			id: 'ELes3ZaBgPS5v0pREaolBIBpL0B55B2gTAKIDkjA6mU',
			transfer: 'tEByke-Kkjp5CKJ_d5uDMNj_CxtVCFz8fPwl6KpILgY',
			creator: 'YWECbIrjlJpc7ZhwTQCGjPAQyP4CgE_3YIDd8I0wgJ0',
			token: 'F8tPKDNS-c6mXD1a0FqPXlbiQ2Yl4MhN1ltIdkMI3O8',
			price: 10000,
			quantity: 99.99,
			originalQuantity: 100,
			currency: 'rO8f4nTVarU6OtU2284C8-BIH6HscNd-srhWznUllTk',
		},
		{
			id: 'ELes3ZaBgPS5v0pREaolBIBpL0B55B2gTAKIDkjA6mU',
			transfer: 'tEByke-Kkjp5CKJ_d5uDMNj_CxtVCFz8fPwl6KpILgY',
			creator: 'YWECbIrjlJpc7ZhwTQCGjPAQyP4CgE_3YIDd8I0wgJ0',
			token: 'F8tPKDNS-c6mXD1a0FqPXlbiQ2Yl4MhN1ltIdkMI3O8',
			price: 10000,
			quantity: 99.99,
			originalQuantity: 100,
			currency: 'rO8f4nTVarU6OtU2284C8-BIH6HscNd-srhWznUllTk',
		},
		{
			id: 'ELes3ZaBgPS5v0pREaolBIBpL0B55B2gTAKIDkjA6mU',
			transfer: 'tEByke-Kkjp5CKJ_d5uDMNj_CxtVCFz8fPwl6KpILgY',
			creator: 'YWECbIrjlJpc7ZhwTQCGjPAQyP4CgE_3YIDd8I0wgJ0',
			token: 'F8tPKDNS-c6mXD1a0FqPXlbiQ2Yl4MhN1ltIdkMI3O8',
			price: 10000,
			quantity: 99.99,
			originalQuantity: 100,
			currency: 'rO8f4nTVarU6OtU2284C8-BIH6HscNd-srhWznUllTk',
		},
		{
			id: 'ELes3ZaBgPS5v0pREaolBIBpL0B55B2gTAKIDkjA6mU',
			transfer: 'tEByke-Kkjp5CKJ_d5uDMNj_CxtVCFz8fPwl6KpILgY',
			creator: 'YWECbIrjlJpc7ZhwTQCGjPAQyP4CgE_3YIDd8I0wgJ0',
			token: 'F8tPKDNS-c6mXD1a0FqPXlbiQ2Yl4MhN1ltIdkMI3O8',
			price: 10000,
			quantity: 99.99,
			originalQuantity: 100,
			currency: 'rO8f4nTVarU6OtU2284C8-BIH6HscNd-srhWznUllTk',
		},
	];

	const TEST_ASSET = {
		data: props.asset.data,
		orders: orders,
	};

	// TODO: get stamp count
	return (
		<S.PICWrapper>
			<S.HCWrapper>
				<ReactSVG src={TEMP_FRACTION_SVG} />
				<S.StampCountWrapper>
					<p>2</p>
					<div className={'s-divider'} />
					<ReactSVG src={ASSETS.stamps} />
				</S.StampCountWrapper>
			</S.HCWrapper>
			<S.PCWrapper>
				<AssetData asset={props.asset} />
			</S.PCWrapper>
			<S.ICWrapper>
				<S.ICFlex>
					<S.AssetData>
						<span>{`# ${props.index}`}</span>
						<div className={'a-divider'} />
						<p>{props.asset.data.title}</p>
					</S.AssetData>
					<IconButton
						type={'alt1'}
						src={ASSETS.details}
						handlePress={() => navigate(`${urls.asset}${props.asset.data.id}`)}
						dimensions={{
							wrapper: 50,
							icon: 25,
						}}
					/>
				</S.ICFlex>
				{props.asset.orders && (
					<S.AssetDataAlt>
						<span>{language.listing}</span>
						<div className={'a-divider'} />
						<AssetOrders asset={TEST_ASSET} />
					</S.AssetDataAlt>
				)}
			</S.ICWrapper>
		</S.PICWrapper>
	);
}

export default function AssetsGrid(props: IProps) {
	const [assets, setAssets] = React.useState<AssetType[] | null>(null);

	// TODO: filters
	React.useEffect(() => {
		if (props.assets) {
			setAssets(props.assets);
		}
	}, [props.assets]);

	function getData() {
		if (assets) {
			if (assets.length > 0) {
				return assets.map((asset: AssetType, index: number) => {
					return <AssetTile key={asset.data.id} asset={asset} index={index + 1} />;
				});
			} else {
				return (
					<S.NoAssetsContainer>
						<p>{language.noAssets}</p>
					</S.NoAssetsContainer>
				);
			}
		} else {
			// TODO: get count
			const keys = Array.from({ length: FEATURE_COUNT }, (_, i) => i + 1);
			const elements = keys.map((element) => (
				<S.PICWrapper key={`pic_${element}`}>
					<S.PCWrapper key={`pc_${element}`}>
						<Loader placeholder />
					</S.PCWrapper>
					<S.ICWrapper key={`ic_${element}`} />
				</S.PICWrapper>
			));
			return <>{elements}</>;
		}
	}

	return (
		<div className={'gradient-wrapper'}>
			<div className={'view-wrapper max-cutoff'}>
				<S.Wrapper>{getData()}</S.Wrapper>
			</div>
		</div>
	);
}
