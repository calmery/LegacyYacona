let apps = {}

const add = ( appName, yacona ) => {
    if( apps[appName] === undefined ) apps[appName] = {}
    
    let label = Math.random().toString( 36 ).slice( -8 )
    for( ;; ){
        if( apps[label] === undefined ) break
        label = Math.random().toString( 36 ).slice( -8 )
    }
    
    apps[appName][label] = yacona
    return label
}

const remove = ( appName, label ) => {
    if( apps[appName] === undefined ) return false
    
    if( label !== undefined ){
        delete apps[appName][label]
        
        let count = 0
        for( let _ in apps[appName] ) count++

        if( count === 0 ) delete apps[appName]
    } else {
        delete apps[appName]
    }

    return true
}

const getApps = () => {
    return apps
}

module.exports = {
    add   : add,
    remove: remove,
    list  : getApps 
}