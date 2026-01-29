"use client";

import ReactECharts from "echarts-for-react";
import { ChartComponentProps } from "./ChartCard";
import css from "./ChartContent.module.scss";
import { chart1Data } from "@/mockData";
import { getCommonOption } from "./chartUtils";

const Chart4 = ({ isExpanded }: ChartComponentProps) => {
  const { option, config } = getCommonOption(isExpanded);

  const finalOption = {
    ...option,
    legend: {
      ...option.legend,
      data: [
        { name: "Revenue", icon: "circle" },
        { name: "Cost", icon: "circle" },
        { name: "Profit %", icon: "line" },
      ],
    },
    xAxis: { ...option.xAxis, data: chart1Data.categories },
    series: [
      {
        name: "Revenue",
        type: "bar",
        stack: "r",
        barWidth: config.barWidth,
        itemStyle: { color: "#3ba272", borderRadius: 0 },
        data: chart1Data.barData1,
      },
      {
        name: "Cost",
        type: "bar",
        stack: "r",
        itemStyle: { color: "#5470c6", borderRadius: [4, 4, 0, 0] },
        data: chart1Data.barData2.map((v) => v * 0.5),
      },
      {
        name: "Profit %",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        itemStyle: { color: "#fac858" },
        data: chart1Data.lineData,
      },
    ],
  };

  return (
    <div className={`${css.chartContent} ${isExpanded ? css.expanded : ""}`}>
      <ReactECharts option={finalOption} style={{ height: "100%", width: "100%" }} theme="dark" notMerge={true} />
    </div>
  );
};

export default Chart4;
