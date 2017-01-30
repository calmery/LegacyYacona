let alma = require( '../../alma' )

alma.appName = 'Sample'
alma.addRoute( '/', 'public/index.html' )
alma.addStaticRoute( 'public/resources' )