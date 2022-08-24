
=== bS Cookie Settings ===

Contributors: Bastian Kreiter

Requires at least: 4.5
Tested up to: 6.0.1
Requires PHP: 5.6
Stable tag: 5.2.1.0
License: MIT License
License URI: https://github.com/bootscore/bs-cookie-settings/blob/main/LICENSE

This plugin adds a GDPR-ready cookie consent to bootScore theme, Copyright 2022 The bootScore Contributors.


== Credits ==

    - cookieconsent https://github.com/orestbida/cookieconsent/blob/master/LICENSE, Copyright 2020, Orest Bida.


== Installation ==

1. In your admin panel, go to Plugins > and click the Add New button.
2. Click Upload Plugin and Choose File, then select the Plugin's .zip file. Click Install Now.
3. Click Activate to use your new Plugin right away.


== Usage ==

Read documentation https://bootscore.me/documentation/plugin/bs-cookie-settings/

== Changelog ==

  = 5.2.1.0 - August 24 2022 =

    * Refactored modal
    * Removed plugin's backdrop and uses Bootstrap modal backdrop instead
    * Settings link triggers now modal instead modal-dialog
    * Changed settings link to data-bs-toggle="modal" [Breaking]
    * Hide banner if modal is open
    * Changed id's
    * Updated to FA6 Chevron

  = 5.2.0.0 - August 20 2022 =

    * Added missing modal class

  = 5.1.3.2 - June 03 2022 =

    * Fix modal backdrop in Chrome/Edge. Used rgba instead of opacity.
    * Switched to FA5 icons

  = 5.0.0.0 - January 03 2022 =
    
    * Initial release
