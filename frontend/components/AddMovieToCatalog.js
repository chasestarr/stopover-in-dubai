import React from 'react';
import { Button, Combobox, toaster } from 'evergreen-ui';

import { addMovieToCatalog } from '../api';

class AddMovieToCatalog extends React.Component {
  state = {
    isAddMovieLoading: false,
    selectedCatalog: null,
  };

  handleAddMovieToCatalog = async () => {
    this.setState({ isAddMovieLoading: true });
    try {
      const response = await addMovieToCatalog(this.props.movie.id, this.state.selectedCatalog.id);
      if (response.status !== 200) {
        toaster.danger('Could not add movie.');
      } else {
        toaster.success(`Successfully added to ${this.state.selectedCatalog.name}`);
      }
    } catch (e) {
      toaster.danger('Could not add movie.');
    }

    this.setState({ selectedCatalog: null, isAddMovieLoading: false });
  };

  render() {
    return (
      <div style={{ display: 'flex', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
        <Combobox
          openOnFocus
          items={this.props.catalogs}
          itemToString={item => (item ? item.name : '')}
          onChange={selectedCatalog => this.setState({ selectedCatalog })}
        />
        <Button
          appearance="primary"
          isLoading={this.state.isAddMovieLoading}
          disabled={!this.state.selectedCatalog}
          onClick={this.handleAddMovieToCatalog}
          marginLeft={8}
        >
          Add to catalog
        </Button>
      </div>
    );
  }
}

export default AddMovieToCatalog;
