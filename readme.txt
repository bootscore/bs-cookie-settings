=== bs Cookie Settings ===

Contributors: The Bootscore contributors, Bastian Kreiter, Osdeibi Acurero

Stable tag: 5.6.2
Tested up to: 6.6
Requires at least: 5.0
Requires PHP: 7.4
Requires at least: 4.5
License: MIT License
License URI: https://github.com/bootscore/bs-cookie-settings/blob/main/LICENSE

Plugin adds a GDPR-ready cookie consent to Bootscore theme, Copyright 2022 - 2024 The Bootscore Contributors.


== Credits ==

- cookieconsent https://github.com/orestbida/cookieconsent/blob/master/LICENSE, Copyright 2020, Orest Bida.


== Installation ==

1. In your admin panel, go to Plugins > and click the Add New button.
2. Click Upload Plugin and Choose File, then select the Plugin's .zip file. Click Install Now.
3. Click Activate to use your new Plugin right away.


== Usage ==

Read documentation https://bootscore.me/documentation/plugin/bs-cookie-settings/

== Changelog ==

= 5.6.2 - August 31 2024 =

#### Improvements

* Added icon.svg
* Updated meta
* Tested up to WP 6.6

= 5.6.1 - June 06 2024 =

#### Improvements

* Added Spanish instructions
* Created `translations` folder and moved Spanish translation to espanol.md

#### Update

* Update checker 5.4

= 5.6.0 - February 12 2024 =

#### Feature

* Added optional footer to consent banner to add important links like privacy policy, terms, imprint etc. Footer can be activated in init js.

#### Improvement

* Moved css and js to assets folder
* Refactored collapse icon
* Switch to scss source
* Hide Banner if modal/offcanvas is open

= 5.5.0 - January 15 2024 =

#### Feature

* Added additional settings button to cookie bar. Button can be activated in init js
* Added data-bs-backdrop="static" attribute to the modal to avoid closing it when clicking on the backdrop and forcing the user to make a decision

#### Improvement

* Removed -main branch suffix from plugin's folder. This does not affect existing bs-cookie-settings-main installations
* Removed btn-close focus on modal show
* Changed all btn-outline-primary to btn primary according to the GDPR law
* Changed col-xxl-3 to col-lg-3 in banner to fit the sidebar width

#### Update

* Update checker 5.3

= 5.4.0 - December 15 2023 =

#### Improvement

* Deny direct access

#### Update

* Update checker v5

= 5.3.0 - June 09 2023 =

#### Feature

* Added composer.json
* Added plugin update checker

#### Improvement

* Change btn-outline-secondary to btn-outline-primary

#### Update

* Bootstrap 5.3 color classes

= 5.2.1.0 - August 24 2022 =

#### Feature

* Refactored modal
* Removed plugin's backdrop and uses Bootstrap modal backdrop instead

#### Improvement

* Settings link triggers now modal instead modal-dialog
* Changed settings link to data-bs-toggle="modal" [Breaking]
* Hide banner if modal is open
* Changed id's
* Updated to FA6 Chevron

= 5.2.0.0 - August 20 2022 =

#### Bugfix

* Added missing modal class

= 5.1.3.2 - June 03 2022 =

#### Bugfix

* Fix modal backdrop in Chrome/Edge. Used rgba instead of opacity.

#### Improvement

* Switched to FA5 icons

= 5.0.0.0 - January 03 2022 =

* Initial release
