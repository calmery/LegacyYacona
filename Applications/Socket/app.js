const main = ( yacona ) => {
    console.log( 'Welcome !' )
    
    yacona.getIO().on( 'connection', function( socket ){
        
        
    } )
    
    yacona.addRoute( '/', 'public/index.html' )
    yacona.addStaticRoute( 'public/static' )
}

module.exports = main