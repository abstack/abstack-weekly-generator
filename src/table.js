import utils from '../src/utils.js';

const weeklyTable = {};

/**
 * 获取聚焦单元格
 * @return {Dom} 当前聚焦单元格
 */
function getFocusCell() {
  const input = document.getElementsByTagName('input')[0];
  return input ? input.parentNode : input;
}

/**
 * 查找父级表格
 * @param  {DOM} elm  当前元素
 * @return {Dom} elm  父级表格
 */
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

/**
 * 创建新行
 * @param  {DOM} elm  当前元素
 */
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

/**
 * 删除当前行
 * @param  {DOM} elm  当前元素
 */
function deleteLine(cell) {
  const tr = cell.parentNode;
  const table = tr.parentNode;
  const trs = tr.parentNode.getElementsByTagName('tr').length;
  if (trs > 3) {
    const r = utils.confirm('确认删除吗？');
    if (r) {
      tr.parentNode.removeChild(tr);
    }
  }
  const tableRow = table.getElementsByTagName('tr');
  Array.prototype.forEach.call(tableRow, (tro, index) => {
    if (index > 1) {
      tro.getElementsByTagName('td')[0].innerHTML = index - 1;
    }
  });
}

/**
 * 编辑数据
 * @param  {DOM} elm  当前元素
 */
function write(cell) {
  cell.addEventListener('click', (e) => {
    const input = document.createElement('input');
    const ev = e || event;
    if (ev.target === cell) {
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

/**
 * 将输入框移到下一个单元格
 */
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

/**
 * 将输入框移到上一个单元格
 */
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

/**
 * 获取行数据
 * @param  {DOM} elm    当前行
 * @return {Array} roaData  行数据
 */
function getRowData(row) {
  const rowData = [];
  const cells = row.getElementsByTagName('td');
  Array.prototype.forEach.call(cells, (cell, index) => {
    if (index > 0) {
      if (cell.getElementsByTagName('input').length !== 0) {
        rowData.push(cell.getElementsByTagName('input')[0].value);
      } else {
        rowData.push(cell.innerHTML);
      }
    }
  });
  return rowData;
}

/**
 * 获取表数据
 * @param  {DOM} elm    当前表
 * @return {Array} TableData  表数据
 */
function getTableData(table) {
  const TableData = [];
  const rows = table.getElementsByTagName('tr');
  Array.prototype.forEach.call(rows, (row) => {
    TableData.push(getRowData(row));
  });
  return TableData.slice(2);
}

/**
 * 获取所有表数据
 * @param  {DOM} elm    当前所有表
 * @return {Array} prop  所有表数据
 */
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

/**
 * 导入数据
 * @param  {json} localStorage中获得的数据
 */
function importData(box, data) {
  if (typeof(data) === 'string') {
    try {
      const datas = JSON.parse(data);
      weeklyTable.init(box, datas);
    } catch (err) {
      throw new Error('Data is not support JSON.parse()!');
    }
  } else {
    weeklyTable.init(box, data);
  }
}

/**
 * 初始化函数
 * @param  {DOM} elm    容器元素
 * @param  {Array} props 表格配置
 * @return {weeklyTable}
 */
weeklyTable.init = (box, props) => {
  if (props instanceof Array) {
    props.forEach((item) => {
      const table = document.createElement('table');
      const col = item.title.length + 1;
      const header = document.createElement('tr');
      const headerTxt = document.createElement('td');
      const title = document.createElement('tr');
      const serialNumber = document.createElement('td');
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
      serialNumber.innerHTML = '序号';
      serialNumber.className = 'table-title';
      title.appendChild(serialNumber);
      item.title.forEach((titlename) => {
        const titleTxt = document.createElement('td');
        titleTxt.className = 'table-title';
        titleTxt.innerHTML = titlename;
        title.appendChild(titleTxt);
      });
      // 数据
      if (item.row.length === 0) {
        const cells = document.createElement('tr');
        const serialNumberTxt = document.createElement('td');
        table.appendChild(cells);
        cells.appendChild(serialNumberTxt);
        item.title.forEach(() => {
          const cellTxt = document.createElement('td');
          cells.appendChild(cellTxt);
          write(cellTxt);
        });
        cells.getElementsByTagName('td')[0].innerHTML = '1';
      } else {
        item.row.forEach((row, index) => {
          const cells = document.createElement('tr');
          const rowNumber = document.createElement('td');
          rowNumber.innerHTML = index + 1;
          table.appendChild(cells);
          cells.appendChild(rowNumber);
          row.forEach((cell) => {
            const cellTxt = document.createElement('td');
            cellTxt.innerHTML = cell;
            cells.appendChild(cellTxt);
            write(cellTxt);
          });
        });
      }
    });
  } else {
    throw new Error('Props is not array!');
  }
  return {
    exportData: () => exportData(box, props),
    importData: (data) => importData(box, data),
  };
};

export default weeklyTable;
