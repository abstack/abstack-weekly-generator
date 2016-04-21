casper.test.begin('weekly table', 8, function (test) {
  var startSelector = '#table-container table:nth-child(1) tr:nth-child(3) td:nth-child(2)';
  var clearBtn = '#button-clear-data';
  // 打开网页
  casper.start('http://localhost:8080/', function () {
    // 检查 HTTP 状态
    test.assertHttpStatus(200, "Check HTTP status");
  });

  casper.waitForSelector(startSelector, function () {
    var testText = 'This is a test text!';
    var nextSelector = '#table-container table:nth-child(1) tr:nth-child(3) td:nth-child(3)';
    var Firtstcell = '#table-container table:nth-child(1) tr:last-child td:first-child';
    var secondLine = '#table-container table:nth-child(1) tr:nth-child(2)';
    var first;
    var before;
    var after;

    casper.click(startSelector);

    // 输入测试文字
    casper.sendKeys(startSelector + ' input', testText);

    // 按下 Tab 键
    casper.sendKeys(startSelector + ' input', casper.page.event.key.Tab);

    // 检查焦点是否在第二个单元格中
    test.assertExists(nextSelector + ' input', 'Cell has been toggled successfully');

    casper.wait(1, function () {
      // 检查第一个单元格是否编辑成功
      test.assertEquals(casper.getHTML(startSelector), testText, 'Cell has been edited successfully');

      // 按下 Shift+Tab 键
      casper.sendKeys(startSelector, casper.page.event.key.Tab, {modifiers: 'shift'});

      // 检查焦点是否回到第一个单元格
      test.assertExists(startSelector + ' input', 'Cell has been toggled back successfully');
      first = this.getHTML(Firtstcell);
      //按下enter键
      casper.sendKeys(startSelector, casper.page.event.key.Enter);
      before = this.getHTML(Firtstcell) - 1 +'';
      //检查新增行是否起效
      test.assertEquals(before, first, 'Line has been added successfully');

      // 按下 Shift+backspace 键
      casper.sendKeys(startSelector, casper.page.event.key.Backspace, {modifiers: 'shift'});
      after = this.getHTML(Firtstcell);
      //检查删除行是否起效
      test.assertEquals(before, after, 'Line has been deleted successfully');
    });
  });

  casper.waitForSelector(clearBtn, function () {
    var secondLine = '#table-container table:nth-child(1) tr:nth-child(2)';
    // 按下清空按钮
    casper.click(clearBtn);

    casper.wait(0.5, function () {
      // 检查是否第二行存在
      test.assertDoesntExist(secondLine);
    });
    // casper.setFilter('open.location', function(location) {
    //   return /\?+/.test(location) ? location += "&foo=42" : location += "?foo=42";
    // });

    // casper.setFilter("page.confirm", function(msg) {
    //   // return msg === '数据清空后不可回复，是否继续？' ? false : true;
    //   return msg;
    // });
    // 
  })

  casper.run();
});
