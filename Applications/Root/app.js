const Alma = require( '../../alma' )

let io

const main = ( alma ) => {
    console.log( 'Welcome !' )
    
    io = require( 'socket.io' )( alma.getServer() )
    io.sockets.on( 'connection', function( socket ){
        
        socket.on( 'appLoader', function( appName ){
            Alma.AppLoader( appName )
        } )
        
    } )
    
    alma.addRoute( '/', 'public/index.html' )
    alma.addStaticRoute( 'public/static' )
}

module.exports = main