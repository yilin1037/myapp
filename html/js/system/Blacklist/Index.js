var vue = new Vue({
	el: '#vue',
	data: {
		nickData:[],			//初始化昵称数组
		mobileData:[],			//初始化手机号数组
		attrData:[],			//初始化地址数组
		nameData:[],			//初始化收件人姓名黑名单
		nickNamePage:"",		//昵称当前页码
		mobilePhonePage:"",		//手机号当前页码
		attrKeyWordsPage:"",	//地址当前页码
		nameKeyWordsPage:"",	//收件人姓名当前页码
		fileState:"",			//模板文件下载类型
		fileGetState:"",		//导出
		//eval("("+JSON.stringify(flow.datas)+")");
	},
	mounted: function() {
		layui.use(['laydate', 'form', 'laypage', 'layer', 'element', 'table'], function(){
			var laydate = layui.laydate //日期
				,laypage = layui.laypage //分页
				layer = layui.layer //弹层
				,form = layui.form //表单
				,element = layui.element; //元素操作
			var table = layui.table;
			
			//监听单价修改
			table.on('edit(editPriceTable)', function(obj){
				var value = obj.value //得到修改后的值
				,data = obj.data //得到所在行所有键值
				,field = obj.field; //得到字段
				var system_id = data['systems_id'];
				var express_type = data['express_type'];
				var newPrice = value;
				$.ajax({
					url:'?m=system&c=ForCustomer&a=editPrice',
					dataType: 'json',
					type: "post",
					data:{
						system_id:system_id,
						express_type:express_type,
						newPrice:newPrice
					},
					success:function(data){
						layer.msg(data.msg);
					}
				})
			});
			
			//初始化加载三个黑名单
			allLoad.tableLoadFunction();
		});
	},
	methods: {
		blackAdd:function( state ){
			var table = layui.table;
			switch(state){
				case 'nick':
					addJson( dataNickName.data,function( data ){
						dataNickName.data = [];
						for(var i=0;i<data.length;i++){
							dataNickName.data.push(data[i]);
						}
						dataNickNameLoad.tableObj = table.render(dataNickName);
					});
					break;
				case 'tel':
					addJson( dataMobilePhone.data,function( data ){
						dataMobilePhone.data = [];
						for(var i=0;i<data.length;i++){
							dataMobilePhone.data.push(data[i]);
						}
						dataMobilePhoneLoad.tableObj = table.render(dataMobilePhone);
					});
					break;
				case 'attr':
					addJson( dataAttrKeyWords.data,function( data ){
						dataAttrKeyWords.data = [];
						for(var i=0;i<data.length;i++){
							dataAttrKeyWords.data.push(data[i]);
						}
						dataAttrKeyWordsLoad.tableObj = table.render(dataAttrKeyWords);
					});
					break;
				case 'name':
					addJson( dataNameKeyWords.data,function( data ){
						dataNameKeyWords.data = [];
						for(var i=0;i<data.length;i++){
							dataNameKeyWords.data.push(data[i]);
						}
						dataNameKeyWordsLoad.tableObj = table.render(dataNameKeyWords);
					});
					break;
				default:
					layer.msg('错误操作', {icon: 2});
			}
		},
		blackDel:function( state ){
			var table = layui.table;
			switch(state){
				case 'nick':
					var checkStatus = table.checkStatus('dataNickName');
					delJson( dataNickName.data,checkStatus['data'],'nick',function( data ){
						/**
						dataNickName.data = [];
						for(var i=0;i<data.length;i++){
							dataNickName.data.push(data[i]);
						}
						dataNickNameLoad.tableObj = table.render(dataNickName);
						*/
						vue.nickData = [];
						dataNickNameLoad.tableLoadFunction();
					});
					layer.msg('删除成功', {icon: 1});
					break;
				case 'tel':
					var checkStatus = table.checkStatus('dataMobilePhone');
					delJson( dataMobilePhone.data,checkStatus['data'],'tel',function( data ){
						/**
						dataMobilePhone.data = [];
						for(var i=0;i<data.length;i++){
							dataMobilePhone.data.push(data[i]);
						}
						dataMobilePhoneLoad.tableObj = table.render(dataMobilePhone);
						*/
						vue.mobileData = [];
						dataMobilePhoneLoad.tableLoadFunction();
					});
					layer.msg('删除成功', {icon: 1});
					break;
				case 'attr':
					var checkStatus = table.checkStatus('dataAttrKeyWords');
					delJson( dataAttrKeyWords.data,checkStatus['data'],'attr',function( data ){
						/**
						dataAttrKeyWords.data = [];
						for(var i=0;i<data.length;i++){
							dataAttrKeyWords.data.push(data[i]);
						}
						dataAttrKeyWordsLoad.tableObj = table.render(dataAttrKeyWords);
						*/
						vue.attrData = [];
						dataAttrKeyWordsLoad.tableLoadFunction();
					});
					layer.msg('删除成功', {icon: 1});
					break;
				case 'name':
					var checkStatus = table.checkStatus('dataNameKeyWords');
					delJson( dataNameKeyWords.data,checkStatus['data'],'name',function( data ){
						vue.nameData = [];
						dataNameKeyWordsLoad.tableLoadFunction();
					});
					layer.msg('删除成功', {icon: 1});
					break;
				default:
					layer.msg('错误操作', {icon: 2});
			}
		},
		blackSave:function( state ){
			switch(state){
				case 'nick':
					var data = dataNickName.data;
					var start = vue.nickData;
					console.log(data);
					console.log(start);
					$.ajax({
						url:'/?m=system&c=Blacklist&a=blackListSave',
						dataType: 'json',
						type: "post",
						data:{
							data: data,
							state: state,
							start: start,
						},
						success:function(data){
							if(data['code'] == 'ok'){
								dataNickNameLoad.tableLoadFunction();
								layer.msg(data['msg'], {icon: 1});
							}else{
								layer.msg(data['msg'], {icon: 2});
							}
						}
					})
					break;
				case 'tel':
					var data = dataMobilePhone.data;
					var start = vue.mobileData;
					$.ajax({
						url:'/?m=system&c=Blacklist&a=blackListSave',
						dataType: 'json',
						type: "post",
						data:{
							data: data,
							state: state,
							start: start,
						},
						success:function(data){
							if(data['code'] == 'ok'){
								dataMobilePhoneLoad.tableLoadFunction();
								layer.msg(data['msg'], {icon: 1});
							}else{
								layer.msg(data['msg'], {icon: 2});
							}
						}
					})
					break;
				case 'attr':
					var data = dataAttrKeyWords.data;
					var start = vue.attrData;
					$.ajax({
						url:'/?m=system&c=Blacklist&a=blackListSave',
						dataType: 'json',
						type: "post",
						data:{
							data: data,
							state: state,
							start: start,
						},
						success:function(data){
							if(data['code'] == 'ok'){
								dataAttrKeyWordsLoad.tableLoadFunction();
								layer.msg(data['msg'], {icon: 1});
							}else{
								layer.msg(data['msg'], {icon: 2});
							}
						}
					})
					break;
				case 'name':
					var data = dataNameKeyWords.data;
					var start = vue.nameData;
					$.ajax({
						url:'/?m=system&c=Blacklist&a=blackListSave',
						dataType: 'json',
						type: "post",
						data:{
							data: data,
							state: state,
							start: start,
						},
						success:function(data){
							if(data['code'] == 'ok'){
								dataNameKeyWordsLoad.tableLoadFunction();
								layer.msg(data['msg'], {icon: 1});
							}else{
								layer.msg(data['msg'], {icon: 2});
							}
						}
					})
					break;
				default:
					layer.msg('错误操作', {icon: 2});
			}
		},
		blackInPut:function( state ){
			vue.fileState = state;
			var title = "";
			switch(state){
				case 'nick':
					title = "昵称导入";
					break;
				case 'tel':
					title = "电话号导入";
					break;
				case 'attr':
					title = "地址导入";
					break;
				case 'name':
					title = "收件人姓名导入";
					break;
				default:
					layer.msg('错误操作', {icon: 2});
					return false;
			}
			$("#fileName").val("");
			$("#fileExcel").val("");
			layer.open({
				type: 1,
				title: title,
				skin: 'layui-layer-rim',
				area: ['700px', '250px'],
				shade: 0.3,
				content: $("#importExcel"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					//采用FormData上传文件
					var fileExcel = $("#fileExcel")[0].files[0];
					if(!fileExcel){
						layer.msg('请选择上传文件', {icon: 2});
						return false;
					}
					var formData = new FormData();
					formData.append("file",fileExcel );
					formData.append("state",state );
					$.ajax({
						url:'/?m=system&c=Blacklist&a=saveImportExcel',
						type: "post",
						data: formData,
						processData: false,
						contentType: false,
						success:function(data){
							if (typeof data == 'string') {
								var data = JSON.parse(data);
							}
							if(data['code'] == 'ok'){
								layer.close(index);
								layer.msg(data['msg'], {icon: 1});
							}else if(data['code'] == 'repeat'){
								var repeatData = data['data'];
								var oHtml = '';
								oHtml += '<table width="90%" align="center" border="1" bgcolor="#bbbbbb" cellspacing="1" cellpadding="1" style="margin-top:10px;margin-left: 5%;">';
								oHtml += '<tr align="center" style="height: 30px;">';
								oHtml += '<td>序号</td>';
								oHtml += '<td>重复黑名单</td>';
								oHtml += '</tr>';
								for(var i=0;i<repeatData.length;i++){
									oHtml += '<tr align="center" style="height: 30px;">';
									oHtml += '<td>'+(i+1)+'</td>';
									oHtml += '<td>'+repeatData[i]+'</td>';
									oHtml += '</tr>';
								}
								oHtml += '</table>';
								layer.open({
									type: 1,
									title: title,
									skin: 'layui-layer-rim',
									area: ['800px', '500px'],
									shade: 0.3,
									content: oHtml,
									btn: ['取消'],
								})
							} else {
								layer.msg(data.msg, {icon: 2});
							}
							switch(state){
								case 'nick':
									dataNickNameLoad.tableLoadFunction();
									break;
								case 'tel':
									dataMobilePhoneLoad.tableLoadFunction();
									break;
								case 'attr':
									dataAttrKeyWordsLoad.tableLoadFunction();
									break;
								case 'name':
									dataNameKeyWordsLoad.tableLoadFunction();
									break;
								default:
									layer.msg('错误操作', {icon: 2});
									return false;
							}
						}
					})	
				}
			})
		},
		blackGetPut:function( state ){
			vue.fileGetState = state;
			var title = "";
			var url = "";
			var data = "";
			switch(state){
				case 'nick':
					title = "昵称导出";
					var nick_name = $('#nickName').val();
					data = "&title="+title+"&nick_name="+nick_name+"&type=nick";
					break;
				case 'tel':
					title = "电话号导出";
					var mobile_phone = $('#mobilePhone').val();
					data = "&title="+title+"&nick_name="+nick_name+"&type=tel";
					break;
				case 'attr':
					title = "地址导出";
					var attr_key_words = $('#attrKeyWords').val();
					data = "&title="+title+"&nick_name="+nick_name+"&type=attr";
					break;
				case 'name':
					title = "收件人姓名导出";
					var name_key_words = $('#nameKeyWords').val();
					data = "&title="+title+"&nick_name="+nick_name+"&type=name";
					break;
			}
			var url = "?m=system&c=Blacklist&a=outputExcel"+data;
			$("#ifile").attr('src',url);
		}
	}
});
//昵称黑名单列表
/*var dataNickName = {
	elem: '#dataNickName'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: 'full-170'
	,cols: [[ 
		{type:'checkbox'}
		,{type:'numbers', width:70, title: '序号'}
		,{field:'value', minWidth:200, title: '昵称', edit: 'text'}
	]]
	,id: 'dataNickName'
	,data:[]
	,even: true
	,done: function(res, curr, count){
		//记录当前页面
		vue.nickNamePage = curr;
	}
};

var dataNickNameLoad = {
	tableObj:false,
	tableLoadFunction:function(){
		var table = layui.table;
		dataNickName['page'] = {
			curr: vue.nickNamePage 
		};
		var nick_name = $('#nickName').val();
		$.ajax({
			url:'/?m=system&c=Blacklist&a=getNickName',
			dataType: 'json',
			type: "post",
			data:{
				nick_name: nick_name,
			},
			success:function(data){
				if(data){
					vue.nickData = eval("("+JSON.stringify(data)+")");
					if(!dataNickNameLoad.tableObj){
						for(var i=0;i<data.length;i++){
							dataNickName.data.push(data[i]);
						}
						dataNickNameLoad.tableObj = table.render(dataNickName);
					}else{
						dataNickName.data = [];
						for(var i=0;i<data.length;i++){
							dataNickName.data.push(data[i]);
						}
						dataNickNameLoad.tableObj.reload(dataNickName);
					}
				}else{
					dataNickName.data = [];
					dataNickNameLoad.tableObj.reload(dataNickName);
				}
			}
		})
	}
};

function nickNameSearch(){
	dataNickNameLoad.tableLoadFunction();
}*/


//电话黑名单列表
var dataMobilePhone = {
	elem: '#dataMobilePhone'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: 'full-170'
	,cols: [[ 
		{type:'checkbox'}
		,{type:'numbers', width:70, title: '序号'}
		,{field:'value', minWidth:200, title: '电话号'}
	]]
	,id: 'dataMobilePhone'
	,data:[]
	,even: true
	,done: function(res, curr, count){
		//记录当前页面
		vue.mobilePhonePage = curr;
	}
};

var dataMobilePhoneLoad = {
	tableObj:false,
	tableLoadFunction:function(){
		var table = layui.table;
		dataMobilePhone['page'] = {
			curr: vue.mobilePhonePage 
		};
		var mobile_phone = $('#mobilePhone').val();
		$.ajax({
			url:'/?m=system&c=Blacklist&a=getMobilePhone',
			dataType: 'json',
			type: "post",
			data:{
				mobile_phone: mobile_phone,
			},
			success:function(data){
				if(data){
					vue.mobileData = eval("("+JSON.stringify(data)+")");
					if(!dataMobilePhoneLoad.tableObj){
						for(var i=0;i<data.length;i++){
							dataMobilePhone.data.push(data[i]);
						}
						dataMobilePhoneLoad.tableObj = table.render(dataMobilePhone);
					}else{
						dataMobilePhone.data = [];
						for(var i=0;i<data.length;i++){
							dataMobilePhone.data.push(data[i]);
						}
						dataMobilePhoneLoad.tableObj.reload(dataMobilePhone);
					}
				}else{
					dataMobilePhone.data = [];
					dataMobilePhoneLoad.tableObj.reload(dataMobilePhone);
				}
			}
		})
	}
};
function mobilePhoneSearch(){
	dataMobilePhoneLoad.tableLoadFunction();
}

//地址黑名单列表
var dataAttrKeyWords = {
	elem: '#dataAttrKeyWords'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: 'full-170'
	,cols: [[ 
		{type:'checkbox'}
		,{type:'numbers', width:70, title: '序号'}
		,{field:'value', minWidth:200, title: '地址'}
	]]
	,id: 'dataAttrKeyWords'
	,data:[]
	,even: true
	,done: function(res, curr, count){
		//记录当前页面
		vue.attrKeyWordsPage = curr;
	}
};

var dataAttrKeyWordsLoad = {
	tableObj:false,
	tableLoadFunction:function(){
		var table = layui.table;
		dataAttrKeyWords['page'] = {
			curr: vue.attrKeyWordsPage 
		};
		var attr_key_words = $('#attrKeyWords').val();
		$.ajax({
			url:'/?m=system&c=Blacklist&a=getAttrKeyWords',
			dataType: 'json',
			type: "post",
			data:{
				attr_key_words: attr_key_words,
			},
			success:function(data){
				if(data){
					vue.attrData = eval("("+JSON.stringify(data)+")");
					if(!dataAttrKeyWordsLoad.tableObj){
						for(var i=0;i<data.length;i++){
							dataAttrKeyWords.data.push(data[i]);
						}
						dataAttrKeyWordsLoad.tableObj = table.render(dataAttrKeyWords);
					}else{
						dataAttrKeyWords.data = [];
						for(var i=0;i<data.length;i++){
							dataAttrKeyWords.data.push(data[i]);
						}
						dataAttrKeyWordsLoad.tableObj.reload(dataAttrKeyWords);
					}
				}else{
					dataAttrKeyWords.data = [];
					dataAttrKeyWordsLoad.tableObj.reload(dataAttrKeyWords);
				}
			}
		})
	}
};
function attrKeyWordsSearch(){
	dataAttrKeyWordsLoad.tableLoadFunction();
}

//收件人姓名黑名单列表
var dataNameKeyWords = {
	elem: '#dataNameKeyWords'
	,skin: 'row'
	,page: true 
	,limits: [20, 50, 100]
	,limit: 50 
	,cellMinWidth: 80
	,height: 'full-170'
	,cols: [[ 
		{type:'checkbox'}
		,{type:'numbers', width:70, title: '序号'}
		,{field:'value', minWidth:200, title: '收件人姓名'}
	]]
	,id: 'dataNameKeyWords'
	,data:[]
	,even: true
	,done: function(res, curr, count){
		//记录当前页面
		vue.nameKeyWordsPage = curr;
	}
};

var dataNameKeyWordsLoad = {
	tableObj:false,
	tableLoadFunction:function(){
		var table = layui.table;
		dataNameKeyWords['page'] = {
			curr: vue.nameKeyWordsPage 
		};
		var name_key_words = $('#nameKeyWords').val();
		$.ajax({
			url:'/?m=system&c=Blacklist&a=getNameKeyWords',
			dataType: 'json',
			type: "post",
			data:{
				name_key_words: name_key_words,
			},
			success:function(data){
				if(data){
					vue.nameData = eval("("+JSON.stringify(data)+")");
					if(!dataNameKeyWordsLoad.tableObj){
						for(var i=0;i<data.length;i++){
							dataNameKeyWords.data.push(data[i]);
						}
						dataNameKeyWordsLoad.tableObj = table.render(dataNameKeyWords);
					}else{
						dataNameKeyWords.data = [];
						for(var i=0;i<data.length;i++){
							dataNameKeyWords.data.push(data[i]);
						}
						dataNameKeyWordsLoad.tableObj.reload(dataNameKeyWords);
					}
				}else{
					dataNameKeyWords.data = [];
					dataNameKeyWordsLoad.tableObj.reload(dataNameKeyWords);
				}
			}
		})
	}
};
function nameKeyWordsSearch(){
	dataNameKeyWordsLoad.tableLoadFunction();
}

//初始化加载三个黑名单
var allLoad = {
	tableLoadFunction:function(){
		var table = layui.table;
		dataNickName['page'] = {
			curr: vue.nickNamePage 
		};
		dataMobilePhone['page'] = {
			curr: vue.mobilePhonePage 
		};
		dataAttrKeyWords['page'] = {
			curr: vue.attrKeyWordsPage 
		};
		dataNameKeyWords['page'] = {
			curr: vue.nameKeyWordsPage 
		};
		$.ajax({
			url:'/?m=system&c=Blacklist&a=getAllBlackList',
			dataType: 'json',
			type: "post",
			data:{},
			success:function(data){
				if(data['code'] == 'ok'){
					//初始化昵称黑名单
					if(data['nick_name']){
						$nickData = data['nick_name'];
						vue.nickData = eval("("+JSON.stringify($nickData)+")");
						for(var i=0;i<data['nick_name'].length;i++){
							dataNickName.data.push(data['nick_name'][i]);
						}
						dataNickNameLoad.tableObj = table.render(dataNickName);
					}else{
						table.render(dataNickName);
					}
					
					//初始化电话黑名单
					if(data['mobile_phone']){
						$mobile_phone = data['mobile_phone'];
						vue.mobileData = eval("("+JSON.stringify($mobile_phone)+")");
						for(var i=0;i<data['mobile_phone'].length;i++){
							dataMobilePhone.data.push(data['mobile_phone'][i]);
						}
						dataMobilePhoneLoad.tableObj = table.render(dataMobilePhone);
					}else{
						table.render(dataMobilePhone);
					}
					
					//初始化地址黑名单
					if(data['attr_key_words']){
						$attr_key_words = data['attr_key_words'];
						vue.attrData = eval("("+JSON.stringify($attr_key_words)+")");
						for(var i=0;i<data['attr_key_words'].length;i++){
							dataAttrKeyWords.data.push(data['attr_key_words'][i]);
						}
						dataAttrKeyWordsLoad.tableObj = table.render(dataAttrKeyWords);
					}else{
						table.render(dataAttrKeyWords);
					}
					
					//初始化收件人姓名黑名单
					if(data['name_key_words']){
						$name_key_words = data['name_key_words'];
						vue.nameData = eval("("+JSON.stringify($name_key_words)+")");
						for(var i=0;i<data['name_key_words'].length;i++){
							dataNameKeyWords.data.push(data['name_key_words'][i]);
						}
						dataNameKeyWordsLoad.tableObj = table.render(dataNameKeyWords);
					}else{
						table.render(dataNameKeyWords);
					}
				}else{
					table.render(dataNickName);
					table.render(dataMobilePhone);
					table.render(dataAttrKeyWords);
					table.render(dataNameKeyWords);
				}
			}
		})
	}
};

//增加单行选择
function addJson( obj,callback ){
	$.ajax({
		url:'/?m=system&c=Blacklist&a=addJson',
		dataType: 'json',
		type: "post",
		data:{
			obj:obj
		},
		success:function(data){
			(callback && typeof(callback) === "function") && callback( data );
		}
	})
}

//删除航选择
function delJson( obj,data,state,callback ){
	$.ajax({
		url:'/?m=system&c=Blacklist&a=delJson',
		dataType: 'json',
		type: "post",
		data:{
			obj:obj,
			data:data,
			state:state,
		},
		success:function(data){
			(callback && typeof(callback) === "function") && callback( data );
		}
	})
}

$("#fileExcel").change(function(){
	var fileName = $(this).val();
	$("#fileName").val(fileName);
})
//新增昵称空行
function addRowName(){
    grid.addRow({}, 0);
}
function addRowPhone(){
    grid1.addRow({}, 0);
}
function addRowPlace(){
	grid2.addRow({}, 0);
}
function addRowReceiver(){
	grid3.addRow({}, 0);
}
//昵称编辑保存
function saveName(){
	grid.commitEdit();
    var SynChange = grid.getChanges();
    var data = mini.decode(SynChange);
	if(data.length > 0){
	var isAjax = true;
		for(var i = 0; i < data.length; i++){
			  if(data[i].value == undefined){    
				  alert("昵称不能为空");
				  isAjax = false;
				  break;
			}
		}	
		var data = JSON.stringify(data);
		if(isAjax){
			$.ajax({
		        type:'POST',
				url:'/?m=system&c=Blacklist&a=BlackListSaveName',
		        async:false,
		        data:{"data":data},
                success:function(data){
					var data = JSON.parse(data);
					if(data.repeat.length == 0 && data.sum > 0){
						mini.showTips({
					        content: '保存成功',    
                            state: 'success',      //default|success|info|warning|danger
							x: top,          //left|center|right
							y: top,          //top|center|bottom
							timeout: 2000     //自动消失间隔时间。默认2000（2秒）。
				        });
						grid.reload();
						grid.clearSelect(true);
					}else if(data.repeat.length > 0){
						var repeatName = "";
						for(var i = 0; i < data.repeat.length; i++){
							repeatName += data.repeat[i] +　"&nbsp";
						}
						mini.showMessageBox({
							title: "提示",    
							message: "保存成功",
							buttons: ["ok"],   					
							iconCls: "mini-messagebox-question",
							html: data.sum + "条数据已保存成功" + "<br>" + "(" +　repeatName + ")<span style='color:red;'>重复，不能重复保存</span>",   
							callback: function(action){
								if(action == "ok"){
									grid.reload();
									grid.clearSelect(true);
								}
							}
						});
					}
                    
                }
                });
		}
	}
}
function removeRow(){
	grid.commitEdit();
    var SynChange = grid.getChanges();
    var rows = grid.getSelecteds();
	if(rows.length == 0){      
		alert("请选择要删除的昵称");
	} else if (rows.length > 0) {
		var remove = "";
		for(var i = 0; i < rows.length; i++){   
		    if(rows[i]._state == "added"){ 
				grid.removeRow(rows[i]);
			}else{ 
			remove += rows[i].id + ",";     
			}
		}
		if(remove != ""){
			//点击删除按钮之后，判断页面是否有以编辑或添加但未保存数据
		if(SynChange.length > 0){
				alert("含有未保存数据，请先保存");
				return false;
		}else if(SynChange.length == 0){
			$.ajax({
				type:'POST',
				url:'/?m=system&c=Blacklist&a=BlackListDelete',
				dataType:'text',
				data:{"data":remove},
				success:function(data){	
					if(data > 0){
						mini.showTips({
							content: '删除成功',    
							state: 'success',      //default|success|info|warning|danger
							x: top,          //left|center|right
							y: top,          //top|center|bottom
							timeout: 2000     //自动消失间隔时间。默认2000（2秒）。
						});
						grid.reload();
						grid.clearSelect(true);
					}
					
				}
			});
		}
	  }
	}
}
function savePhone(){
	grid1.commitEdit();
    var SynChange = grid1.getChanges();
    var data = mini.decode(SynChange);
	if(data.length > 0){
		var isAjax = true;
		for(var i = 0; i < data.length; i++){
			if(data[i].value == undefined){
			alert("手机不能为空");
			isAjax = false;
			break;
		}
		}
		var data = JSON.stringify(data);
		if(isAjax){
			$.ajax({
		        type:'POST',
		        url:'/?m=system&c=Blacklist&a=BlackListSavePhone',
		        async:false,
		        data:{"data":data},
                success:function(data){
					var data = JSON.parse(data);
					if(data.code == 'error'){
						mini.showTips({
					        content: data.msg,    
                            state: 'warning',      //default|success|info|warning|danger
                             x: top,          //left|center|right
							 y: top,          //top|center|bottom
							timeout: 2000     //自动消失间隔时间。默认2000（2秒）。
				        });
					}
					if(data.repeat.length == 0 && data.sum > 0){
						mini.showTips({
					        content: '保存成功',    
                            state: 'success',      //default|success|info|warning|danger
                            x: top,          //left|center|right
							y: top,          //top|center|bottom
							timeout: 2000     //自动消失间隔时间。默认2000（2秒）。
				        });
						grid1.reload();
						grid1.clearSelect(true);
					}else if(data.repeat.length > 0){
						var repeatPhone = "";
						for(var i = 0; i < data.repeat.length; i++){
							repeatPhone += data.repeat[i] +　"&nbsp";
						}
						mini.showMessageBox({
							title: "提示",    
							message: "保存成功",
							buttons: ["ok"],   					
							iconCls: "mini-messagebox-question",
							html: data.sum + "条数据已保存成功" + "<br>" + "(" + repeatPhone + ")<span style='color:red;'>重复，不能重复保存</span>",   
							callback: function(action){
								if(action == "ok"){
									grid1.reload();
									grid1.clearSelect(true);
								}
							}
						});
					}
                    
                }
                });
		}
		
	}
}
function removeRowPhone(){
	grid1.commitEdit();
    var SynChange = grid1.getChanges();
    var rows = grid1.getSelecteds();
	if(rows.length == 0){      
		alert("请选择要删除的手机号");
	} else if (rows.length > 0) {
		var remove = "";
		for(var i = 0; i < rows.length; i++){   
		    if(rows[i]._state == "added"){ 
				grid1.removeRow(rows[i]);
			}else{ 
			remove += rows[i].id + ",";     
			}
		}
		if(remove != ""){
			//点击删除按钮之后，判断页面是否有以编辑或添加但未保存数据
		if(SynChange.length > 0){
				alert("含有未保存数据，请先保存");
				return false;
		}else if(SynChange.length == 0){
			$.ajax({
				type:'POST',
				url:'/?m=system&c=Blacklist&a=BlackListDeletePhone',
				dataType:'text',
				data:{"data":remove},
				success:function(data){	
					if(data > 0){
						mini.showTips({
							content: '删除成功',    
							state: 'success',      //default|success|info|warning|danger
							x: top,          //left|center|right
							y: top,          //top|center|bottom
							timeout: 2000     //自动消失间隔时间。默认2000（2秒）。
						});
						grid1.reload();
						grid1.clearSelect(true);
					}
					
				}
			});
		}
	  }
	}
}
function savePlace(){
	grid2.commitEdit();
    var SynChange = grid2.getChanges();
    var data = mini.decode(SynChange);
	if(data.length > 0){
		var isAjax = true;
		for(var i = 0; i < data.length; i++){
			if(data[i].value == undefined){
			alert("地址不能为空");
			isAjax = false;
			break;
		}
		}
		var data = JSON.stringify(data);
		if(isAjax){
			$.ajax({
		        type:'POST',
		        url:'/?m=system&c=Blacklist&a=BlackListSavePlace',
		        async:false,
		        data:{"data":data},
                success:function(data){
					var data = JSON.parse(data);
					if(data.repeat.length == 0 && data.sum > 0){
						mini.showTips({
					        content: '保存成功',    
                            state: 'success',      //default|success|info|warning|danger
							x: top,          //left|center|right
							y: top,          //top|center|bottom
						    timeout: 2000     //自动消失间隔时间。默认2000（2秒）。
				        });
						grid2.reload();
						grid2.clearSelect(true);
					}else if(data.repeat.length > 0){
						var repeatPhone = "";
						for(var i = 0; i < data.repeat.length; i++){
							repeatPhone += data.repeat[i] +　"&nbsp";
						}
						mini.showMessageBox({
							title: "提示",    
							message: "保存成功",
							buttons: ["ok"],   					
							iconCls: "mini-messagebox-question",
							html: data.sum + "条数据已保存成功" + "<br>" + "(" + repeatPhone + ")<span style='color:red;'>重复，不能重复保存</span>",   
							callback: function(action){
								if(action == "ok"){
									grid2.reload();
									grid2.clearSelect(true);
								}
							}
						});
					}
                    
                }
                });
		}
		
	}
	
}
function removeRowPlace(){
	grid2.commitEdit();
    var SynChange = grid2.getChanges();
    var rows = grid2.getSelecteds();
	if(rows.length == 0){      
		alert("请选择要删除的地址");
	} else if (rows.length > 0) {
		var remove = "";
		for(var i = 0; i < rows.length; i++){   
		    if(rows[i]._state == "added"){ 
				grid2.removeRow(rows[i]);
			}else{ 
			remove += rows[i].id + ",";     
			}
		}
		if(remove != ""){
			//点击删除按钮之后，判断页面是否有以编辑或添加但未保存数据
		if(SynChange.length > 0){
				alert("含有未保存数据，请先保存");
				return false;
		}else if(SynChange.length == 0){
			$.ajax({
				type:'POST',
				url:'/?m=system&c=Blacklist&a=BlackListDeletePlace',
				dataType:'text',
				data:{"data":remove},
				success:function(data){	
					if(data > 0){
						mini.showTips({
							content: '删除成功',    
							state: 'success',      //default|success|info|warning|danger
							x: top,          //left|center|right
							y: top,          //top|center|bottom
							timeout: 2000     //自动消失间隔时间。默认2000（2秒）。
						});
						grid2.reload();
						grid2.clearSelect(true);
					}
					
				}
			});
		}
	  }
	}
}
function saveReceiver(){
	grid3.commitEdit();
    var SynChange = grid3.getChanges();
    var data = mini.decode(SynChange);
	if(data.length > 0){
		var isAjax = true;
		for(var i = 0; i < data.length; i++){
			if(data[i].value == undefined){
			alert("收件人姓名不能为空");
			isAjax = false;
			break;
		}
		}
		var data = JSON.stringify(data);
		if(isAjax){
			$.ajax({
		        type:'POST',
		        url:'/?m=system&c=Blacklist&a=BlackListSaveReceiver',
		        async:false,
		        data:{"data":data},
                success:function(data){
					var data = JSON.parse(data);
					if(data.repeat.length == 0 && data.sum > 0){
						mini.showTips({
					        content: '保存成功',    
                            state: 'success',      //default|success|info|warning|danger
                            x: top,          //left|center|right
							y: top,          //top|center|bottom
							timeout: 2000     //自动消失间隔时间。默认2000（2秒）。
				        });
						grid3.reload();
						grid3.clearSelect(true);
					}else if(data.repeat.length > 0){
						var repeatPhone = "";
						for(var i = 0; i < data.repeat.length; i++){
							repeatPhone += data.repeat[i] +　"&nbsp";
						}
						mini.showMessageBox({
							title: "提示",    
							message: "保存成功",
							buttons: ["ok"],   					
							iconCls: "mini-messagebox-question",
							html: data.sum + "条数据已保存成功" + "<br>" + "(" + repeatPhone + ")<span style='color:red;'>重复，不能重复保存</span>",   
							callback: function(action){
								if(action == "ok"){
									grid3.reload();
									grid3.clearSelect(true);
								}
							}
						});
					}
                    
                }
                });
		}
		
	}
}
function removeRowReceiver(){
	grid3.commitEdit();
    var SynChange = grid3.getChanges();
    var rows = grid3.getSelecteds();
	if(rows.length == 0){      
		alert("请选择要删除的收件人姓名");
	} else if (rows.length > 0) {
		var remove = "";
		for(var i = 0; i < rows.length; i++){   
		    if(rows[i]._state == "added"){ 
				grid3.removeRow(rows[i]);
			}else{ 
			remove += rows[i].id + ",";     
			}
		}
		if(remove != ""){
			//点击删除按钮之后，判断页面是否有以编辑或添加但未保存数据
		if(SynChange.length > 0){
				alert("含有未保存数据，请先保存");
				return false;
		}else if(SynChange.length == 0){
			$.ajax({
				type:'POST',
				url:'/?m=system&c=Blacklist&a=BlackListDeleteReceiver',
				dataType:'text',
				data:{"data":remove},
				success:function(data){	
					if(data > 0){
						mini.showTips({
							content: '删除成功',    
							state: 'success',      //default|success|info|warning|danger
							x: top,          //left|center|right
							y: top,          //top|center|bottom
							timeout: 2000     //自动消失间隔时间。默认2000（2秒）。
						});
						grid3.reload();
						grid3.clearSelect(true);
					}
					
				}
			});
		}
	  }
	}
}
function blackInPut(state){
			var title = "";
			if(state == 'nick'){
				$('#impTOP').html("<input type='button' id='fileTpl' value='下载模板' onclick=\"window.location.href='excelTemplate/黑名单昵称导入.xls?loginact=file'\">");
			}else if(state =='tel'){
				$('#impTOP').html("<input type='button' id='fileTpl' value='下载模板' onclick=\"window.location.href='excelTemplate/黑名单手机号导入.xls?loginact=file'\">");
			}else if(state == 'attr'){
				$('#impTOP').html("<input type='button' id='fileTpl' value='下载模板' onclick=\"window.location.href='excelTemplate/黑名单地址关键字导入.xls?loginact=file'\">");
			}else if(state == 'name'){
				$('#impTOP').html("<input type='button' id='fileTpl' value='下载模板' onclick=\"window.location.href='excelTemplate/黑名单收件人姓名导入.xls?loginact=file'\">");
			}
			switch(state){
				case 'nick':
					title = "昵称导入";
					break;
				case 'tel':
					title = "电话号导入";
					break;
				case 'attr':
					title = "地址导入";
					break;
				case 'name':
					title = "收件人姓名导入";
					break;
				default:
					layer.msg('错误操作', {icon: 2});
					return false;
			}
			$("#fileName").val("");
			$("#fileExcel").val("");
			layer.open({
				type: 1,
				title: title,
				skin: 'layui-layer-rim',
				area: ['700px', '250px'],
				shade: 0.3,
				content: $("#importExcel"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					//采用FormData上传文件
					var fileExcel = $("#fileExcel")[0].files[0];
					var ext = fileExcel['name'].slice(fileExcel['name'].lastIndexOf(".")+1).toLowerCase();  
					if ("xls" != ext) {   
						layer.msg('只能上传Excle文件', {icon: 2});
						return false;
					}  
					if(!fileExcel){
						layer.msg('请选择上传文件', {icon: 2});
						return false;
					}
					var formData = new FormData();
					formData.append("file",fileExcel );
					formData.append("state",state );
					$.ajax({
						url:'/?m=system&c=Blacklist&a=saveImportExcel',
						type: "post",
						data: formData,
						processData: false,
						contentType: false,
						success:function(data){
							if (typeof data == 'string') {
								var data = JSON.parse(data);
							}
							if(data['code'] == 'ok'){
								layer.close(index);
								layer.msg(data['msg'], {icon: 1});
								location.reload(); 
							}else if(data['code'] == 'repeat'){
								var repeatData = data['data'];
								var oHtml = '';
								oHtml += '<table width="90%" align="center" border="1" bgcolor="#bbbbbb" cellspacing="1" cellpadding="1" style="margin-top:10px;margin-left: 5%;">';
								oHtml += '<tr align="center" style="height: 30px;">';
								oHtml += '<td>序号</td>';
								oHtml += '<td>重复黑名单</td>';
								oHtml += '</tr>';
								for(var i=0;i<repeatData.length;i++){
									oHtml += '<tr align="center" style="height: 30px;">';
									oHtml += '<td>'+(i+1)+'</td>';
									oHtml += '<td>'+repeatData[i]+'</td>';
									oHtml += '</tr>';
								}
								oHtml += '</table>';
								layer.open({
									type: 1,
									title: title,
									skin: 'layui-layer-rim',
									area: ['800px', '500px'],
									shade: 0.3,
									content: oHtml,
									btn: ['取消'],
								})
							} else {
								layer.msg(data.msg, {icon: 2});
							}
							switch(state){
								case 'nick':
									dataNickNameLoad.tableLoadFunction();
									break;
								case 'tel':
									dataMobilePhoneLoad.tableLoadFunction();
									break;
								case 'attr':
									dataAttrKeyWordsLoad.tableLoadFunction();
									break;
								case 'name':
									dataNameKeyWordsLoad.tableLoadFunction();
									break;
								default:
									layer.msg('错误操作', {icon: 2});
									return false;
							}
						}
					})	
				}
			})	
}
function selectName(){	//var selectName = document.getElementById("selectName").value;
	var selectName = mini.get("selectName").value;
	grid.load({name:selectName});
}

function selectPlace(){
	var selectPlace = mini.get("selectPlace").value;
	grid2.load({place:selectPlace});
}

function selectReceiver(){
	var selectReceiver = mini.get("selectReceiver").value;
	grid3.load({receiver:selectReceiver});
}

function selectPhone(){
	var selectPhone = mini.get("selectPhone").value;
	grid1.load({phone:selectPhone});
}

function blackGetPut(state){	
	var time = new Date().getTime();
	
	$.ajax({
		url: "/?m=system&c=Blacklist&a=outputExcel&loginact=file",
		type: 'post',
		data: {type: state, time: time},
		dataType: 'text',
		success: function (text){
			$("input[name='order']").iCheck('uncheck');
			$(".inputTe").css("color","white");
			self.isAll = 0;
			self.nowPage = false;
			self.allPage = false;
			if(!text){
				var url = "/xls/Blacklist"+time+".xls?loginact=file";
				$("#ifile").attr('src',url);
			}
		},error: function (jqXHR, textStatus, errorThrown) {
			layer.msg('没有可导出数据',{
				icon: 0,
				time: 2000
			});
		}
	});
	
}

































