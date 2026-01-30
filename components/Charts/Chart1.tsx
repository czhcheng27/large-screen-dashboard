"use client";

import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { ChartComponentProps } from "./ChartCard";
import css from "./ChartContent.module.scss";
import { chart1Data } from "@/mockData";
import Circle from "../../public/circle.png";
import {
  getCommonOption,
  getLineSeries,
  getNormalBarSeries,
} from "./chartUtils";

const Chart1 = ({ isExpanded }: ChartComponentProps) => {
  const { option, config } = getCommonOption(isExpanded);

  const finalOption = {
    ...option,
    legend: {
      ...option.legend,
      orient: "horizontal",
      x: "center",
      y: "top",
      itemHeight: isExpanded ? 14 : 10,
      itemWidth: isExpanded ? 14 : 10,
      itemGap: 24,
      selectedMode: false,
      textStyle: {
        fontSize: isExpanded ? 14 : 10,
        lineHeight: isExpanded ? 14 : 10,
        fontWeight: "bold",
        color: "#1F6AAB",
      },
      data: [
        { name: "Sales A", icon: "circle" },
        { name: "Sales B", icon: "circle" },
        {
          name: "Growth Rate",
          // 关键点 2：使用 path 绘制一个扁长的矩形 (x y width height)
          // 下面的路径代表：从 (0, 0) 开始，画一个宽 1000, 高 100 的矩形
          icon: "path://M0 0 h1000 v200 h-1000 z",
          itemStyle: {
            color: "#00FFE4",
          },
        },
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
        data: chart1Data.barData1,
        ...getNormalBarSeries(isExpanded, "#FFCD91", "#EB9233"),
      },
      {
        name: "Sales B",
        data: chart1Data.barData2,
        ...getNormalBarSeries(isExpanded, "#59C7B2", "#59C7B2"),
      },
      {
        name: "Sales C",
        data: chart1Data.barData3,
        ...getNormalBarSeries(isExpanded, "#DD7575", "#EE3532"),
      },
      {
        name: "Growth Rate",
        data: chart1Data.lineData,
        symbol: `image://${Circle.src}`,
        ...getLineSeries(isExpanded),
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
