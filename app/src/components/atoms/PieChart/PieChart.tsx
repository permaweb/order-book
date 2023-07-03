import React from 'react';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';

import { formatAddress } from 'helpers/utils';

import * as S from './styles';
import { IProps } from './types';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart(props: IProps) {
	const [data, setData] = React.useState<any>(null);

	React.useEffect(() => {
		if (props.owners) {
			const pieData: any = {
				labels: props.owners.map((owner: any) =>
					owner.handle
						? `${owner.handle} (${((owner.ownerPercentage ? owner.ownerPercentage : owner.sellPercentage) * 100).toFixed(2)}%)`
						: `${formatAddress(owner.address, false)} (${
								((owner.ownerPercentage ? owner.ownerPercentage : owner.sellPercentage
						  ) * 100).toFixed(2)}%)`
				),
				datasets: [],
			};

			pieData.datasets.push({
				data: props.owners.map((owner: any) => (owner.ownerPercentage ? owner.ownerPercentage : owner.sellPercentage)),
				backgroundColor: ['#EC9192', '#90C3C8', '#B9B8D3', '#759FBC', '#1F5673', '#463730', '#FFCAAF', '#8E4A49', '#D7B29D'],
				borderColor: ['#D3D3D3', '#D3D3D3', '#D3D3D3', '#D3D3D3', '#D3D3D3', '#D3D3D3', '#D3D3D3', '#D3D3D3', '#D3D3D3'],
				borderWidth: 1,
			});

			setData(pieData);
		}
	}, [props.owners]);

	return data ? (
		<S.Wrapper>
			<Pie
				data={data}
				options={{
					animation: false,
					plugins: {
						legend: {
							position: 'right',
							labels: {
								boxHeight: 20,
								boxWidth: 20,
                                color: '#000',
								font: {
									size: 14,
									weight: 'bold',
								},
							},
							onClick: () => {}
						},
					},
				}}
			/>
		</S.Wrapper>
	) : null;
}
