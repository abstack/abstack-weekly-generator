((global) => {
  const utils = {};

  // bind
  utils.bind = (element, key, callback) => {
    const strategies = {
      shift: 'shiftKey',
      tab: 9,
      enter: 13,
    };

    if (!element.bindButton) {
      element.bindButton = {};
    }

    element.bindButton[key] = (e) => {
      const keys = key.split('+');
      const ev = e || window.event;
      let temp = true;
      let i;
      let strategy;

      for (i in strategies) {
        if (strategies.hasOwnProperty(i)) {
          strategy = strategies[i];
          if (keys.indexOf(i) > -1) {
            if (typeof(strategy) === 'number' && strategy !== ev.keyCode) {
              temp = false;
            } else if (typeof(strategy) === 'string' && !ev[strategy]) {
              temp = false;
            }
          } else if (typeof(strategy) === 'string' && ev[strategy]) {
            temp = false;
          }
        }
      }

      if (temp && callback) {
        callback.call(this, ev);
      }
    };

    element.addEventListener('keydown', element.bindButton[key]);

    return this;
  };

  // unbind
  utils.unbind = (element, key, callback) => {
    if (element.bindButton[key]) {
      element.removeEventListener('keydown', element.bindButton[key]);
      if (callback) {
        callback.call(this);
      }
    }

    return this;
  };

  // copyElement
  utils.copyElement = (element) => {
    const customAlert = alert;
    const range = document.createRange();
    range.selectNodeContents(element);
    window.getSelection().addRange(range);

    try {
      const style = document.execCommand('copy');
      customAlert(`拷贝${style === true ? '成功' : '失败'}`);
    } catch (err) {
      customAlert('不能拷贝');
    }

    window.getSelection().removeAllRanges();
  };

  // enableAutoSave
  utils.enableAutoSave = (gap) => {
    setInterval(() => {
      localStorage.setItem('save', table.export());
    }, gap * 1000);
  };

  // enableLoadData
  utils.enableLoadData = () => {
    const customStorage = localStorage;
    return customStorage.getItem('save');
  };

  if (!global.utils) {
    global.utils = utils;
  }
})(window);
