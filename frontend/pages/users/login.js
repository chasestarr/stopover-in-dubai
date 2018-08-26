import React from 'react';
import Router from 'next/router';
import { Button, Link, TextInputField, toaster } from 'evergreen-ui';

import { loginUser, setToken, getToken } from '../../api';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    loading: false,
  };

  componentDidMount() {
    const token = getToken();
    if (token) {
      Router.push('/');
      return;
    }
  }

  componentDidUpdate() {
    const token = getToken();
    if (token) {
      Router.push('/');
      return;
    }
  }

  handleLoginUser = e => {
    e.preventDefault();

    this.setState({ loading: true });

    loginUser({ email: this.state.email, password: this.state.password })
      .then(res => {
        if (res.status === 200) {
          return res
            .json()
            .then(body => setToken(body.token))
            .then(() => toaster.success('Successfully logged in.'));
        } else if (res.status === 401) {
          return toaster.danger('Invalid email-password combination.');
        }

        toaster.danger('Unable to login.');
      })
      .then(() => this.setState({ loading: false }))
      .catch(err => {
        this.setState({ loading: false });
        toaster.danger('Could not create user.');
      });
  };

  render() {
    return (
      <form onSubmit={this.handleLoginUser}>
        <TextInputField
          label="Email"
          required
          onChange={e => this.setState({ email: e.target.value })}
          value={this.state.email}
        />

        <TextInputField
          label="Password"
          type="password"
          required
          onChange={e => this.setState({ password: e.target.value })}
          value={this.state.password}
        />

        <Button appearance="primary" isLoading={this.state.loading}>
          Login
        </Button>

        <Link href="/users/new" appearance="blue" display="block" marginTop="1rem">
          Create new account
        </Link>
      </form>
    );
  }
}

export default Login;
