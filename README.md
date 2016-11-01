# WisteriaLife
CSE 308 course project based on the Game of Life

## System Dependencies
[Node.js](https://nodejs.org/en/) (4.6.1+) - Used for managing dependencies

More dependencies to be added later.

## Setup Project
To setup project dependencies, run the following:

```
npm install
```

## Run Project
To start the project, run the following:

```
gulp
```

This will concatenate all the JavaScript files, compile the SCSS files, and start a local server on port 3000.

This will also start a file watch that will automatically recompile SCSS files and
process JavaScript files whenever a change is saved. There is no need to restart the server.

Source maps are generated for ease of debugging.

## Deploy Project
Before deploying the project, run the following:

```
gulp deploy
```

This will generate production ready minified versions of the JavaScript and SCSS files without sourcemaps.

## Design
Wisteria Life is using [Materialize CSS](http://materializecss.com/getting-started.html). Refer to its documentation.
