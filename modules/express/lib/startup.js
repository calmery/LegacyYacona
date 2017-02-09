const express = require( 'express' ),
      http    = require( 'http' )

const addRoute = require( './addRoute' )

const startup = ( port ) => {

    let app  = express(),
        server = http.Server( app )
    
    let viewEngine = 'html'
    
    if( typeof port !== 'number' ){
        if( port === 'ejs' ){
            app.set( 'view engine', 'ejs' )
            viewEngine = 'ejs'
        }
        port = undefined
    }
    
    let listen = port === undefined ? server.listen() : server.listen( port )
    
    // Export
    return {
        server    : server,
        app       : app,
        port      : listen.address().port,
        viewEngine: viewEngine,
        addRoute  : ( path, fn ) => addRoute( app, path, fn )
    }

}

module.exports = startup