const moduleLoader = require( './moduleLoader' )
const electronController = moduleLoader( 'electron' )

const createWindow = ( appName, port, url, options, fn ) => {
    if( url === undefined || typeof url !== 'string' ){
        fn      = options
        options = url
        url     = 'http://localhost:' + port + '/' + appName + '/'
    }
    return electronController.createWindow( url, options, fn )
}

module.exports = createWindow