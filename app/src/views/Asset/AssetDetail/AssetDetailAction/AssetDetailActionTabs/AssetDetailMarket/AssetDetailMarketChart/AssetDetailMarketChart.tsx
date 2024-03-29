import React from 'react';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useTheme } from 'styled-components';

import { ORDERBOOK_CONTRACT } from 'permaweb-orderbook';

import { OwnerInfo } from 'components/organisms/OwnerInfo';
import { language } from 'helpers/language';
import { OwnerListingType, OwnerType } from 'helpers/types';
import { formatAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';

import * as S from './styles';
import { IProps } from './types';

ChartJS.register(ArcElement, Tooltip, Legend);

const MAX_OWNER_LENGTH = 10;

export default function AssetDetailMarketChart(props: IProps) {
	const theme = useTheme();
	const arProvider = useArweaveProvider();

	const keys = [
		theme.colors.stats.primary,
		theme.colors.stats.alt1,
		theme.colors.stats.alt2,
		theme.colors.stats.alt3,
		theme.colors.stats.alt4,
		theme.colors.stats.alt5,
		theme.colors.stats.alt6,
		theme.colors.stats.alt7,
		theme.colors.stats.alt8,
		theme.colors.stats.alt9,
		theme.colors.stats.alt10,
	];

	const [data, setData] = React.useState<any>(null);
	const [sortedOwners, setSortedOwners] = React.useState<OwnerType[] | OwnerListingType[] | null>(null);

	React.useEffect(() => {
		if (props.owners) {
			const sortedOwners = props.owners.sort((a: any, b: any) => {
				if (a.address === ORDERBOOK_CONTRACT || b.address === ORDERBOOK_CONTRACT) {
					if (a.address === ORDERBOOK_CONTRACT) return -1;
					if (b.address === ORDERBOOK_CONTRACT) return 1;
				} else {
					if (
						arProvider.walletAddress &&
						(a.address === arProvider.walletAddress || b.address === arProvider.walletAddress)
					) {
						if (a.address === arProvider.walletAddress) return -1;
						if (b.address === arProvider.walletAddress) return 1;
					}
				}
				return b.balance - a.balance;
			});

			if (sortedOwners.length > MAX_OWNER_LENGTH) {
				const others: any = sortedOwners.splice(-(sortedOwners.length - MAX_OWNER_LENGTH));

				const combined = others.reduce(
					(acc: any, cur: any) => {
						acc.balance += cur.balance;
						acc.ownerPercentage += cur.ownerPercentage;
						return acc;
					},
					{ address: language.other, handle: language.other, avatar: null, balance: 0, ownerPercentage: 0 }
				);

				setSortedOwners([...sortedOwners, combined]);
			} else {
				setSortedOwners(sortedOwners);
			}
		}
	}, [props.owners]);

	React.useEffect(() => {
		if (sortedOwners) {
			const pieData: any = {
				labels: sortedOwners.map((owner: OwnerType | OwnerListingType) =>
					owner.address === ORDERBOOK_CONTRACT
						? language.totalSalesPercentage
						: owner.handle
						? owner.handle
						: formatAddress(owner.address, true)
				),
				datasets: [],
			};

			pieData.datasets.push({
				data: sortedOwners.map((owner: OwnerType | OwnerListingType) => (owner as OwnerType).ownerPercentage),
				backgroundColor: keys,
				borderColor: [theme.colors.border.primary],
				borderWidth: 1,
			});

			setData(pieData);
		}
	}, [sortedOwners]);

	return data && sortedOwners ? (
		<S.Wrapper className={'border-wrapper'}>
			<S.HeaderWrapper>
				<S.Header>
					<p>{language.currentOwners}</p>
				</S.Header>
			</S.HeaderWrapper>
			<S.ChartWrapper>
				<S.Chart>
					<Pie
						data={data}
						options={{
							plugins: {
								legend: {
									display: false,
								},
							},
						}}
					/>
				</S.Chart>
				<S.ChartKeyWrapper>
					{sortedOwners.map((owner: OwnerType | OwnerListingType, index: number) => {
						return (
							<S.ChartKeyLine key={index} first={index === 0 && owner.address === ORDERBOOK_CONTRACT}>
								<S.ChartKey background={keys[index] ? keys[index] : theme.colors.stats.alt10} />
								{owner.address !== ORDERBOOK_CONTRACT && owner.address !== language.other ? (
									<>
										<OwnerInfo
											owner={owner}
											asset={props.asset}
											loading={false}
											isSaleOrder={false}
											handleUpdate={() => {}}
											hideOrderCancel={false}
										/>
										<S.Percentage>{`(${(
											((owner as any).ownerPercentage
												? (owner as any).ownerPercentage
												: (owner as any).sellPercentage) * 100
										).toFixed(2)}%)`}</S.Percentage>
									</>
								) : (
									<S.Percentage>{`${
										owner.address === ORDERBOOK_CONTRACT ? language.totalSalesPercentage : language.other
									} (${(
										((owner as any).ownerPercentage ? (owner as any).ownerPercentage : (owner as any).sellPercentage) *
										100
									).toFixed(2)}%)`}</S.Percentage>
								)}
							</S.ChartKeyLine>
						);
					})}
				</S.ChartKeyWrapper>
			</S.ChartWrapper>
		</S.Wrapper>
	) : (
		<p>{`${language.loading}...`}</p>
	);
}
