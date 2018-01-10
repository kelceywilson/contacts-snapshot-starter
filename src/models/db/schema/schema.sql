DROP TABLE IF EXISTS contacts;

CREATE TABLE contacts (
  id serial,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL
);

CREATE TABLE users (
  id serial,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  username varchar(255) UNIQUE NOT NULL,
  password varchar(255) NOT NULL,
  role varchar(8) NOT NULL DEFAULT 'regular'
)
