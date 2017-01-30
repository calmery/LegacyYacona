const libraryLoader = ( name ) => {
    return require( './Library/' + name )
}

const express = libraryLoader( 'Express' )
const electron = libraryLoader( 'Electron' )
const utility = libraryLoader( 'Utility' )

const server = express.startUp()

const io = require( 'socket.io' )( server.server )
const url = __dirname

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