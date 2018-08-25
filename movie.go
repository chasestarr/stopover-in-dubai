package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/parnurzeal/gorequest"
)

// Genre is a genre pulled from the movie db api
type Genre struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// ProductionCompany is a production company pulled from the movie db api
type ProductionCompany struct {
	ID            int    `json:"id"`
	LogoPath      string `json:"logo_path,omitempty"`
	Name          string `json:"name"`
	OriginCountry string `json:"origin_country"`
}

// ProductionCountry is a production country pulled from the movie db api
type ProductionCountry struct {
	Iso31661 int    `json:"iso_3166_1"`
	Name     string `json:"name"`
}

// SpokenLanguage is a spoken language pulled from the movie db api
type SpokenLanguage struct {
	Iso6391 string `json:"iso_639_1"`
	Name    string `json:"name"`
}

// Movie is a movie pulled from the movie db api
// https://developers.themoviedb.org/3
type Movie struct {
	ID                  int                 `json:"id"`
	BackdropPath        string              `json:"backdrop_path"`
	Budget              int                 `json:"budget"`
	Genres              []Genre             `json:"genres"`
	ImdbID              string              `json:"imdb_id"`
	OriginalLanguage    string              `json:"original_language"`
	OriginalTitle       string              `json:"original_title"`
	Overview            string              `json:"overview"`
	Popularity          float64             `json:"popularity"`
	PosterPath          string              `json:"poster_path"`
	ProductionCompanies []ProductionCompany `json:"production_companies"`
	ProductionCountries []ProductionCountry `json:"production_countries"`
	ReleaseDate         string              `json:"release_date"`
	Revenue             int                 `json:"revenue"`
	Runtime             int                 `json:"runtime"`
	SpokenLanguages     []SpokenLanguage    `json:"spoken_languages"`
	Title               string              `json:"title"`
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
	movie := requestMovie(movieID)
	render.JSON(w, r, movie)
}

func searchMovies(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	movies := queryMovies(query)
	render.JSON(w, r, movies)
}

func requestMovie(movieID string) Movie {
	var movie Movie

	uri := "https://api.themoviedb.org/3/movie/" + movieID + "?api_key=" + os.Getenv("TMDB_KEY")
	gorequest.New().Get(uri).EndStruct(&movie)

	return movie
}

func queryMovies(query string) []Movie {
	type response struct {
		Page         int     `json:"page"`
		Results      []Movie `json:"results"`
		TotalPages   int     `json:"total_pages"`
		TotalResults int     `json:"total_results"`
	}

	var res response
	uri := "https://api.themoviedb.org/3/search/movie?api_key=" + os.Getenv("TMDB_KEY") + "&language=en&query=" + query
	log.Println(uri)
	gorequest.New().Get(uri).EndStruct(&res)

	log.Println(res)

	return res.Results
}
