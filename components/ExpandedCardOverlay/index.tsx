"use client";

import { useEffect, useState, useRef } from "react";
import { useDashboardStore, ChartId } from "@/store";
import CardWrapper from "../CardWrapper";
import { Chart1, Chart2, Chart3, Chart4, Chart5, Chart6 } from "../Charts";
import css from "./index.module.scss";

/** 根据 chartId 获取对应的图表组件 */
const ChartRenderer = ({
  chartId,
  isExpanded,
}: {
  chartId: ChartId;
  isExpanded: boolean;
}) => {
  const { chartFilters } = useDashboardStore();
  const filter = chartFilters[chartId].dateRange;

  const chartComponents: Record<ChartId, React.ReactNode> = {
    chart1: <Chart1 isExpanded={isExpanded} filter={filter} />,
    chart2: <Chart2 isExpanded={isExpanded} filter={filter} />,
    chart3: <Chart3 isExpanded={isExpanded} filter={filter} />,
    chart4: <Chart4 isExpanded={isExpanded} filter={filter} />,
    chart5: <Chart5 isExpanded={isExpanded} filter={filter} />,
    chart6: <Chart6 isExpanded={isExpanded} filter={filter} />,
  };

  return <>{chartComponents[chartId]}</>;
};

const ExpandedCardOverlay = () => {
  const { expandedCard, animationState, collapseCard, onAnimationComplete } =
    useDashboardStore();

  const [style, setStyle] = useState<React.CSSProperties>({});
  const [isVisible, setIsVisible] = useState(false);
  const [displayedCard, setDisplayedCard] = useState(expandedCard);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // 清理之前的动画
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (animationState === "expanding" && expandedCard) {
      const { sourceRect, targetRect } = expandedCard;
      setDisplayedCard(expandedCard);

      // 先设置初始位置（源卡片位置）
      setStyle({
        position: "fixed",
        top: sourceRect.top,
        left: sourceRect.left,
        width: sourceRect.width,
        height: sourceRect.height,
        zIndex: 1000,
        transition: "none",
        opacity: 1,
      });
      setIsVisible(true);

      // 下一帧开始动画到目标位置
      animationRef.current = requestAnimationFrame(() => {
        animationRef.current = requestAnimationFrame(() => {
          setStyle({
            position: "fixed",
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            zIndex: 1000,
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: 1,
          });

          // 动画完成
          setTimeout(() => {
            onAnimationComplete();
          }, 500);
        });
      });
    } else if (animationState === "collapsing" && displayedCard) {
      const { sourceRect } = displayedCard;

      // 收起动画：移动回源位置并缩小，同时淡出
      setStyle((prev) => ({
        ...prev,
        top: sourceRect.top,
        left: sourceRect.left,
        width: sourceRect.width,
        height: sourceRect.height,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: 0,
      }));

      setTimeout(() => {
        setIsVisible(false);
        setDisplayedCard(null);
        onAnimationComplete();
      }, 300);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animationState, expandedCard]);

  if (!isVisible || !displayedCard) {
    return null;
  }

  return (
    <div className={css.expandedOverlay} style={style}>
      <CardWrapper
        title={displayedCard.title}
        chartId={displayedCard.chartId}
        showFilter={displayedCard.showFilter}
        hideExpandIcon
        showCollapseIcon
        onCollapse={collapseCard}
      >
        <ChartRenderer chartId={displayedCard.chartId} isExpanded={true} />
      </CardWrapper>
    </div>
  );
};

export default ExpandedCardOverlay;
