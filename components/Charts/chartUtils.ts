import { TooltipParam } from "./types";

export interface ChartConfig {
  isExpanded: boolean;
  fontSize: number;
  barWidth: number;
  legendItemWidth: number;
  legendItemHeight: number;
  gridTop: number;
  gridBottom: number;
  gridLeft: number;
  gridRight: number;
}

export const getChartConfig = (isExpanded: boolean): ChartConfig => ({
  fontSize: isExpanded ? 14 : 10,
  barWidth: isExpanded ? 24 : 10,
  legendItemWidth: isExpanded ? 25 : 12,
  legendItemHeight: isExpanded ? 14 : 8,
  gridTop: isExpanded ? 80 : 40,
  gridBottom: isExpanded ? 60 : 30,
  gridLeft: 10,
  gridRight: 10,
});

export const commonTooltipFormatter = (params: TooltipParam[], config: ChartConfig) => {
  let res = `<div style="margin-bottom: 8px; font-weight: 600; color: #fff; font-size: ${
    config.fontSize + 2
  }px;">${params[0].name}</div>`;
  params.forEach((item) => {
    const isLine = item.seriesType === "line";
    const icon = isLine
      ? `<span style="display:inline-block;margin-right:8px;width:12px;height:3px;background-color:${item.color};vertical-align:middle;border-radius:2px;box-shadow: 0 0 8px ${item.color};"></span>`
      : `<span style="display:inline-block;margin-right:8px;width:10px;height:10px;border-radius:50%;background-color:${item.color};border: 2px solid rgba(255,255,255,0.2);"></span>`;
    res += `<div style="display:flex;align-items:center;margin-bottom:6px;">
      ${icon}
      <span style="flex:1;margin-right:24px;color:rgba(255,255,255,0.7);">${item.seriesName}</span>
      <span style="font-weight:700;color:#fff;font-family: monospace;">${item.value}</span>
    </div>`;
  });
  return res;
};

export const getCommonOption = (isExpanded: boolean) => {
  const config = getChartConfig(isExpanded);
  return {
    config,
    option: {
      backgroundColor: "transparent",
      animationDuration: isExpanded ? 0 : 1000, // 放大时减少内部动画以避免冲突
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
          shadowStyle: { color: "rgba(255, 255, 255, 0.05)" },
        },
        backgroundColor: "rgba(16, 24, 40, 0.95)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: [12, 16],
        textStyle: { color: "#fff", fontSize: config.fontSize },
        formatter: (params: TooltipParam[]) => commonTooltipFormatter(params, config),
      },
      legend: {
        top: 10,
        left: "center", // 居中展示
        textStyle: { color: "rgba(255, 255, 255, 0.6)", fontSize: config.fontSize },
        itemWidth: config.legendItemWidth,
        itemHeight: config.legendItemHeight,
        itemGap: isExpanded ? 24 : 12,
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
          rotate: isExpanded ? 0 : 45,
        },
        axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.1)" } },
      },
      yAxis: [
        {
          type: "value",
          position: "left",
          axisLabel: { color: "rgba(255, 255, 255, 0.4)", fontSize: config.fontSize },
          splitLine: { lineStyle: { color: "rgba(255, 255, 255, 0.05)", type: "dashed" } },
        },
        {
          type: "value",
          position: "right",
          axisLabel: { color: "rgba(255, 255, 255, 0.4)", fontSize: config.fontSize },
          splitLine: { show: false },
        },
      ],
      dataZoom: [
        { type: "inside", start: 0, end: 100 },
        {
          type: "slider",
          show: isExpanded, // 只有放大时更强调滚动条，或者可以根据数据长度
          height: 8,
          bottom: 8,
          backgroundColor: "rgba(255,255,255,0.03)",
          fillerColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "transparent",
          handleSize: "150%",
          textStyle: { opacity: 0 },
        },
      ],
    },
  };
};
