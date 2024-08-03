import request from "@/utils/request";

// 热处理操作工和产量
export const getRclYield = async (searchParams?: { name: string }) => {
  try {
    const res = await request.get("RclYield", { params: searchParams });
    return res;
  } catch (err) {
    console.log(err);
  }
};
