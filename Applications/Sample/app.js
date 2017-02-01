module.exports = function( yacona ){
    
    console.log( yacona.getAppName() )
    yacona.addRoute( '/', 'public/index.html' )
    yacona.addStaticRoute( 'public/resources' )
    
}