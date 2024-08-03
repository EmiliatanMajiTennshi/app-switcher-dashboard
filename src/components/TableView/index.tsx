/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Button, Table, TableProps } from "antd";
import styles from "./index.module.less";
import {
  ApplicationGroupSwitchDto,
  SwitchAlertMessageResponse,
  SwitchAssemblyMessageResponse,
  SwitchStateMessageResponse,
  SystemSwitchResponse,
} from "@/stores/SwitchMonitorScreenType";
import { sleep } from "@/utils/utils";
import { excelExportUseJson } from "@/utils/excelExport";
import { AnyObject } from "antd/es/_util/type";
export interface ICZG {
  type: string;
  CaozuoName: string;
  sumCLkg: string;
}
export interface IShebei {
  type: string;
  ShebeiName: string;
  sumCLkg: string;
  ShebeiID?: string;
}
export type DataType =
  | SwitchAssemblyMessageResponse
  | SwitchStateMessageResponse
  | SystemSwitchResponse
  | SwitchAlertMessageResponse
  | ApplicationGroupSwitchDto
  | ICZG
  | IShebei;

interface IProps {
  title?: string;
  columns?: TableProps<DataType>["columns"];
  data?: DataType[];
  rowKey?: string;
  loading?: boolean;
  tableHeight?: number;
  onRowClick?: (itemParams: DataType) => void;
  exportConfig?: { columns: AnyObject; title: string };
}

const TableView: React.FC<IProps> = (props) => {
  const {
    columns = [],
    data = [],
    rowKey = "id",
    loading = false,
    title,
    exportConfig,
  } = props;

  const tableRef = useRef<any>(null);

  const [isSelt, setIsSelt]: any = useState(false);
  const handleTableMouseEnter = () => {
    setIsSelt(true);
  };

  const handleTableMouseLeave = () => {
    setIsSelt(false);
  };

  useEffect(() => {
    // 是否回到顶部 ，true 按照当前的高度进行，false 从头开始
    let increasing = true;
    //  防抖节流，避免重复开启滚动条方法
    let isScrolling = isSelt;
    // table 元素
    const tableNode = tableRef?.current;
    isScrolling;

    //  全部内容的高度
    const tableHeight =
      tableNode?.nativeElement?.querySelector(".ant-table-tbody")?.offsetHeight;
    // 显示内容的高度
    const tableHeights =
      tableNode?.nativeElement?.querySelector(".ant-table-body")?.offsetHeight;
    // 被卷去的高度
    let tableScrollTop =
      tableNode?.nativeElement?.querySelector(".ant-table-body")?.scrollTop;

    let continueScrolling = !isSelt; // 控制滚动是否继续执行
    const scrollTable = async () => {
      //  判断是否存在这个元素节点，并且是否开启 false为 是否鼠标悬浮或者聚焦，开启自己滚动

      if (tableNode && continueScrolling) {
        //  isScrolling 设置为 关闭，避免重复
        isScrolling = true;
        if (increasing) {
          if (tableScrollTop === 0.4) {
            await sleep(2000);
          }
          tableScrollTop += data.length !== 0 ? 0.4 : 0;
          tableNode.scrollTo({ top: tableScrollTop });
          if (tableScrollTop >= tableHeight - tableHeights) {
            increasing = false;
          }
        } else {
          tableScrollTop = 0;
          await tableNode.scrollTo({ top: 0 });
          increasing = true;
          await sleep(2000);
        }
        // 在每一帧结束后再次触发滚动操作
        requestAnimationFrame(() => {
          //  再次开启 滚动
          isScrolling = false;
          scrollTable();
        });
      }
    };
    if (!isSelt) {
      scrollTable(); // 如果 isSelt 为 false，立即执行滚动
    }
    return () => {
      continueScrolling = false;
    };
  }, [isSelt, data]);

  return (
    <div
      className={styles.tableView}
      onMouseEnter={handleTableMouseEnter}
      onMouseLeave={handleTableMouseLeave}
    >
      <h2 className={styles.title}>
        {title}
        {exportConfig && (
          <Button
            type="link"
            onClick={() =>
              excelExportUseJson(
                data,
                exportConfig?.columns || {},
                exportConfig?.title || ""
              )
            }
          >
            EXCEL导出
          </Button>
        )}
      </h2>
      <div className={styles.content}>
        <Table
          size="small"
          rowKey={rowKey}
          pagination={false}
          columns={columns as TableProps["columns"]}
          dataSource={data as TableProps["dataSource"]}
          loading={loading}
          scroll={{ y: props?.tableHeight || 300 }}
          ref={tableRef}
        />
      </div>
    </div>
  );
};

export default TableView;
