const utils = {};

/**
 * 快捷键绑定
 * @param  {DOM}      element  绑定元素
 * @param  {String}   key      绑定按键，形如 'shift+tab'
 * @param  {Function} callback 回调函数
 * @return {Object}            链式操作
 */
utils.bind = (element, key, callback) => {
  const strategies = {
    shift: 'shiftKey',
    tab: 9,
    enter: 13,
    backspace: 8,
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

/**
 * 快捷键解绑
 * @param  {DOM}      element  绑定元素
 * @param  {String}   key      绑定按键，形如 'shift+tab'
 * @param  {Function} callback 回调函数
 * @return {Object}            链式操作
 */
utils.unbind = (element, key, callback) => {
  if (element.bindKeys[key]) {
    element.removeEventListener('keydown', element.bindKeys[key]);
    if (callback) {
      callback.call(this);
    }
  }

  return this;
};

/**
 * 复制元素
 * @param  {DOM}      element  绑定元素
 */
utils.copyElement = (element) => {
  const customAlert = alert;
  let range = null;

  // 创建tr
  const table = document.getElementsByTagName('table');
  const newTr = document.createElement('tr');
  table[table.length - 1].appendChild(newTr);

  window.getSelection().removeAllRanges();
  range = document.createRange();
  range.selectNodeContents(element);
  window.getSelection().addRange(range);

  try {
    const style = document.execCommand('copy');
    customAlert(`拷贝${style === true ? '成功' : '失败'}`);
  } catch (err) {
    customAlert('不能拷贝');
  }

  // 删除tr
  table[table.length - 1].removeChild(newTr);
  window.getSelection().removeAllRanges();
};

/**
 * 保存到本地数据库
 * @param  {Number}  gap   秒数
 * @param  {Function} sendData 传递值方法
 * @return {Function} setInerval 定时器函数
 */
utils.save = (gap, sendData) => setInterval(() => {
  localStorage.setItem('saves', sendData());
}, gap * 1000);

/**
 * 从本地数据库读取
 * @return {Object}           JSON对象
 */
utils.load = () => localStorage.getItem('saves');

/**
 * 封装confirm方法
 * @return {Function}           封装confirm方法
 */
utils.confirm = (data) => {
  const customConfirm = confirm;
  return customConfirm(data);
};


if (global.utils) {
  throw new Error('There has utils already, cannot export utils!');
} else {
  global.utils = utils;
}

export default utils;
