# AngularMonorepo

# Project Versions

This project was built using the following versions:

- **Node.js**: `v22.2.0`
- **Angular CLI**: `v18.1.1`
- **Docker**: `v27.0.3` (Build `7d4bcd8`)

## Docker
Run `docker-compose build --no-cache` on root folder and when finish Run `docker-compose up`

## Running the app locally
Run `npm install`

## Start the application

Run `npx nx serve knowify` to start the development server. Happy coding!
**API URL**: [http://localhost:4200/](http://localhost:4200/)

## Start the api

Run `npx nx serve api` to start the api
**API URL**: [http://localhost:3000/api/](http://localhost:3000/api/)

## Build for production

Run `npx nx build knowify` to build the application. The build artifacts are stored in the output directory (e.g. `dist/` or `build/`), ready to be deployed.

## Running test

Run `npx nx test knowify`

## API 

- **Base URL**: [http://localhost:3000/api/](http://localhost:3000/api/)

### Available Endpoints

- **GET reservations**: Retrieve a list of all reservations. (http://localhost:3000/api/reservations)

