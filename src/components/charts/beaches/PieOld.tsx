import { useEffect, useRef } from "react";

import type { ECharts } from "echarts";
import { init } from "echarts";
import { Text } from "@visx/text";
import { scaleLog } from "@visx/scale";
import Wordcloud from "@visx/wordcloud/lib/Wordcloud";
import { totoAfricaLyrics } from "./text.fixture";
import { ChartProps } from "@/components/charts/types";

const BeachesPieChart: React.FC<ChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts>();

  //filter to show the top 5 beaches only
  const totalCount = data.reduce((acc, curr) => acc + curr.value, 0);

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      chart = init(chartRef.current);
    }

    const options = {
      title: {
        text: "Top 5 Beaches",
      },
      legend: {
        top: "50%",
        left: "center",
      },
      xAxis: [
        {
          type: "value",
          max: data.length,
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      yAxis: {
        max: "category",
        data: data.map((item) => item.name.split(" ").join("\n")),
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          colorBy: "data",
          type: "bar",
          stack: "chart",
          barCategoryGap: 20,
          barWidth: 20,
          label: {
            position: [0, -14],
            formatter: "{b}",
            show: true,
          },
          itemStyle: {
            borderRadius: [0, 2, 2, 0],
          },
          data: data.map((item) => item.value),
        },
        {
          type: "bar",
          stack: "chart",
          barCategoryGap: 30,
          barWidth: 20,
          itemStyle: {
            color: "whitesmoke",
          },
          label: {
            position: "insideRight",
            formatter: function (params: { value: number }) {
              return 10 * (params.value / totalCount) + "%";
            },
            show: true,
          },
          data: data.map((item) => {
            return totalCount - item.value;
          }),
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
