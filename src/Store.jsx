// store.js
import { createStore } from 'redux';

// Initial state
const initialState = {
  length: 30,
  width: 5.0,
  height: 5.0,
  apexHeight: 5.22,
  numberOfBays: 3,
  customValue: 7.5,
  baySize: 10.0,
  leftAwning: false,
  rightAwning: false,
  frontAwning: false,
  backAwning: false,
  leftCantilever: false,
  rightCantilever: false,
  frontCantilever: false,
  backCantilever: false,
};

// Action types
const UPDATE_LEFT_AWNING = 'UPDATE_LEFT_AWNING';
const UPDATE_RIGHT_AWNING = 'UPDATE_RIGHT_AWNING';
const UPDATE_FRONT_AWNING = 'UPDATE_FRONT_AWNING';
const UPDATE_BACK_AWNING = 'UPDATE_BACK_AWNING';
const UPDATE_LEFT_CANTILEVER = 'UPDATE_LEFT_CANTILEVER';
const UPDATE_RIGHT_CANTILEVER = 'UPDATE_RIGHT_CANTILEVER';
const UPDATE_FRONT_CANTILEVER = 'UPDATE_FRONT_CANTILEVER';
const UPDATE_BACK_CANTILEVER = 'UPDATE_BACK_CANTILEVER';

const UPDATE_RAFTER = 'UPDATE_RAFTER'

// Action creators
export const updateLeftAwning = (visibility) => ({
  type: UPDATE_LEFT_AWNING,
  payload: visibility,
});

export const updateRightAwning = (visibility) => ({
  type: UPDATE_RIGHT_AWNING,
  payload: visibility,
});

export const updateFrontAwning = (visibility) => ({
  type: UPDATE_FRONT_AWNING,
  payload: visibility,
});

export const updateBackAwning = (visibility) => ({
  type: UPDATE_BACK_AWNING,
  payload: visibility,
});
export const updateLeftCantilever = (visibility) => ({
  type: UPDATE_LEFT_CANTILEVER,
  payload: visibility,
});

export const updateRightCantilever = (visibility) => ({
  type: UPDATE_RIGHT_CANTILEVER,
  payload: visibility,
});

export const updateFrontCantilever = (visibility) => ({
  type: UPDATE_FRONT_CANTILEVER,
  payload: visibility,
});

export const updateBackCantilever = (visibility) => ({
  type: UPDATE_BACK_CANTILEVER,
  payload: visibility,
});


export const updateRafter = (visibility) => ({
  type: UPDATE_RAFTER,
  payload: visibility,
});

// Action
const updateApexHeight = (newApexHeight) => ({
  type: 'UPDATE_APEX_HEIGHT',
  payload: newApexHeight,
});

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LEFT_AWNING:
      return { ...state, leftAwning: action.payload };
    case UPDATE_RIGHT_AWNING:
      return { ...state, rightAwning: action.payload };
    case UPDATE_FRONT_AWNING:
      return { ...state, frontAwning: action.payload };
    case UPDATE_BACK_AWNING:
    return { ...state, backAwning: action.payload };
    case UPDATE_LEFT_CANTILEVER:
      return { ...state, leftCantilever: action.payload };
    case UPDATE_RIGHT_CANTILEVER:
      return { ...state, rightCantilever: action.payload };
    case UPDATE_FRONT_CANTILEVER:
      return { ...state, frontCantilever: action.payload };
    case UPDATE_BACK_CANTILEVER:
      return { ...state, backCantilever: action.payload };
    case 'UPDATE_SIZE':
      return { ...state, ...action.payload };
    case 'UPDATE_APEX_HEIGHT':
      return { ...state, apexHeight: action.payload };

      case 'UPDATE_RAFTER':
        return { ...state, apexHeight: action.payload };

    default:
      return state;
  }
};

// Create store
const store = createStore(reducer);

export default store;
