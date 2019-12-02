
var tableParam = {
    elem: '#productTable'
    ,id:'productTable'
    ,url: '/?m=widget&c=selectProduct&a=getProductDateList'
	,where: {
	}
    ,cols: [[
      {checkbox:true, fixed: true}
      ,{field:'index', title: '序号', width:60}
      ,{field:'image_url', title: '图片', width:60, templet: '#prdImageTpl'}
      ,{field:'prd_no', title: '商品编号', width:120, templet: '#prdNoTpl'}
      ,{field:'title', title: '商品名称', width:120}
      ,{field:'sku_name1', title: '颜色', width:80}
      ,{field:'sku_name2', title: '尺码', width:80}
      ,{field:'price', title: '零售价', width:80}
    ]]
    ,page: true
    ,height: 330
    ,width: 675
};

var request = GetRequest();
//单选
var isShowBtn = true;
if(request['type'] == '1'){
    tableParam = {
        elem: '#productTable'
        ,id:'productTable'
        ,url: '/?m=widget&c=selectProduct&a=getProductDateList'
		,where: {
		}
        ,cols: [[
          //{checkbox:true, fixed: true}
          {field:'index', title: '序号', width:60}
          ,{field:'image_url', title: '图片', width:60, templet: '#prdImageTpl'}
          ,{field:'prd_no', title: '商品编号', width:120, templet: '#prdNoTpl'}
          ,{field:'title', title: '商品名称', width:120}
          ,{field:'sku_name1', title: '颜色', width:80}
          ,{field:'sku_name2', title: '尺码', width:80}
          ,{field:'price', title: '零售价', width:80}
        ]]
        ,page: true
        ,height: 350
        ,width: 675
    };
	
    isShowBtn = false;
}else if(request['type'] == '2'){
	tableParam = {
        elem: '#productTable'
        ,id:'productTable'
        ,url: '/?m=widget&c=selectProduct&a=getProductDateList2'
		,where: {
			prd_loc: request['prd_loc'],
			cus_no: request['cus_no'],
			state: request['state']
		}
        ,cols: [[
          {checkbox:true, fixed: true}
          ,{field:'index', title: '序号', width:60}
          ,{field:'image_url', title: '图片', width:60, templet: '#prdImageTpl'}
          ,{field:'prd_no', title: '商品编号', width:120, templet: '#prdNoTpl'}
          ,{field:'title', title: '商品名称', width:120}
          ,{field:'sku_name1', title: '颜色', width:80}
          ,{field:'sku_name2', title: '尺码', width:80}
          ,{field:'price', title: '零售价', width:80}
		  ,{field:'prd_loc', title: '货位', width:80}
		  ,{field:'qty', title: '数量', width:80}
        ]]
        ,page: true
        ,height: 350
        ,width: 675
    };
}
var vueObj = new Vue({
    el: '#app',
    data: {
        tableObj:false,
        isShowBtn:isShowBtn,
		clickBtn: false,
    },
    mounted: function () {
        layui.use(['element','table'], function(){
            var table = layui.table;
            vueObj.queryProductTable();
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
				var index = parent.layer.getFrameIndex(window.name);
				if(typeof(parent.cbProductRows) == 'function'){
					parent.cbProductRows([data],widgetType);
				}
				parent.layer.close(index);
			}
        },
        queryProductTable:function(){
            var queryKey = $("#queryKey").val();
            var table = layui.table;
            tableParam['where']['key'] = queryKey;
            vueObj.tableObj = table.render(tableParam);
        },
        getProductTableRow:function(){
            var table = layui.table;
            var checkStatus = table.checkStatus('productTable');
            return checkStatus.data;
        },
        onOk:function(){
			var widgetType = $("#widgetType").val();
            var index = parent.layer.getFrameIndex(window.name);
            if(typeof(parent.cbProductRows) == 'function'){
                parent.cbProductRows(vueObj.getProductTableRow(),widgetType);
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