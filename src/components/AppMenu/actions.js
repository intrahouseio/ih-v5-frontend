import { APP_MENU_SET_DATA  } from './constants';


export function setData(data) {
  return {
    type: APP_MENU_SET_DATA,
    data,
  };
}


export default {
  setData,
}