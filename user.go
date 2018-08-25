package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"upper.io/db.v3/lib/sqlbuilder"
)

// User is a user of the application
type User struct {
	ID    int    `db:"id,omitempty"`
	Name  string `db:"name"`
	Email string `db:"email"`
	Hash  string `db:"hash"`
}

func userRoutes() *chi.Mux {
	router := chi.NewRouter()
	router.Route("/{userID}", func(r chi.Router) {
		r.Use(authMiddleware)
		r.Get("/", getUser)
		r.Get("/catalogs", getUserCatalogs)
	})
	router.Post("/", createUser)
	router.Post("/login", login)
	return router
}

func getUser(w http.ResponseWriter, r *http.Request) {
	type output struct {
		ID    int    `json:"id,omitempty"`
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	userID := chi.URLParam(r, "userID")

	var user User
	col := db.Collection("users")
	res := col.Find("id", userID)
	err := res.One(&user)

	if err != nil {
		render.Render(w, r, notFound)
		return
	}

	render.JSON(w, r, output{ID: user.ID, Name: user.Name, Email: user.Email})
}

func getUserCatalogs(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "userID")

	rows, err := db.Query(`
		SELECT
			catalogs.id,
			catalogs.name
		FROM
			catalogs
		INNER JOIN
			users_catalogs on catalogs.id = users_catalogs.catalog_id
		INNER JOIN
			users on users.id = ?
	`, userID)

	if err != nil {
		render.Render(w, r, undefinedError(err))
		return
	}

	var catalogs []Catalog
	iter := sqlbuilder.NewIterator(rows)
	iter.All(&catalogs)

	render.JSON(w, r, catalogs)
}

func createUser(w http.ResponseWriter, r *http.Request) {
	type input struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	type output struct {
		ID    int    `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	var body input
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&body)
	if err != nil {
		render.Render(w, r, badRequest(err))
		return
	}

	hash, err := hashPassword(body.Password)
	if err != nil {
		render.Render(w, r, undefinedError(err))
		return
	}

	user := &User{Name: body.Name, Email: body.Email, Hash: hash}

	col := db.Collection("users")
	err = col.InsertReturning(user)
	if err != nil {
		render.Render(w, r, undefinedError(err))
		return
	}

	render.JSON(w, r, output{ID: user.ID, Name: user.Name, Email: user.Email})
}

func login(w http.ResponseWriter, r *http.Request) {
	type input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	type output struct {
		Token string `json:"token"`
	}

	var body input
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&body)
	if err != nil {
		render.Render(w, r, badRequest(err))
		return
	}

	var user User
	col := db.Collection("users")
	res := col.Find("email", body.Email)
	err = res.One(&user)

	if err != nil {
		render.Render(w, r, authFailed)
		return
	}

	if ok := checkPasswordHash(body.Password, user.Hash); !ok {
		render.Render(w, r, authFailed)
		return
	}

	jwt, err := issueJwt(strconv.Itoa(user.ID))
	if err != nil {
		render.Render(w, r, undefinedError(err))
		return
	}

	render.JSON(w, r, output{Token: jwt})
}
