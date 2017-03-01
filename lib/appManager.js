let apps = {}

const add = ( appName ) => {
    if( apps[appName] !== undefined ) return false
    apps[appName] = true
    return ( () => { remove( appName ) } )
}

const remove = ( appName ) => {
    if( apps[appName] === undefined ) return false
    delete apps[appName]
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