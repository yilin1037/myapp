var tableParam = {
    elem: '#productTable'
    ,id:'productTable'
    ,url: '/?m=widget&c=selectStorage&a=getStorageList'
    ,cols: [[
      {checkbox:true, fixed: true}
      ,{field:'index', title: '序号', width:60}
      ,{field:'wh', title: '仓库编号', width:120, templet: '#storageTpl'}
      ,{field:'name', title: '仓库名称', width:260}
    ]]
    ,page: true
    ,height: 400
    ,width: 675
};

var request = GetRequest();
//单选
var isShowBtn = true;
if(request['type'] == '1'){
    tableParam = {
        elem: '#productTable'
        ,id:'productTable'
        ,url: '/?m=widget&c=selectStorage&a=getStorageList'
        ,cols: [[
          //{checkbox:true, fixed: true}
          {field:'index', title: '序号', width:60}
           ,{field:'wh', title: '仓库编号', width:120, templet: '#storageTpl'}
      ,{field:'name', title: '仓库名称', width:260}
        ]]
        ,page: true
        ,height: 400
        ,width: 675
    };
	
    isShowBtn = false;
}

var vueObj = new Vue({
    el: '#app',
    data: {
        tableObj:false,
        isShowBtn:isShowBtn
    },
    mounted: function () {
        layui.use(['element','table'], function(){
            var table = layui.table;
            vueObj.queryProductTable();
        });
    },
    methods: {
        productTableRow:function(temp_id){
            var table = layui.table;
			var widgetType = $("#widgetType").val();
            var productDateList = table.cache.productTable;
            var data = productDateList[temp_id];
            var index = parent.layer.getFrameIndex(window.name);
            if(typeof(parent.cbProductRows) == 'function'){
                parent.cbProductRows([data],widgetType);
            }
            parent.layer.close(index);
        },
        queryProductTable:function(){
            var queryKey = $("#queryKey").val();
            var table = layui.table;
            tableParam['where'] = {
                key: queryKey
            };
            vueObj.tableObj = table.render(tableParam);
        },
        getProductTableRow:function(){
            var table = layui.table;
            var checkStatus = table.checkStatus('productTable');
            return checkStatus.data;
        },
        onOk:function(){
            var index = parent.layer.getFrameIndex(window.name);
            if(typeof(parent.cbProductRows) == 'function'){
                parent.cbProductRows(vueObj.getProductTableRow());
            }
            parent.layer.close(index);
        },
        onClose:function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        }
    }
});
function GetRequest() {
	var url = location.search;
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}