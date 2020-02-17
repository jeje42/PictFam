import axios, { AxiosRequestConfig } from 'axios';

const root = '/api/';

const axiosInstance = axios.create({
  baseUrl: `http://${window.location.host}${root}`,
} as AxiosRequestConfig);

const loadFromDefaultApiServer = (resource: string, callback: Function) => {
  axiosInstance.get(resource).then((res: any) => {
    callback(res.data._embedded[resource]);
  });
};

const loadFromCustomApiServer = (resource: string, callback: Function) => {
  axiosInstance.get(resource).then((res: any) => {
    callback(res.data);
  });
};

export { loadFromDefaultApiServer, loadFromCustomApiServer, axiosInstance };
