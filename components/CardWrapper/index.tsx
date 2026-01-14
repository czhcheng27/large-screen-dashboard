import css from "./index.module.scss";

interface CardWrapperProps {
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}

const CardWrapper = ({ title, extra, children }: CardWrapperProps) => {
  return (
    <div className={css.cardWrapper}>
      <div className={`flex ${css.title}`}>
        <div className={css.titleName}>{title}</div>
        <div className={css.titleRight}>
          {extra && extra}
          <div className={css.amplifyIcon} />
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default CardWrapper;
