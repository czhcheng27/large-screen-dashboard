import DashHeader from "@/components/DashHeader";
import DashContainer from "@/components/DashContainer";
import css from "./index.module.scss";
export default function Home() {
  return (
    <div className={`${css.moduleBox}`} id="moduleBox_large_screen">
      <DashHeader />
      <DashContainer />
    </div>
  );
}
