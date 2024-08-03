import request from "@/utils/request";

// 设备和产量
export const getRclShebei = async () => {
  try {
    const res = await request.get("RclShebei");
    return res;
  } catch (err) {
    console.log(err);
  }
};
