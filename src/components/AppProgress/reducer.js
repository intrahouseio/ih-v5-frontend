import { 
  APP_PROGRESS_SET_DATA, 
} from './constants';


const defaultState = {
  open: false,
  progress: 0,
  list: [],
  complete: false,
  message: 'submit',
};


function reducer(state = defaultState, action) {
  switch (action.type) {
    case APP_PROGRESS_SET_DATA:
      return { ...state, ...action.data };
    default:
      return state;
  }
}


export default reducer;
