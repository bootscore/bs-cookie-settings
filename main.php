<?php
/*Plugin Name: bS Cookie Orestbida
Plugin URI: https://bootscore.me/plugins/bs-eu-cookie-modal/
Description: This plugin adds a cookie modal to bootScore
Version: 5.0.0.0
Author: bootScore
Author URI: https://bootscore.me
License: MIT License
*/


/*
// Register Styles and Scripts
function bs_cookie_orestbida() {


  //wp_register_script( 'eu-cookie-js', plugins_url( '/js/cookieconsent.js' , __FILE__ ) );
  //wp_enqueue_script( 'bootstrap-cookie-consent-settings', plugins_url( '/js/bootstrap-cookie-consent-settings.js' , __FILE__ ), array( 'jquery' ), '1.0', true );
  //wp_enqueue_script( 'ajax-products', plugins_url( '/js/bootstrap-cookie-consent-settings.js', __FILE__ ), array('jquery'), '1.2', false );
  

  
  
      wp_register_style( 'cookieconsent-css', plugins_url('/css/cookieconsent.css', __FILE__) );
        wp_enqueue_style( 'cookieconsent-css' );
        
        }

    wp_enqueue_script( 'cookieconsent-js', plugins_url( '/js/cookieconsent.js' , __FILE__ ), array(), '1.0', false );
    //wp_enqueue_script( 'cookieconsent-init-js', plugins_url( '/js/cookieconsent-init.js' , __FILE__ ), array(), '1.0', false );

        
    
    
add_action('wp_enqueue_scripts','bs_cookie_orestbida');
*/




// Register Styles and Scripts
function bs_cookie_orestbida() {
    
    wp_enqueue_script( 'cookieconsent-js', plugins_url( '/js/cookieconsent.js' , __FILE__ ), array(), false, true );
    
    //wp_enqueue_script( 'cookieconsent-js', plugins_url( '/js/cookieconsent-init-js' , __FILE__ ), array(), false, true );
    
    wp_register_style( 'cookieconsent-css', plugins_url('/css/cookieconsent.css', __FILE__) );
    wp_enqueue_style( 'cookieconsent-css' );
    
    
    }

add_action('wp_enqueue_scripts','bs_cookie_orestbida');