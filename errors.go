package main

import (
	"net/http"

	"github.com/go-chi/render"
)

type errResponse struct {
	Err            error `json:"-"` // low-level runtime error
	HTTPStatusCode int   `json:"-"` // http response status code

	StatusText string `json:"status"`          // user-level status message
	AppCode    int64  `json:"code,omitempty"`  // application-specific error code
	ErrorText  string `json:"error,omitempty"` // application-level error message, for debugging
}

func (e *errResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.HTTPStatusCode)
	return nil
}

func invalidRequest(err error) render.Renderer {
	return &errResponse{
		Err:            err,
		HTTPStatusCode: 400,
		StatusText:     "Invalid request.",
		ErrorText:      err.Error(),
	}
}

func badRequest(err error) render.Renderer {
	return &errResponse{
		Err:            err,
		HTTPStatusCode: 422,
		StatusText:     "Bad request.",
		ErrorText:      err.Error(),
	}
}

func undefinedError(err error) render.Renderer {
	return &errResponse{
		Err:            err,
		HTTPStatusCode: 500,
		StatusText:     "Internal server error.",
		ErrorText:      err.Error(),
	}
}

var authFailed = &errResponse{HTTPStatusCode: 401, StatusText: "Could not find user with email-password combination."}
var notFound = &errResponse{HTTPStatusCode: 404, StatusText: "Resource not found."}
