var activeInfo = {};
var flow = new Vue({
	el: '#flow',
	data: {
		intoWh:"",    //仓库序号id
		intoWh_no:"", //仓库编号
		intoCust:"",
		intoCus_no:"",
		hotLoc:"",	  //货位序号id
		hotLoc_no:"", //货位编号
		intoOsno:"",
		datas:[],	  //列表所有数据
		saveDate:[],  //修改数量的列表数据
		dayin:"",	  //入库成功勾返回的订单号
		isFirst:true,
		layprintTplBq:[],  //打印模板数据
		layprint:[],  //打印机数据
		delData:[],   //列表选中数据 
		add_to:false, //是否追加
	},
	mounted: function() {
		var self = this;
		layui.use(['laydate', 'form', 'laypage', 'layer', 'element', 'table'], function(){
			var laydate = layui.laydate 		//日期
				,laypage = layui.laypage 		//分页
				,layer = layui.layer 			//弹层
				,form = layui.form 				//表单
				,element = layui.element; 		//元素操作
			var table = layui.table;			//表格操作
			table.render({
				 elem: '#LAY_table_user'
				,url: '?m=goods&c=existing&a=getQtyList'
				,cols: [[
				   {field:'djtype', title: '单据类型',"width":120 ,fixed: true}
				  ,{field:'effect_date', title: '创建时间',"width":120}
				  ,{field:'pc_no', title: '单据编号',"width":150}
				  ,{field:'name', title: '仓库',"width":120}
				  ,{field:'cus_name', title: '供应商',"width":140}
				  ,{field:'prd_no', title: '商品编码',"width":120}
				  ,{field:'prd_name', title: '商品名称',"width":300}
				  ,{field:'prd_sku_name', title: '商品属性',"width":120}
				  ,{field:'price', title: '单价',"width":120}
				  ,{field:'qty', title: '在途数量',"width":120}
				  ,{field:'total_fee', title: '总价',"width":120}
				]]
				,id: 'LAY_table_user'
				,page: true
				,height: 'full-245'
				,done: function(res, curr, count){
					layer.closeAll('loading');
				}
			});
			activeInfo = {
				reload: function(wh, prd_id, prd_sku_id){
					layer.load(2);
					table.reload('LAY_table_user', {
						page: {
							curr: 1
						}
						,where: {
							wh: wh,
							prd_id:prd_id,
							prd_sku_id:prd_sku_id,
						}
					});
				},
				dataListOnesReload:function () {

					var goodsNum = $("#goodsNum").val();
					var goodsName = $("#goodsName").val();
					var sortName = $("#sortName").val();
					var intoWh = flow.intoWh_no;
					var intoOsno = flow.intoOsno;

					table.reload('dataListOnes', {
						page: {
							curr: 1
						}
						,where: {
							prd_no:goodsNum,
							sort_name:sortName,
							prd_name:goodsName,
							intoWh:intoWh,
							intoOsno:intoOsno,
							act:act,
						}
						,done: function(res, curr, count){
							layer.closeAll('loading');
							//console.log(JSON.stringify(res) );
							self.datas = res.data;
						}
					});
				}
			};

			//**********************************************************
			table.render({
				elem: '#dataListOnes'        				//指定原始 table 容器的选择器或 DOM，方法渲染方式必填
				,url: '?m=WMS&c=Storage&a=getPrdList'
				,skin: 'row'                    			//line（行边框风格）, row（列边框风格）, nob（无边框风格）
				,page: true   								//开启分页（默认：false） 注：从 layui 2.2.0 开始，支持传入一个对象，里面可包含 laypage 组件所有支持的参数（jump、elem除外）
				,limits: [20, 50, 100]   					//每页条数的选择项，默认：[10,20,30,40,50,60,70,80,90]。 注意：优先级低于 page 参数中的 limits 参数
				,limit: 50  								//	每页显示的条数（默认：10）。值务必对应 limits 参数的选项。 注意：优先级低于 page 参数中的 limit 参数
				,where: {}
				,height: 'full-100'           				//设定容器高度
				,cols: [[
					{type:'checkbox'}
					,{type:'numbers', width:50, title: '序号'}
					,{field:'pic_path', width:150, title: '图片', templet: '<div> <img src=" {{d.pic_path}}"> </div>'}
					,{field:'prd_no', minWidth:180, title: '商品编码'}
					,{field:'prd_sku_no', minWidth:180, title: 'SKU编码'}
					,{field:'sku_name', minWidth:200, title: '属性'}
					,{field:'sort_name', width:100, title: '商品简称'}
					,{field:'title', minWidth:180, title: '商品名称'}
					,{field:'qty_pc', width:100, title: '在途量', templet: '#bar'}
					,{field:'num', width:180, title: (act=='purchaseOrder'?'订购数量':'入库数量'), edit: 'text'}
					,{field:'cost_price', width:180, title: '拿货价', edit: 'text'}
					,{field:'memo', width:180, title: '备注', edit: 'text'}
				]]
				,id: 'dataListOnes'   						//设定容器唯一 id
				,data:[] 									//直接赋值数据。既适用于只展示一页数据，也非常适用于对一段已知数据进行多页展示。
				,even: true     							// true/false  若不开启隔行背景，不设置该参数即可
				,done: function(res, curr, count){
					layer.closeAll('loading');
					//console.log(JSON.stringify(res) );
					self.datas = res.data;
				}      //数据渲染完的回调。你可以借此做一些其它的操作
			});




		})
	},
	methods: {
		setyesorder:function(){
			var self = this;																
			var data = "";																
			if($("#layprint").val() != 0){									
				var unprintname = $("#layprint").val();													
			}else{
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return																			
			}																							
			if($("#layprintTplBq").val() != 0){						
				var unprintTplBq = $("#layprintTplBq").val();	
			}else{
				layer.msg('请选择打印模板！',{
					icon: 2,
					time: 2000
				});
				return																				
			}
			wms_no = self.dayin;
			$.ajax({																	
				url: '/index.php?m=WMS&c=Storage&a=getPrintLabelWmsNo',							
				type: 'post',																		
				data: {wms_no:wms_no},
				dataType: 'json',														
				success: function (data) {
					if(data.code == "ok"){													
						var percent = 0;											//-----进度条初始化		
						layer.closeAll();
						countSecond(data['data'],unprintname,unprintTplBq);
					}	
				}																				
			});														
		},
		repairLabel:function(serial_no,elem){
			//console.log(elem);
			var self = this;																
			var data = "";																
			if($("#layprint").val() != 0){									
				var unprintname = $("#layprint").val();													
			}else{
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return																			
			}																							
			if($("#layprintTplBq").val() != 0){						
				var unprintTplBq = $("#layprintTplBq").val();	
			}else{
				layer.msg('请选择打印模板！',{
					icon: 2,
					time: 2000
				});
				return																				
			}

			$.ajax({																	
				url: '/index.php?m=WMS&c=Storage&a=getPrintLabelSerialNo',							
				type: 'post',																		
				data: {serial_no: serial_no, repair: 'T'},
				dataType: 'json',														
				success: function (data) {
					if(data.code == "ok"){
						var percent = 0;											//-----进度条初始化		
						elem.val("");
						countSecond(data['data'],unprintname,unprintTplBq);
					}else{
						elem.val("");
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});
					}
				}																				
			});
		},
	}
})
var custLoad = {
	elem: '#treeCustList'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,where: {
		id:''
	}
	,height: '400'
	,cols: [[ 
		{type:'numbers', width:80, title: '序号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'cus_no', width:250, title: '供应商编号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'cus_name', width:443, title: '供应商名称', event: 'setSign', style:'cursor: pointer;'}
	]]
	,id: 'treeWhList'
	,data:[]
	,even: true
};
var custTableLoad = {
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		custLoad['page'] = {
			curr: 1 
		};
		var custName = $("#custName").val();
		
		$.ajax({
			url:'/?m=PT&c=purchase&a=getCustTable',
			dataType: 'json',
			type: "post",
			data:{
				custName:custName
			},
			success:function(data){
				if(!custTableLoad.tableObj){
					for(var i=0;i<data.length;i++){
						custLoad.data.push(data[i]);
					}
					custTableLoad.tableObj = table.render(custLoad);
				}else{
					custLoad.data = [];
					for(var i=0;i<data.length;i++){
						custLoad.data.push(data[i]);
					}
					custTableLoad.tableObj.reload(custLoad);
				}
			}
		})
	}
};

function countSecond(data,unprintname,unprintTplBq){
	for(var i=0;i<data.length;i++){
		printTpl[unprintTplBq](unprintname,data[i]);
	}
	layer.msg('打印完成',{
		icon: 1,
		time: 2000
	});											
}
layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,upload = layui.upload //上传
		,form = layui.form //表单
		,element = layui.element; //元素操作
	var table = layui.table;
	
	//初始化可编辑表格
	//dataLoadOne.tableLoadTable();
	
	//监听数据列表
	table.on('checkbox(dataListOnes)', function(obj){
		//console.log(obj.checked); //当前是否选中状态
		//console.log(obj.data); //选中行的相关数据
		//console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
		if(obj.type == "all" && obj.checked == true){
			flow.delData =  eval("("+JSON.stringify(flow.datas)+")");
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
					if(arrs[i].numIndex == obj.data.numIndex){
						indexs = i;
					}
				}
				arrs.splice(indexs,1);
				flow.delData = arrs;
			}
		}
	});
	
	//监听仓库选择
	table.on('tool(treeWhList)', function(obj){
		var data = obj.data;
		flow.intoWh = data.name;
		flow.intoWh_no = data.wh;
		res="";
		$.ajax({
			url:'/?m=goods&c=otherOut&a=memory',
			dataType: 'json',
			type: "post",
			data:{
				whName:data.wh
			},
			success:function(data){
				
			}
		})
		layer.closeAll();
		$("#intoWh").val(data.name);
		$("#hotLoc").val("");
	});
	//监听货位选择
	table.on('tool(locTableList)', function(obj){
		var data = obj.data;
		flow.hotLoc = data.name;
		flow.hotLoc_no = data.prd_loc;
		layer.closeAll();
		$("#hotLoc").val(data.name);
	});
	//监听采购订单选择
	table.on('tool(osnoTableList)', function(obj){
		var data = obj.data;
		layer.closeAll();
		flow.intoOsno = data.pc_no;
		$("#intoOsno").val(data.pc_no);
		flow.intoCust = data.cus_name;
		flow.intoCus_no = data.cus_no;
		$("#intoCust").val(data.cus_name);
		searchBtn();
	});
	/**
	//监听仓库选择 
	table.on('checkbox(treeWhList)', function(obj){
		$("#whSetChoose tbody .layui-form-checkbox").removeClass("layui-form-checked");
		$(this).addClass("layui-form-checked");
		flow.intoWh = obj.data.name;
		flow.intoWh_no = obj.data.wh;
		//console.log(obj.data.name+"==>"+obj.data.wh);
	});
	
	//监听货位选择
	table.on('checkbox(locTableList)', function(obj){
		$("#alertTable tbody .layui-unselect").removeClass("layui-form-checked");
		$(this).addClass("layui-form-checked");
		flow.hotLoc = obj.data.name;
		flow.hotLoc_no = obj.data.prd_loc;
		//console.log(obj.data.name+"==>"+obj.data.prd_loc);
	});
	*/
	//获取表格修改信息
	table.on('edit(dataListOnes)', function(obj){
		var value = obj.value //得到修改后的值
		,data = obj.data //得到所在行所有键值
		,field = obj.field; //得到字段
		//layer.msg('[ID: '+ data.change +'] ' + field + ' 字段更改为：'+ value);
		var index = data.index;
		if(value){
			isNumber(value);
			flow.datas[index].num = value;
			flow.datas[index].change = 1;
		}else{
			flow.datas[index].num = 0;
		}
	});
	//监听供应商选择
	table.on('tool(treeCustList)', function(obj){
		var data = obj.data;
		flow.intoCust = data.cus_name;
		flow.intoCus_no = data.cus_no;
		layer.closeAll();
		$("#intoCust").val(data.cus_name);
	});
	//打印模板
	$.ajax({
		url:'/?m=goods&c=otherOut&a=getTemplate',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			if(data){
				flow.layprintTplBq = data;
				var ohtml = "";
				for(var i=0;i<data.length;i++){
					ohtml += "<option value='"+data[i].id+"'>"+data[i].tpl_name+"</option>";
				}
				$("#layprintTplBq").html(ohtml);
				form.render('select');
			}
		}
	})
	//打印机
	doGetPrinters(function(data){	
		flow.layprint = data;
		var ohtml = "";
		for(var i=0;i<data.length;i++){
			ohtml += "<option value='"+data[i].name+"'>"+data[i].name+"</option>";
		}
		$("#layprint").html(ohtml);
		form.render('select');
	});
	/**
	$.ajax({				
		url: '<?=U('getPrinter')?>',
		type: 'post',				
		data: {},					
		dataType: 'json',	
		success: function (data) {
			if(data){
				flow.layprint = data;
				var ohtml = "";
				for(var i=0;i<data.length;i++){
					ohtml += "<option value='"+data[i].name+"'>"+data[i].name+"</option>";
				}
				$("#layprint").html(ohtml);
				form.render('select');
			}
		}									
	});
	*/
})

//正则验证是否为大于0整数
function isNumber(value) {
	var parnt = /^[1-9]\d*(\.\d+)?$/;
	if(!parnt.exec(value)){
		layer.msg('请输入大于零的数字，否则无法入库');
		return false;    
	}
}
//供应商
$("#intoCust").click(function(){
    custTableLoad.tableLoadTable();
	layer.open({
		type: 1,
		title: '选择供应商',
		skin: 'layui-layer-rim', //加上边框
		area: ['800px', '550px'], //宽高
		shade: 0.3,
		content: $("#custSetChoose"),
		cancel: function(index, layero){ 
			flow.intoCust = "";
			flow.intoCus_no= "";
			$("#intoCust").val("");
		}
	});
});
function custSetBtn(){
	custTableLoad.tableLoadTable();
}



//保存入库
$("#saveInto").click(function(){
	var onOff = $("#saveInto").hasClass('layui-btn-disabled');
	if(!onOff){
		flow.againData = [];
		var datas = flow.datas;
		var add_to = flow.add_to;
		var cus_no = '';
		
		if(act == 'purchase' || act == 'purchaseOrder')
		{
			cus_no = flow.intoCus_no;
			if(cus_no == ""){
				layer.msg('请选择供应商');
				return false;
			}	
		}
		if(res){
			var wh = res;
		}else{
			var wh = flow.intoWh_no;
		}	
		if(wh == ""){
			layer.msg('请选择仓库');
			return false;
		}
		var save = new Array();
		for(var i=0;i<datas.length;i++){
			if(datas[i].num && datas[i].num>0){
				datas[i].prd_loc = flow.hotLoc_no;
				save.push(datas[i]);
			}
		}
		//console.log(save);
		if(save == ""){
			layer.msg('请至少选择一单入库');
			return false;
		}
		layer.load(2);
		$.ajax({
			url:'?m=WMS&c=Storage&a=setSerialNo',
			dataType: 'json',
			type: "post",
			data:{
				cus_no:cus_no,
				wh:wh,
				prd_loc:flow.hotLoc_no,
				act:act,
				add_to:add_to,
				data:save,
				os_no:$("#intoOsno").val(),
				memo:$('#memo').val(),
			},
			success:function(data){
				if(data.code == "ok"){
					layer.closeAll('loading');
					flow.dayin = data.wms_no;
					//采购订单不打印
					if(act != 'purchaseOrder'){
						if(flow.isFirst == true){
							flow.setyesorder();
							flow.isFirst = false;
						}
						setTimeout(function(){
							flow.isFirst = true;
						},200);
					}
					$("#tableOne").css("display","none");
					$("#tableTwo").css("display","block");
					$("#batchSetNums").removeClass('layui-btn-normal');
					$("#batchSetNums").addClass('layui-btn-disabled');
					$("#saveInto").removeClass('layui-btn-normal');
					$("#saveInto").addClass('layui-btn-disabled');
					$("#retypeLogo").removeClass('layui-btn-disabled');
					$("#retypeLogo").addClass('layui-btn-normal');
					
					flow.saveDate = save;
					dataLoadTwo.tableLoadTable();
				}else{
					layer.closeAll('loading');
					layer.msg(data.msg);
				}
			}
		})
	}
})
//重新打印
$("#retypeLogo").click(function(){
	var onOff = $("#retypeLogo").hasClass('layui-btn-disabled');
	if(!onOff){
		if(flow.isFirst == true){
			flow.setyesorder();
			flow.isFirst = false;
		}
		setTimeout(function(){
			flow.isFirst = true;
		},200);
	}
})

//重新打印
$("#RepairLabel").click(function(){
	layer.prompt({
		formType: 0,
		value: '',
		title: '标签补打',
		area: ['800px', '350px'], //自定义文本域宽高
		success: function(layero) { // 增加回车确认事件
			layero.find('input').on('keydown', function() {
				if (event.keyCode === 13) {
					flow.repairLabel(event.target.value, layero.find('input'));
					//layer.closeAll();
				}
			})
		},
	}, 
	function(value, index, elem){
		flow.repairLabel(value, elem); //得到value
		//layer.close(index);
	});
})

var dataListTwo = {
	elem: '#dataListTwo'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,where: {}
	,height: 'full-100'
	,cols: [[ 
		{type:'numbers', width:50, title: '序号'}
		,{field:'pic_path', width:150, title: '图片',templet: '<div> <img src=" {{d.pic_path}}"> </div>'}
		,{field:'prd_no', minWidth:180, title: '商品编码'}
		,{field:'prd_sku_no', minWidth:180, title: 'SKU编码'}
		,{field:'sku_name', minWidth:140, title: '属性'}
		,{field:'sort_name', width:180, title: '商品简称'}
		,{field:'title', minWidth:180, title: '商品名称'}
		,{field:'qty_pc', width:100, title: '在途量'}
		,{field:'num', width:180, title: (act=='purchaseOrder'?'订购数量':'入库数量')}
		,{field:'cost_price', width:180, title: '拿货价'}
		,{field:'memo', width:180, title: '备注', edit: 'text'}
	]]
	,id: 'dataListTwo'
	,data:[]
	,even: true
};

var dataLoadTwo = {
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		dataListTwo['page'] = {
			curr: 1 
		};
		var data = flow.saveDate;
		if(!dataLoadTwo.tableObj){
			for(var i=0;i<data.length;i++){
				dataListTwo.data.push(data[i]);
			}
			dataLoadTwo.tableObj = table.render(dataListTwo);
		}else{
			dataListTwo.data = [];
			for(var i=0;i<data.length;i++){
				dataListTwo.data.push(data[i]);
			}
			dataLoadTwo.tableObj.reload(dataListTwo);
		}
	}
};

//搜索
function searchBtn(){
	$("#tableOne").css("display","block");
	$("#tableTwo").css("display","none");
	$("#batchSetNums").removeClass('layui-btn-disabled');
	$("#batchSetNums").addClass('layui-btn-normal');
	$("#saveInto").removeClass('layui-btn-disabled');
	$("#saveInto").addClass('layui-btn-normal');
	$("#retypeLogo").removeClass('layui-btn-normal');
	$("#retypeLogo").addClass('layui-btn-disabled');

	activeInfo['dataListOnesReload'].call(this);
}

//清除
$("#searchReload").click(function(){
	$("#goodsNum").val("");
	$("#goodsName").val("");
	$("#sortName").val("");
	flow.hotLoc = "";
	flow.hotLoc_no = "";
	flow.intoOsno = "";
	$("#hotLoc").val("");
	$("#intoOsno").val("");
	$("#memo").val("");
})

//选择仓库
$("#intoWh").click(function(){
	$("#whName").val("");
	whTableLoad.tableLoadTable();
	layer.open({
		type: 1,
		title: '选择仓库',
		skin: 'layui-layer-rim', //加上边框
		area: ['800px', '550px'], //宽高
		shade: 0.3,
		content: $("#whSetChoose"),
		cancel: function(index, layero){ 
			flow.intoWh = "";
			flow.intoWh_no= "";
			$("#intoWh").val("");
		}
	});
})

function whSetBtn(){
	whTableLoad.tableLoadTable();
}

var whLoad = {
	elem: '#treeWhList'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,where: {
		id:''
	}
	,height: '400'
	,cols: [[ 
		{type:'numbers', width:80, title: '序号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'wh', width:250, title: '仓库编号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'name', width:443, title: '仓库名称', event: 'setSign', style:'cursor: pointer;'}
	]]
	,id: 'treeWhList'
	,data:[]
	,even: true
};
var whTableLoad = {
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		whLoad['page'] = {
			curr: 1 
		};
		var whName = $("#whName").val();
		
		$.ajax({
			url:'/?m=goods&c=otherOut&a=getWhTable',
			dataType: 'json',
			type: "post",
			data:{
				whName:whName
			},
			success:function(data){
				if(!whTableLoad.tableObj){
					for(var i=0;i<data.length;i++){
						whLoad.data.push(data[i]);
					}
					whTableLoad.tableObj = table.render(whLoad);
				}else{
					whLoad.data = [];
					for(var i=0;i<data.length;i++){
						whLoad.data.push(data[i]);
					}
					whTableLoad.tableObj.reload(whLoad);
				}
			}
		})
	}
};

//货位
$("#hotLoc").click(function(){
	if(res){
		var wh = res;
	}else{
		var wh = flow.intoWh_no;
	}	
	if(wh == ""){
		layer.msg("请先选择仓库");
		return false;
	}
	$("#locName").val("");
	locTableLoad.tableLoadTable();
	layer.open({
		type: 1,
		title: '选择货位',
		skin: 'layui-layer-rim', 
		area: ['800px', '550px'],
		shade: 0.3,
		content: $("#locTreeList"),
		cancel: function(index, layero){ 
			flow.hotLoc = "";
			flow.hotLoc_no = "";
			$("#hotLoc").val("");
		}
	});
})

//货位列表
var locLoad = {
	elem: '#locTableList'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,where: {
		id:''
	}
	,height: '400'
	,cols: [[ 
		{type:'numbers', width:145, title: '序号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'prd_loc', width:200, title: '货位编号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'name', width:200, title: '货位名称', event: 'setSign', style:'cursor: pointer;'}
		,{field:'wh', width:200, title: '所属仓库', event: 'setSign', style:'cursor: pointer;'}
	]]
	,id: 'locTableList'
	,data:[]
	,even: true
};

var locTableLoad = {
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		locLoad['page'] = {
			curr: 1 
		};
		if(res){
			var id = res;
		}else{
			var id = flow.intoWh_no;
		}
		var locName = $("#locName").val();
		$.ajax({
			url:'/?m=goods&c=otherOut&a=getLocTable',
			dataType: 'json',
			type: "post",
			data:{
				id:id,
				locName:locName,
			},
			success:function(data){
				if(!locTableLoad.tableObj){
					for(var i=0;i<data.length;i++){
						locLoad.data.push(data[i]);
					}
					locTableLoad.tableObj = table.render(locLoad);
				}else{
					locLoad.data = [];
					for(var i=0;i<data.length;i++){
						locLoad.data.push(data[i]);
					}
					locTableLoad.tableObj.reload(locLoad);
				}
			}
		})
	}
};
//搜索货位
function locSetSearch(){
	locTableLoad.tableLoadTable();
}

//采购订单
$("#intoOsno").click(function(){
	$("#intoOsno").val("");
	osnoTableLoad.tableLoadTable();
	layer.open({
		type: 1,
		title: '选择采购订单',
		skin: 'layui-layer-rim', 
		area: ['1000px', '550px'],
		shade: 0.3,
		content: $("#osnoTreeList"),
		cancel: function(index, layero){ 
			$("#intoOsno").val("");
		}
	});
})
//采购订单列表
var osnoLoad = {
	elem: '#osnoTableList'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,where: {
		id:''
	}
	,height: '400'
	,cols: [[ 
		{type:'numbers', width:50, title: '序号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'cus_name', width:170, title: '供应商', event: 'setSign', style:'cursor: pointer;'}
		,{field:'pc_no', width:140, title: '采购单号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'prd_no', width:140, title: '货号', event: 'setSign', style:'cursor: pointer;'}
		,{field:'qty', width:80, title: '订购数量', event: 'setSign', style:'cursor: pointer;'}
		,{field:'qty_rk', width:100, title: '已到货数量', event: 'setSign', style:'cursor: pointer;'}
		,{field:'effect_date', width:140, title: '采购日期', event: 'setSign', style:'cursor: pointer;'}
	]]
	,id: 'osnoTableList'
	,data:[]
	,even: true
};

var osnoTableLoad = {
	tableObj:false,
	tableLoadTable:function(){
		var table = layui.table;
		osnoLoad['page'] = {
			curr: 1 
		};
		var cus_name = $("#cus_name").val();
		$.ajax({
			url:'/?m=PT&c=statistics&a=getPurchaseOrder',
			dataType: 'json',
			type: "post",
			data:{
				cus_name:cus_name,
				
			},
			success:function(data){
				if(!osnoTableLoad.tableObj){
					for(var i=0;i<data.length;i++){
						osnoLoad.data.push(data[i]);
					}
					osnoTableLoad.tableObj = table.render(osnoLoad);
				}else{
					osnoLoad.data = [];
					for(var i=0;i<data.length;i++){
						osnoLoad.data.push(data[i]);
					}
					osnoTableLoad.tableObj.reload(osnoLoad);
				}
			}
		})
	}
};
function qtys(wh, prd_id, prd_sku_id){
	
	activeInfo['reload'] ? activeInfo['reload'].call(this, wh, prd_id, prd_sku_id) : '';
	layer.open({			
		type: 1,		
		page: true, 
		title: '在途明细',
		skin: 'layui-layer-rim', 
		area: ['1650px', '800px'], 
		shade: 0.3,	
		content: $("#openLoc"),
		btn: ['关闭']
	});

}
//搜索采购订单
function osnoSetSearch(){
	osnoTableLoad.tableLoadTable();
}

//批量设置数量
function batchSetNum(){
	$("#inputNum").val("");
	var onOff = $("#batchSetNums").hasClass('layui-btn-disabled');
	if(!onOff){
		layer.open({
			type: 1,
			title: '输入数量',
			skin: 'layui-layer-rim', //加上边框
			area: ['450px', '220px'], //宽高
			shade: 0.3,
			content: $("#saveNum"),
			btn: ['确定', '取消'],
			yes: function(index, layero){
				var table = layui.table;
				var inputNum = $("#inputNum").val();
				var nowData = flow.delData;     //选中的行
				var datas = flow.datas;          //所有数据
				for(var i=0;i<nowData.length;i++){
					for(var j=0;j<datas.length;j++){
						if(nowData[i]['LAY_TABLE_INDEX'] == datas[j]['LAY_TABLE_INDEX']){
							//vue 保存 设置的数量
							flow.datas[j].num = inputNum;
							//console.log(nowData[i]['LAY_TABLE_INDEX']);
							//数量渲染到页面
							$("#tableOne div .layui-table-box .layui-table-body table tr").eq(nowData[i]['LAY_TABLE_INDEX']).children('td[data-field="num"]').children('div').html(inputNum);
						}
					}
				}
				//console.log( flow.datas );
				//console.log( flow.delData);
				//console.log( flow.delData );
				//console.log( flow.datas  );
                //console.log(JSON.stringify(datas));
				//console.log(nowData);
				//console.log( $("#tableOne div .layui-table-box .layui-table-body table tr") )
				layer.close(index);
			}
		});
	}
}