import React from 'react';
import queryString from 'query-string';

const withUrlQs = WrappedComponent => {
  const queryParams = queryString.parse(window.location.href.split('?')[1]);

  return class extends React.PureComponent {
    render() {
      return <WrappedComponent {...this.props} urlQsObj={queryParams} />;
    }
  };
};

export default withUrlQs;
