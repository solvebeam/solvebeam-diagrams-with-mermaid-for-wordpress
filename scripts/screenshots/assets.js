/**
 * Banner for wordpress.org.
 *
 * Rendered from HTML with the plugin icon and a diagram that Mermaid renders
 * in the page. Adjust the CSS variables in `style` and the `diagram` code to
 * change the banner. The plugin icon in `.wordpress-org` is designed by hand
 * and not generated.
 *
 * Usage: `npm run screenshots:assets`, no WordPress needed.
 */
const fs = require( 'fs' );
const path = require( 'path' );
const { chromium } = require( '@playwright/test' );

const root = path.join( __dirname, '../..' );
const outputDir = path.join( root, '.wordpress-org' );

const iconSvg = fs.readFileSync( path.join( outputDir, 'icon.svg' ), 'utf8' );

const diagram = `flowchart LR
    A[Mermaid code] --> B{Block editor}
    B -->|Preview| C[Diagram]
    B -->|Publish| D[Website]`;

const style = `
	:root {
		--background: linear-gradient( 135deg, #1d2327 0%, #2c3338 45%, #21759b 100% );
		--color: #ffffff;
		--muted: rgba( 255, 255, 255, 0.85 );
		--card: #ffffff;
		--font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
	}

	* { box-sizing: border-box; margin: 0; padding: 0; }

	html, body {
		width: 100%;
		height: 100%;
		background: var(--background);
		color: var(--color);
		font-family: var(--font);
	}

	body {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 32px;
		padding: 0 40px;
	}

	.icon svg {
		display: block;
		width: 56px;
		height: 56px;
		margin-bottom: 16px;
		border-radius: 12px;
	}

	.intro h1 {
		font-size: 30px;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.1;
	}

	.intro p {
		margin-top: 10px;
		max-width: 300px;
		color: var(--muted);
		font-size: 15px;
		line-height: 1.4;
	}

	.card {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 360px;
		height: 170px;
		padding: 16px;
		border-radius: 12px;
		background: var(--card);
		box-shadow: 0 8px 24px rgba( 0, 0, 0, 0.15 );
	}

	.card svg {
		display: block;
		max-width: 100%;
		max-height: 100%;
	}
`;

const bannerHtml = `<!DOCTYPE html>
	<html>
	<head><style>${ style }</style></head>
	<body>
		<div class="intro">
			<div class="icon">${ iconSvg }</div>
			<h1>SolveBeam Diagrams<br>with Mermaid</h1>
			<p>Create flowcharts, sequence diagrams and more in the block editor.</p>
		</div>
		<div class="card"></div>
	</body>
	</html>`;

/**
 * Render the banner to a PNG file.
 *
 * @param {import('@playwright/test').Browser} browser Browser.
 * @param {number}                             scale   Device scale factor.
 * @param {string}                             file    File name.
 * @return {Promise<void>}
 */
async function render( browser, scale, file ) {
	const page = await browser.newPage( {
		viewport: { width: 772, height: 250 },
		deviceScaleFactor: scale,
	} );

	await page.setContent( bannerHtml );

	await page.addScriptTag( {
		path: require.resolve( 'mermaid/dist/mermaid.min.js' ),
	} );

	await page.evaluate( async ( code ) => {
		window.mermaid.initialize( { startOnLoad: false, theme: 'default' } );

		const { svg } = await window.mermaid.render( 'banner-diagram', code );

		document.querySelector( '.card' ).innerHTML = svg;
	}, diagram );

	await page.evaluate( () => document.fonts.ready );
	await page.screenshot( { path: path.join( outputDir, file ) } );
	await page.close();
}

( async () => {
	const browser = await chromium.launch();

	await render( browser, 1, 'banner-772x250.png' );
	await render( browser, 2, 'banner-1544x500.png' );

	await browser.close();
} )();
