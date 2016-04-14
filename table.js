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
    const cells = table.getElementsByTagName('tr')[2].getElementsByTagName('td');
    table.appendChild(tr);
    Array.prototype.forEach.call(cells, () => {
      const td = document.createElement('td');
      write(td);
      tr.appendChild(td);
    });
    tr.getElementsByTagName('td')[0].innerHTML = table.getElementsByTagName('tr').length - 2;
    tr.getElementsByTagName('td')[1].click();
  }

  // 删除当前行
  function deleteLine(cell) {
    const tr = cell.parentNode;
    const table = tr.parentNode;
    const trs = tr.parentNode.getElementsByTagName('tr').length;
    if (trs > 3) {
      utils.confirm('确认删除吗？');
      tr.parentNode.removeChild(tr);
    }
    const tableRow = table.getElementsByTagName('tr');
    Array.prototype.forEach.call(tableRow, (tro, index) => {
      if (index > 1) {
        tro.getElementsByTagName('td')[0].innerHTML = index - 1;
      }
    });
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
        utils.bind(input, 'shift+backspace', (evt) => {
          evt.preventDefault();
          deleteLine(cell);
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
    return rowData;
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
    return JSON.stringify(prop);
  }
  weeklyTable.init = (box, props) => {
    props.forEach((item) => {
      const table = document.createElement('table');
      const col = item.title.length + 1;
      const header = document.createElement('tr');
      const headerTxt = document.createElement('td');
      const title = document.createElement('tr');
      // 表格
      box.appendChild(table);

      // 标题
      headerTxt.className = 'table-header';
      headerTxt.setAttribute('colspan', col);
      headerTxt.innerHTML = item.head;
      table.appendChild(header);
      header.appendChild(headerTxt);

      // 表头
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
        cells.getElementsByTagName('td')[0].innerHTML = '1';
      } else {
        item.row.forEach((row, index) => {
          const cells = document.createElement('tr');
          const number = document.createElement('td');
          number.innerHTML = index + 1;
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
    utils.save(3, () => exportData(box, props));
  };

  if (global.weeklyTable) {
    throw new Error('There has weekly table already, cannot export weekly table!');
  } else {
    global.weeklyTable = weeklyTable;
  }
})(window, window.utils);
