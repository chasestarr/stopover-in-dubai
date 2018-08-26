import React from 'react';
import Router from 'next/router';
import { Button, Link, TextInputField, toaster } from 'evergreen-ui';

import { createUser, loginUser, setToken, getToken } from '../../api';

class CreateUser extends React.Component {
  state = {
    name: '',
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

  handleCreateUser = e => {
    e.preventDefault();

    this.setState({ loading: true });

    createUser({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
    })
      .then(res => {
        if (res.status === 409) {
          toaster.danger('Email already exists.');
        }
        if (res.status === 200) {
          toaster.success('Successfully created user account.');
          return loginUser({ email: this.state.email, password: this.state.password })
            .then(res => res.json())
            .then(body => setToken(body.token));
        }
      })
      .then(() => this.setState({ loading: false }))
      .catch(err => {
        this.setState({ loading: false });
        toaster.danger('Could not create user.');
      });
  };

  render() {
    return (
      <form onSubmit={this.handleCreateUser}>
        <TextInputField
          label="Name"
          required
          onChange={e => this.setState({ name: e.target.value })}
          value={this.state.name}
        />

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
          Create
        </Button>

        <Link href="/users/login" appearance="blue" display="block" marginTop="1rem">
          Login
        </Link>
      </form>
    );
  }
}

export default CreateUser;
