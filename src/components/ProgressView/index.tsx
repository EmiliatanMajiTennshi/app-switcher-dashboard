/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import ChartCard from "../ChartCard";
import * as echarts from "echarts";
import styles from "./index.module.less";

interface IProps {
  dataEcharts: any[];
  loadingEcharts: boolean;
}
const getOption = (totalCount: number, wcNnum: number) => {
  return {
    yAxis: {
      type: "category",
      data: ["完成", "项次"],
      splitLine: {
        show: false, // 不显示网格线
      },
      axisTick: {
        show: false, // 不显示刻度
      },
      axisLine: {
        show: false, // 不显示坐标轴线
      },
      axisLabel: {
        color: "#fff",
        fontSize: 14,
      },
    },
    xAxis: {
      type: "value",
      splitLine: {
        show: false, // 不显示网格线
      },
      axisTick: {
        show: false, // 不显示刻度
      },
      axisLine: {
        show: false, // 不显示坐标轴线
      },
      axisLabel: {
        color: "#fff",
      },
    },
    grid: {
      top: 0,
      bottom: 0,
      left: "20%",
      right: "15%",
      containerLabel: true,
    },
    series: [
      {
        data: [wcNnum, totalCount],
        type: "bar",
        barWidth: 24,
        label: {
          show: true,
          position: "right", // 顶部显示
          color: "rgb(243,195,109)",
          fontStyle: "italic",
          fontSize: 16,
        },
      },
    ],
  };
};
const ProgressView: React.FC<IProps> = (props) => {
  const chartRef = useRef(null);
  const chartRefMonth = useRef(null);

  const { loadingEcharts, dataEcharts } = props;

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    const chartInstanceMonth = echarts.init(chartRefMonth.current);
    const dayData = dataEcharts?.find((item) => item?.type === "1");
    const monthData = dataEcharts?.find((item) => item?.type === "2");
    chartInstance.setOption(getOption(dayData?.TotalCount, dayData?.wcNnum));
    chartInstanceMonth.setOption(
      getOption(monthData?.TotalCount, monthData?.wcNnum)
    );
  }, [dataEcharts]);
  return (
    <div className={styles["charts"]}>
      <ChartCard title="今日" loading={loadingEcharts}>
        <div
          className={styles["chart"]}
          ref={chartRef}
          style={{ height: 90, width: 300 }}
        ></div>
      </ChartCard>
      <ChartCard title="今日完成率" loading={loadingEcharts}>
        <div className={styles["percent-number"]}>
          {dataEcharts[0]?.rate || "--.--%"}
        </div>
      </ChartCard>
      <div
        style={{ width: 1, margin: "0 20px", backgroundColor: "#8697ac" }}
      ></div>
      <ChartCard title="本月" loading={loadingEcharts}>
        <div
          className={styles["chart"]}
          ref={chartRefMonth}
          style={{ height: 90, width: 300 }}
        ></div>
      </ChartCard>
      <ChartCard title="本月完成率" loading={loadingEcharts}>
        <div className={styles["percent-number"]}>
          {dataEcharts[1]?.rate || "--.--%"}
        </div>
      </ChartCard>
    </div>
  );
};

export default ProgressView;
