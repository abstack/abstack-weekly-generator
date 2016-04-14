/**
 * 工具模块
 */
((global) => {
  const utils = {};

  /**
   * 快捷键绑定
   * @param  {DOM}      element  绑定元素
   * @param  {String}   key      绑定按键，形如 'shift+tab'
   * @param  {Function} callback 回调函数
   * @return {Object}            链式操作
   */
  utils.shortcutBind = (element, key, callback) => {
    const strategies = {
      shift: 'shiftKey',
      tab: 9,
      enter: 13,
    };

    if (!element._shortcutBinds) {
      element._shortcutBinds = {};
    }
    element._shortcutBinds[key] = (e) => {
      const keys = key.split('+');
      const ev = e || event;
      let isConform = true;
      let i;
      let strategy;

      for (i in strategies) {
        if ({}.hasOwnProperty.call(strategies, i)) {
          strategy = strategies[i];
          if (keys.indexOf(i) > -1) {
            if (typeof(strategy) === 'number' && strategy !== ev.keyCode) {
              isConform = false;
            } else if (typeof(strategy) === 'string' && !ev[strategy]) {
              isConform = false;
            }
          } else if (typeof(strategy) === 'string' && ev[strategy]) {
            isConform = false;
          }
        }
      }

      if (isConform && callback) {
        callback.call(this, ev);
      }
    };

    element.addEventListener('keydown', element._shortcutBinds[key]);

    return this;
  };

  if (global.utils) {
    throw new Error('There has utils already, cannot export utils!');
  } else {
    global.utils = utils;
  }
})(window);


/**
 * 周报表格模块
 */
((global, utils) => {
  if (!utils) {
    throw new Error('Table weekly module depends on utils, but not found!');
  }

  const weeklyTable = {};

  /**
   * 判断单元格是否是序号单元格
   * @param  {DOM} cell
   * @return {Boolean}
   */
  function isNumberCell(cell) {
    return window.getComputedStyle(cell).pointerEvents === 'none';
  }

  /**
   * 查找最近的表格父级
   * @param  {DOM} elm       向上查找的基础元素
   * @return {DOM|undefined} 表格元素
   */
  function findTableParent(elm) {
    let parent;
    if (elm) {
      parent = elm.parentNode;
      if (parent && parent.tagName === 'TABLE') {
        return parent;
      }
      return findTableParent(parent);
    }
    return undefined;
  }

  /**
   * 查找目标单元格
   * @param  {DOM}     cell   当前单元格
   * @param  {String}  type   向上还是向下查找
   * @return {DOM|null}       下一个单元格
   */
  function findTargetCell(cell, type) {
    const strategies = {
      next: 'nextElementSibling',
      prev: 'previousElementSibling',
    };
    const strategy = strategies[type];
    let targetRow;

    if (cell[strategy] && !isNumberCell(cell[strategy])) {
      return cell[strategy];
    } else if (cell.parentNode[strategy]) {
      targetRow = cell.parentNode[strategy];

      if (type === 'prev'
          && targetRow.firstElementChild
                      .className
                      .indexOf('table-') > -1) {
        return null;
      }

      if (targetRow) {
        if (type === 'next') {
          return targetRow.childNodes[1];
        }
        return targetRow.lastElementChild;
      }
      return null;
    }
    return null;
  }

  /**
   * 创建新行
   * @param  {DOM} row 当前行
   * @return {DOM}     生成的新行
   */
  function createNewLine(row) {
    const parentTable = findTableParent(row);
    const cloneNode = row.cloneNode(true);
    const cells = cloneNode.getElementsByTagName('td');

    Array.prototype.forEach.call(cells, (cell) => {
      cell.innerHTML = '';
      makeCellSupportEdit(cell);
    });

    parentTable.getElementsByTagName('tbody')[0].appendChild(cloneNode);
    cells[1].click();
  }

  /**
   * 聚焦相邻单元格
   * @param  {DOM}    currentCell 当前单元格
   * @param  {String} type        向上还是向下查找
   */
  function focusTableCell(currentCell, type) {
    let targetCell;
    if (currentCell) {
      targetCell = findTargetCell(currentCell, type);

      if (targetCell) {
        targetCell.click();
      } else if (type === 'next') {
        createNewLine(currentCell.parentNode);
      }
    }
  }

  /**
   * 使单元格可编辑
   * @param {DOM} cell 需要进行编辑的单元格
   */
  function makeCellSupportEdit(cell) {
    cell.addEventListener('click', (e) => {
      const input = document.createElement('input');
      const ev = e || event;

      if (ev.target === cell) {
        input.value = cell.innerHTML;
        cell.appendChild(input);
        input.focus();

        input.addEventListener('blur', () => {
          setTimeout(() => {
            cell.innerHTML = input.value;
          }, 1);
        });

        utils.shortcutBind(input, 'tab', (evt) => {
          evt.preventDefault();
          focusTableCell(cell, 'next');
        });

        utils.shortcutBind(input, 'shift+tab', (evt) => {
          evt.preventDefault();
          focusTableCell(cell, 'prev');
        });

        utils.shortcutBind(input, 'enter', (evt) => {
          evt.preventDefault();
          createNewLine(cell.parentNode);
        });
      }
    });
  }

  /**
   * 初始化函数
   * @param  {DOM} elm    容器元素
   * @param  {Array} opts 表格配置
   * @return {weeklyTable}
   */
  weeklyTable.init = (elm, opts) => {
    if (!elm || !elm.tagName) {
      throw new Error('Target element is not a DOM, cannot init!');
    }

    if (opts && opts.length) {
      // 遍历表单配置生成节点
      opts.forEach((item) => {
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');
        const header = document.createElement('tr');
        const headerTxt = document.createElement('td');
        const cells = document.createElement('tr');
        const blankCells = document.createElement('tr');
        const columns = item.columns || [];

        columns.unshift('序号');
        table.appendChild(tbody);
        headerTxt.innerHTML = item.name;
        headerTxt.className = 'table-header';
        headerTxt.setAttribute('colspan', columns.length);
        header.appendChild(headerTxt);

        // 遍历单元格配置生成节点
        columns.forEach((col) => {
          const cell = document.createElement('td');
          const blankCell = document.createElement('td');
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
        focusNextCell: () => {
          focusTableCell(elm, 'next');

          return this;
        },
        /**
         * 聚焦上一个单元格
         * @return {Object} 链式操作
         */
        focusPrevCell: () => {
          focusTableCell(elm, 'prev');

          return this;
        },
      };
    }
    throw new Error('Options is not a valid array, cannot init!');
  };

  if (global.weeklyTable) {
    throw new Error('There has weekly table already, cannot export weekly table!');
  } else {
    global.weeklyTable = weeklyTable;
  }
})(window, window.utils);
