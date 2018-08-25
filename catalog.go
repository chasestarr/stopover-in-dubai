package main

import (
	"encoding/json"
	"log"
	"net/http"

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
	// router.Post("/movie", addMovie)
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
