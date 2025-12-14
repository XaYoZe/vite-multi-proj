import axios from 'axios';

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_API,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getRequest = (url: string, data: any) => {
  return request({
    url: url,
    method: 'get',
    headers: {},
    data: data
  });
};

export const postRequest = (url: string, data: any) => {
  return request({
    url: url,
    method: 'post',
    headers: {},
    data: data
  });
};

export default request;
