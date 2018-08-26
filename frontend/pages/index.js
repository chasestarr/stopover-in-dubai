import React from 'react';
import Router from 'next/router';

import { toaster } from 'evergreen-ui';

import { getUser, getUserIdFromToken, setToken } from '../api';
import withAuth from '../withAuth';

class Index extends React.Component {
  state = {
    user: null,
  };

  componentDidMount() {
    const userId = getUserIdFromToken();
    if (!userId) {
      this.logout();
    }

    getUser(userId)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        }

        // break to catch block
        throw new Error();
      })
      .then(user => this.setState({ user }))
      .catch(this.logout);
  }

  logout = () => {
    toaster.danger('Could not get user information');
    setToken('');
    router.push('/users/login');
  };

  render() {
    return <div>index</div>;
  }
}

export default withAuth(Index);
