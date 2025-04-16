<?php
/*Plugin Name: bs Cookie Settings
Plugin URI: https://bootscore.me/documantation/bs-cookie-settings/
Description: Plugin adds a cookie modal to Bootscore theme.
Version: 5.6.2
Tested up to: 6.6
Requires at least: 5.0
Requires PHP: 7.4
Author: Bootscore
Author URI: https://bootscore.me
License: MIT License
*/


// Exit if accessed directly
defined( 'ABSPATH' ) || exit;


/**
 * Update checker
 */
require 'update/plugin-update-checker.php';
use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

$myUpdateChecker = PucFactory::buildUpdateChecker(
	'https://github.com/bootscore/bs-cookie-settings/',
	__FILE__,
	'bs-cookie-settings'
);

//Set the branch that contains the stable release.
$myUpdateChecker->setBranch('main');


/**
 * Register styles and scripts
 */
function bs_cookie_settings() {
  // File paths
  $script_file = plugin_dir_path(__FILE__) . 'assets/js/cookie-settings.min.js';
  $style_file  = plugin_dir_path(__FILE__) . 'assets/css/cookie-settings.min.css';

  // Timestamps as version numbers
  $script_ver = file_exists($script_file) ? date('YmdHi', filemtime($script_file)) : false;
  $style_ver  = file_exists($style_file) ? date('YmdHi', filemtime($style_file)) : false;

  // Enqueue script
  wp_enqueue_script('cookie-settings-js', plugins_url('/assets/js/cookie-settings.min.js', __FILE__), [], $script_ver, true);

  // Enqueue style
  wp_enqueue_style('cookie-settings-css', plugins_url('/assets/css/cookie-settings.min.css', __FILE__), [], $style_ver);
}

add_action('wp_enqueue_scripts', 'bs_cookie_settings');
