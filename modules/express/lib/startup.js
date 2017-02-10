const express = require( 'express' ),
      http    = require( 'http' )

const addRoute = require( './addRoute' )

const startup = ( options ) => {

    let app  = express(),
        server = http.Server( app )
    
    let viewEngine = 'html'
    
    if( options === undefined ) options = {}
    
    if( options.viewEngine !== undefined ){
        if( options.viewEngine === 'ejs' ){
            app.set( 'view engine', 'ejs' )
            viewEngine = 'ejs'
        } else if( options.viewEngine === 'pug' ){
            app.set( 'view engine', 'pug' )
            viewEngine = 'pug'
        }
    }
    
    let listen = ( options.port === undefined ) ? server.listen() : server.listen( options.port )
    
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