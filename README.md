# bS Cookie Settings

<img src="https://lh3.googleusercontent.com/pw/AM-JKLVzgrDgCd68uGMaxBPYAMYB4wg6cg7orzuNU5sr41XOkGFuxueA9eEgkHRCp1HfoxTghl5giVRdnewa8-Lx7GmDyNeastxvBKpvjRNQ0saP5vspSRGCRP7N0-pLkyJqtcltBR32ZsbWfZjCBvOzvRjIHA=w1200-h954-no">


## Installation

1. Download the zip file right here by pressing the green code button above.
2. In your admin panel, go to Plugins > and click the Add New button.
3. Click Upload Plugin and Choose File, then select the Plugin's .zip file. Click Install Now.
4. Click Activate to use your new Plugin right away.

## Usage

### Init

Initialize plugin with inline script in HTML widget in Footer 4 position.

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
            description: 'We use cookies on our website to give you the most relevant experience by remembering your preferences and repeat visits. By clicking “Accept all”, you consent to the use of all the cookies. However, you may visit "Cookie settings" to provide a controlled consent. <a href="javascript:void(0)" data-cc="c-settings" class="cc-link btn-link">Cookie settings</a>',
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
                description: 'We use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="#yourprivacypolicy" class="cc-link">privacy policy</a>.'
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

### 3rd party scripts

HTML widget in Footer 4

```html
<script type="text/plain" data-cookiecategory="analytics">
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-XXXXX-Y', 'auto');
  ga('send', 'pageview');
</script>

<script type="text/plain" data-cookiecategory="advertising" src="./assets/js/my_custom_script.js" defer></script>

```

### Open settings modal

HTML widget in Footer 1 and privacy policy

```html
<a href="javascript:void(0)" data-cc="c-settings" aria-haspopup="dialog">Cookie settings</a>
```

## License & Credits

- cookieconsent script by Orest Bida, MIT License https://github.com/orestbida/cookieconsent/blob/master/LICENSE
- 
