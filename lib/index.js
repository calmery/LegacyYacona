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
      kill            = require( './kill' ),
      config          = require( './config' ),
      documents       = require( './documents' ),
      share           = require( './share' )

const type = moduleLoader( 'typeof' ).type

let app
let createWindow

let paths = {}

const expressController  = moduleLoader( 'express' ),
      utility            = moduleLoader( 'utility' ),
      file               = moduleLoader( 'file' )

let currentDirectory

let server

let socketFunctions = {}
let io

let modules = {}

let clientModules = []

const addClientModule = ( path, filePath ) => {
    if( currentDirectory !== undefined ) filePath = utility.fixPath( currentDirectory, filePath )
    
    if( server === undefined ){
        clientModules.push( { path: path, filePath: filePath } )
    } else {
        server.app.get( '/yacona/' + path, ( request, response ) => {
            response.sendFile( utility.fixPath( filePath ) )
        } )
    }
}

let documentPrefix = '',
    configPrefix   = ''

const el = require( 'electron' )

paths.appData = el.app.getPath( 'appData' )
paths.documents = el.app.getPath( 'documents' )

// /Path/To/yacona

paths.appData = utility.fixPath( paths.appData, 'yacona' )
if( utility.isExist( paths.appData ) === false ) file.mkdirSync( paths.appData )

paths.documents = utility.fixPath( paths.documents, 'yacona' )
if( utility.isExist( paths.documents ) === false ) file.mkdirSync( paths.documents )

paths.appData = utility.fixPath( paths.appData, 'appData' )
if( utility.isExist( paths.appData ) === false ) file.mkdirSync( paths.appData )

if( configPrefix !== '' ){
    paths.appData = utility.fixPath( paths.appData, configPrefix )
    if( utility.isExist( paths.appData ) === false ) file.mkdirSync( paths.appData )
}

if( documentPrefix !== '' ){
    paths.documents = utility.fixPath( paths.documents, documentPrefix )
    if( utility.isExist( paths.documents ) === false ) file.mkdirSync( paths.documents )
}

class Yacona {
    
    constructor( path, appName ){
        this.name = appName
        this.path = path
        this.window = null
        this.node_notifier = require( 'node-notifier' )
        this.currentDirectory
        
        this.documents = {
            load: ( appName, name ) => { return documents.load( utility.fixPath( paths.documents, this.name ), appName, name ) },
            save: ( name, value ) => { return documents.save( utility.fixPath( paths.documents, this.name ), name, value ) },
            check: ( appName, name ) => { return utility.isExist( utility.fixPath( paths.documents, appName, name ) ) },
            list: ( appName, path ) => { return file.readdirSync( utility.fixPath( paths.documents, appName, path ) ) },
            share: {
                rmdir: ( name, dirPath ) => { return file.rmdirSync( utility.fixPath( paths.documents, name, dirPath ) ) }, 
                load: ( name, filePath ) => { return share.load( utility.fixPath( paths.documents, name ), filePath ) },
                save: ( name, filePath, value ) => { return share.save( utility.fixPath( paths.documents, name ), filePath, value ) }
            }
        }
        this.config = {
            load: ( appName, name ) => { return config.load( utility.fixPath( paths.appData, this.name ), appName, name ) },
            save: ( name, value ) => { return config.save( utility.fixPath( paths.appData, this.name ), name, value ) },
            check: ( appName, name ) => { 
                if( appName && name === undefined ){
                    name = appName
                    appName = this.getName()
                }
                return utility.isExist( utility.fixPath( paths.appData, appName, name ) ) 
            },
            list: ( appName, path ) => { return file.readdirSync( utility.fixPath( paths.appData, appName, path ) ) },
            share: {
                rmdir: ( name, dirPath ) => { return file.rmdirSync( utility.fixPath( paths.appData, name, dirPath ) ) }, 
                load: ( name, filePath ) => { return share.load( utility.fixPath( paths.appData, name ), filePath ) },
                save: ( name, filePath, value ) => { return share.save( utility.fixPath( paths.appData, name ), filePath, value ) }
            }
        }
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
        
        if( createWindow === undefined ){
            let c = require( './createWindow' )
            createWindow = c.createWindow
            app = c.app
        }
        
        let window = new Promise( ( resolve ) => { 
            createWindow( this.name, server.port, url, options, ( ...args ) => {
                appManager.remove( this.name, this.self )
                if( fn ) fn.apply( this, args )
            }, ( main ) => {
                this.window = main
                if( resolve ) resolve( main )
            } )
        } )
        
        return window
    }
    
    on( eventName, fn ){
        return eventor.on( this.name, eventName, fn )
    }
    
    emit( ...args ){
        let options = args.shift()
        if( typeof options === 'string' ){
            let eventName = options.split( '/' )
            options = {
                app: eventName.shift(),
                event: eventName.join( '/' )
            }
        }
        
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
        if( clientModules.length !== 0 ){
            for( let i=0; i<clientModules.length; i++ ){
                this.server.app.get( '/yacona/' + clientModules[i].path, ( request, response ) => {
                    response.sendFile( utility.fixPath( clientModules[i].filePath ) )
                } )
            }
        }
        this.io = require( 'socket.io' )( this.server.server )
        return {
            server: this.server,
            port  : this.server.port,
            io    : this.io,
            url   : 'http://localhost:' + this.server.port + '/',
            addRoute: ( path, fn ) => expressController.addRoute( this.server.app, path, fn )
        }
    }
    
    getWindow(){
        return ( this.window !== undefined ) ? this.window : false
    }
    
    getInstalledAppList(){
        let list = file.readdirSync( utility.fixPath( __dirname, '../', 'applications' ) )
        let l = []
        for( let i=0; i<list.length; i++ )
            if( list[i].toLowerCase() !== '.ds_store' && list[i].toLowerCase() !== 'thumbs.db' && list[i].toLowerCase() !== 'dummy' )
                l.push( list[i] )
        return l
    }
    
    static addClientModule( path, filePath ){
        return addClientModule( path, filePath )
    }
    
    static startup( options ){
        if( server !== undefined ) return false
        
        server = expressController.startup( options )
        
        if( clientModules.length !== 0 ){
            for( let i=0; i<clientModules.length; i++ ){
                server.app.get( '/yacona/' + clientModules[i].path, ( request, response ) => {
                    response.sendFile( utility.fixPath( clientModules[i].filePath ) )
                } )
            }
        }
        
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
    
    kill( appName, label ){
        if( appName === undefined ){
            return kill( this.getName(), this.self, server, appManager )
        } else {
            return kill( appName, label, server, appManager )
        }
    }
    
    localAppLoader( path ){
        if( this.currentDirectory !== undefined ) path = utility.fixPath( this.currentDirectory, path )
        return localAppLoader( appManager, path )
    }
    
    appList(){
        return appManager.list()
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
    
    appLoader( appName ){
        if( server === undefined ) this.startup()
        let y = appLoader( appName )
        y.instance.self = appManager.add( appName, y.instance )
        y.instance.currentDirectory = currentDirectory !== undefined ? currentDirectory : undefined
        return y
    }
    
    static appLoader( appName ){
        if( server === undefined ) this.startup()
        let y = appLoader( appName )
        y.instance.self = appManager.add( appName, y.instance )
        y.instance.currentDirectory = currentDirectory !== undefined ? currentDirectory : undefined
        return y
    }
    
    static setPrefix( prefix ){
        if( app || !prefix ) return false
        documentPrefix = prefix
        configPrefix = prefix
        return true
    }
    
    static setDocumentPrefix( prefix ){
        if( app || !prefix ) return false
        documentPrefix = prefix
        return true
    }
    
    static setConfigPrefix( prefix ){
        if( app || !prefix ) return false
        configPrefix = prefix
        return true
    }
    
    static localAppLoader( path ){
        if( server === undefined ) this.startup()
        if( currentDirectory !== undefined ) path = utility.fixPath( currentDirectory, path )
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
    
    static chdir( path ){
        currentDirectory = path
        return currentDirectory
    }
    
}

module.exports = Yacona
