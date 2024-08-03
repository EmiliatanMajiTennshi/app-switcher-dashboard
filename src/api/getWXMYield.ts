import request from "@/utils/request";

// 无心磨操作工和产量
export const getWXMYield = async (searchParams: { name: string }) => {
  try {
    const res = await request.get("WXMYield", { params: searchParams });
    return res;
  } catch (err) {
    console.log(err);
  }
};
