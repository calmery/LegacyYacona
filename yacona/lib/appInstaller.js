const fs    = require( 'fs' ),
      unzip = require( 'unzip' )

const moduleLoader = require( './moduleLoader' )
const utility = moduleLoader( 'utility' )

const status = require( './status' )

const appInstaller = ( path, callback ) => {
    let appName
    fs.createReadStream( path ).pipe( unzip.Parse() ).on( 'entry', function( entry ){
        if( entry.path.indexOf( 'MACOSX' ) !== -1 || entry.path.indexOf( '.DS_Store' ) !== -1 ) return false
        
        if( appName === undefined && entry.type === 'Directory' ){
            let directoryPath = entry.path.split( '/' )
            if( directoryPath.length === 2 && directoryPath[1] === '' ){
                
                appName = directoryPath[0]
                if( utility.isExist( utility.fixPath( __dirname, '..', 'applications', appName ) ) ){
                    if( callback ) callback( status.error( path, 'APP_ALREADY_INSTALLED' ) )
                } else {
                    
                    fs.createReadStream( path ).pipe( unzip.Extract( {
                        path: utility.fixPath( __dirname, '..', 'applications' )
                    } ).on( 'close', callback ) )
                    
                }
                
            }
        }
        
    } )
}

module.exports = appInstaller