# bs Cookie Settings

## Instalación

1. Descargue la última versión [bs-cookie-settings.zip](https://github.com/bootscore/bs-cookie-settings/releases/latest/download/bs-cookie-settings.zip).
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
