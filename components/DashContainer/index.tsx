import css from "./index.module.scss";

interface DashContainerProps {}

const DashContainer = ({}: DashContainerProps) => {
  return (
    <div className={css.dashContainer}>
      {/* left side */}
      <div className={css.leftSide}>
        <div>left top</div>
        <div>left bottom</div>
      </div>

      {/* center */}
      <div className={css.center}>
        <div className={css.centerTop}>center top</div>
        <div className={css.centerBottom}>
          <div>center bottom left</div>
          <div>center bottom right</div>
        </div>
      </div>

      {/* right side */}
      <div className={css.rightSide}>
        <div>right top</div>
        <div>right bottom</div>
      </div>
    </div>
  );
};

export default DashContainer;
