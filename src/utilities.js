export const splitText = text => text
  .toLowerCase()
  .replace( /[^\Wa-zA-Z0-9-]+/g, "" )
  .split( /[\s\n\t]+/g );

export const bigramHisto = text => splitText( text ).reduce( ( result, element, index ) => {
  const bigram = [ splitText( text )[ index ], splitText( text )[ index + 1 ] ].join( " " );
  result[ bigram ] = ( result[ bigram ] || 0 ) + 1;
  return result;
}, {} );

// export const histoMax = histo => Object.keys( histo ).filter( key => {
//   return histo[ key ] == Math.max.apply( null, Object.values( histo ) );
// } );

// [
//   ...text
//     .toLowerCase()
//     .replace(/[^a-zA-Z0-9-]+/g, "")
//     .replace(/[\s\t\n]+/g, " ")
//     .matchAll(/\b\w+\s+\w+\b/g),
// ]