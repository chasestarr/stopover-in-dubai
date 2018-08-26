package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"upper.io/db.v3/lib/sqlbuilder"
)

// Catalog is a collection of movies
type Catalog struct {
	ID   int    `db:"id,omitempty" json:"id,omitempty"`
	Name string `db:"name" json:"name"`
}

// UsersCatalog represents the join table between users and catalogs
type UsersCatalog struct {
	ID        int `db:"id,omitempty"`
	CatalogID int `db:"catalog_id"`
	UserID    int `db:"user_id"`
}

func catalogRoutes() *chi.Mux {
	router := chi.NewRouter()
	router.Use(authMiddleware)
	router.Post("/", createCatalog)
	router.Get("/{catalogID}", getCatalog)
	router.Post("/{catalogID}/movies", addMovie)
	return router
}

func createCatalog(w http.ResponseWriter, r *http.Request) {
	var body Catalog
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&body)
	if err != nil {
		render.Render(w, r, badRequest(err))
		return
	}

	userID, err := getUserIDFromContext(r.Context())
	if err != nil {
		render.Render(w, r, undefinedError(err))
		return
	}

	catalog := &Catalog{Name: body.Name}
	err = db.Tx(nil, func(tx sqlbuilder.Tx) error {
		err = tx.Collection("catalogs").InsertReturning(catalog)
		if err != nil {
			return err
		}

		usersCatalog := &UsersCatalog{CatalogID: catalog.ID, UserID: userID}
		_, err = tx.Collection("users_catalogs").Insert(usersCatalog)
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		render.Render(w, r, undefinedError(err))
		return
	}

	render.JSON(w, r, catalog)
}

func getCatalog(w http.ResponseWriter, r *http.Request) {
	type output struct {
		ID     int     `json:"id"`
		Name   string  `json:"name"`
		Movies []Movie `json:"movies"`
	}

	catalogID := chi.URLParam(r, "catalogID")

	var catalog Catalog
	col := db.Collection("catalogs")
	res := col.Find("id", catalogID)
	err := res.One(&catalog)

	if err != nil {
		render.Render(w, r, notFound)
		http.Error(w, http.StatusText(404), 404)
		return
	}

	var catalogMovies []CatalogMovie
	col = db.Collection("catalogs_movies")
	res = col.Find("catalog_id", catalogID)
	err = res.All(&catalogMovies)
	if err != nil {
		http.Error(w, http.StatusText(404), 404)
		return
	}

	var movies []Movie
	for _, m := range catalogMovies {
		movie := requestMovie(strconv.Itoa(m.MovieID))
		movies = append(movies, movie)
	}

	render.JSON(w, r, output{ID: catalog.ID, Name: catalog.Name, Movies: movies})
}

func addMovie(w http.ResponseWriter, r *http.Request) {
	type input struct {
		MovieID int `json:"movieId"`
	}

	catalogID, err := strconv.Atoi(chi.URLParam(r, "catalogID"))
	userID, err := getUserIDFromContext(r.Context())
	if err != nil {
		render.Render(w, r, undefinedError(err))
		return
	}

	var body input
	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&body)
	if err != nil {
		render.Render(w, r, badRequest(err))
		return
	}

	rows, err := db.Query(`Select * from users_catalogs WHERE catalog_id = ? AND user_id = ?`, catalogID, userID)
	if err != nil {
		render.Render(w, r, forbidden)
		return
	}

	var usersCatalogs []UsersCatalog
	iter := sqlbuilder.NewIterator(rows)
	iter.All(&usersCatalogs)

	if len(usersCatalogs) < 1 {
		render.Render(w, r, forbidden)
		return
	}

	catalogMovie := &CatalogMovie{CatalogID: catalogID, MovieID: body.MovieID}
	col := db.Collection("catalogs_movies")
	err = col.InsertReturning(catalogMovie)
	if err != nil {
		render.Render(w, r, undefinedError(err))
		return
	}

	render.Status(r, http.StatusCreated)
}
