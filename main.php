<?php
/*Plugin Name: bs Cookie Settings
Plugin URI: https://bootscore.me/plugins/bs-cookie-settings/
Description: Plugin adds a cookie modal to Bootscore theme. <a href="https://bootscore.me/documentation/plugin/bs-cookie-settings/">Documentation</a> | <a href="https://bootscore.me/documentation/plugin/bs-cookie-settings/#Changelog">Changelog</a>
Version: 5.5.0
Tested up to: 6.4.2
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
    
  wp_enqueue_script( 'cookie-settings-js', plugins_url( '/assets/js/cookie-settings.min.js' , __FILE__ ), array(), false, true );
    
  wp_register_style( 'cookie-settings-css', plugins_url('/assets/css/cookie-settings.min.css', __FILE__) );
  wp_enqueue_style( 'cookie-settings-css' );
    
}

add_action('wp_enqueue_scripts','bs_cookie_settings');
