;(function (global) {
  var doc = null;
  function isHaveShift(key) {
    for(var i in key) {
      if (key[i] === 16) {
        key.splice(key[i], 1);
        return true;
      }
    }
    return false;
  }
  global.utils = {
    bind: function(element, key, callback) {
      if (!element || !key) {
        throw new Error('参数不能为空');
      }

      doc = element.addEventListener('keydown', function(event) {

        if (key.length === 1) {
          if (event.shiftKey === false && event.keyCode === key[0]) {
            callback.call(null, this);
          }
        } else if (key.length > 1) {
          if (isHaveShift(key)) {
            if (event.shiftKey === true && event.keyCode === key[0]) {
              callback.call(null, this);
            }
          }
        }
        // end if
      })

      return callback;
    },

    unbind: function (element, key, callback) {
      element.removeEventListener('keydown', doc);

      return callback;
    },

    copyElement: function (element) {
      var range = document.createRange();
      range.selectNodeContents(element);
      window.getSelection().addRange(range);

      try {
        var style = document.execCommand('copy');
        var msg = style ? '成功' : '失败';
        alert('拷贝'+msg);
      } catch(err) {
        alert('不能拷贝');
      }
      window.getSelection().removeAllRanges();
    },

    enableAutoSave: function (gap) {
      setInterval(function() {
        localStorage.setItem('saves', table.export());
      }, gap * 1000);
    },

    enableLoadData: function () {
      return localStorage.getItem('saves');
    }
  }
})(window);

