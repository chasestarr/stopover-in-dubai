import React from 'react';
import Router from 'next/router';

import { Link, Paragraph, toaster } from 'evergreen-ui';

import withAuth from '../withAuth';
import Page from '../layouts/Page';
import { getCatalogs, getUserIdFromToken } from '../api';
import CreateCatalog from '../components/CreateCatalog';

class Index extends React.Component {
  state = {
    catalogs: [],
  };

  async componentDidMount() {
    await this.requestCatalogs();
  }

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

  render() {
    return (
      <Page>
        <div>
          {!!this.state.catalogs.length &&
            this.state.catalogs.map(catalog => (
              <Link key={catalog.id} href={`catalogs?id=${catalog.id}`} display="block">
                {catalog.name}
              </Link>
            ))}
        </div>
        <CreateCatalog onCreateCatalogSuccess={this.requestCatalogs} />
      </Page>
    );
  }
}

export default withAuth(Index);
