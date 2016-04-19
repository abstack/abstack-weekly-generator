import weeklyTable from './table.js';
import utils from './utils.js';

const defaultConf = [
  {
    head: '本周工作任务及完成情况',
    title: ['工作任务描述', '起止日期', '完成率％', '备注'],
    row: [],
  },
  {
    head: '下周安排',
    title: ['工作任务描述', '起止日期', '备注'],
    row: [],
  },
  {
    head: '问题感言',
    title: ['描述'],
    row: [],
  },
];
const tableContainer = document.getElementById('table-container');
let autoSaveTimer;
let tableIns;

function initTable(conf) {
  tableContainer.innerHTML = '';
  tableIns = weeklyTable.init(tableContainer, conf || defaultConf);
  clearInterval(autoSaveTimer);
  autoSaveTimer = utils.save(1, () => tableIns.exportData());
}

(() => {
  let conf;

  try {
    conf = JSON.parse(utils.load());
  } catch (e) { throw e; }

  initTable(conf);
})();

document.getElementById('button-copy-table').addEventListener('click', () => {
  utils.copyElement(document.getElementById('table-container'));
});

document.getElementById('button-clear-data').addEventListener('click', () => {
  if (utils.confirm('数据清空后不可恢复，是否继续？')) {
    const tempTimer = utils.save(0.001, () => {
      clearInterval(tempTimer);
      return '';
    });
    initTable();
  }
});
