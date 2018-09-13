import { put, call } from "redux-saga/effects";

import ActorApi from "../api/actor";
import ActionTypes from "../actions/actionTypes";

export function* retrieveActor(action) {
  try {
    // grab the data from the actors heroku api
    const response = yield call(ActorApi.fetchActorDetails, action.payload);
    const responseResult = response.data;
    // if a actor is found and returned to us
    if (responseResult.data) {
      const actorProfile = responseResult.data;
      yield put({ type: ActionTypes.GET_ACTOR_SUCCESS, payload: actorProfile });
    } else {
      yield put({ type: ActionTypes.GET_ACTOR_FAIL, payload: { error: 'No data' } });
    }

  } catch (e) {
    yield put({ type: ActionTypes.GET_ACTOR_FAIL, payload: e });
  }
}

export function* retrieveActorList(action) {
  try {
    // grab the data from the actors heroku api
    const response = yield call(ActorApi.fetchActorList, action.payload);
    const responseResult = response.data;
    // if a actor is found and returned to us
    if (responseResult.data) {
      const actorList = responseResult.data;
      yield put({ type: ActionTypes.GET_ACTOR_LIST_SUCCESS, payload: actorList });
    } else {
      yield put({ type: ActionTypes.GET_ACTOR_LIST_FAIL, payload: { error: 'No data' } });
    }

  } catch (e) {
    yield put({ type: ActionTypes.GET_ACTOR_LIST_FAIL, payload: e });
  }
}