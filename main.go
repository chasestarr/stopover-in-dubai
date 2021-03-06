package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/render"

	"upper.io/db.v3/lib/sqlbuilder"
	"upper.io/db.v3/postgresql"
)

var db sqlbuilder.Database

func init() {
	log.SetFlags(log.Lshortfile)

	var connectDSN = os.Getenv("POSTGRES_URI")

	dbSettings, err := postgresql.ParseURL(connectDSN)
	if err != nil {
		log.Fatal(err)
	}

	db, err = postgresql.Open(dbSettings)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("connected to database.")
}

func routes() *chi.Mux {
	router := chi.NewRouter()

	cors := cors.New(cors.Options{
		// AllowedOrigins: []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	})

	router.Use(
		render.SetContentType(render.ContentTypeJSON),
		middleware.Logger,
		middleware.DefaultCompress,
		middleware.RedirectSlashes,
		middleware.Recoverer,
		cors.Handler,
	)

	router.Route("/v1", func(r chi.Router) {
		r.Mount("/api/users", userRoutes())
		r.Mount("/api/catalogs", catalogRoutes())
		r.Mount("/api/movies", movieRoutes())
	})

	return router
}

func main() {
	router := routes()

	walk := func(method string, route string, handler http.Handler, middlewares ...func(http.Handler) http.Handler) error {
		log.Printf("%s %s\n", method, route)
		return nil
	}

	if err := chi.Walk(router, walk); err != nil {
		log.Panicf("Logging err: %s\n", err.Error())
	}

	log.Fatal(http.ListenAndServe(":"+os.Getenv("PORT"), router))
}
