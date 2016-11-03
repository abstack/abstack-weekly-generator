import { assert } from 'chai';
import jsdom from 'mocha-jsdom';
import weeklyTable from '../../src/table.js';

describe('Weekly Table', () => {
  describe('init', () => {
    it('should generate two table', () => {
      jsdom('<div id="table-container"></div>', function () {
        const container = document.getElementById('table-container');

        weeklyTable.init(container, [
          {
            head: '测试表格一',
            title: ['标题一', '标题二'],
            row: [],
          },
          {
            head: '测试表格二',
            title: ['标题一', '标题二'],
            row: [],
          },
        ]);

        assert.equal(container.getElementsByTagName('table').length, 2);
      });
    });
  });
});
