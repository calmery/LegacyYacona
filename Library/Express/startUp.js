const express = require( 'express' )
const http    = require( 'http' )

const utility = require( '../Utility' )

let exApp

let startUp = () => {

    var app  = express(),
        server = http.Server( app )

    // Application is using random port. So get a port number.
    const port = server.listen().address().port
    console.log( 'Running app on localhost:' + port )

    /***** Routing *****/

    // Resources
    app.use( express.static( utility.fixPath( __dirname, '../../static/' ) ) )

    const sendResponse = function( request, response, staticTemplatePath ){
        response.sendFile( 
            utility.fixPath( __dirname, '../../public/', 
                ( typeof staticTemplatePath === 'string' ? staticTemplatePath : ( request._parsedOriginalUrl.href + '.html' ) )
            ) 
        )
    }

    // Default paths
    const paths = {
        '/' : ( request, response ) => {
            sendResponse( request, response, 'index.html' )
        }
    }

    // Attach paths
    for( var path in paths )
        app.get( path, paths[path] ) 
    
    // Export
    return {
        server: server,
        app   : app,
        port  : port
    }

}

module.exports = startUp