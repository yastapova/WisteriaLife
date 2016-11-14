# WisteriaLife
CSE 308 course project based on the Game of Life

## System Dependencies
[Node.js](https://nodejs.org/en/) (4.6.1+)

## Setup Project
To setup project dependencies, run the following:

```
npm install
gulp materialize
```

## Run Project
To start the project, run the following:

```
gulp
```

This will concatenate all the JavaScript files and compile the SCSS files.

This will also start a file watch that will automatically recompile SCSS files and
process JavaScript files whenever a change is saved.

Source maps are generated for ease of debugging.

Then, in another terminal instance, run the following to start a server on port 3000:

```
npm start
```

This will be combined in the future.

## Deploy Project
Before deploying the project, run the following:

```
gulp deploy
```

This will generate production ready minified versions of the JavaScript and SCSS files without sourcemaps.

## Design
Wisteria Life is using [Materialize CSS](http://materializecss.com/getting-started.html). Refer to its documentation.
