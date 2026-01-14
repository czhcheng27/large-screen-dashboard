import CardWrapper from "../CardWrapper";
import css from "./index.module.scss";

interface DashContainerProps {}

const DashContainer = ({}: DashContainerProps) => {
  return (
    <div className={css.dashContainer}>
      {/* left side */}
      <div className={css.leftSide}>
        <div>
          <CardWrapper title="left top">left top</CardWrapper>
        </div>
        <div>
          <CardWrapper title="left bottom">left bottom</CardWrapper>
        </div>
      </div>

      {/* center */}
      <div className={css.center}>
        <div className={css.centerTop}>center top</div>
        <div className={css.centerBottom}>
          <div>
            <CardWrapper title="center bottom left">
              center bottom left
            </CardWrapper>
          </div>
          <div>
            <CardWrapper title="center bottom right">
              center bottom right
            </CardWrapper>
          </div>
        </div>
      </div>

      {/* right side */}
      <div className={css.rightSide}>
        <div>
          <CardWrapper title="right top">right top</CardWrapper>
        </div>
        <div>
          <CardWrapper title="right bottom">right bottom</CardWrapper>
        </div>
      </div>
    </div>
  );
};

export default DashContainer;
