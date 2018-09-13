import React, { Fragment } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import createBrowserHistory from 'history/createBrowserHistory'

// Module root components
// import TabBase from '../TabBase';
// import Details from '../components/Details';
import Layout from '../components/Layout';
// import PageNotFound from './common/components/PageNotFound';

export const history = createBrowserHistory();

export default () => (
  <Fragment>
    <Router history={history}>
      <Switch>
        <Route path="/" component={Layout} />
        {/* <Route path="*" component={PageNotFound} /> */}
      </Switch>
    </Router>
  </Fragment>
);
