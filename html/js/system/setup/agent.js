mini.parse();

var layer;
layui.use(['layer'], function () {
    layer = layui.layer ;																													
});

var grid = mini.get('grid1');

grid.load();


function removeRow(){
	var rows = grid.getSelecteds();
	if (rows.length > 0) {
		grid.removeRows(rows, true);
	}
}

function saveData(){
	grid.validate();
	
	var data = grid.getChanges();
	var json = mini.encode(data);
	$.ajax({
		url: "/index.php?m=system&c=setup&a=saveShopRemark",
		type: "post",
		dataType: "json",
		data: { submitData: json },
		success: function (json) {
			layer.msg("提交成功！",{
				icon: 1,
				time: 2000
			});
			grid.load();
		}
	});
}

function remark_blur(){
	
	var seller_memo = $('#seller_memo').val();

	$.ajax({
		url: "/index.php?m=system&c=setup&a=saveSellerMemo",
		type: "post",
		dataType: "json",
		cache: false,
		data: {seller_memo: seller_memo},
		success: function (data) {
			if(data.code == 'ok'){
				layer.msg("操作成功",{
					icon: 1,
					time: 2000
				});
				//seller_memo = $("#seller_memo").val("");
				grid.load();
			}else{
				layer.msg("操作失败",{
					icon: 2,
					time: 2000
				});
			}	
		}
	});
}

function add(){
	var buyer_nick = $("#buyer_nick").val();
	var receiver_name = $("#receiver_name").val();
	var receiver_mobile = $("#receiver_mobile").val();
	var receiver_address = $("#receiver_address").val();
	
	if(buyer_nick == ""){
		layer.msg("请填写代理商旺旺",{
				icon: 2,
				time: 2000
		});
		return false;
	}
	if(receiver_name == ""){
		layer.msg("请填写发件人姓名",{
				icon: 2,
				time: 2000
		});
		return false;
	}
	if(receiver_mobile == ""){
		layer.msg("请填写发件人电话",{
				icon: 2,
				time: 2000
		});
		return false;
	}
	
	$.ajax({
		url: "/index.php?m=system&c=setup&a=saveAgentInfo",
		type: 'post',
		data: {buyer_nick:buyer_nick,receiver_name:receiver_name,receiver_mobile:receiver_mobile,receiver_address:receiver_address},
		cache: false,
		dataType:"json",
		success: function (data) {
			if(data.code == "ok"){
				layer.msg("操作成功",{
						icon: 1,
						time: 2000
				});
				buyer_nick = $("#buyer_nick").val("");
				receiver_name = $("#receiver_name").val("");
				receiver_mobile = $("#receiver_mobile").val("");
				receiver_address = $("#receiver_address").val("");
				grid.reload();
			}else{
				layer.msg("操作失败",{
						icon: 2,
						time: 2000
				});
			}
		}
	});
}

function blur(){
	grid.commitEdit();
	var SynChange = grid.getChanges();
	var data = mini.decode(SynChange);
	$.ajax({
		url: "/index.php?m=system&c=setup&a=editSave",
		type: 'post',
		data: {data:data},
		cache: false,
		dataType:"json",
		success: function (data) {
			if(data.code == "ok"){
				layer.msg("操作成功",{
						icon: 1,
						time: 2000
				});
				grid.reload();
			}else{
				
			}
		}
	});
}

function search(){
	var agent_search = $("#agent_search").val();
	grid.load({buyer_nick:agent_search});
}

function remove(){
	grid.commitEdit();
	var data = "";
	var SynChange = grid.getChanges();
	var rows = grid.getSelecteds();
	if(rows.length == 0){  
		layer.msg("请选择至少一条数据",{
				icon: 2,
				time: 2000
		});
		return false;
	}else{
		if(confirm("删除后数据将无法恢复！确定删除么？")){
			for(var i = 0; i < rows.length; i++){
				data += (rows[i].buyer_nick + ",");
			}
			$.ajax({
				url:  "/index.php?m=system&c=setup&a=delData",
				type: 'post',
				data: {data:data},
				cache: false,
				dataType:"json",
				success: function (data) {
					if(data.code == "ok"){
						layer.msg("操作成功",{
								icon: 1,
								time: 2000
						});
						grid.reload();
					}else{
						layer.msg("操作失败",{
								icon: 2,
								time: 2000
						});
					}
				}
			});
		}
	}
	
}

function toExcle(){
	var time = new Date().getTime();
	
	$.ajax({
		url: "/?m=system&c=setup&a=outAgentExcel&loginact=file",
		type: 'post',
		data: {time: time},
		dataType: 'text',
		success: function (text){
			if(!text){
				var url = "/xls/agentInfo"+time+".xls?loginact=file";
				//var url = "/xls/stalls"+time+".xls?loginact=file";
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

function importExcel(){
	$("#fileName").val("");
	$("#fileExcel").val("");
	layer.open({
		type: 1,
		title: '代理商旺旺设置',
		skin: 'layui-layer-rim',
		area: ['490px', '250px'],
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
			$.ajax({
				url:'/?m=system&c=setup&a=saveImportExcel',
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
					} else {
						layer.msg(data.msg, {icon: 2});
					}
					grid.load();
				}
			});	
		}
	});
}
