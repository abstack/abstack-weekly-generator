;(function(global) {
  global.init = function(box,props) {
    for(var x = 0;x < props.length;x++) {

      //表格
      var table = document.createElement('table');
      box.appendChild(table);

      //标题
      var tr = document.createElement('tr');
      table.appendChild(tr);
      var td = document.createElement('td');
      td.className="table-header";
      td.setAttribute("colspan",props[x].title.length);
      td.innerHTML = props[x].head;
      tr.appendChild(td);

      //表头
      var tr = document.createElement('tr');
      table.appendChild(tr);
      for(var a = 0; a<props[x].title.length; a++) {
        var td = document.createElement('td');
        td.className="table-title";
        td.innerHTML = props[x].title[a];
        tr.appendChild(td);
      }

      //数据
      if (props[x].row.length == 0) {
        var tr = document.createElement('tr');
        table.appendChild(tr);
        for(var a = 0; a < props[x].title.length; a++) {
          var td = document.createElement('td');
          tr.appendChild(td);
          write(td);
        }
      }else{
        for(var i = 0; i < props[x].row.length; i++) {
          var tr = document.createElement('tr');
          table.appendChild(tr);
          var td = document.createElement('td');
          tr.appendChild(td);
          for(var a = 0; a < props[x].title.length-1; a++) {
            var td = document.createElement('td');
            td.innerHTML = props[x].row[i][a];
            tr.appendChild(td);
            write(td);
          }
        }
      }
    }

    //测使用
    // document.onkeydown = function(ev) {
    //   ev = ev || event;
    //   if(ev.keyCode == 13) {
    //     var cell = getFocusCell(box);
    //     // createNewLine(cell);//创建新的一行
    //     // focusPrevCell(box);//移到上一个单元格
    //     // focusNextCell(box);//移到下一个单元格
    //     // exportData(box,props);//导出表格数据
    //   }
    // }
    return {
      focusPrevCell: function(el) {
        focusPrevCell(el);
      },
      focusNextCell: function(el) {
        focusNextCell(el);
      },
    }
  };

  //获取聚焦单元格
  function getFocusCell(el) {
    var input = (el.getElementsByTagName('input') || [])[0];
    return input?input.parentNode: input;
  }

  //查找父级表格
  function findTableParent(cell) {
    if (cell) {
      parent = cell.parentNode;
      if (parent && parent.tagName === 'TABLE') {
        return parent;
      } else {
        return findTableParent(parent);
      }
    } else {
      return undefined;
    }
  }

  //创建新的一行
  function createNewLine(cell) {
    var tr = document.createElement('tr');
    var table = findTableParent(cell);
    table.appendChild(tr);
    var length = table.getElementsByTagName('tr')[1].getElementsByTagName('td').length;
    for(var a = 0; a < length; a++) {
      var td = document.createElement('td');
      write(td);
      tr.appendChild(td);
    }
  }

  // 编辑数据
  function write(cell) {
    cell.addEventListener('click',function(ev) {
      var input = document.createElement('input');
      ev = ev || event;
      if (ev.srcElement ===this) {
        var value = cell.innerHTML;
        cell.appendChild(input);
        input.value = value;
        input.focus();
        input.addEventListener('blur',function() {
          setTimeout(function () {
            cell.innerHTML = input.value;
          }, 1);
        });
      }
    })
  }

  //将输入框移到下一个单元格
  function focusNextCell(el) {
    var cell = getFocusCell(el);
    if (cell) {
      if (cell.nextSibling == null) {
        if (cell.parentNode.nextSibling==null) {//如果是最后一行
          return;
        }else{
          var next = cell.parentNode.nextSibling.childNodes.item(1);
          next.click();
        }
      }else{
        cell.nextSibling.click();
      }
    }
  }

  //将输入框移到上一个单元格
  function focusPrevCell(el) {
    var cell = getFocusCell(el);
    console.log(cell.parentNode.previousSiblings);
    if (cell.previousSibling.previousSibling == null) {//如果是每行第一个
      if (cell.parentNode.previousSibling==null) {//如果是第一行
        return;
      }else{
        var previous = cell.parentNode.previousSibling.lastChild;
        if (previous == null) {
          return
        }else {
          previous.click();
        }
      }
    }else{
      cell.previousSibling.click();
    }
  }

  //导出表格数据
  function exportData(el,props) {
    var prop = props;
    var table = el.getElementsByTagName('table');
    for(var i = 0; i < prop.length; i++) {
      prop[i].row = [];
      var rowLength = table[i].getElementsByTagName('tr').length-2;
      for (var q = 0; q < rowLength; q++) {
        //导出指定行的数据
        GetRowData = function(a) {
          var rowData = table[i].getElementsByTagName('tr')[a];//获取当前行
          var cells= rowData.getElementsByTagName('td');//获取当前行的单元格
          prop[i].row[a]=[];
          for (var j = 0; j < props[i].title.length-1; j++) {
            prop[i].row[a][j] = (cells[j+1].innerHTML);
          }
        }
        prop[i].row.push(GetRowData(q+2));
      }
    }
    console.log(prop);
    return prop;
  }
})(window)

//用法
var box = document.getElementById('box');
props=[
  {
    head:'本周工作任务及完成',
    title:['序号','工作任务描述','起止日期','完成率％','备注'],
    row:[
      [1,2,3,4],
      [3,2,4,1]
    ],
  },
  {
    head:'本周工作任务及完成情况',
    title:['序号','工作任务描述','起止日期','备注'],
    row:[
    ],
  }
]
var Table = init(box,props);
