const moduleLoader = require( './moduleLoader' ),
      status       = require( './status' )

const utility = moduleLoader( 'utility' ),
      file    = moduleLoader( 'file' )

const repositories = utility.fixPath( __dirname, '..', 'repositories' )

const updateIndex = ( repository ) => {
    let repositoryJson = JSON.parse( file.readFileSync( utility.fixPath( repositories, 'repository.json' ) ) )
    delete repositoryJson[repository]
    file.writeFileSync( utility.fixPath( repositories, 'repository.json' ), JSON.stringify( repositoryJson ) )
}

const tap = ( repository, callback ) => {

    if( repository === undefined ){
        if( callback ) callback( status.error( repository, 'TAP_UNKNOWN_REPO' ) )
        return false
    }

    let options = {}

    switch( repository ){
        case 'yacona/core' :
            options.repository = 'yacona/yacona-core'
            options.name       = repository.split( '/' )[1]
            break
        default :
            options.repository = repository
            options.name       = repository.split( '/' ).join( '_' )
            break
    }
    
    if( utility.isExist( utility.fixPath( repositories, options.name ) ) === true ){
        file.rmdirSync( utility.fixPath( repositories, options.name ) )
        updateIndex( options.name )
        if( callback ) callback( status.complete() )
    } else if( callback ) callback( status.error( repository, 'TAP_UNKNOWN_REPO' ) )

}

module.exports = tap