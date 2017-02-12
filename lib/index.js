const moduleLoader    = require( './moduleLoader' ),
      appLoader       = require( './appLoader' ),
      localAppLoader  = require( './localAppLoader' ),
      addRoute        = require( './addRoute' ),
      appInstaller    = require( './appInstaller' ),
      remoteInstaller = require( './remoteInstaller' ),
      appRemover      = require( './appRemover' ),
      tap             = require( './tap' ),
      untap           = require( './untap' )

const notifier = require( 'node-notifier' )

let createWindow

const expressController  = moduleLoader( 'express' ),
      utility            = moduleLoader( 'utility' )

let server

let socketFunctions = {}
let io

let libraries = {}

class Yacona {
    
    constructor( path, appName ){
        this.name = appName
        this.path = path
    }
    
    getName(){
        return this.name
    }
    
    createWindow( url, options, fn ){
        if( createWindow === undefined ) createWindow = require( './createWindow' )
        return createWindow( this.name, server.port, url, options, fn )
    }
    
    addRoute( directory ){
        return addRoute( server, this.name, this.path, directory )
    }
    
    setSocket( name, fn ){
        let appName = this.getName()
        socketFunctions[appName + '.' + name] = fn
    }
    
    notifier( message ){
        notifier.notify( message )
    }
    
    createOwnServer( options ){
        this.server = expressController.startup( options )
        this.io = require( 'socket.io' )( this.server.server )
        return {
            server: this.server,
            port  : this.server.port,
            io    : this.io,
            url   : 'http://localhost:' + this.server.port + '/',
            addRoute: ( path, fn ) => expressController.addRoute( this.server.app, path, fn )
        }
    }
    
    static startup( options ){
        server = expressController.startup( options )
        
        io = require( 'socket.io' )( server.server )
        io.use( require( 'socketio-wildcard' )() )
        io.sockets.on( 'connection', ( socket ) =>{
            socket.on( '*', ( value ) => {
                let appName = socket.handshake.headers.referer.replace( /http:\/\//, '' )
                .replace( RegExp( socket.handshake.headers.host ), '' )
                .split( '/' )[1]
                let fn
                if( fn = socketFunctions[appName + '.' + value.data[0]] ) fn( socket, value.data[1] )
            } )
        } )
    }
    
    moduleLoader( moduleName ){
        if( libraries[moduleName] !== undefined ) return require( libraries[moduleName] )
        else return moduleLoader( moduleName )
    }
    
    static tap( repository, callback ){
        return tap( repository, callback )
    }
    
    static untap( repository, callback ){
        return untap( repository, callback )
    }
    
    static addLibrary( name, path ){
        if( libraries[name] === undefined ) libraries[name] = path
        else return false
    }
    
    static moduleLoader( moduleName ){
        if( libraries[moduleName] !== undefined ) return require( libraries[moduleName] )
        else return moduleLoader( moduleName )
    }
    
    static appLoader( appName ){
        if( server === undefined ) this.startup()
        return appLoader( appName )
    }
    
    static localAppLoader( path ){
        if( server === undefined ) this.startup()
        return localAppLoader( path )
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
