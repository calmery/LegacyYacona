const Alma = require( '../../alma' )

const main = ( alma ) => {
    console.log( 'Welcome !' )
    
    alma.getIO().on( 'connection', function( socket ){
        
        
    } )
    
    alma.addRoute( '/', 'public/index.html' )
    alma.addStaticRoute( 'public/static' )
}

module.exports = main