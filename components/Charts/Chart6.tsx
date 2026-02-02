"use client";

import { useState } from "react";
import ReactECharts from "echarts-for-react";
import { ChartComponentProps } from "./ChartCard";
import css from "./ChartContent.module.scss";
import { chart1Data, dataBJ, dataGZ, dataSH } from "@/mockData";
import { getCommonOption } from "./chartUtils";

const Chart6 = ({ isExpanded }: ChartComponentProps) => {
  const { option, config } = getCommonOption(isExpanded);
  const [selectedCity, setSelectedCity] = useState<string>("Beijing");

  const lineStyle = {
    width: 1,
    opacity: 0.5,
  };

  // 根据选中的城市设置不同的颜色
  const cityColors: Record<string, string> = {
    Beijing: "#59C7B2",
    Shanghai: "#F9713C",
    Guangzhou: "#B3E4A1",
  };

  const currentColor = cityColors[selectedCity] || "#59C7B2";

  // 响应式配置
  const fontSize = isExpanded ? 16 : 12;
  const indicatorNameGap = isExpanded ? 20 : 10;
  const radarRadius = isExpanded ? "65%" : "60%";

  const finalOption = {
    backgroundColor: "transparent",
    title: undefined,
    legend: {
      bottom: isExpanded ? 10 : 5,
      data: ["Beijing", "Shanghai", "Guangzhou"],
      itemGap: isExpanded ? 30 : 20,
      textStyle: {
        color: "#fff",
        fontSize: fontSize,
      },
      selectedMode: "single",
      selected: {
        Beijing: selectedCity === "Beijing",
        Shanghai: selectedCity === "Shanghai",
        Guangzhou: selectedCity === "Guangzhou",
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
        name: "Beijing",
        type: "radar",
        lineStyle: lineStyle,
        data: dataBJ,
        symbol: "none",
        itemStyle: {
          color: cityColors.Beijing,
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
        name: "Shanghai",
        type: "radar",
        lineStyle: lineStyle,
        data: dataSH,
        symbol: "none",
        itemStyle: {
          color: cityColors.Shanghai,
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
        name: "Guangzhou",
        type: "radar",
        lineStyle: lineStyle,
        data: dataGZ,
        symbol: "none",
        itemStyle: {
          color: cityColors.Guangzhou,
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

  return (
    <div className={`${css.chartContent} ${isExpanded ? css.expanded : ""}`}>
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
  );
};

export default Chart6;
