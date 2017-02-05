const moduleLoader    = require( './moduleLoader' ),
      appLoader       = require( './appLoader' ),
      addRoute        = require( './addRoute' ),
      createWindow    = require( './createWindow' ),
      appInstaller    = require( './appInstaller' ),
      remoteInstaller = require( './remoteInstaller' ),
      appRemover      = require( './appRemover' ),
      tap             = require( './tap' ),
      untap           = require( './untap' )

const expressController  = moduleLoader( 'express' ),
      utility            = moduleLoader( 'utility' )

const server = expressController.startup()

let socketFunctions = {}
const io = require( 'socket.io' )( server.server )

io.use( require( 'socketio-wildcard' )() )

io.sockets.on( 'connection', ( socket ) =>{
    let appName = socket.handshake.headers.referer.replace( /http:\/\//, '' ).replace( RegExp( socket.handshake.headers.host ), '' ).split( '/' )[1]
    socket._on = socket.on
    socket.on = ( name, fn ) =>{
        if( name === '*' ) socket._on( name, fn ) 
        else socketFunctions[appName + '.' + name] = fn
    }
    socket.on( '*', ( value ) => {
        let fn
        if( fn = socketFunctions[appName + '.' + value.data[0]] ) fn( socket, value.data[1] )
    } )
} )

class Yacona {
    
    constructor( path, appName ){
        this.name = appName
        this.path = path
        this.io = io
    }
    
    getName(){
        return this.name
    }
    
    createWindow( url, options, fn ){
        return createWindow( this.name, server.port, url, options, fn )
    }
    
    addRoute( directory ){
        return addRoute( server, this.name, this.path, directory )
    }
    
    static tap( repository, callback ){
        return tap( repository, callback )
    }
    
    static untap( repository, callback ){
        return untap( repository, callback )
    }
    
    static moduleLoader( moduleName ){
        return moduleLoader( moduleName )
    }
    
    static appLoader( appName ){
        return appLoader( appName )
    }
    
    static appInstaller( archive, callback ){
        return appInstaller( archive, callback )
    }
    
    static remoteInstaller( archive, callback ){
        return remoteInstaller( archive, callback )
    }
    
    static appRemover( appName, callback ){
        return appRemover( appName, callback )
    }
    
}

module.exports = Yacona