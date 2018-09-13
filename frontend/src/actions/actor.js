import ActionTypes from './actionTypes';

const Actions = {
  getActor(payload) {
    return {
      type: ActionTypes.GET_ACTOR,
      payload,
    }
  },
  getActorList(payload) {
    return {
      type: ActionTypes.GET_ACTOR_LIST,
      payload,
    }
  }
}

export default Actions