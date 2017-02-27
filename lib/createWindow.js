const moduleLoader = require( './moduleLoader' )
const electronController = moduleLoader( 'electron' )

const createWindow = ( appName, port, url, options, fn ) => {
    if( url === undefined ){
        url     = 'http://localhost:' + port + '/' + appName + '/'
    }
    return electronController.createWindow( url, options, fn )
}

module.exports = createWindow