package user

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
)

// User is a user of the application
type User struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Hash  string `json:"hash,omitempty"`
	Salt  string `json:"salt,omitempty"`
}

// Routes defines the available user related api routes
func Routes() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/{userID}", getUser)
	// router.Get("/{userID}/catalogs", getUserCatalogs)
	// router.Post("/", createUser)
	// router.Post("/login", login)
	return router
}

func getUser(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "userID")
	fmt.Printf("userID: %s", userID)
	user := User{
		ID:    1,
		Name:  "hello world",
		Email: "my-email@gmail.com",
	}
	render.JSON(w, r, user)
}
