import React from 'react';
import Router from 'next/router';
import {
  Button,
  Combobox,
  Heading,
  Paragraph,
  SelectMenu,
  TextInputField,
  toaster,
  TextInput,
} from 'evergreen-ui';

import withAuth from '../withAuth';
import Page from '../layouts/Page';
import { getCatalogs, getMovie, getUserIdFromToken, createCatalog } from '../api';
import AddMovieToCatalog from '../components/AddMovieToCatalog';
import CreateCatalog from '../components/CreateCatalog';

class Movie extends React.Component {
  state = {
    catalogs: [],
    movie: null,
  };

  async componentDidMount() {
    const movieId = this.props.url.query.id;
    try {
      const response = await getMovie(movieId);
      if (response.status === 200) {
        const movie = await response.json();
        this.setState({ movie });
      } else {
        toaster.danger('Could not request movie information');
      }
    } catch (e) {
      toaster.danger('Could not request movie information');
    }

    this.requestCatalogs();
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
          {this.state.movie && (
            <div style={{ display: 'flex' }}>
              <img src={`https://image.tmdb.org/t/p/w300${this.state.movie.poster_path}`} />
              <div style={{ marginLeft: '1rem', maxWidth: '500px' }}>
                <Heading marginBottom={8} size={900}>
                  {this.state.movie.title}
                </Heading>
                <Paragraph backgroundColor="rgba(20,181,208,.114)" padding={2} color="#056f8a">
                  {this.getGenresFromMovie(this.state.movie)
                    .map(g => g.name)
                    .join(', ')}
                </Paragraph>
                <Paragraph>{this.state.movie.overview}</Paragraph>
                <AddMovieToCatalog catalogs={this.state.catalogs} movie={this.state.movie} />
                <CreateCatalog onCreateCatalogSuccess={this.requestCatalogs} />
              </div>
            </div>
          )}
        </div>
      </Page>
    );
  }
}

export default withAuth(Movie);
