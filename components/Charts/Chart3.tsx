"use client";

import { ChartComponentProps } from "./ChartCard";
import css from "./ChartContent.module.scss";

interface Chart3Props extends ChartComponentProps {}

const Chart3 = ({ isExpanded, filter }: Chart3Props) => {
  return (
    <div className={`${css.chartContent} ${isExpanded ? css.expanded : ""}`}>
      <div className={css.placeholder}>
        <p className={css.title}>Chart 3 - 中下左</p>
        <p className={css.info}>Filter: {filter}</p>
        <p className={css.info}>{isExpanded ? "放大模式" : "普通模式"}</p>
      </div>
    </div>
  );
};

export default Chart3;
