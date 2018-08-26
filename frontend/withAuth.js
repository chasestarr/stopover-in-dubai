import React from 'react';
import Router from 'next/router';

import { getToken } from './api';

export default function(Component) {
  class WithAuth extends React.Component {
    componentDidMount() {
      const token = getToken();
      if (!token) {
        Router.push('/users/login');
        return;
      }
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  return WithAuth;
}
