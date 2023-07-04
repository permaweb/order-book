import React from 'react';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';

import { checkDesktop, checkWindowResize } from 'helpers/window';

import * as S from './styles';
import { IProps } from './types';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart(props: IProps) {
	const [desktop, setDesktop] = React.useState(checkDesktop());

	const [data, setData] = React.useState<any>(null);

	function handleWindowResize() {
		if (checkDesktop()) {
			setDesktop(true);
		} else {
			setDesktop(false);
		}
	}

	checkWindowResize(handleWindowResize);

	React.useEffect(() => {
		if (props.quantities) {
			const pieData: any = {
				labels: props.quantities.map((element: { label: string; value: string; quantity: number }) => element.label),
				datasets: [],
			};

			pieData.datasets.push({
				data: props.quantities.map((element: { label: string; value: string; quantity: number }) => element.quantity),
				backgroundColor: [
					'#EC9192',
					'#90C3C8',
					'#B9B8D3',
					'#759FBC',
					'#5FA3C7',
					'#8E8DBE',
					'#FFCAAF',
					'#A0D2DB',
					'#F7ACCF',
				],
				borderColor: [
					'#D3D3D3',
					'#D3D3D3',
					'#D3D3D3',
					'#D3D3D3',
					'#D3D3D3',
					'#D3D3D3',
					'#D3D3D3',
					'#D3D3D3',
					'#D3D3D3',
				],
				borderWidth: 1,
			});

			setData(pieData);
		}
	}, [props.quantities]);

	return data ? (
		<S.Wrapper>
			<Pie
				data={data}
				options={{
					plugins: {
						legend: {
							display: desktop ? true : false,
							position: 'right',
							labels: {
								boxHeight: 20,
								boxWidth: 20,
								color: '#000',
								font: {
									size: 13,
									weight: 'bold',
								},
							},
							onClick: () => {},
						},
					},
				}}
			/>
		</S.Wrapper>
	) : null;
}
