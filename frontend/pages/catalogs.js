import React from 'react';
import Router from 'next/router';
import { Autocomplete, Heading, Link, Pane, Paragraph, TextInput, toaster } from 'evergreen-ui';

import withAuth from '../withAuth';
import Page from '../layouts/Page';
import SearchMovies from '../components/SearchMovies';
import { getCatalog } from '../api';

class Catalog extends React.Component {
  state = {
    catalog: null,
    queryResults: [],
  };

  async componentDidMount() {
    const catalogId = this.props.url.query.id;
    try {
      const response = await getCatalog(catalogId);
      if (response.status === 200) {
        const catalog = await response.json();
        this.setState({ catalog });
      } else {
        toaster.danger('Could not request catalog information');
      }
    } catch (e) {
      toaster.danger('Could not request catalog information');
    }
  }

  getMoviesFromCatalog = catalog => {
    if (!catalog || !catalog.movies) {
      return [];
    }
    return catalog.movies;
  };

  getGenresFromMovie = movie => {
    if (!movie || !movie.genres) {
      return [];
    }
    return movie.genres;
  };

  render() {
    return (
      <Page>
        <div>
          {this.state.catalog && (
            <div>
              <Heading marginBottom={8} size={900}>
                {this.state.catalog.name}
              </Heading>
              <SearchMovies />
              {this.getMoviesFromCatalog(this.state.catalog).map(movie => (
                <div key={movie.id}>
                  <Pane elevation={1} marginTop={16} padding={16} display="flex">
                    <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} />
                    <div style={{ marginLeft: '1rem' }}>
                      <Link href={`/movies?id=${movie.id}`} size={500}>
                        {movie.title}
                      </Link>
                      <Paragraph
                        backgroundColor="rgba(20,181,208,.114)"
                        padding={2}
                        marginTop={4}
                        color="#056f8a"
                      >
                        {this.getGenresFromMovie(movie)
                          .map(g => g.name)
                          .join(', ')}
                      </Paragraph>
                      <Paragraph marginTop={8}>{movie.overview}</Paragraph>
                    </div>
                  </Pane>
                </div>
              ))}
            </div>
          )}
        </div>
      </Page>
    );
  }
}

export default withAuth(Catalog);
