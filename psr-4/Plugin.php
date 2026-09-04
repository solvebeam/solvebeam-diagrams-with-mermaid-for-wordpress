<?php
/**
 * Plugin
 *
 * @author    SolveBeam
 * @copyright 2026 SolveBeam
 * @license   GPL-2.0-or-later
 * @package   SolveBeam\WordPressMermaid
 */

declare(strict_types=1);

namespace SolveBeam\WordPressMermaid;

/**
 * Plugin class
 */
final class Plugin {
	/**
	 * Instance.
	 *
	 * @var self
	 */
	protected static $instance = null;

	/**
	 * Return instance of this class.
	 *
	 * @param string $plugin_file The plugin file.
	 * @return self A single instance of this class.
	 */
	public static function instance( string $plugin_file ) {
		if ( null === self::$instance ) {
			self::$instance = new self( $plugin_file );
		}

		return self::$instance;
	}

	/**
	 * Construct.
	 *
	 * @param string $plugin_file The plugin file.
	 */
	private function __construct(
		/**
		 * Plugin file.
		 */
		private readonly string $plugin_file
	) {
		\add_action( 'plugins_loaded', $this->plugins_loaded( ... ) );
		\add_action( 'init', $this->register_blocks( ... ) );
	}

	/**
	 * Register the Mermaid block.
	 *
	 * @return void
	 */
	public function register_blocks(): void {
		$block_path = \dirname( $this->plugin_file ) . '/blocks/mermaid';

		if ( \file_exists( $block_path . '/block.json' ) ) {
			\register_block_type( $block_path );
		}
	}

	/**
	 * Plugins loaded.
	 *
	 * @return void
	 */
	public function plugins_loaded() {
		\add_filter( 'plugin_action_links_' . \plugin_basename( $this->plugin_file ), $this->add_plugin_action_links( ... ) );
	}

	/**
	 * Add plugin action links.
	 *
	 * @param array<string> $links The existing links.
	 * @return array<string> The modified links.
	 */
	public function add_plugin_action_links( array $links ): array {
		$settings_link = \sprintf(
			'<a href="%s">%s</a>',
			\esc_url( '#' ),
			\esc_html__( 'Settings', 'solvebeam-mermaid' )
		);

		\array_unshift( $links, $settings_link );

		return $links;
	}
}
