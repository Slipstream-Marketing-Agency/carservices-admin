import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Workshop = React.lazy(() =>
  import(/* webpackChunkName: "application-todo" */ './workshop')
);

const Service = React.lazy(() =>
  import(/* webpackChunkName: "application-todo" */ './services')
);

const Brand = React.lazy(() =>
  import(/* webpackChunkName: "application-todo" */ './brands')
);

const Blog = React.lazy(() =>
  import(/* webpackChunkName: "application-todo" */ './blog')
);

const BlogCategory = React.lazy(() =>
  import(/* webpackChunkName: "application-todo" */ './blog-category')
);

// const Survey = React.lazy(() =>
//   import(/* webpackChunkName: "application-survey" */ './survey')
// );
// const SurveyDetail = React.lazy(() =>
//   import(/* webpackChunkName: "application-survey-detail" */ './survey-detail')
// );
// const Chat = React.lazy(() =>
//   import(/* webpackChunkName: "application-chat" */ './chat')
// );

const Applications = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/workshop`} />
      <Route
        path={`${match.url}/workshop`}
        render={(props) => <Workshop {...props} />}
      />
      <Route
        path={`${match.url}/services`}
        render={(props) => <Service {...props} />}
      />
      <Route
        path={`${match.url}/brands`}
        render={(props) => <Brand {...props} />}
      />
      <Route
        path={`${match.url}/blog`}
        render={(props) => <Blog {...props} />}
      />
      <Route
        path={`${match.url}/blog-category`}
        render={(props) => <BlogCategory {...props} />}
      />
      {/* <Route
        path={`${match.url}/survey/:surveyid`}
        render={(props) => <SurveyDetail {...props} />}
        isExact
      />
      <Route
        path={`${match.url}/survey`}
        render={(props) => <Survey {...props} />}
        isExact
      />
      <Route
        path={`${match.url}/chat`}
        render={(props) => <Chat {...props} />}
      /> */}
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Applications;
