/**
 * 工具模块
 */
;(function (global) {
  global.utils = {
    /**
     * 快捷键绑定
     * @param  {DOM}      element  绑定元素
     * @param  {String}   key      绑定按键，形如 'shift+tab'
     * @param  {Function} callback 回调函数
     * @return {Object}            链式操作
     */
    shortcutBind: function (element, key, callback) {
      var strategies = {
        'shift': 'shiftKey',
        'tab': 9,
        'enter': 13
      };

      if (!element._shortcutBinds) {
        element._shortcutBinds = {};
      }
      element._shortcutBinds[key] = function (ev) {
        var keys = key.split('+');
        var isConform = true;
        var i;
        var stragy;
        ev = ev || event;

        for (i in strategies) {
          strategy = strategies[i];

          if (keys.indexOf(i) > -1) {
            if (typeof(strategy) === 'number' && strategy !== ev.keyCode) {
              isConform = false;
            } else if (typeof(strategy) == 'string' && !ev[strategy]) {
              isConform = false;
            }
          } else if (typeof(strategy) == 'string' && ev[strategy]) {
            isConform = false;
          }
        }

        isConform && callback && callback.call(this, ev);
      }

      element.addEventListener('keydown', element._shortcutBinds[key]);

      return this;
    }
  };
})(window);


/**
 * 周报表格模块
 */
;(function (global) {
  
  global.weeklyTable = {
    init: function (elm, opts) {
      if (!elm || !elm.tagName) {
        return console.warn('Target element is not a DOM, cannot init!');
      }

      if (opts && opts.length) {
        // 遍历表单配置生成节点
        opts.forEach(function (item) {
          var table = document.createElement('table');
          var tbody = document.createElement('tbody');
          var header = document.createElement('tr');
          var headerTxt = document.createElement('td');
          var cells = document.createElement('tr');
          var blankCells = document.createElement('tr');
          var columns = item.columns || [];

          columns.unshift('序号');
          table.appendChild(tbody);
          headerTxt.innerHTML = item.name;
          headerTxt.className = 'table-header';
          headerTxt.setAttribute('colspan', columns.length);
          header.appendChild(headerTxt);

          // 遍历单元格配置生成节点
          columns.forEach(function (col) {
            var cell = document.createElement('td');
            var blankCell = document.createElement('td');
            cell.className = 'table-title';
            cell.innerHTML = col;
            cells.appendChild(cell);
            blankCells.appendChild(blankCell);

            // 点击单元格可编辑
            makeCellSupportEdit(blankCell);
          });

          // 放入 DOM
          tbody.appendChild(header);
          tbody.appendChild(cells);
          tbody.appendChild(blankCells);
          elm.appendChild(table);
        });

        // 返回可操作对象
        return {
          /**
           * 聚焦下一个单元格
           * @return {Object} 链式操作
           */
          focusNextCell: function () {
            focusNextCell(elm);

            return this;
          },
          /**
           * 聚焦上一个单元格
           * @return {Object} 链式操作
           */
          focusPrevCell: function () {
            focusPrevCell(elm);

            return this;
          }
        }
      } else {
        console.warn('Options is not a valid array, cannot init!');
      }
    }
  };

  /**
   * 聚焦下一个单元格
   */
  function focusNextCell (elm) {
    var focusCell = getFocusCell(elm);
    var targetCell;

    if (focusCell) {
      targetCell = findTargetCell(focusCell, 1);

      if (targetCell) {
        targetCell.click();
      } else {
        createNewLine(focusCell.parentNode);
      }
    } else {
      console.warn('No one cell be focused, cannot focus next cell!');
    }
  }

  /**
   * 聚焦上一个单元格
   */
  function focusPrevCell (elm) {
    var focusCell = getFocusCell(elm);
    var targetCell;

    if (focusCell) {
      targetCell = findTargetCell(focusCell, 0);

      if (targetCell) {
        targetCell.click();
      }
    } else {
      console.warn('No one cell be focused, cannot focus next cell!');
    }
  }

  /**
   * 使单元格可编辑
   * @param {DOM} cell 需要进行编辑的单元格
   */
  function makeCellSupportEdit (cell) {
    cell.addEventListener('click', function (ev) {
      var input = document.createElement('input');
      ev = ev || event;

      if (ev.srcElement === this) {
        input.value = cell.innerHTML;
        cell.appendChild(input);
        input.focus();

        input.addEventListener('blur', function () {
          setTimeout(function () {
            cell.innerHTML = input.value;
          }, 1);
        });

        utils.shortcutBind(input, 'tab', function (ev) {
          ev.preventDefault();
          focusNextCell(findTableParent(cell));
        });

        utils.shortcutBind(input, 'shift+tab', function (ev) {
          ev.preventDefault();
          focusPrevCell(findTableParent(cell));
        });

        utils.shortcutBind(input, 'enter', function (ev) {
          ev.preventDefault();
          createNewLine(cell.parentNode);
        });
      }
    });
  }

  /**
   * 获取聚焦的单元格
   * @param  {DOM} table      表格容器
   * @return {DOM|undefined}  聚焦的单元格
   */
  function getFocusCell (table) {
    var input = (table.getElementsByTagName('input') || [])[0];

    return input?input.parentNode: input;
  }

  /**
   * 创建新行
   * @param  {DOM} row 当前行
   * @return {DOM}     生成的新行
   */
  function createNewLine (row) {
    var parentTable = findTableParent(row);
    var cloneNode = row.cloneNode(true);
    var cells = cloneNode.getElementsByTagName('td');

    Array.prototype.forEach.call(cells, function (cell) {
      cell.innerHTML = '';
      makeCellSupportEdit(cell);
    });

    parentTable.getElementsByTagName('tbody')[0].appendChild(cloneNode);
    cells[1].click();
  }

  /**
   * 查找最近的表格父级
   * @param  {DOM} elm       向上查找的基础元素
   * @return {DOM|undefined} 表格元素
   */
  function findTableParent (elm) {
    var parent;
    if (elm) {
      parent = elm.parentNode;
      if (parent && parent.tagName === 'TABLE') {
        return parent;
      } else {
        return findTableParent(parent);
      }
    } else {
      return undefined;
    }
  }

  /**
   * 查找目标单元格
   * @param  {DOM}     cell   当前单元格
   * @param  {Boolean} isNext 是否查找下一个单元格
   * @return {DOM|null}       下一个单元格
   */
  function findTargetCell (cell, isNext) {
    var strategies = {
      'true': 'nextElementSibling',
      'false': 'previousElementSibling'
    };
    var nextCell;
    var strategy;

    isNext = Boolean(isNext) + '';
    strategy = strategies[isNext];

    if (cell[strategy] && !isNumberCell(cell[strategy])) {
      return cell[strategy];
    } else if (cell.parentNode[strategy]) {
      targetRow = cell.parentNode[strategy];

      if (isNext === 'false'
          && targetRow.firstElementChild
                      .className
                      .indexOf('table-') > -1) {
        return null;
      }

      if (targetRow) {
        if (isNext === 'true') {
          return targetRow.childNodes[1];
        } else {
          return targetRow.lastElementChild;
        }
      } else {
        return null;
      }
    }
  }

  /**
   * 判断单元格是否是序号单元格
   * @param  {DOM} cell
   * @return {Boolean}
   */
  function isNumberCell (cell) {
    var pointerEvents = window.getComputedStyle(cell).pointerEvents;

    return pointerEvents === 'none';
  }
})(window);