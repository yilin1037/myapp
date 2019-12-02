var flow = new Vue({
	el: '#flow',
	data: {
		index:'storage',
		filter: '-1',
		daifa: '-1',
		item_num: '',
		checkBox:[]
	}
})
layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function(){
	var laydate = layui.laydate //日期
		,laypage = layui.laypage //分页
		layer = layui.layer //弹层
		,upload = layui.upload //上传
		,form = layui.form //表单
		,formSelects = layui.formSelects
		,element = layui.element; //元素操作
	var table = layui.table;	
	formSelects.render();
	
	table.render({
		elem: '#dataList'
		,data: []
		,url: '/?m=WMS&c=waveTime&a=getWaveTimeList'
		,where: { 
		}
		,height: 'full-150'
		,cols: [[ //标题栏
			{type:'numbers', width:100, title: '序号'}
			,{field:'wavename', width:300, title: '策略名称'}
			,{field:'lasttime', width:300, title: '最后修改时间'}
			,{fixed: 'right', width: 300, title: '操作', align: 'center', toolbar: '#barBtn'}
		]]
		,id: 'dataList'
		,skin: 'row' //表格风格
		,even: true
		,page: true //是否显示分页
		,limits: [50, 100, 200]
		,limit: 50 //每页默认显示的数量
	});
	
	table.render({
		elem: '#bomList'
		,data: []
		,url: '/?m=WMS&c=waveTime&a=getBomList'
		,where: { 
		}
		,height: 'full-150'
		,cols: [[ //标题栏
			{type:'numbers', width:100, title: '序号'}
			,{field:'prd_no', width:300, title: '线上套装编码'}
			,{fixed: 'right', width: 120, title: '操作', align: 'center', toolbar: '#bomBarBtn'}
		]]
		,id: 'bomList'
		,skin: 'row' //表格风格
		,even: true
		,page: false //是否显示分页
	});
	
	table.on('tool(bomListEvent)', function(obj){
		var data = obj.data;
		//修改策略
		if(obj.event === 'del'){
			//删除测略
			layer.confirm('确认删除？', {
				btn: ['确认','取消']
			}, function(index, layero){
				var prd_no = data.prd_no;
				$.ajax({
					url:'/?m=WMS&c=waveTime&a=delBom',
					dataType: 'json',
					type: "post",
					data:{
						prd_no:prd_no,
					},
					success:function(data){
						if(data.code == "ok"){
							layui.table.reload('bomList');
							layer.close(index);	
						}else{
							layer.msg(data.msg);
						}
					}
				})
			}, function(){});
		}
	});
	
	table.on('tool(dataListEvent)', function(obj){
		var data = obj.data;
		//修改策略
		if(obj.event === 'edit'){
			outset();  
			readUserType(data);
			layer.open({
				type: 1,
				title: '修改策略',
				skin: 'layui-layer-rim', //加上边框
				area: ['850px', '680px'], //宽高
				shade: 0.3,
				content: $("#edit-pages"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var id = data.id;
					var indexs = flow.index;  //获取选择排序方式
					var filter = flow.filter;  //获取选择待选方式
					var daifa = flow.daifa;
					var item_num = flow.item_num;
					var areaChoose = formSelects.value('select1', 'valStr');

					var checkBox = flow.checkBox;  //获取选择波次分组方式
					
					var waveName = $("#waveName").val();
					if(waveName == ""){
						layer.msg('策略名称不能为空');
					}
					var smallQrder = $("#smallQrder").val();
					if(smallQrder != ""){
						var is = isNumber(smallQrder,"最小订单数");
						if(is == false){
							return false;
						}
					}else{
						layer.msg('最小订单数不能为空');
						return false;
					}
					var everyQrder = $("#everyQrder").val();
					if(everyQrder != ""){
						var is = isNumber(everyQrder,"最多生成波次数");
						if(is == false){
							return false;
						}
					}else{
						layer.msg('最多生成波次数不能为空');
						return false;
					}
					var bigQrder = $("#bigQrder").val();
					if(bigQrder != ""){
						var is = isNumber(bigQrder,"最大订单数");
						if(is == false){
							return false;
						}
					}else{
						layer.msg('最大订单数不能为空');
						return false;
					}
					var filterOne = $("#filterOne").val();
					var filterTwo = $("#filterTwo").val();
					var filterThree = $("#filterThree").val();
					var filterFour = $("#filterFour").val();
					$.ajax({
						url:'/?m=WMS&c=waveTime&a=updateWaveList',
						dataType: 'json',
						type: "post",
						data:{
							id:id,
							waveName:waveName,
							smallQrder:smallQrder,
							everyQrder:everyQrder,
							bigQrder:bigQrder,
							indexs:indexs,
							filter:filter,
							daifa:daifa,
							item_num:item_num,
							checkBox:checkBox,
							filterOne:filterOne,
							filterTwo:filterTwo,
							filterThree:filterThree,
							filterFour:filterFour,
							areaChoose:areaChoose,
						},
						success:function(data){
							if(data.code == "ok"){
								layui.table.reload('dataList');
								layer.close(index);	
							}else{
								layer.msg(data.msg);
							}
						}
					})
				}
			});	
		} else if(obj.event === 'del'){
			//删除测略
			layer.confirm('确认删除？', {
				btn: ['确认','取消']
			}, function(index, layero){
				var id = data.id;
				$.ajax({
					url:'/?m=WMS&c=waveTime&a=delWaveList',
					dataType: 'json',
					type: "post",
					data:{
						id:id,
					},
					success:function(data){
						if(data.code == "ok"){
							layui.table.reload('dataList');
							layer.close(index);	
						}else{
							layer.msg(data.msg);
						}
					}
				})
			}, function(){});
		}
	});
	//初始化多选框
	flow.checkBox.push('1');
	flow.checkBox.push('0');
	flow.checkBox.push('0');
	//console.log(flow.checkBox);
	//波次分组条件
	form.on('checkbox(checkBox)', function(data){
		//console.log(data.elem); //得到checkbox原始DOM对象
		//console.log(data.elem.checked); //是否被选中，true或者false
		//console.log(data.value); //复选框value值，也可以通过data.elem.value得到
		//console.log(data.othis); //得到美化后的DOM对象
		switch(data.elem.value){
			case '0':
				if(data.elem.checked == true){
					flow.checkBox[0] = 1;
				}else{
					flow.checkBox[0] = 0;
				}
				break;
			case '1':
				if(data.elem.checked == true){
					flow.checkBox[1] = 1;
				}else{
					flow.checkBox[1] = 0;
				}
				break;
			case '2':
				if(data.elem.checked == true){
					flow.checkBox[2] = 1;
				}else{
					flow.checkBox[2] = 0;
				}
				break;
		}
	}); 
	//排序
	form.on('radio(index)', function(data){
		//console.log(data.elem); //得到radio原始DOM对象
		//console.log(data.value); //被点击的radio的value值
		flow.index = data.value;
	});
	form.on('radio(item_num)', function(data){
		//console.log(data.elem); //得到radio原始DOM对象
		//console.log(data.value); //被点击的radio的value值
		flow.item_num = data.value;
	});
	//过滤条件
	form.on('checkbox(filter)', function(data){
		//console.log(data.elem); //得到checkbox原始DOM对象
		//console.log(data.elem.checked); //是否被选中，true或者false
		//console.log(data.value); //复选框value值，也可以通过data.elem.value得到
		//console.log(data.othis); //得到美化后的DOM对象
		if(data.value == 1){
			if(flow.filter == 1){
				flow.filter = -1;
				$("#filterCheckboxBom").find(".layui-input-block").find(".layui-form-checkbox").removeClass("layui-form-checked");
			}else if(flow.filter == 0){
				flow.filter = 1;
				$("#filterCheckboxBom").find(".layui-input-block").find(".layui-form-checkbox").removeClass("layui-form-checked");
				$("#filterCheckboxBom").find(".layui-input-block").find(".layui-form-checkbox").eq(0).addClass("layui-form-checked");
			}else{
				$("#filterCheckboxBom").find(".layui-input-block").find(".layui-form-checkbox").removeClass("layui-form-checked");
				$("#filterCheckboxBom").find(".layui-input-block").find(".layui-form-checkbox").eq(0).addClass("layui-form-checked");
				flow.filter = 1;
			}
		}else{
			if(flow.filter == 0){
				flow.filter = -1;
				$("#filterCheckboxBom").find(".layui-input-block").find(".layui-form-checkbox").removeClass("layui-form-checked");
			}else if(flow.filter == 1){
				flow.filter = 0;
				$("#filterCheckboxBom").find(".layui-input-block").find(".layui-form-checkbox").removeClass("layui-form-checked");
				$("#filterCheckboxBom").find(".layui-input-block").find(".layui-form-checkbox").eq(1).addClass("layui-form-checked");
			}else{
				$("#filterCheckboxBom").find(".layui-input-block").find(".layui-form-checkbox").removeClass("layui-form-checked");
				$("#filterCheckboxBom").find(".layui-input-block").find(".layui-form-checkbox").eq(1).addClass("layui-form-checked");
				flow.filter = 0;
			}
		}
		console.log(flow.filter);
	});
	form.on('checkbox(daifa)', function(data){
		//console.log(data.elem); //得到checkbox原始DOM对象
		//console.log(data.elem.checked); //是否被选中，true或者false
		//console.log(data.value); //复选框value值，也可以通过data.elem.value得到
		//console.log(data.othis); //得到美化后的DOM对象
		if(data.value == 1){
			if(flow.daifa == 1){
				flow.daifa = -1;
				$("#filterCheckbox").find(".layui-input-block").find(".layui-form-checkbox").removeClass("layui-form-checked");
			}else if(flow.filter == 0){
				flow.daifa = 1;
				$("#filterCheckbox").find(".layui-input-block").find(".layui-form-checkbox").removeClass("layui-form-checked");
				$("#filterCheckbox").find(".layui-input-block").find(".layui-form-checkbox").eq(0).addClass("layui-form-checked");
			}else{
				$("#filterCheckbox").find(".layui-input-block").find(".layui-form-checkbox").removeClass("layui-form-checked");
				$("#filterCheckbox").find(".layui-input-block").find(".layui-form-checkbox").eq(0).addClass("layui-form-checked");
				flow.daifa = 1;
			}
		}else{
			if(flow.daifa == 0){
				flow.daifa = -1;
				$("#filterCheckbox").find(".layui-input-block").find(".layui-form-checkbox").removeClass("layui-form-checked");
			}else if(flow.daifa == 1){
				flow.daifa = 0;
				$("#filterCheckbox").find(".layui-input-block").find(".layui-form-checkbox").removeClass("layui-form-checked");
				$("#filterCheckbox").find(".layui-input-block").find(".layui-form-checkbox").eq(1).addClass("layui-form-checked");
			}else{
				$("#filterCheckbox").find(".layui-input-block").find(".layui-form-checkbox").removeClass("layui-form-checked");
				$("#filterCheckbox").find(".layui-input-block").find(".layui-form-checkbox").eq(1).addClass("layui-form-checked");
				flow.daifa = 0;
			}
		}
		console.log(flow.daifa);
	});
})

$("#addBom").click(function(){
	//初始化弹框
	layui.table.reload('bomList');
	layer.open({
		type: 1,
		title: '一单一套装货品设置',
		skin: 'layui-layer-rim', //加上边框
		area: ['850px', '680px'], //宽高
		shade: 0.3,
		content: $("#one_bom"),
		btn: ['关闭'],
	});
})

$("#addPrdt").click(function(){
	//初始化弹框
	layer.open({
		title :'选择商品',
		type: 2,
		shade: false,
		area: ['900px', '570px'],
		maxmin: false,
		content: '?m=widget&c=selectProduct&a=index&type=2&param=PRD1'
	}); 
})

function cbProductRows(data,type){
	$.ajax({
		url:'/?m=WMS&c=waveTime&a=saveOneBom',
		dataType: 'json',
		type: "post",
		data:{
			data:JSON.stringify(data),
		},
		success:function(data){
			if(data.code == "ok"){
				layui.table.reload('bomList');
			}else{
				layer.msg(data.msg);
			}
		}
	})
	
}

$("#addWave").click(function(){
	//初始化弹框
	$('#addWaveList')[0].reset();
	outset(); 
	$.ajax({
		url:'/?m=WMS&c=waveTime&a=getLocArea',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			var ohtml = "";
			for(var i=0;i<data.length;i++){
				ohtml += "<option value='"+data[i]['id']+"'>"+data[i]['loc_area']+"</option>";
			}
			$("#areaChoose").html(ohtml);
			//form.render('select');
			formSelects.render({name:'areaChoose'});
		}
	});	
	/*$.ajax({
		url:'/?m=WMS&c=waveTime&a=getLocArea',
		type:"post",
		dataType:"json",
		async:false,
		data: {},
		success: function (data) {
			var proHtml = '';
			var tmp = data;

			proHtml += '<input lay-filter="checkBox" type="checkbox" name="like[write]" title="不限" value="0" checked disabled>';
			for(var i = 0; i < tmp.length; i++)
			{
				proHtml += '<input lay-filter="checkBox" type="checkbox" value="' + tmp[i].loc_area +  '" title="' + tmp[i].loc_area + '">';
			}
			$('#modules').html(proHtml);
		}
	});*/
	layer.open({
		type: 1,
		title: '新增策略',
		skin: 'layui-layer-rim', //加上边框
		area: ['850px', '600px'], //宽高
		shade: 0.3,
		content: $("#edit-pages"),
		btn: ['确定', '取消'],
		yes: function(index, layero){
			var indexs = flow.index;  //获取选择排序方式
			var filter = flow.filter;  //获取选择待选方式
			var daifa = flow.daifa;  //获取选择待选方式
			var checkBox = flow.checkBox;  //获取选择波次分组方式
			var areaChoose = formSelects.value('select1', 'valStr');
			
			var waveName = $("#waveName").val();
			if(waveName == ""){
				layer.msg('策略名称不能为空');
			}
			var smallQrder = $("#smallQrder").val();
			if(smallQrder != ""){
				var is = isNumber(smallQrder,"最小订单数");
				if(is == false){
					return false;
				}
			}else{
				layer.msg('最小订单数不能为空');
				return false;
			}
			var everyQrder = $("#everyQrder").val();
			if(everyQrder != ""){
				var is = isNumber(everyQrder,"最多生成波次数");
				if(is == false){
					return false;
				}
			}else{
				layer.msg('最多生成波次数不能为空');
				return false;
			}
			var bigQrder = $("#bigQrder").val();
			if(bigQrder != ""){
				var is = isNumber(bigQrder,"最大订单数");
				if(is == false){
					return false;
				}
			}else{
				layer.msg('最大订单数不能为空');
				return false;
			}
			var item_num = flow.item_num;
			var filterOne = $("#filterOne").val();
			var filterTwo = $("#filterTwo").val();
			var filterThree = $("#filterThree").val();
			var filterFour = $("#filterFour").val();
			$.ajax({
				url:'/?m=WMS&c=waveTime&a=addWaveList',
				dataType: 'json',
				type: "post",
				data:{
					waveName:waveName,
					smallQrder:smallQrder,
					everyQrder:everyQrder,
					bigQrder:bigQrder,
					indexs:indexs,
					filter:filter,
					daifa:daifa,
					checkBox:checkBox,
					item_num:item_num,
					filterOne:filterOne,
					filterTwo:filterTwo,
					filterThree:filterThree,
					filterFour:filterFour,
					areaChoose:areaChoose,
				},
				success:function(data){
					if(data.code == "ok"){
						layui.table.reload('dataList');
						layer.close(index);	
					}else{
						layer.msg(data.msg);
					}
				}
			})
		}
	});
})
function readUserType(data)
{
	$.ajax({
		url:'/?m=WMS&c=waveTime&a=getLocArea',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data2){
			var ohtml = "";
			for(var i=0;i<data2.length;i++){
				ohtml += "<option value='"+data2[i]['id']+"'>"+data2[i]['loc_area']+"</option>";
			}
			$("#areaChoose").html(ohtml);
			formSelects.render({name:'areaChoose'});
			console.log(data.areaChoose);
			//['0','81','83','85','95','97','99','101','103','105','107','109','111','113','115','117','119','121','123','125']
			formSelects.value('select1',data.areaChoose);
			//formSelects.value('select1',['0','81','83','85','95','97','99','101','103','105','107','109','111','113','115','117','119','121','123','125']);
		}
	});	
	console.log(data);
	var form = layui.form;
	$("#waveName").val(data.wavename);
	$("#smallQrder").val(data.small);
	$("#everyQrder").val(data.every);
	$("#bigQrder").val(data.big);
	
	var checkBox = data.if;
	for(var i=1;i<checkBox.length;i++){
		if(checkBox[i] == '1'){
			$("#checkBox input").eq(i).prop("checked", true);
			flow.checkBox[i] = 1;
		}else{
			$("#checkBox input").eq(i).prop("checked", false);
			flow.checkBox[i] = 0;
		}
	}
	form.render('checkbox');
	var index = data.index;
	$(":radio[name='index'][value='"+index+"']").prop("checked", true);
	var item_num = data.item_num;
	flow.item_num = item_num;
	$(":radio[name='item_num'][value='"+item_num+"']").prop("checked", true);
	var filter = data.filter;
	flow.filter = filter;
	var daifa = data.daifa;
	flow.daifa = daifa;
	if(filter == 1){
		$("#filterList input").eq(0).prop("checked", true);
	}else if(filter == 0){
		$("#filterList input").eq(1).prop("checked", true);
	}
	if(daifa == 1){
		$("#daifaList input").eq(0).prop("checked", true);
	}else if(daifa == 0){
		$("#daifaList input").eq(1).prop("checked", true);
	}
	form.render('radio');
	
	$("#filterOne").val(data.filterOne);
	$("#filterTwo").val(data.filterTwo);
	$("#filterThree").val(data.filterThree);
	$("#filterFour").val(data.filterFour);
}

//初始化layui多选单选框
function outset(){
	$('#addWaveList')[0].reset();
	var form = layui.form;
	$(":radio[name='index'][value='0']").prop("checked", true);
	$(":radio[name='item_num'][value='']").prop("checked", true);
	$("#filterList input").eq(0).prop("checked", false);
	$("#filterList input").eq(1).prop("checked", false);
	$("#daifaList input").eq(0).prop("checked", false);
	$("#daifaList input").eq(1).prop("checked", false);
	form.render('radio');
	$("#checkBox input").eq(1).prop("checked", false);
	$("#checkBox input").eq(2).prop("checked", false);
	form.render('checkbox');
	flow.index = 0;  
	flow.item_num = '';  
	flow.filter = -1;  
	flow.checkBox[1] = 0;
	flow.checkBox[2] = 0;
}

//正则验证是否为大于0整数
function isNumber(value,str) {  
	var patrn = /^[1-9]*[1-9][0-9]*$/;
	if (patrn.exec(value) == null || value == "") {
		layer.msg(str+'为大于零的整数');
		return false;
	}
}