const electron = require( 'electron' )

const app = electron.app,
      BrowserWindow = electron.BrowserWindow

let status = false

app.on( 'ready', function(){
    status = true
    if( windowQueue.length !== 0 ){
        for( let i=0; i<windowQueue.length; i++ ) 
            createWindow( windowQueue[i].url, windowQueue[i].option )
    }
} )

app.on( 'window-all-closed', function(){
    app.quit()
} )

let windowQueue = []

const createWindow = ( url, option ) => {
    
    if( status === false ){
        windowQueue.push( { url: url, option: option } )
        return false
    }

    if( option === undefined ) option = {}
    
    option.show = false
    
    let main = new BrowserWindow( option )
    
    main.loadURL( url )
    
    main.openDevTools()

    /***** Application events *****/
    
    main.on( 'closed', function(){
        main = null
    } )
    
    // Ready
    main.show()
    
    return true

}

module.exports = createWindow