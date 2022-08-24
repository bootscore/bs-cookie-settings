<?php
/*Plugin Name: bS Cookie Settings
Plugin URI: https://bootscore.me/plugins/bs-cookie-settings/
Description: This plugin adds a cookie modal to bootScore
Version: 5.2.1.0
Author: bootScore
Author URI: https://bootscore.me
License: MIT License
*/


// Register Styles and Scripts
function bs_cookie_settings() {
    
  wp_enqueue_script( 'cookie-settings-js', plugins_url( '/js/cookie-settings.min.js' , __FILE__ ), array(), false, true );
    
  wp_register_style( 'cookie-settings-css', plugins_url('/css/cookie-settings.min.css', __FILE__) );
  wp_enqueue_style( 'cookie-settings-css' );
    
}

add_action('wp_enqueue_scripts','bs_cookie_settings');