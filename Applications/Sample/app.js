module.exports = function( alma ){
    
    console.log( alma.getAppName() )
    alma.addRoute( '/', 'public/index.html' )
    alma.addStaticRoute( 'public/resources' )
    
}