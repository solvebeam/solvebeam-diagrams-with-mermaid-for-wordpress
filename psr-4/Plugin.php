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
	 * @return self A single instance of this class.
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Construct.
	 */
	private function __construct() {
		\add_action( 'init', $this->register_blocks( ... ) );
	}

	/**
	 * Register the Mermaid block.
	 *
	 * @throws \RuntimeException When the block assets cannot be found.
	 *
	 * @return void
	 */
	public function register_blocks(): void {
		\register_block_type( __DIR__ . '/../blocks/mermaid-diagram' );
	}
}
