import React from 'react';
import { Button, TextInputField, toaster } from 'evergreen-ui';

import { createCatalog } from '../api';

class CreateCatalog extends React.Component {
  state = {
    catalogName: '',
    isCreateCatalogLoading: false,
  };

  handleCreateCatalog = async e => {
    e.preventDefault();

    this.setState({ isCreateCatalogLoading: true });
    try {
      const response = await createCatalog(this.state.catalogName);
      if (response.status !== 200) {
        toaster.danger('Could not create catalog.');
      } else {
        toaster.success(`Successfully created catalog ${this.state.catalogName}`);
        this.props.onCreateCatalogSuccess();
      }
    } catch (e) {
      toaster.danger('Could not create catalog.');
    }

    this.setState({ catalogName: '', isCreateCatalogLoading: false });
  };

  render() {
    return (
      <form
        onSubmit={this.handleCreateCatalog}
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
        }}
      >
        <TextInputField
          label="Create catalog"
          onChange={e => this.setState({ catalogName: e.target.value })}
          value={this.state.catalogName}
        />
        <Button
          appearance="primary"
          isLoading={this.state.isCreateCatalogLoading}
          disabled={!this.state.catalogName}
          marginLeft={8}
        >
          Create catalog
        </Button>
      </form>
    );
  }
}

export default CreateCatalog;
