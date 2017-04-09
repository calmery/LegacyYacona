const kill = ( appName, label, server, appManager, flag ) => {
    let stack
    if( server.app._router !== undefined && server.app._router.stack !== undefined ){

        let appList = appManager.list()
        let app = appList[appName]
        
        if( label ){
            app = app[label]
            if( flag === undefined && app.window ) app.window.close()
            appManager.remove( appName, label )
        } else {
            for( let i in app ){
                if( app[i].window ) app[i].window.close()
            }
            appManager.remove( appName )
        }
        
        let count = 0
        for( let _ in appList[appName] ){
            count++
        }
        
        if( count === 0 ){
            stack = server.app._router.stack

            for( let i=0; i<stack.length; i++ ){
                if( stack[i].route && stack[i].route.path && stack[i].route.path.indexOf( '/' + appName + '/*' ) !== -1 ){
                    stack.splice( i, 1 ) 
                    i = i - 1
                }
            }
        }
        
    }
}

module.exports = kill
