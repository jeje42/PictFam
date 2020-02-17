import { CHANGE_MODULE, Module } from './types';

export function changeModule(module: Module) {
  return {
    type: CHANGE_MODULE,
    module,
  };
}
