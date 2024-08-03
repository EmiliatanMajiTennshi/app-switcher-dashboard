/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from "classnames";
import React, { useEffect, useMemo, useRef } from "react";
import styles from "./index.module.less";
// import { DatePicker } from "antd";
import { useFullscreen, useRafInterval } from "ahooks";

// import PieView from "@/components/PieView";
import TableView, { ICZG, IShebei } from "@/components/TableView";
import ProgressView from "@/components/ProgressView";
// import PieView2 from "@/components/PieView2";
// import dayjs from "dayjs";
import Clock from "@/components/Clock";
import { ClockCircleOutlined } from "@ant-design/icons";
import { columnsChanliang } from "@/utils/getColumn.tsx";

import { useWindowSize } from "@/hooks/useWindowSize.ts";
import {
  getRCLRate,
  getRclShebei,
  getRclYield,
  getWXMRate,
  getWXMShebei,
  getWXMYield,
} from "@/api";
import { Button, ConfigProvider, Form, Input, Spin, Tabs, message } from "antd";
import dayjs from "dayjs";

import { cloneDeep } from "lodash";
// import { RangePickerProps } from "antd/es/date-picker";

// const { RangePicker } = DatePicker;

const Dashboard = () => {
  const ref = useRef(null);
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(ref);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [_, height] = useWindowSize();

  // 默认开始时间是当前时间-12小时，结束时间：当前时间+12 小时

  // 今日操作工和产量
  const [todayCZGData, setTodayCZGData] = React.useState<ICZG[]>([]);
  // 当月操作工和产量
  const [monthCZGData, setMonthCZGData] = React.useState<ICZG[]>([]);

  // 今日设备和产量
  const [todaySBData, setTodaySBData] = React.useState<IShebei[]>([]);
  // 当月设备和产量
  const [monthSBData, setMonthSBData] = React.useState<IShebei[]>([]);

  const [dataEcharts, setDataEcharts] = React.useState([
    { type: "1", wcNnum: 0, TotalCount: 0, rate: "--.--%" },
    { type: "2", wcNnum: 0, TotalCount: 0, rate: "--.--%" },
  ]);
  const [loadingEcharts, setLoadingEcharts] = React.useState(false);
  const [loadingCZG, setLoadingCZG] = React.useState(false);
  const [loadingSB, setLoadingSB] = React.useState(false);

  // 所有的loading
  const [allLoading, setAllLoading] = React.useState(false);
  // tab 活跃标签
  const [activeKey, setActiveKey] = React.useState<any>("0");
  // 搜索数据
  const [searchParams, setSearchParams] = React.useState<{ name: string }>({
    name: "",
  });
  const tableHeight = ((isFullscreen ? height + 30 : height) / 7) * 3 - 240;

  const loadData = () => {
    setAllLoading(true);
    if (activeKey === "0") {
      const getData1 = () => {
        return getRclYield(searchParams).then((res) => {
          if (res?.status === 200) {
            const _todayCZGData: ICZG[] = [];
            const _monthCZGData: ICZG[] = [];
            res?.data?.forEach((item: ICZG) => {
              if (item?.type === "1" && item?.CaozuoName) {
                _todayCZGData.push(item);
              }
              if (item?.type == "2" && item?.CaozuoName) {
                _monthCZGData.push(item);
              }
            });

            setTodayCZGData(_todayCZGData);
            setMonthCZGData(_monthCZGData);
            setLoadingCZG(false);
            message.success("热处理操作工数据更新成功");
          } else {
            setLoadingCZG(false);
            message.error("热处理操作工数据更新失败");
          }
        });
      };
      const getData2 = () => {
        return getRCLRate().then((res) => {
          if (res?.status === 200) {
            setDataEcharts(res?.data);
            setLoadingEcharts(false);
            message.success("热处理总览数据更新成功");
          } else {
            message.error("热处理总览数据更新失败");
            setLoadingEcharts(false);
          }
          // setDataEcharts(res.data)
        });
      };
      const getData3 = () => {
        return getRclShebei().then((res) => {
          if (res?.status === 200) {
            const _todaySBData: IShebei[] = [];
            const _monthSBData: IShebei[] = [];
            res?.data?.forEach((item: IShebei) => {
              if (item?.type === "1" && item?.ShebeiName) {
                _todaySBData.push(item);
              }
              if (item?.type == "2" && item?.ShebeiName) {
                _monthSBData.push(item);
              }
            });

            setTodaySBData(_todaySBData);
            setMonthSBData(_monthSBData);
            setLoadingSB(false);
            message.success("热处理设备数据更新成功");
          } else {
            setLoadingSB(false);
            message.error("热处理设备数据更新失败");
          }
        });
      };
      Promise.all([getData1(), getData2(), getData3()]).then(() => {
        setAllLoading(false);
      });
    }
    if (activeKey === "1") {
      const getData1 = () =>
        getWXMRate().then((res) => {
          if (res?.status === 200) {
            setDataEcharts(res?.data);
            setLoadingEcharts(false);
            message.success("无心磨总览数据更新成功");
          } else {
            message.error("无心磨数总览据更新失败");
            setLoadingEcharts(false);
          }
          // setDataEcharts(res.data)
        });
      const getData2 = () =>
        getWXMShebei().then((res) => {
          if (res?.status === 200) {
            const _todaySBData: IShebei[] = [];
            const _monthSBData: IShebei[] = [];
            res?.data?.forEach((item: IShebei) => {
              if (item?.type === "1" && item?.ShebeiName) {
                _todaySBData.push(item);
              }
              if (item?.type == "2" && item?.ShebeiName) {
                _monthSBData.push(item);
              }
            });

            setTodaySBData(_todaySBData);
            setMonthSBData(_monthSBData);
            setLoadingSB(false);
            message.success("无心磨设备数据更新成功");
          } else {
            setLoadingSB(false);
            message.error("无心磨设备数据更新失败");
          }
        });
      const getData3 = () =>
        getWXMYield(searchParams).then((res) => {
          if (res?.status === 200) {
            const _todayCZGData: ICZG[] = [];
            const _monthCZGData: ICZG[] = [];
            res?.data?.forEach((item: ICZG) => {
              if (item?.type === "1" && item?.CaozuoName) {
                _todayCZGData.push(item);
              }
              if (item?.type == "2" && item?.CaozuoName) {
                _monthCZGData.push(item);
              }
            });

            setTodayCZGData(_todayCZGData);
            setMonthCZGData(_monthCZGData);
            setLoadingCZG(false);
            message.success("无心磨操作工数据更新成功");
          } else {
            setLoadingCZG(false);
            message.error("无心磨操作工数据更新失败");
          }
        });

      Promise.all([getData1(), getData2(), getData3()]).then(() => {
        setAllLoading(false);
      });
    }
  };
  useEffect(() => {
    setLoadingEcharts(true);
    setLoadingCZG(true);
    setLoadingSB(true);
    loadData();
  }, [activeKey]);

  useRafInterval(() => {
    loadData();
  }, 120000);

  const dashboards = useMemo(
    () => [
      {
        key: "0",
        name: "热处理",
        title: "热处理",
      },
      {
        key: "1",
        name: "无心磨",
        title: "无心磨",
      },
    ],
    []
  );
  const dashboardConfig = useMemo(() => {
    return dashboards[parseInt(activeKey)];
  }, [activeKey]);

  return (
    <div
      ref={ref}
      style={{
        height: isFullscreen ? height + 64 : height,
        // minHeight: window.screen.height,
      }}
      className={styles.dashboard}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>
          {dashboardConfig.title}产量完成情况看板
        </h1>
        <div className={styles.left}>
          <span
            className={classNames(styles.fullscreen, {
              [styles.active]: isFullscreen,
            })}
            onClick={toggleFullscreen}
          />
          <span className={styles.time}>
            <ClockCircleOutlined /> <Clock />
          </span>
        </div>

        <div className={styles.right}>
          {/* <span className={styles.rangePicker}>
         <RangePicker
           defaultValue={[dayjs(timeRange[0]), dayjs(timeRange[1])]}
           format="YYYY-MM-DD"
           placeholder={["开始时间", "结束时间"]}
           onChange={onChange}
           needConfirm={false}
           allowClear={false}
           getPopupContainer={() => ref?.current || document.body}
         />
       </span> */}
          <div className={styles.searchCom}>
            <Form
              layout="inline"
              onFinish={() => {
                setLoadingCZG(true);
                loadData();
              }}
            >
              <Form.Item>
                <Input
                  size="large"
                  className={styles.searchInput}
                  placeholder="请输入操作工姓名"
                  onChange={(e) => {
                    const currentName = e?.target?.value;
                    const cloneParams = cloneDeep(searchParams);
                    cloneParams.name = currentName;
                    setSearchParams(cloneParams);
                  }}
                ></Input>
              </Form.Item>
              <Form.Item>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#5470c6",
                    },
                  }}
                >
                  <Button
                    type="primary"
                    size="large"
                    className={styles.searchBtn}
                    htmlType="submit"
                  >
                    搜索
                  </Button>
                </ConfigProvider>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {/* <div className={classNames([styles.block, styles.map])}>
       <MapView
         data={switchMonitorCountData}
         onClick={(data) => onItemClick("count", data)}
       />
     </div> */}
        {/* <div className={classNames([styles.block, styles.block1])}>
       <h2 className={styles.title}>应用群组情况</h2>
       <div className={styles.content}>
         <PieView
           data={switchMonitorCountData?.switchMessageResponse}
           onClick={(data) => onItemClick("count", data)}
         />
       </div>
     </div> */}

        <div className={classNames([styles.block, styles.block1])}>
          <h2
            className={styles.title}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Spin spinning={allLoading}>
              <Tabs
                activeKey={activeKey}
                size="large"
                onChange={(activeKey) => setActiveKey(activeKey)}
                items={dashboards.map((item) => {
                  return {
                    label: item.name,
                    key: item.key,
                  };
                })}
              ></Tabs>
            </Spin>
          </h2>

          <div className={styles.content}>
            <ProgressView
              dataEcharts={dataEcharts}
              loadingEcharts={loadingEcharts}
            />
          </div>
        </div>
        <div className={classNames([styles.block, styles.block2])}>
          <div className={styles.content}>
            <TableView
              title={`${dashboardConfig.name}（今日）`}
              columns={columnsChanliang.todayCZG}
              rowKey="CaozuoID"
              tableHeight={tableHeight}
              data={todayCZGData}
              loading={loadingCZG}
              exportConfig={{
                columns: { CaozuoName: "操作工", sumCLkg: "产量（公斤）" },
                title: `${dashboardConfig.name}操作工今日产量${dayjs().format(
                  "YYYY-MM-DD_HH:mm:ss"
                )}`,
              }}
            />
          </div>
        </div>
        <div className={classNames([styles.block, styles.block3])}>
          <div className={styles.content}>
            <TableView
              title={`${dashboardConfig.name}（本月）`}
              columns={columnsChanliang.monthCZG}
              rowKey="systemId"
              tableHeight={tableHeight}
              data={monthCZGData}
              loading={loadingCZG}
              exportConfig={{
                columns: { CaozuoName: "操作工", sumCLkg: "产量（公斤）" },
                title: `${dashboardConfig.name}操作工本月产量${dayjs().format(
                  "YYYY-MM-DD_HH:mm:ss"
                )}`,
              }}
            />
          </div>
        </div>
        {/* <div className={classNames([styles.block, styles.block1])}>
       <h2 className={styles.title}>组件切换详情</h2>
       <div className={styles.content}>
         <TableView
           title="组件切换详情"
           columns={switchMonitorColumn.assembly}
           data={assemblySwitchMessageData}
           rowKey="stepId"
           onRowClick={(data) => onItemClick("assembly", data)}
           tableHeight={tableHeight}
         />
       </div>
     </div> */}
        <div className={classNames([styles.block, styles.block5])}>
          <div className={styles.content}>
            <TableView
              title={`${dashboardConfig.name}（今日）`}
              columns={columnsChanliang.todaySB as any}
              rowKey="CaozuoID"
              tableHeight={tableHeight}
              data={todaySBData}
              loading={loadingSB}
              exportConfig={{
                columns: {
                  ShebeiName: "设备",
                  ShebeiID: "设备id",
                  sumCLkg: "产量（公斤）",
                },
                title: `${dashboardConfig.name}设备今日产量${dayjs().format(
                  "YYYY-MM-DD_HH:mm:ss"
                )}`,
              }}
            />
          </div>
        </div>
        <div className={classNames([styles.block, styles.block6])}>
          <div className={styles.content}>
            <TableView
              title={`${dashboardConfig.name}（本月）`}
              columns={columnsChanliang.monthSB as any}
              rowKey="systemId"
              tableHeight={tableHeight}
              data={monthSBData}
              loading={loadingSB}
              exportConfig={{
                columns: {
                  ShebeiName: "设备",
                  ShebeiID: "设备id",
                  sumCLkg: "产量（公斤）",
                },
                title: `${dashboardConfig.name}设备本月产量${dayjs().format(
                  "YYYY-MM-DD_HH:mm:ss"
                )}`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
