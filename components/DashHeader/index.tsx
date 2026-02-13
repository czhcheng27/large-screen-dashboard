import classNames from "classnames";
import css from "./index.module.scss";

interface ButtonItem {
  code: string;
  label: string;
  url: string;
}

const leftButton: ButtonItem[] = [
  {
    code: "1",
    label: "Portfolio",
    url: "https://personal-portfolio-alpha-one-68.vercel.app/",
  },
  {
    code: "2",
    label: "ChatAPP",
    url: "https://cheng-chat-app.up.railway.app/",
  },
  {
    code: "3",
    label: "OA System",
    url: "https://project-playground.up.railway.app/",
  },
];

const rightButton: ButtonItem[] = [
  {
    code: "4",
    label: "Old OA",
    url: "https://oa-system.up.railway.app/",
  },
  {
    code: "5",
    label: "In Dev",
    url: "",
  },
  {
    code: "6",
    label: "In Dev",
    url: "",
  },
];

const DashHeader = () => {
  const renderButtons = (type: "left" | "right", list: ButtonItem[]) => {
    return (
      <div className={classNames(css.buttonBox, css[type + "ButtonBox"])}>
        {list.map((item, index) => {
          return renderEachBtn(item, index, type);
        })}
      </div>
    );
  };

  const renderEachBtn = (
    item: ButtonItem,
    index: number,
    type: "left" | "right",
  ) => {
    return (
      <div
        className={classNames(css.buttonNode, css[type + "Button"])}
        onClick={() => item.url && window.open(item.url, "_blank")}
        key={index}
      >
        <span>{item.label}</span>
      </div>
    );
  };

  return (
    <div className={css.headBox}>
      {renderButtons("left", leftButton)}
      <div className={css.headTitle}>
        <div>Big Screen Demo</div>
      </div>
      {renderButtons("right", rightButton)}
    </div>
  );
};

export default DashHeader;
