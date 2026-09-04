# SolveBeam WordPress Plugin Boilerplate

A modern WordPress plugin boilerplate by SolveBeam, providing a structured foundation for building scalable and maintainable plugins.

## Requirements

- PHP 8.2+
- WordPress 6.7+
- Composer
- Node.js / npm

## Installation

```sh
composer install
npm install
```

## Development

### Local environment (wp-env)

```sh
npx wp-env start
npx wp-env stop
```

The `.wp-env.json` maps the plugin twice into the WordPress environment:

| Mount path | Source | Purpose |
|---|---|---|
| `wp-content/plugins/solvebeam-boilerplate-dev` | `./` | Live development (including dev files) |
| `wp-content/plugins/solvebeam-boilerplate` | `./build/stage-2/` | Built distribution version |

This lets you test both the raw source and the production build side-by-side.

### Build

```sh
composer run build
```

The build uses a **two-stage rsync** process:

1. **Stage 1** — copies source (respecting `.distignore`), then runs `composer install --no-dev` to get production-only dependencies.
2. **Stage 2** — copies stage 1 output (again respecting `.distignore`) to strip any remaining dev artifacts, then generates `.pot` / `.mo` translation files and creates a dist archive via `wp dist-archive`.

The final distributable ZIP is created from `build/stage-2/`.

### Translations

Use the existing i18n scripts to keep translation files in sync:

```sh
composer run make-pot
```

After updating the POT/PO files, AI can be useful for filling untranslated strings in a locale file, for example:

```text
Can you translate the untranslated texts in languages/solvebeam-boilerplate-nl_NL.po?
```

### Linting & analysis

```sh
composer run phpcs
composer run rector
```

Optional development tools that may be useful, but are not included by default in this boilerplate for now:

#### Psalm

[Psalm](https://github.com/vimeo/psalm/) can be used for static analysis. See the [Psalm documentation](https://psalm.dev/) for setup and usage.

#### Slevomat Coding Standard

[Slevomat Coding Standard](https://github.com/slevomat/coding-standard) can be used for additional PHPCS sniffs.

## Architecture & Conventions

This boilerplate follows the [SolveBeam Plugin Development Guidelines](https://github.com/solvebeam). Key conventions that may not be immediately obvious:

### Why `psr-4/` instead of `src/`

WordPress plugins typically contain PHP, JavaScript, CSS, and other assets. Using `src/` for only PHP files creates ambiguity about where non-PHP source files belong. The `psr-4/` directory makes the PSR-4 autoload root explicit and prevents accidental mixing of PHP and non-PHP sources.

### Strict typing in every file

Every PHP file must start with `declare(strict_types=1);` — no exceptions.

### Flat namespace architecture

All classes live directly under a single namespace (e.g. `SolveBeam\WordPressPluginBoilerplate`). No sub-namespaces, no deep folder structure. Everything goes into `psr-4/` directly.

### Minimal visibility surface

- Classes → `final` wherever possible
- Properties → `private readonly` wherever possible
- Methods → `private` wherever possible
- Only expose what *must* be public

### Singleton pattern for Plugin.php

`psr-4/Plugin.php` must be `final`, use a private constructor, and expose a single `public static function instance(): self` entry point. Hooks are registered internally from the constructor.

### Fully qualified function calls

Always call WordPress and built-in PHP functions with a fully qualified name (FQN), using a leading backslash. In namespaced code, this avoids namespace resolution and makes it clear that the global function is being called.

```php
\add_action( 'init', $this->init( ... ) );
\sprintf( 'Plugin: %s', $name );
```

### First-class callable syntax for hooks

Always use PHP 8.1+ first-class callable syntax for hook callbacks:

```php
// ✅ Correct
\add_action( 'init', $this->init( ... ) );

// ❌ Never use array syntax
\add_action( 'init', [ $this, 'init' ] );
```

### Comments

No redundant or obvious comments. Only add comments where the logic isn't self-evident.

### Distribution cleanliness

The `.distignore` file ensures development-only files (config files, build tooling, node_modules, etc.) are excluded from the production ZIP. A `.gitattributes` with `export-ignore` rules should be used to keep GitHub-generated ZIP archives clean as well.

## Directory Structure

```
solvebeam-boilerplate/
├── solvebeam-boilerplate.php   # Main plugin file (bootstrap)
├── composer.json
├── package.json
├── .wp-env.json
├── .editorconfig
├── .gitattributes
├── .distignore
├── README.md
├── CHANGELOG.md
├── phpcs.xml.dist
├── rector.php
├── psr-4/
│   └── Plugin.php              # Singleton entry point
├── languages/
├── assets/
│   ├── js/
│   └── css/
└── vendor/
```

## License

GPL-2.0-or-later
