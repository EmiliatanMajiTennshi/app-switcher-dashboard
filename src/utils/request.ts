import axios from "axios";

// axios的配置文件, 可以在这里去区分开发环境和生产环境等全局一些配置
const devBaseUrl = "api/";
const proBaseUrl =
  "http://is-08-small-http-cp4i.apps.ocp4.universalchain.com.cn/queryrest/v1";

// process.env返回的是一个包含用户的环境信息,它可以去区分是开发环境还是生产环境
export const BASE_URL =
  process.env.NODE_ENV === "development" ? devBaseUrl : proBaseUrl;
export const TIMEOUT = 50000;

const request = axios.create({
  baseURL: BASE_URL, //基准地址
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});
//拦截请求
request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
//拦截响应
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    //对响应的错误做点什么
    return Promise.reject(error);
  }
);

export default request;
