import ActionTypes from "../actions/actionTypes";

const initialState = {
  crawlStatus: ''
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.CRAWL_ACTOR_LIST:
      return {
        ...state,
        crawlStatus: 'processing',
      };
    case ActionTypes.CRAWL_ACTOR_LIST_SUCCESS:
      return {
        ...state,
        crawlStatus: 'done',
      };
    case ActionTypes.CRAWL_ACTOR_DETAILS:
      return {
        ...state,
        crawlStatus: 'processing',
      };
    case ActionTypes.CRAWL_ACTOR_DETAILS_SUCCESS:
      return {
        ...state,
        crawlStatus: 'done',
      };
    default:
      return {
        ...state,
        crawlStatus: '',
      };
  }
}