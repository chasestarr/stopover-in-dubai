import React from 'react';
import Head from 'next/head';
import router from 'next/router';
import { Combobox, Link, Paragraph, toaster } from 'evergreen-ui';

import { getUser, getCatalogs, getUserIdFromToken, unsetToken } from '../api';

class Page extends React.Component {
  state = {
    catalogs: [],
    user: null,
  };

  componentDidMount() {
    this.requestUser();
    this.requestCatalogs();
  }

  requestUser = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      this.logout();
    }

    try {
      const request = await getUser(userId);
      if (request.status === 200) {
        const user = await request.json();
        this.setState({ user });
      }
    } catch (e) {
      this.logout();
    }
  };

  requestCatalogs = async () => {
    const userId = getUserIdFromToken();
    try {
      const response = await getCatalogs(userId);
      if (response.status === 200) {
        const catalogs = await response.json();
        this.setState({ catalogs });
      }
    } catch (e) {
      toaster.danger('Could not request catalogs.');
    }
  };

  logout = () => {
    toaster.danger('Could not get user information');
    unsetToken();
    router.push('/users/login');
  };

  render() {
    return (
      <div
        style={{
          maxWidth: '1024px',
          margin: '0 auto',
        }}
      >
        <Head>
          <title>Stopover in Dubai</title>
        </Head>
        {this.state.user && (
          <div
            style={{
              margin: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <Paragraph>{this.state.user.name}</Paragraph>
              <Paragraph>{this.state.user.email}</Paragraph>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Combobox
                openOnFocus
                items={this.state.catalogs}
                itemToString={item => (item ? item.name : '')}
                onChange={catalog => router.push(`/catalogs?id=${catalog.id}`)}
              />
              <Link marginLeft={16} href="/">
                Home
              </Link>
            </div>
          </div>
        )}
        <div style={{ margin: '1rem' }}>{this.props.children}</div>
      </div>
    );
  }
}

export default Page;
