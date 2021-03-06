const moduleLoader = require( './moduleLoader' )
const electronController = moduleLoader( 'electron' )

const createWindow = ( appName, port, url, options, fn, callback ) => {
    if( url === undefined ){
        url     = 'http://localhost:' + port + '/' + appName + '/'
    }
    let window = electronController.createWindow.new( url, options, fn, callback )
    return window
}

module.exports.createWindow = createWindow
module.exports.app = electronController.createWindow.app