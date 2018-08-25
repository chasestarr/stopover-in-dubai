package main

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
)

// Catalog is a collection of movies
type Catalog struct {
	ID   int    `db:"id" json:"id"`
	Name string `db:"name" json:"name"`
}

func catalogRoutes() *chi.Mux {
	router := chi.NewRouter()
	// router.Post("/", createCatalog)
	router.Get("/{catalogID}", getCatalog)
	// router.Post("/movie", addMovie)
	return router
}

func getCatalog(w http.ResponseWriter, r *http.Request) {
	catalogID := chi.URLParam(r, "catalogID")
	fmt.Printf("catalogID: %s", catalogID)
	catalog := Catalog{
		ID:   1,
		Name: "hello world",
	}
	render.JSON(w, r, catalog)
}
