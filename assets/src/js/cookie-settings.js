/*!
 * bs Cookie Settings
 *
 * @version 5.6.0
 *
 * Based on CookieConsent v2.7.0
 * https://www.github.com/orestbida/cookieconsent
 * Author Orest Bida
 * Released under the MIT License
 */


(function(){
    'use strict';
    /**
     * @param {HTMLElement} [root] - [optional] element where the cookieconsent will be appended
     * @returns {Object} cookieconsent object with API
     */
    var CookieConsent = function(root){

        /**
         * CHANGE THIS FLAG FALSE TO DISABLE console.log()
         */
        var ENABLE_LOGS = true;

        var _config = {
            'current_lang': 'en',
            'auto_language': null,
            'autorun': true,                          // run as soon as loaded
            'cookie_name': 'bs_cookie_settings',
            'cookie_expiration': 182,                 // default: 6 months (in days)
            'cookie_domain': window.location.hostname,       // default: current domain
            'cookie_path': '/',
            'cookie_same_site': 'Lax',
            'use_rfc_cookie': false,
            'autoclear_cookies': true,
            'revision': 0,
            'script_selector': 'data-cookiecategory'
        };

        /**
         * Object which holds the main methods/API (.show, .run, ...)
         */
        var _cookieconsent = {};

        /**
         * Internal state variables
         */
        var saved_cookie_content = {};
        var consent_modal_exists = false;
        var cookie_consent_accepted = false;
        var consent_modal_visible = false;
        var settings_modal_visible = false;
        var clicked_inside_modal = false;
        var current_modal_focusable;
        var all_table_headers, all_blocks, onAccept, onChange, onFirstAction;
        var valid_revision=true, revision_enabled=false, data=null;

        /**
         * Accept type:
         *  - "all"
         *  - "necessary"
         *  - "custom"
         * @type {string}
         */
        var accept_type;

        /**
         * Contains all accepted categories
         * @type {string[]}
         */
        var accepted_categories=[];
        
        /**
         * Contains all non-accepted (rejected) categories
         * @type {string[]}
         */
        var rejected_categories=[];

        // Don't run plugin (to avoid indexing its text content) if bot detected
        var is_bot = false;

        /**
         * Save reference to the last focused element on the page
         * (used later to restore focus when both modals are closed)
         */
        var last_elem_before_modal;
        var last_consent_modal_btn_focus;

        /**
         * Both of the arrays below have the same structure:
         * [0] => holds reference to the FIRST focusable element inside modal
         * [1] => holds reference to the LAST focusable element inside modal
         */
        var consent_modal_focusable = [];
        var settings_modal_focusable = [];

        /**
         * Keep track of enabled/disabled categories
         * @type {boolean[]}
         */
        var toggle_states = [];

        /**
         * Stores all available categories
         * @type {string[]}
         */
        var toggle_categories = [];

        /**
         * Keep track of readonly toggles
         * @type {boolean[]}
         */
        var toggle_readonly = [];

        /**
         * Pointers to main dom elements (to avoid retrieving them later using document.getElementById)
         */
        var html_dom = document.documentElement;
        var main_container;
        var consent_modal;
        var settings_container, settings_inner;

        /**
         * Update config settings
         * @param {Object} conf_params
         */
        var _setConfig = function(conf_params){
            _log("CookieConsent [CONFIG]: received_config_settings ", conf_params);

            if(typeof conf_params['cookie_expiration'] === "number")
                _config.cookie_expiration = conf_params['cookie_expiration'];

            if(typeof conf_params['cookie_necessary_only_expiration'] === "number")
                _config.cookie_necessary_only_expiration  = conf_params['cookie_necessary_only_expiration'];

            if(typeof conf_params['autorun'] === "boolean")
                _config.autorun = conf_params['autorun'];

            if(typeof conf_params['cookie_domain'] === "string")
                _config.cookie_domain = conf_params['cookie_domain'];

            if(typeof conf_params['cookie_same_site'] === "string")
                _config.cookie_same_site = conf_params['cookie_same_site'];

            if(typeof conf_params['cookie_path'] === "string")
                _config.cookie_path = conf_params['cookie_path'];

            if(typeof conf_params['cookie_name'] === "string")
                _config.cookie_name = conf_params['cookie_name'];

            if(typeof conf_params['onAccept'] === "function")
                onAccept = conf_params['onAccept'];
            
            if(typeof conf_params['onFirstAction'] === "function")
                onFirstAction = conf_params['onFirstAction'];

            if(typeof conf_params['onChange'] === "function")
                onChange = conf_params['onChange'];

            if(typeof conf_params['revision'] === "number"){
                conf_params['revision'] > -1 && (_config.revision = conf_params['revision']);
                revision_enabled = true;
            }

            if(conf_params['autoclear_cookies'] === true)
                _config.autoclear_cookies = true;

            if(conf_params['use_rfc_cookie'] === true)
                _config.use_rfc_cookie = true;

            if(conf_params['hide_from_bots'] === true){
                is_bot = navigator &&
                    ((navigator.userAgent && /bot|crawl|spider|slurp|teoma/i.test(navigator.userAgent)) || navigator.webdriver);
            }

            _config.page_scripts = conf_params['page_scripts'] === true;
            _config.page_scripts_order = conf_params['page_scripts_order'] !== false;

            if (conf_params['auto_language'] === 'browser' || conf_params['auto_language'] === true) {
                _config.auto_language = 'browser';
            } else if (conf_params['auto_language'] === 'document') {
                _config.auto_language = 'document';
            }

            _config.current_lang = _resolveCurrentLang(conf_params.languages, conf_params['current_lang']);
        }

        /**
         * Search for all occurrences in the current page and add an onClick listener :
         * when clicked => open settings modal
         */
        
        var _addCookieSettingsButtonListener = function(){
            var all_links = document.querySelectorAll('a[href="#bs-cookie-modal"], button[data-bs-target="#bs-cookie-modal"]');
            for(var x=0; x<all_links.length; x++){
                all_links[x].setAttribute('aria-haspopup', 'dialog');
                _addEvent(all_links[x], 'click', function(event){
                    _cookieconsent.showSettings(0);
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;
                });
            }
        }
        

        /**
         * Get a valid language (at least 1 must be defined)
         * @param {string} lang - desired language
         * @param {Object} all_languages - all defined languages
         * @returns {string} validated language
         */
        var _getValidatedLanguage = function(lang, all_languages){
            if(Object.prototype.hasOwnProperty.call(all_languages, lang)){
                return lang;
            }else if(_getKeys(all_languages).length > 0){
                if(Object.prototype.hasOwnProperty.call(all_languages, _config.current_lang)){
                    return _config.current_lang ;
                }else{
                    return _getKeys(all_languages)[0];
                }
            }
        }

        /**
         * Save reference to first and last focusable elements inside each modal
         * to prevent losing focus while navigating with TAB
         */
        var _getModalFocusableData = function(){

            /**
             * Note: any of the below focusable elements, which has the attribute tabindex="-1" AND is either
             * the first or last element of the modal, won't receive focus during "open/close" modal
             */
            var allowed_focusable_types = ['[href]', 'button', 'input', 'details', '[tabindex="0"]'];

            function _getAllFocusableElements(modal, _array){
                var focus_later=false, focus_first=false;

                // ie might throw exception due to complex unsupported selector => a:not([tabindex="-1"])
                try{
                    var focusable_elems = modal.querySelectorAll(allowed_focusable_types.join(':not([tabindex="-1"]), '));
                    var attr, len=focusable_elems.length, i=0;

                    while(i < len){

                        attr = focusable_elems[i].getAttribute('data-focus');

                        if(!focus_first && attr === "1"){
                            focus_first = focusable_elems[i];

                        }else if(attr === "0"){
                            focus_later = focusable_elems[i];
                            if(!focus_first && focusable_elems[i+1].getAttribute('data-focus') !== "0"){
                                focus_first = focusable_elems[i+1];
                            }
                        }

                        i++;
                    }

                }catch(e){
                    return modal.querySelectorAll(allowed_focusable_types.join(', '));
                }

                /**
                 * Save first and last elements (used to lock/trap focus inside modal)
                 */
                _array[0] = focusable_elems[0];
                _array[1] = focusable_elems[focusable_elems.length - 1];
                _array[2] = focus_later;
                _array[3] = focus_first;
            }

            /**
             * Get settings modal'S all focusable elements
             * Save first and last elements (used to lock/trap focus inside modal)
             */
            _getAllFocusableElements(settings_inner, settings_modal_focusable);

            /**
             * If consent modal exists, do the same
             */
            if(consent_modal_exists){
                _getAllFocusableElements(consent_modal, consent_modal_focusable);
            }
        }

        var _conf_params, _createConsentModal, revision_message="", consent_text;

        /**
         * Generate cookie consent html based on config settings
         * @param {boolean} never_accepted - used to know whether to create both modals or not
         * @param {Object} conf_params - user configuration parameters
         */
        var _createCookieConsentHTML = function(never_accepted, conf_params){

            // Create main container which holds both consent modal & settings modal
            main_container = _createNode('div');
            main_container.id = 'bs-cookie-settings';

            // Fix layout flash
            main_container.innerHTML = '<div id="bs-cookie-wrapper" class="cc_div"></div>'
            var all_modals_container = main_container.children[0];

            // Get current language
            var lang = _config.current_lang;

            // Feature detection :=> avoid IE exception since .textContent is not always supported
            var innerText = (typeof html_dom.textContent === 'string' ? 'textContent' : 'innerText');

            _conf_params = conf_params;
            _createConsentModal = function(conf_params){

                if(conf_params['force_consent'] === true){
                    _addClass(html_dom, 'force--consent');
                }

                var description = conf_params.languages[lang]['consent_modal']['description'];

                if(revision_enabled){
                    if(!valid_revision){
                        description = description.replace("{{revision_message}}", revision_message || conf_params.languages[lang]['consent_modal']['revision_message'] || "");
                    }else{
                        description = description.replace("{{revision_message}}", "");
                    }
                }

                if(consent_modal){
                    consent_text.innerHTML = description;
                    return;
                }

                consent_modal = _createNode('div');
                var consent_modal_container = _createNode('div');
                var consent_modal_inner = _createNode('div');
                var consent_modal_inner_inner = _createNode('div');
                
                consent_text = _createNode('div');
                var consent_buttons = _createNode('div');

                consent_modal.id = 'bs-cookie-bar';
                consent_modal.className =  "bg-body-tertiary fixed-bottom d-block";
                consent_modal_container.className =  "container py-4";
                consent_modal_inner.id = 'c-inr';
                consent_modal_inner.className =  "row align-items-center";
                consent_modal_inner_inner.id = 'c-inr-i';
                consent_modal_inner_inner.className =  "col mb-4 mb-md-0";
               
                consent_text.id = 'c-txt';
                consent_buttons.id = "c-bns";
                consent_buttons.className =  "col-md-4 col-lg-3 d-flex flex-column justify-content-center gap-2";
                
                consent_modal.setAttribute('role', 'dialog');
                consent_modal.setAttribute('aria-modal', 'true');
                consent_modal.setAttribute('aria-hidden', 'false');
                consent_modal.setAttribute('aria-labelledby', 'c-ttl');
                consent_modal.setAttribute('aria-describedby', 'c-txt');

                // Use insertAdjacentHTML instead of innerHTML
                var consent_modal_title_value = conf_params.languages[lang]['consent_modal']['title'];
                
                // Add title (if valid)
                if(consent_modal_title_value){
                    var consent_title = _createNode('div');
                    consent_title.id = 'c-ttl';
                    consent_title.className =  "h5";
                    consent_title.setAttribute('role', 'heading');
                    consent_title.setAttribute('aria-level', '2');
                    consent_title.insertAdjacentHTML('beforeend', consent_modal_title_value);
                    consent_modal_inner_inner.appendChild(consent_title);
                }

                consent_text.insertAdjacentHTML('beforeend', description);
                consent_modal_inner_inner.appendChild(consent_text);

                var primary_btn_data = conf_params.languages[lang]['consent_modal']['primary_btn'],   // accept current selection
                    secondary_btn_data = conf_params.languages[lang]['consent_modal']['secondary_btn'],
                    settings_btn_data = conf_params.languages[lang]['consent_modal']['settings_btn'], // Settings
                    consent_footer = conf_params.languages[lang]['consent_modal']['consent_footer']; // Links

                // Add primary button if not falsy
                if(primary_btn_data){
                    
                    var consent_primary_btn = _createNode('button');
                    consent_primary_btn.id = 'c-p-bn';
                    consent_primary_btn.className =  "c-bn btn btn-primary";
                    consent_primary_btn[innerText] = conf_params.languages[lang]['consent_modal']['primary_btn']['text'];
                    
                    var _accept_type;

                    if(primary_btn_data['role'] === 'accept_all')
                        _accept_type = 'all'

                    _addEvent(consent_primary_btn, "click", function(){
                        _cookieconsent.hide();
                        _log("CookieConsent [ACCEPT]: cookie_consent was accepted!");
                        _cookieconsent.accept(_accept_type);
                    });
                }

                // Add secondary button if not falsy
                if(secondary_btn_data){

                    var consent_secondary_btn = _createNode('button');
                    consent_secondary_btn.id = 'c-s-bn';
                    consent_secondary_btn.className = "c-bn c_link btn btn-primary";
                    consent_secondary_btn[innerText] = conf_params.languages[lang]['consent_modal']['secondary_btn']['text'];

                    if(secondary_btn_data['role'] === 'accept_necessary'){
                        _addEvent(consent_secondary_btn, 'click', function(){
                            _cookieconsent.hide();
                            _cookieconsent.accept([]); // accept necessary only
                        });
                    }else{
                        _addEvent(consent_secondary_btn, 'click', function(){
                            _cookieconsent.showSettings(0);
                        });
                    }
                }
              
                // Add settings button if not falsy
                if(settings_btn_data){
                  
                    var consent_settings_btn = _createNode('button');
                    consent_settings_btn.id = 'set-s-bn';
                    consent_settings_btn.className = "c-bn c_link btn btn-secondary";
                    consent_settings_btn[innerText] = conf_params.languages[lang]['consent_modal']['settings_btn']['text'];

                    consent_settings_btn.setAttribute('data-bs-toggle', 'modal');
                    consent_settings_btn.setAttribute('data-bs-target', '#bs-cookie-modal');
                }
              
              
            
                // Swap buttons
                var gui_options_data = conf_params['gui_options'];
                if(gui_options_data && gui_options_data['consent_modal'] && gui_options_data['consent_modal']['swap_buttons'] === true){
                  consent_footer && consent_buttons.appendChild(consent_footer);   
                  settings_btn_data && consent_buttons.appendChild(consent_settings_btn);  
                    secondary_btn_data && consent_buttons.appendChild(consent_secondary_btn);
                    primary_btn_data && consent_buttons.appendChild(consent_primary_btn);
                    consent_buttons.className = 'swap';
                } else  {
                    primary_btn_data && consent_buttons.appendChild(consent_primary_btn);
                    secondary_btn_data && consent_buttons.appendChild(consent_secondary_btn);
                    settings_btn_data && consent_buttons.appendChild(consent_settings_btn);
                }
              
  
                consent_modal.appendChild(consent_modal_container);
                consent_modal_container.appendChild(consent_modal_inner);
                consent_modal_inner.appendChild(consent_modal_inner_inner);
                (primary_btn_data || secondary_btn_data ) && consent_modal_inner.appendChild(consent_buttons);
              
                // Add banner consent links if not falsy
                if(consent_footer){

                    var consent_footer = _createNode('div');
                    var consent_footer_inner = _createNode('div');
                    consent_footer.id = 'consent-links';
                    consent_footer.className = "border-top";
                    consent_footer_inner.id = 'consent-links-inner';
                    consent_footer_inner.className = "container py-2 text-center text-md-start";
                    consent_footer_inner.insertAdjacentHTML('beforeend', conf_params.languages[_config.current_lang]['consent_modal']['consent_footer']['description']);
                    consent_modal.appendChild(consent_footer);
                    consent_footer.appendChild(consent_footer_inner);
                }
  

                // Append consent modal to main container
                all_modals_container.appendChild(consent_modal);

                consent_modal_exists = true;
            }

            // Create consent modal
            if(!never_accepted) _createConsentModal(conf_params);

            /**
             * Create all consent_modal elements
             */
            settings_container = _createNode('div');
            var settings = _createNode('div');
            var settings_container_inner = _createNode('div');
            settings_inner = _createNode('div');
            var settings_title = _createNode('div');
            var settings_header = _createNode('div');
            var settings_close_btn = _createNode('button');
            var settings_blocks = _createNode('div');

            /**
             * Set ids
             */
            settings_container.id = 'bs-cookie-modal';
            settings_container_inner.id = "c-s-in";
            settings.id = "cs";
            settings_title.id = 's-ttl';
            settings_inner.id = 's-inr';
            settings_header.id = "s-hdr";
            settings_blocks.id = 's-bl';
            settings_close_btn.id = 's-c-bn';
          
            /**
             * Set classes
             */
            settings.className = "position-fixed top-0 end-0 bottom-0 start-0";
            settings_container.className = "modal fade";  
            settings_container_inner.className = "modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down";
            settings_inner.className = 'modal-content';
            settings_header.className = "modal-header";
            settings_title.className = 'h5 modal-title';
            settings_close_btn.className = 'c-bn btn-close';
            settings_blocks.className = 'modal-body';

          
            /**
             * Set attributes
             */          
            settings_close_btn.setAttribute('aria-label', conf_params.languages[lang]['settings_modal']['close_btn_label'] || 'Close');
            settings_close_btn.setAttribute('data-bs-dismiss', 'modal'); 
            settings_container.setAttribute('tabindex', '-1'); 
            settings_container.setAttribute('data-bs-backdrop', 'static'); 
            settings_container.setAttribute('aria-hidden', 'true');
            settings_container.setAttribute('aria-labelledby', 's-ttl');
            settings_title.setAttribute('role', 'heading');

            // If 'esc' key is pressed inside settings_container div => hide settings
            _addEvent(settings_container_inner, 'keydown', function(evt){
                evt = evt || window.event;
                if (evt.keyCode === 27) {
                    _cookieconsent.hideSettings(0);
                }
            }, true);

            _addEvent(settings_close_btn, 'click', function(){
                _cookieconsent.hideSettings(0);
            });

            all_blocks = conf_params.languages[_config.current_lang]['settings_modal']['blocks'];
            all_table_headers = conf_params.languages[_config.current_lang]['settings_modal']['cookie_table_headers'];

            var n_blocks = all_blocks.length;

            // Set settings modal title
            settings_title.insertAdjacentHTML('beforeend', conf_params.languages[_config.current_lang]['settings_modal']['title']);

            // Create settings modal content (blocks)
            for(var i=0; i<n_blocks; ++i){

                var title_data = all_blocks[i]['title'],
                    description_data = all_blocks[i]['description'],
                    toggle_data = all_blocks[i]['toggle'],
                    cookie_table_data = all_blocks[i]['cookie_table'],
                    remove_cookie_tables = conf_params['remove_cookie_tables'] === true,
                    isExpandable = (description_data && 'truthy') || (!remove_cookie_tables && (cookie_table_data && 'truthy'));
                
                // Create title
                var block_section = _createNode('div');
                var block_table_container = _createNode('div');

                // Create description
                if(description_data){
                    var block_desc = _createNode('div');
                    block_desc.className = 'p small';
                    block_desc.insertAdjacentHTML('beforeend', description_data);
                }

                var block_title_container = _createNode('div');
                block_title_container.className = 'title';

                block_section.className = 'c-bl';
                block_table_container.className = 'desc';
 
                // Create toggle if specified (opt in/out)
                if(title_data && typeof toggle_data !== 'undefined'){

                    var accordion_id = "c-ac-"+i;
                    var accordion_id_toggler = "#c-ac-"+i;

                    // Create button (to collapse/expand block description)
                    var block_title_btn = isExpandable ? _createNode('button') : _createNode('div');
                    var block_switch_label = _createNode('label');
                    var block_switch = _createNode('input');
                    var block_switch_span = _createNode('span');
                    var label_text_span = _createNode('span');

                    // These 2 spans will contain each 2 pseudo-elements to generate 'tick' and 'x' icons
                    var block_switch_span_on_icon = _createNode('span');
                    var block_switch_span_off_icon = _createNode('span');

                    block_title_btn.className = isExpandable ? 'b-tl exp position-relative d-block p-3 w-100' : 'b-tl';
                    block_switch_label.className = 'b-tg form-check form-switch fs-4';
                    block_switch.className = 'c-tgl form-check-input cursor-pointer';
                    block_switch_span_on_icon.className = 'on-i';
                    block_switch_span_off_icon.className = 'off-i';
                    block_switch_span.className = 'c-tg';
                    label_text_span.className = "t-lb d-none";

                    if(isExpandable){
                        block_title_btn.setAttribute('aria-expanded', 'false');
                        block_title_btn.setAttribute('data-bs-toggle', 'collapse');
                        block_title_btn.setAttribute('data-bs-target', accordion_id_toggler);
                        block_title_btn.setAttribute('aria-controls', accordion_id);
                    }

                    block_switch.type = 'checkbox';
                    block_switch_span.setAttribute('aria-hidden', 'true');

                    var cookie_category = toggle_data.value;
                    block_switch.value = cookie_category;

                    label_text_span[innerText] = title_data;
                    block_title_btn.insertAdjacentHTML('beforeend', title_data);

                    block_title_container.appendChild(block_title_btn);
                    block_switch_span.appendChild(block_switch_span_on_icon);
                    block_switch_span.appendChild(block_switch_span_off_icon);

                    /**
                     * If never accepted => generate toggles with the states defined in the config. object
                     * Otherwise, retrieve values from saved cookie
                     */
                    if(never_accepted){
                        if(_inArray(saved_cookie_content['level'], cookie_category) > -1){
                            block_switch.checked = true;
                            toggle_states.push(true);
                        }else{
                            toggle_states.push(false);
                        }
                    }else if(toggle_data['enabled']){
                        block_switch.checked = true;
                        toggle_states.push(true);
                    }else{
                        toggle_states.push(false);
                    }

                    toggle_categories.push(cookie_category);

                    /**
                     * Set toggle as readonly if true (disable checkbox)
                     */
                    if(toggle_data['readonly']){
                        block_switch.disabled = true;
                        _addClass(block_switch_span, 'c-ro');
                        toggle_readonly.push(true);
                    }else{
                        toggle_readonly.push(false);
                    }

                    _addClass(block_table_container, 'b-acc');
                    _addClass(block_table_container, 'collapse');
                    _addClass(block_title_container, 'b-bn');
                    _addClass(block_title_container, 'd-flex');
                    _addClass(block_title_container, 'align-items-center');
                    _addClass(block_title_container, 'position-relative');
                    _addClass(block_section, 'b-ex');
                    _addClass(block_section, 'p-0');
                    _addClass(block_section, 'bg-body-tertiary');
                    _addClass(block_section, 'rounded');
                    _addClass(block_section, 'mb-2');

                    block_table_container.id = accordion_id;
                    block_table_container.setAttribute('aria-hidden', 'true');

                    block_switch_label.appendChild(block_switch);
                    block_switch_label.appendChild(block_switch_span);
                    block_switch_label.appendChild(label_text_span);
                    block_title_container.appendChild(block_switch_label);

                    /**
                     * On button click handle the following :=> aria-expanded, aria-hidden and act class for current block
                     */
                    isExpandable && (function(accordion, block_section, btn){
                        _addEvent(block_title_btn, 'click', function(){
                            if(!_hasClass(block_section, 'act')){
                                _addClass(block_section, 'act');
                                btn.setAttribute('aria-expanded', 'true');
                                accordion.setAttribute('aria-hidden', 'false');
                            }else{
                                _removeClass(block_section, 'act');
                                btn.setAttribute('aria-expanded', 'false');
                                accordion.setAttribute('aria-hidden', 'true');
                            }
                        }, false);
                    })(block_table_container, block_section, block_title_btn);

                }else{
                    /**
                     * If block is not a button (no toggle defined),
                     * create a simple div instead
                     */
                    if(title_data){
                        var block_title = _createNode('div');
                        block_title.className = 'b-tl h6';
                        block_title.setAttribute('role', 'heading');
                        block_title.setAttribute('aria-level', '3');
                        block_title.insertAdjacentHTML('beforeend', title_data);
                        block_title_container.appendChild(block_title);
                    }
                }

                title_data && block_section.appendChild(block_title_container);
                description_data && block_table_container.appendChild(block_desc);

                // if cookie table found, generate table for this block
                if(!remove_cookie_tables && typeof cookie_table_data !== 'undefined'){
                    var tr_tmp_fragment = document.createDocumentFragment();

                    /**
                     * Use custom table headers
                     */
                    for(var p=0; p<all_table_headers.length; ++p){
                        // create new header
                        var th1 = _createNode('th');
                        var obj = all_table_headers[p];
                        th1.setAttribute('scope', 'col');

                        // get custom header content
                        if(obj){
                            var new_column_key = obj && _getKeys(obj)[0];
                            th1[innerText] = all_table_headers[p][new_column_key];
                            tr_tmp_fragment.appendChild(th1);
                        }
                    }

                    var tr_tmp = _createNode('tr');
                    tr_tmp.appendChild(tr_tmp_fragment);

                    // create table header & append fragment
                    var thead = _createNode('thead');
                    thead.appendChild(tr_tmp);

                    // append header to table
                    var block_table = _createNode('table');
                    block_table.appendChild(thead);

                    var tbody_fragment = document.createDocumentFragment();

                    // create table content
                    for(var n=0; n<cookie_table_data.length; n++){
                        var tr = _createNode('tr');

                        for(var g=0; g<all_table_headers.length; ++g){
                            // get custom header content
                            obj = all_table_headers[g];
                            if(obj){
                                new_column_key = _getKeys(obj)[0];

                                var td_tmp = _createNode('td');

                                // Allow html inside table cells
                                td_tmp.insertAdjacentHTML('beforeend', cookie_table_data[n][new_column_key]);
                                td_tmp.setAttribute('data-column', obj[new_column_key]);

                                tr.appendChild(td_tmp);
                            }
                        }

                        tbody_fragment.appendChild(tr);
                    }

                    // append tbody_fragment to tbody & append the latter into the table
                    var tbody = _createNode('tbody');
                    tbody.appendChild(tbody_fragment);
                    block_table.appendChild(tbody);

                    block_table_container.appendChild(block_table);
                }
                
                /**
                 * Append only if is either:
                 * - togglable div with title
                 * - a simple div with at least a title or description 
                 */
                if(toggle_data && title_data || (!toggle_data && (title_data || description_data))){
                    block_section.appendChild(block_table_container);
                    settings_blocks.appendChild(block_section);
                }
            }

            // Create settings buttons
            var settings_buttons = _createNode('div');
            var settings_save_btn = _createNode('button');
            var settings_accept_all_btn = _createNode('button');

            settings_buttons.id = 's-bns';
            settings_buttons.className = 'modal-footer d-grid gap-1 d-sm-flex gap-sm-0';
            settings_save_btn.id = 's-sv-bn';
            settings_accept_all_btn.id = 's-all-bn';
            settings_save_btn.className ='c-bn btn btn-secondary ms-sm-auto';
            settings_accept_all_btn.className ='c-bn btn btn-primary';
            settings_save_btn.insertAdjacentHTML('beforeend', conf_params.languages[_config.current_lang]['settings_modal']['save_settings_btn']);
            settings_accept_all_btn.insertAdjacentHTML('beforeend', conf_params.languages[_config.current_lang]['settings_modal']['accept_all_btn']);

            // Button Attributes
            settings_accept_all_btn.setAttribute('data-bs-dismiss', 'modal');
            settings_save_btn.setAttribute('data-bs-dismiss', 'modal');
            
            settings_buttons.appendChild(settings_accept_all_btn);

            var reject_all_btn_text = conf_params.languages[_config.current_lang]['settings_modal']['reject_all_btn'];

            // Add third [optional] reject all button if provided
            if(reject_all_btn_text){

                var reject_all_btn = _createNode('button');
                reject_all_btn.id = 's-rall-bn';
                reject_all_btn.className = 'c-bn btn btn-primary';
                reject_all_btn.insertAdjacentHTML('beforeend', reject_all_btn_text);
                reject_all_btn.setAttribute('data-bs-dismiss', 'modal');

                _addEvent(reject_all_btn, 'click', function(){
                    _cookieconsent.hide();
                    _cookieconsent.accept([]);
                });

                settings_inner.className = "bns-t modal-content";
                settings_buttons.appendChild(reject_all_btn);
            }

            settings_buttons.appendChild(settings_save_btn);

            // Add save preferences button onClick event
            // Hide both settings modal and consent modal
            _addEvent(settings_save_btn, 'click', function(){
                _cookieconsent.hide();
                _cookieconsent.accept();
            });

            _addEvent(settings_accept_all_btn, 'click', function(){
                _cookieconsent.hide();
                _cookieconsent.accept('all');
            });

            settings_header.appendChild(settings_title);
            settings_header.appendChild(settings_close_btn);

            settings_inner.appendChild(settings_header);
            settings_inner.appendChild(settings_blocks);
            settings_inner.appendChild(settings_buttons);
            settings_container_inner.appendChild(settings_inner);

            settings.appendChild(settings_container_inner);
            settings_container.appendChild(settings_container_inner);

            all_modals_container.appendChild(settings_container);

            // Finally append everything to body (main_container holds both modals)
            (root || document.body).appendChild(main_container);
        }

        /**
         * Set toggles/checkboxes based on accepted categories and save cookie
         * @param {string[]} accepted_categories - Array of categories to accept
         */
        var _saveCookiePreferences = function(accepted_categories){

            // Retrieve all toggle/checkbox values
            var category_toggles = document.querySelectorAll('.c-tgl') || [];
            var changedSettings = [], must_reload = false;

            // If there are opt in/out toggles ...
            if(category_toggles.length > 0){

                for(var i=0; i<category_toggles.length; i++){
                    if(_inArray(accepted_categories, toggle_categories[i]) !== -1){
                        category_toggles[i].checked = true;
                        if(!toggle_states[i]){
                            changedSettings.push(toggle_categories[i]);
                            toggle_states[i] = true;
                        }
                    }else{
                        category_toggles[i].checked = false;
                        if(toggle_states[i]){
                            changedSettings.push(toggle_categories[i]);
                            toggle_states[i] = false;
                        }
                    }
                }

                /**
                 * If autoclear_cookies==true -> delete all cookies which are unused (based on selected preferences)
                 */
                if(_config.autoclear_cookies && cookie_consent_accepted && changedSettings.length > 0){

                    // Get number of blocks
                    var len = all_blocks.length;
                    var count = -1;

                    // Retrieve all cookies
                    var all_cookies_array = _getCookie('', 'all');

                    // delete cookies on 'www.domain.com' and '.www.domain.com' (can also be without www)
                    var domains = [_config.cookie_domain, '.'+_config.cookie_domain];

                    // if domain has www, delete cookies also for 'domain.com' and '.domain.com'
                    if(_config.cookie_domain.slice(0, 4) === 'www.'){
                        var non_www_domain = _config.cookie_domain.substr(4);  // remove first 4 chars (www.)
                        domains.push(non_www_domain);
                        domains.push('.' + non_www_domain);
                    }

                    // For each block
                    for(var jk=0; jk<len; jk++){

                        // Save current block (local scope & less accesses -> ~faster value retrieval)
                        var curr_block = all_blocks[jk];

                        // If current block has a toggle for opt in/out
                        if(Object.prototype.hasOwnProperty.call(curr_block, "toggle")){

                            // if current block has a cookie table, an off toggle,
                            // and its preferences were just changed => delete cookies
                            if(
                                !toggle_states[++count] &&
                                Object.prototype.hasOwnProperty.call(curr_block, "cookie_table") &&
                                _inArray(changedSettings, curr_block['toggle']['value']) > -1
                            ){
                                var curr_cookie_table = curr_block['cookie_table'];

                                // Get first property name
                                var ckey = _getKeys(all_table_headers[0])[0];

                                // Get number of cookies defined in cookie_table
                                var clen = curr_cookie_table.length;

                                // set "must_reload" to true if reload=on_disable
                                if(curr_block['toggle']['reload'] === 'on_disable') must_reload = true;

                                // for each row defined in the cookie table
                                for(var hk=0; hk<clen; hk++){

                                    // Get current row of table (corresponds to all cookie params)
                                    var curr_row = curr_cookie_table[hk], found_cookies = [];
                                    var curr_cookie_name = curr_row[ckey];
                                    var is_regex = curr_row['is_regex'] || false;
                                    var curr_cookie_domain = curr_row['domain'] || null;
                                    var curr_cookie_path = curr_row['path'] || false;

                                    // set domain to the specified domain
                                    curr_cookie_domain && ( domains = [curr_cookie_domain, '.'+curr_cookie_domain]);

                                    // If regex provided => filter cookie array
                                    if(is_regex){
                                        for(var n=0; n<all_cookies_array.length; n++){
                                            if(all_cookies_array[n].match(curr_cookie_name)){
                                                found_cookies.push(all_cookies_array[n]);
                                            }
                                        }
                                    }else{
                                        var found_index = _inArray(all_cookies_array, curr_cookie_name);
                                        if(found_index > -1) found_cookies.push(all_cookies_array[found_index]);
                                    }

                                    _log("CookieConsent [AUTOCLEAR]: search cookie: '" + curr_cookie_name + "', found:", found_cookies);

                                    // If cookie exists -> delete it
                                    if(found_cookies.length > 0){
                                        _eraseCookies(found_cookies, curr_cookie_path, domains);
                                        curr_block['toggle']['reload'] === 'on_clear' && (must_reload = true);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            saved_cookie_content = {
                "level": accepted_categories,
                "revision": _config.revision,
                "data": data,
                "rfc_cookie": _config.use_rfc_cookie
            }

            // save cookie with preferences 'level' (only if never accepted or settings were updated)
            if(!cookie_consent_accepted || changedSettings.length > 0 || !valid_revision){
                valid_revision = true;
                _setCookie(_config.cookie_name, JSON.stringify(saved_cookie_content));
                _manageExistingScripts();
            }

            if(!cookie_consent_accepted){

                if(typeof onFirstAction === 'function')
                    onFirstAction(_cookieconsent.getUserPreferences());

                if(typeof onAccept === 'function')
                    onAccept(saved_cookie_content);
                
                cookie_consent_accepted = true;

                return;
            }

            // fire onChange only if settings were changed
            if(typeof onChange === "function" && changedSettings.length > 0){
                onChange(saved_cookie_content, changedSettings);
            }

            /**
             * reload page if needed
             */
            if(must_reload){
                window.location.reload();
            }
        }

        /**
         * Function to run after css load
         * @callback cssLoaded
         */

        /**
         * Load style via ajax in background (and then show modal)
         * @param {string} css_path
         * @param {cssLoaded} callback
         */
        var _loadCSS = function(css_path, callback){

            // Enable if given path is string and non empty
            var enable = typeof css_path === 'string' && css_path !== "";

            if(enable && !document.getElementById('cc--style')){

                // Create style tag
                var style = _createNode('style');

                // ad an id so that in SPA apps (react-like) the style doesn't get loaded multiple times when plugin is called
                style.id = 'cc--style';

                var xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function() {
                    if(this.readyState === 4 && this.status === 200){

                        // Necessary for <IE9
                        style.setAttribute('type', 'text/css');

                        if(style.styleSheet){ // if <IE9
                            style.styleSheet.cssText = this.responseText;
                        }else{ // all other browsers
                            style.appendChild(document.createTextNode(this.responseText));
                        }

                        // Append css text content
                        document.getElementsByTagName('head')[0].appendChild(style);
                        _log("CookieConsent [AUTOLOAD_CSS]: loaded style = '"+ css_path + "'");

                        callback();
                    }
                };

                xhr.open("GET", css_path);
                xhr.send();
            }else{
                callback();
            }
        }

        /**
         * Returns index of found element inside array, otherwise -1
         * @param {Array} arr
         * @param {Object} value
         * @returns {number}
         */
        var _inArray = function(arr, value){
            var len = arr.length;
            for(var i=0; i<len; i++){
                if(arr[i] === value)
                    return i;
            }
            return -1;
        }

        /**
         * Helper function which prints info (console.log())
         * @param {Object} print_msg
         * @param {Object} [optional_param]
         */
        var _log = function(print_msg, optional_param, error){
            ENABLE_LOGS && (!error ? console.log(print_msg, optional_param !== undefined ? optional_param : ' ') : console.error(print_msg, optional_param || ""));
        }

        /**
         * Helper function which creates an HTMLElement object based on 'type' and returns it.
         * @param {string} type
         * @returns {HTMLElement}
         */
        var _createNode = function(type){
            var el = document.createElement(type);
            if(type === 'button'){
                el.setAttribute('type', type);
            }
            return el;
        }

        /**
         * Resolve which language should be used.
         *
         * @param {Object} languages Object with language translations
         * @param {string} [requested_language] Language specified by given configuration parameters
         * @returns {string}
         */
        var _resolveCurrentLang = function (languages, requested_language) {
            _log("CookieConsent [LANG]: auto_language strategy is '" + _config.auto_language + "'");

            if (_config.auto_language === 'browser') {
                return _getValidatedLanguage(_getBrowserLang(), languages);
            } else if (_config.auto_language === 'document') {
                return _getValidatedLanguage(document.documentElement.lang, languages);
            } else {
                if (typeof requested_language === 'string') {
                    return _config.current_lang = _getValidatedLanguage(requested_language, languages);
                }
            }

            _log("CookieConsent [LANG]: setting current_lang = '" + _config.current_lang + "'");
            return _config.current_lang; // otherwise return default
        }

        /**
         * Get current client's browser language
         * @returns {string}
         */
        var _getBrowserLang = function(){
            var browser_lang = navigator.language || navigator.browserLanguage;
            browser_lang.length > 2 && (browser_lang = browser_lang[0]+browser_lang[1]);
            _log("CookieConsent [LANG]: detected_browser_lang = '"+ browser_lang + "'");
            return browser_lang.toLowerCase()
        }

        /**
         * Trap focus inside modal and focus the first
         * focusable element of current active modal
         */
        var _handleFocusTrap = function(){
            var tabbedOutsideDiv = false;
            var tabbedInsideModal = false;

            _addEvent(document, 'keydown', function(e){
                e = e || window.event;

                // If is tab key => ok
                if(e.key !== 'Tab') return;

                // If there is any modal to focus
                if(current_modal_focusable){
                    // If reached natural end of the tab sequence => restart
                    if(e.shiftKey){
                        if (document.activeElement === current_modal_focusable[0]) {
                            current_modal_focusable[1].focus();
                            e.preventDefault();
                        }
                    }else{
                        if (document.activeElement === current_modal_focusable[1]) {
                            current_modal_focusable[0].focus();
                            e.preventDefault();
                        }
                    }

                    // If have not yet used tab (or shift+tab) and modal is open ...
                    // Focus the first focusable element
                    if(!tabbedInsideModal && !clicked_inside_modal){
                        tabbedInsideModal = true;
                        !tabbedOutsideDiv && e.preventDefault();

                        if(e.shiftKey){
                            if(current_modal_focusable[3]){
                                if(!current_modal_focusable[2]){
                                    current_modal_focusable[0].focus();
                                }else{
                                    current_modal_focusable[2].focus();
                                }
                            }else{
                                current_modal_focusable[1].focus();
                            }
                        }else{
                            if(current_modal_focusable[3]){
                                current_modal_focusable[3].focus();
                            }else{
                                current_modal_focusable[0].focus();
                            }
                        }
                    }
                }

                !tabbedInsideModal && (tabbedOutsideDiv = true);
            });

            if(document.contains){
                _addEvent(main_container, 'click', function(e){
                    e = e || window.event;
                    /**
                     * If click is on the foreground overlay (and not inside settings_modal),
                     * hide settings modal
                     *
                     * Notice: click on div is not supported in IE
                     */
                    if(settings_modal_visible){
                        if(!settings_inner.contains(e.target)){
                            _cookieconsent.hideSettings(0);
                            clicked_inside_modal = false;
                        }else{
                            clicked_inside_modal = true;
                        }
                    }else if(consent_modal_visible){
                        if(consent_modal.contains(e.target)){
                            clicked_inside_modal = true;
                        }
                    }

                }, true);
            }
        }
        

        /**
         * Manage each modal's layout
         * @param {Object} gui_options
         */
        var _guiManager = function(gui_options, only_consent_modal){

            // If gui_options is not object => exit
            if(typeof gui_options !== 'object') return;

            var consent_modal_options = gui_options['consent_modal'];
            var settings_modal_options = gui_options['settings_modal'];

            /**
             * Helper function which adds layout and
             * position classes to given modal
             *
             * @param {HTMLElement} modal
             * @param {string[]} allowed_layouts
             * @param {string[]} allowed_positions
             * @param {string} layout
             * @param {string[]} position
             */
            function _setLayout(modal, allowed_layouts, allowed_positions, allowed_transitions, layout, position, transition){
                position = (position && position.split(" ")) || [];

                // Check if specified layout is valid
                if(_inArray(allowed_layouts, layout) > -1){

                    // Add layout classes
                    _addClass(modal, layout);

                    // Add position class (if specified)
                    if(!(layout === 'bar' && position[0] === 'middle') && _inArray(allowed_positions, position[0]) > -1){
                        for(var i=0; i<position.length; i++){
                            _addClass(modal, position[i]);
                        }
                    }
                }

                // Add transition class
                (_inArray(allowed_transitions, transition) > -1) && _addClass(modal, transition);
            }

            if(consent_modal_exists && consent_modal_options){
                _setLayout(
                    consent_modal,
                    ['box', 'bar', 'cloud'],
                    ['top', 'middle', 'bottom'],
                    ['zoom', 'slide'],
                    consent_modal_options['layout'],
                    consent_modal_options['position'],
                    consent_modal_options['transition']
                );
            }

            if(!only_consent_modal && settings_modal_options){
                _setLayout(
                    settings_container,
                    ['bar'],
                    ['left', 'right'],
                    ['zoom', 'slide'],
                    settings_modal_options['layout'],
                    settings_modal_options['position'],
                    settings_modal_options['transition']
                );
            }
        }

        /**
         * Returns true if cookie category is accepted by the user
         * @param {string} cookie_category
         * @returns {boolean}
         */
        _cookieconsent.allowedCategory = function(cookie_category){
            return _inArray(
                JSON.parse(_getCookie(_config.cookie_name, 'one', true) || '{}')['level'] || [] ,
                cookie_category
            ) > -1;
        }

        /**
         * Check if cookieconsent is already attached to dom
         * If not, create one, configure it and attach it to the body
         */
        _cookieconsent.run = function(conf_params){
            if(!document.getElementById('cc_div')){
                // configure all parameters
                _setConfig(conf_params);

                // if is bot, don't run plugin
                if(is_bot) return;

                // Retrieve cookie value (if set)
                saved_cookie_content = JSON.parse(_getCookie(_config.cookie_name, 'one', true) || "{}");
                cookie_consent_accepted = saved_cookie_content['level'] !== undefined;
                data = saved_cookie_content['data'] !== undefined ? saved_cookie_content['data'] : null;

                // Compare current revision with the one retrieved from cookie
                valid_revision = typeof conf_params['revision'] === "number"
                    ? cookie_consent_accepted
                        ? conf_params['revision'] > -1
                            ? saved_cookie_content['revision'] === _config.revision
                            : true
                        : true
                    : true;

                // If invalid revision or cookie is empty => create consent modal
                consent_modal_exists = (!cookie_consent_accepted || !valid_revision);

                // Generate cookie-settings dom (& consent modal)
                _createCookieConsentHTML(!consent_modal_exists, conf_params);

                _loadCSS(conf_params['theme_css'], function(){
                    _getModalFocusableData();
                    _guiManager(conf_params['gui_options']);
                    _addCookieSettingsButtonListener();

                    if(_config.autorun && consent_modal_exists){
                        _cookieconsent.show(conf_params['delay'] || 0);
                    }

                    // Accessibility :=> if tab pressed => trap focus inside modal
                    setTimeout(function(){_handleFocusTrap();}, 100);
                });

                if(cookie_consent_accepted && valid_revision){
                    var rfc_prop_exists = typeof saved_cookie_content['rfc_cookie'] === "boolean";

                    /*
                     * Convert cookie to rfc format (if `use_rfc_cookie` is enabled)
                     */
                    if(!rfc_prop_exists || (rfc_prop_exists && saved_cookie_content['rfc_cookie'] !== _config.use_rfc_cookie)){
                        saved_cookie_content['rfc_cookie'] = _config.use_rfc_cookie;
                        _setCookie(_config.cookie_name, JSON.stringify(saved_cookie_content));
                    }

                    _manageExistingScripts();
                    if(typeof conf_params['onAccept'] === "function"){
                        conf_params['onAccept'](saved_cookie_content);
                    }
                }
            }else{
                _log("CookieConsent [NOTICE]: cookie consent already attached to body!");
            }
        }

        /**
         * Show settings modal (with optional delay)
         * @param {number} delay
         */
        _cookieconsent.showSettings = function(delay){
            setTimeout(function() {
                _addClass(html_dom, "show--settings");
                settings_container.setAttribute('aria-hidden', 'false');
                settings_modal_visible = true;

                _log("CookieConsent [SETTINGS]: show settings_modal");
            }, delay > 0 ? delay : 0);
        }

        /**
         * This function handles the loading/activation logic of the already
         * existing scripts based on the current accepted cookie categories
         */
        var _manageExistingScripts = function(){

            if(!_config.page_scripts) return;

            // get all the scripts with "cookie-category" attribute
            var scripts = document.querySelectorAll('script[' + _config.script_selector + ']');
            var sequential_enabled = _config.page_scripts_order;
            var accepted_categories = saved_cookie_content['level'] || [];
            _log("CookieConsent [SCRIPT_MANAGER]: sequential loading:", sequential_enabled);

            /**
             * Load scripts (sequentially), using a recursive function
             * which loops through the scripts array
             * @param {Element[]} scripts scripts to load
             * @param {number} index current script to load
             */
            var _loadScripts = function(scripts, index){
                if(index < scripts.length){

                    var curr_script = scripts[index];
                    var curr_script_category = curr_script.getAttribute(_config.script_selector);

                    /**
                     * If current script's category is on the array of categories
                     * accepted by the user => load script
                     */
                    if(_inArray(accepted_categories, curr_script_category) > -1){

                        curr_script.type = 'text/javascript';
                        curr_script.removeAttribute(_config.script_selector);

                        // get current script data-src
                        var src = curr_script.getAttribute('data-src');

                        // create fresh script (with the same code)
                        var fresh_script = _createNode('script');
                        fresh_script.textContent = curr_script.innerHTML;

                        // Copy attributes over to the new "revived" script
                        (function(destination, source){
                            var attr, attributes = source.attributes;
                            var len = attributes.length;
                            for(var i=0; i<len; i++){
                                attr = attributes[i];
                                destination.setAttribute(attr.nodeName, attr.nodeValue);
                            }
                        })(fresh_script, curr_script);

                        // set src (if data-src found)
                        src ? (fresh_script.src = src) : (src = curr_script.src);

                        // if script has "src" attribute
                        // try loading it sequentially
                        if(src){
                            if(sequential_enabled){
                                // load script sequentially => the next script will not be loaded
                                // until the current's script onload event triggers
                                if(fresh_script.readyState) {  // only required for IE <9
                                    fresh_script.onreadystatechange = function() {
                                        if (fresh_script.readyState === "loaded" || fresh_script.readyState === "complete" ) {
                                            fresh_script.onreadystatechange = null;
                                            _loadScripts(scripts, ++index);
                                        }
                                    };
                                }else{  // others
                                    fresh_script.onload = function(){
                                        fresh_script.onload = null;
                                        _loadScripts(scripts, ++index);
                                    };
                                }
                            }else{
                                // if sequential option is disabled
                                // treat current script as inline (without onload event)
                                src = false;
                            }
                        }

                        // Replace current "sleeping" script with the new "revived" one
                        curr_script.parentNode.replaceChild(fresh_script, curr_script);

                        /**
                         * If we managed to get here and scr is still set, it means that
                         * the script is loading/loaded sequentially so don't go any further
                         */
                        if(src) return;
                    }

                    // Go to next script right away
                    _loadScripts(scripts, ++index);
                }
            }

            _loadScripts(scripts, 0);
        }

        /**
         * Save custom data inside cookie
         * @param {object|string} new_data
         * @param {string} [mode]
         * @returns {boolean}
         */
        var _setCookieData = function(new_data, mode){

            var set = false;
            /**
             * If mode is 'update':
             * add/update only the specified props.
             */
            if(mode === 'update'){
                data = _cookieconsent.get('data');
                var same_type = typeof data === typeof new_data;

                if(same_type && typeof data === "object"){
                    !data && (data = {});

                    for(var prop in new_data){
                        if(data[prop] !== new_data[prop]){
                            data[prop] = new_data[prop]
                            set = true;
                        }
                    }
                }else if((same_type || !data) && data !== new_data){
                    data = new_data;
                    set = true;
                }
            }else{
                data = new_data;
                set = true;
            }

            if(set){
                saved_cookie_content['data'] = data;
                _setCookie(_config.cookie_name, JSON.stringify(saved_cookie_content));
            }

            return set;
        }

        /**
         * Forcefully set a specific revision and show consent modal
         * @param {number} new_revision
         * @param {boolean} [prompt_consent]
         * @returns {boolean}
         */
        var _setRevision = function(new_revision, prompt_consent, message){

            // If plugin has been initialized and new revision is valid
            if(
                main_container
                && typeof new_revision === "number"
                && saved_cookie_content['revision'] !== new_revision
            ){

                revision_enabled = true;
                revision_message = message;
                valid_revision = false;
                _config.revision = new_revision;

                // Show consent modal ?
                if(prompt_consent === true){
                    _createConsentModal(_conf_params);
                    _guiManager(_conf_params['gui_options'], true);
                    _getModalFocusableData();
                    _cookieconsent.show();
                }else {
                    // If revision was modified, save cookie with the new revision
                    _cookieconsent.accept();
                }

                return true;
            }

            return false;
        }

        /**
         * Helper method to set a variety of fields
         * @param {string} field
         * @param {object} data
         * @returns {boolean}
         */
        _cookieconsent.set = function(field, data){
            switch(field){
                case 'data': return _setCookieData(data['value'], data['mode']);
                case 'revision': return _setRevision(data['value'], data['prompt_consent'], data['message']);
                default: return false;
            }
        }

        /**
         * Retrieve data from existing cookie
         * @param {string} field
         * @param {string} [cookie_name]
         * @returns {any}
         */
        _cookieconsent.get = function(field, cookie_name){
            var cookie = JSON.parse(_getCookie(cookie_name || _config.cookie_name, 'one', true) || "{}");

            return cookie[field];
        }

        /**
         * Read current configuration value
         * @returns {any}
         */
        _cookieconsent.getConfig = function(field){
            return _config[field];
        }

        /**
         * @typedef {object} userPreferences
         * @property {string} accept_type
         * @property {string[]} accepted_categories
         * @property {string[]} rejected_categories
         */

        /**
         * Retrieve current user preferences (summary)
         * @returns {userPreferences}
         */
        _cookieconsent.getUserPreferences = function(){
            return {
                'accept_type': accept_type,
                'accepted_categories': accepted_categories,
                'rejected_categories': rejected_categories
            }
        }

        /**
         * Function which will run after script load
         * @callback scriptLoaded
         */

        /**
         * Dynamically load script (append to head)
         * @param {string} src
         * @param {scriptLoaded} callback
         * @param {string[]} attrs
         */
        _cookieconsent.loadScript = function(src, callback, attrs){

            var function_defined = typeof callback === 'function';

            // Load script only if not already loaded
            if(!document.querySelector('script[src="' + src + '"]')){

                var script = _createNode('script');

                // if an array is provided => add custom attributes
                if(attrs && attrs.length > 0){
                    for(var i=0; i<attrs.length; ++i){
                        attrs[i] && script.setAttribute(attrs[i]['name'], attrs[i]['value']);
                    }
                }

                // if callback function defined => run callback onload
                if(function_defined){
                    if(script.readyState) {  // only required for IE <9
                        script.onreadystatechange = function() {
                            if ( script.readyState === "loaded" || script.readyState === "complete" ) {
                                script.onreadystatechange = null;
                                callback();
                            }
                        };
                    }else{  //Others
                        script.onload = callback;
                    }
                }

                script.src = src;

                /**
                 * Append script to head
                 */
                (document.head ? document.head : document.getElementsByTagName('head')[0]).appendChild(script);
            }else{
                function_defined && callback();
            }
        }

        /**
         * Manage dynamically loaded scripts: https://github.com/orestbida/cookieconsent/issues/101
         * If plugin has already run, call this method to enable
         * the newly added scripts based on currently selected preferences
         */
        _cookieconsent.updateScripts = function(){
            _manageExistingScripts();
        }

        /**
         * Show cookie consent modal (with delay parameter)
         * @param {number} delay
         */
        _cookieconsent.show = function(delay){
            if(consent_modal_exists){
                setTimeout(function() {
                    _addClass(html_dom, "show--consent");

                    /**
                     * Update attributes/internal statuses
                     */
                    consent_modal.setAttribute('aria-hidden', 'false');
                    consent_modal_visible = true;

                    setTimeout(function(){
                        last_elem_before_modal = document.activeElement;
                        current_modal_focusable = consent_modal_focusable;
                    }, 200);

                    _log("CookieConsent [MODAL]: show consent_modal");
                }, delay > 0 ? delay : 0);
            }
        }

        /**
         * Hide consent modal
         */
        _cookieconsent.hide = function(){
            if(consent_modal_exists){
                _removeClass(html_dom, "show--consent");
                consent_modal.setAttribute('aria-hidden', 'true');
                consent_modal_visible = false;

                setTimeout(function(){
                    //restore focus to the last page element which had focus before modal opening
                    last_elem_before_modal.focus();
                    current_modal_focusable = null;
                }, 200);

                _log("CookieConsent [MODAL]: hide");
            }
        }

        /**
         * Hide settings modal
         */
        _cookieconsent.hideSettings = function(){
            _removeClass(html_dom, "show--settings");
            settings_modal_visible = false;
            settings_container.setAttribute('aria-hidden', 'true');


            setTimeout(function(){
                /**
                 * If consent modal is visible, focus him (instead of page document)
                 */
                if(consent_modal_visible){
                    //last_consent_modal_btn_focus && last_consent_modal_btn_focus.focus();
                    current_modal_focusable = consent_modal_focusable;
                }else{
                    /**
                     * Restore focus to last page element which had focus before modal opening
                     */
                    //last_elem_before_modal.focus();
                    current_modal_focusable = null;
                }

                clicked_inside_modal = false;
            }, 200);

            _log("CookieConsent [SETTINGS]: hide settings_modal");
        }

        /**
         * Accept cookieconsent function API
         * @param {string[]|string} _categories - Categories to accept
         * @param {string[]} [_exclusions] - Excluded categories [optional]
         */
        _cookieconsent.accept = function(_categories, _exclusions){
            var categories = _categories || undefined;
            var exclusions = _exclusions || [];
            var to_accept = [];

            /**
             * Get all accepted categories
             * @returns {string[]}
             */
            var _getCurrentPreferences = function(){
                var toggles = document.querySelectorAll('.c-tgl') || [];
                var states = [];

                for(var i=0; i<toggles.length; i++){
                    if(toggles[i].checked){
                        states.push(toggles[i].value);
                    }
                }
                return states;
            }

            if(!categories){
                to_accept = _getCurrentPreferences();
            }else{
                if(
                    typeof categories === "object" &&
                    typeof categories.length === "number"
                ){
                    for(var i=0; i<categories.length; i++){
                        if(_inArray(toggle_categories, categories[i]) !== -1)
                            to_accept.push(categories[i]);
                    }
                }else if(typeof categories === "string"){
                    if(categories === 'all')
                        to_accept = toggle_categories.slice();
                    else{
                        if(_inArray(toggle_categories, categories) !== -1)
                            to_accept.push(categories);
                    }
                }
            }

            // Remove excluded categories
            if(exclusions.length >= 1){
                for(i=0; i<exclusions.length; i++){
                    to_accept = to_accept.filter(function(item) {
                        return item !== exclusions[i]
                    })
                }
            }

            // Add back all the categories set as "readonly/required"
            for(i=0; i<toggle_categories.length; i++){
                if(
                    toggle_readonly[i] === true &&
                    _inArray(to_accept, toggle_categories[i]) === -1
                ){
                    to_accept.push(toggle_categories[i]);
                }
            }

            // save accepted categories
            accepted_categories = to_accept;

            // number of categories marked as necessary/readonly
            var necessary_categories_count = toggle_readonly.filter(function(readonly){
                return readonly === true;
            }).length;

            // save rejected categories
            rejected_categories = toggle_categories.filter(function(category){
                return (_inArray(accepted_categories, category) === -1);
            });

            // set accept type based on accepted/rejected categories
            if(accepted_categories.length === toggle_categories.length)
                accept_type = 'all';
            else if(rejected_categories.length >= 0 && accepted_categories.length === necessary_categories_count)
                accept_type = 'necessary'
            else
                accept_type = 'custom'

            _saveCookiePreferences(to_accept);
        }

        /**
         * API function to easily erase cookies
         * @param {(string|string[])} _cookies
         * @param {string} [_path] - optional
         * @param {string} [_domain] - optional
         */
        _cookieconsent.eraseCookies = function(_cookies, _path, _domain){
            var cookies = [];
            var domains = _domain
                ? [_domain, "."+_domain]
                : [_config.cookie_domain, "."+_config.cookie_domain];

            if(typeof _cookies === "object" && _cookies.length > 0){
                for(var i=0; i<_cookies.length; i++){
                    this.validCookie(_cookies[i]) && cookies.push(_cookies[i]);
                }
            }else{
                this.validCookie(_cookies) && cookies.push(_cookies);
            }

            _eraseCookies(cookies, _path, domains);
        }

        /**
         * Set cookie, by specifying name and value
         * @param {string} name
         * @param {string} value
         */
        var _setCookie = function(name, value) {

            var cookie_expiration = _config.cookie_expiration;

            if(typeof _config.cookie_necessary_only_expiration === 'number' && accept_type === 'necessary')
                cookie_expiration = _config.cookie_necessary_only_expiration;

            value = _config.use_rfc_cookie ? encodeURIComponent(value) : value;

            var date = new Date();
            date.setTime(date.getTime() + (1000 * (cookie_expiration * 24 * 60 * 60)));
            var expires = "; expires=" + date.toUTCString();

            var cookieStr = name + "=" + (value || "") + expires + "; Path=" + _config.cookie_path + ";";
            cookieStr += " SameSite=" + _config.cookie_same_site + ";";

            // assures cookie works with localhost (=> don't specify domain if on localhost)
            if(window.location.hostname.indexOf(".") > -1){
                cookieStr += " Domain=" + _config.cookie_domain + ";";
            }

            if(window.location.protocol === "https:") {
                cookieStr += " Secure;";
            }

            document.cookie = cookieStr;

            _log("CookieConsent [SET_COOKIE]: cookie "+ name + "='" + value + "' was set! Expires after " + cookie_expiration + " days");
        }

        /**
         * Get cookie value by name,
         * returns the cookie value if found (or an array
         * of cookies if filter provided), otherwise empty string: ""
         * @param {string} name
         * @param {string} filter - 'one' or 'all'
         * @param {boolean} get_value - set to true to obtain its value
         * @returns {string|string[]}
         */
        var _getCookie = function(name, filter, get_value) {
            var found;

            if(filter === 'one'){
                found = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
                found = found ? (get_value ? found.pop() : name) : "";

                if(found && name === _config.cookie_name){
                    try{
                        found = JSON.parse(found)
                    }catch(e){
                        try {
                            found = JSON.parse(decodeURIComponent(found))
                        } catch (e) {
                            // if I got here => cookie value is not a valid json string
                            found = {};
                        }
                    }
                    found = JSON.stringify(found);
                }
            }else if(filter === 'all'){
                // array of names of all existing cookies
                var cookies = document.cookie.split(/;\s*/); found = [];
                for(var i=0; i<cookies.length; i++){
                    found.push(cookies[i].split("=")[0]);
                }
            }

            return found;
        }

        /**
         * Delete cookie by name & path
         * @param {string[]} cookies
         * @param {string} [custom_path] - optional
         * @param {string[]} domains - example: ['domain.com', '.domain.com']
         */
        var _eraseCookies = function(cookies, custom_path, domains) {
            var path = custom_path ? custom_path : '/';
            var expires = 'Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            for(var i=0; i<cookies.length; i++){
                for(var j=0; j<domains.length; j++){
                    document.cookie = cookies[i] + '=; path=' + path +
                    (domains[j].indexOf('.') > -1 ? '; domain=' + domains[j] : "") + '; ' + expires;
                }
                _log("CookieConsent [AUTOCLEAR]: deleting cookie: '" + cookies[i] + "' path: '" + path + "' domain:", domains);
            }
        }

        /**
         * Returns true if cookie was found and has valid value (not empty string)
         * @param {string} cookie_name
         * @returns {boolean}
         */
        _cookieconsent.validCookie = function(cookie_name){
            return _getCookie(cookie_name, 'one', true) !== "";
        }

        /**
         * Function to run when event is fired
         * @callback eventFired
         */

        /**
         * Add event listener to dom object (cross browser function)
         * @param {Element} elem
         * @param {string} event
         * @param {eventFired} fn
         * @param {boolean} passive
         */
        var _addEvent = function(elem, event, fn, _passive) {
            var passive = _passive === true;

            if (elem.addEventListener) {
                passive ? elem.addEventListener(event, fn , { passive: true }) : elem.addEventListener(event, fn, false);
            } else {
                /**
                 * For old browser, add 'on' before event:
                 * 'click':=> 'onclick'
                 */
                elem.attachEvent("on" + event, fn);
            }
        }

        /**
         * Get all prop. keys defined inside object
         * @param {Object} obj
         */
        var _getKeys = function(obj){
            if(typeof obj === "object"){
                var keys = [], i = 0;
                for (keys[i++] in obj);
                return keys;
            }
        }

        /**
         * Append class to the specified dom element
         * @param {HTMLElement} elem
         * @param {string} classname
         */
        var _addClass = function (elem, classname){
            if(elem.classList)
                elem.classList.add(classname)
            else{
                if(!_hasClass(elem, classname))
                    elem.className += ' '+classname;
            }
        }

        /**
         * Remove specified class from dom element
         * @param {HTMLElement} elem
         * @param {string} classname
         */
        var _removeClass = function (el, className) {
            el.classList ? el.classList.remove(className) : el.className = el.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' ');
        }

        /**
         * Check if html element has class
         * @param {HTMLElement} el
         * @param {string} className
         */
        var _hasClass = function(el, className) {
            if (el.classList) {
                return el.classList.contains(className);
            }
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        }

        return _cookieconsent;
    };

    var init = 'initCookieConsent';
    /**
     * Make CookieConsent object accessible globally
     */
    if(typeof window[init] !== 'function'){
        window[init] = CookieConsent
    }
})();