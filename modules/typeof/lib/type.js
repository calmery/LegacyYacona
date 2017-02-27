const type = ( e ) => {
    if( e === undefined ) return undefined
    let t = typeof e
    if( t === 'object' ){
        if( e.length === undefined ) return 'object'
        else return 'array'
    } else return t
}

module.exports = type