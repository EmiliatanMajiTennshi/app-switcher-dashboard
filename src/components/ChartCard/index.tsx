/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./index.module.less";
import { Spin } from "antd";

interface IChartCard {
  title: string;
  children: any;
  loading: boolean;
}
const ChartCard = (props: IChartCard) => {
  const { title, children, loading } = props;
  return (
    <Spin spinning={loading}>
      <div className={styles["card-container"]}>
        <div className={styles["card-title"]}>{title}</div>
        <div className={styles["card-children"]}>
          <div className={styles["card-bg"]}>{children}</div>
        </div>
      </div>
    </Spin>
  );
};

export default ChartCard;
