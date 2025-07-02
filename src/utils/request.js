import axios from "axios";
//创建axios实例
const service = axios.create({
  baseURL: "http://localhost:3000", // 只写到 3000，不要带 /api
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  }
})

//请求拦截器
service.interceptors.request.use(
  (config)=>{
    //获取token
    const token=localStorage.getItem("token");
    if(token){
      config.headers["Authorization"]=`Bearer ${token}`;
    }
    return config;
  },
  (error)=>{
    return Promise.reject(error);
  }
)
//响应拦截器
service.interceptors.response.use(
  (response)=>{
    return response.data;
  },
  (error)=>{
    return Promise.reject(error);
  }
)
export default service;