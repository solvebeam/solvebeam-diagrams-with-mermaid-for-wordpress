import mermaid from 'mermaid';

mermaid.initialize( {
	startOnLoad: false,
	securityLevel: 'strict',
	theme: 'default',
} );

const renderDiagrams = async () => {
	const blocks = document.querySelectorAll(
		'.wp-block-solvebeam-diagrams-with-mermaid-mermaid-diagram'
	);

	for ( const block of blocks ) {
		const source = block.querySelector( '.solvebeam-mermaid-source' );
		const output = block.querySelector( '.solvebeam-mermaid-output' );

		if ( ! source || ! output ) {
			continue;
		}

		try {
			const { svg } = await mermaid.render(
				`solvebeam-mermaid-${ Math.random()
					.toString( 36 )
					.slice( 2 ) }`,
				source.textContent
			);
			output.innerHTML = svg;
			source.hidden = true;
		} catch ( error ) {
			output.textContent =
				error.message || 'Unable to render this diagram.';
			output.classList.add( 'solvebeam-mermaid-error' );
		}
	}
};

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', renderDiagrams, {
		once: true,
	} );
} else {
	renderDiagrams();
}
