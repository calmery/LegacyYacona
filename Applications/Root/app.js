const Alma = require( '../../alma' )

const main = ( alma ) => {
    console.log( 'Welcome !' )
    
    alma.getIO().on( 'connection', function( socket ){
        
        /*
        socket.on( 'appLoader', function( appName ){
            Alma.AppLoaderForRoot( appName )
        } )
        */
        
        alma.setSocket( 'appLoader', function( socket, value ){
            Alma.AppLoaderForRoot( value )
            socket.emit( 'appLoaded', 'OK' )
        } )
        
    } )
    
    alma.addRoute( '/', 'public/index.html' )
    alma.addStaticRoute( 'public/static' )
}

module.exports = main