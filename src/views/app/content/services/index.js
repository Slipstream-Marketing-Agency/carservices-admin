import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const List = React.lazy(() =>
  import(/* webpackChunkName: "application-todo" */ './list')
);
const Add = React.lazy(() =>
  import(/* webpackChunkName: "application-survey" */ './add')
);
const Update = React.lazy(() =>
  import(/* webpackChunkName: "application-survey" */ './update')
);

const Applications = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
      <Route
        path={`${match.url}/list`}
        render={(props) => <List {...props} />}
      />
      <Route
        path={`${match.url}/add`}
        render={(props) => <Add {...props} />}
        isExact
      />
      <Route
        path={`${match.url}/update/:id`}
        render={(props) => <Update {...props} />}
        isExact
      />
      {/* <Route
        path={`${match.url}/chat`}
        render={(props) => <Chat {...props} />}
      /> */}
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Applications;
