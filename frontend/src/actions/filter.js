import ActionTypes from './actionTypes';

const Actions = {
  setListFilter(payload) {
    return {
      type: ActionTypes.SET_LIST_FILTER,
      payload,
    }
  },
  resetListFilter(payload) {
    return {
      type: ActionTypes.RESET_LIST_FILTER,
      payload,
    }
  }
}

export default Actions