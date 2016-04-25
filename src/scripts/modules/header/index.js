'use strict';

import $gfwdom from '../../facade';
import utils from '../../utils';

import headerTpl from './header.tpl';
import headerIconsTpl from './header-icons.tpl';

import LoginButton from '../my-gfw/login-button';
import Navigation from '../navigation';

/**
 * Header
 * @param  {window} root
 * @return {Class}
 */
class Header {

  constructor() {
    this.el = document.getElementById('headerGfw');
    if (!this.el) {
      throw new Error('element #headerGfw doesn\'t exist');
    }
    this.render();
  }

  render() {
    this.el.innerHTML = headerTpl() + headerIconsTpl();
    this.cache();

    this.setParams();

    this.initHighlightCurrent();
    this.initListeners();

    this.initTranslate();
    
    this.initLinksUrls();
    this.initMyGFW();
    this.initNavigation();

    return this;
  }

  /**
   * Cache all the elements that we will use after
   */
  cache() {
    this.$document =  $gfwdom(document);

    // Script
    this.$script = $gfwdom('#loader-gfw');

    // Html-body
    this.$htmlbody = $gfwdom('html,body');

    // Header
    this.$header = $gfwdom('#headerGfw');
    this.$headerSubmenu = this.$header.find('.m-header-submenu');
    this.$headerSubmenuBtns = this.$header.find('.m-header-submenu-btn');
    this.$headerSubmenuApp = this.$header.find('#submenuApps');
    this.$headerSubmenuMore = this.$header.find('#submenuMore');

    // Links
    this.$links = this.$header.find('a');
    this.$linksSubmenu = this.$header.find('a');

    // Search
    this.$headerSearchBox = this.$header.find('#headerSearchBox');
    this.$headerSearch = this.$header.find('.m-search');
    this.$headerSearchInput = this.$header.find('#search-input');
  };

  /**
   * Set Params
   */
  setParams() {
    this.params = {
      current: this.$script.data('current')
    }
  }

  /**
   * Set current depending on the script data current
   */
  initHighlightCurrent() {
    this.$header.find(this.params.current).addClass('-current');
  }

  /**
   * Events
   * - showMenu(),
   * - hideMenus()
   * - toggleSearch()
   */
  initListeners() {
    // Mobile menus
    this.$header.on('click', '.m-header-submenu-btn', this.showMenu.bind(this));
    this.$header.on('click', '.m-header-backdrop', this.hideMenus.bind(this));
    this.$header.on('click', '.m-apps-close', this.hideMenus.bind(this));
    
    this.$header.on('click', '.btn-search', this.toggleSearch.bind(this));
  }

  showMenu(e) {
    e && e.preventDefault();

    if (!$gfwdom(e.currentTarget).hasClass('-active')) {
      // Hide all the opened menus
      this.hideMenus();
      // Prevent mobile scroll
      this.$htmlbody.toggleClass('-no-scroll');
      // Active menu icon
      $gfwdom(e.currentTarget).toggleClass('-active')
      $gfwdom(e.currentTarget).find('svg').toggleClass('-inactive');
      // Active menu
      $gfwdom($gfwdom(e.currentTarget).data('submenu')).toggleClass('-active');

      // Key bindings
      this.$document.on('keyup.apps', e => {
        if (e.keyCode === 27) {
          this.hideMenus();
        }
      });

    } else {
      this.hideMenus();
    }
  }

  hideMenus(e) {
    // Allow mobile scroll
    this.$htmlbody.removeClass('-no-scroll');
    this.$headerSubmenu.removeClass('-active');
    this.$headerSubmenuApp.removeClass('-active');
    this.$headerSubmenuMore.removeClass('-active');
    this.$headerSubmenuBtns.forEach(function(v){
      if ($gfwdom(v).hasClass('-active')) {
        $gfwdom(v).removeClass('-active')
        $gfwdom(v).find('svg').toggleClass('-inactive');
      }
    });
    // Key bindings
    this.$document.off('keyup.apps');    
  }

  toggleSearch(e) {
    e && e.preventDefault();

    // Toggle search div
    this.$headerSearch.toggleClass('-active');

    if(this.$headerSearch.hasClass('-active')) {
      this.$headerSearchBox.addClass('-active');
      // Key bindings
      this.$document.on('keyup.search', e => {
        if (e.keyCode === 27) {
          this.toggleSearch();
        }
      });
      // Focus input. As it has an animation we need to set a timeout
      setTimeout(function(){
        document.getElementById(this.$headerSearchInput[0].id).focus();
      }.bind(this),250)
    } else {
      this.$headerSearchBox.removeClass('-active');
      // Key unbindings
      this.$document.off('keyup.search');
    }
  }

  /**
   * Google translate
   */
  initTranslate() {
    if (!!window.liveSettings) {
      this.initTransifex();
    } else {
      this.initGoogleTranslate();  
    }
  };

  initGoogleTranslate() {
    setTimeout(() => {
      window['googleTranslateElementInitGFW'] = () => {
        new google.translate.TranslateElement({
          pageLanguage: '',
          includedLanguages: 'ar,es,en,fr,id,pt,ru,zh-CN,de,uk,ro,tr,it,hi,km',
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },'googleTranslate');
      }

      const translateScript = document.createElement('script');
      translateScript.type= 'text/javascript';
      translateScript.src = 'http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInitGFW';
      document.head.appendChild(translateScript);
    }, 0);    
  }

  /**
   * Transifex
   */  
  initTransifex() {
    var blacklist = [
      'www.globalforestwatch.org'
    ];
    // LIVE SETTINGS OPTIONS
    window.liveSettings = {
      picker: '#transifexTranslateElement',
      api_key: "9eda410a7db74687ba40771c56abd357",
      detectlang: false

      // api_key: "<key>",
      // picker: "top-left|top-right|bottom-left|bottom-right|#id",
      // detectlang: true|false|function() { return lang-code; },
      // version: 'latest|<version>',
      // autocollect: true|false,
      // dynamic: true|false,
      // staging: true|false,
      // parse_attr: ["attr1", "attr2", ...],
      // ignore_tags: ["tag1", "tag2", ...],
      // ignore_class: ["classname1", "classname2"]

    };

    // Check if the location.hostname is in the blacklist
    // If true hide transifex element, but keep it working to store the string of the page
    // Then init Google translate plugin
    if (blacklist.indexOf(location.hostname) != -1){
      var $transifexEl = $gfwdom('#transifexTranslateElement');
      $transifexEl.css({
        display: 'none'
      });
      this.initGoogleTranslate();
    }

    setTimeout(() => {
      const translateScript = document.createElement('script');
      translateScript.type= 'text/javascript';
      translateScript.src = '//cdn.transifex.com/live.js';
      document.head.appendChild(translateScript);
    }, 0);
  };



  /**
   * We need to make a difference between local, staging and PRO environment urls.
   * Also we need to have a default value for the external applications
   */
  initLinksUrls() {
    this.params.targets = !utils.isDefaultHost();
    this.params.hostname = utils.getHost();

    this.$links.forEach(function(v) {
      const href = $gfwdom(v).attr('href');
      if (href.charAt(0) == '/') {
        $gfwdom(v).attr('href', this.params.hostname + href);
      }
    }.bind(this));

    this.$linksSubmenu.forEach(v => {
      const external = $gfwdom(v).hasClass('external-link');
      if (this.params.targets) {
        (!!external) ? $gfwdom(v).removeAttr('target') : $gfwdom(v).attr('target','_blank');
      }
    });
  }

  /**
   * Init My GFW
   */
  initMyGFW() {
    if (utils.isDefaultHost()) {
      const loginButton = new LoginButton();
      loginButton.init();
    } else {
      $gfwdom('#my-gfw-container').css({ display: 'none'});
    }
  }

  initNavigation() {
    new Navigation();
  }


}

export default Header;
