const unzip = require( 'unzip' )
const fs = require( 'fs' )
const utility = require( '../Modules/Utility' )

const installer = ( path, callback ) => {
    let appName
    fs.createReadStream( path ).pipe( unzip.Parse() ).on( 'entry', function( entry ){
        if( entry.type === 'Directory' && entry.path.indexOf( 'OSX' ) === -1 ){
            appName = entry.path
            if( appName.indexOf( '/' ) !== -1 ) appName = appName.replace( /\//g, '' )
            if( utility.isExist( utility.fixPath( 'Applications/' + appName ) ) === false ){
                fs.createReadStream( path ).pipe( unzip.Extract( {
                    path: utility.fixPath( 'Applications/' )
                } ) )
                callback( true )
            } else callback( false )
        }
    } )
}

module.exports = installer