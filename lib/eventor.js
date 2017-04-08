const status = require( './status' )
const type = ( e ) => {
    if( e === undefined ) return undefined
    let t = typeof e
    if( t === 'object' )
        if( e.length === undefined ) return 'object'
        else return 'array'
    else return t
}

let functions = {}

const on = ( appName, name, fn ) => {
    if( ( name !== undefined && type( name ) === 'string' ) && ( fn !== undefined && type( fn ) === 'function' ) )
        functions[appName + '.' + name] = fn
    else 
        return status.error( this.name, 'MISSING_REQUIRED_ARGUMENTS' )
    return true
}

const emit = ( options, args ) => {
    let eventName = options['app'] + '.' + options['event']
    if( functions[eventName] === undefined ) return status.error( this.name, 'EVENT_NOT_FOUND' )
    else return functions[eventName].apply( this, args )
}

module.exports = {
    on  : on,
    emit: emit
}
