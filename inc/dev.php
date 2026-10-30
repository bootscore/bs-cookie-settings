<?php
/**
 * Compile swiper asstes to theme
 * Requires modified ts and scss compiler
 * https://github.com/crftwrk/compile-plugin-assets-to-bootscore
 *
 * @author  Bootscore
 * @package bs Cookie Settings
 * @version 6.0.0
 */


// Exit if accessed directly
defined('ABSPATH') || exit;

add_filter('bootscore/compiler/plugin_sources', function ($sources) {
  $sources['bs-swiper'] = [
    'dir'           => plugin_dir_path(__FILE__),
    'url'           => plugin_dir_url(__FILE__),
    'version'       => '1.0.0',          // use your plugin's version constant
    'scss'          => '../assets/scss/cookie-settings',
    'ts'            => '../assets/ts/cookie-settings.ts',
    'style_handle'  => 'bs-cookie-settings-style',      // handle used in wp_enqueue_style()
    'script_handle' => 'bs-cookie-settings-script',     // handle used in wp_enqueue_script()
  ];
  return $sources;
});
