var tree = new Vue({
	el: '#vueDate',
	data: {
		treeId:"",
		addLoc:[],
		tableData:[],   //当前页所有数据
		delData:[],
		layprint:[],
		tplList:[],
		addPt:[],
		treeName:"",
		treePid:"",
	},
	mounted: function() {
		var oWidth = $(window).width();
		$(".rightTable").css('width',(oWidth-200)+'px');
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
	layer.load(2);	
	vueLoad.tableLoadTable("");
	
	//修改序号
	table.on('edit(dataListEvent)', function(obj){
		var value = obj.value 
		,data = obj.data
		,field = obj.field;
		$.ajax({
			url:'/?m=WMS&c=viewSerialNo&a=getChangeIndex',
			dataType: 'json',
			type: "post",
			data:{
				id:data.id,
				value:value,
			},
			success:function(data){
				if(data.code == "ok"){
					var treeId = tree.treeId;
					if(treeId == ""){
						vueLoad.tableLoadTable("");
					}else{
						vueLoad.tableLoadTable(treeId,tree.treePid);
					}
				}else{
					layer.msg('修改失败');
				}
			}
		})
	});
	
	//监听指定开关
	form.on('switch(switchTest)', function(data){
		if(this.checked){
			$("#shopNums").css("display","block"); 
			$(".shopNameTit").html("录入开始货位名称");
			$("#shopNums").val('');
		}else{
			$("#shopNums").css("display","none"); 
			$(".shopNameTit").html("录入");
			$("#shopNums").val(1); 
		}
	});
	
	//监听复选框
	table.on('checkbox(dataListEvent)', function(obj){
		//console.log(obj.checked); //当前是否选中状态
		//console.log(obj.data); //选中行的相关数据
		//console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
		if(obj.type == "all" && obj.checked == true){
			tree.delData = tree.tableData;
		}
		if(obj.type == "all" && obj.checked == false){
			tree.delData = [];
		}
		if(obj.type == "one"){
			if(obj.checked == true){
				var arrs = tree.delData;
				arrs.push(obj.data);
				tree.delData = arrs;
			}else{
				var arrs = tree.delData;
				var indexs = 0;
				for(var i=0;i<arrs.length;i++){
					if(arrs[i].id == obj.data.id){
						indexs = i;
					}
				}
				arrs.splice(indexs,1);
				tree.delData = arrs;
			}
		}
	});
	
	$.ajax({
		url:'/?m=WMS&c=viewSerialNo&a=getLocTplList',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			tree.tplList = data;
		}
	})
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
		,{type:'numbers', width:80, title: '序号'}
		,{field:'name', minWidth:300, title: '货位'}
		,{field:'loc_area', minWidth:300, title: '分区'}
		,{field:'wh', minWidth:300, title: '仓库'}
		,{field:'is_explosion', minWidth:150, title: '是否爆款'}
		,{field:'sort_order', minWidth:150, title: '排序号（正序）',edit: 'text'}
	]]
	,id: 'dataList'
	,data:[]
	,even: true
	,done: function(res, curr, count){
		//如果是异步请求数据方式，res即为你接口返回的信息。
		//如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
		//console.log(res);
		//得到当前页码
		//console.log(curr); 
		//得到数据总量
		//console.log(count);
		tree.tableData = res['data'];
		layer.closeAll('loading');
	}
};

//监听输入数量
$('#shopNums').bind('input propertychange', function() {
	var valNum = $(this).val();
	if(valNum>50){
		$(this).val(50);
	}
});

var vueLoad = {
	oldTree:false,
	tableObj:false,
	tableLoadTable:function(id,pid){
		layer.load(2);
		var table = layui.table;
		tableLoad['page'] = {
			curr: 1 
		};
		$.ajax({
			url:'/?m=WMS&c=viewSerialNo&a=getLocLeftTable',
			dataType: 'json',
			type: "post",
			data:{
				id: id,pid:pid
			},
			success:function(data){
				if(data){
					//tree.tableData = data;
					//console.log(data);
					if(!vueLoad.tableObj){
						for(var i=0;i<data.length;i++){
							tableLoad.data.push(data[i]);
						}
						vueLoad.tableObj = table.render(tableLoad);
					}else{
						tableLoad.data = [];
						for(var i=0;i<data.length;i++){
							tableLoad.data.push(data[i]);
						}
						vueLoad.tableObj.reload(tableLoad);
					}
				}else{
					table.render(tableLoad);
				}
				
			}
		})
	}
};

var setting = {
	view: {
		selectedMulti: true,
		showIcon: true
	},
	/*check: {
		enable: true,chkboxType: {"Y": "ps", "N": "s"}
	},*/
	data: {
		simpleData: {
			enable: true
		},
		keep: {
			parent: false,
			leaf: false,
		},
	},
	callback: {
		onClick: onClick
	}
};

$(document).ready(function(){
	$.ajax({
		url:'/?m=WMS&c=viewSerialNo&a=getLocLeftTree',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			var zNodes = data;
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
		}
	})
});

function onClick(event, treeId, treeNode, clickFlag) {
	tree.delData = [];
	tree.treeId = treeNode.id;
	tree.treeName = treeNode.name;
	tree.treePid = treeNode.pId;
	vueLoad.tableLoadTable(treeNode.id,tree.treePid);
}

//新增仓库
$("#addWh").click(function(){
	$("#addWhName").val("");
	layer.open({
		type: 1,
		title: '新增仓库',
		skin: 'layui-layer-rim', //加上边框
		area: ['500px', '200px'], //宽高
		shade: 0.3,
		content: $("#addViewWh"),
		btn: ['确定', '取消'],
		yes: function(index, layero){
			var addWhName = $("#addWhName").val();
			if(addWhName == ""){
				layer.msg("仓库名不能为空");
				return false;
			}
			$.ajax({
				url:'/?m=WMS&c=viewSerialNo&a=addWhName',
				dataType: 'json',
				type: "post",
				data:{
					addWhName: addWhName
				},
				success:function(data){
					if(data.code == "ok"){
						layer.msg("添加成功");
						layer.close(index);	
						$.ajax({
							url:'/?m=WMS&c=viewSerialNo&a=getLocLeftTree',
							dataType: 'json',
							type: "post",
							data:{},
							success:function(data){
								var zNodes = data;
								$.fn.zTree.init($("#treeDemo"), setting, zNodes);
							}
						})
					}else{
						layer.msg("添加失败");
					}
				}
			})
		}    
	});
})


//批量新增按钮
$("#addUser").click(function(){
	var treeId = tree.treeId;
	var treePid = tree.treePid;
	var areaName = tree.treeName;
	
	if(treePid == null){
		if(!treeId || treeId == ""){
			layer.msg('请选择具体仓库');
			return false;
		}
		tree.delData = [];
		tree.addLoc = [];
		$.ajax({
			url:'/?m=WMS&c=viewSerialNo&a=getLocArea',
			type:"post",
			dataType:"json",
			async:false,
			data: {treeId : treeId},
			success: function (data) {
				var proHtml = '';
				var tmp = data;

				proHtml += '<option value="默认分区">默认分区</option>';
				for(var i = 0; i < tmp.length; i++)
				{
					proHtml += '<option value="' + tmp[i].loc_area +  '">' + tmp[i].loc_area + '</option>';
				}
				$('#modules').html(proHtml);
			}
		});
	}else{
		var proHtml = '';
		proHtml += '<option value="' + areaName +  '">' + areaName + '</option>';
		$('#modules').html(proHtml);
	}
	
	addLoad.tableLoadTable();
	layer.open({
		type: 1,
		title: '新增货位',
		skin: 'layui-layer-rim', //加上边框
		area: ['800px', '650px'], //宽高
		shade: 0.3,
		content: $("#addLocAlert"),
		btn: ['确定', '取消'],
		yes: function(index, layero){
			var arrs = addLoc.data;
			var loc_area = $('select[name="modules"] :selected').prop('value');
			
			$.ajax({
				url:'/?m=WMS&c=viewSerialNo&a=getAddLocList',
				dataType: 'json',
				type: "post",
				data:{
					arrs:arrs,
					treeId:treeId,
					loc_area:loc_area,
					treePid:treePid
				},
				success:function(data){
					if(data.code == "ok"){
						layer.msg('添加成功');
						tree.addLoc = [];
						layer.close(index);
						vueLoad.tableLoadTable(tree.treeId,tree.treePid);
					}else if(data.code == "errors"){
						layer.msg(data.msg);
					}else{
						layer.msg('已存在货位名'+data.msg+'，请重新设置');
					}
				}
			})	
		}
	});
})

//新增分区
$("#addPart").click(function(){
	var treeId = tree.treeId;
	var title = tree.treeName;

	if(!treeId || treeId == ""){
		layer.msg('请选择具体仓库');
		return false;
	}
	if(treeId.substr(0,4) == 'area'){
		layer.msg('分区不能增加分区');
		return false;
	}
	
	$("#addAreaName").val("");
	$("#whName").html(title);
	layer.open({
		type: 1,
		title: '新增分区',
		skin: 'layui-layer-rim', //加上边框
		area: ['700px', '350px'], //宽高
		shade: 0.3,
		content: $("#addArea"),
		btn: ['确定', '取消'],
		yes: function(index, layero){
			var addAreaName = $("#addAreaName").val();
			if(addAreaName == ""){
				layer.msg("分区名不能为空");
				return false;
			}
			$.ajax({
				url:'/?m=WMS&c=viewSerialNo&a=addArea',
				dataType: 'json',
				type: "post",
				data:{
					addAreaName: addAreaName,
					treeId: treeId
				},
				success:function(data){
					if(data.code == "ok"){
						layer.msg("添加成功");
						layer.close(index);
						$.ajax({
							url:'/?m=WMS&c=viewSerialNo&a=getLocLeftTree',
							dataType: 'json',
							type: "post",
							data:{},
							success:function(data){
								var zNodes = data;
								$.fn.zTree.init($("#treeDemo"), setting, zNodes);
							}
						})					
					}else{
						layer.msg(data.msgList);
					}
				}
			})
		}    
	});
})

//删除分区
$("#delPart").click(function(){
	var treeId = tree.treeId;
	var treePid = tree.treePid;
	var name = tree.treeName;
	
	if(treeId.substr(0,4) != 'area'){
		layer.msg('请选择正确的分区');
		return false;
	}

	$.ajax({
			url:'/?m=WMS&c=viewSerialNo&a=delArea',
			dataType: 'json',
			type: "post",
			data:{
				treeId: treeId,treePid:treePid,name:name
			},
			success:function(data){
				if(data.code == "ok"){
					layer.msg("操作成功");
					$.ajax({
							url:'/?m=WMS&c=viewSerialNo&a=getLocLeftTree',
							dataType: 'json',
							type: "post",
							data:{},
							success:function(data){
								var zNodes = data;
								$.fn.zTree.init($("#treeDemo"), setting, zNodes);
							}
						})
				}else{
					layer.msg('操作失败');
				}
			}
		})
})
//删除仓库
$("#delWh").click(function(){
	var treeId = tree.treeId;
	var treePid = tree.treePid;
	var name = tree.treeName;

	if(treeId.substr(0,4) == 'area'){
		layer.msg('请选择正确的仓库');
		return false;
	}

	$.ajax({
		url:'/?m=WMS&c=viewSerialNo&a=delWh',
		dataType: 'json',
		type: "post",
		data:{
			treeId: treeId,treePid:treePid,name:name
		},
		success:function(data){
			if(data.code == "ok"){
				layer.msg(data.msg);
				$.ajax({
					url:'/?m=WMS&c=viewSerialNo&a=getLocLeftTree',
					dataType: 'json',
					type: "post",
					data:{},
					success:function(data){
						var zNodes = data;
						$.fn.zTree.init($("#treeDemo"), setting, zNodes);
					}
				})
			}else{
				layer.msg(data.msg);
			}
		}
	})
})
//批量删除按钮
$("#delUser").click(function(){
	var arrs = tree.delData;
	$.ajax({
		url:'/?m=WMS&c=viewSerialNo&a=getDelLocList',
		dataType: 'json',
		type: "post",
		data:{
			arrs:arrs
		},
		success:function(data){
			if(data.code == "ok"){
				layer.msg('删除成功');
				//vueLoad.tableLoadTable(tree.treeId);
				//tree.delData = [];
				vueLoad.tableObj.reload(tableLoad);
			}else{
				layer.msg(data.msg);
			}
		}
	})
})

$("#printStorage").click(function(){
	var arrs = tree.delData;
	if(arrs.length > 0){
		var print_data = [];
		for(var i in arrs){
			if(typeof(arrs[i]) == 'object' && arrs[i]['bar_code']){
				print_data.push({
					cust_data:{
						prd_loc:arrs[i]['name'],
						prd_locbarcode:arrs[i]['bar_code'],
					}
				});
			}
		}
		doGetPrinters(function(data){									
			tree.layprint =  data;															
		});
		layer.open({
			type: 1,
			title: '打印货位条码',
			skin: 'layui-layer-rim', //加上边框
			area: ['700px', '300px'], //宽高
			shade: 0.3,
			content: $("#printStorageBox"),
			btn: ['确定打印'],
			yes: function(index, layero){
				var printer = $("#layprintStorage").val();
				var layprintTpl = $("#layprintTpl").val();
				//console.log(printer+"==>"+layprintTpl);
				if(printer != "" && layprintTpl != ""){
					printTpl[layprintTpl](printer,print_data);
					layer.close(index);
				}else{
					layer.msg('打印机不存在,无法打印', {time: 2000, icon:2});
				}
			}
		});
	}else{
		layer.msg('请选择一条或多条数据', {time: 2000, icon:2});
	}
})

$("#printStorage1").click(function(){
	var arrs = tree.delData;
	if(arrs.length > 0){
		var print_data = [];
		for(var i in arrs){
			if(typeof(arrs[i]) == 'object' && arrs[i]['bar_code']){
				print_data.push({
					cust_data:{
						prd_loc:arrs[i]['name'],
						prd_locbarcode:arrs[i]['bar_code'],
					}
				});
			}
		}
		doGetPrinters(function(data){									
			tree.layprint =  data;															
		});
		layer.open({
			type: 1,
			title: '打印货位条码',
			skin: 'layui-layer-rim', //加上边框
			area: ['700px', '200px'], //宽高
			shade: 0.3,
			content: $("#printStorageBox"),
			btn: ['确定打印'],
			yes: function(index, layero){
				if($("#layprintStorage").val()){
					printTpl['storage1']($("#layprintStorage").val(),print_data);
					layer.close(index);
				}else{
					layer.msg('打印机不存在,无法打印', {time: 2000, icon:2});
				}
			}
		});
	}
});
$("#printStorage2").click(function(){
	var arrs = tree.delData;
	if(arrs.length > 0){
		var print_data = [];
		for(var i in arrs){
			if(typeof(arrs[i]) == 'object' && arrs[i]['bar_code']){
				print_data.push({
					cust_data:{
						prd_loc:arrs[i]['name'],
						prd_locbarcode:arrs[i]['bar_code'],
					}
				});
			}
		}
		doGetPrinters(function(data){									
			tree.layprint =  data;													
		});
		layer.open({
			type: 1,
			title: '打印货位条码',
			skin: 'layui-layer-rim', //加上边框
			area: ['700px', '200px'], //宽高
			shade: 0.3,
			content: $("#printStorage"),
			btn: ['确定打印'],
			yes: function(index, layero){
				if($("#layprintStorage").val()){
					printTpl['storage2']($("#layprintStorage").val(),print_data);
					layer.close(index);
				}else{
					layer.msg('打印机不存在,无法打印', {time: 2000, icon:2});
				}
			}
		});
	}
});
//批量设为爆款位
$("#setHot").click(function(){
	var arrs = tree.delData;
	//console.log(arrs); 
	$.ajax({
		url:'/?m=WMS&c=viewSerialNo&a=getSetHotList',
		dataType: 'json',
		type: "post",
		data:{
			arrs:arrs
		},
		success:function(data){
			if(data.code == "ok"){
				layer.msg('修改成功');
				vueLoad.tableLoadTable(tree.treeId,tree.treePid);
				tree.delData = [];
			}else{
				layer.msg(data.msg);
			}
		}
	})
})

//批量设为普通位
$("#setPublic").click(function(){
	var arrs = tree.delData;
	//console.log(arrs);
	$.ajax({
		url:'/?m=WMS&c=viewSerialNo&a=getSetPublicList',
		dataType: 'json',
		type: "post",
		data:{
			arrs:arrs
		},
		success:function(data){
			if(data.code == "ok"){
				layer.msg('修改成功');
				vueLoad.tableLoadTable(tree.treeId,tree.treePid);
				tree.delData = [];
			}else{
				layer.msg(data.msg);
			}
		}
	})
})

$("#fileLoc").on("change",function(){
	var fileName = $(this).val();
	if(fileName == ""){
		$(".fileName").html("请选择文件");
	}else{
		$(".fileName").html(fileName);
	}
})

//货位导入
$("#locInto").click(function(){
	$(".fileName").html("请选择文件");
	$("#fileLoc").val("");
	layer.open({
		type: 1,
		title: '新增货位',
		skin: 'layui-layer-rim', //加上边框
		area: ['500px', '200px'], //宽高
		shade: 0.3,
		content: $("#importIco"),
		btn: ['确定', '取消'],
		yes: function(index, layero){
			var formData = new FormData();
			formData.append("file", $("#fileLoc")[0].files[0]);
			//console.log($("#fileLoc")[0].files[0]);
			$.ajax({
				url:'/?m=WMS&c=viewSerialNo&a=getImportIco',
				type: "post",
				data: formData,
				processData: false,
				contentType: false,
				success:function(data){
					var data = JSON.parse(data);
					if(data.code == "ok"){
						layer.msg('添加成功');
						layer.close(index);
						vueLoad.tableLoadTable(tree.treeId,tree.treePid);
					}else if(data.code == "repeat"){
						var msg = "";
						for(var i=0;i<data['repeatList'].length;i++){
							msg += data['repeatList'][i]+",";
						}
						layer.msg(msg+'货位重复，添加成功');
						layer.close(index);
						vueLoad.tableLoadTable(tree.treeId,tree.treePid);
					}else{
						layer.msg(data.errorList[0].index+data.errorList[0].msg);
					}
				}
			})	
		}
	});
})

function seqBatchEnter(){
	var shopName = $("#shopName").val();
	var shopNums = $("#shopNums").val();
	var loc_area = $('select[name="modules"] :selected').prop('value');
	
	$("#shopName").val("");
	if(!/^[^\u4e00-\u9fa5]+$/.test(shopName)){
		layer.msg('请输入16位以内的英文和数字组合');
		return false;
	}
	if(shopNums>50){
		$("#shopNums").val("50");
		shopNums = 50;
	} 
	if(shopNums == "" ){
		shopNums = 1;
	}
	var locArr = shopName.split("");
	if(locArr.length>16 || locArr.length<1){
		layer.msg('请输入16位以内的小写英文和数字组合');
		return false;
	}
	
	var params = tree.addLoc;
	var oldLen = params.length;
	$.ajax({
		url:'/?m=WMS&c=viewSerialNo&a=nextcode',
		dataType: 'json',
		type: "post",
		data:{
			SEQ_NO:shopName,
			QTY:shopNums,
		},
		success:function(data){
			for(var i=0;i<data.length;i++){
				var param = {};
				param["del"] = "<div onclick=\"delLocArray('"+data[i]['SEQ_NO']+"')\">删除</div>";
				param["loc"] = data[i]['SEQ_NO'];
				param["area"] = loc_area;
				params.push(param);
			}
			tree.addLoc = params;
			addLoad.tableLoadTable();
		}
	})
}

//判断一个值在哪个数组中
function chooseArr( str ){
	var num = isInArray(locNums,str);
	
	if(isNumber(num)){
		return 'locNums';
	}
	var Letters = isInArray(locLetters,str);
	
	if(isNumber(Letters)){
		return 'locLetters';
	}
	var Letterb = isInArray(locLetterb,str);
	if(isNumber(Letterb)){
		return 'locLetterb';
	}
}
//判断一个值是否在数组中
function isInArray(arr,value){
	//console.log(arr+"==>"+value);
	for(var i = 0; i < arr.length; i++){
		if(value === arr[i]){
			return i;
		}
	}
	return false;
}
//正则判断是否是数字
function isNumber(val){
	var regPos = /^\d+(\.\d+)?$/; 
	var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
	if(regPos.test(val) || regNeg.test(val)){
		return true;
	}else{
		return false;
	}
}
//正则判断值是否在a~z,0~9,A~Z中
function newLocDate( str ){
	var re;
	re = /[a-zA~Z0-9]{1,16}/;
	if (re.test(str)) {
		return str;
	}
	else {
		return ""
	}
}

var addLoc = {
	elem: '#addLoc'
	,skin: 'row'
	,page: true 
	,limits: [50, 100, 200]
	,limit: 50 
	,where: {
		id:''
	}
	,height: '450'
	,cols: [[ 
		{type:'numbers', width:100, title: '序号'}
		,{field:'del', width:100, title: '操作'}
		,{field:'area', width:250, title: '分区'}
		,{field:'loc', width:250, title: '货位', edit: 'text'}
	]]
	,id: 'addLoc'
	,data:[]
	,even: true
};

var addLoad = {
	oldTree:false,
	tableObj:false,
	tableLoadTable:function(id){
		var table = layui.table;
		addLoc['page'] = {
			curr: 1 
		};
		var data = tree.addLoc;
		//console.log(data);
		if(!addLoad.tableObj){
			for(var i=0;i<data.length;i++){
				addLoc.data.push(data[i]);
			}
			addLoad.tableObj = table.render(addLoc);
		}else{
			addLoc.data = [];
			for(var i=0;i<data.length;i++){
				addLoc.data.push(data[i]);
			}
			addLoad.tableObj.reload(addLoc);
		}
	}
};

function delLocArray( index ){
	var arrs = tree.addLoc;
	var indexs = 0;
	for(var i=0;i<arrs.length;i++){
		if(arrs[i].loc == index){
			indexs = i;
		}
	}
	arrs.splice(indexs,1);
	tree.addLoc = arrs;
	addLoad.tableLoadTable();
}

//跳转波次设置
function goToSetWh(){
	window.parent.parent.addTab('cksz','?m=system&c=setWarehouse&a=setWarehouse','仓库设置');
}




