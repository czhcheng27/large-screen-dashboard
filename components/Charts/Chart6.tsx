"use client";

import { useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { useDashboardStore } from "@/store";
import { dataLeft, dataON, dataAB, dataBC } from "@/mockData";
import { ChartComponentProps } from "./ChartCard";
import { Chart6DataItem } from "./types";
import css from "./Chart6.module.scss";

const Chart6 = ({ isExpanded }: ChartComponentProps) => {
  const { chart6Filter, setChart6City } = useDashboardStore();
  const selectedCity = chart6Filter.selectedCity;

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
  const fontSize = isExpanded ? 20 : 12;
  const indicatorNameGap = isExpanded ? 25 : 10;
  const radarRadius = isExpanded ? "50%" : "60%";
  const radarCenterY = isExpanded ? "42%" : "48%";
  const legendItemGap = isExpanded ? 40 : 20;
  const legendBottom = isExpanded ? 20 : 5;

  const finalOption = {
    backgroundColor: "transparent",
    title: undefined,
    legend: {
      bottom: legendBottom,
      data: ["ON", "BC", "AB"],
      itemGap: legendItemGap,
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
      center: ["50%", radarCenterY],
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
        data: dataON,
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
        data: dataBC,
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
        data: dataAB,
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
        {dataLeft.map((el, index) => {
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
                setChart6City(params.name);
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chart6;
