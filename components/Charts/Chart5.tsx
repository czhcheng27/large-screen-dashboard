"use client";

import ReactECharts from "echarts-for-react";
import { ChartComponentProps } from "./ChartCard";
import css from "./ChartContent.module.scss";
import { chart1Data } from "@/mockData";
import { getCommonOption } from "./chartUtils";

const Chart5 = ({ isExpanded }: ChartComponentProps) => {
  const { option, config } = getCommonOption(isExpanded);

  const finalOption = {
    ...option,
    legend: {
      ...option.legend,
      data: [
        { name: "Inventory", icon: "circle" },
        { name: "Safety", icon: "circle" },
        { name: "Turnover", icon: "line" },
      ],
    },
    xAxis: { ...option.xAxis, data: chart1Data.categories },
    series: [
      {
        name: "Inventory",
        type: "bar",
        stack: "i",
        barWidth: config.barWidth,
        itemStyle: { color: "#91cc75", borderRadius: 0 },
        data: chart1Data.barData1,
      },
      {
        name: "Safety",
        type: "bar",
        stack: "i",
        itemStyle: { color: "#ee6666", borderRadius: [4, 4, 0, 0] },
        data: chart1Data.barData2.map((v) => v * 0.3),
      },
      {
        name: "Turnover",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        itemStyle: { color: "#73c0de" },
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

export default Chart5;
