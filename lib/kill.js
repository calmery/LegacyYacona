const kill = ( appName, server, appManager ) => {
    let stack
    if( server.app._router !== undefined && server.app._router.stack !== undefined ){

        let appList = appManager.list()
        let app = appList[appName]

        stack = server.app._router.stack

        for( let i=0; i<stack.length; i++ ){
            if( stack[i].route && stack[i].route.path && stack[i].route.path.indexOf( '/' + appName + '/*' ) !== -1 ){
                stack.splice( i, 1 )
            }
        }

        if( app.window ) app.window.close()
    }
}

module.exports = kill