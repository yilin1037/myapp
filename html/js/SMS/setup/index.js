var vue = new Vue({
	el: '#vueHtml',
	data: {
		tabOne: '发货提醒',
		tabTwo: '发送日志',
		smsContent: '',
		selectedTyle: 1,
		colorOrange: {
			color: '#FF7700',
		},
		borderOrange: {
			border: '1px solid #FF7700',
		},
		displayNone: {
			display: 'none',
		},
		expressName: 1,
		expressNo: 1,
		orderNum: 0,
		orderYesNum: 0, 
		orderNoNum: 0,
		lineContent: '设置 : (自动对发货的订单发出提醒，提高客户满意程度。同订单只会发送一次)',
		active: {},
	},
	mounted:function(){
		var oWindow = $(window).height();
		//var oTop = $("#tplOperation").offset().top;
		//var oHeight = oWindow-oTop;
		var oHeight = oWindow-350;
		$("#tplOperation").css("height",oHeight+"px !important");
		
		layui.use(['laydate', 'form', 'layer', 'element', 'table'], function(){
			var laydate = layui.laydate 	//日期
				,layer = layui.layer 		//弹层
				,form = layui.form 			//表单
				,element = layui.element 	//元素操作
				,table = layui.table		//表格
				,$ = layui.$;
				
			//日期时间范围
			laydate.render({
				elem: '#timeScope'
				,type: 'time'
				,range: true
			});
			//日期时间范围
			laydate.render({
				elem: '#dateScope'
				,type: 'datetime'
				,range: true
			});
			
			table.render({
				elem: '#dataList'
				,url:'/?m=SMS&c=setup&a=getTplList'
				,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
				,cols: [[
					{type:'numbers', width:80, title: '序号'}
					,{field:'tpl_content', minWidth:200, title: '模板'}
					,{field:'status', width:100, title: '操作', align:'center', toolbar: '#barDemo'}
				]]
				,id: 'dataList'
				,page: true
				,height: 'full-600'
				,limit: 50
			});
			
			table.render({
				elem: '#dataListLog'
				,url:'/?m=SMS&c=setup&a=getTplList'
				,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
				,cols: [[
					{type:'numbers', width:80, title: '序号'}
					,{field:'tpls', width:200, title: '发货时间'}
					,{field:'tpls', width:200, title: '订单号'}
					,{field:'tpls', width:200, title: '手机号码'}
					,{field:'tpls', width:150, title: '发货状态'}
					,{field:'tpls', width:120, title: '短信数字'}
					,{field:'tpls', width:120, title: '短信数量'}
					,{field:'tpl', minWidth:200, title: '短信内容（每70字按1条收费）'}
				]]
				,id: 'dataListLog'
				,page: true
				,height: 'full-200'
				,limit: 50
			});
			
			var active = {
				reload: function(type){
					table.reload('dataList', {
						page: {
							curr: 1
						}
						,where: {
							type: type
						}
					});
				}
			};
			vue.active = active;
			
			//监听工具条
			table.on('tool(dataList)', function(obj){
				var data = obj.data;
				if(obj.event === 'del'){
					layer.confirm('您是如何看待前端开发？', {
						btn: ['重要','奇葩'] //按钮
					}, function(){
						$.ajax({
							url:'/?m=SMS&c=setup&a=delTplContent',
							dataType: 'json',
							type: "post",
							data:{
								id:data['id'],
							},
							success:function(data){
								if(data['code'] == 'ok'){
									layer.msg('删除成功', {icon: 1});
									var num = vue.selectedTyle;
									vue.active['reload']?vue.active['reload'].call(this,num):'';
								}
							}
						})
					}, function(){});
				}
			});
		})
	},
	methods: {
		switchingFunction:function(num){
			var self = this;
			var form = layui.form;
			form.render();
			if(num == '1'){
				self.expressName = 1;
				self.expressNo = 1;
				self.orderNum = 0;
				self.orderYesNum = 0; 
				self.orderNoNum = 0;
				self.lineContent = '设置 : (自动对发货的订单发出提醒，提高客户满意程度。同订单只会发送一次)';
			}else if(num == '2'){
				self.expressName = 0;
				self.expressNo = 0;
				self.orderNum = 0;
				self.orderYesNum = 0; 
				self.orderNoNum = 0;
				self.lineContent = '设置 : (售后-未发货订单情况处理，未能及时发货的订单发送短信，提高客户满意程度。同订单只会发送一次)';
			}else if(num == '3'){
				self.expressName = 0;
				self.expressNo = 0;
				self.orderNum = 0;
				self.orderYesNum = 0; 
				self.orderNoNum = 0;
				self.lineContent = '设置 : (售后-未发货订单情况处理，下架或缺货的订单，发送短信提醒用户退款或者延迟发货。同订单只会发送一次)';
			}else if(num == '4'){
				self.expressName = 1;
				self.expressNo = 1;
				self.orderNum = 0;
				self.orderYesNum = 0; 
				self.orderNoNum = 0;
				self.lineContent = '设置 : (自动对多包裹发货的订单发出提醒，提高客户满意程度。同订单只会发送一次)';
			}else if(num == '5'){
				self.expressName = 0;
				self.expressNo = 0;
				self.orderNum = 1;
				self.orderYesNum = 1; 
				self.orderNoNum = 1;
				self.lineContent = '设置 : (自动对拆单发货的订单发出提醒，提高客户满意程度。同订单只会发送一次)';
			}else if(num == '6'){
				self.expressName = 1;
				self.expressNo = 1;
				self.orderNum = 0;
				self.orderYesNum = 0; 
				self.orderNoNum = 0;
				self.lineContent = '设置 : (自动对售后的订单发出提醒，提高客户满意程度。同订单只会发送一次)';
			}else if(num == '7'){
				self.expressName = 0;
				self.expressNo = 0;
				self.orderNum = 0;
				self.orderYesNum = 0; 
				self.orderNoNum = 0;
				self.lineContent = '设置 : (自动对下单未付款买家发送付款提醒，提高付款转化率。)';
			}else if(num == '8'){
				self.expressName = 0;
				self.expressNo = 0;
				self.orderNum = 0;
				self.orderYesNum = 0; 
				self.orderNoNum = 0;
				self.lineContent = '设置 : (自动对已经确认收货但未评价的订单发出评价提醒，提高评分。)';
			}else if(num == '9'){
				self.selectedTyle = num;
				form.render();
			}
			self.selectedTyle = num;
			if(num<9){
				self.active['reload']?self.active['reload'].call(this,num):'';
			}
		},
		addCont:function(type){
			var self = this;
			var addStr = self.smsContent;
			if(type == "shopName"){
				addStr = addStr + "【店铺名称】";
			}else if(type == "expressName"){
				addStr = addStr + "【物流公司】";
			}else if(type == "buyerName"){
				addStr = addStr + "【买家昵称】";
			}else if(type == "expressNo"){
				addStr = addStr + "【物流单号】";
			}else if(type == "receiverName"){
				addStr = addStr + "【收件人姓名】";
			}else if(type == "orderNum"){
				addStr = addStr + "【订单商品总数量】";
			}else if(type == "orderYesNum"){
				addStr = addStr + "【已发货数量】";
			}else if(type == "orderNoNum"){
				addStr = addStr + "【未发货数量】";
			}
			self.smsContent = addStr;
		},
		saveTpl:function(){
			var self = this;
			var type=self.selectedTyle;
			var tpl_content=self.smsContent;
			$.ajax({
				url:'/?m=SMS&c=setup&a=saveTplContent',
				dataType: 'json',
				type: "post",
				data:{
					type:type,
					tpl_content:tpl_content,
				},
				success:function(data){
					if(data['code'] == 'ok'){
						layer.msg('保存成功', {icon: 1});
						var num = self.selectedTyle;
						self.active['reload']?self.active['reload'].call(this,num):'';
					}
				}
			})
		}
	}
})





























































