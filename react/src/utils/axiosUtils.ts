import axios, { AxiosRequestConfig } from 'axios';

export const postRequest = (data: any, options: AxiosRequestConfig) => axios.post(options.url!, data, options);

export const getRequest = (options: AxiosRequestConfig) => axios.get(options.url!, options);
