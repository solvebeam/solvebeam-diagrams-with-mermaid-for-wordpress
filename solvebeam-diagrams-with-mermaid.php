<?php
/**
 * SolveBeam Diagrams with Mermaid
 *
 * @author    SolveBeam
 * @copyright 2026 SolveBeam
 * @license   GPL-2.0-or-later
 * @package   SolveBeam\WordPressMermaid
 *
 * @wordpress-plugin
 * Plugin Name:       SolveBeam Diagrams with Mermaid
 * Plugin URI:        https://www.solvebeam.com/wordpress/plugins/solvebeam-diagrams-with-mermaid/
 * Description:       A plugin for rendering Mermaid diagrams and visualizations from Mermaid code.
 * Version:           1.0.0
 * Requires at least: 6.8
 * Requires PHP:      8.3
 * Author:            SolveBeam
 * Author URI:        https://www.solvebeam.com/
 * Text Domain:       solvebeam-diagrams-with-mermaid
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * GitHub URI:        https://github.com/solvebeam/solvebeam-mermaid-for-wordpress
 */

declare(strict_types=1);

namespace SolveBeam\WordPressMermaid;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

( static function (): void {
	$autoload_path = __DIR__ . '/vendor/autoload_packages.php';

	if ( \file_exists( $autoload_path ) ) {
		require_once $autoload_path;
	}

	Plugin::instance();
} )();
