var vue = new Vue({
	el: '#vue',
	data: {
		data:[],
		separator :[],
	},
	mounted: function () {
		layui.use(['laydate', 'form', 'laypage', 'layer', 'upload', 'element', 'table'], function () {
			var laydate = layui.laydate //日期
				,laypage = layui.laypage //分页
			layer = layui.layer //弹层
				,upload = layui.upload //上传
				,form = layui.form //表单
				,element = layui.element; //元素操作
			var table = layui.table;

			laydate.render({
				elem: '#last_time'
				,type: 'datetime'
				,value: getNowFormatDate()
				,done: function(value, date){

				}
			});

			laydate.render({
				elem: '#end_time'
				,type: 'datetime'

				,done: function(value, date){
					vueLoad.tableLoadTable('', value);
				}
			});



			$.ajax({
				url: "/index.php?m=system&c=uniqueCheck&a=getseparator",
				type: 'post',
				data: {},
				dataType: 'json',
				success: function (data) {
					vue.separator = data;
				}
			});




		})
	}

});

//js获取yyyy-mm-dd hh:ii:ss格式时间
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
		+ " " + date.getHours() + seperator2 + date.getMinutes()
		+ seperator2 + date.getSeconds();
	return currentdate;
}

function Unique_code_keyup(){
	var Unique_code = $("#Unique_code").val();
	var operator = $("#operator").val();

	$.ajax({
		url:'?m=system&c=InsteadSorting&a=Unique_code_keyup',
		dataType: 'json',
		type: "post",
		data:{
			Unique_code:Unique_code,
			operator:operator,
		},
		success:function(data){
			if(data['code'] == 'ok'){
				$(".start_hidden").css("display","block");
				vue.data = data['msg'];
				speckText("格"+data['msg']['grid']);
			}else{
				vue.data = [];
				layui.use('layer', function(){
					var layer = layui.layer;
					layer.msg(data['msg'],{
						icon: 2,
					});
					speckText(data['msg']);
				});
			}
			$("#Unique_code").val("");
		}
	})
}
$("#reset").click(function(){
	$.ajax({
		url:'?m=system&c=InsteadSorting&a=resetRedis',
		dataType: 'json',
		type: "post",
		data:{},
		success:function(data){
			layui.use('layer', function(){
				var layer = layui.layer;
				layer.msg(data,{
					icon: 1,
				});
			}); 
		}
	})
})

//导出
$("#outputExcel").click(function(){
	var lastTime = $("#last_time").val();
	var endTime = $("#end_time").val();
	var operator = $("#operator").val();
	var url = "?m=system&c=InsteadSorting&a=outputExcel&lastTime="+lastTime+"&endTime="+endTime+"&operator="+operator;
	$("#ifile").attr('src',url);
})