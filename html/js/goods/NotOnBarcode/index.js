var flow = new Vue({
	el: '#flow',
	data: {
		zeroSet:0,
		tableData:[],
		delData:[]
	}
})

layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,upload = layui.upload //上传
		,form = layui.form //表单
		,element = layui.element; //元素操作
	var table = layui.table; 
	
	//初始化表格
	vueLoad.tableLoadTable();
	
	//监听复选框
	table.on('checkbox(dataListEvent)', function(obj){
		//console.log(obj.checked); //当前是否选中状态
		//console.log(obj.data); //选中行的相关数据
		//console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
		if(obj.type == "all" && obj.checked == true){
			flow.delData = flow.tableData;
		}
		if(obj.type == "all" && obj.checked == false){
			flow.delData = [];
		}
		if(obj.type == "one"){
			if(obj.checked == true){
				var arrs = flow.delData;
				arrs.push(obj.data);
				flow.delData = arrs;
			}else{
				var arrs = flow.delData;
				var indexs = 0;
				for(var i=0;i<arrs.length;i++){
					if(arrs[i].id == obj.data.id){
						indexs = i;
					}
				}
				arrs.splice(indexs,1);
				flow.delData = arrs;
			}
		}
	});
})

var tableLoad = {
	elem: '#dataList'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,where: {
		id:''
	}
	,height: 'full-100'
	,cols: [[ 
		{type:'checkbox'}
		,{type:'numbers', width:100, title: '序号'}
		,{field:'urlPic', width:250, title: '图片'}
		,{field:'addtime', width:250, title: '入库时间'}
		,{field:'prd_no', width:250, title: '商品编码'}
		,{field:'sku_name', width:250, title: '属性'}
		,{field:'serial_no', width:250, title: '条码'}
	]]
	,id: 'dataList'
	,data:[]
	,even: true
};

var vueLoad = {
	oldTree:false,
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		tableLoad['page'] = {
			curr: 1 
		};
		var special = $("#special").val();              //特征
		var barcodeTop = $("#barcodeTop").val();        //条码上
		var barcodeBottom = $("#barcodeBottom").val();	//条码下
		var goodsNum = $("#goodsNum").val();			//商品编码
		
		$.ajax({
			url:'/?m=goods&c=NotOnBarcode&a=getLoadTable',
			dataType: 'json',
			type: "post",
			data:{
				special:special,
				barcodeTop:barcodeTop,
				barcodeBottom:barcodeBottom,
				goodsNum:goodsNum
			},
			success:function(data){
				if(data.code == "ok"){
					flow.tableData = data.data;
					if(!vueLoad.tableObj){
						for(var i=0;i<data.data.length;i++){
							data.data[i].urlPic = "<img src='"+data.data[i].urlPic+"' style='height: 100px;'>";
							tableLoad.data.push(data.data[i]);
						}
						vueLoad.tableObj = table.render(tableLoad);
					}else{
						tableLoad.data = [];
						for(var i=0;i<data.data.length;i++){
							data.data[i].urlPic = "<img src='"+data.data[i].urlPic+"' style='height: 100px;'>";
							tableLoad.data.push(data.data[i]);
						}
						vueLoad.tableObj.reload(tableLoad);
					}
				}else{
					tableLoad.data = [];
					table.render(tableLoad);
				}
			}
		})
	}
};

//重新加载数据
function searchBtn(){
	vueLoad.tableLoadTable();
	flow.delData = [];
}


//批量作废
$("#batchInvalid").click(function(){
	var chooseDate = flow.delData;
	if(chooseDate.length == 0){
		layer.msg('请选择商品');
		return false;
	}
	$.ajax({
		url:'/?m=goods&c=NotOnBarcode&a=batchInvalid',
		dataType: 'json',
		type: "post",
		data:{
			chooseDate:chooseDate
		},
		success:function(data){
			if(data.code == 'ok'){
				flow.delData = [];
				layer.msg('修改成功');
				vueLoad.tableLoadTable();
			}else{
				layer.msg('修改失败');
			}
		}
	})
})