const electron = require( 'electron' )

const app = electron.app,
      BrowserWindow = electron.BrowserWindow

let status = false

app.on( 'ready', function(){
    status = true
} )

app.on( 'window-all-closed', function(){
    app.quit()
} )

const createWindow = ( option ) => {
    
    if( status === false ) return false

    if( option === undefined ) option = {}
    
    option.show = false
    
    let main = new BrowserWindow( option )
    
    main.loadURL( 'http://www.google.com' )

    /***** Application events *****/
    
    main.on( 'closed', function(){
        main = null
    } )
    
    // Ready
    main.show()
    
    return true

}

module.exports = createWindow