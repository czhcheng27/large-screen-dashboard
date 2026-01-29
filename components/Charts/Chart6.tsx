"use client";

import ReactECharts from "echarts-for-react";
import { ChartComponentProps } from "./ChartCard";
import css from "./ChartContent.module.scss";
import { chart1Data } from "@/mockData";
import { getCommonOption } from "./chartUtils";

const Chart6 = ({ isExpanded }: ChartComponentProps) => {
  const { option, config } = getCommonOption(isExpanded);

  const finalOption = {
    ...option,
    legend: {
      ...option.legend,
      data: [
        { name: "New Users", icon: "circle" },
        { name: "Active", icon: "circle" },
        { name: "Retention", icon: "line" },
      ],
    },
    xAxis: { ...option.xAxis, data: chart1Data.categories },
    series: [
      {
        name: "New Users",
        type: "bar",
        stack: "u",
        barWidth: config.barWidth,
        itemStyle: { color: "#fac858", borderRadius: 0 },
        data: chart1Data.barData1,
      },
      {
        name: "Active",
        type: "bar",
        stack: "u",
        itemStyle: { color: "#73c0de", borderRadius: [4, 4, 0, 0] },
        data: chart1Data.barData2.map((v) => v * 0.4),
      },
      {
        name: "Retention",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        itemStyle: { color: "#3ba272" },
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

export default Chart6;
