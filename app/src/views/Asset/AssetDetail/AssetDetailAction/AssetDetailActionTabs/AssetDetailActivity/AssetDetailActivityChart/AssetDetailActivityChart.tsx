import React from 'react';
import { Line } from 'react-chartjs-2';
import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js';
import { useTheme } from 'styled-components';

import { ActivityElementType } from 'permaweb-orderbook';

import { language } from 'helpers/language';

import * as S from './styles';
import { IProps } from './types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AssetDetailActivityChart(props: IProps) {
	const theme = useTheme();

	const [data, setData] = React.useState<any>(null);

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'bottom' as const,
				labels: {
					boxHeight: 20,
					boxWidth: 20,
					borderWidth: 1,
					marginRight: 20,
					font: {
						size: 13,
						weight: 'medium',
					},
				},
			},
			title: {
				display: false,
				text: null,
			},
		},
		scales: {
			y: {
				min: 0,
				max: 10,
				ticks: {
					stepSize: 1,
				},
			},
		},
	};

	function getLabels() {
		const result = [];
		for (let i = 6; i >= 0; --i) {
			const d = new Date();
			d.setDate(d.getDate() - i);
			result.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
		}
		return result;
	}

	function getCountsByDay(data: any) {
		const counts = new Array(7).fill(0);

		data.forEach((item: any) => {
			const date = new Date(item.dateCreated);

			for (let i = 0; i < 7; i++) {
				const d = new Date();
				d.setDate(d.getDate() - i);

				if (
					date.getDate() === d.getDate() &&
					date.getMonth() === d.getMonth() &&
					date.getFullYear() === d.getFullYear()
				) {
					counts[i]++;
				}
			}
		});

		return counts.reverse();
	}

	function getDataSet(type: 'stamps' | 'comments') {
		if (props.activity) {
			let parsedList: ActivityElementType[] = [];
			switch (type) {
				case 'stamps':
					parsedList = props.activity.filter(
						(element: ActivityElementType) => element.protocolName.toLowerCase() === 'stamp'
					);
					break;
				case 'comments':
					parsedList = props.activity.filter(
						(element: ActivityElementType) => element.dataProtocol.toLowerCase() === 'comment'
					);
					break;
			}
			return getCountsByDay(parsedList);
		} else return [];
	}

	React.useEffect(() => {
		if (props.activity) {
			setData({
				labels: getLabels(),
				datasets: [
					{
						label: language.stamps,
						data: getDataSet('stamps'),
						backgroundColor: theme.colors.stats.primary,
						borderColor: theme.colors.stats.primary,
					},
					{
						label: language.comments,
						data: getDataSet('comments'),
						backgroundColor: theme.colors.stats.alt1,
						borderColor: theme.colors.stats.alt1,
					},
				],
			});
		}
	}, [props.activity]);

	return data ? (
		<S.Wrapper>
			<S.Header>
				<p>{language.weeklyAssetActivity}</p>
			</S.Header>
			<S.ChartWrapper>
				<Line options={options} data={data} />
			</S.ChartWrapper>
		</S.Wrapper>
	) : null;
}
