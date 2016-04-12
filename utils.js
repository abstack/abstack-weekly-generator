var doc;

var utils = {
  bind: bind,
  unbind: unbind,
  copy: copyElement,
  save: enableAutoSave,
  load: enableLoadData
}

function bind(element, key, callback) {
  if(!element || !key) {
    throw new Error('参数不能为空');
  }

  doc = element.addEventListener('keydown', function(event) {
    if(event.shiftKey === false && event.keyCode === key[0]) {
      console.log('tab')
      callback.call(null, this);
    }

    if(event.shiftKey === true && event.keyCode === key[0]) {
      console.log('shift+tab')
      callback.call(null, this);
    }
  })

  return {
    callback: callback
  }
}

function unbind(element, key, callback) {
  element.removeEventListener('keydown', doc);
  return {
    callback: callback
  }
}

function copyElement(element) {
  var range = document.createRange();
  range.selectNode(element);
  console.log(range)
  window.getSelection().addRange(range);

  try {
    var style = document.execCommand('copy');
    var msg = style ? '成功' : '失败';
    alert('拷贝'+msg);
  } catch(err) {
    alert('不能拷贝');
  }
  window.getSelection().removeAllRanges();
}

function enableAutoSave(data, gap) {
  setInterval(function() {
    localStorage.setItem('message', data);
  }, gap * 1000);
}

function enableLoadData() {
  return {
    data: localStorage.getItem('message')
  }
}