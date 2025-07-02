import service from "../utils/request";
import axios from 'axios';

//登录
export const login = async(data) => {
  const res=await service.post("/api/login", data);
  return res;
};
//注册
export const register = async(data) => {
  const res=await service.post("/api/register", data);
  return res;
};

export const getUserInfo = () => {
  return axios.get('/api/userinfo', {
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
  });
};

export const updateUserInfo = (data) => {
  return axios.post('/api/userinfo', data, {
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
  });
};
