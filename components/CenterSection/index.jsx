import React, { useState, useEffect } from "react";
import classNames from "classnames";
// import Earth from "../Earth";
// import MovingDot from "../MovingDot";
import { positionList, mockEarthData } from "../../mockData";
import css from "./index.module.scss";

const params = {
  title: "Left",
  sub: "Chart3",
  filterOption: {},
};

const CenterSection = () => {
  const compileNodeList = () => {
    return (
      <>
        {positionList.map((item, index) => {
          return (
            <div
              className={classNames(
                css.dataNode,
                css["dataNode" + (index + 1)],
              )}
              key={index}
              style={getPosition(item)}
              onClick={() => openModal(params)}
            >
              {compileNode(mockEarthData?.nodeList?.[index] || {}, index)}
            </div>
          );
        })}
      </>
    );
  };

  const getPosition = (item) => {
    const position = {
      width: item.size + "px",
      height: item.size + "px",
    };
    if (item.top) {
      position.top = `calc(${item.top}% - ${item.size / 2}px)`;
    } else {
      position.bottom = `calc(${item.bottom}% - ${item.size / 2}px)`;
    }
    if (item.left) {
      position.left = `calc(${item.left}% - ${item.size / 2}px)`;
    } else {
      position.right = `calc(${item.right}% - ${item.size / 2}px)`;
    }
    return position;
  };

  const compileNode = (data, index) => {
    const { completeNum1, adventNum } = data;
    return (
      <>
        <div className={css.nodeTitle}>{data.title}</div>
        <div className={css.numberBox}>
          {compileNodeNumber(css.adventNum, completeNum1, adventNum)}
        </div>
        <div className={css.planNum}>
          Value：<span>{data.planNum}</span>
        </div>
      </>
    );
  };

  const compileNodeNumber = (cssName, completeNum, number) => {
    return (
      <span className={css.numberNode}>
        <span className={css.completeNum}>{completeNum}</span>
        <span className={cssName}>/{number}</span>
      </span>
    );
  };

  return (
    <div className={css.chartBox}>
      {compileNodeList()}
      {/* <Earth />
      <MovingDot /> */}
    </div>
  );
};

export default CenterSection;
