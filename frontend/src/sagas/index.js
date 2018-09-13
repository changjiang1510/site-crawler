import { all, takeLatest, takeEvery } from "redux-saga/effects";

import ActionTypes from "../actions/actionTypes";

import { retrieveActor, retrieveActorList } from "./actor";

export default function* rootSaga() {
  yield all([
    takeLatest(ActionTypes.GET_ACTOR, retrieveActor),
    takeEvery(ActionTypes.GET_ACTOR_LIST, retrieveActorList),
  ]);
}