=== SolveBeam Diagrams with Mermaid ===
Contributors: solvebeam
Donate link: https://github.com/sponsors/solvebeam
Tags: solvebeam, mermaid, diagrams, visualization, flowchart
Requires at least: 6.8
Tested up to: 7.1
Requires PHP: 8.3
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A plugin for rendering Mermaid diagrams and visualizations from Mermaid code.

== Description ==

[SolveBeam](https://www.solvebeam.com/) · [GitHub](https://github.com/solvebeam/solvebeam-diagrams-with-mermaid-for-wordpress)

SolveBeam Diagrams with Mermaid adds a block for creating diagrams and visualizations with
[Mermaid](https://mermaid.js.org/). Enter Mermaid syntax in the block editor and
the diagram is rendered in the editor and on the front end.

Mermaid is rendered locally in the browser. This plugin does not require an
external account or service to render diagrams.

== Installation ==

1. Upload the plugin folder to `/wp-content/plugins/`
2. Activate the plugin through the "Plugins" menu in WordPress

== Frequently Asked Questions ==

### How do I add a diagram?

Add the Mermaid block in the WordPress block editor and enter your Mermaid code
in the Mermaid code field. The preview updates in the editor and the diagram is
rendered on the front end.

### Which Mermaid syntax is supported?

The block uses the Mermaid syntax supported by the version bundled with the
plugin. See the [Mermaid documentation](https://mermaid.js.org/intro/) for the
available diagram types and syntax.

### Is my Mermaid code sent to an external service?

No. Mermaid is bundled with the plugin and diagrams are rendered locally in the
browser. The plugin does not send Mermaid code to an external rendering service.

### Does this plugin require a Mermaid account?

No. The plugin does not require an account, API key, or subscription.


== Screenshots ==

== Source Code ==

This plugin ships compiled (minified) JavaScript and CSS in the `blocks/`
folder. The human-readable source code of everything in that folder is
publicly available:

* Plugin source code (block editor and front-end scripts, styles and build
  configuration): [https://github.com/solvebeam/solvebeam-diagrams-with-mermaid-for-wordpress](https://github.com/solvebeam/solvebeam-diagrams-with-mermaid-for-wordpress).
  The same source is also included in this plugin in the `blocks-src/` folder,
  together with `package.json`.
* Mermaid: [https://github.com/mermaid-js/mermaid](https://github.com/mermaid-js/mermaid).

= What is in the blocks/ folder? =

* `blocks/mermaid-diagram/` – compiled from `blocks-src/mermaid-diagram/`
  (`index.js`, `view.js`, `editor.css`, `style.css` and `block.json`),
  including the core of the Mermaid library.
* `blocks/*.js` (numbered files such as `blocks/8726.js`) – chunks that webpack
  splits off from Mermaid and are loaded on demand for the different diagram
  types. These files contain only code from Mermaid and its npm dependencies,
  not from this plugin.

The Mermaid dependencies bundled in these chunks, with their public source code:

* @mermaid-js/parser: [https://github.com/mermaid-js/mermaid/tree/develop/packages/parser](https://github.com/mermaid-js/mermaid/tree/develop/packages/parser)
* @braintree/sanitize-url: [https://github.com/braintree/sanitize-url](https://github.com/braintree/sanitize-url)
* @iconify/utils: [https://github.com/iconify/iconify](https://github.com/iconify/iconify)
* @upsetjs/venn.js: [https://github.com/upsetjs/venn.js](https://github.com/upsetjs/venn.js)
* chevrotain: [https://github.com/Chevrotain/chevrotain](https://github.com/Chevrotain/chevrotain)
* cytoscape: [https://github.com/cytoscape/cytoscape.js](https://github.com/cytoscape/cytoscape.js)
* cytoscape-cose-bilkent: [https://github.com/cytoscape/cytoscape.js-cose-bilkent](https://github.com/cytoscape/cytoscape.js-cose-bilkent)
* cytoscape-fcose: [https://github.com/iVis-at-Bilkent/cytoscape.js-fcose](https://github.com/iVis-at-Bilkent/cytoscape.js-fcose)
* d3: [https://github.com/d3/d3](https://github.com/d3/d3)
* d3-sankey: [https://github.com/d3/d3-sankey](https://github.com/d3/d3-sankey)
* dagre-d3-es: [https://github.com/tbo47/dagre-es](https://github.com/tbo47/dagre-es)
* dayjs: [https://github.com/iamkun/dayjs](https://github.com/iamkun/dayjs)
* dompurify: [https://github.com/cure53/DOMPurify](https://github.com/cure53/DOMPurify)
* elkjs: [https://github.com/kieler/elkjs](https://github.com/kieler/elkjs)
* es-toolkit: [https://github.com/toss/es-toolkit](https://github.com/toss/es-toolkit)
* katex: [https://github.com/KaTeX/KaTeX](https://github.com/KaTeX/KaTeX)
* khroma: [https://github.com/fabiospampinato/khroma](https://github.com/fabiospampinato/khroma)
* marked: [https://github.com/markedjs/marked](https://github.com/markedjs/marked)
* roughjs: [https://github.com/rough-stuff/rough](https://github.com/rough-stuff/rough)
* stylis: [https://github.com/thysultan/stylis](https://github.com/thysultan/stylis)
* ts-dedent: [https://github.com/tamino-martinius/node-ts-dedent](https://github.com/tamino-martinius/node-ts-dedent)
* uuid: [https://github.com/uuidjs/uuid](https://github.com/uuidjs/uuid)

= Building from source =

The compiled files are built with [@wordpress/scripts](https://www.npmjs.com/package/@wordpress/scripts)
(webpack). Node.js and npm are required.

1. Clone the repository or use the plugin folder:
   `git clone https://github.com/solvebeam/solvebeam-diagrams-with-mermaid-for-wordpress.git`
2. Install the dependencies (including Mermaid from npm): `npm install`
3. Build the production files: `npm run build`

This compiles `blocks-src/` into `blocks/`. Use `npm run start` to build in
development mode and watch for changes; development builds are not minified.

== Third-Party Licenses ==

This plugin bundles [Mermaid](https://github.com/mermaid-js/mermaid), which is
available under the MIT License. The Mermaid license is available at
[https://github.com/mermaid-js/mermaid/blob/develop/LICENSE](https://github.com/mermaid-js/mermaid/blob/develop/LICENSE).
The dependencies of Mermaid listed above are available under their own open
source licenses, which can be found in their repositories.

== Changelog ==

= 1.0.0 =
* Initial release.
