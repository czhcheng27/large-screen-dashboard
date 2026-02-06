import { useState, useEffect } from "react";
import css from "./index.module.scss";

const LoadingBg = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const [visible, setVisible] = useState(true);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => setStarted(true));
    });
    // 3.3s 进度条走完后淡出
    const timer = setTimeout(() => setFadeOut(true), 3300);
    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!fadeOut) return;
    const timer = setTimeout(() => setVisible(false), 800);
    return () => clearTimeout(timer);
  }, [fadeOut]);

  if (!visible) return null;

  return (
    <div className={`${css.moduleLoading} ${fadeOut ? css.fadeOut : ""}`}>
      <div className={css.loadingTxt}>LOADING</div>
      <div className={css.progressWrapper}>
        <div className={css.progressInner}>
          <div
            className={css.progressBg}
            style={{ transform: started ? "scaleX(1)" : "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingBg;
