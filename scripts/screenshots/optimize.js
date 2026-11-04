/**
 * Optimize the screenshots and banners for wordpress.org.
 *
 * Converts the PNG files in `.wordpress-org` to palette PNGs with sharp,
 * which uses libimagequant, the library behind pngquant. A file is only
 * replaced if the result is smaller. The plugin icons are designed by hand
 * and left alone.
 *
 * Usage: `npm run screenshots:optimize`, no WordPress needed. Pass
 * `screenshot` or `banner` to optimize only those files.
 */
const fs = require( 'fs' );
const path = require( 'path' );
const sharp = require( 'sharp' );

const dir = path.join( __dirname, '../../.wordpress-org' );

const types = process.argv.slice( 2 );

if ( 0 === types.length ) {
	types.push( 'screenshot', 'banner' );
}

( async () => {
	const files = fs
		.readdirSync( dir )
		.filter(
			( file ) =>
				file.endsWith( '.png' ) &&
				types.some( ( type ) => file.startsWith( `${ type }-` ) )
		);

	for ( const file of files ) {
		const filePath = path.join( dir, file );
		const input = fs.readFileSync( filePath );

		const output = await sharp( input )
			.png( { palette: true, effort: 10, compressionLevel: 9 } )
			.toBuffer();

		if ( output.length >= input.length ) {
			continue;
		}

		fs.writeFileSync( filePath, output );

		// eslint-disable-next-line no-console
		console.log(
			`${ file }: ${ Math.round( input.length / 1024 ) } KB → ${ Math.round(
				output.length / 1024
			) } KB`
		);
	}
} )();
