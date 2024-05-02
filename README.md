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
                description: 'We use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="#">Privacy Policy</a>.'
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

# Spanish Instructions

## Instalación

1.  Descargue la última versión [bs-cookie-settings.zip](https://github.com/bootscore/bs-cookie-settings/releases/latest/download/bs-cookie-settings.zip).
2. En su panel de administración, vaya a Plugins > y haga clic en el botón Agregar nuevo.
3. Haga clic en Cargar plugin y Elegir archivo, luego seleccione el archivo .zip del plugin. Haga clic en Instalar ahora.
4. Haga clic en Activar para usar el plugin de inmediato.

## Uso

### Inicialización

Para hacer que el plugin funcione, debe agregar el siguiente codigo a su footer.php para que se active en todo el sitio o agregarlo en la pagina especifica donde desea que aparezca

```html
<script>
  // Inicialización
window.addEventListener('load', function () {

  // obtener plugin
  var cc = initCookieConsent();

  // ejecutar el plugin con tu configuración
  cc.run({
    current_lang: 'es',
    autoclear_cookies: true,
    page_scripts: true,

    languages: {
      'es': {
        consent_modal: {
          title: '¡Usamos cookies!',
          description: 'Utilizamos cookies en nuestro sitio web para mejorar su experiencia de navegación recordando sus preferencias y analizando el tráfico del sitio. Al hacer clic en "Aceptar todo", acepta el uso de todas las cookies. Sin embargo, puede gestionar sus <a data-bs-toggle="modal" href="#bs-cookie-modal">preferencias de cookies</a> para otorgar un consentimiento controlado.',
          primary_btn: {
            text: 'Aceptar todo',
            role: 'accept_all'
          },
          secondary_btn: {
            text: 'Rechazar todo',
            role: 'accept_necessary'
          },
          settings_btn: {
            text: 'Administrar preferencias'
          },
          consent_footer: {
            description: '<a class="small link-secondary text-decoration-none" href="#">Política de privacidad</a> • <a class="small link-secondary text-decoration-none" href="#">Términos y condiciones</a> • <a class="small link-secondary text-decoration-none" href="#">Impresión</a>'
          }
        },

        settings_modal: {
          title: 'Preferencias de cookies',
          save_settings_btn: 'Guardar preferencias',
          accept_all_btn: 'Aceptar todo',
          reject_all_btn: 'Rechazar todo',
          close_btn_label: 'Cerrar',
          cookie_table_headers: [
            { col1: 'Nombre' },
            { col2: 'Dominio' },
            { col3: 'Caducidad' },
            { col4: 'Descripción' }
          ],
          blocks: [
            {
              title: 'Uso de cookies',
              description: 'Utilizamos cookies para garantizar las funcionalidades básicas del sitio web y mejorar su experiencia en línea. Puede optar por aceptar/rechazar cada categoría cuando lo desee. Para obtener más detalles sobre las cookies y otros datos sensibles, lea la <a href="#">Política de privacidad</a> completa.'
            }, {
              title: 'Necesarias',
              description: 'Estas cookies son esenciales para el correcto funcionamiento de nuestro sitio web. Sin estas cookies, el sitio web no funcionaría correctamente',
              toggle: {
                value: 'necesarias',
                enabled: true,
                readonly: true          // las categorías de cookies con readonly=true se tratan como "cookies necesarias"
              }
            }, {
              title: 'Analíticas',
              description: 'Estas cookies permiten que el sitio web recuerde las elecciones que ha realizado en el pasado',
              toggle: {
                value: 'analíticas',     // tu categoría de cookies
                enabled: false,
                readonly: false
              },
              cookie_table: [           // lista de todas las cookies esperadas
                {
                  col1: '^_ga',         // coincidir con todas las cookies que comiencen con "_ga"
                  col2: 'google.com',
                  col3: '2 años',
                  col4: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
                  is_regex: true
                }, {
                  col1: '_gid',
                  col2: 'google.com',
                  col3: '1 día',
                  col4: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
                }
              ]
            }, {
              title: 'Publicidad',
              description: 'Estas cookies recopilan información sobre cómo utiliza el sitio web, qué páginas visitó y en qué enlaces hizo clic. Todos los datos están anonimizados y no se pueden utilizar para identificarlo',
              toggle: {
                value: 'publicidad',
                enabled: false,
                readonly: false
              },
              cookie_table: [             // lista de todas las cookies esperadas
                {
                  col1: '_nombre',
                  col2: 'xyz.com',
                  col3: '2 semanas',
                  col4: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
                  is_regex: true
                }, {
                  col1: '_nombre',
                  col2: 'xyz.com',
                  col3: '3 días',
                  col4: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
                }
              ]
            }, {
              title: 'Más información',
              description: 'Para cualquier consulta relacionada con nuestra política de cookies y sus opciones, por favor <a href="#yourcontactpage">contáctenos</a>.',
            },

          ]
        }

      }
    }

  });
});

</script>

```

### Bloques de script

Agregue `type="text/plain"` y `data-cookiecategory="<category>"` a cualquier script existente que deseas configurar.

```html
<!-- Google Analytics -->
<script type="text/plain" data-cookiecategory="analytics">
  // Implementación del codgio aqui
</script>

<!-- Advertising -->
<script type="text/plain" data-cookiecategory="advertising">
  // Implementación del codgio aqui
</script>
```

### Modal de opciones de cookies

Al hacer clic en uno de los botones "**Aceptar todo**", "**Rechazar todo**" o "**Guardar preferencias**", la cookie `bs_cookie_settings` se configura con sus preferencias y oculta el banner y el modal durante 182 días.  Para volver a abrir el modo de preferencias, agregue el siguiente enlace a su política de privacidad y a un widget **HTML personalizado** en el  **Pie de página**.

#### Link

```html
<a data-bs-toggle="modal" href="#bs-cookie-modal">Preferencias de cookies</a>
```

#### Botón

```html
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#bs-cookie-modal">Preferencias de cookies</button>
```

## License & Credits

- cookieconsent script by Orest Bida, MIT License https://github.com/orestbida/cookieconsent/blob/master/LICENSE
- Plugin Update Checker by YahnisElsts, MIT License <a href="https://github.com/YahnisElsts/plugin-update-checker/blob/master/license.txt">https://github.com/YahnisElsts/plugin-update-checker/blob/master/license.txt
- bs Cookie Settings, MIT License https://github.com/bootscore/bs-cookie-settings/blob/main/LICENSE
