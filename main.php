<?php
/*Plugin Name: bs Cookie Settings (Modified)
Plugin URI: https://bootscore.me/documantation/bs-cookie-settings/
Description: Plugin adds a cookie modal to Bootscore theme.
Version: 1.0.0
Tested up to: 6.9
Requires at least: 5.0
Requires PHP: 7.4
Author: Bootscore
Author URI: https://bootscore.me
License: MIT License
*/


// Exit if accessed directly
defined( 'ABSPATH' ) || exit;


/**
 * Load required files
 */
require_once plugin_dir_path( __FILE__ ) . 'inc/enqueue.php'; // Scripts & styles
