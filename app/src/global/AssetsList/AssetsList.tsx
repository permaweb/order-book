import React from 'react';
import { Link } from 'react-router-dom';

import { AssetType } from 'permaweb-orderbook';

import { Loader } from 'components/atoms/Loader';
import { AssetData } from 'global/AssetData';
import { AssetOrders } from 'global/AssetOrders';
import { StampWidget } from 'global/StampWidget';
import { language } from 'helpers/language';
import * as urls from 'helpers/urls';

import * as S from './styles';
import { IProps } from './types';

function AssetRow(props: { asset: AssetType; index: number }) {
	return (
		<S.PICWrapper>
			<S.PCWrapper>
				<S.AFlex>
					<p>{props.index}</p>
					<S.AWrapper>
						<AssetData asset={props.asset} preview />
					</S.AWrapper>
					<S.ATitle>
						<Link to={`${urls.asset}${props.asset.data.id}`}>
							{props.asset.data.title}
						</Link>
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

	function getData() {
		if (assets) {
			if (assets.length > 0) {
				return (
					<>
						<S.HeaderWrapper>
							<S.HSection1>
								<S.Rank>
									<p>{language.rank}</p>
								</S.Rank>
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
								<p>{language.rank}</p>
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
			const keys = Array.from({ length: 6 }, (_, i) => i + 1);
			const elements = keys.map((element) => (
				<S.PICWrapper key={`pic_${element}`}>
					<S.PCLoader key={`pc_${element}`}>
						<Loader placeholder />
					</S.PCLoader>
				</S.PICWrapper>
			));
			return <S.C1>{elements}</S.C1>;
		}
	}

	return <S.Wrapper>{getData()}</S.Wrapper>;
}
