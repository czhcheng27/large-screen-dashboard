"use client";

import { useState } from "react";
import ReactECharts from "echarts-for-react";
import { ChartComponentProps } from "./ChartCard";
import css from "./Chart6.module.scss";
import { chart1Data, dataBJ, dataGZ, dataSH } from "@/mockData";
import { getCommonOption } from "./chartUtils";
import { Chart6DataItem } from "./types";

const sideData7 = [
  {
    title: "Sum Num",
    value: "1280",
  },
  {
    title: "Equiped",
    value: "769",
  },
  {
    title: "Not Perfect",
    value: "20",
  },
  "divider",
  {
    title: "Overall",
    value: "92.5%",
  },
];

const Chart6 = ({ isExpanded }: ChartComponentProps) => {
  const { option, config } = getCommonOption(isExpanded);
  const [selectedCity, setSelectedCity] = useState<string>("ON");

  const lineStyle = {
    width: 1,
    opacity: 0.5,
  };

  // 根据选中的城市设置不同的颜色
  const cityColors: Record<string, string> = {
    ON: "#00fcf9",
    BC: "#F9713C",
    AB: "#B3E4A1",
  };

  const currentColor = cityColors[selectedCity] || "#00fcf9";

  // 响应式配置
  const fontSize = isExpanded ? 16 : 12;
  const indicatorNameGap = isExpanded ? 20 : 10;
  const radarRadius = isExpanded ? "65%" : "60%";

  const finalOption = {
    backgroundColor: "transparent",
    title: undefined,
    legend: {
      bottom: isExpanded ? 10 : 5,
      data: ["ON", "BC", "AB"],
      itemGap: isExpanded ? 30 : 20,
      textStyle: {
        color: "#fff",
        fontSize: fontSize,
      },
      selectedMode: "single",
      selected: {
        ON: selectedCity === "ON",
        BC: selectedCity === "BC",
        AB: selectedCity === "AB",
      },
    },
    radar: {
      indicator: [
        { name: "AQI", max: 300 },
        { name: "PM2.5", max: 250 },
        { name: "PM10", max: 300 },
        { name: "CO", max: 5 },
        { name: "NO2", max: 200 },
        { name: "SO2", max: 100 },
      ],
      shape: "circle",
      splitNumber: 5,
      radius: radarRadius,
      center: ["50%", isExpanded ? "50%" : "48%"],
      axisName: {
        color: currentColor,
        fontSize: fontSize,
      },
      axisNameGap: indicatorNameGap,
      splitLine: {
        lineStyle: {
          color: [
            "rgba(238, 197, 102, 0.1)",
            "rgba(238, 197, 102, 0.2)",
            "rgba(238, 197, 102, 0.4)",
            "rgba(238, 197, 102, 0.6)",
            "rgba(238, 197, 102, 0.8)",
            "rgba(238, 197, 102, 1)",
          ].reverse(),
        },
      },
      splitArea: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "rgba(238, 197, 102, 0.5)",
        },
      },
    },
    series: [
      {
        name: "ON",
        type: "radar",
        lineStyle: lineStyle,
        data: dataBJ,
        symbol: "none",
        itemStyle: {
          color: cityColors.ON,
        },
        areaStyle: {
          opacity: 0.1,
        },
        emphasis: {
          lineStyle: {
            width: 2,
          },
          areaStyle: {
            opacity: 0.2,
          },
        },
      },
      {
        name: "BC",
        type: "radar",
        lineStyle: lineStyle,
        data: dataSH,
        symbol: "none",
        itemStyle: {
          color: cityColors.BC,
        },
        areaStyle: {
          opacity: 0.05,
        },
        emphasis: {
          lineStyle: {
            width: 2,
          },
          areaStyle: {
            opacity: 0.15,
          },
        },
      },
      {
        name: "AB",
        type: "radar",
        lineStyle: lineStyle,
        data: dataGZ,
        symbol: "none",
        itemStyle: {
          color: cityColors.AB,
        },
        areaStyle: {
          opacity: 0.05,
        },
        emphasis: {
          lineStyle: {
            width: 2,
          },
          areaStyle: {
            opacity: 0.15,
          },
        },
      },
    ],
  };

  const renderLeft = () => {
    return (
      <>
        {sideData7.map((el, index) => {
          const isDivider = index == 3;
          return (
            <div key={index} className={isDivider ? css.divide : css.eachBlock}>
              {isDivider ? null : renderEachBlock(el as Chart6DataItem)}
            </div>
          );
        })}
      </>
    );
  };

  const renderEachBlock = (el: Chart6DataItem) => {
    const { title, value } = el;
    return (
      <>
        <div className={css.title}>{title}</div>
        <div className={css.value}>{value}</div>
      </>
    );
  };

  return (
    <div className={`${css.chart6Content} ${isExpanded ? css.expanded : ""}`}>
      <div className="w-full h-full grid grid-cols-12">
        <div className={`col-span-3 ${css.left}`}>{renderLeft()}</div>
        <div className="col-span-9">
          <ReactECharts
            option={finalOption}
            style={{ height: "100%", width: "100%" }}
            theme="dark"
            notMerge={true}
            onEvents={{
              legendselectchanged: (params: any) => {
                setSelectedCity(params.name);
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chart6;
