/*global define, amplify, console*/
define([
    "jquery",
    "require",
    "amplify",
    "bootstrap"
], function ($, Require) {

    'use strict';

    var defaultOptions = {
        container: 'body',
        url: 'fx-menu/config/default.json',
        config: null,
        hiddens: [],
        template: 'fx-menu/templates/blank.html',
        selectors: {
            brand: ".navbar-brand",
            ul: ".fx-ul",
            right: ".fx-ul-right"
        },
        logo: true,
        lang: "EN",
        css: 'fx-menu/css/fenix-menu.css',
        eventPrefix: 'fx.menu.'
    };

    function FM(o) {
        this.refresh(o);
    }

    FM.prototype.refresh = function (o) {

        this.o = $.extend(true, {}, defaultOptions, o);

        //default: EN
        this.o.lang = this.o.lang.toUpperCase();

        if (this.o.conf) {
            this.render();
        } else {
            this.loadConfiguration();
        }
    };

    FM.prototype.loadConfiguration = function () {

        var self = this;

        if (this.o.config) {
            self.o.conf = self.o.config;
            self.render();
        } else {
            $.getJSON(this.o.url, function (data) {
                self.o.conf = data;
                self.render();
            }).error(function () {
                throw new Error('FENIX Menu: please specify a valid configuration file.');
            });
        }
    };

    FM.prototype.render = function () {

        //Init auxiliary variables
        this.initVariables();

        //Reset menu. Useful if the menu configuration has to change dynamically
        this.resetMenu();
        this.resetBreadcrumb();

        //Render the menu
        this.$container.prepend(this.compileTemplate());

        this.initializeMenu();

        //disable items
        this.disable(this.o.disable || []);

        //Select an item
        this.selectCurrentItem();

        //Auto import the CSS in the page
        if (this.o.hasOwnProperty('importCss') && this.o.importCss === true) {
            this.importCss();
        }

        // Create breadcrumb
        if (this.o.hasOwnProperty('breadcrumb') && this.o.breadcrumb.active === true) {
            this.renderBreadcrumb();
        }

        // Create footer menu
        if (this.o.hasOwnProperty('footer') && this.o.footer.active === true) {
            this.renderFooterMenu();
        }


        if (this.o.hasOwnProperty('callback') && typeof this.o.callback === 'function') {
            this.o.callback();
        }

    };

    FM.prototype.initVariables = function () {

        var that = this,
            url = this.o.template || defaultOptions.template;

        if (typeof url === 'string') {
            url = Require.toUrl(url);
            $.ajax({
                url: url,
                async: false,
                success: function (html) {
                    that.$template = $(html);
                }
            });
        }
        else
            this.$template = $(this.o.template);

        this.$ul = this.$template.find(this.o.selectors.ul);
        this.$brand = this.$template.find(this.o.selectors.brand);
        this.$right = this.$template.find(this.o.selectors.right);

        if (this.o.template instanceof $)
            this.$container = this.o.template.parent();
        else
            this.$container = $(this.o.container);
    };

    FM.prototype.resetMenu = function () {

        this.$ul.empty();
        this.$right.empty();

        if (this.o.container !== 'body') {
            this.$container.empty();
        } else {
            var selector = this.o.className ? 'nav.fx-menu.' + this.o.className : 'nav.fx-menu';
            $('body').find(selector).remove();
        }
    };

    FM.prototype.resetBreadcrumb = function () {
        if (this.o.breadcrumb && this.o.breadcrumb.container) {
            $(this.o.breadcrumb.container).empty();
        }

    };

    FM.prototype.importCss = function () {

        if (this.o.css && this.o.css !== null) {
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = Require.toUrl(this.o.css);
            document.getElementsByTagName("head")[0].appendChild(link);
        }
    };

    FM.prototype.compileTemplate = function () {

        this.customizeMenu();
        this.renderBrand();
        this.renderItems(this.$ul, this.o.conf.items);
        this.renderLeftItems();
        this.renderItems(this.$right, this.o.conf.rightItems);
        this.renderLanguagePicker();
        this.renderMenuType();

        return this.$template;
    };

    FM.prototype.customizeMenu = function () {

        if (!window.fx_menu_counter) {
            window.fx_menu_counter = 0;
        }

        var klass = this.o.className ? this.o.className : (window.fx_menu_counter++);

        this.$template.addClass(klass);
        this.$template.find('[data-target="#fx-navbar-collapse"]').attr('data-target', "#fx-navbar-collapse".concat(klass));
        this.$template.find('#fx-navbar-collapse').attr('id', "fx-navbar-collapse".concat(klass));

        return this.$template;
    };

    FM.prototype.renderMenuType = function () {

        switch (this.o.conf.type) {
            case 'fixed-top':
                this.$template.addClass('navbar-fixed-top');
                break;
            case 'fixed-bottom':
                this.$template.addClass('navbar-fixed-bottom');
                break;
            case 'inverse':
                this.$template.addClass('navbar-inverse');
                break;
            case 'sidemenu':
                this.$template.addClass('sidemenu');
                break;
            default:
                this.$template.addClass('navbar-static-top');
                break;
        }
    };

    FM.prototype.initializeMenu = function () {

        this.$container.find('ul.dropdown-menu [data-toggle=dropdown]').on('click', function (event) {
            // Avoid following the href location when clicking
            event.preventDefault();
            // Avoid having the menu to close when clicking
            event.stopPropagation();
            // If a menu is already open we close it
            //$('ul.dropdown-menu [data-toggle=dropdown]').parent().removeClass('open');
            // opening the one you clicked on
            $(this).parent().addClass('open');

            var menu = $(this).parent().find("ul");
            var menupos = menu.offset(),
                newpos;

            if ((menupos.left + menu.width()) + 30 > $(window).width()) {
                newpos = -menu.width();
            } else {
                newpos = $(this).parent().width();
            }
            menu.css({left: newpos});

        });

    };

    FM.prototype.renderItems = function ($ul, items) {

        var self = this;
        $(items).each(function (index, item) {
            if (self.o.hiddens.indexOf(item.attrs.id) === -1) {
                self.renderItem($ul, item);
            }

        });
    };

    FM.prototype.renderItem = function ($container, item, submenu) {

        switch (item.type) {
            case 'dropdown':
                this.renderDropdown($container, item, submenu);
                break;
            case 'divider':
                this.renderDivider($container);
                break;
            default:
                this.renderSingleItem($container, item);
                break;
        }
    };

    FM.prototype.renderSingleItem = function ($container, item) {

        var $li = $("<li></li>"),
            $a = $('<a>' + item.label[this.o.lang] + '</a>');

        if (item.target) {
            $a.attr('href', item.target);
        }

        this.addItemAttrs($li, item);

        this.addAAttrs($a, item);

        $a.on('click', $.proxy(function () {
            var topic = this.o.eventPrefix;

            if (item.hasOwnProperty('attrs')) {
                topic += item.attrs.id ? item.attrs.id : 'item';
            }

            amplify.publish(topic, item);
        }, this));

        $li.append($a);
        $container.append($li);
    };

    FM.prototype.renderDropdown = function ($ul, item, submenu) {

        var self = this;

        var $li = $('<li class="dropdown"></li>'),
            $a = $('<a href="#" class="dropdown-toggle" data-toggle="dropdown">' + item.label[this.o.lang] + '</b></a>'),
            $children = $('<ul class="dropdown-menu"></ul>');

        if (submenu === true) {
            $li.addClass('dropdown-submenu');
        } else {
            $a.append($('<b class="caret">'));
        }

        $li.append($a).append($children);

        //Append dropdown children
        if (item.hasOwnProperty('children') && item.children !== null) {
            for (var i = 0; i < item.children.length; i++) {

                self.renderItem($children, item.children[i], true);
            }
        }

        this.addItemAttrs($li, item);
        $ul.append($li);
    };

    FM.prototype.renderDivider = function ($container) {

        $container.append('<li class="divider"></li>');
    };

    FM.prototype.addItemAttrs = function ($item, conf) {

        if (conf.hasOwnProperty('attrs')) {
            var attrs = Object.keys(conf.attrs);

            for (var i = 0; i < attrs.length; i++) {
                if (conf.attrs.hasOwnProperty(attrs[i])) {
                    $item.attr(attrs[i], conf.attrs[attrs[i]]);
                }
            }
        }

        return $item;
    };

    FM.prototype.addAAttrs = function ($a, conf) {

        if (conf.hasOwnProperty('a_attrs')) {

            var attrs = Object.keys(conf.a_attrs);

            for (var i = 0; i < attrs.length; i++) {
                if (conf.a_attrs.hasOwnProperty(attrs[i])) {
                    $a.attr(attrs[i], conf.a_attrs[attrs[i]]);
                }
            }
        }

        return $a;
    };

    FM.prototype.renderBrand = function () {

        if (this.o.conf.brand && this.o.logo) {
            this.$brand.attr('href', this.o.conf.brand.target || '#');
            if (this.o.conf.brand.url) {
                this.$brand.css('background-image', 'url(' + this.o.conf.brand.url + ')');
            }
        } else {
            this.$brand.hide();
        }

        return this.$template;
    };

    FM.prototype.renderLeftItems = function () {

        /* if (this.o.conf.left) {

         }*/

        return this.$template;
    };

    FM.prototype.renderLanguagePicker = function () {

        var $li = $('<li class="lang_picker_holder"></li>'),
            $langPicker = $('<ul class="lang_picker"></ul>');

        if (this.o.conf.languages) {
            $(this.o.conf.languages).each(function (index, lang) {
                var $lang = $("<li></li>"),
                    $a = $('<a href="' + (lang.target || '#') + '">' + lang.label + '</a>');
                $lang.prepend($a);
                $langPicker.prepend($lang);
            });
        }

        this.$right.append($li.append($langPicker));
        return this.$template;
    };

    FM.prototype.selectCurrentItem = function () {

        //reset selection
        this.$template.find('li.active').removeClass('active');

        if (this.o.active) {
            this.$template.find('li[id="' + this.o.active + '"] ').addClass("active");
        } else {
            if (this.o.conf.active) {
                this.$template.find('li[id="' + this.o.conf.active + '"] ').addClass("active");
            }
        }

        return this.$template;
    };

    FM.prototype.select = function (s) {

        this.restoreCurrentItemLink();

        this.o.active = s;

        this.selectCurrentItem();

        $('body').attr('data-page', this.o.active);

        // Update breadcrumb
        if (this.o.hasOwnProperty('breadcrumb') && this.o.breadcrumb.active === true) {
            //this.renderBreadcrumb();
        }
    };

    FM.prototype.findObjById = function (id) {

        if (!this.o || !this.o.conf || !this.o.conf.items) {
            return;
        }

        var items = this.o.conf.items;

        for (var i = 0; i < items.length; i++) {

            if (items[i].hasOwnProperty('attrs') && items[i].attrs.id === id) {
                return items[i];
            }
        }
    };

    FM.prototype.restoreCurrentItemLink = function () {

        var $currentLi = this.findActiveHTMLItem(),
            currentObj = this.findObjById(this.o.active);

        if ($currentLi.length === 0 || !currentObj) {
            return;
        }

        return $currentLi.find('a').attr("href", currentObj.target);
    };

    FM.prototype.findActiveHTMLItem = function () {

        if (!this.$template) {
            return;
        }

        return this.o.active !== '' ? this.$template.find('li[id=' + this.o.active + ']') : this.$template.find('li.active');
    };

    FM.prototype.disableItem = function (item) {

        this.$template.find('li[id="' + item + '"] ').addClass("disabled");
    };

    FM.prototype.disable = function (items) {

        if (Array.isArray(items)) {
            for (var i = 0; i < items.length; i++) {
                this.disableItem(items[i]);
            }
        } else {
            this.disableItem(items);
        }

        this.$template.find("li.disabled").on('click', function (e) {
            e.preventDefault();
            return false;
        });
    };

    FM.prototype.activateItem = function (item) {

        this.$template.find('li[id="' + item + '"] ').removeClass("disabled");
    };

    FM.prototype.activate = function (items) {

        if (Array.isArray(items)) {
            for (var i = 0; i < items.length; i++) {
                this.activateItem(items[i]);
            }
        } else {
            this.activateItem(items);
        }

        //select all li elements that have NOT the disabled class
        this.$template.find("li:not(.disabled)").off('click');
    };

    //Breadcrumb

    FM.prototype.renderBreadcrumb = function () {

        if (!this.o.breadcrumb.hasOwnProperty('container') || $(this.o.breadcrumb.container).length === 0) {
            console.error("FENIX menu: impossible to find breadcrumb container");
            return;
        }

        this.findActivePath({
            items: this.o.conf.items,
            callback: $.proxy(this.addItemsToBreadcrumb, this),
            path: []
        });
    };

    FM.prototype.findActivePath = function (obj) {

        var self = this;

        if (Array.isArray(obj.items)) {
            $(obj.items).each(function (index, item) {

                var o = $.extend(true, {}, obj);
                o.path.push(item);

                if (item.hasOwnProperty("attrs") && item.attrs.id === self.o.active) {
                    o.callback(o.path);
                } else {
                    if (item.hasOwnProperty('children')) {
                        o.items = item.children;
                        self.findActivePath(o);
                    }
                }
            });
        }
    };

    FM.prototype.addItemsToBreadcrumb = function (path) {

        var self = this;

        this.$brList = $('<ol>', {
            'class': 'breadcrumb'
        });

        $(this.o.breadcrumb.container).empty();
        $(this.o.breadcrumb.container).html(this.$brList);

        //Show always a link to home
        if (this.o.breadcrumb.showHome === true) {
            this.$brList.append($('<li><a href="./index.html"><i class="fa fa-home"></i></a></li>'));
        }

        if (Array.isArray(path)) {
            for (var i = 0; i < path.length; i++) {
                self.appendBreadcrumbItem(path[i], (i === path.length));
            }
        }

    };

    FM.prototype.appendBreadcrumbItem = function (item, isLast) {

        var $li = $('<li>'),
            $a = $('<a>', {
                href: isLast ? '#' : item.target,
                'class': isLast ? 'active' : '',
                text: item.breadcrumbLabel ? item.breadcrumbLabel[this.o.lang] : item.label[this.o.lang]
            });

        this.$brList.append($li.append($a));
    };

    //Footer

    FM.prototype.renderFooterMenu = function () {

        var self = this;

        if (!this.o.footer.hasOwnProperty('container') || $(this.o.footer.container).length === 0) {
            console.error("FENIX menu: impossible to find footer container");
            return;
        }

        this.$footerContainer = $('<ul>');

        $(this.o.conf.items).each(function (index, item) {
            // if there is any children , show the first level of them
            if (item.children) {

                $.each(item.children, function (indexChild, itemChild) {
                    self.checkAndAppendInFooter(itemChild);
                });
            }
            else {
                self.checkAndAppendInFooter(item);
            }
        });

        $(this.o.footer.container).empty();
        $(this.o.footer.container).append(this.$footerContainer);

    };

    FM.prototype.checkAndAppendInFooter = function (item) {
        if (this.o.hiddens.indexOf(item.attrs.id) === -1) {
            this.appendFooterItem(item, (item === this.o.conf.items.length));
        }
    };

    FM.prototype.appendFooterItem = function (item, isLast) {

        var $li = $('<li>'),
            $a = $('<a>', {
                href: item.target,
                'class': isLast ? 'active' : '',
                text: item.label[this.o.lang]
            });

        this.$footerContainer.append($li.append($a));

    };

    return FM;
});