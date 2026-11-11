<?php
/**
 * Registers this plugin with the Bootscore updater
 *
 * @author  Bootscore
 * @package bs Cookie Settings
 * @version 1.0.0
 */


// Exit if accessed directly
defined('ABSPATH') || exit;


/**
 * Register plugin with Bootscore updater
 */
add_action('init', function() {
  global $bootscore_updater;

  // Ensure the class is loaded
  if (!class_exists('Bootscore_Update_Checker')) {
    $theme_path = get_template_directory() . '/inc/updater/class-update-checker.php';
    if (file_exists($theme_path)) {
      require_once $theme_path;
    }
  }

  // Initialize if needed
  if (!isset($bootscore_updater) && class_exists('Bootscore_Update_Checker')) {
    $bootscore_updater = new Bootscore_Update_Checker(12 * HOUR_IN_SECONDS);
  }

  if (!isset($bootscore_updater) || !class_exists('Bootscore_Update_Checker')) {
    return;
  }

  $plugin_file = dirname(__DIR__) . '/main.php';

  if (!file_exists($plugin_file)) {
    return;
  }

  $plugin_data = get_file_data(
    $plugin_file,
    array('Version' => 'Version')
  );

  $bootscore_updater->register_product(array(
    'type' => 'plugin',
    'slug' => 'bs-cookie-settings',
    'current_version' => $plugin_data['Version'] ?? '1.0',
    'file' => plugin_basename($plugin_file),
    'source' => 'github',
    'github_repo' => 'bootscore/bs-cookie-settings',
    'name' => 'bs Cookie Settings',
  ));
});
