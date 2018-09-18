import ActionTypes from './actionTypes';

const Actions = {
  crawlActorList(payload) {
    return {
      type: ActionTypes.CRAWL_ACTOR_LIST,
      payload,
    }
  },
  crawlActorDetails(payload) {
    return {
      type: ActionTypes.CRAWL_ACTOR_DETAILS,
      payload,
    }
  },
}

export default Actions