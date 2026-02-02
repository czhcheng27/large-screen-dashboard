"use client";

import { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import Highcharts3D from "highcharts/highcharts-3d";
import { ChartComponentProps } from "./ChartCard";
import { common3dPie, format3DData } from "./chartUtils";
import css from "./ChartContent.module.scss";

Highcharts3D(Highcharts);

const Chart4 = ({ isExpanded }: ChartComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 响应式配置
  const innerSize = isExpanded ? 100 : 50;
  const depth = isExpanded ? 90 : 45;

  useEffect(() => {
    Highcharts.chart(containerRef.current!, {
      ...(common3dPie(innerSize, depth) as Highcharts.Options),
      series: [
        {
          type: "pie",
          name: "Proportion",
          data: format3DData([
            { proportion: "30%", standardType: "Type I" },
            { proportion: "30%", standardType: "Type II" },
            { proportion: "40%", standardType: "Type III" },
          ]),
        } as Highcharts.SeriesPieOptions,
      ],
    } as Highcharts.Options);
  }, [innerSize, depth]);

  return (
    <div className={`${css.chartContent} ${isExpanded ? css.expanded : ""}`}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Chart4;
