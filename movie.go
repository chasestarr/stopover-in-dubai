package main

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
)

// Movie is a movie pulled from the movie db api
// https://developers.themoviedb.org/3
type Movie struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	Overview string `json:"overview"`
}

// CatalogMovie represents the join table between catalogs and movies
type CatalogMovie struct {
	ID        int `db:"id,omitempty"`
	CatalogID int `db:"catalog_id"`
	MovieID   int `db:"movie_id"`
}

func movieRoutes() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/search", searchMovies)
	router.Get("/{movieID}", getMovie)
	return router
}

func getMovie(w http.ResponseWriter, r *http.Request) {
	movieID := chi.URLParam(r, "movieID")
	fmt.Printf("movieID: %s", movieID)
	movie := Movie{
		ID:    1,
		Title: "movie 1",
	}
	render.JSON(w, r, movie)
}

func searchMovies(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	fmt.Printf("query: %s", query)
	movies := []Movie{
		{
			ID:    1,
			Title: "movie 1",
		},
		{
			ID:    2,
			Title: "movie 2",
		},
	}
	render.JSON(w, r, movies)
}
