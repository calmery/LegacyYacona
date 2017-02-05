const addRoute = ( app, path, fn ) => app.get( path, fn )

module.exports = addRoute