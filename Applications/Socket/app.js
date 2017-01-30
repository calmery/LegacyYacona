const Alma = require( '../../alma' )

const main = ( alma ) => {
    console.log( 'Welcome !' )
    
    alma.getIO().on( 'connection', function( socket ){
        
        socket.on( 'appLoader', function( appName ){
            Alma.AppLoader( appName )
        } )
        
    } )
    
    alma.addRoute( '/', 'public/index.html' )
    alma.addStaticRoute( 'public/static' )
}

module.exports = main