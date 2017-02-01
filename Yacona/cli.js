const libraryLoader = ( name ) => {
    return require( '../Modules/' + name )
}

const express = libraryLoader( 'Express' )
const electron = libraryLoader( 'Electron' )
const utility = libraryLoader( 'Utility' )

const server = express.startUp()

const io = require( 'socket.io' )( server.server )
const url = __dirname + '/../'

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

let alreadyRuned = []

class Yacona {
    
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
        electron.createWindow( 'http://localhost:3000/' + appName + '/', {}, () => {
            alreadyRuned.splice( alreadyRuned.indexOf( appName ), 1 )
        } )
    }
    
    static AppLoaderForRoot( appName ){
        console.log( 'AppLoaderForRoot : ' + appName )
        if( alreadyRuned.indexOf( appName ) === -1 ){
            require( url + '/Applications/' + appName + '/app' )( new Yacona( appName ) )
            this.CreateWindow( appName )
            alreadyRuned.push( appName )
        }
    }
    
    static AppLoader( appName ){
        console.log( 'AppLoader : ' + appName )
        if( alreadyRuned.indexOf( appName ) === -1 ){
            require( '../Applications/' + appName + '/app' )( new Yacona( appName ) )
            this.CreateWindow( appName )
            alreadyRuned.push( appName )
        }
    }
}

module.exports = Yacona