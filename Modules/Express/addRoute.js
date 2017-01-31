const addRoute = ( startUp, path, fn ) => {
    startUp.app.get( path, fn )
}

module.exports = addRoute