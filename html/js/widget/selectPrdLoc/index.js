/*
//外部调用例子
layer.open({
    title :'选择商品',
    type: 2,
    shade: false,
    area: ['700px', '500px'],
    maxmin: false,
    content: '?m=widget&c=selectPrdLoc&a=index'
}); 
function cbProductRows(data){
    alert(JSON.stringify(data));
}
*/

var bill_type = '';
var request = GetRequest();
if(request){
	if(request.type == '1'){
		bill_type = '1';		
	}
}
//单选
var isShowBtn = true;
tableParam = {
	elem: '#productTable'
	,id:'productTable'
	,url: '/?m=widget&c=selectPrdLoc&a=getPrdLoc'
	,cols: [[
	  {checkbox:true, fixed: true}
	  ,{field:'index', title: '序号', width:60}
	  ,{field:'name', title: '货位', width:120}
	  ,{field:'wh_name', title: '所属库位', width:120}
	]]
	,page: true
	,height: 380
	,width: 675
};


var vueObj = new Vue({
    el: '#app',
    data: {
        tableObj:false,
        isShowBtn:true
    },
    mounted: function () {
        layui.use('table', function(){
            var table = layui.table;
            vueObj.queryProductTable();
        });
    },
    methods: {
        productTableRow:function(temp_id){
            var table = layui.table;
            var productDateList = table.cache.productTable;
            var data = productDateList[temp_id];
            var index = parent.layer.getFrameIndex(window.name);
            if(typeof(parent.cbProductRows) == 'function'){
                parent.cbProductRows([data]);
            }
            parent.layer.close(index);
        },
        queryProductTable:function(){
            var queryKey = $("#queryKey").val();
            var table = layui.table;
            tableParam['where'] = {
                key: queryKey,
				bill_type: bill_type
            };
            if(!vueObj.tableObj){
                vueObj.tableObj = table.render(tableParam);
            }else{
                vueObj.tableObj.reload(tableParam);
            }
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