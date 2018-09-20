import ActionTypes from "../actions/actionTypes";

const initialState = {
  listFilter: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SET_LIST_FILTER:
      return {
        ...state,
        listFilter: { ...action.payload },
      };
    case ActionTypes.RESET_LIST_FILTER:
      return {
        ...state,
        listFilter: {},
      };
    default:
      return state;
  }
}