"use client";

import css from "./index.module.scss";
import { useDashboardStore, ChartId, FilterValue, CardPosition } from "@/store";

interface CardWrapperProps {
  title: string;
  children: React.ReactNode;
  /** 图表ID */
  chartId?: ChartId;
  /** 卡片位置标识 */
  position?: CardPosition;
  /** 是否显示过滤器 */
  showFilter?: boolean;
  /** 是否隐藏放大按钮 */
  hideExpandIcon?: boolean;
  /** 是否显示缩小按钮 (用于放大后的卡片) */
  showCollapseIcon?: boolean;
  /** 放大按钮点击回调 */
  onExpand?: () => void;
  /** 缩小按钮点击回调 */
  onCollapse?: () => void;
}

const CardWrapper = ({
  title,
  children,
  chartId,
  showFilter = false,
  hideExpandIcon = false,
  showCollapseIcon = false,
  onExpand,
  onCollapse,
}: CardWrapperProps) => {
  const { chartFilters, setChartFilter } = useDashboardStore();

  // 获取当前图表的过滤器值
  const currentFilter = chartId ? chartFilters[chartId] : null;

  // 处理过滤器变化
  const handleFilterChange = (value: FilterValue) => {
    if (chartId) {
      setChartFilter(chartId, { dateRange: value });
    }
  };

  // 过滤器选择器（只有 showFilter 为 true 时才显示）
  const filterSelector =
    showFilter && chartId ? (
      <select
        className={css.filterSelect}
        value={currentFilter?.dateRange || "week"}
        onChange={(e) => handleFilterChange(e.target.value as FilterValue)}
        onClick={(e) => e.stopPropagation()}
      >
        <option value="day">日</option>
        <option value="week">周</option>
        <option value="month">月</option>
        <option value="year">年</option>
      </select>
    ) : null;

  return (
    <div className={css.cardWrapper}>
      <div className={`flex ${css.title}`}>
        <div className={css.titleName}>{title}</div>
        <div className={css.titleRight}>
          {filterSelector}
          {showCollapseIcon ? (
            <div
              className={css.collapseIcon}
              onClick={onCollapse}
              title="缩小"
            />
          ) : (
            <div
              className={css.amplifyIcon}
              style={hideExpandIcon ? { visibility: "hidden" } : {}}
              onClick={onExpand}
              title="放大"
            />
          )}
        </div>
      </div>
      <div
        className={css.content}
        style={showCollapseIcon ? { backgroundColor: "#052745" } : undefined}
      >
        {children}
      </div>
    </div>
  );
};

export default CardWrapper;
