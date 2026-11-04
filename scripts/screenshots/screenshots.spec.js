/**
 * Screenshots for wordpress.org, the README and marketing.
 *
 * The numbers match the `== Screenshots ==` section in `readme.txt`. The raw
 * screenshots go to `build/screenshots`, `frame.js` frames them into
 * `.wordpress-org`.
 */
const fs = require( 'fs' );
const path = require( 'path' );
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

const root = path.join( __dirname, '../..' );

const blockName = 'solvebeam-diagrams-with-mermaid/mermaid-diagram';

const screenshotPath = ( number ) =>
	path.join( root, 'build/screenshots', `screenshot-${ number }.png` );

const readContent = ( file ) =>
	fs.readFileSync( path.join( __dirname, 'content', file ), 'utf8' );

/**
 * Open the editor in fullscreen mode.
 *
 * @param {Object}      fixtures        Test fixtures.
 * @param {Object}      fixtures.admin  Admin utils.
 * @param {Object}      fixtures.editor Editor utils.
 * @param {Object}      fixtures.page   Page.
 * @param {number|null} postId          Post ID, `null` for a new post.
 * @param {Object}      corePreferences Editor preferences, e.g. `fixedToolbar`.
 * @return {Promise<void>}
 */
async function openEditor(
	{ admin, editor, page },
	postId,
	corePreferences = {}
) {
	if ( null === postId ) {
		// A new post, not a page, to skip the starter patterns modal.
		await admin.createNewPost( { fullscreenMode: true } );
	} else {
		await admin.editPost( postId );
		await editor.setPreferences( 'core/edit-post', {
			fullscreenMode: true,
		} );
	}

	await editor.setPreferences( 'core', {
		fixedToolbar: false,
		...corePreferences,
	} );

	// WordPress 7.1 keeps the admin bar visible in fullscreen mode.
	await page.addStyleTag( {
		content: `
			#wpadminbar { display: none !important; }
			html.wp-toolbar { padding-top: 0 !important; }
			.interface-interface-skeleton { top: 0 !important; }
		`,
	} );
}

/**
 * Wait until all diagrams are rendered, then give fonts a moment to settle.
 *
 * Mermaid renders the diagrams in the browser, so the SVG is not in the
 * HTML that WordPress returns.
 *
 * @param {import('@playwright/test').Page}         page     Page.
 * @param {import('@playwright/test').Locator|null} diagrams Rendered diagrams.
 * @param {number}                                  count    Number of diagrams.
 * @return {Promise<void>}
 */
async function settle( page, diagrams = null, count = 1 ) {
	if ( null !== diagrams ) {
		await expect( diagrams ).toHaveCount( count );
	}

	await page.evaluate( () => document.fonts.ready );
	await page.waitForTimeout( 1000 );
}

test.describe( 'Screenshots', () => {
	const pages = {};

	// Other Mermaid plugins, such as MerPress in `.wp-env.json`, add blocks to the inserter.
	let otherMermaidPlugins = [];

	test.beforeAll( async ( { requestUtils } ) => {
		// `wp-env` maps the plugin source, but does not activate it.
		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/plugins/solvebeam-diagrams-with-mermaid-dev/solvebeam-diagrams-with-mermaid',
			data: { status: 'active' },
		} );

		const plugins = await requestUtils.rest( {
			path: '/wp/v2/plugins',
			params: { status: 'active' },
		} );

		otherMermaidPlugins = plugins
			.filter(
				( plugin ) =>
					/mermaid|merpress/i.test( plugin.plugin ) &&
					! plugin.plugin.startsWith( 'solvebeam-' )
			)
			.map( ( plugin ) => plugin.plugin.replace( /\.php$/, '' ) );

		for ( const plugin of otherMermaidPlugins ) {
			await requestUtils.rest( {
				method: 'POST',
				path: `/wp/v2/plugins/${ plugin }`,
				data: { status: 'inactive' },
			} );
		}

		// Screenshots in English, `.wp-env.json` sets the site to Dutch.
		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/users/me',
			data: { locale: 'en_US' },
		} );

		const create = ( title, content ) =>
			requestUtils.createPage( { title, content, status: 'publish' } );

		pages.flowchart = await create(
			'Editorial workflow',
			readContent( 'flowchart.html' )
		);
		pages.diagramTypes = await create(
			'Diagram types',
			readContent( 'diagram-types.html' )
		);
	} );

	test.afterAll( async ( { requestUtils } ) => {
		for ( const page of Object.values( pages ) ) {
			await requestUtils.rest( {
				method: 'DELETE',
				path: `/wp/v2/pages/${ page.id }`,
				params: { force: true },
			} );
		}

		// Back to the site language.
		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/users/me',
			data: { locale: '' },
		} );

		for ( const plugin of otherMermaidPlugins ) {
			await requestUtils.rest( {
				method: 'POST',
				path: `/wp/v2/plugins/${ plugin }`,
				data: { status: 'active' },
			} );
		}
	} );

	test( '1. Mermaid block with live preview in the editor', async ( {
		admin,
		editor,
		page,
	} ) => {
		await openEditor( { admin, editor, page }, pages.flowchart.id );

		await settle(
			page,
			editor.canvas.locator( '.solvebeam-mermaid-preview > svg' )
		);

		await page.screenshot( { path: screenshotPath( 1 ) } );
	} );

	test( '2. Mermaid block in the block inserter', async ( {
		admin,
		editor,
		page,
	} ) => {
		await openEditor( { admin, editor, page }, null );

		await page
			.getByRole( 'region', { name: 'Editor top bar' } )
			.getByRole( 'button', { name: 'Block Inserter', exact: true } )
			.click();

		const inserter = page.getByRole( 'region', { name: 'Block Library' } );

		await inserter.getByRole( 'searchbox' ).fill( 'Mermaid' );

		await expect(
			inserter.getByRole( 'option', { name: /(^|\s)Mermaid$/ } )
		).toBeVisible();

		await settle( page );

		/*
		 * Crop to the search results, without the "Available to install"
		 * suggestions of the block directory.
		 */
		const panel = await inserter.boundingBox();
		const results = await inserter
			.getByRole( 'listbox', { name: 'Blocks' } )
			.boundingBox();

		await page.screenshot( {
			path: screenshotPath( 2 ),
			clip: {
				x: 0,
				y: panel.y,
				width: panel.x + panel.width,
				height: results.y + results.height + 16 - panel.y,
			},
		} );
	} );

	test( '3. Mermaid code in the block settings sidebar', async ( {
		admin,
		editor,
		page,
	} ) => {
		await openEditor( { admin, editor, page }, pages.flowchart.id, {
			fixedToolbar: true,
		} );

		await editor.canvas
			.getByRole( 'document', { name: 'Block: Mermaid' } )
			.click();

		await editor.openDocumentSettingsSidebar();

		await expect(
			page
				.getByRole( 'region', { name: 'Editor settings' } )
				.getByLabel( 'Mermaid code' )
		).toBeVisible();

		await settle(
			page,
			editor.canvas.locator( '.solvebeam-mermaid-preview > svg' )
		);

		await page.screenshot( { path: screenshotPath( 3 ) } );
	} );

	test( '4. Error message for invalid Mermaid code', async ( {
		admin,
		editor,
		page,
	} ) => {
		await openEditor( { admin, editor, page }, null );

		await editor.insertBlock( {
			name: blockName,
			attributes: {
				code: 'flowchart TD\n    A[Start] --> B{Ready?\n    B -->|Yes| C[Build it]',
			},
		} );

		await expect(
			editor.canvas.locator( '.solvebeam-mermaid-error' )
		).toBeVisible();

		await settle( page );

		await page.screenshot( { path: screenshotPath( 4 ) } );
	} );

	test.describe( 'Frontend', () => {
		// Logged out, so without the admin bar.
		test.use( { storageState: { cookies: [], origins: [] } } );

		test( '5. Mermaid diagram on the frontend', async ( { page } ) => {
			await page.goto( pages.flowchart.link );

			await settle(
				page,
				page.locator( '.solvebeam-mermaid-output > svg' )
			);

			await page
				.locator( 'main' )
				.screenshot( { path: screenshotPath( 5 ) } );
		} );

		test.describe( 'Narrow', () => {
			test.use( { viewport: { width: 800, height: 600 } } );

			test( '6. Sequence diagram, pie chart, Gantt chart and mindmap', async ( {
				page,
			} ) => {
				await page.goto( pages.diagramTypes.link );

				await settle(
					page,
					page.locator( '.solvebeam-mermaid-output > svg' ),
					4
				);

				await page
					.locator( '.wp-block-post-content' )
					.screenshot( { path: screenshotPath( 6 ) } );
			} );
		} );
	} );
} );
