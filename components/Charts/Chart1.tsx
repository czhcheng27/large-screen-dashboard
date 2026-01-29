"use client";

import ReactECharts from "echarts-for-react";
import { ChartComponentProps } from "./ChartCard";
import css from "./ChartContent.module.scss";
import { chart1Data } from "@/mockData";
import { getCommonOption } from "./chartUtils";

const Chart1 = ({ isExpanded }: ChartComponentProps) => {
  const { option, config } = getCommonOption(isExpanded);

  const finalOption = {
    ...option,
    legend: {
      ...option.legend,
      data: [
        { name: "Sales A", icon: "circle" },
        { name: "Sales B", icon: "circle" },
        { name: "Growth Rate", icon: "line" },
      ],
    },
    xAxis: {
      ...option.xAxis,
      data: chart1Data.categories,
    },
    yAxis: [
      {
        ...option.yAxis[0],
        name: isExpanded ? "Sales Volume" : "",
      },
      {
        ...option.yAxis[1],
        name: isExpanded ? "Growth" : "",
      },
    ],
    series: [
      {
        name: "Sales A",
        type: "bar",
        stack: "total",
        barWidth: config.barWidth,
        itemStyle: {
          color: "#5470c6",
          borderRadius: 0,
        },
        data: chart1Data.barData1,
      },
      {
        name: "Sales B",
        type: "bar",
        stack: "total",
        barWidth: config.barWidth,
        itemStyle: {
          color: "#91cc75",
          borderRadius: [config.barWidth / 3, config.barWidth / 3, 0, 0],
        },
        data: chart1Data.barData2,
      },
      {
        name: "Growth Rate",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        symbol: "circle",
        symbolSize: isExpanded ? 10 : 6,
        lineStyle: {
          width: isExpanded ? 4 : 2,
          color: "#fac858",
        },
        itemStyle: {
          color: "#fac858",
          borderWidth: 2,
          borderColor: "#fff",
        },
        data: chart1Data.lineData,
      },
    ],
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

export default Chart1;
