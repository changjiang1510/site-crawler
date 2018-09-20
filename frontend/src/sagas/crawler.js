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
      const result = responseResult.data;
      yield put({ type: ActionTypes.CRAWL_ACTOR_LIST_SUCCESS, payload: result });
      yield put({ type: ActionTypes.GET_ACTOR_LIST, payload: action.payload });
    } else {
      yield put({ type: ActionTypes.CRAWL_ACTOR_LIST_FAIL, payload: { error: 'Crawl failed' } });
    }

  } catch (e) {
    yield put({ type: ActionTypes.CRAWL_ACTOR_LIST_FAIL, payload: e });
  }
}

export function* crawlActorDetails(action) {
  try {
    // grab the data from the actors heroku api
    const response = yield call(CrawlerApi.crawlActorDetails, action.payload);
    const responseResult = response.data;
    // if a actor is found and returned to us
    if (!responseResult.error) {
      const result = responseResult.data;
      yield put({ type: ActionTypes.CRAWL_ACTOR_DETAILS_SUCCESS, payload: result });
      yield put({ type: ActionTypes.GET_ACTOR, payload: action.payload });
    } else {
      yield put({ type: ActionTypes.CRAWL_ACTOR_DETAILS_FAIL, payload: { error: 'Crawl failed' } });
    }

  } catch (e) {
    yield put({ type: ActionTypes.CRAWL_ACTOR_DETAILS_FAIL, payload: e });
  }
}