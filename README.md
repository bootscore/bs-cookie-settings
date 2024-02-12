# bs Cookie Settings

[![Packagist Prerelease](https://img.shields.io/packagist/vpre/bootscore/bs-cookie-settings?logo=packagist&logoColor=fff)](https://packagist.org/packages/bootscore/bs-cookie-settings)
[![Github All Releases](https://img.shields.io/github/downloads/bootscore/bs-cookie-settings/total.svg)](https://github.com/bootscore/bs-cookie-settings/releases)

WordPress plugin to add a GDPR-ready cookie consent to Bootscore theme. Based on the [cookieconsent](https://orestbida.com/demo-projects/cookieconsent/) script by [Orest Bida](https://github.com/orestbida/cookieconsent).

<img src="https://lh3.googleusercontent.com/pw/AM-JKLVzgrDgCd68uGMaxBPYAMYB4wg6cg7orzuNU5sr41XOkGFuxueA9eEgkHRCp1HfoxTghl5giVRdnewa8-Lx7GmDyNeastxvBKpvjRNQ0saP5vspSRGCRP7N0-pLkyJqtcltBR32ZsbWfZjCBvOzvRjIHA=w1200-h954-no" alt="bs Cookie Settings">


## Installation

1. Download latest release [bs-cookie-settings.zip](https://github.com/bootscore/bs-cookie-settings/releases/latest/download/bs-cookie-settings.zip).
2. In your admin panel, go to Plugins > and click the Add New button.
3. Click Upload Plugin and Choose File, then select the Plugin's .zip file. Click Install Now.
4. Click Activate to use your new Plugin right away.

## Usage

### Init

Initialize plugin with inline script in a **Custom HTML** widget in **Footer Info** widget position and replace your data.

```html
<script>
  // Init
  window.addEventListener('load', function () {

    // obtain plugin
    var cc = initCookieConsent();

    // run plugin with your configuration
    cc.run({
      current_lang: 'en',
      autoclear_cookies: true,
      page_scripts: true,

      languages: {
        'en': {
          consent_modal: {
            title: 'We use cookies!',
            description: 'We use cookies on our website to enhance your browsing experience by remembering your preferences and analyzing site traffic. By clicking "Accept all", you consent to the use of all cookies. However, you can manage your <a data-bs-toggle="modal" href="#bs-cookie-modal">cookie preferences</a> to provide a controlled consent.',
            primary_btn: {
              text: 'Accept all',
              role: 'accept_all'
            },
            secondary_btn: {
              text: 'Reject all',
              role: 'accept_necessary'
            },
            settings_btn: {
              text: 'Manage preferences'
            },
            consent_footer: {
              description: '<a class="small link-secondary text-decoration-none" href="#">Privacy Policy</a> • <a class="small link-secondary text-decoration-none" href="#">Terms & Conditions</a> • <a class="small link-secondary text-decoration-none" href="#">Imprint</a>'
            }
          },

          settings_modal: {
            title: 'Cookie preferences',
            save_settings_btn: 'Save preferences',
            accept_all_btn: 'Accept all',
            reject_all_btn: 'Reject all',
            close_btn_label: 'Close',
            cookie_table_headers: [
              { col1: 'Name' },
              { col2: 'Domain' },
              { col3: 'Expiration' },
              { col4: 'Description' }
            ],
            blocks: [
              {
                title: 'Cookie usage',
                description: 'We use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="#yourprivacypolicy">Privacy Policy</a>.'
              }, {
                title: 'Necessary',
                description: 'These cookies are essential for the proper functioning of our website. Without these cookies, the website would not work properly',
                toggle: {
                  value: 'necessary',
                  enabled: true,
                  readonly: true          // cookie categories with readonly=true are all treated as "necessary cookies"
                }
              }, {
                title: 'Analytics',
                description: 'These cookies allow the website to remember the choices you have made in the past',
                toggle: {
                  value: 'analytics',     // your cookie category
                  enabled: false,
                  readonly: false
                },
                cookie_table: [           // list of all expected cookies
                  {
                    col1: '^_ga',         // match all cookies starting with "_ga"
                    col2: 'google.com',
                    col3: '2 years',
                    col4: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
                    is_regex: true
                  }, {
                    col1: '_gid',
                    col2: 'google.com',
                    col3: '1 day',
                    col4: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
                  }
                ]
              }, {
                title: 'Advertising',
                description: 'These cookies collect information about how you use the website, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you',
                toggle: {
                  value: 'advertising',
                  enabled: false,
                  readonly: false
                },
                cookie_table: [             // list of all expected cookies
                  {
                    col1: '_name',
                    col2: 'xyz.com',
                    col3: '2 weeks',
                    col4: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
                    is_regex: true
                  }, {
                    col1: '_name',
                    col2: 'xyz.com',
                    col3: '3 days',
                    col4: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
                  }
                ]
              }, {
                title: 'More information',
                description: 'For any queries in relation to our policy on cookies and your choices, please <a href="#yourcontactpage">contact us</a>.',
              },

            ]
          }

        }
      }

    });
  });
</script>

```

### Block / manage scripts

Set `type="text/plain"` and `data-cookiecategory="<category>"` to any script tag you want to manage. Use inline-script in a **Custom HTML** widget in **Footer Info** position **after** the init script.

```html
<!-- Google Analytics -->
<script type="text/plain" data-cookiecategory="analytics">
  // Code goes here
</script>

<!-- Advertising -->
<script type="text/plain" data-cookiecategory="advertising">
  // Code goes here
</script>
```

### Open preferences modal

By clicking one of the "Accept all", "Reject all" or "Save preferences" button, the cookie `bs_cookie_settings` is set with your preferences and hides banner and modal for 182 days. To open preferences modal again, add following link to your privacy policy and to a **Custom HTML** widget in a **Footer** widget position.

#### Link

```html
<a data-bs-toggle="modal" href="#bs-cookie-modal">Cookie Preferences</a>
```

#### Button

```html
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#bs-cookie-modal">Cookie Preferences</button>
```

## License & Credits

- cookieconsent script by Orest Bida, MIT License https://github.com/orestbida/cookieconsent/blob/master/LICENSE
- Plugin Update Checker by YahnisElsts, MIT License <a href="https://github.com/YahnisElsts/plugin-update-checker/blob/master/license.txt">https://github.com/YahnisElsts/plugin-update-checker/blob/master/license.txt
- bs Cookie Settings, MIT License https://github.com/bootscore/bs-cookie-settings/blob/main/LICENSE
