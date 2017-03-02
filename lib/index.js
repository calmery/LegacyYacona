const moduleLoader    = require( './moduleLoader' ),
      moduleChecker   = require( './moduleChecker' ),
      appLoader       = require( './appLoader' ),
      appManager      = require( './appManager' ),
      localAppLoader  = require( './localAppLoader' ),
      addRoute        = require( './addRoute' ),
      appInstaller    = require( './appInstaller' ),
      remoteInstaller = require( './remoteInstaller' ),
      appRemover      = require( './appRemover' ),
      tap             = require( './tap' ),
      untap           = require( './untap' ),
      eventor         = require( './eventor' ),
      kill            = require( './kill' )

const type = moduleLoader( 'typeof' ).type

let createWindow

const expressController  = moduleLoader( 'express' ),
      utility            = moduleLoader( 'utility' )

let server

let socketFunctions = {}
let io

let modules = {}

const addClientModule = ( path, filePath ) => {
    server.app.get( '/yacona/' + path, ( request, response ) => {
        response.sendFile( filePath )
    } )
}

class Yacona {
    
    constructor( path, appName ){
        this.name = appName
        this.path = path
        this.window = null
        this.node_notifier = require( 'node-notifier' )
    }
    
    getName(){
        return this.name
    }
    
    createWindow( url, options, fn ){
        
        if( type( url ) === 'object' ){
            
            if( type( options ) === 'function' ){
                fn = options
            }
            
            options = url
            url = undefined
            
        } else if( type( url ) === 'function' ){
            fn = url
            url = undefined
        }
        
        if( createWindow === undefined ) createWindow = require( './createWindow' )
        let window = createWindow( this.name, server.port, url, options, ( ...args ) => {
            appManager.remove( this.name )
            if( fn ) fn.apply( this, args )
        }, ( main ) => {
            this.window = main
        } )
        
        this.window = window
        
        return ( this.window !== undefined )
    }
    
    on( eventName, fn ){
        return eventor.on( this.name, eventName, fn )
    }
    
    emit( options, args ){
        return eventor.emit( options, args )
    }
    
    addRoute( directory ){
        return addRoute( server, this.name, this.path, directory )
    }
    
    setSocket( name, fn ){
        let appName = this.getName()
        socketFunctions[appName + '.' + name] = fn
    }
    
    NotificationCenter(){
        return this.node_notifier.NotificationCenter
    }
    
    notifier( message ){
        if( message !== undefined ) this.node_notifier.notify( message )
        return true
    }
    
    setNotifierEvent( eventName, fn ){
        this.node_notifier.on( eventName, fn )
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
    
    static addClientModule( path, filePath ){
        return addClientModule( path, filePath )
    }
    
    static startup( options ){
        if( server !== undefined ) return false
        
        server = expressController.startup( options )
        
        addClientModule( 'yacona.js', utility.fixPath( __dirname, '..', 'clients', 'yacona.js' ) )
        
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
        if( modules[moduleName] !== undefined ) return require( modules[moduleName] )
        else return moduleLoader( moduleName )
    }
    
    kill( appName ){
        return kill( appName, server, appManager )
    }
    
    static appList(){
        return appManager.list()
    }
    
    static tap( repository, callback ){
        return tap( repository, callback )
    }
    
    static untap( repository, callback ){
        return untap( repository, callback )
    }
    
    static addModule( name, path ){
        if( modules[name] === undefined ) modules[name] = path
        else return false
    }
    
    static moduleLoader( moduleName ){
        if( modules[moduleName] !== undefined ) return require( modules[moduleName] )
        else return moduleLoader( moduleName )
    }
    
    static moduleChecker( moduleName ){
        return moduleChecker( moduleName )
    }
    
    static appLoader( appName ){
        if( server === undefined ) this.startup()
        let y = appLoader( appName )
        appManager.add( appName, y.instance )
        delete y.instance
        return y
    }
    
    static localAppLoader( path ){
        if( server === undefined ) this.startup()
        return localAppLoader( appManager, path )
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
