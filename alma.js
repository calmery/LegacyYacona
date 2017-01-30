let alma = {

    LibraryLoader: ( name ) => {
        return require( './Library/' + name )
    }

}

const express = alma.LibraryLoader( 'Express' )
const electron = alma.LibraryLoader( 'Electron' )
const utility = alma.LibraryLoader( 'Utility' )

/* *** Functions *** */

const startUp = express.startUp()

alma.app = ( appName ) => {
    electron.createWindow( 'http://localhost:3000/' + appName + '/' )
}

alma.addRoute = ( path, filePath ) => {
    express.addRoute( startUp, '/' + alma.appName + '/' + path, ( request, response ) => {
        alma.responder( request, response, filePath )
    } )
}

alma.addStaticRoute = ( path, fn ) => {
    
}

// SendResponse Wrapper
alma.responder = ( request, response, path ) => {
    startUp.sendResponse( request, response, alma.appName + '/' + path )
}

/* *** Applciation Loader *** */

alma.appLoader = ( appName ) => {
    require( './Applications/' + appName + '/app' )
    alma.app( appName )
}

module.exports = alma