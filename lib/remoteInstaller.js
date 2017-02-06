const fs = require( 'fs' ),
      http = require( 'http' )

const moduleLoader = require( './moduleLoader' ),
      status       = require( './status' )

const utility = moduleLoader( 'utility' ),
      file    = moduleLoader( 'file' )

const repositories = utility.fixPath( __dirname, '..', 'repositories' )

const remoteInstaller = ( appName, callback ) => {

    if( utility.isExist( utility.fixPath( repositories, 'yacona.lck' ) ) === true ){
        if( callback ) callback( status.error( appName, 'REMOTE_INSTALL_YACONA_LCK' ) )
        return false
    }

    let index = JSON.parse( file.readFileSync( utility.fixPath( repositories, 'repository.json' ) ) )

    for( let repo in index ){
        if( index[repo].indexOf( appName ) !== -1 ){

            // Lock
            file.createEmpty( utility.fixPath( repositories, 'yacona.lck' ) )

            let installer = JSON.parse( file.readFileSync( utility.fixPath( repositories, repo, 'Index', appName ) ) )
            let path = fs.createWriteStream( utility.fixPath( repositories, '..', 'tmp', 'app.zip' ) )
            let request = http.get( installer.url, ( response ) => {
                response.pipe( path ) 
                require( './appInstaller' )( utility.fixPath( repositories, '..', 'tmp', 'app.zip' ), ( status ) => {
                    file.unlinkSync( utility.fixPath( repositories, 'yacona.lck' ) )
                    file.unlinkSync( utility.fixPath( repositories, '..', 'tmp', 'app.zip' ) )
                    if( callback ) callback( status )
                } )
            } )
        }
            
    }
}


module.exports = remoteInstaller