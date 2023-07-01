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

// TODO: orders
function AssetRow(props: { asset: AssetType; index: number }) {
	return (
		<S.PICWrapper>
			<Link to={`${urls.asset}${props.asset.data.id}`}>
				<S.PCWrapper>
					<S.AFlex>
						<p>{props.index}</p>
						<S.AWrapper>
							<AssetData asset={props.asset} preview />
						</S.AWrapper>
						<p>{props.asset.data.title}</p>
					</S.AFlex>
					{/* <S.AOrders>
						<AssetOrders asset={props.asset} />
					</S.AOrders> */}
					<S.SCValue>
						<StampWidget
							assetId={props.asset.data.id}
							title={props.asset.data.title}
							stamps={props.asset.stamps ? props.asset.stamps : null}
						/>
					</S.SCValue>
				</S.PCWrapper>
			</Link>
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
						{/* <S.HeaderWrapper>
							<S.HSection1>
								<p>#</p>
								<S.AtomicAsset>
									<p>{language.atomicAsset}</p>
								</S.AtomicAsset>
								<S.Listing>
									<p>{language.listing}</p>
								</S.Listing>
								<S.StampCount>
									<p>{language.stampCount}</p>
								</S.StampCount>
							</S.HSection1>
							<S.HSection2>
								<p>#</p>
								<S.AtomicAsset>{language.atomicAsset}</S.AtomicAsset>
								<S.Listing>{language.listing}</S.Listing>
								<S.StampCount>{language.stampCount}</S.StampCount>
							</S.HSection2>
						</S.HeaderWrapper> */}
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
