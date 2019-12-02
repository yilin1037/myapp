/*
//外部调用例子
layer.open({
    title :'选择商品',
    type: 2,
    shade: false,
    area: ['700px', '500px'],
    maxmin: false,
    content: '?m=widget&c=selectProduct&a=index'
}); 
function cbProductRows(data){
    alert(JSON.stringify(data));
}
*/
var tableParam = {
    elem: '#productTable'
    ,id:'productTable'
    ,url: '/?m=widget&c=selectProduct&a=getProductDateList'
    ,cols: [[
      {checkbox:true}
      ,{field:'index', title: '序号', width:60}
      ,{field:'image_url', title: '图片', width:60, templet: '#prdImageTpl'}
      ,{field:'prd_no', title: '商品编号', width:120, templet: '#prdNoTpl'}
      ,{field:'wms_qty', title: '库存', width:100}
      ,{field:'sku_name1', title: '颜色', width:100}
      ,{field:'sku_name2', title: '尺码', width:100}
      ,{field:'price', title: '零售价', width:100}
	  ,{field:'title', title: '商品名称', minWidth:120}
	  
    ]]
    ,page: true
    ,height: 372
    ,width: 860
};

var tableParamOnline = {
    elem: '#productTableOnline'
    ,id:'productTableOnline'
    ,url: '/?m=widget&c=selectProduct&a=getProductDateListOnline'
    ,cols: [[
      {checkbox:true}
      ,{field:'index', title: '序号', width:60}
      ,{field:'image_url', title: '图片', width:60, templet: '#prdImageOnlineTpl'}
      ,{field:'prd_no', title: '商品编号', width:200, templet: '#prdNoOnlineTpl'}
	  ,{field:'sku_name', title: '销售属性', minWidth:120}
      ,{field:'title', title: '商品名称', minWidth:150}
      
    ]]
    ,page: true
    ,height: 372
    ,width: 860
};

var request = GetRequest();
//单选
var isShowBtn = true;
if(request['type'] == '1'){
    tableParam = {
        elem: '#productTable'
        ,id:'productTable'
        ,url: '/?m=widget&c=selectProduct&a=getProductDateList'
        ,cols: [[
          //{checkbox:true, fixed: true}
          {field:'index', title: '序号', width:60}
          ,{field:'image_url', title: '图片', width:60, templet: '#prdImageTpl'}
          ,{field:'prd_no', title: '商品编号', width:120, templet: '#prdNoTpl'}
          ,{field:'wms_qty', title: '库存', width:80}
          ,{field:'sku_name1', title: '颜色', width:80}
          ,{field:'sku_name2', title: '尺码', width:80}
          ,{field:'price', title: '零售价', width:80}
		  ,{field:'title', title: '商品名称', minWidth:120}
        ]]
        ,page: true
        ,height: 372
        ,width: 860
    };
	
	tableParamOnline = {
        elem: '#productTableOnline'
        ,id:'productTableOnline'
        ,url: '/?m=widget&c=selectProduct&a=getProductDateListOnline'
        ,cols: [[
          //{checkbox:true, fixed: true}
          {field:'index', title: '序号', width:60}
          ,{field:'image_url', title: '图片', width:60, templet: '#prdImageOnlineTpl'}
          ,{field:'prd_no', title: '商品编号', width:180, templet: '#prdNoOnlineTpl'}
		  ,{field:'sku_name', title: '销售属性', minWidth:180}
          ,{field:'title', title: '商品名称', minWidth:180}
          
        ]]
        ,page: true
        ,height: 372
        ,width: 860
    };
    isShowBtn = false;
}
var vueObj = new Vue({
    el: '#app',
    data: {
        tableObj:false,
		tableObjOnline:false,
        isShowBtn:isShowBtn,
		clickBtn: false,
    },
    mounted: function () {
        layui.use(['element','table'], function(){
            var table = layui.table;
            vueObj.queryProductTable();
			vueObj.queryProductTableOnline();
			$("#divLocal").removeClass("layui-show");
        });
    },
    methods: {
        productTableRow:function(temp_id){
			if(vueObj.clickBtn == false){
				vueObj.clickBtn = true;
				var table = layui.table;
				var widgetType = $("#widgetType").val();
				var productDateList = table.cache.productTable;
				var data = productDateList[temp_id];
				if(typeof(parent.cbProductRows) == 'function'){
					parent.cbProductRows([data],widgetType);
				}
				if(parent.layer){
					var index = parent.layer.getFrameIndex(window.name);
					parent.layer.close(index);
				}else{
					CloseWindow('ok');
				}
			}
        },
		productTableRowModify:function(temp_id){
			if(vueObj.clickBtn == false){
				vueObj.clickBtn = true;
				var table = layui.table;
				var widgetType = $("#widgetType").val();
				var productDateList = table.cache.productTable;
				var data = productDateList[temp_id];
				
				if(typeof(parent.cbProductRowsModify) == 'function'){
					parent.cbProductRowsModify([data],widgetType);
				}

				if(parent.layer){
					var index = parent.layer.getFrameIndex(window.name);
					parent.layer.close(index);
				}else{
					CloseWindow('ok');
				}
			}
        },
		productTableRowOnline:function(temp_id){
			if(vueObj.clickBtn == false){
				vueObj.clickBtn = true;
				var table = layui.table;
				var widgetType = $("#widgetType").val();
				var productDateList = table.cache.productTableOnline;
				var data = productDateList[temp_id];
				
				if(typeof(parent.cbProductRows) == 'function'){
					parent.cbProductRows([data],widgetType);
				}
				if(parent.layer){
					var index = parent.layer.getFrameIndex(window.name);
					parent.layer.close(index);
				}else{
					CloseWindow('ok');
				}
			}
        },
		productTableRowOnlineModify:function(temp_id){
			if(vueObj.clickBtn == false){
				vueObj.clickBtn = true;
				var table = layui.table;
				var widgetType = $("#widgetType").val();
				var productDateList = table.cache.productTableOnline;
				var data = productDateList[temp_id];
				if(typeof(parent.cbProductRowsModify) == 'function'){
					parent.cbProductRowsModify([data],widgetType);
				}
				if(parent.layer){
					var index = parent.layer.getFrameIndex(window.name);
					parent.layer.close(index);
				}else{
					CloseWindow('ok');
				}
			}
        },
        queryProductTable:function(){
            var queryKey = $("#queryKey").val();
            var table = layui.table;
            tableParam['where'] = {
                key: queryKey
            };
            vueObj.tableObj = table.render(tableParam);
        },
		queryProductTableOnline:function(){
            var queryKey = $("#queryKeyOnline").val();
			var queryKeySku = $("#queryKeyOnlineSku").val();
			var queryKeyTitle = $("#queryKeyOnlineTitle").val();
            var table = layui.table;
            tableParamOnline['where'] = {
                key: queryKey,
				keySku: queryKeySku,
				keyTitle: queryKeyTitle,
            };
            vueObj.tableObjOnline = table.render(tableParamOnline);
        },
        getProductTableRow:function(){
            var table = layui.table;
            var checkStatus = table.checkStatus('productTable');
            return checkStatus.data;
        },
		getProductTableRowOnline:function(){
            var table = layui.table;
            var checkStatus = table.checkStatus('productTableOnline');
            return checkStatus.data;
        },
        onOk:function(){
			var widgetType = $("#widgetType").val();
            if(typeof(parent.cbProductRows) == 'function'){
                parent.cbProductRows(vueObj.getProductTableRow(),widgetType);
            }
			if(parent.layer){
				var index = parent.layer.getFrameIndex(window.name);
				parent.layer.close(index);
			}else{
				CloseWindow('ok');
			}
        },
		onOkOnline:function(){
			var widgetType = $("#widgetType").val();
            if(typeof(parent.cbProductRows) == 'function'){
                parent.cbProductRows(vueObj.getProductTableRowOnline(),widgetType);
            }
			if(parent.layer){
				var index = parent.layer.getFrameIndex(window.name);
				parent.layer.close(index);
			}else{
				CloseWindow('ok');
			}
        },
        onClose:function(){
			if(parent.layer){
				var index = parent.layer.getFrameIndex(window.name);
				parent.layer.close(index);
			}else{
				CloseWindow('cancel');
			}
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

function CloseWindow(action) {
	if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
	else window.close();            
}