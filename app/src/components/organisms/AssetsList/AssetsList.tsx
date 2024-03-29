import React from 'react';
import { Link } from 'react-router-dom';

import { AssetType } from 'permaweb-orderbook';

import { Loader } from 'components/atoms/Loader';
import { AssetData } from 'components/organisms/AssetData';
import { AssetOrders } from 'components/organisms/AssetOrders';
import { StampWidget } from 'components/organisms/StampWidget';
import { language } from 'helpers/language';
import * as urls from 'helpers/urls';

import * as S from './styles';
import { IProps } from './types';

function AssetRow(props: { asset: AssetType; index: number }) {
	const redirect = `${urls.asset}${props.asset.data.id}`;

	return (
		<S.PICWrapper>
			<S.PCWrapper>
				<S.AFlex>
					<S.AWrapper>
						<S.AssetLink>
							<Link to={redirect} />
						</S.AssetLink>
						<S.AssetWrapper>
							<AssetData asset={props.asset} preview />
						</S.AssetWrapper>
					</S.AWrapper>
					<S.ATitle>
						<Link to={redirect}>{props.asset.data.title}</Link>
					</S.ATitle>
				</S.AFlex>
				<S.SFlex>
					<S.AOrders>
						<AssetOrders asset={props.asset} />
					</S.AOrders>
					<S.SCValue>
						<StampWidget
							assetId={props.asset.data.id}
							title={props.asset.data.title}
							stamps={props.asset.stamps ? props.asset.stamps : null}
						/>
					</S.SCValue>
				</S.SFlex>
			</S.PCWrapper>
		</S.PICWrapper>
	);
}

export default function AssetsList(props: IProps) {
	const [assets, setAssets] = React.useState<AssetType[] | null>(null);

	React.useEffect(() => {
		if (props.assets) {
			setAssets(props.assets);
		}
	}, [props.assets]);

	function getHeader() {
		return (
			<S.HeaderWrapper>
				<S.HSection1>
					<S.AtomicAsset>
						<p>{language.atomicAsset}</p>
					</S.AtomicAsset>
					<S.SHeaderFlex>
						<S.Listing>
							<p>{language.listing}</p>
						</S.Listing>
						<S.StampCount>
							<p>{language.stampCount}</p>
						</S.StampCount>
					</S.SHeaderFlex>
				</S.HSection1>
				<S.HSection2>
					<S.AtomicAsset>
						<p>{language.atomicAsset}</p>
					</S.AtomicAsset>
					<S.SHeaderFlex>
						<S.Listing>
							<p>{language.listing}</p>
						</S.Listing>
						<S.StampCount>
							<p>{language.stampCount}</p>
						</S.StampCount>
					</S.SHeaderFlex>
				</S.HSection2>
			</S.HeaderWrapper>
		);
	}

	function getData() {
		if (!assets || props.loading) {
			const keys = Array.from({ length: 10 }, (_, i) => i + 1);
			const elements = keys.map((element) => (
				<S.PICWrapper key={`pic_${element}`}>
					<S.PCLoader key={`pc_${element}`}>
						<Loader placeholder />
					</S.PCLoader>
				</S.PICWrapper>
			));
			return (
				<>
					{getHeader()}
					<S.C1>{elements}</S.C1>
				</>
			);
		} else {
			if (assets) {
				if (assets.length > 0) {
					return (
						<>
							{getHeader()}
							<S.C1>
								{assets.map((asset: AssetType, index: number) => {
									return <AssetRow key={asset.data.id} asset={asset} index={index + 1} />;
								})}
							</S.C1>
						</>
					);
				} else {
					return (
						<S.NoAssetsContainer>
							<p>{language.noAssets}</p>
						</S.NoAssetsContainer>
					);
				}
			} else {
				return null;
			}
		}
	}

	return <S.Wrapper>{getData()}</S.Wrapper>;
}
