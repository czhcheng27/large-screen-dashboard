"use client";

import { useEffect, useRef, useCallback } from "react";
import { useDashboardStore } from "@/store";
import {
  ChartCard,
  Chart1,
  Chart2,
  Chart3,
  Chart4,
  Chart5,
  Chart6,
} from "../Charts";
import CenterSection from "../CenterSection";
import ExpandedCardOverlay from "../ExpandedCardOverlay";
import css from "./index.module.scss";

interface DashContainerProps {}

const DashContainer = ({}: DashContainerProps) => {
  const centerTopRef = useRef<HTMLDivElement>(null);
  const { setCenterTopRect } = useDashboardStore();

  // 更新 centerTop 的位置信息
  const updateCenterTopRect = useCallback(() => {
    if (centerTopRef.current) {
      setCenterTopRect(centerTopRef.current.getBoundingClientRect());
    }
  }, [setCenterTopRect]);

  useEffect(() => {
    updateCenterTopRect();
    // 监听窗口大小变化
    window.addEventListener("resize", updateCenterTopRect);
    return () => window.removeEventListener("resize", updateCenterTopRect);
  }, [updateCenterTopRect]);

  return (
    <div className={css.dashContainer}>
      {/* left side */}
      <div className={css.leftSide}>
        <div>
          <ChartCard chartId="chart1" title="Chart 1" showFilter>
            {(props) => <Chart1 {...props} />}
          </ChartCard>
        </div>
        <div>
          <ChartCard chartId="chart2" title="Chart 2" showFilter>
            {(props) => <Chart2 {...props} />}
          </ChartCard>
        </div>
      </div>

      {/* center */}
      <div className={css.center}>
        <div className={css.centerTop} ref={centerTopRef}>
          {/* 这里是放大后的内容展示区域 */}
          <CenterSection />
          {/* <div className={css.centerTopPlaceholder}>
            点击四周卡片的放大按钮，内容将在此处放大展示
          </div> */}
        </div>
        <div className={css.centerBottom}>
          <div>
            <ChartCard chartId="chart3" title="Chart 3">
              {(props) => <Chart3 {...props} />}
            </ChartCard>
          </div>
          <div>
            <ChartCard chartId="chart4" title="Chart 4">
              {(props) => <Chart4 {...props} />}
            </ChartCard>
          </div>
        </div>
      </div>

      {/* right side */}
      <div className={css.rightSide}>
        <div>
          <ChartCard chartId="chart5" title="Chart 5">
            {(props) => <Chart5 {...props} />}
          </ChartCard>
        </div>
        <div>
          <ChartCard chartId="chart6" title="Chart 6">
            {(props) => <Chart6 {...props} />}
          </ChartCard>
        </div>
      </div>

      {/* 放大后的卡片覆盖层 */}
      <ExpandedCardOverlay />
    </div>
  );
};

export default DashContainer;
