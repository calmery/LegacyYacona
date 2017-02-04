const utility = require( '../Modules/Utility' )

const simple_git = require( 'simple-git' )
const repository = utility.fixPath( __dirname, './Repository/' )

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
                if( args[0] === null ) console.log( 'Repository pull completed' )
                else console.log( 'Git (' + repo + ') pull faild.' )
            } )
        } else {
            let git = simple_git( repository )
            git.clone( 'https://github.com/' + path + '.git', name, {}, ( ...args ) => {
                console.log( args )
                if( args[0] === null ) console.log( 'Repository clone completed' )
                else console.log( 'Git (' + repo + ') clone faild.' )
            } )
        }
        
    } else console.log( 'Tap Error : Repository is undefined.' )
    
}

tap( 'yacona/core' )