import { put, call } from "redux-saga/effects";

import CrawlerApi from "../api/crawler";
import ActionTypes from "../actions/actionTypes";

export function* crawlActorList(action) {
  try {
    // grab the data from the actors heroku api
    const response = yield call(CrawlerApi.crawlActorList, action.payload);
    const responseResult = response.data;
    // if a actor is found and returned to us
    if (!responseResult.error) {
      const actorProfile = responseResult.data;
      yield put({ type: ActionTypes.CRAWL_ACTOR_LIST_SUCCESS, payload: actorProfile });
    } else {
      yield put({ type: ActionTypes.CRAWL_ACTOR_LIST_FAIL, payload: { error: 'Crawl failed' } });
    }

  } catch (e) {
    yield put({ type: ActionTypes.CRAWL_ACTOR_LIST_FAIL, payload: e });
  }
}