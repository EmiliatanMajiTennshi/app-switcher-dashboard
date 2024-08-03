/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
// 根据json数据（数组）导出成excel文件：
// 参数：
// data：json数组
// headers：excel的表头

import { cloneDeep } from "lodash";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AnyObject } from "immer/dist/internal.js";

// filename：导出的文件名（不用写扩展名）
export function excelExportUseJson(
  data: unknown[],
  headers: AnyObject,
  filename: string
) {
  // 使用深克隆不影响原table数据的展示
  const json = cloneDeep(data);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json.forEach((item: any) => {
    for (const key in item) {
      if (headers.hasOwnProperty(key)) {
        item[headers[key]] = item[key];
      }
      delete item[key];
    }
  });

  // excel 对象
  const wb = XLSX.utils.book_new();

  // 创建sheet
  const ws = XLSX.utils.json_to_sheet(json, { header: Object.values(headers) });
  // excel 添加sheet名称
  wb.SheetNames.push(filename);
  // excel 添加sheet
  wb.Sheets[filename] = ws;

  const defaultCellStyle = {
    font: { name: "Verdana", sz: 13, color: "FF00FF88" },
    fill: { fgColor: { rgb: "FFFFAA00" } },
  };
  const wopts: any = {
    bookType: "xlsx",
    bookSST: false,
    type: "binary",
    cellStyle: true,
    defaultCellStyle: defaultCellStyle,
    showGridLines: false,
  };
  function s2ab(s: AnyObject) {
    console.log("s", s);
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }

  const wbout = XLSX.write(wb, wopts);
  const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  saveAs(blob, filename + ".xlsx");
}
