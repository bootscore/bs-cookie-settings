<?php
/*Plugin Name: bs Cookie Settings
Plugin URI: https://bootscore.me/documentation/plugins/bs-cookie-settings/
Description: Plugin adds a cookie modal to Bootscore theme.
Version: 6.0.0
Tested up to: 7.1
Requires at least: 7.0
Requires PHP: 8.1
Author: Bootscore
Author URI: https://bootscore.me
License: MIT License
*/


// Exit if accessed directly
defined( 'ABSPATH' ) || exit;


/**
 * Load required files
 */
require_once plugin_dir_path( __FILE__ ) . 'inc/enqueue.php';
require_once plugin_dir_path(__FILE__) . 'inc/updater-config.php';
