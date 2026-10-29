<?php

/**
 * Enqueue styles & scripts
 *
 * @author   Bootscore
 * @package  bs Cookie Settings
 * @version  6.0.0
 */


// Exit if accessed directly
defined('ABSPATH') || exit;


/**
 * Register styles and scripts
 */
function bs_cookie_settings() {

  // Plugin base path & URL
  $plugin_path = plugin_dir_path( dirname( __FILE__ ) );
  $plugin_url  = plugin_dir_url( dirname( __FILE__ ) );

  // File paths
  $script_file = $plugin_path . 'assets/js/cookie-settings.min.js';
  $style_file  = $plugin_path . 'assets/css/cookie-settings.min.css';

  // Versions based on file modification time
  $script_ver = file_exists( $script_file ) ? date( 'YmdHi', filemtime( $script_file ) ) : false;
  $style_ver  = file_exists( $style_file ) ? date( 'YmdHi', filemtime( $style_file ) ) : false;

  // Enqueue script
  // Depends on bootscore-script: the plugin uses window.bootstrap.Dialog
  wp_enqueue_script(
    'cookie-settings-js',
    $plugin_url . 'assets/js/cookie-settings.min.js',
    ['bootscore-script'],
    $script_ver,
    true
  );

  // Enqueue style
  // Depends on bootscore-main: the plugin CSS is in @layer components, so it must
  // load after Bootstrap. Loaded first, it would define the layer order and break
  // Bootstrap's components. Custom CSS (unlayered) overrides it without !important.
  wp_enqueue_style(
    'cookie-settings-css',
    $plugin_url . 'assets/css/cookie-settings.min.css',
    ['bootscore-main'],
    $style_ver
  );
}

add_action( 'wp_enqueue_scripts', 'bs_cookie_settings' );
