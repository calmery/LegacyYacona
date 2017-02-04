const fs = require( 'fs' )

const utility = require( '../Modules/Utility' )

const simple_git = require( 'simple-git' )
const repository = utility.fixPath( __dirname, './Repository/' )

const updateRepositoryIndex = () => {
    let repositoryJson = fs.readFileSync( repository + '/../repository.json', 'utf-8' )
    repositoryJson = JSON.parse( repositoryJson )

    let index = fs.readdirSync( 'Yacona/Repository/Core/Index' )
    repositoryJson['Core'] = index

    fs.writeFileSync( repository + '/../repository.json', JSON.stringify( repositoryJson ) )
}

const tap = ( repo ) => {
    
    let path, name
    switch( repo ){
        case 'yacona/core' :
            path = 'calmery/Yacona-core'
            name = 'Core'
            break
        default :
            break
    }
    
    if( path !== undefined ){
        
        if( utility.isExist( repository + '/' + name ) === true ){
            let git = simple_git( repository + '/' + name )
            git.pull( ( ...args ) => {
                if( args[0] === null ){
                    
                    
                    console.log( 'Repository pull completed' )
                    
                    // Repository.json update
                    // require('fs').readdir( 'Yacona/Repository/Core', ( error, list ) => { console.log( list ) } )
                    
                    updateRepositoryIndex()
                    
                }
                else console.log( 'Git (' + repo + ') pull faild.' )
            } )
        } else {
            let git = simple_git( repository )
            git.clone( 'https://github.com/' + path + '.git', name, {}, ( ...args ) => {
                console.log( args )
                if( args[0] === null ){
                    console.log( 'Repository clone completed' )
                    updateRepositoryIndex()
                } else console.log( 'Git (' + repo + ') clone faild.' )
            } )
        }
        
    } else console.log( 'Tap Error : Repository is undefined.' )
    
}

tap( 'yacona/core' )