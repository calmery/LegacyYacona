const moduleLoader = require( './moduleLoader' )
const utility      = moduleLoader( 'utility' )

const addRoute = ( server, appName, appPath, directory ) => {
    let absolutePath = utility.fixPath( appPath, directory )
    server.addRoute( '/' + appName + '/*', ( request, response ) => {
        let url = request.url.split( '/' )
        
        url.shift()
        url.shift()

        // if directory root
        if( url[url.length-1] === '' ) url[url.length-1] = 'index.html'

        response.sendFile( utility.fixPath( absolutePath, url.join( '/' ) ) )
    } )
}

module.exports = addRoute