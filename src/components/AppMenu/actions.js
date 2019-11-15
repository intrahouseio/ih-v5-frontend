import { APP_MENU_SET_DATA, APP_MENU_SET_SELECT } from './constants';


export function setData(data) {
  return {
    type: APP_MENU_SET_DATA,
    data,
  };
}

export function setSelect(id, selectid) {
  return {
    type: APP_MENU_SET_SELECT,
    selectid,
  };
} 


export default {
  setData,
  setSelect,
}