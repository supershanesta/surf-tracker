import {
  useEffect,
  useRef,
} from 'react';

import type { ECharts } from 'echarts';
import { init } from 'echarts';

import {
  ChartProps,
  data,
} from '@/components/charts/types';
import { getDatesInRange } from '@/components/charts/utils';

const FrequencyPieChart: React.FC<ChartProps> = ({ data, filters }) => {
	const chartRef = useRef<HTMLDivElement>(null);
	const chartInstance = useRef<ECharts>();
	const total = getDatesInRange(filters.startDate, filters.endDate).length;
	const surfed = data.length;

	useEffect(() => {
		// Initialize chart
		let chart: ECharts | undefined;
		if (chartRef.current !== null) {
			chart = init(chartRef.current);
		}

		const parsedData: data[] = [
			{ name: "Surfed", value: surfed },
			{ name: "Not Surfed", value: total - surfed },
		];

		const options = {
			title: {
				text: "Surf Frequency",
			},

			series: [
				{
					type: "pie",
					data: parsedData,
					//radius: ["40%", "70%"],
					itemStyle: {
						normal: {
							label: {
								show: true,
								position: "inner",
								formatter: ({
									name,
									value,
									percent,
								}: {
									name: string;
									value: number;
									percent: number;
								}) => {
									let format = `Skipped ${value} days(s)\n (${percent}%)`;
									if (name == "Surfed") {
										format = `${name}: ${value} days(s)\n (${percent}%)`;
									}
									return format;
								},
							},
							labelLine: {
								show: false,
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
	}, [surfed, total]);

	return <div ref={chartRef} className="w-full h-[50vh]" />;
};

export default FrequencyPieChart;
