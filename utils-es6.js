((global) => {
  const utils = {};

  // bind
  utils.bind = (element, key, callback) => {
    const strategies = {
      shift: 'shiftKey',
      tab: 9,
      enter: 13,
    };

    if (!element.bindKeys) {
      element.bindKeys = {};
    }

    element.bindKeys[key] = (e) => {
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

    element.addEventListener('keydown', element.bindKeys[key]);

    return this;
  };

  // unbind
  utils.unbind = (element, key, callback) => {
    if (element.bindKeys[key]) {
      element.removeEventListener('keydown', element.bindKeys[key]);
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
  utils.save = () => localStorage.setItem('save', this.table.export());

  // enableLoadData
  utils.enableLoadData = () => localStorage.getItem('save');

  if (!global.utils) {
    global.utils = utils;
  }
})(window, window.table);
