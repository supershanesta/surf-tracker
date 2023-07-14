import {
  useEffect,
  useRef,
} from 'react';

import type { ECharts } from 'echarts';
import { init } from 'echarts';

import { ChartProps } from '@/components/charts/types';
import { addMissingDates } from '@/components/charts/utils';

const FrequencyLineChart: React.FC<ChartProps> = ({ data, filters }) => {
	const chartRef = useRef<HTMLDivElement>(null);
	const chartInstance = useRef<ECharts>();
	const parsedData = addMissingDates(data, filters.startDate, filters.endDate);

	useEffect(() => {
		// Initialize chart
		let chart: ECharts | undefined;
		if (chartRef.current !== null) {
			chart = init(chartRef.current);
		}

		const options = {
			title: {
				text: "Surf Frequency",
			},
			xAxis: {
				type: "category",
				data: parsedData.map((d) => d.name),
			},
			yAxis: { type: "value", max: 2, interval: 1 },
			series: [
				{
					type: "line",
					smooth: true,

					data: parsedData.map((d) => d.value),
				},
			],
		};

		chart?.setOption(options);
		chart?.resize();

		chartInstance.current = chart;

		return () => {
			if (chartInstance.current) {
				chartInstance.current.dispose();
			}
		};
	}, [data, filters.endDate, filters.startDate, parsedData]);

	return <div ref={chartRef} style={{ height: "300px" }} />;
};

export default FrequencyLineChart;
