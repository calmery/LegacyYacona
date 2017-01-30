const addRoute = ( startUp, path, fn ) => {
    console.log( startUp.app.get )
    startUp.app.get( path, fn )
}

module.exports = addRoute