import {
  useEffect,
  useRef,
} from 'react';

import type { ECharts } from 'echarts';
import { init } from 'echarts';

import { ChartProps } from '@/components/charts/types';

const BeachesPieChart: React.FC<ChartProps> = ({ data }) => {
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
				text: "Beach Distribution",
			},
			series: [
				{
					type: "pie",
					data,
					itemStyle: {
						normal: {
							label: {
								show: true,
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

export default BeachesPieChart;
