// 共享的高阶组件
"use client";

import { useRef, useCallback } from "react";
import {
  useDashboardStore,
  ChartId,
  CHART_POSITION_MAP,
  FilterValue,
} from "@/store";
import CardWrapper from "../CardWrapper";

export interface ChartComponentProps {
  /** 是否处于放大状态（用于调整 echarts 样式） */
  isExpanded: boolean;
  /** 当前过滤器值 */
  filter: FilterValue;
}

export interface ChartCardProps {
  /** 图表唯一标识 */
  chartId: ChartId;
  /** 卡片标题 */
  title: string;
  /** 是否显示过滤器 */
  showFilter?: boolean;
  /** 图表内容渲染函数 */
  children: (props: ChartComponentProps) => React.ReactNode;
}

/**
 * ChartCard 高阶组件
 * 封装了放大/缩小功能、过滤器同步等逻辑
 */
const ChartCard = ({
  chartId,
  title,
  showFilter = false,
  children,
}: ChartCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const position = CHART_POSITION_MAP[chartId];

  const { expandCard, expandedCard, chartFilters } = useDashboardStore();

  // 当前图表的过滤器
  const filter = chartFilters[chartId];

  // 是否是当前被放大的图表
  const isCurrentExpanded = expandedCard?.chartId === chartId;

  const handleExpand = useCallback(() => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    expandCard({
      chartId,
      position,
      title,
      showFilter,
      sourceRect: rect,
    });
  }, [chartId, position, title, showFilter, expandCard]);

  return (
    <div ref={cardRef} style={{ width: "100%", height: "100%" }}>
      <CardWrapper
        title={title}
        chartId={chartId}
        position={position}
        showFilter={showFilter}
        hideExpandIcon={isCurrentExpanded}
        onExpand={handleExpand}
      >
        {children({ isExpanded: false, filter: filter.dateRange })}
      </CardWrapper>
    </div>
  );
};

export default ChartCard;
