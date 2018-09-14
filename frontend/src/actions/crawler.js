import ActionTypes from './actionTypes';

const Actions = {
  crawlActorList(payload) {
    return {
      type: ActionTypes.CRAWL_ACTOR_LIST,
      payload,
    }
  },
}

export default Actions