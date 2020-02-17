import { AxiosRequestConfig } from 'axios';
import { Action } from 'redux';

export interface ActionRequest extends Action {
  request: AxiosRequestConfig;
}
