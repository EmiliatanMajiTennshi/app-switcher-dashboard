import request from "@/utils/request";

export const getWXMRate = async () => {
  try {
    const res = await request.get("WXMRate");
    return res;
  } catch (err) {
    console.log(err);
  }
};
