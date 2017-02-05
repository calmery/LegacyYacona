const simple_git = require( 'simple-git' )

const moduleLoader = require( './moduleLoader' ),
      status       = require( './status' )

const utility = moduleLoader( 'utility' ),
      file    = moduleLoader( 'file' )

const repositories = utility.fixPath( __dirname, '..', 'repositories' )

const updateIndex = ( repository ) => {
    let repositoryJson = JSON.parse( file.readFileSync( utility.fixPath( repositories, 'repository.json' ) ) )
    let index = file.readdirSync( utility.fixPath( repositories, repository, 'Index' ) )
    
    repositoryJson[repository] = index
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
        
        let git = simple_git( utility.fixPath( repositories, options.name ) )
        git.pull( ( ...args ) => {
            if( args[0] === null ){
                updateIndex( options.name )
                if( callback ) callback( status.complete() )
            } else if( callback ) callback( status.error( repository, 'TAP_PULL_FAILED' ) )
        } )
        
    } else {
            
        let git = simple_git( repositories )
        git.clone( 'https://github.com/' + options.repository + '.git', options.name, {}, ( ...args ) => {
            if( args[0] === null ){
                updateIndex( options.name )
                if( callback ) callback( status.complete() )
            } else if( callback ) callback( status.error( repository, 'TAP_CLONE_FAILED' ) )
        } )
        
    }

}

module.exports = tap