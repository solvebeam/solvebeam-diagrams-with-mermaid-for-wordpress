import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextareaControl } from '@wordpress/components';
import { registerBlockType } from '@wordpress/blocks';
import mermaid from 'mermaid';
import metadata from './block.json';
import './editor.css';

mermaid.initialize( {
	startOnLoad: false,
	securityLevel: 'strict',
	theme: 'default',
} );

const DEFAULT_CODE = metadata.attributes.code.default;

function MermaidPreview( { code } ) {
	const previewRef = useRef();
	const [ error, setError ] = useState( '' );

	useEffect( () => {
		let active = true;
		const renderPreview = async () => {
			if ( ! previewRef.current ) {
				return;
			}

			if ( ! code.trim() ) {
				previewRef.current.replaceChildren();
				setError( '' );
				return;
			}

			try {
				const { svg } = await mermaid.render(
					`solvebeam-mermaid-preview-${ Date.now() }`,
					code
				);
				if ( active ) {
					previewRef.current.innerHTML = svg;
					setError( '' );
				}
			} catch ( renderError ) {
				if ( active ) {
					previewRef.current.replaceChildren();
					setError(
						renderError.message ||
							__(
								'Unable to render this diagram.',
								'solvebeam-mermaid'
							)
					);
				}
			}
		};

		renderPreview();

		return () => {
			active = false;
		};
	}, [ code ] );

	return (
		<div className="solvebeam-mermaid-preview-wrap">
			<div className="solvebeam-mermaid-preview" ref={ previewRef } />
			{ error && <p className="solvebeam-mermaid-error">{ error }</p> }
		</div>
	);
}

function Edit( { attributes, setAttributes } ) {
	const code = attributes.code || DEFAULT_CODE;
	const blockProps = useBlockProps( { className: 'solvebeam-mermaid' } );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Mermaid', 'solvebeam-mermaid' ) }
				>
					<TextareaControl
						label={ __( 'Mermaid code', 'solvebeam-mermaid' ) }
						value={ code }
						onChange={ ( value ) =>
							setAttributes( { code: value } )
						}
						rows={ 14 }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<TextareaControl
					label={ __( 'Mermaid code', 'solvebeam-mermaid' ) }
					value={ code }
					onChange={ ( value ) => setAttributes( { code: value } ) }
					rows={ 8 }
				/>
				<MermaidPreview code={ code } />
			</div>
		</>
	);
}

registerBlockType( metadata.name, {
	...metadata,
	edit: Edit,
	save: ( { attributes } ) => {
		const blockProps = useBlockProps.save( {
			className: 'solvebeam-mermaid',
		} );

		return (
			<div { ...blockProps }>
				<div
					className="solvebeam-mermaid-output"
					aria-label={ __( 'Mermaid diagram', 'solvebeam-mermaid' ) }
				/>
				<pre className="solvebeam-mermaid-source">
					{ attributes.code || DEFAULT_CODE }
				</pre>
			</div>
		);
	},
} );
