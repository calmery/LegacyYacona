const libraryLoader = ( name ) => {
    return require( './Library/' + name )
}

const express = libraryLoader( 'Express' )
const electron = libraryLoader( 'Electron' )
const utility = libraryLoader( 'Utility' )

const server = express.startUp()

class Alma {
    
    constructor( appName ){
        this.appName = appName
    }
    
    getAppName(){
        return this.appName
    }
    
    addRoute( path, filePath ){
        express.addRoute( server, '/' + this.getAppName() + '/' + path, ( request, response ) => {
            this.responder( request, response, filePath )
        } )
    }
    
    responder( request, response, path ){
        server.sendResponse( request, response, this.getAppName() + '/' + path )
    }
    
    static LibraryLoader( name ){
        return libraryLoader( name )
    }
    
    static CreateWindow( appName ){
        electron.createWindow( 'http://localhost:3000/' + appName + '/' )
    }
    
    static AppLoader( appName ){
        require( './Applications/' + appName + '/app' )( new Alma( appName ) )
        this.CreateWindow( appName )
    }
}

module.exports = Alma