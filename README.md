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

This will start a file watch that will automatically recompile SCSS files. There is no need to restart the server.

A similar JavaScript file watch will be added later.


To only concatenate the JavaScript files without restarting the server, run this in another terminal window:

```
gulp scripts
```

This should run a Gulp task to concatenate all the JavaScript files.

## Design
Wisteria Life is using [Materialize CSS](http://materializecss.com/getting-started.html). Refer to its documentation.
