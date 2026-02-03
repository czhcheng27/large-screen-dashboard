"use client";

import ReactECharts from "echarts-for-react";
import { ChartComponentProps } from "./ChartCard";
import { scatterData } from "@/mockData";
import { getCommonOption } from "./chartUtils";
import { ScatterDataItem } from "./types";
import css from "./ChartContent.module.scss";

export const formatScatter = (array: ScatterDataItem[] = []) => {
  let res: any[] = [];
  array.forEach((el) => {
    const { abilityScore, tacticScore, firstSystem, firstSystemName } = el;
    return res.push({
      firstSystem,
      firstSystemName,
      value: [abilityScore, tacticScore],
    });
  });
  return res;
};

const Chart5 = ({ isExpanded }: ChartComponentProps) => {
  const { option } = getCommonOption(isExpanded);
  const scatterDataFormatted = formatScatter(scatterData);

  const finalOption = {
    // Ensure overall chart background is transparent (avoid theme canvas fill)
    backgroundColor: "transparent",
    tooltip: {
      ...option.tooltip,
      axisPointer: {
        show: true,
        type: "cross",
        lineStyle: {
          type: "dashed",
          width: 1,
        },
      },
      formatter: function (params: any) {
        var relVal =
          `<div class="${isExpanded ? "text-[20px]" : "text-[14px] font-bold"}">` +
          params[0].data.firstSystemName +
          "</div>" +
          `<div class="flex justify-between items-center text-[14px] ${isExpanded ? "mt-3 text-[20px]" : "mt-2"}">` +
          "<div>" +
          `<span class="mr-6">` +
          `Ability Score：` +
          params[0].data.value[0] +
          "</span>" +
          "</div>" +
          '<div style="height: 14px;line-height: 14px">' +
          `Tactic Score：` +
          params[0].data.value[1] +
          "</div>" +
          "</div>";
        return relVal;
      },
    },
    grid: {
      left: "7%",
      right: "3%",
      // top: 24,
      top: 30,
      bottom: 25,
      containLabel: true,
      show: true,
      borderWidth: 0,
      backgroundColor: "#052743",
    },
    xAxis: [
      {
        name: "Ability Score",
        nameLocation: "middle",
        nameTextStyle: {
          color: "white",
          fontSize: isExpanded ? 16 : 12, //字体大小
          padding: [5, 5, -25, 5], //距离坐标位置的距离
          verticalAlign: "bottom",
        },
        type: "value",
        scale: true,
        min: 0,
        max: 100,
        interval: 20,
        splitLine: {
          show: false,
        },
        axisLabel: {
          fontSize: isExpanded ? 14 : 10,
          color: "white",
        },
        axisLine: {
          lineStyle: {
            color: "transparent",
          },
        },
      },
    ],
    yAxis: [
      {
        name: "Tactic Score",
        nameLocation: "middle",
        nameTextStyle: {
          color: "white",
          fontSize: isExpanded ? 16 : 12, //字体大小
          padding: [5, 5, 10, 5], //距离坐标位置的距离
          verticalAlign: "bottom",
        },
        type: "value",
        scale: true,
        min: 0,
        max: 10,
        interval: 2,
        splitLine: {
          show: false,
        },
        axisLabel: {
          fontSize: isExpanded ? 14 : 10,
          color: "white",
        },
        axisLine: {
          lineStyle: {
            color: "transparent",
          },
        },
      },
    ],
    series: [
      {
        type: "scatter",
        data: scatterDataFormatted,
        dimensions: ["x", "y"],
        symbolSize: 5,
        itemStyle: {
          color: "#01F6FC",
        },
        markLine: {
          silent: true,
          animation: false,
          symbol: ["none", "none"],
          lineStyle: {
            silent: true,
            type: "dashed",
            color: "#6986FF",
          },
          data: [
            { yAxis: 5, label: { position: "start", color: "#FF6B6B" } },
            { xAxis: 50, label: { position: "start", color: "#FF6B6B" } },
          ],
        },
      },
    ],
  };

  return (
    <div className={` ${css.chartContent} ${isExpanded ? css.expanded : ""}`}>
      <ReactECharts
        option={finalOption}
        style={{ height: "100%", width: "100%" }}
        theme="dark"
        notMerge={true}
      />
    </div>
  );
};

export default Chart5;
