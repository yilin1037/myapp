
//日期选择器=======================================================================================================
layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {								//=========
	var $ = layui.jquery, element = layui.element, layer = layui.layer ;								//=========
	var form = layui.form(),layer = layui.layer,layedit = layui.layedit,laydate = layui.laydate;		//=========
	// 初始化表格																						//=========
	var jqtb = $('#dateTable').DataTable({																//=========
		"`dom": '<"top">rt<"bottom"flp><"clear">',														//=========
		"autoWidth": false,                     // 自适应宽度											//=========
		"paging": true,																					//=========
		"pagingType": "full_numbers",																	//=========
		"processing": true,																				//=========
		"serverSide": true,//开启服务器获取数据															//=========
		"fnServerParams": function (aoData) {															//=========
		},																								//=========
		//请求url																						//=========
		"sAjaxSource": "index.php?m=system&c=message&a=getChildAccount",								//=========
		// 初始化表格																					//=========
	});																									//=========
																										//=========
});																										//=========
//日期选择器结束===================================================================================================

var sec = 6;

var time = setInterval(function(){
	sec--;
	$(".reciprocal").html(sec + "秒后自动跳转到登录页");
	if(sec == 0){
		clearInterval(time);
		location.href='/index.php?m=system&c=main&a=login';
	}
},1000);

function turnTo(){
	location.href='/index.php?m=system&c=main&a=login';
}

