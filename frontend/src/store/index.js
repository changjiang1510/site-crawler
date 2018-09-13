import { createStore, applyMiddleware, compose } from "redux";
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux'
import createSagaMiddleware from "redux-saga";
import reducers from "../reducers";
import rootSaga from '../sagas';
import { history } from '../router'

const reduxDevTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const routerMiddleware = createRouterMiddleware(history)
const sagaMiddleware = createSagaMiddleware();

let store = createStore(
  reducers,
  compose(applyMiddleware(sagaMiddleware, routerMiddleware), reduxDevTools)
);

sagaMiddleware.run(rootSaga);

export default store;