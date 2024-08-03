import request from "@/utils/request";

export const getRCLRate = async () => {
  try {
    const res = await request.get("RCLRate");
    return res;
  } catch (err) {
    console.log(err);
  }
};
