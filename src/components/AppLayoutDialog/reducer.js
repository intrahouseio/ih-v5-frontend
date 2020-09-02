import { APP_LAYOUT_DIALOG_SET_DATA } from './constants';


const defaultState = {
  open: false,
  list: [],
  containers: {},
  templates: {},
  elements: {},
};


function reducer(state = defaultState, action) {
  switch (action.type) {
    case APP_LAYOUT_DIALOG_SET_DATA:
      return { ...state, ...action.data };
    default:
      return state;
  }
}


export default reducer;
