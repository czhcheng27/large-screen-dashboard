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
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (animationState === "expanding" && expandedCard) {
      const { sourceRect, targetRect } = expandedCard;
      setDisplayedCard(expandedCard);

      // 计算初始缩放和偏移，使其重合在源位置
      const scaleX = sourceRect.width / targetRect.width;
      const scaleY = sourceRect.height / targetRect.height;
      const translateX = sourceRect.left - targetRect.left;
      const translateY = sourceRect.top - targetRect.top;

      // 初始状态：虽然尺寸是目标尺寸，但通过 transform 缩小到位移到源位置
      setStyle({
        position: "fixed",
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
        transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
        transformOrigin: "top left",
        zIndex: 1000,
        transition: "none",
        opacity: 0,
      });
      setIsVisible(true);

      animationRef.current = requestAnimationFrame(() => {
        animationRef.current = requestAnimationFrame(() => {
          setStyle({
            position: "fixed",
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            transform: "translate(0, 0) scale(1, 1)",
            transformOrigin: "top left",
            zIndex: 1000,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", // 稳健的平滑位移
            opacity: 1,
          });

          setTimeout(() => {
            onAnimationComplete();
          }, 400);
        });
      });
    } else if (animationState === "collapsing" && displayedCard) {
      const { sourceRect, targetRect } = displayedCard;

      const scaleX = sourceRect.width / targetRect.width;
      const scaleY = sourceRect.height / targetRect.height;
      const translateX = sourceRect.left - targetRect.left;
      const translateY = sourceRect.top - targetRect.top;

      setStyle({
        position: "fixed",
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
        transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
        transformOrigin: "top left",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: 0,
      });

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
