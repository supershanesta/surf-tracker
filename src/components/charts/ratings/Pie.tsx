import {
  useEffect,
  useRef,
} from 'react';

import type { ECharts } from 'echarts';
import { init } from 'echarts';

import { ChartProps } from '@/components/charts/types';

const RatingsPieChart: React.FC<ChartProps> = ({ data }) => {
	const chartRef = useRef<HTMLDivElement>(null);
	const chartInstance = useRef<ECharts>();

	useEffect(() => {
		// Initialize chart
		let chart: ECharts | undefined;
		if (chartRef.current !== null) {
			chart = init(chartRef.current);
		}

		const options = {
			title: {
				text: "Surf Ratings",
			},
			series: [
				{
					type: "pie",
					data,
					itemStyle: {
						normal: {
							label: {
								show: true,
								formatter: ({
									name,
									value,
								}: {
									name: string;
									value: number;
								}) => {
									return value == 0 ? "" : name;
								},
								position: "inner",
								labelLine: {
									show: false,
								},
							},
						},
					},
				},
			],
		};

		chart?.setOption(options);
		chart?.resize({ width: "auto", height: "auto" });

		chartInstance.current = chart;

		return () => {
			if (chartInstance.current) {
				chartInstance.current.dispose();
			}
		};
	}, [data]);

	return <div ref={chartRef} className="w-full h-[50vh]" />;
};

export default RatingsPieChart;
