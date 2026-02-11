"use client";

import { create } from "zustand";

// ============ 类型定义 ============

export type ChartId =
  | "chart1"
  | "chart2"
  | "chart3"
  | "chart4"
  | "chart5"
  | "chart6";

export type CardPosition =
  | "left-top"
  | "left-bottom"
  | "right-top"
  | "right-bottom"
  | "center-bottom-left"
  | "center-bottom-right";

/** Chart ID 和 Position 的映射 */
export const CHART_POSITION_MAP: Record<ChartId, CardPosition> = {
  chart1: "left-top",
  chart2: "left-bottom",
  chart3: "center-bottom-left",
  chart4: "center-bottom-right",
  chart5: "right-top",
  chart6: "right-bottom",
};

/** Position 到 Chart ID 的反向映射 */
export const POSITION_CHART_MAP: Record<CardPosition, ChartId> = {
  "left-top": "chart1",
  "left-bottom": "chart2",
  "center-bottom-left": "chart3",
  "center-bottom-right": "chart4",
  "right-top": "chart5",
  "right-bottom": "chart6",
};

export type FilterValue = "day" | "week" | "month" | "year";

export interface ChartFilter {
  dateRange: FilterValue;
}

export interface Chart6Filter {
  selectedCity: "ON" | "BC" | "AB";
}

/** 简单的矩形信息接口，替代 DOMRect 以便手动调整 */
export interface SimpleRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface ExpandedCardInfo {
  /** 图表唯一标识 */
  chartId: ChartId;
  /** 卡片位置 */
  position: CardPosition;
  /** 卡片标题 */
  title: string;
  /** 是否显示过滤器 */
  showFilter: boolean;
  /** 源卡片的 DOM 位置信息 */
  sourceRect: DOMRect;
  /** 目标区域（center top）的 DOM 位置信息 */
  targetRect: SimpleRect;
}

// ============ Store 状态 ============

interface DashboardState {
  /** 当前展开的卡片信息 */
  expandedCard: ExpandedCardInfo | null;
  /** 动画状态: idle | expanding | collapsing */
  animationState: "idle" | "expanding" | "collapsing";
  /** center top 区域的位置信息 */
  centerTopRect: DOMRect | null;
  /** 各图表的过滤器状态 */
  chartFilters: Record<ChartId, ChartFilter>;
  /** Chart6 特有的过滤器状态 */
  chart6Filter: Chart6Filter;
  /** 待展开的卡片信息（用于切换时暂存） */
  pendingExpandCard: Omit<ExpandedCardInfo, "targetRect"> | null;

  // Actions
  setCenterTopRect: (rect: DOMRect | null) => void;
  expandCard: (info: Omit<ExpandedCardInfo, "targetRect">) => void;
  collapseCard: () => void;
  onAnimationComplete: () => void;
  setChartFilter: (chartId: ChartId, filter: Partial<ChartFilter>) => void;
  getChartFilter: (chartId: ChartId) => ChartFilter;
  setChart6City: (city: "ON" | "BC" | "AB") => void;
}

const DEFAULT_FILTER: ChartFilter = {
  dateRange: "week",
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  expandedCard: null,
  animationState: "idle",
  centerTopRect: null,
  pendingExpandCard: null,
  chartFilters: {
    chart1: { ...DEFAULT_FILTER },
    chart2: { ...DEFAULT_FILTER },
    chart3: { ...DEFAULT_FILTER },
    chart4: { ...DEFAULT_FILTER },
    chart5: { ...DEFAULT_FILTER },
    chart6: { ...DEFAULT_FILTER },
  },
  chart6Filter: {
    selectedCity: "ON",
  },

  setCenterTopRect: (rect) => set({ centerTopRect: rect }),

  expandCard: (info) => {
    const { centerTopRect, expandedCard, animationState } = get();
    if (!centerTopRect) return;

    // 如果已有展开的卡片，先收起，并暂存待展开的卡片
    if (expandedCard && animationState === "idle") {
      set({
        animationState: "collapsing",
        pendingExpandCard: info,
      });
    } else if (animationState === "idle") {
      const targetRect: SimpleRect = {
        top: centerTopRect.top,
        left: centerTopRect.left,
        width: centerTopRect.width,
        height: centerTopRect.height,
      };

      set({
        expandedCard: { ...info, targetRect },
        animationState: "expanding",
      });
    }
  },

  collapseCard: () => {
    const { animationState } = get();
    if (animationState === "idle") {
      set({ animationState: "collapsing", pendingExpandCard: null });
    }
  },

  onAnimationComplete: () => {
    const { animationState, pendingExpandCard, centerTopRect } = get();

    if (animationState === "collapsing") {
      // 收起动画完成
      if (pendingExpandCard && centerTopRect) {
        const targetRect: SimpleRect = {
          top: centerTopRect.top,
          left: centerTopRect.left,
          width: centerTopRect.width,
          height: centerTopRect.height,
        };

        // 有待展开的卡片，立即展开
        set({
          expandedCard: { ...pendingExpandCard, targetRect },
          animationState: "expanding",
          pendingExpandCard: null,
        });
      } else {
        // 没有待展开的卡片，完全收起
        set({
          expandedCard: null,
          animationState: "idle",
        });
      }
    } else if (animationState === "expanding") {
      set({ animationState: "idle" });
    }
  },

  setChartFilter: (chartId, filter) => {
    const { chartFilters } = get();
    set({
      chartFilters: {
        ...chartFilters,
        [chartId]: { ...chartFilters[chartId], ...filter },
      },
    });
  },

  getChartFilter: (chartId) => {
    return get().chartFilters[chartId];
  },

  setChart6City: (city) => {
    set({ chart6Filter: { selectedCity: city } });
  },
}));
