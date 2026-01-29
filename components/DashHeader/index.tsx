import css from "./index.module.scss";

interface DashHeaderProps {}

const DashHeader = ({}: DashHeaderProps) => {
  return <div className={css.dashHeader}>DashHeader</div>;
};

export default DashHeader;
