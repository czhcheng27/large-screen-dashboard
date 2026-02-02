"use client";

import { mockChartData3 } from "@/mockData";
import { ChartComponentProps } from "./ChartCard";
import css from "./Chart3.module.scss";
import { Chart3Item } from "./types";

const Chart3 = ({ isExpanded }: ChartComponentProps) => {
  const renderEachRow = (el: Chart3Item, index: number) => {
    const { equipNumber, equipName, equipRate } = el;
    return (
      <>
        <div
          className={`${css.rowNum} ${
            index < 3 ? css[`rowNum${index + 1}`] : css.rowNum4
          }`}
        >{`${index < 9 ? "0" : ""}${index + 1}`}</div>
        <div className={css.equipName}>{equipName}</div>
        <div className={css.equipNum}>Equip Num: {equipNumber}</div>
        <div className={css.equipRate}>
          Rate: <span>{equipRate}</span>
        </div>
      </>
    );
  };

  return (
    <div className={`${css.chart3Content} ${isExpanded ? css.expanded : ""}`}>
      {mockChartData3.map((el, index) => {
        return (
          <div key={index} className={css.each_row}>
            {renderEachRow(el, index)}
          </div>
        );
      })}
    </div>
  );
};

export default Chart3;
