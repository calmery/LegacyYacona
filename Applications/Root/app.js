const Yacona = require( '../../Yacona' )

const main = ( yacona ) => {
    console.log( 'Welcome !' )
    
    yacona.getIO().on( 'connection', function( socket ){
        
        /*
        socket.on( 'appLoader', function( appName ){
            Yacona.AppLoaderForRoot( appName )
        } )
        */
        
        yacona.setSocket( 'appLoader', function( socket, value ){
            Yacona.AppLoaderForRoot( value )
            socket.emit( 'appLoaded', 'OK' )
        } )
        
    } )
    
    yacona.addRoute( '/', 'public/index.html' )
    yacona.addStaticRoute( 'public/static' )
}

module.exports = main