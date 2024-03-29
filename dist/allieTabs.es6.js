const _changeTab = (tab, tabs, tabpanels, component, init) => {
  for (let i = tabs.length; i > 0; i--) {
    tabs[i - 1].setAttribute('aria-selected', false);
    tabs[i - 1].tabIndex = -1;
  }
  tab.setAttribute('aria-selected', true);
  tab.tabIndex = 0;
  for (let i = tabpanels.length; i > 0; i--) {
    tabpanels[i - 1].setAttribute('aria-hidden', true);
  }
  let tabpanel = component.querySelector(tab.hash);
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
const _handleKeyboardInput = (e, tabs) => {
  const keyCode = e.keyCode || e.which;
  const tab = e.target;
  const next = () => {
    for (let i = tabs.length; i > 0; i--) {
      if (tabs[i - 1] === tab) {
        e.preventDefault();
        let tab = tabs[i] ? tabs[i] : tabs[0];
        tab.focus();
        tab.click();
      }
    }
  };
  const previous = () => {
    for (let i = tabs.length; i > 0; i--) {
      if (tabs[i - 1] === tab) {
        let tab = tabs[i - 2] ? tabs[i - 2] : tabs[tabs.length - 1];
        e.preventDefault();
        tab.focus();
        tab.click();
      }
    }
  };
  const end = () => {
    e.preventDefault();
    tabs[tabs.length - 1].focus();
    tabs[tabs.length - 1].click();
  };
  const home = () => {
    e.preventDefault();
    tabs[0].focus();
    tabs[0].click();
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
  }
};
export const init = (component, options) => {
  if (!component) {
    return;
  }
  options = options || {};
  let changeTab = options.changeTab || _changeTab;
  let handleKeyboardInput = options.handleKeyboardInput || _handleKeyboardInput;
  let hash = window.location.hash;
  let tablist = component.querySelector('[role=tablist]');
  let tabs = tablist.querySelectorAll('[role=tab]');
  let tabpanels = component.querySelectorAll('[role=tabpanel]');
  if (options.class) {
    component.classList.add(options.class);
  }
  for (let i = tabs.length; i > 0; i--) {
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
  for (let i = tabpanels.length; i > 0; i--) {
    tabpanels[i - 1].setAttribute('aria-hidden', true);
    tabpanels[i - 1].setAttribute('tabindex', '-1');
  }
  if (hash) {
    let tab = tablist.querySelector('[href="' + hash + '"]');
    if (tab) {
      tab.click();
    } else {
      changeTab(tabs[0], tabs, tabpanels, component, true);
    }
  } else {
    changeTab(tabs[0], tabs, tabpanels, component, true);
  }
  window.addEventListener('hashchange', function () {
    const tab = tablist.querySelector('[href="' + window.location.hash + '"]');
    if (tab) {
      tab.click();
    }
    const panel = component.querySelector(window.location.hash);
    if (panel) {
      panel.focus();
    }
  });
};
let components = document.querySelectorAll('[data-tabs]');
for (let i = components.length; i > 0; i--) {
  init(components[i - 1], {
    class: 'allie-tabs'
  });
}

