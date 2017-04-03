const electron = require( 'electron' )

const app           = electron.app,
      BrowserWindow = electron.BrowserWindow

app.on( 'ready', () => {
    if( windowQueue.length !== 0 )
        for( let request; request = windowQueue.shift(); ) 
            createWindow( request.url, request.options, request.closeFn, request.callback )
} )

app.on( 'window-all-closed', app.quit )

let windowQueue = []

// createWindow( url, options, closeFn )
// createWindow( url, closeFn )
// createWindow( url )
const createWindow = ( url, options, closeFn, callback ) => {
    
    if( app.isReady() === false ){
        windowQueue.push( { url: url, options: options, closeFn: closeFn, callback: callback } )
        return false
    }

    if( typeof options === 'function' ){
        closeFn = options
        options = {}
    }
    
    if( options === undefined ) options = {}

    options.show = false

    let main = new BrowserWindow( options )

    main.loadURL( url )
    if( options.setResizable === false ) main.setResizable( false )
    if( options.setMaximumSize ) main.setMaximumSize( options.setMaximumSize.width, options.setMaximumSize.height)
    if( options.setMaxListeners ) main.setMaxListeners( options.setMaxListeners )
    if( options.openDevTools ) main.openDevTools()

    /***** Application events *****/

    main.on( 'closed', function(){
        main = null
        closeFn()
    } )

    // Ready
    main.show()
    
    if( callback !== undefined ) callback( main )
    
    return true

}

module.exports.new = createWindow
module.exports.app = app