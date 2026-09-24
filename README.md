# Duunit

Application for managing and tracking your personal job application processes. Keep track of your job applications, interviews, and offers all in one place.

Production live in <https://duunit.site>

## Documentation

[Timelogs](/docs/timelogs.md)

## Running the application locally

Docker and Docker compose are needed to run the app.

Begin by cloning the project repository and run `npm i` to install development dependencies.

Start the application in development mode simply with command:

```bash
npm start
```

If you install dependencies or change Docker configurations in [docker-compose.yml](/docker-compose.yml) or [dev.Dockerfile](/dev.Dockerfile) rebuild the dev containers with:

```bash
npm start -- --build
```
