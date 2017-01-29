/* Test */

let electron = require( './Library/Electron' )

setTimeout( () => {
    console.log( electron.createWindow() )
    console.log( electron.createWindow() )
    console.log( electron.createWindow() )
}, 1000 )

let alma = require( './alma' )

alma.appLoader( 'Sample' )