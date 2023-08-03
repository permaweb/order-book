import React from 'react';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useTheme } from 'styled-components';

import { checkDesktop, checkWindowResize } from 'helpers/window';

import * as S from './styles';
import { IProps } from './types';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart(props: IProps) {
	const theme = useTheme();

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
					theme.colors.stats.primary,
					theme.colors.stats.alt1,
					theme.colors.stats.alt2,
					theme.colors.stats.alt3,
					theme.colors.stats.alt4,
					theme.colors.stats.alt5,
					theme.colors.stats.alt6,
					theme.colors.stats.alt7,
					theme.colors.stats.alt8,
				],
				borderColor: [
					theme.colors.border.primary,
					theme.colors.border.primary,
					theme.colors.border.primary,
					theme.colors.border.primary,
					theme.colors.border.primary,
					theme.colors.border.primary,
					theme.colors.border.primary,
					theme.colors.border.primary,
					theme.colors.border.primary,
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
							position: desktop ? 'right' : 'bottom',
							labels: {
								boxHeight: 20,
								boxWidth: 20,
								font: {
									size: 13,
									weight: 'medium',
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
