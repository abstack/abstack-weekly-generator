var table = document.getElementById('table');
var Table = {
  //初始化表格
  init: function(table,props){
    var tr = document.createElement('tr');
    table.appendChild(tr);
    for(var a = 0; a<props.title.length; a++){
      var th = document.createElement('th');
      th.innerHTML = props.title[a];
      tr.appendChild(th);
    }
    for(var i = 0; i < props.row.length; i++){
      var tr = document.createElement('tr');
      table.appendChild(tr);
      for(var a = 0; a < props.title.length; a++){
        var td = document.createElement('td');
        td.innerHTML = props.row[i][a];
        tr.appendChild(td);
      }
    }
  },
  //创建新的一行
  createNewLine : function(props){
    var tr = document.createElement('tr');
    table.appendChild(tr);
    for(var a = 0; a < props.title.length; a++){
      var td = document.createElement('td');
      tr.appendChild(td);
    }
  },
  //focus
  focus : function(cell){
    cell.value=cell.innerHTML;
    var input = document.createElement('input');
    cell.appendChild(input);
    input.focus();
    input.type='text';
    input.value=cell.value;
  },
  //unfocus
  unfocus : function(cell){
    var input = cell.getElementsByTagName('input')[0];
    cell.innerHTML = input.value;
    input.blur();
    input.parentNode.removeChild(input);
  },
  focusNextCell : function(cell){
    Table.unfocus(cell);
    if(cell.nextSibling.nextSibling == null){
      if(cell.parentNode.nextSibling.nextSibling==null){//如果是最后一行
        Table.createNewLine(props);
      }else{
        var next = cell.parentNode.
        nextSibling.nextSibling.childNodes.item(1);
        if(oneone == null){
          return;
        }else {
          Table.focus(next)
        }
      }
    }else{
      Table.focus(cell.nextSibling.nextSibling)
    }
  },
  //将输入框移到上一个单元格
  focusPrevCell : function(cell){
    Table.unfocus(cell);
    if(cell.previousSibling.previousSibling == null){//如果是每行第一个
      if(cell.parentNode.previousSibling==null){//如果是第一行
        return;
      }else{
        var previous = cell.parentNode.previousSibling.previousSibling.lastChild.previousSibling;
        if(previous == null){
          return
        }else {
          Table.focus(previous)
        }
      }
    }else{
      Table.focus(cell.previousSibling.previousSibling)
    }
  },
  //导出表格数据
  export : function(table,props) {
    var prop = props;
    prop.row = [];
    //导出指定行的数据
    GetRowData = function(a){
      var rowData = table.getElementsByTagName('tr')[a];//获取当前行
      var cells= rowData.getElementsByTagName('td');//获取当前行的单元格
      props.row[a]=[];
      for (var j = 0; j < props.title.length; j++){
        props.row[a][j] = cells[j].innerHTML;
      }
    }
    for (var i = 0; i < props.title.length; i++) {
      prop.row.push(GetRowData(i+1));
    }
    return prop;
  }
};
