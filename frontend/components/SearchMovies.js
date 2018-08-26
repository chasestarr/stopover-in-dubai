import React from 'react';
import router from 'next/router';
import { Autocomplete, TextInput } from 'evergreen-ui';

import { queryMovies } from '../api';

// from https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

class SearchMovies extends React.Component {
  state = {
    queryResults: [],
  };

  handleQueryChange = async value => {
    if (!value) {
      return;
    }

    try {
      const response = await queryMovies(value);
      const queryResults = await response.json();
      this.setState({ queryResults });
    } catch (e) {
      toaster.danger('Could not query movies.');
    }
  };
  debouncedHandleQueryChange = debounce(this.handleQueryChange, 500);

  render() {
    return (
      <Autocomplete
        title="Search movies"
        onChange={changedItem => router.push(`/movies?id=${changedItem.id}`)}
        onInputValueChange={this.debouncedHandleQueryChange}
        isFilterDisabled
        items={this.state.queryResults}
        itemToString={item => (item ? `${item.title} (${item.release_date})` : '')}
      >
        {props => {
          const { getInputProps, getRef, inputValue } = props;
          return (
            <TextInput
              placeholder="Search movies"
              value={inputValue}
              innerRef={getRef}
              {...getInputProps()}
            />
          );
        }}
      </Autocomplete>
    );
  }
}

export default SearchMovies;
