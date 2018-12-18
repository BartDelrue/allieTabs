(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.allieTabs = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var changeTab = function changeTab(tab, tabs, tabpanels, component, init) {
    for (var i = tabs.length; i > 0; i--) {
      tabs[i - 1].setAttribute('aria-selected', false);
      tabs[i - 1].tabIndex = -1;
    }

    tab.setAttribute('aria-selected', true);
    tab.tabIndex = 0;

    for (var _i = tabpanels.length; _i > 0; _i--) {
      tabpanels[_i - 1].setAttribute('aria-hidden', true);
    }

    var tabpanel = component.querySelector(tab.hash);
    if (tabpanel) {
      tabpanel.setAttribute('aria-hidden', false);

      if (!init) {
        if (window.history && history.replaceState) {
          history.replaceState(null, null, tab.hash);
        } else {
          window.location.hash = tab.hash;
        }
        tab.focus();
      }
    }
  };

  var handleKeyboardInput = function handleKeyboardInput(e, tabs) {
    var keyCode = e.keyCode || e.which;
    var tab = e.target;

    var next = function next() {
      for (var i = tabs.length; i > 0; i--) {
        if (tabs[i - 1] === tab) {
          e.preventDefault();
          var _tab = tabs[i] ? tabs[i] : tabs[0];
          _tab.focus();
          _tab.click();
        }
      }
    };

    var previous = function previous() {
      for (var i = tabs.length; i > 0; i--) {
        if (tabs[i - 1] === tab) {
          var _tab2 = tabs[i - 2] ? tabs[i - 2] : tabs[tabs.length - 1];
          e.preventDefault();
          _tab2.focus();
          _tab2.click();
        }
      }
    };

    var end = function end() {
      e.preventDefault();
      tabs[tabs.length - 1].focus();
      tabs[tabs.length - 1].click();
    };

    var home = function home() {
      e.preventDefault();
      tabs[0].focus();
      tabs[0].click();
    };

    var setfocus = function setfocus() {
      var tabpanel = document.querySelector(tab.hash);
      if (tabpanel && !e.shiftKey) {
        e.preventDefault();
        if (window.history && history.replaceState) {
          history.replaceState(null, null, tab.hash);
        } else {
          window.location.hash = tab.hash;
        }
      }
    };

    switch (keyCode) {
      case 37:
        previous();
        break;
      case 38:
        previous();
        break;
      case 40:
        next();
        break;
      case 39:
        next();
        break;
      case 36:
        home();
        break;
      case 35:
        end();
        break;
      case 13:
        setfocus();
        break;
    }
  };

  var init = exports.init = function init(component, options) {

    if (!component) {
      return;
    }

    options = options || {};

    var hash = window.location.hash;
    var tablist = component.querySelector('ul[role=tablist]');
    var tabs = tablist.querySelectorAll('li[role=presentation]>a[role=tab]');
    var tabpanels = component.querySelectorAll('[role=tabpanel]');

    if (options.class) {
      component.classList.add(options.class);
    }

    for (var i = tabs.length; i > 0; i--) {
      tabs[i - 1].setAttribute('aria-selected', false);
      tabs[i - 1].setAttribute('aria-controls', tabs[i - 1].hash.substr(1));
      tabs[i - 1].addEventListener('click', function (e) {
        e.preventDefault();
        changeTab(e.target, tabs, tabpanels, component);
      });
      tabs[i - 1].addEventListener('keydown', function (e) {
        handleKeyboardInput(e, tabs);
      });
    }

    for (var _i2 = tabpanels.length; _i2 > 0; _i2--) {
      tabpanels[_i2 - 1].setAttribute('aria-hidden', true);
      tabpanels[_i2 - 1].setAttribute('tabindex', '-1');
    }

    if (hash) {
      var tab = tablist.querySelector('[href="' + hash + '"]');

      if (tab) {
        tab.click();
      } else {
        changeTab(tabs[0], tabs, tabpanels, component, true);
      }
    } else {
      changeTab(tabs[0], tabs, tabpanels, component, true);
    }

    window.addEventListener('hashchange', function () {
      var tab = tablist.querySelector('[href="' + window.location.hash + '"]');
      if (tab) {
        tab.click();
      }

      var panel = component.querySelector(window.location.hash);
      if (panel) {
        panel.focus();
      }
    });
  };

  var components = document.querySelectorAll('[data-tabs]');

  for (var i = components.length; i > 0; i--) {
    init(components[i - 1], { class: 'allie-tabs' });
  }
});

