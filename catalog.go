package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
)

// Catalog is a collection of movies
type Catalog struct {
	ID   int    `db:"id,omitempty" json:"id"`
	Name string `db:"name" json:"name"`
}

func catalogRoutes() *chi.Mux {
	router := chi.NewRouter()
	router.Use(authMiddleware)
	// router.Post("/", createCatalog)
	router.Get("/{catalogID}", getCatalog)
	// router.Post("/movie", addMovie)
	return router
}

func getCatalog(w http.ResponseWriter, r *http.Request) {
	catalogID := chi.URLParam(r, "catalogID")

	var catalog Catalog
	col := db.Collection("catalogs")
	res := col.Find("id", catalogID)
	err := res.One(&catalog)

	if err != nil {
		log.Println(err)
		render.Render(w, r, notFound)
		return
	}

	render.JSON(w, r, catalog)
}
