var jqtb;
var isLoad;
var flow = new Vue({
	el: '#flow',
	data: {
		shop_list: param_object.shop_list,
		this_shop_info: [{shop_type:'',shop_id:'',shop_name:''}],
		time_format: param_object.time_format,
		goods_list: [],
		goods_info:[],
		supplierArr:[],
		BomArr:[],
		nowIndex:'',
		on_id:'',
		sku_id:'',
		num_iid:'',
		prd_id:'',
		prd_no:'',
		title:'',
		unit:'',
		stallArr:[],
		good_change_num_iid:'',
		good_change_sku_id:'',
		elementId:'',
		logArr:[],
		nowIndex:"",
		pageNo:"",				//档口弹窗内页数
		pageCount:"",   		//档口弹窗内总页数
		booth:"",				//档口弹窗内档口查询条件
		shopname:"",			//档口弹窗内店铺名称查询条件
		phone:"",				//档口弹窗内电话号码查询条件
		suitArr:[],				//档口弹窗数据
		this_num_iid:'',		//当前商品
	},
	mounted: function() {
		var self = this;
		
		//==日期选择器==
		//layui 模块 入口
        layui.use(['element', 'layer', 'form', 'layedit', 'laydate'], function () {
            
        });
		//查询当前拥有档口列表
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=getMarketList",										
				type: 'post',																		
				data: {},																	
				dataType: 'json',																	
				success: function (data) {															
					if(data){
						var oHtml = '<option value="">请选择市场</option>';
						for(var i=0;i<data.length;i++){
							oHtml += '<option value="'+data[i]['market']+'">'+data[i]['market']+'</option>';
						}
						$("#marketSelect").html(oHtml);
						form.render('select');
					}
				}																					
			});
	},
	methods: {
		//搜索
		backChange:function(){
			var self = this;
			var value = "";
			$(".shop").each(function(){
				$(this).css("backgroundColor","white");
			});
			if($(event.target)[0].nodeName == "DIV"){
				$(event.target).css("backgroundColor","#bedef3");
				shop_type = $(event.target).attr("shop_type");
				shop_id = $(event.target).attr("shop_id");
				shop_name = $(event.target).attr("shop_name");
			}else if($(event.target)[0].nodeName == "SPAN"){
				$(event.target).parent().css("backgroundColor","#bedef3");
				shop_type = $(event.target).parent().attr("shop_type");
				shop_id = $(event.target).parent().attr("shop_id");
				shop_name = $(event.target).parent().attr("shop_name");
			}
			
			flow.this_shop_info[0].shop_type = shop_type;
			flow.this_shop_info[0].shop_id = shop_id;
			flow.this_shop_info[0].shop_name = shop_name;
			mini.parse();
			var grid = mini.get('datagrid');
			
			grid.load({shop_type: flow.this_shop_info[0].shop_type,shop_id: flow.this_shop_info[0].shop_id});
			if(daina_system_id==""){
				grid.hideColumn("assist_prd");  
			}else{
				grid.showColumn("assist_prd");
			}
			var lastSkuId = '';
			var beginRowIndex = 0;
			marges = [];
			delmarges = [];
			isLoad = 0;
			grid.on("update", function (e) {//计算套装合并
				if(isLoad == 1)
				{
					for(var i = 0; i < e.sender.data.length; i++)
					{
						row = e.sender.data[i];
						var rowIndex = i;
						if (row.sku_id && row.bom_id>0 && row.drawOver != 'T') 
						{
							if(lastSkuId != row.sku_id)
							{
								beginRowIndex = rowIndex;	
								lastSkuId = row.sku_id;
								grid.updateRow(row,{drawOver:'T'});
							}
							else
							{
								grid.updateRow(row,{drawOver:'T'});
								marges.push ({ rowIndex: beginRowIndex, columnIndex: 0, rowSpan: rowIndex - beginRowIndex + 1, colSpan: 1});
								marges.push ({ rowIndex: beginRowIndex, columnIndex: 1, rowSpan: rowIndex - beginRowIndex + 1, colSpan: 1});
								marges.push ({ rowIndex: beginRowIndex, columnIndex: 2, rowSpan: rowIndex - beginRowIndex + 1, colSpan: 1});
								marges.push ({ rowIndex: beginRowIndex, columnIndex: 3, rowSpan: rowIndex - beginRowIndex + 1, colSpan: 1});
								delmarges.push({ rowIndex: beginRowIndex, columnIndex: 0, rowSpan: 1, colSpan: 1});
								delmarges.push({ rowIndex: beginRowIndex, columnIndex: 1, rowSpan: 1, colSpan: 1});
								delmarges.push({ rowIndex: beginRowIndex, columnIndex: 2, rowSpan: 1, colSpan: 1});
								delmarges.push({ rowIndex: beginRowIndex, columnIndex: 3, rowSpan: 1, colSpan: 1});	
								lastSkuId = row.sku_id;
							}
						}
						else
						{
							lastSkuId = row.sku_id;	
						}	
					}
					isLoad = 0;	
					grid.mergeCells(marges);
				}
			})
			grid.on("drawcell", function (e) {
				var record = e.record,
				column = e.column,
				field = e.field,
				row = e.row,
				value = e.value;
				if (row.sku_id) {
					e.cellStyle = "background:#FFFFE0";
				}
	
				if(column.type == 'expandcolumn' && (row.sku_id || row.have_sku != 1))
				{
					e.cellHtml = "";	
				}
				if(field == "replace_prd_no"){
					if(row.sku_id)
					{
						//e.cellHtml = "<input type='text' id='sku_"+ row.on_id +"' name='replace_prd_no' value='"+ row.replace_prd_no +"' style='width:70%;' >" + '<a class="change btn_1" onclick="change(\'prd_'+ row.on_id +'\')">选</a>';
						e.cellHtml = "<input type='text' id='prd_"+ row.on_id +"' name='replace_prd_no' value='"+ row.replace_prd_no +"' style='width:90%;' onblur = 'qinSave(\"sku_"+row.on_id+"\",\"\",\"replace_prd_no\")' >" 

					}
					else
					{
						e.cellHtml = "<input type='text' id='prd_"+ row.on_id +"' name='replace_prd_no' value='"+ row.replace_prd_no +"' style='width:90%;' onblur = 'qinSave(\"prd_"+row.on_id+"\",\"\",\"replace_prd_no\")' >";
						//e.cellHtml = "<input type='text' id='prd_"+ row.on_id +"' name='replace_prd_no' value='"+ row.replace_prd_no +"' style='width:70%;' >" + '<a class="change btn_1" onclick="change(\'prd_'+ row.on_id +'\')">选</a>';
					}
				}
				if(field == "on_outer_id"){
					if(row.shoptype == 'TB'){
						if(row.sku_id){
							e.cellHtml = "<input type='text' id='outer_sku_id_"+ row.on_id +"' name='online_id' value='"+ row.on_outer_id +"' style='width:75%;' >" + '<a class="change btn_1" style="background-color:#1E9FFF;" title="回传商家后台" onclick="outerUpload(\''+ row.shoptype +'\',\'outer_sku_id_'+ row.on_id +'\')">传</a>';
						}else{
							e.cellHtml = "<input type='text' id='outer_id_"+ row.on_id +"' name='online_id' value='"+ row.on_outer_id +"' style='width:75%;' >" + '<a class="change btn_1" style="background-color:#1E9FFF;" title="回传商家后台" onclick="outerUpload(\''+ row.shoptype +'\',\'outer_id_'+ row.on_id +'\')">传</a>';	
						}
				
					}else{
						e.cellHtml = row.on_outer_id;
					}
					if(row.bom_id>0)
					{
						e.cellHtml += "<span class='smallLogo' style='width: 30px; background-color:green; '>套装</span>";	
					}	
					if(row.sku_id)
					{
						e.cellHtml += "<div><button style='font-size: 12px' class='layui-btn layui-btn-mini  layui-btn-success' value='' onclick='setBom(\""+row.on_id+"\",\"stall\",\"\",\""+row.sku_id+"\",\""+row.on_num_iid+"\")'>设置套装</button></div></td>";	
					}
				}
				if(field == "cus_name"){
				
						if(row['cus_name'] != "" && row['cus_name']!=null){
								
							e.cellHtml ="<div><button style='font-size: 12px; margin-left:5%;' class='layui-btn layui-btn-primary' value='"+row['cus_name']+"' onclick='supplier(\""+row.on_id+"\",\""+row.num_iid+"\")'>" + row['cus_name'] +"</button></div><i class='aui_close' onclick='clear_this(\""+row.on_id+"\")'>ဆ</i>";
						}else{
							e.cellHtml = "<div><button style='font-size: 12px; margin-left:30px;' class='layui-btn layui-btn-small layui-btn-danger' value='' onclick='supplier(\""+row.on_id+"\",\""+row.num_iid+"\")'>选择供应商</button></div>";
						}
					
				}
				if(field == "stalls_name"){
						if(row['stalls_name'] != "" && row['stalls_name']!=null){
								
							e.cellHtml ="<div><button style='font-size: 12px; margin-left:5%;' class='layui-btn layui-btn-primary' value='"+row['stalls_name']+"' onclick='chooseStall(\""+row.on_id+"\")'>" + row['stalls_name'] +"</button></div><i class='aui_close' onclick='clear_stall(\""+row.on_id+"\")'>ဆ</i>";
						}else{
							e.cellHtml = "<div><button style='font-size: 12px; margin-left:30px;' class='layui-btn layui-btn-small layui-btn-danger' value='' onclick='chooseStall(\""+row.on_id+"\")'>选择档口</button></div>";
						}
					
				}
				if(field =="assist_prd"){
					if(!row.sku_id){
						e.cellHtml = "<input type='checkbox' "+(row.assist_prd == 1 ? 'checked' : '')+" onclick='updateAssistPrd(\""+row.on_id+"\",this.checked)' style='margin-left:40%;'>";
					}
				}
				if(field =="cid_name"){
					if(!row.sku_id){
						if(row.shoptype == 'TB' || row.shoptype == 'JD'){
							e.cellHtml = row.cid_name;
						}else{
							e.cellHtml = "<input type='text' id='cid_name_"+ row.on_id +"' name='cid_name' value='"+ row.cid_name +"' style='width:80%;' onblur = 'qinSave(\""+row.on_id+"\",\"\",\"cid_name\")' >";
						}
					}
					
				}
				if(field == "cost_price"){
					if(row.sku_id)
					{
						e.cellHtml = "<input type='text' id='prd_"+ row.on_id +"' name='cost_price' value='"+ row.cost_price +"' style='width:90%;' onblur = 'savePrice()' >" 

					}
					else
					{
						e.cellHtml = "<input type='text' id='prd_"+ row.on_id +"' name='cost_price' value='"+ row.cost_price +"' style='width:90%;' onblur = 'savePrice()' >";
					}
				}
				if(field =="goods_no"){
					if(!row.sku_id){
						if(row.shoptype == 'TB' || row.shoptype == 'JD'){
							e.cellHtml = row.goods_no;
						}else{
							e.cellHtml = "<input type='text' id='goods_no_"+ row.on_id +"' name='goods_no' value='"+ row.goods_no +"' style='width:80%;' onblur = 'qinSave(\""+row.on_id+"\",\"\",\"goods_no\")' >";
						}
					}
				}
				if(field =="brand"){
					if(!row.sku_id){
						if(row.shoptype == 'TB' || row.shoptype == 'JD'){
							e.cellHtml = row.brand;
						}else{
							e.cellHtml = "<input type='text' id='brand_"+ row.on_id +"' name='brand' value='"+ row.brand +"' style='width:80%;' onblur = 'qinSave(\""+row.on_id+"\",\"\",\"brand\")'>";
						}
					}
				}
				if(field =="material"){
					if(!row.sku_id){
						if(row.shoptype == 'TB'){
							e.cellHtml = row.material;
						}else{
							e.cellHtml ="<input type='text' id='material_"+ row.on_id +"' name='material' value='"+ row.material +"' style='width:80%;' onblur = 'qinSave(\""+row.on_id+"\",\"\",\"material\")' >";
						}
					}
				}
				if(field =="material_in"){
					if(!row.sku_id){
						e.cellHtml ="<input type='text' id='material_in_"+ row.on_id +"' name='material_in' value='"+ row.material_in +"' style='width:80%;' onblur = 'qinSave(\""+row.on_id+"\",\"\",\"material_in\")' >";
					}
				}
				if(field =="standard"){
					if(!row.sku_id){
						e.cellHtml ="<input type='text' id='standard_"+ row.on_id +"' name='standard' value='"+ row.standard +"' style='width:80%;' onblur = 'qinSave(\""+row.on_id+"\",\"\",\"standard\")' >";
					}
				}
				if(field =="security"){
					if(!row.sku_id){
						e.cellHtml ="<input type='text' id='security_"+ row.on_id +"' name='security' value='"+ row.security +"' style='width:80%;' onblur = 'qinSave(\""+row.on_id+"\",\"\",\"security\")' >";
					}
				}
				if(field =="zj_sku_name"){
					if(row.sku_id){
	
						e.cellHtml ="<input type='text' id='zj_sku_name_"+ row.on_id +"' name='zj_sku_name' style='width:80%;' value='"+ row.zj_sku_name +"' onblur = 'qinSave(\"\",\""+row.on_id+"\",\"zj_sku_name\")' >";
					}
				}
				if(field =="retailPrice"){
					if(!row.sku_id){
						if(row.shoptype == 'TB' || row.shoptype == 'JD'){
							e.cellHtml =row.retailPrice;
						}else{
							e.cellHtml ="<input type='text' id='retailPrice_"+ row.on_id +"' name='retailPrice' value='"+ row.retailPrice +"' style='width:80%;' onblur = 'qinSave(\""+row.on_id+"\",\"\",\"retailPrice\")'  >";
						}
					}
				
				}
				if(field =="binding"){
					if(row.binding =='未绑定'){
							if(row.replace_prd_no!='' || row.outer_iid!=''){
								if(!row.sku_id){
									e.cellHtml = row.binding+'<a class="change btn_1" style="background-color:#1E9FFF;" onclick="Product(\''+ row.on_id +'\')">生成</a>';
								}else{
									e.cellHtml = row.binding;
								}
							}else{
								e.cellHtml = row.binding;
							}
						}else{
							e.cellHtml ="<span style='color:green;'>库存:</span>"+row.qty+'<a class="change btn_1" style="background-color:#1E9FFF;" onclick="Stock(\''+ row.on_outer_id +'\')">入库</a>';
						}
				}
				if(field =="time"){	
					e.cellHtml = '<a class="change btn_1" onclick="log(\'prd_'+ row.on_id +'\')">日志</a>';
				}
			});
		},
		//==更新宝贝弹窗==
		setSkuReplace:function(){
			layer.confirm('确定要生成二级替换编码？选中商品后仅生成选中项，不选中则全店生成，生成规则为(主替换编码或线上主编码)+SKU属性，已有二级替换编码的不会生成', {
				btn: ['确认','取消'] //按钮
			}, function(){
				var grid = mini.get('datagrid');
				var checkList = grid.getSelecteds();
				var resules = [];
				for(var i=0;i<checkList.length;i++){
					var values = checkList[i].on_num_iid;
					if(values.indexOf(",") > 0 ){
						strs = values.split(",");
						resules.push(strs);
					}else{
						resules.push(new Array(values));
					}
				}
				$.ajax({
					url: "/index.php?m=goods&c=newAssociation&a=setSkuReplace",									
					type: 'post',
					data: {data: resules, shopid: flow.this_shop_info[0].shop_id},
					dataType: 'json',
					success: function(result){
						if(result.code == 'ok'){
							layer.msg("生成成功");
							
						}else{
							layer.msg(result.msg);
						}
						
					}
				});
			});	
		},
		deleteSkuReplace:function(){
			layer.confirm('确定批量删除选中的二级替换码', {
				btn: ['确认','取消'] //按钮
			}, function(){
				var grid = mini.get('datagrid');
				var checkList = grid.getSelecteds();
				var resules = [];
				for(var i=0;i<checkList.length;i++){
					var values = checkList[i].on_num_iid;
					if(values.indexOf(",") > 0 ){
						strs = values.split(",");
						resules.push(strs);
					}else{
						resules.push(new Array(values));
					}
				}
				$.ajax({
					url: "/index.php?m=goods&c=newAssociation&a=deleteSkuReplace",									
					type: 'post',
					data: {data: resules, shopid: flow.this_shop_info[0].shop_id},
					dataType: 'json',
					success: function(result){
						if(result.code == 'ok'){
							layer.msg("删除成功");
							
						}else{
							layer.msg(result.msg);
						}
						
					}
				});
			});	
		},
		//新增供应商弹窗
		AddSupp:function(){
			var self = this;
			layer.open({																																											
				type: 1,																																											
				title: '新增供应商',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['748px', '420px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#addSupplier"),	
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var cus_no = $("#add_no").val();
					var cus_name = $("#add_name").val();
					var mobile = $("#add_mobile").val();
					var linkman = $("#add_linkman").val();
					var wangwang = $("#add_wangwang").val();
					var qq = $("#add_qq").val();
					var weixin = $("#add_weixin").val();
					
					if(cus_name == ""){
						layer.msg('请输入供应商名称',{
							icon: 0,
							time: 2000
						});																																													
						return false;
					}
					
					if(mobile == ""){
						layer.msg('请输入供应商电话',{
							icon: 0,
							time: 2000
						});																																													
						return false;
					}
					
					$.ajax({
						url: "/index.php?m=system&c=stall_navigation&a=save_new",
						data: {cus_no:cus_no,cus_name:cus_name,linkman:linkman,qq:qq,wangwang:wangwang,weixin:weixin,mobile:mobile},
						dataType: "json",
						type: "POST",
						success: function (data) {
							if(data.code == "ok"){
								$("#add_no").val('');
								$("#add_name").val('');
								$("#add_mobile").val('');
								$("#add_linkman").val('');
								$("#add_wangwang").val('');
								$("#add_qq").val('');
								$("#add_weixin").val('');
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								layui.use(['table','element','layer','form','laydate'], function(){
								  var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
								  var laydate = layui.laydate;
								  self.tab.reload();
								});
								layer.close(index);
							}else{
								layer.msg(data.msg,{
									icon: 0,
									time: 2000
								});
							}
						}
					});
					
				}
				,btn2: function(index, layero){
					//按钮【按钮二】的回调
					//return false 开启该代码可禁止点击该按钮关闭
				},
				cancel: function (index, layero) {																																					
																																																	
				},
				success:function(){
			
				},

			});
		},
		//新增套装弹窗
		Addcoordinates:function(){
			var self = this;
			$(" input[ name='prd_nos' ] ").val("");
			$(" input[ name='bom_title' ] ").val("");
　			$(" input[ name='sku_names' ] ").val("");
			var lock = false;
			layer.open({																																											
				type: 1,																																											
				title: '新增套装',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['500px', '300px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#Addcoordinates"),	
				btn: ['确定', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var prd_no = $("#prd_nos").val();
					var bom_title = $("#bom_title").val();
					var sku_name = $("#sku_names").val();	
					if(prd_no == ""){
						layer.msg('请输入配货款号',{
							icon: 0,
							time: 2000
						});																																													
						return false;
					}
					
					if(sku_name == ""){
						layer.msg('请输入销售属性',{
							icon: 0,
							time: 2000
						});																																													
						return false;
					}
					var num_iid = flow.num_iid;
					var sku_id = flow.sku_id;
					if(!lock){
						lock = true;
						$.ajax({
							url: "/index.php?m=goods&c=newAssociation&a=setAddBom",
							data: {sku_id:sku_id,num_iid:num_iid,bom_title:bom_title,sku_name:sku_name,prd_no:prd_no},
							dataType: "json",
							type: "POST",
							success: function (data) {
								if(data.code == "ok"){
									layer.msg('操作成功',{
										icon: 1,
										time: 2000
									});
									layer.close(index);
									flow.getBom(sku_id,num_iid);
								}else{
									layer.msg('操作失败',{
										icon: 0,
										time: 2000
									});
								}
							}
						});
					}
					
				}
				,btn2: function(index, layero){
					//按钮【按钮二】的回调
					//return false 开启该代码可禁止点击该按钮关闭
				},
				cancel: function (index, layero) {																																					
																																														
				},
				success:function(){
				},
				
					
			});
		},
		//选择档口弹窗里的 选择档口按钮
		chooseThisStall:function(id){
			var self = this;
			var sku_id = self.sku_id;
			var num_iid = self.num_iid;

			$.ajax({																				
				url: "/index.php?m=goods&c=newAssociation&a=SetStall",										
				type: 'post',																		
				data:{id:id,on_id:self.on_id,sku_id:self.sku_id,num_iid:self.num_iid},
				dataType: 'json',
				async:false, 				
				success: function (data) {															
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						if(data.status ==2){
							layer.close(self.nowIndex);
							showRowDetail();
						}else{
							layer.close(self.nowIndex);
							mini.parse();
							var grid = mini.get('datagrid');
							grid.reload();
						}
					}else{
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						if(data.status ==2){
							showRowDetail();
							layer.close(self.nowIndex);
						}else{
							layer.close(self.nowIndex);
							mini.parse();
							var grid = mini.get('datagrid');
							grid.reload();
						}
					}																			
				}																					
			});
			
			
			
			layer.close(self.nowIndex);
			
		},
		getBom:function(sku_id){
			var self = this;
			$.ajax({
				url:'/index.php?m=goods&c=newAssociation&a=getBom',
				dataType: 'json',
				type: "post",
				data: {sku_id:sku_id,num_iid:num_iid},	
				success:function(data){
					if(data!= 0){
						self.BomArr = data;
					}else{
						self.BomArr = "";
					}
				}
			})
		},
		getCustTable:function(curr,a,b,num_iid){
			var self = this;
			var custName = $("#custName").val();
			$.ajax({
				url:'/index.php?m=goods&c=newAssociation&a=getCustTable',
				dataType: 'json',
				type: "post",
				data:{
					custName:custName,
					num_iid:num_iid
				},
				success:function(data){
					if(data!= 0){
						self.supplierArr = data;
					}else{
						layer.msg("没有查询到数据",{

						});
						self.supplierArr = "";
					}
				}
			})
			
		},
		getCustTables:function(curr){
			var self = this;
			var custName = $("#custNames").val();
			$.ajax({
				url:'/index.php?m=goods&c=newAssociation&a=getCustTable',
				dataType: 'json',
				type: "post",
				data:{
					custName:custName
				},
				success:function(data){
					if(data!= 0){
						self.supplierArr = data;
					}else{
						layer.msg("没有查询到数据",{

						});
						self.supplierArr = "";
					}
				}
			})
			
		},
		stallSearch:function(){
			var self = this;
			var marketSelect = $("#marketSelect").val();
			var booth = $("#booth").val();
			self.marketSelect = marketSelect;
			self.booth = booth;
			self.getStall(marketSelect,booth,1);
		},
		//=================================================================================== 获取档口数据 =================================================================================================
		getStall:function(marketSelect,booth,curr){
			var self = this;
			
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=getStall",										
				type: 'post',
				data: {marketSelect:marketSelect,booth:booth,curr:curr},																	
				dataType: 'json',																	
				success: function (data) {															
					if(data.result != 0){
						self.stallArr = data.result;
						self.pageCount = Math.ceil(data.pageNum / 10);
						self.pageNo = curr;
					}else{
						layer.msg("没有查询到数据",{
							icon: 2,
							time: 2000
						});
						self.stallArr = "";
						self.pageCount = 0;
						self.pageNo = 0;
					}																			
				}																					
			});	
		},
		//================================================================================= 获取档口数据结束 ===============================================================================================
		chooseThis:function(id){
			var self = this;
			$.ajax({																				
				url: "/index.php?m=goods&c=newAssociation&a=Setsupplier",										
				type: 'post',																		
				data: {id:id,on_id:self.on_id,sku_id:self.sku_id,num_iid:self.num_iid},																	
				dataType: 'json',
				async:false, 				
				success: function (data) {															
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						if(data.status ==2){
							layer.close(self.nowIndex);
							showRowDetail();
						}else{
							layer.close(self.nowIndex);
							mini.parse();
							var grid = mini.get('datagrid');
							grid.reload();
						}
					}else{
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						if(data.status ==2){
							showRowDetail();
							layer.close(self.nowIndex);
						}else{
							layer.close(self.nowIndex);
							mini.parse();
							var grid = mini.get('datagrid');
							grid.reload();
						}
					}																			
				}																					
			});
		
		},
		ajaxCostPrice:function(e,id,bid,goods_id){
			//supplierArr
           	var self = this;
	        var val = e.target.value;
            $.ajax({																				
				url: "/index.php?m=goods&c=newAssociation&a=SetCostPrice",										
				type: 'post',																		
				data: {id:id,bid:bid,value:val,goods_id:goods_id},																	
				dataType: 'json',
				async:false, 				
				success: function (data) {															
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
					}else{
						layer.msg(data.msg,{
							icon: 2,
							time: 2000
						});
					}																			
				}																					
			});
        },
		chooseThiss:function(id){
			var self = this;
			var sku_id = self.sku_id;
			var num_iid = self.num_iid;
			$.ajax({																				
				url: "/index.php?m=goods&c=newAssociation&a=Setsuppliers",										
				type: 'post',																		
				data: {id:id,on_id:self.on_id},																	
				dataType: 'json',
				async:false, 				
				success: function (data) {															
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						layer.close(self.nowIndex);
						flow.getBom(sku_id,num_iid);
					}else{
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
					}																			
				}																					
			});
		
		},
		setSkuReplaceSupply:function(){
			layer.confirm('确定要生成二级替换编码？此功能仅会将二级编码为空的商品生成二级替换编码，生成规则为(主替换编码或线上主编码)+SKU属性，已有二级替换编码的不会生成', {
				btn: ['确认','取消'] //按钮
			}, function(){
				$.ajax({
					url: "/index.php?m=goods&c=newAssociation&a=setSkuReplaceSupply",									
					type: 'post',
					data: {shopid: flow.this_shop_info[0].shop_id},
					dataType: 'json',
					success: function(result){
						if(result.code == 'ok'){
							layer.msg("生成成功");
							mini.parse();
							var grid = mini.get('');
							grid.reload();
						}else{
							layer.msg(result.msg);
						}
						
					}
				});
			});	
		},
		log:function(elementId){
			var self = this;
			
			$.ajax({																																														
				url: "/index.php?m=goods&c=newAssociation&a=getLog",																																		
				type: 'post',																																												
				data: {elementId: elementId},																																													
				dataType: 'json',																																											
				success: function (data) {
					self.logArr = data;
				}																																															
			});
			
			layer.open({																																											
				type: 1,																																											
				title: '操作日志',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['1200px', '400px'], //宽高																																					
				shade: 0.3,																																											
				content: $("#log")																																													
			});
		},
		Stock:function(elementId){
			var html = "<div id='choose_stock'>" +  					
						   "<button class='layui-btn layui-btn-normal' onclick=\"gethotLoc('"+elementId+"')\" style='margin-top:15%;margin-left:3%;'>爆款入库</button>" +
						   "<button class='layui-btn layui-btn-normal' onclick=\"getotherOut('"+elementId+"')\" style='margin-top:15%;'>普通入库</button>" +
						   "<button class='layui-btn layui-btn-normal' onclick=\"getpurchase('"+elementId+"')\" style='margin-top:15%;'>采购入库</button>" +
					  "</div>"

			layer.open({																																											
				type: 1,																																											
				title: '选择入库',																																									
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['310px', '200px'], //宽高																																					
				shade: 0.3,																																											
				content: html																																												
			});
		},
		Product:function(elementId){
			$.ajax({
				url: "/index.php?m=goods&c=newAssociation&a=product_goods",									
				type: 'post',
				data:{data: elementId},
				dataType: 'json',
				success: function(result){
					layer.msg(result.msg);
					mini.parse();
					var grid = mini.get('datagrid');
					grid.reload();
				},
				error:function(a,b,c){
					setTimeout(function(){
						clearInterval(Interval);
					},1000);
								
					layer.close(index);
						layer.msg("下载异常");
					}
			});
			
		},
		updateGoods:function(){
			$("#htmlInfo").val('');
			
			layer.open({
				type: 1,
				title: '从店铺下载商品信息!!',
				skin: 'layui-layer-rim', //加上边框
				area: ['660px', '500px'], //宽高
				shade: 0.3,
				content: $("#edit-pages1"),
				btn: ['仅更新', '更新并生成商品'],
				success: function() {
					$(".good_id").val("");
					$("#show_name").val(flow.this_shop_info[0].shop_name);
					
					$("input[name='day']").on('ifChecked ifUnchecked', function(event){
						if ($(this).val() == "today") {
							$("#dateBegin").val(flow.time_format.today.start_time);
							$("#dateEnd").val(flow.time_format.today.end_time);
						} else if($(this).val() == "thirth") {
							$("#dateBegin").val(flow.time_format.thirth.start_time);
							$("#dateEnd").val(flow.time_format.thirth.end_time);
						}
					});
					$("input[name='day']").eq(0).iCheck('check');
					$("input[name='day']").eq(1).iCheck('check');
				},
				yes: function(index, layero){
					//按钮【按钮一】的回调
					var Interval = setInterval(function(){
						$.ajax({																																														
							url: "/index.php?m=goods&c=newAssociation&a=getOrderProgress",																																		
							type: 'post',																																																																																								
							dataType: 'text',																																											
							success: function (text) {
								$("#htmlInfo").val(text);
							},error: function(){
								clearInterval(Interval);
							}
						});
					},1000);
					
					var data = $("#update_goods_form").serializeArray();
						data.push({name:'shop_type',value:flow.this_shop_info[0].shop_type});
						data.push({name:'shop_id',value:flow.this_shop_info[0].shop_id});
					var index = layer.load(0, {shade: false});
					$.ajax({
						url: "/index.php?m=goods&c=newAssociation&a=update_goods",									
						type: 'post',
						data: data,
						dataType: 'json',
						success: function(result){
							setTimeout(function(){
								clearInterval(Interval);
							},1000);
							
							layer.close(index);
							if(result.status == 1){
								//$("#update_goods_form").reset();
								mini.parse();
								var grid = mini.get('datagrid');
								grid.reload();
								//searchAll();
								layer.msg(result.msg);
							}else{
								layer.msg(result.msg);
							}
						},
						error:function(a,b,c){
							setTimeout(function(){
								clearInterval(Interval);
							},1000);
							
							layer.close(index);
							layer.msg("下载异常");
						}
					});
				},btn2: function(index, layero){
					//按钮【按钮二】的回调
					var Interval = setInterval(function(){
						$.ajax({																																														
							url: "/index.php?m=goods&c=newAssociation&a=getOrderProgress",																																		
							type: 'post',																																																																																								
							dataType: 'text',																																											
							success: function (text) {
								$("#htmlInfo").val(text);
							},error: function(){
								clearInterval(Interval);
							}
						});
					},1000);
					
					var data = $("#update_goods_form").serializeArray();
						data.push({name:'shop_type',value:flow.this_shop_info[0].shop_type});
						data.push({name:'shop_id',value:flow.this_shop_info[0].shop_id});
						data.push({name:'create_goods',value:'T'});
					var index = layer.load(0, {shade: false});
					$.ajax({
						url: "/index.php?m=goods&c=newAssociation&a=update_goods",									
						type: 'post',
						data: data,
						dataType: 'json',
						success: function(result){
							setTimeout(function(){
								clearInterval(Interval);
							},1000);
							
							layer.close(index);
							if(result.status == 1){
								//$("#update_goods_form").reset();
								mini.parse();
								var grid = mini.get('datagrid');
								grid.reload();
								layer.msg(result.msg);
							}else{
								layer.msg(result.msg);
							}
						},
						error:function(a,b,c){
							setTimeout(function(){
								clearInterval(Interval);
							},1000);
							
							layer.close(index);
							layer.msg("下载异常");
						}
					});
					return false; //开启该代码可禁止点击该按钮关闭
				},
				/*btn3: function(index, layero){
					//按钮【按钮二】的回调
					var data = $("#update_goods_form").serializeArray();
						data.push({name:'shop_type',value:flow.this_shop_info[0].shop_type});
						data.push({name:'shop_id',value:flow.this_shop_info[0].shop_id});
						data.push({name:'cannot_rela',value:'T'});
						data.push({name:'create_goods',value:'T'});
					var index = layer.load(0, {shade: false});
					$.ajax({
						url: "/index.php?m=goods&c=newAssociation&a=update_goods",									
						type: 'post',
						data: data,
						dataType: 'json',
						success: function(result){
							layer.close(index);
							if(result.status == 1){
								//$("#update_goods_form").reset();
								jqtb.ajax.reload();
								layer.msg(result.msg);
							}else{
								layer.msg(result.msg);
							}
						}
					});
					return false; //开启该代码可禁止点击该按钮关闭
				},*/
				cancel: function (index, layero) {
					
				}
			});
		},
		//==更新宝贝弹窗结束==
		
		//==批量解绑==
		deleteList:function(){
			layer.confirm('确定删除选中？', {
				btn: ['确认','取消'] //按钮
			}, function(){
				mini.parse();
				var grid = mini.get('datagrid');
				var checkList = grid.getSelecteds();
				var resules = [];
				for(var i=0;i<checkList.length;i++){			
					var values = checkList[i].on_num_iid;
					if(values.indexOf(",") > 0 ){
						strs = values.split(",");
						resules.push(strs);
					}else{
						resules.push(new Array(values));
					}
				}
				if(resules.length == 0){
					layer.msg("请选择删除数据");
					return false;
				}

				$.ajax({
					url: "/index.php?m=goods&c=newAssociation&a=deleteSkus",									
					type: 'post',
					data: {data: resules},
					dataType: 'json',
					success: function(result){
						//console.log(result);
						if(result.code == 'ok'){
							layer.msg(result.msg);
							mini.parse();
							var grid = mini.get('datagrid');
							grid.reload();
						}else{
							layer.msg(result.msg);
						}
						
					}
				});
			});
		},
		deleteListAll:function(){
			layer.confirm('确定删除全店绑定关系？', {
				btn: ['确认','取消'] //按钮
			}, function(){
				var shopid = flow.this_shop_info[0].shop_id;

				$.ajax({
					url: "/index.php?m=goods&c=newAssociation&a=deleteSkusAll",									
					type: 'post',
					data: {shopid: shopid},
					dataType: 'json',
					success: function(result){
						//console.log(result);
						if(result.code == 'ok'){
							layer.msg(result.msg);
							mini.parse();
							var grid = mini.get('datagrid');
							grid.reload();
						}else{
							layer.msg(result.msg);
						}
						
					}
				});
			});
		},
		resetStall:function(){
			$("#booth").val("");
			var form = layui.form();
			$.ajax({																				
				url: "/index.php?m=goods&c=association&a=getMarketList",										
				type: 'post',																		
				data: {},																	
				dataType: 'json',																	
				success: function (data) {															
					if(data){
						var oHtml = '<option value="">请选择市场</option>';
						for(var i=0;i<data.length;i++){
							oHtml += '<option value="'+data[i]['market']+'">'+data[i]['market']+'</option>';
						}
						$("#marketSelect").html(oHtml);
						form.render('select');
					}
				}																					
			});
		},
		//批量设置质检信息
		setInsList:function(){
			$("#setInsListForm")[0].reset();
			var self = this;
			layer.open({
				type: 1,
				title: '批量设置质检信息',
				skin: 'layui-layer-rim',
				area: ['550px', '350px'],
				shade: 0.3,
				content: $("#setInsListBox"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					//var checkList = $('input:checkbox[name=checkList]:checked');
					//console.log(checkList);
					mini.parse();
					var grid = mini.get('datagrid');
					var checkList = grid.getSelecteds();
					var resules = [];
					for(var i=0;i<checkList.length;i++){
						var values = checkList[i].on_num_iid;
						if(values.indexOf(",") > 0 ){
							strs = values.split(",");
							resules.push(strs);
						}else{
							resules.push(new Array(values));
						}
					}
					//console.log(resules);
					if(resules.length == 0){
						layer.msg("请选择修改数据", {icon: 2});
						return false;
					}
					var allSetKey = $("#allSetKey").val();
					if(allSetKey == ""){
						layer.msg("请选择修改数据", {icon: 2});
						return false;
					}
					var allSetValue = $("#allSetValue").val();
					if(allSetValue == ""){
						layer.msg("请选择修改数据", {icon: 2});
						return false;
					}
					self.setAllInsInfor(resules,'isPage',allSetKey,allSetValue);
					layer.close(index);
				}
			});
		},
		//设置全部质检信息
		setInsListAll:function(){
			$("#setInsListForm")[0].reset();
			var self = this;
			layer.open({
				type: 1,
				title: '设置全部质检信息',
				skin: 'layui-layer-rim',
				area: ['550px', '350px'],
				shade: 0.3,
				content: $("#setInsListBox"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var shopid = flow.this_shop_info[0].shop_id;
					var allSetKey = $("#allSetKey").val();
					if(allSetKey == ""){
						layer.msg("请选择修改数据", {icon: 2});
						return false;
					}
					var allSetValue = $("#allSetValue").val();
					if(allSetValue == ""){
						layer.msg("请选择修改数据", {icon: 2});
						return false;
					}
					self.setAllInsInfor(shopid,'isAll',allSetKey,allSetValue);
					layer.close(index);
				}
			});
		},
		//批量设置代拿商品
		setBatchDaiNa:function(dataType){
			var self = this;
			mini.parse();
			var grid = mini.get('datagrid');
			var checkList = grid.getSelecteds();			
			//确认提示
			var oHtml = "";
			if(dataType == "true"){
				oHtml = '您确认将选择商品设为代拿？';
			}else{
				oHtml = '您确认将选择商品取消代拿？';
			}
			
			layer.confirm(oHtml, {
				btn: ['确认','取消'] //按钮
			}, function(index, layero){
					var resules = [];
					for(var i=0;i<checkList.length;i++){
						var values = checkList[i].on_id;
						if(values.indexOf(",") > 0 ){
							strs = values.split(",");
							resules.push(strs);
						}else{
							resules.push(new Array(values));
						}
					}
					if(resules.length == 0){
						layer.msg("请选择设置数据");
						return false;
					}
					resules = resules.join(",");
				$.ajax({
					url: "/index.php?m=goods&c=newAssociation&a=updateAgent",
					type: 'post',
					data: {on_id:resules, assist_prd:dataType, isAll:self.isAll},
					dataType: 'json',
					success: function (result) {
						if(result.code == 'ok'){
							layer.msg("修改成功",{
								icon: 1,
								time: 2000
							});
							grid.reload();
						}else{
							layer.msg("修改失败",{
								icon: 2,
								time: 2000
							});
						}
					}	
				});
				layer.close(index);
			}, function(){});
		},
		//全部页设置代拿商品
		setAllBatchDaiNa:function(dataType){
			var self = this;
		
			var shopid = flow.this_shop_info[0].shop_id;
			var grid = mini.get('datagrid');
						
			//确认提示
			var oHtml = "";
			if(dataType == "true"){
				oHtml = '您确认将全店商品设为代拿？';
			}else{
				oHtml = '您确认将全店商品取消代拿？';
			}
			
			layer.confirm(oHtml, {
				btn: ['确认','取消'] //按钮
			}, function(index, layero){
				$.ajax({
					url: "/index.php?m=goods&c=newAssociation&a=updateAgentAll",
					type: 'post',
					data: {shopid:shopid, assist_prd:dataType},
					dataType: 'json',
					success: function (result) {
						if(result.code == 'ok'){
							layer.msg("修改成功",{
								icon: 1,
								time: 2000
							});
							grid.reload();
						}else{
							layer.msg("修改失败",{
								icon: 2,
								time: 2000
							});
						}
					}	
				});
				layer.close(index);
			}, function(){});
		},
		setAllInsInfor:function(data,type,key,value){
			//this_shop_info: [{shop_type:'',shop_id:'',shop_name:''}],
			var shop_info = flow.this_shop_info;
			$.ajax({
				url: "/index.php?m=goods&c=newAssociation&a=setAllInsInfor",									
				type: 'post',
				data: {
					data:data,
					type:type,
					key:key,
					value:value,
					shop_info:shop_info,
				},
				dataType: 'json',
				success: function(result){
					if(result['code'] == 'ok'){
						mini.parse();
						var grid = mini.get('datagrid');
						grid.reload();
					}
					layer.msg(result['msg']);
				}
			});
		},
		toExcel:function(){
			var self = this;
			//var checkList = $('input:checkbox[name=checkList]:checked');
			mini.parse();
			var grid = mini.get('datagrid');
			var checkList = grid.getSelecteds();
			var resules = [];
			for(var i=0;i<checkList.length;i++){
				var values = checkList[i].on_num_iid;
				if(values.indexOf(",") > 0 ){
					strs = values.split(",");
					resules.push(strs);
				}else{
					resules.push(new Array(values));
				}
			}
			if(resules.length == 0){
				layer.msg("请选择导出数据");
				return false;
			}
			self.toExcelFunction(resules,'isPage');
			
		},
		toExcelAll:function(){
			var self = this;
			var shopid = flow.this_shop_info[0].shop_id;
			self.toExcelFunction(shopid,'isAll');
		},
		toExcelFunction:function(data,type){
			var time = new Date().getTime();
			$.ajax({
				url: "/index.php?m=goods&c=newAssociation&a=toExcelFunction&loginact=file",									
				type: 'post',
				data: {
					data:data,
					type:type,
					time:time,
				},
				dataType: 'text',
				success: function(result){
					//console.log(result);
					if(result){
						layer.msg('导出失败',{
							icon: 0,
							time: 2000
						});
					}else{
						var url = "/xls/WaitSendorders"+time+".xls?loginact=file";
						$("#ifile").attr('src',url);
					}
				},error: function (jqXHR, textStatus, errorThrown) {
					layer.msg('jqXHR.responseText',{
						icon: 0,
						time: 2000
					});
				}
			});
		},
		checkLists:function(){
			layer.confirm('确定解绑选中商品？', {
				btn: ['确认','取消'] //按钮
			}, function(){
				var checkList = $('input:checkbox[name=checkList]:checked');
				var resules = [];
				for(var i=0;i<checkList.length;i++){
					//console.log(checkList.eq(i).val());
					var values = checkList.eq(i).val();
					if(values.indexOf(",") > 0 ){
						strs = values.split(",");
						resules.push(strs);
					}else{
						resules.push(new Array(values));
					}
				}
				if(resules.length == 0){
					layer.msg("请选择解绑物品");
					return false;
				}
				$.ajax({
					url: "/index.php?m=goods&c=newAssociation&a=relieveSkus",									
					type: 'post',
					data: {data: resules},
					dataType: 'json',
					success: function(result){
						//console.log(result);
						if(result.code == 'ok'){
							layer.msg(result.msg);
							mini.parse();
							var grid = mini.get('datagrid');
							grid.reload();
						}else{
							layer.msg(result.msg);
						}
						
					}
				});
			});
		},
		checkListsAll:function(){
			layer.confirm('确定解绑全店商品？', {
				btn: ['确认','取消'] //按钮
			}, function(){
				var shop_id = flow.this_shop_info[0].shop_id;
				
				$.ajax({
					url: "/index.php?m=goods&c=newAssociation&a=relieveSkusAll",									
					type: 'post',
					data: {shop_id: shop_id},
					dataType: 'json',
					success: function(result){
						if(result.code == 'ok'){
							layer.msg(result.msg);
							mini.parse();
							var grid = mini.get('datagrid');
							grid.reload();
						}else{
							layer.msg(result.msg);
						}
						
					}
				});
			});
		},
		saveGrid:function(){
			var requestData = [];
			$("input[name='replace_prd_no']").each(function(){
				var on_id = $(this)[0]['id'].slice(4);
				requestData.push({id: $(this)[0]['id'], 
								  val: $(this).val(), 
								  goods_no: $("#goods_no_" + on_id).val(),
								  brand: $("#brand_" + on_id).val(),
								  material: $("#material_" + on_id).val(),
								  material_in: $("#material_in_" + on_id).val(),
								  standard: $("#standard_" + on_id).val(),
								  security: $("#security_" + on_id).val(),
								  cid_name: $("#cid_name_" + on_id).val(),
								  retailPrice: $("#retailPrice_" + on_id).val(),
								  zj_sku_name: $("#zj_sku_name_" + on_id).val(),
								});
			});
			
			execAjax({
                m:'goods',
                c:'newAssociation',
                a:'saveReplacePrd',
                data:{data: requestData},
                success:function(data){
					if(data){
						layer.msg("保存成功");
						//jqtb.ajax.reload();
					}
                }
            });
		},
		//==更改信息弹窗==
		change:function(elementId){
			var self = this;
			self.elementId = elementId;
			//self.goods_info = [];
			
			layer.open({
                title :'选择商品',
                type: 2,
                shade: false,
                area: ['700px', '560px'],
                maxmin: false,
                content: '?m=widget&c=selectLocalProduct&a=index&type=1&param=PRD2'
            }); 
			
			/*execAjax({
                m:'goods',
                c:'newAssociation',
                a:'getgoodsInfo',
                data:{prd_id: prd_id},
                success:function(data){
					if(data){
						self.goods_info = data.skuInfo;
						self.prd_id = data.prdInfo.prd_id;
						self.prd_no = data.prdInfo.prd_no;
						self.title = data.prdInfo.title;
						self.unit = data.prdInfo.unit;
					}
                }
            });
			
			layer.open({
				type: 1,
				title: '修改系统商品',
				skin: 'layui-layer-rim', //加上边框																		
				area: ['800px', '660px'], //宽高																		
				shade: 0.3,
				content: $("#edit-pages2"),
				btn: ['保存', '取消']
				,yes: function(index, layero){
					//按钮【按钮一】的回调
					var data = [];
					var prd_id = self.prd_id;
					var prd_no = $("#prd_no").val();
					var title = $("#title").val();
					var unit = $("#unit").val();
					var newJson = {
						"prd_id":prd_id,
						"prd_no":prd_no,
						"title":title,
						"unit":unit
					};
					data.push(newJson);
					var newData = [];
					$(".change_body tr").each(function(){
						var new_json = {
							"prd_sku_id":$(this).find(".prd_sku_id").val(),
							"prd_sku_no":$(this).find(".prd_sku_no").val(),
							"sku_name1":$(this).find(".sku_name1").val(),
							"sku_name2":$(this).find(".sku_name2").val(),
							"barcode":$(this).find(".bar_code").val()
						};
						newData.push(new_json);
					});
					data.push(newData);
					
					$.ajax({
						url: "/index.php?m=goods&c=newAssociation&a=change",									
						type: 'post',
						data: {data:data},
						dataType: 'json',
						success: function(result){
							
							if(result.code == "ok"){
								jqtb.ajax.reload();
								layer.close(index);
								layer.msg(result.msg);
							}else{
								layer.msg(result.msg);
							}
						}
					});
					
				}
				,btn2: function(index, layero){
					//按钮【按钮二】的回调
					//return false;
					//return false 开启该代码可禁止点击该按钮关闭
				},
				cancel: function (index, layero) {
				
				}
			});*/
		},
		//==更改信息弹窗

		stallSearch:function(){
			var self = this;
			var marketSelect = $("#marketSelect").val();
			var booth = $("#booth").val();
			self.marketSelect = marketSelect;
			self.booth = booth;
			self.getStall(marketSelect,booth,1);
		},
		//==================================================================================档口弹窗分页开始================================================================================================
		page: function(pager){
			var self = this;			
			if(pager == "first"){
				self.pageNo = 1;
			}else if(pager == "prev"){
				if(self.pageNo == 1){
					return false;
				}
				self.pageNo = self.pageNo - 1;
			}else if(pager == "next"){
				if(self.pageNo == self.pageCount){
					return false;
				}
				self.pageNo = self.pageNo + 1;
			}else if(pager == "last"){
				self.pageNo = self.pageCount;
			}else if(pager == "sure"){
				var num = $(".page_num").val();
				if(num > self.pageCount){
					layer.msg("请输入正确页数",{
						icon: 1,
						time: 2000
					});
					return false;
				}
				self.pageNo = num*1;
			}
			self.getStall(self.marketSelect,self.booth,self.pageNo);
			
		},
		
		//=====================================================================================档口弹窗分页结束=============================================================================================
	//=====================================================解除绑定=========================================================================
		relieve:function(num_iid){
			var self = this;
	
			$.ajax({
				url: "/index.php?m=goods&c=newAssociation&a=relieve",									
				type: 'post',
				data: {num_iid: num_iid},
				dataType: 'json',
				success: function(result){
					mini.parse();
					var grid = mini.get('datagrid');
					grid.reload();
				}
			});
		},
		relieveSku:function(num_iid,sku_id){
			var self = this;
	
			$.ajax({
				url: "/index.php?m=goods&c=newAssociation&a=relieveSku",									
				type: 'post',
				data: {num_iid: num_iid, sku_id: sku_id},
				dataType: 'json',
				success: function(result){
					mini.parse();
					var grid = mini.get('datagrid');
					grid.reload();
				}
			});
		},
		//===================================================解除绑定结束=======================================================================
		//=====================================================换款开始=========================================================================
		good_change:function(num_iid,sku_id){
			var self = this;
			self.good_change_num_iid = num_iid;
			self.good_change_sku_id = sku_id;
			layer.open({
				title :'选择商品',
				type: 2,
				shade: false,
				area: ['700px', '560px'],
				maxmin: false,
				content: '?m=widget&c=selectProduct&a=index&type=1'
				
			});
		},
		//=====================================================换款结束=========================================================================
	}
});
$(".stop").click(function(){
	event.stopPropagation();
});
function onShowRowDetail(e) {
	var row = e.record;
	var grid = mini.get('datagrid');
	var rowIndex = grid.indexOf(row);
	var isExpand = row.isExpand;
	var lastSkuId = '';
	var beginRowIndex = 0;
	marges = [];
	delmarges = [];
	isLoad = 1;
	grid.mergeCells(delmarges);
	marges = [];
	delmarges = [];
	if(isExpand == "T"){
		console.log(row.on_num_iid);
		var removeRowData = grid.findRows(function(nowRow){
			if(row.on_num_iid == nowRow.on_num_iid && nowRow.sku_id) return true;
		});
		grid.removeRows(removeRowData);
		grid.updateRow(row,{isExpand:'F'});
	}
	else
	{
		lastRow = row;
		showRowDetail();
	}
}
var lastRow = [];
function showRowDetail()
{
	var row = lastRow;
	var grid = mini.get('datagrid');
	var rowIndex = grid.indexOf(row);
	var removeRowData = grid.findRows(function(nowRow){
		if(row.on_num_iid == nowRow.on_num_iid && nowRow.sku_id) return true;
	});
	grid.removeRows(removeRowData);
	grid.updateRow(row,{isExpand:'F'});
	$.ajax({
		url: "/index.php?m=goods&c=newAssociation&a=get_goods_sku",
		type: 'post',
		data: {num_iid:row.on_num_iid, shoptype:row.shoptype},
		dataType: 'json',
		success: function (data) {
			if(typeof(data) == "object"){
				for(var i = 0; i < data.length; i++){
					var newRow = {addtime: data[i]['addtime'], binding: data[i]['binding'],cost_price: data[i]['cost_price'], cus_no: data[i]['cus_no'], stalls_name: data[i]['stalls_name'],cus_name: data[i]['cus_name'], shoptype: data[i]['shoptype'],
								  on_id: data[i]['on_id'], on_num_iid: data[i]['num_iid'], on_outer_id: data[i]['on_outer_id'], on_title: data[i]['on_title'], outer_iid: data[i]['on_outer_id'], on_pic: data[i]['pic_url_new'],
								  pic_url_new: data[i]['pic_url_new'],prd_id: data[i]['prd_id'],prd_sku_id: data[i]['prd_sku_id'],replace_prd_no: data[i]['replace_prd_no'],qty: data[i]['qty'],sku_id: data[i]['sku_id'],zj_sku_name:data[i]['zj_sku_name'],bom_id: data[i]['bom_id'],drawOver:'F'};
					var newIndex = rowIndex + 1 + i;
					grid.addRow(newRow, newIndex);
				}
				grid.accept();
				grid.updateRow(row,{isExpand:'T'});
			}
		}	
	});
}
$("#submitSearch").click(function () {
	 var online_goods_num_iid = $("#online_goods_num_iid").val();
     var online_goods_keywords = $("#online_goods_keywords").val();
	 var online_goods_customcode = $("#online_goods_customcode").val();
	 var online_goods_customcode2 = $("#online_goods_customcode2").val();
	 var replace_goods_customcode = $("#replace_goods_customcode").val();
	 var replace_goods_customcode2 = $("#replace_goods_customcode2").val();
	 var cid_name = $("#cid_name").val();
	 var assist_prd = $("#assist_prd").val();
	 mini.parse();
	 var grid = mini.get('datagrid');
	 grid.load({shop_type: flow.this_shop_info[0].shop_type,shop_id: flow.this_shop_info[0].shop_id,online_goods_keywords:online_goods_keywords,online_goods_customcode:online_goods_customcode,online_goods_customcode2:online_goods_customcode2,replace_goods_customcode:replace_goods_customcode,replace_goods_customcode2:replace_goods_customcode2,cid_name:cid_name,online_goods_num_iid:online_goods_num_iid, online_goods_assist_prd: assist_prd});
});
$(document).ready(function(){
    $('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
    });
});

$(".shop-list").eq(0).click();

function change(prd_id){
	flow.change(prd_id);
}

function log(prd_id){
	flow.log(prd_id);
}

function Stock(id){
	flow.Stock(id);
}
function Product(id){
	flow.Product(id);
}
function getCustSearch(){
	var self = this;
	flow.getCustTable("","",1,self.this_num_iid);
}
function getCustSearchs(){
	flow.getCustTables("","",1);
}
function Add_supp(prd_id){
	flow.AddSupp(prd_id);
}
function Add_coordinates(prd_id){
	flow.Addcoordinates(prd_id);
}
function good_change(num_iid,sku_id){
	flow.good_change(num_iid,sku_id);
}
function gethotLoc(elementId){
	console.log(elementId);
	layer.open({
		title :'爆款入库',
		type: 2,
		shade: 0.3,
		area: ['1300px', '750px'],
		maxmin: false,
		content: '?m=goods&c=hotLoc&a=index',
		success: function(layero, index){
                var body = layer.getChildFrame('body', index);
				var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
				body.find('#goodsNum').val(elementId);
              }
				
	});
}
function updateAssistPrd(on_id, data)
{
	$.ajax({
		url: "/index.php?m=goods&c=newAssociation&a=updateAgent",
		type: 'post',
		data: {on_id:on_id, assist_prd:data},
		dataType: 'json',
		success: function (result) {
			if(result.code == 'ok'){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
			}else{
				layer.msg(result.msg,{
					icon: 2,
					time: 2000
				});
			}
		}	
	});
}
function chooseStall(on_id){
	mini.parse();
	flow.resetStall();
	var grid = mini.get('datagrid');
	var result = grid.getSelected();
	if(result.have_sku){
		flow.sku_id = "";
		flow.num_iid = "";
	}else{
		var sku_id = result.sku_id;
		var num_iid = result.on_num_iid;
		if(sku_id && num_iid){
			flow.sku_id = sku_id;
			flow.num_iid = num_iid;
		}
	}
	flow.on_id = on_id;
	
	layer.open({			
		type: 1,			
		title: '选择档口',
		skin: 'layui-layer-rim', 
		area: ['1400px', '700px'], 
		shade: 0.3,	
		content: $("#stalls"),
		btn: ['关闭']
		,yes: function(index, layero){
			//按钮【按钮一】的回调
			layer.close(index);
		},
		cancel: function (index, layero) {
			
		},
		success: function(layero, index){
			flow.nowIndex = index;
		}		
	});

	flow.getStall("","",1);
}
function getotherOut(elementId){
	
	layer.open({
		title :'普通入库',
		type: 2,
		shade: false,
		area: ['1300px', '750px'],
		maxmin: false,
		content: '?m=goods&c=otherOut&a=index',
		success: function(layero, index){
                var body = layer.getChildFrame('body', index);
				var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
				body.find('#goodsNum').val(elementId);
              }
				
	});
}
function getpurchase(elementId){
	
	layer.open({
		title :'采购入库',
		type: 2,
		shade: false,
		area: ['1300px', '750px'],
		maxmin: false,
		content: '?m=goods&c=otherOut&a=index&act=purchase',
		success: function(layero, index){
                var body = layer.getChildFrame('body', index);
				var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
				body.find('#goodsNum').val(elementId);
              }
				
	});
}

function relieve(num_iid){
	layer.confirm('确定解除该商品和线上宝贝的关系？', function(index){
		flow.relieve(num_iid);
		layer.close(index);
	}); 
}
function relieveSku(num_iid,sku_id){
	layer.confirm('确定解除该属性和线上属性的关系？', function(index){
		flow.relieveSku(num_iid,sku_id);
		layer.close(index);
	}); 
}


function focusNow(){
	$(event.target).css("border","1px solid #1e9fff");
}

function blurNow(){
	$(event.target).css("border","1px solid white");
}
//$("#searchAll").click();

/*function cbProductRows(data){
	//console.log(data);
	$.ajax({
		url: "/index.php?m=goods&c=newAssociation&a=good_change",									
		type: 'post',
		data: {data:data,num_iid:flow.good_change_num_iid,sku_id:flow.good_change_sku_id},
		dataType: 'json',
		success: function(result){
			
		}
	});
}*/

function cbProductRows(data,type){
	if(type == "PRD2"){
		var elementId = flow.elementId;
		$("#"+elementId).val(data[0]['prd_no']);
	}
}

function outerUpload(shoptype,elementId){
	var online_type = "";
	if(elementId.substring(0,8) == "outer_id"){
		var online_id = elementId.substring(9,elementId.length);
		var online_type = "outer_id";
	}else if(elementId.substring(0,12) == "outer_sku_id"){
		var online_id = elementId.substring(13,elementId.length);
		var online_type = "outer_sku_id";
	}
	
	var outer_id = $("#" + elementId).val();

	$.ajax({
		url: "/index.php?m=goods&c=newAssociation&a=uploadOuterId",									
		type: 'post',
		data: {online_type: online_type, online_id: online_id, outer_id: outer_id},
		dataType: 'json',
		success: function(data){
			if(data.code == "ok"){
				layer.msg('修改成功',{
					icon: 1,
					time: 2000
				});
			}else if(data.code == "error"){
				layer.msg(data.msg,{
					icon: 2,
					time: 2000
				});
			}else if(data.code == "none"){
				layer.msg("编码没有变更，修改失败",{
					icon: 2,
					time: 2000
				});
			}
		}
	});
	
}

//设置套装
function setBom(on_id,type,index,sku_id,num_iid){
	if(sku_id && num_iid){
		flow.sku_id = sku_id;
		flow.num_iid = num_iid;
	}
	flow.on_id = on_id;
	layer.open({			
		type: 1,			
		title: '套装编码设置',
		skin: 'layui-layer-rim', 
		area: ['1000px', '650px'], 
		shade: 0.3,	
		content: $("#coordinates"),
		btn: ['关闭']
		,yes: function(index, layero){
			//按钮【按钮一】的回调
			layer.close(index);
			mini.parse();
			var grid = mini.get('datagrid');
			grid.reload();
		},
		cancel: function (index, layero) {
			
		},
		success: function(layero, index){
			flow.nowIndex = index;
		}		
	});
	flow.getBom(sku_id,num_iid);
}

function DelBom(on_id){
	var num_iid = flow.num_iid;
	var sku_id = flow.sku_id;
	$.ajax({																				
		url: "/index.php?m=goods&c=newAssociation&a=setDelBom",	
		type: 'post',																		
		data: {id:on_id,num_iid:num_iid,sku_id:sku_id},																				
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("删除成功",{
					icon: 1,
					time: 2000
				});
			
				layer.close(self.nowIndex);
				flow.getBom(sku_id,num_iid);
			}else if(data.code == "error"){
				layer.msg("删除失败",{
					icon: 1,
					time: 2000
				});
			}
		}																					
	});
}

//选择供应商
function supplier(on_id,num_iid){
	var self=this;
	self.this_num_iid=num_iid;
	mini.parse();
	var grid = mini.get('datagrid');
	var result = grid.getSelected();
	if(result.have_sku){
		flow.sku_id = "";
		flow.num_iid = "";
	}else{
		var sku_id = result.sku_id;
		var num_iid = result.on_num_iid;
		if(sku_id && num_iid){
			flow.sku_id = sku_id;
			flow.num_iid = num_iid;
		}
	}
	flow.on_id = on_id;
	layer.open({			
		type: 1,			
		title: '选择供应商',
		skin: 'layui-layer-rim', 
		area: ['1000px', '650px'], 
		shade: 0.3,	
		content: $("#custSetChoose"),
		btn: ['关闭']
		,yes: function(index, layero){
			//按钮【按钮一】的回调
			layer.close(index);
		},
		cancel: function (index, layero) {
			
		},
		success: function(layero, index){
			flow.nowIndex = index;
		}		
	});
	flow.getCustTable("","",1,self.this_num_iid);
}
//选择供应商
function suppliers(on_id,num_iid){
	flow.on_id = on_id;
	layer.open({			
		type: 1,			
		title: '选择供应商',
		skin: 'layui-layer-rim', 
		area: ['1000px', '650px'], 
		shade: 0.3,	
		content: $("#custSetChooses"),
		btn: ['关闭']
		,yes: function(index, layero){
			//按钮【按钮一】的回调
			layer.close(index);
		},
		cancel: function (index, layero) {
			
		},
		success: function(layero, index){
			flow.nowIndex = index;
		},	
	});
	flow.getCustTable("","",1);
}
//清空供应商单元格
function clear_this(on_id){
	mini.parse();
	var grid = mini.get('datagrid');
	var result = grid.getSelected();
	var sku_id = result.sku_id;
	if(sku_id){
		clear_child(on_id,sku_id);
		return;
	}
	$.ajax({																				
		url: "/index.php?m=goods&c=newAssociation&a=clear_supplier",	
		type: 'post',																		
		data: {on_id:on_id},																				
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
				mini.parse();
				var grid = mini.get('datagrid');
				grid.reload();
				layer.close(self.nowIndex);
			}else if(data.code == "error"){
				layer.msg("修改失败",{
					icon: 1,
					time: 2000
				});
			}
		}																					
	});
}
//清空档口
function clear_stall(on_id){
	mini.parse();
	var grid = mini.get('datagrid');
	var result = grid.getSelected();
	var sku_id = result.sku_id;
	if(sku_id){
		clear_stallChild(on_id,sku_id);
		return;
	}
	$.ajax({																				
		url: "/index.php?m=goods&c=newAssociation&a=clear_stall",	
		type: 'post',																		
		data: {on_id:on_id},																				
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
				mini.parse();
				var grid = mini.get('datagrid');
				grid.reload();
				layer.close(self.nowIndex);
			}else if(data.code == "error"){
				layer.msg("修改失败",{
					icon: 1,
					time: 2000
				});
			}
		}																					
	});
}
//清空供应商单元格
function clear_thiss(on_id){
	var num_iid = flow.num_iid;
	var sku_id = flow.sku_id;
	$.ajax({																				
		url: "/index.php?m=goods&c=newAssociation&a=clear_suppliers",	
		type: 'post',																		
		data: {on_id:on_id},																				
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
				layer.close(self.nowIndex);
				flow.getBom(sku_id,num_iid);
			}else if(data.code == "error"){
				layer.msg("修改失败",{
					icon: 1,
					time: 2000
				});
			}
		}																					
	});
}
//清空子单元格
function clear_child(on_id,sku_id){
	$.ajax({																				
		url: "/index.php?m=goods&c=newAssociation&a=clear_supplier_child",	
		type: 'post',																		
		data: {on_id:on_id,sku_id:sku_id},																				
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
				layer.close(self.nowIndex);
				showRowDetail();
			}else if(data.code == "error"){
				layer.msg("修改失败",{
					icon: 1,
					time: 2000
				});
			}
		}																					
	});

}
//清空子单元格
function clear_stallChild(on_id,sku_id){
	$.ajax({																				
		url: "/index.php?m=goods&c=newAssociation&a=clear_stall_child",	
		type: 'post',																		
		data: {on_id:on_id,sku_id:sku_id},																				
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("修改成功",{
					icon: 1,
					time: 2000
				});
				layer.close(self.nowIndex);
				showRowDetail();
			}else if(data.code == "error"){
				layer.msg("修改失败",{
					icon: 1,
					time: 2000
				});
			}
		}																					
	});

}
function outerUploadAll(){
	layer.confirm('确定将商品的二级替换编码一键同步更新到淘宝平台对应商品的空二级编码中？', function(index){
		var shopid = flow.this_shop_info[0].shop_id;
		var index2 = layer.load();
		$.ajax({
			url: "/index.php?m=goods&c=newAssociation&a=outerUploadAll",									
			type: 'post',
			data: {shopid: shopid},
			dataType: 'json',
			success: function(result){
				layer.close(index2);
				if(result.code == 'ok'){
					layer.msg(result.msg);
					mini.parse();
					var grid = mini.get('datagrid');
					grid.reload();
				}else{
					layer.msg(result.msg);
				}
				
			}
		});
		
		layer.close(index);
	});
}

function qinSave(prd_id,prd_sku_id,qin_type){
	var val = $(event.target).val();
	var grid = mini.get('datagrid');
	var selectRow = grid.getSelected();
	
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=qinSave",										
		type: 'post',																		
		data: {prd_id: prd_id, prd_sku_id: prd_sku_id, qin_type: qin_type, val: val},																	
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("保存成功",{
					icon: 1,
					time: 2000
				});
				
				if(prd_sku_id == ''){
					var rowData = {};
					rowData[qin_type] = val;
					grid.updateRow(selectRow,rowData);
					grid.accept();
				}
			}else if(data.code == "noupd"){
				return false;
			}else{
				layer.msg(data.msg,{
					icon: 2,
					time: 2000
				});
			}				
		}																					
	});	
}

function savePrice(){
	var val = $(event.target).val();
	var grid = mini.get('datagrid');
	var selectRow = grid.getSelected();
	$.ajax({																				
		url: "/index.php?m=goods&c=association&a=savePrice",										
		type: 'post',																		
		data: {selectRow:selectRow,val:val},																
		dataType: 'json',																	
		success: function (data) {															
			if(data.code == "ok"){
				layer.msg("保存成功",{
					icon: 1,
					time: 2000
				});
				
				if(prd_sku_id == ''){
					var rowData = {};
					rowData[qin_type] = val;
					grid.updateRow(selectRow,rowData);
					grid.accept();
				}
			}else if(data.code == "noupd"){
				return false;
			}else{
				layer.msg(data.msg,{
					icon: 2,
					time: 2000
				});
			}				
		}																					
	});	
}