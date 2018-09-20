import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';

import ActorList from '../components/ActorList';
import Details from '../components/Details';
import { history } from './index';

export default () => (
  <Router history={history}>
    <Switch>
      <Route path="/list" component={ActorList} />
      <Route path="/details/:actorId" component={Details} />
      <Redirect exact from="/" to="/list" />
      {/* <Route path="*" component={PageNotFound} /> */}
    </Switch>
  </Router>
);
