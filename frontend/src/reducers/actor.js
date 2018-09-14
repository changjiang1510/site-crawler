import ActionTypes from "../actions/actionTypes";

const initialState = {
  profile: {},
  actorList: [],
  _loading: false,
  error: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.GET_ACTOR:
      return {
        ...state,
        _loading: true
      };
    case ActionTypes.GET_ACTOR_SUCCESS:
      return {
        ...state,
        profile: { ...action.payload },
        _loading: false
      };
    case ActionTypes.GET_ACTOR_FAIL:
      return {
        ...state,
        _loading: false,
        error: action.payload
      };
    case ActionTypes.GET_ACTOR_LIST:
      return {
        ...state,
        _loading: true
      };
    case ActionTypes.GET_ACTOR_LIST_SUCCESS:
      return {
        ...state,
        actorList: action.payload.slice(),
        _loading: false
      };
    case ActionTypes.GET_ACTOR_LIST_FAIL:
      return {
        ...state,
        _loading: false,
        error: action.payload
      };
    default:
      return state;
  }
}