import request from "@/utils/request";

// 设备和产量
export const getWXMShebei = async () => {
  try {
    const res = await request.get("WXMShebei");
    return res;
  } catch (err) {
    console.log(err);
  }
};
