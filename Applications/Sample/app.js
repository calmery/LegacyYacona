let alma = require( '../../alma' )
alma.appName = 'Sample' 

alma.addRoute( '/abc', ( request, response ) => {
    alma.responder( request, response, 'public/index.html' )
} )