"use client";

import ReactECharts from "echarts-for-react";
import { ChartComponentProps } from "./ChartCard";
import css from "./ChartContent.module.scss";
import { chart1Data } from "@/mockData";
import { getCommonOption } from "./chartUtils";

const Chart2 = ({ isExpanded }: ChartComponentProps) => {
  const { option, config } = getCommonOption(isExpanded);

  const finalOption = {
    ...option,
    legend: {
      ...option.legend,
      data: [
        { name: "Order Vol", icon: "circle" },
        { name: "Shipment", icon: "circle" },
        { name: "Efficiency", icon: "line" },
      ],
    },
    xAxis: { ...option.xAxis, data: chart1Data.categories },
    series: [
      {
        name: "Order Vol",
        type: "bar",
        stack: "v",
        barWidth: config.barWidth,
        itemStyle: { color: "#73c0de", borderRadius: 0 },
        data: chart1Data.barData1.map((v) => v * 0.8),
      },
      {
        name: "Shipment",
        type: "bar",
        stack: "v",
        barWidth: config.barWidth,
        itemStyle: { color: "#ee6666", borderRadius: [4, 4, 0, 0] },
        data: chart1Data.barData2.map((v) => v * 0.7),
      },
      {
        name: "Efficiency",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        itemStyle: { color: "#3ba272" },
        data: chart1Data.lineData.map((v) => v * 1.2),
      },
    ],
  };

  return (
    <div className={`${css.chartContent} ${isExpanded ? css.expanded : ""}`}>
      <ReactECharts option={finalOption} style={{ height: "100%", width: "100%" }} theme="dark" notMerge={true} />
    </div>
  );
};

export default Chart2;
