# bS Cookie Settings

WordPress plugin to add a GDPR-ready cookie consent to bootScore theme. Based on the [cookieconsent](https://orestbida.com/demo-projects/cookieconsent/) script by [Orest Bida](https://github.com/orestbida/cookieconsent).

<img src="https://lh3.googleusercontent.com/pw/AM-JKLVzgrDgCd68uGMaxBPYAMYB4wg6cg7orzuNU5sr41XOkGFuxueA9eEgkHRCp1HfoxTghl5giVRdnewa8-Lx7GmDyNeastxvBKpvjRNQ0saP5vspSRGCRP7N0-pLkyJqtcltBR32ZsbWfZjCBvOzvRjIHA=w1200-h954-no" alt="bS Cookie Settings">


## Installation

1. Download latest release [bs-cookie-settings-main.zip](https://github.com/bootscore/bs-cookie-settings/releases)
2. In your admin panel, go to Plugins > and click the Add New button.
3. Click Upload Plugin and Choose File, then select the Plugin's .zip file. Click Install Now.
4. Click Activate to use your new Plugin right away.

## Usage

### Init

Initialize plugin with inline script in **HTML widget in Footer 4** position and replace your data.

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
            description: 'We use cookies on our website to give you the most relevant experience by remembering your preferences and repeat visits. By clicking “Accept all”, you consent to the use of all the cookies. However, you may visit "Cookie Settings" to provide a controlled consent. <a data-bs-toggle="modal" href="#bs-cookie-modal">Cookie Settings</a>',
            primary_btn: {
              text: 'Accept all',
              role: 'accept_all'
            },
            secondary_btn: {
              text: 'Reject all',
              role: 'accept_necessary'
            }
          },

          settings_modal: {
            title: 'Cookie settings',
            save_settings_btn: 'Save settings',
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
                description: 'We use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="#yourprivacypolicy" class="cc-link">Privacy Policy</a>.'
              }, {
                title: 'Necessary',
                description: 'These cookies are essential for the proper functioning of my website. Without these cookies, the website would not work properly',
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
                  },
                  {
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
                  },
                  {
                    col1: '_name',
                    col2: 'xyz.com',
                    col3: '3 days',
                    col4: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
                  }
                ]
              }, {
                title: 'More information',
                description: 'For any queries in relation to our policy on cookies and your choices, please <a class="cc-link" href="#yourcontactpage">contact us</a>.',
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

Set `type="text/plain"` and `data-cookiecategory="<category>"` to any script tag you want to manage. Use inline-script **HTML widget in Footer 4** position **after** the init script.

```html
<!-- Google Analytics -->
<script type="text/plain" data-cookiecategory="analytics">
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-XXXXX-Y', 'auto');
  ga('send', 'pageview');
</script>

<!-- Advertising -->
<script type="text/plain" data-cookiecategory="advertising" src="./assets/js/my_custom_script.js" defer></script>

```

### Open settings modal

By clicking one of the "Accept all", "Reject all" or "Save settings" button, the cookie `bs_cookie_settings` is set with your preferences and hides banner and modal for 182 days. To open settings modal again, add following link to your privacy policy and to a **HTML widget** in **Footer 1** position.

#### Link

```html
<a data-bs-toggle="modal" href="#bs-cookie-modal">Cookie Settings</a>
```

#### Button

```html
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#bs-cookie-modal">Cookie Settings</button>
```

Make sure that the links to your legal note and privacy policy are not covered by the banner. Use a menu in **Footer 1** widget position for them.

## License & Credits

- cookieconsent script by Orest Bida, MIT License https://github.com/orestbida/cookieconsent/blob/master/LICENSE
- bS Cookie Settings, MIT License https://github.com/bootscore/bs-cookie-settings/blob/main/LICENSE
