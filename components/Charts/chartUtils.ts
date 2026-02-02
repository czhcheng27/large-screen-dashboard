import * as echarts from "echarts";
import { TooltipParam, DataPoint } from "./types";
import { chart1Data } from "@/mockData";

/** 将数值数组格式化为 DataPoint 数组 */
export const formatData = (data: number[]): DataPoint[] => {
  return data.map((el) => ({ value: el }));
};

export interface ChartConfig {
  fontSize: number;
  barWidth: number;
  overlayBarWidth: number;
  legendItemWidth: number;
  legendItemHeight: number;
  gridTop: number;
  gridBottom: number;
  gridLeft: number;
  gridRight: number;
  maxVisibleItems: number;
  yAxisTitleFontSize: number;
  yAxisTitlePadding: number[];
  legendItemGap: number;
  xAxisLabelRotate: number;
  animationDuration: number;
  tooltipCss: string;
}

export const getChartConfig = (isExpanded: boolean): ChartConfig => ({
  fontSize: isExpanded ? 14 : 10,
  barWidth: isExpanded ? 20 : 12,
  overlayBarWidth: isExpanded ? 24 : 15,
  legendItemWidth: isExpanded ? 25 : 12,
  legendItemHeight: isExpanded ? 14 : 8,
  gridTop: isExpanded ? 90 : 80,
  gridBottom: isExpanded ? 30 : 20,
  gridLeft: isExpanded ? 30 : 16,
  gridRight: isExpanded ? 30 : 16,
  maxVisibleItems: isExpanded ? 18 : 11,
  yAxisTitleFontSize: isExpanded ? 16 : 12,
  yAxisTitlePadding: [0, -10, 8, 0],
  legendItemGap: isExpanded ? 24 : 12,
  xAxisLabelRotate: isExpanded ? 0 : 45,
  animationDuration: isExpanded ? 0 : 1000,
  tooltipCss: isExpanded ? centerCssExtra : normalCssExtra,
});

const normalCssExtra =
  "border: 2px solid #00FFF6; min-width: 191px; background: #05253fff; border-radius: 4px; color: white !important";
const centerCssExtra =
  "border: 2px solid #00FFF6; min-width: 280px; background: #05253fff; border-radius: 4px; color: white !important";

export const commonTooltipFormatter = (params: any[], config: any) => {
  let res = `<div style="margin-bottom: 8px; font-weight: 600; color: #fff; font-size: ${config.fontSize + 2
    }px;">${params[0].name}</div>`;

  params.forEach((item) => {
    const isLine = item.seriesType === "line";

    // --- 颜色处理逻辑升级 ---
    let displayColor = "";

    if (typeof item.color === "string") {
      displayColor = item.color;
    } else if (item.color && item.color.colorStops) {
      // 如果是渐变对象，取第一个渐变点的颜色作为图标颜色
      displayColor = item.color.colorStops[0].color;
    } else {
      // Fallback 兜底方案
      displayColor = item.seriesName === "Growth Rate" ? "#00FFE4" : "#25BCC9";
    }

    // 针对 Growth Rate 强制使用青色（匹配你的 legend 和 lineStyle）
    if (item.seriesName === "Growth Rate") {
      displayColor = "#00FFE4";
    }

    const icon = isLine
      ? `<span style="display:inline-block;margin-right:8px;width:12px;height:3px;background-color:${displayColor};vertical-align:middle;border-radius:2px;box-shadow: 0 0 6px ${displayColor};"></span>`
      : `<span style="display:inline-block;margin-right:8px;width:10px;height:10px;border-radius:50%;background-color:${displayColor};border: 1px solid rgba(255,255,255,0.5);box-shadow: 0 0 4px ${displayColor}66;"></span>`;

    res += `<div style="display:flex;align-items:center;margin-bottom:6px;min-width:140px;">
      ${icon}
      <span style="flex:1;margin-right:24px;color:rgba(255,255,255,0.8);font-size:${config.fontSize}px;">${item.seriesName}</span>
      <span style="font-weight:700;color:#fff;font-family: 'PingFang SC', monospace;font-size:${config.fontSize}px;">
        ${item.value}${isLine ? " %" : ""}
      </span>
    </div>`;
  });
  return res;
};

// line dot color
export const lineDotColor = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  { offset: 0, color: "#20FFE7" },
  { offset: 1, color: "#25BCC9" },
]);

export const getLineSeries = (
  isExpanded: boolean,
  color = lineDotColor,
  yAxisIndex = 1,
) => {
  return {
    type: "line",
    yAxisIndex,
    symbolSize: isExpanded ? [12, 12] : [8, 8],
    emphasis: {
      focus: "series",
      disabled: true,
    },
    itemStyle: { color },
    lineStyle: {
      width: 2,
      type: "solid",
      color: "#00FFE4",
    },
    // 阴影
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "rgba(66,115,246,0.3)" },
        { offset: 0.5, color: "rgba(13, 51, 100, 0.1)" },
        { offset: 1, color: "rgba(0,0,0,0.1)" },
      ]),
    },
  };
};

export const getNormalBarSeries = (
  isExpanded = false,
  linearColor1 = "",
  linearColor2 = "",
) => {
  const config = getChartConfig(isExpanded);
  return {
    type: "bar",
    stack: "Sales",
    barWidth: config.barWidth,
    emphasis: {
      focus: "series",
      disabled: true,
    },
    itemStyle: {
      borderWidth: 2,
      borderColor: "#02526b",
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: linearColor1 },
        { offset: 1, color: linearColor2 },
      ]),
    },
  };
};

export const getNormalBarSeriesOverlay = (
  isExpanded = false,
  linearColor1 = "",
  linearColor2 = "",
) => {
  const config = getChartConfig(isExpanded);
  return {
    type: "bar",
    stack: "y",
    barWidth: config.overlayBarWidth,
    // barWidth: 18,
    barGap: "-91%",
    tooltip: { show: false },
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: linearColor1 },
        { offset: 1, color: linearColor2 },
      ]),
      borderRadius: [8, 8, 0, 0],
      borderColor: "transparent",
      borderWidth: null,
    },
    emphasis: {
      focus: "series",
      disabled: true,
    },
  };
};

export const getTotalData = (array: any[]) => {
  let res = [];
  for (let i = 0; i < array[0].length; i++) {
    let num = 0;
    for (let j = 0; j < array.length; j++) {
      num += array[j][i].value;
    }
    res.push({ value: num + num * 0.01 });
  }
  return res;
};

export const getCommonOption = (isExpanded: boolean) => {
  const config = getChartConfig(isExpanded);
  return {
    config,
    option: {
      backgroundColor: "transparent",
      animationDuration: config.animationDuration,
      tooltip: {
        trigger: "axis",
        extraCssText: config.tooltipCss,
        axisPointer: {
          type: "shadow",
          shadowStyle: { color: "rgba(255, 255, 255, 0.05)" },
        },
        backgroundColor: "rgba(16, 24, 40, 0.95)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: [12, 16],
        textStyle: { color: "#fff", fontSize: config.fontSize },
        formatter: (params: TooltipParam[]) =>
          commonTooltipFormatter(params, { fontSize: config.fontSize }),
      },
      legend: {
        top: 10,
        left: "center",
        textStyle: {
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: config.fontSize,
        },
        itemWidth: config.legendItemWidth,
        itemHeight: config.legendItemHeight,
        itemGap: config.legendItemGap,
      },
      grid: {
        top: config.gridTop,
        left: config.gridLeft,
        right: config.gridRight,
        bottom: config.gridBottom,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        axisTick: { show: false },
        axisLabel: {
          color: "rgba(255, 255, 255, 0.4)",
          fontSize: config.fontSize,
          interval: 0,
          rotate: config.xAxisLabelRotate,
        },
        axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.1)" } },
      },
      yAxis: [
        {
          type: "value",
          position: "left",
          name: "Sales Volume",
          nameTextStyle: {
            fontSize: config.yAxisTitleFontSize,
            fontWeight: 600,
            color: "#fff",
            padding: config.yAxisTitlePadding,
          },
          axisLabel: {
            color: "rgba(255, 255, 255, 0.4)",
            fontSize: config.fontSize,
          },
          splitLine: {
            lineStyle: { color: "rgba(255, 255, 255, 0.05)", type: "dashed" },
          },
        },
        {
          type: "value",
          position: "right",
          name: "Growth",
          nameTextStyle: {
            fontSize: config.yAxisTitleFontSize,
            fontWeight: 600,
            color: "#fff",
            padding: config.yAxisTitlePadding,
          },
          axisLabel: {
            color: "rgba(255, 255, 255, 0.4)",
            fontSize: config.fontSize,
          },
          splitLine: { show: false },
        },
      ],
      dataZoom: commonDataZoom(config, chart1Data?.barData1?.length),
    },
  };
};

const commonDataZoom = (config: ChartConfig, datalength = 0) => {
  const maxVisibleItems = config.maxVisibleItems;
  const shouldShowScroll = datalength > maxVisibleItems;

  // 计算显示百分比：当数据量超过最大可见数时，end 值需要调整
  const endPercent = shouldShowScroll
    ? (maxVisibleItems / datalength) * 100
    : 100;

  return [
    {
      type: "inside",
      start: 0,
      end: endPercent,
    },
    {
      type: "slider",
      show: shouldShowScroll,
      start: 0,
      end: endPercent,
      height: 8,
      bottom: 8,
      backgroundColor: "rgba(255,255,255,0.03)",
      fillerColor: "rgba(255, 255, 255, 0.1)",
      borderColor: "transparent",
      handleSize: "150%",
      textStyle: { opacity: 0 },
    },
  ];
};
