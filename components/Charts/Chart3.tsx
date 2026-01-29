"use client";

import ReactECharts from "echarts-for-react";
import { ChartComponentProps } from "./ChartCard";
import css from "./ChartContent.module.scss";
import { chart1Data } from "@/mockData";
import { getCommonOption } from "./chartUtils";

const Chart3 = ({ isExpanded }: ChartComponentProps) => {
  const { option, config } = getCommonOption(isExpanded);

  const finalOption = {
    ...option,
    legend: {
      ...option.legend,
      data: [
        { name: "Inbound", icon: "circle" },
        { name: "Outbound", icon: "circle" },
        { name: "Storage Rate", icon: "line" },
      ],
    },
    xAxis: { ...option.xAxis, data: chart1Data.categories },
    series: [
      {
        name: "Inbound",
        type: "bar",
        stack: "s",
        barWidth: config.barWidth,
        itemStyle: { color: "#fc8452", borderRadius: 0 },
        data: chart1Data.barData1.map((v) => v * 1.1),
      },
      {
        name: "Outbound",
        type: "bar",
        stack: "s",
        itemStyle: { color: "#9a60b4", borderRadius: [4, 4, 0, 0] },
        data: chart1Data.barData2.map((v) => v * 0.9),
      },
      {
        name: "Storage Rate",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        itemStyle: { color: "#ea7ccc" },
        data: chart1Data.lineData.map((v) => v * 0.5),
      },
    ],
  };

  return (
    <div className={`${css.chartContent} ${isExpanded ? css.expanded : ""}`}>
      <ReactECharts option={finalOption} style={{ height: "100%", width: "100%" }} theme="dark" notMerge={true} />
    </div>
  );
};

export default Chart3;
