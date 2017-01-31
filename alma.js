const libraryLoader = ( name ) => {
    return require( './Library/' + name )
}

const express = libraryLoader( 'Express' )
const electron = libraryLoader( 'Electron' )
const utility = libraryLoader( 'Utility' )

const server = express.startUp()

const io = require( 'socket.io' )( server.server )
const url = __dirname

// Using *
io.use( require( 'socketio-wildcard' )() )

io.sockets.on( 'connection', ( socket ) =>{
    socket.on( '*', ( value ) => {
        socketEvent( socket, value )
    } )
} )

let fn = {}

function socketEvent( socket, value ){
    let appName = socket.handshake.headers.referer.replace( /http:\/\//, '' ).replace( RegExp( socket.handshake.headers.host ), '' ).split( '/' )[1]
    if( fn[appName + '.' + value.data[0]] ) fn[appName + '.' + value.data[0]]( socket, value.data[1] )
}

class Alma {
    
    constructor( appName ){
        this.appName = appName
    }
    
    getAppName(){
        return this.appName
    }
    
    addRoute( path, filePath ){
        express.addRoute( server, '/' + this.getAppName() + '/' + path, ( request, response ) => {
            this.responder( request, response, this.getAppName() + '/' + filePath )
        } )
    }
    
    addStaticRoute( path ){
        express.addRoute( server, '/' + this.getAppName() + '/*', ( request, response ) => {
            let url = request.url.split( '/' )
            url.shift()
            url.shift()
            server.appStaticResponse( request, response, utility.fixPath( 'Applications', this.getAppName(), path, url.join( '/' ) ) )
        } )
    }
    
    getIO(){
        return io.sockets
    }
    
    getServer(){
        return server.server
    }
    
    setSocket( name, event ){
        let appName = this.getAppName()
        fn[appName + '.' + name] = event
    }

    responder( request, response, path ){
        server.sendResponse( request, response, path )
    }
    
    static LibraryLoader( name ){
        return libraryLoader( name )
    }
    
    static CreateWindow( appName ){
        electron.createWindow( 'http://localhost:3000/' + appName + '/' )
    }
    
    static AppLoaderForRoot( appName ){
        require( url + '/Applications/' + appName + '/app' )( new Alma( appName ) )
        this.CreateWindow( appName )
    }
    
    static AppLoader( appName ){
        require( './Applications/' + appName + '/app' )( new Alma( appName ) )
        this.CreateWindow( appName )
    }
}

module.exports = Alma