"use client";

import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { chart1Data } from "@/mockData";
import { ChartComponentProps } from "./ChartCard";
import css from "./ChartContent.module.scss";
import {
  get3dBarSeries,
  get3dBarSeriesCap,
  getCommonOption,
  getLineSeries,
} from "./chartUtils";

export const planBarColor2 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0.1, color: "rgba(25, 147, 217, 100)" },
  { offset: 0.9, color: "rgba(44, 139, 163, 0.1)" },
  { offset: 1, color: "rgba(54, 141, 187, 100)" },
]);

export const releasedBarColor2 = new echarts.graphic.LinearGradient(
  0,
  0,
  1,
  0,
  [
    { offset: 0, color: "#72BEFF" },
    { offset: 0.5, color: "#B6DCFF" },
    { offset: 1, color: "#63A3FF" },
  ],
);

const Chart2 = ({ isExpanded }: ChartComponentProps) => {
  const { option } = getCommonOption(isExpanded);

  const seriesData = [
    {
      name: "Overall",
      data: chart1Data.barData1,
      barGap: "-100%",
      ...get3dBarSeries(planBarColor2, isExpanded),
    },
    // planCount Cap 顶部圆盘
    {
      ...get3dBarSeriesCap("#0F82DB", isExpanded),
      name: "Overall",
      data: chart1Data.barData1,
    },
    {
      name: "Received",
      data: chart1Data.lineData.map((v) => v * 0.9),
      ...get3dBarSeries(releasedBarColor2, isExpanded),
    },
    // succplanCount Cap 顶部圆盘
    {
      ...get3dBarSeriesCap("#93A5CF", isExpanded),
      name: "Received",
      data: chart1Data.lineData.map((v) => v * 0.9),
    },

    {
      name: "Efficiency",
      data: chart1Data.lineData,
      symbol: `circle`,
      ...getLineSeries(isExpanded),
    },

    {
      /* TIP: 增加的无效series，为图例使用 */
      type: "line",
      symbol: "none",
      name: `Efficiency`,
      color: "transparent",
    },
  ];

  const finalOption = {
    ...option,
    legend: {
      ...option.legend,
      data: [
        { name: "Overall", icon: "circle" },
        { name: "Received", icon: "circle" },
        {
          name: "Efficiency",
          icon: "path://M0 0 h1000 v200 h-1000 z",
          itemStyle: {
            color: "#00FFE4",
          },
        },
      ],
    },
    xAxis: { ...option.xAxis, data: chart1Data.categories },
    yAxis: [
      { ...option.yAxis[0], name: "Volume" },
      { ...option.yAxis[1], name: "Efficiency" },
    ],
    series: seriesData,
  };

  return (
    <div className={`${css.chartContent} ${isExpanded ? css.expanded : ""}`}>
      <ReactECharts
        option={finalOption}
        style={{ height: "100%", width: "100%" }}
        theme="dark"
        notMerge={true}
      />
    </div>
  );
};

export default Chart2;
