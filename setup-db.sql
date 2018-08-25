-- Database: stopover_in_dubai

-- DROP DATABASE stopover_in_dubai;

CREATE DATABASE stopover_in_dubai
  WITH OWNER = postgres
  ENCODING = 'UTF8'
  TABLESPACE = pg_default
  CONNECTION LIMIT = -1;

\connect stopover_in_dubai

-- Table: users

-- DROP TABLE users;

CREATE TABLE users(
  id serial PRIMARY KEY,
  name VARCHAR (50) NOT NULL,
  email VARCHAR (355) UNIQUE NOT NULL,
  hash VARCHAR (255) NOT NULL,
);

-- Table: catalogs

-- DROP TABLE catalogs;

CREATE TABLE catalogs(
  id serial PRIMARY KEY,
  name VARCHAR (50) NOT NULL
);

-- Table: users_catalogs

-- DROP TABLE users_catalogs;

CREATE TABLE users_catalogs(
  id serial PRIMARY KEY,
  user_id integer NOT NULL,
  catalog_id integer NOT NULL,
  CONSTRAINT users_catalogs_catalog_id_fkey FOREIGN KEY (catalog_id)
    REFERENCES catalogs (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT users_catalogs_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES users (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Table: catalogs_movies

-- DROP TABLE catalogs_movies;

CREATE TABLE catalogs_movies(
  id serial PRIMARY KEY,
  catalog_id integer NOT NULL,
  movie_id integer NOT NULL,
  CONSTRAINT catalogs_movies_catalog_id_fkey FOREIGN KEY (catalog_id)
    REFERENCES catalogs (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION
);
