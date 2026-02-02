"use client";

import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { chart1Data } from "@/mockData";
import { ChartComponentProps } from "./ChartCard";
import css from "./ChartContent.module.scss";
import Circle from "../../public/circle.png";
import {
  getCommonOption,
  getLineSeries,
  getNormalBarSeries,
  getNormalBarSeriesOverlay,
  getTotalData,
  formatData,
} from "./chartUtils";
import type { TooltipCallbackParam, BarSeriesItem } from "./types";

const line = `<span class="line1"></span>`;

const Chart1 = ({ isExpanded }: ChartComponentProps) => {
  const { option, config } = getCommonOption(isExpanded);

  const data1 = formatData(chart1Data.barData1);
  const data2 = formatData(chart1Data.barData2);
  const data3 = formatData(chart1Data.barData3);

  const seriesData: BarSeriesItem[] = [
    {
      name: "Sales A",
      data: data1,
      ...getNormalBarSeries(isExpanded, "#DD7575", "#EE3532"),
      z: 3, // 在冲击波上层
    },
    {
      name: "Sales B",
      data: data2,
      ...getNormalBarSeries(isExpanded, "#FFCD91", "#EB9233"),
      z: 3, // 在冲击波上层
    },
    {
      name: "Sales C",
      data: data3,
      ...getNormalBarSeries(isExpanded, "#59C7B2", "#59C7B2"),
      z: 3, // 在冲击波上层
    },
    {
      name: "Growth Rate",
      data: formatData(chart1Data.lineData),
      symbol: `image://${Circle.src}`,
      ...getLineSeries(isExpanded),
      z: 4, // 折线图在最上层
    },
    {
      /* TIP: 增加的无效series，为图例使用 */
      name: "Rate",
      type: "line",
      symbol: "none",
      color: "transparent",
      z: 5,
      data: [],
    },
    {
      name: "Overlay",
      ...getNormalBarSeriesOverlay(isExpanded, "#EE3532", "transparent"),
      data: getTotalData([data1, data2, data3]),
      z: 1, // 冲击波在最底层
    },
  ];

  // 只处理有 data 的 bar 系列（前3个）
  const barSeries = seriesData.slice(0, 3);
  const overlaySeries = seriesData[seriesData.length - 1];

  for (let i = 0; i < barSeries[0].data.length; i++) {
    for (const item of barSeries) {
      const dataPoint = item.data[i];
      // value 为0的柱图，边框改为透明
      if (dataPoint.value === 0) {
        dataPoint.itemStyle = {
          ...(item.itemStyle as Record<string, unknown>),
          borderColor: "transparent",
        };
      }
      // value 不为0的顶部柱图，边框设置圆角，并为冲击波赋色
      if (dataPoint.value !== 0) {
        dataPoint.itemStyle = {
          ...(item.itemStyle as Record<string, unknown>),
          borderRadius: [5, 5, 0, 0],
        };
        // 为冲击波赋色
        const itemStyle = dataPoint.itemStyle as Record<string, unknown>;
        const colorObj = itemStyle?.color as {
          colorStops?: { color: string }[];
        };
        const topColor = colorObj?.colorStops?.[0]?.color ?? "#EE3532";

        overlaySeries.data[i] = {
          ...overlaySeries.data[i],
          itemStyle: {
            ...(overlaySeries.itemStyle as Record<string, unknown>),
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: topColor },
              { offset: 1, color: "transparent" },
            ]),
          },
        };
        break;
      }
    }
  }

  const finalOption = {
    ...option,
    tooltip: {
      ...option.tooltip,
      formatter: function (params: TooltipCallbackParam[]) {
        // 控制 tooltip 显示的样式
        let relVal =
          `<div class="${isExpanded ? "center_title1" : "title1"}">` +
          `${params[0].axisValue}` +
          "</div>";
        const length = params.length - 1;
        for (let i = length; i >= 0; i--) {
          // marker 是带颜色的小圆圈，seriesName 是系列名称，value 是值
          if (params[i].value !== 0) {
            relVal +=
              `<div class="${isExpanded ? "center_eachRow1" : "eachRow1"}">` +
              "<div>" +
              `${i === 0 ? line : params[i].marker}` +
              `<span class="${
                isExpanded ? "center_seriesName1" : "seriesName1"
              }">` +
              params[i].seriesName +
              "</span>" +
              "</div>" +
              '<div style="height: 14px;line-height: 14px">' +
              `${params[i].value}${i === 0 ? "%" : ""}` +
              "</div>" +
              "</div>";
          }
        }
        return relVal;
      },
    },
    legend: {
      ...option.legend,
      data: [
        { name: "Sales A", icon: "circle" },
        { name: "Sales B", icon: "circle" },
        { name: "Sales C", icon: "circle" },
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
    yAxis: option.yAxis,
    series: seriesData.reverse(),
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
