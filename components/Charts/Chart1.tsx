"use client";

import { ChartComponentProps } from "./ChartCard";
import css from "./ChartContent.module.scss";

interface Chart1Props extends ChartComponentProps {}

const Chart1 = ({ isExpanded, filter }: Chart1Props) => {
  return (
    <div className={`${css.chartContent} ${isExpanded ? css.expanded : ""}`}>
      <div className={css.placeholder}>
        <p className={css.title}>Chart 1 - 左上</p>
        <p className={css.info}>Filter: {filter}</p>
        <p className={css.info}>{isExpanded ? "放大模式" : "普通模式"}</p>
      </div>
    </div>
  );
};

export default Chart1;
