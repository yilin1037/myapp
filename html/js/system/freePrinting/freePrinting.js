
var flow = new Vue({
	el: '#flow',
	data: {
		pageNum:0,
		m:0,
		page_m:1,
		data:[],
		layprint:[],
		printTplDzmd:[],
		productNum:0,
		nowPage:false,
		allPage:false,
		isFirst: true,
		expressSort:[],
		defaultMsg:[],
	},
	mounted: function() {
		var self = this;
		//日期选择器
		layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {
            var $ = layui.jquery, element = layui.element, layer = layui.layer ;
            var form = layui.form(),layer = layui.layer,layedit = layui.layedit,laydate = layui.laydate;
            // 初始化表格
            var jqtb = $('#dateTable').DataTable({
                "`dom": '<"top">rt<"bottom"flp><"clear">',
                "autoWidth": false,
				// 自适应宽度
                "paging": true,
                "pagingType": "full_numbers",
                "processing": true,
                "serverSide": true,
				//开启服务器获取数据
                "fnServerParams": function (aoData) {
                },
				//请求url												
                "sAjaxSource": "index.php?m=system&c=message&a=getChildAccount",
                // 初始化表格
            });
        });

		$(document).ready(function(){
			searchALLNow(self,'F');
		});
	},
	methods: {
		resetNow:function(){
			var self = this;
			resetF(self);
		},
		//查询方法
		searchALL:function(){
			var self = this;
			searchALLNow(self,'F');
		},
		page1:function(page){									
			var self = this;
			if(page == "first"){
				self.m = 0;
				self.page_m = 1;
				searchALLNow(self,'page');
			}else if(page == "last"){
				self.m = self.pageNum - 1;
				self.page_m = self.m+1;
				searchALLNow(self,'page');
			}else if(page == "pre" && self.m > 0){
				self.m--;
				self.page_m = self.m+1;
				searchALLNow(self,'page');
			}else if(page == "next" && self.m <= (self.pageNum - 2)){
				self.m++;
				self.page_m = self.m+1;
				searchALLNow(self,'page');
			}
		},
		freePrints:function(order_id){
			var self = this;
			$.ajax({
				url: "/index.php?m=system&c=freePrinting&a=printFace",																																		
				type: 'post',																																												
				data: {order_id: order_id},																																													
				dataType: 'json',																																											
				success: function (data) {
					if(data.code == "ok"){
						self.expressSort = data.expressSort;
						self.printTplDzmd = printTplDzmd;
						doGetPrinters(function(data){																																							
							self.layprint = data;																																								
						});																																														

						$("#layprintFree").val(0);											//-----初始化选择框																										
						$("#layprintTplBqFree").val(0);									//-----初始化选择框																										
						
						$.ajax({																																														
							url: "/index.php?m=system&c=delivery&a=getMianDan",																																		
							type: 'post',																																												
							data: {},																																													
							dataType: 'json',																																											
							success: function (data) {
								if(data.printer != ""){
									$("#printerFree select").val(data.printer);
								}else{
									$("#printerFree select").val(0);
									printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
								}
							}																																															
						});
						
						layer.open({																																											
							type: 1,																																											
							title: "自由打印打面单",																																									
							skin: 'layui-layer-rim', //加上边框																																					
							area: ['1200px', '400px'], //宽高																																					
							shade: 0.3,		
							
							content: $("#facePopFree"),
							cancel: function(index, layero){
								
							}
						});
					}else if(data.code == "error"){
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});
					}
				}																																															
			});
		},
		print_now_free:function(free_order_id,show){
			var self = this;
			self.defaultMsg = [];
			
			if($("#layprintFree").val() != 0){
				var unprintname = $("#layprintFree").val();																																				
			}else{
				layer.msg('请选择打印机！',{
					icon: 2,
					time: 2000
				});
				return																																												
			}																																														
			if($("#layprintTplBqFree").val() != 0){																																						
				var unprintTplBq = $("#layprintTplBqFree").val();																																		
			}else{
				layer.msg('请选择打印模板！',{
					icon: 2,
					time: 2000
				});
				return																																												
			}

			var a = $(event.target);
			a.prop("disabled",true);
			
			$.ajax({
				url: "/index.php?m=system&c=freePrinting&a=printNowFree",																															
				type: 'post',																																								
				data: {free_order_id: free_order_id, show: show, printTpl: unprintTplBq},																																									
				dataType: 'json',																																						
				success: function (data) {
					a.prop("disabled",false);
					if(data.code == 'error'){
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});
						return false;	
					}
					
					if(data.dates && data.dates.length > 0){
						var newData = [];						
						var percent = 0;											
						var num = 0;
						if(show == "F"){
							doGetPrinters(function(){
								newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'F');//订单数据,商品数据，订单详情数据, 预览
								if(unprintname){
									printTpl[unprintTplBq](unprintname,newData);
									self.expressSort = [];
								}
							});
						}else if(show == "show"){
							doGetPrinters(function(){
								newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'T');//订单数据,商品数据，订单详情数据,预览
								if(unprintname){
									printTpl[unprintTplBq](unprintname,newData,true);
								}else{
									layer.msg('打印机不存在,无法预览', {time: 2000, icon:2});
								}
							});
						}
					}																																		
				},
				error: function (jqXHR, textStatus, errorThrown) {
					a.prop("disabled",false);
				}
			});	
		},
		returnPrints:function(order_id){
			var self = this;
			layer.confirm('确认回收单号？', {
				btn: ['确认','取消'] //按钮
			}, function(index){
				$.ajax({
					url: "/index.php?m=system&c=freePrinting&a=returnPrints",																																		
					type: 'post',																																												
					data: {order_id: order_id},																																													
					dataType: 'json',																																											
					success: function (data) {
						if(data.code == 'ok'){
							layer.msg('回收成功',{
								icon: 0,
								time: 2000
							});
							searchALLNow(self,'F');
						}else{
							layer.msg(data.msg,{
								icon: 2,
								time: 2000
							});
						}
					}																																															
				});	
			});
		}
	}						
});

//重置方法封装
function resetF(self){
	$("#dateBegin").val("");
	$("#dateEnd").val("");
	$("#order_id").val("");
	$("#new_tid").val("");
	$("#receiver_name").val("");
	$("#receiver_mobile").val("");
}

//查询方法封装
function searchALLNow(self,page){
	var dateBegin = $("#dateBegin").val();   			//-----开始日期						
	var dateEnd = $("#dateEnd").val();		
	var order_id = $("#order_id").val();
	var new_tid = $("#new_tid").val();
	var receiver_name = $("#receiver_name").val();
	var receiver_mobile = $("#receiver_mobile").val();
	
	var data = {
		"dateBegin": dateBegin,
		"dateEnd": dateEnd,
		"order_id": order_id,
		"new_tid": new_tid,
		"receiver_name": receiver_name,
		"receiver_mobile": receiver_mobile,
	};
	
	$.ajax({
		url: "/index.php?m=system&c=freePrinting&a=getData",
		type: 'post',
		data: {data: data, num: self.m},
		dataType: 'json',
		success: function (data) {
			self.pageNum = Math.ceil(data.pageNum.num / 20);
			self.productNum = data.pageNum.num;
			self.data = data.data;
			
			self.isFirst = false;
			if(self.pageNum == 0){
				self.page_m = 0;
			}else{
				self.page_m = self.m+1;
			}
			
			self.nowPage = false;
			self.allPage = false;
		}
	});
}

function cbPrintView(data){
    var double_row = $("input[name='double_row']").parent().find('.layui-form-checkbox').hasClass('layui-form-checked');
    var width = $("input[name='width']").val() * 8;
    var height = $("input[name='height']").val() * 8;
    if(double_row){
        width = width * 2;
    }
    layer.open({
        type: 1
        ,title: false //不显示标题栏
        ,closeBtn: false
        ,area: ['400px','650px']
        ,shade: 0.8
		,shadeClose:true
        ,id: 'previewImage' //设定一个id，防止重复弹出
        ,btn: ['关闭']
        ,moveType: 1 //拖拽模式，0或者1
        ,content: '<div style="width:'+width+'px;height:'+height+'px;"><img style="width:350px;height:580px;" src="'+data['previewImage'][0]+'" /></div>'
    });
}