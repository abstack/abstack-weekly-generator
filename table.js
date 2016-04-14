((global, utils) => {
  if (!utils) {
    throw new Error('Table weekly module depends on utils, but not found!');
  }
  const weeklyTable = {};

  // 获取聚焦单元格
  function getFocusCell() {
    const input = document.getElementsByTagName('input')[0];
    return input ? input.parentNode : input;
  }

  // 查找父级表格
  function findTableParent(cell) {
    if (cell) {
      const parent = cell.parentNode;
      if (parent && parent.tagName === 'TABLE') {
        return parent;
      }
      return findTableParent(parent);
    }
    return undefined;
  }

  // 创建新的一行
  function createNewLine(cell) {
    const tr = document.createElement('tr');
    const table = findTableParent(cell);
    table.appendChild(tr);
    const cells = table.getElementsByTagName('tr')[2].getElementsByTagName('td');
    Array.prototype.forEach.call(cells, () => {
      const td = document.createElement('td');
      write(td);
      tr.appendChild(td);
    });
    tr.getElementsByTagName('td')[1].click();
  }

  // 编辑数据
  function write(cell) {
    cell.addEventListener('click', (e) => {
      const input = document.createElement('input');
      const ev = e || event;
      if (ev.srcElement === cell) {
        const value = cell.innerHTML;
        cell.appendChild(input);
        input.value = value;
        input.focus();
        utils.bind(input, 'enter', (evt) => {
          evt.preventDefault();
          createNewLine(input);
        });
        utils.bind(input, 'tab', (evt) => {
          evt.preventDefault();
          focusNextCell();
        });
        utils.bind(input, 'shift+tab', (evt) => {
          evt.preventDefault();
          focusPrevCell();
        });
        input.addEventListener('blur', () => {
          setTimeout(() => {
            cell.innerHTML = input.value;
          }, 1);
        });
      }
    });
  }

  // 将输入框移到下一个单元格
  function focusNextCell() {
    const cell = getFocusCell();
    if (cell) {
      // 如果是最后一个
      if (cell.nextSibling === null) {
        // 如果是最后一行
        if (cell.parentNode.nextSibling !== null) {
          const next = cell.parentNode.nextSibling.childNodes.item(1);
          next.click();
        }
      } else {
        cell.nextSibling.click();
      }
    }
  }

  // 将输入框移到上一个单元格
  function focusPrevCell() {
    const cell = getFocusCell();
    // 如果是每行第一个
    if (cell.previousSibling.previousSibling === null) {
      // 如果是第一行
      if (cell.parentNode.previousSibling === null) {
        cell.click();
      } else {
        const previous = cell.parentNode.previousSibling.lastChild;
        if (previous === null) {
          cell.click();
        } else {
          previous.click();
        }
      }
    } else {
      cell.previousSibling.click();
    }
  }
  // 获取行数据
  function getRowData(row) {
    const rowData = [];
    const cells = row.getElementsByTagName('td');
    Array.prototype.forEach.call(cells, (cell) => {
      rowData.push(cell.innerHTML);
    });
    return rowData.slice(1);
  }
  // 获取表数据
  function getTableData(table) {
    const TableData = [];
    const rows = table.getElementsByTagName('tr');
    Array.prototype.forEach.call(rows, (row) => {
      TableData.push(getRowData(row));
    });
    return TableData.slice(2);
  }
  // 获取页面所有表数据
  function exportData(el, props) {
    const prop = props;
    const tableData = [];
    const tables = el.getElementsByTagName('table');
    Array.prototype.forEach.call(tables, (table) => {
      tableData.push(getTableData(table));
    });
    prop.forEach((item, index) => {
      item.row = tableData[index];
    });
    return prop;
  }
  weeklyTable.init = (box, props) => {
    props.forEach((item) => {
      const table = document.createElement('table');
      const col = item.title.length;
      // 表格
      box.appendChild(table);

      // 标题
      const header = document.createElement('tr');
      const headerTxt = document.createElement('td');
      headerTxt.className = 'table-header';
      headerTxt.setAttribute('colspan', col);
      headerTxt.innerHTML = item.head;
      table.appendChild(header);
      header.appendChild(headerTxt);

      // 表头
      const title = document.createElement('tr');
      table.appendChild(title);
      item.title.forEach((titlename) => {
        const titleTxt = document.createElement('td');
        titleTxt.className = 'table-title';
        titleTxt.innerHTML = titlename;
        title.appendChild(titleTxt);
      });
      // 数据
      if (item.row.length === 0) {
        const cells = document.createElement('tr');
        table.appendChild(cells);
        item.title.forEach(() => {
          const cellTxt = document.createElement('td');
          cells.appendChild(cellTxt);
          write(cellTxt);
        });
      } else {
        item.row.forEach((row) => {
          const cells = document.createElement('tr');
          const number = document.createElement('td');
          table.appendChild(cells);
          cells.appendChild(number);
          row.forEach((cell) => {
            const cellTxt = document.createElement('td');
            cellTxt.innerHTML = cell;
            cells.appendChild(cellTxt);
            write(cellTxt);
          });
        });
      }
    });
    return {
      focusPrevCell: (el) => {
        focusPrevCell(el);
      },
      focusNextCell: (el) => {
        focusNextCell(el);
      },
      createNewLine: (el) => {
        createNewLine(el);
      },
      exportData: (el, array) => {
        exportData(el, array);
      },
    };
  };

  if (global.weeklyTable) {
    throw new Error('There has weekly table already, cannot export weekly table!');
  } else {
    global.weeklyTable = weeklyTable;
  }
})(window, window.utils);
