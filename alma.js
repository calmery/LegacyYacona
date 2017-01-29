let alma = {

    LibraryLoader: ( name ) => {
        return require( './Library/' + name )
    }

}

const express = alma.LibraryLoader( 'Express' )

/* *** Functions *** */

const startUp = express.startUp()

alma.addRoute = ( path, fn ) => {
    express.addRoute( startUp, path, fn )
}

alma.addStaticRoute = ( path, fn ) => {
    
}

alma.responder = ( request, response, path ) => {
    startUp.sendResponse( request, response, alma.appName + '/' + path )
}

/* *** Applciation Loader *** */

alma.appLoader = ( appName ) => {
    require( './Applications/' + appName + '/app' )
}

module.exports = alma