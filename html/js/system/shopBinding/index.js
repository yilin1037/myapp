var areaData = Area;
var $form;
var form;
var tableList = new Vue({
	el: '#tableList',
	data: {
		arr:[],
		storageArr:[],
	},
	mounted: function() { 
		var self = this;
		reloadnow(self,self.arr);
		
		//======================================================================================日期选择器=======================================================================================================
		layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {																													//===========
            var $ = layui.jquery, element = layui.element, layer = layui.layer ;																													//===========
            var layer = layui.layer,layedit = layui.layedit,laydate = layui.laydate;
			form = layui.form();
            // 初始化表格																																											//===========
            var jqtb = $('#dateTable').DataTable({																																					//===========
                "`dom": '<"top">rt<"bottom"flp><"clear">',																																			//===========
                "autoWidth": false,                     // 自适应宽度																																//===========
                "paging": true,																																										//===========
                "pagingType": "full_numbers",																																						//===========
                "processing": true,																																									//===========
                "serverSide": true,//开启服务器获取数据																																				//===========
                "fnServerParams": function (aoData) {																																				//===========
                },																																													//===========
                //请求url																																											//===========
                "sAjaxSource": "index.php?m=system&c=message&a=getChildAccount",																													//===========
                // 初始化表格																																										//===========
            });																																														//===========
			
			$form = $('form');
			loadProvince();
			
			$.ajax({																																													//===========
				url: "/index.php?m=system&c=delivery&a=getStorage",																																		//===========
				type: 'post',																																											//===========
				data: {},																																												//===========
				dataType: 'json',																																										//===========
				success: function (data) {																																								//===========
					self.storageArr = data;																																								//===========
				}																																														//===========
			});	
        });																																															//===========
		//======================================================================================日期选择器结束===================================================================================================
		
	},
	methods: {
		selectAll:function(){
			
			if ($("#checkAll").prop("checked")) {  
				$(":checkbox").prop("checked", true);  
			} else {  
				$(":checkbox").prop("checked", false);  
			} 
		},
		effective:function(){
			var self = this;
			var chk = [];
			var idArr = [];
			var str = "";
			$('input[name="my-checkbox"]:checked').each(function(){ 
				chk.push($(this).val()); 
				idArr.push($(this).prop("id"))
			}); 
			if(chk.length == 0){
				layer.open({																																										
						title: '提示'																																									
						,content: '请至少选择一条数据'																																					
					});
				
				return false;
			}
			
			layer.open({																																											
				title: '提示',																																										
				content: '确定设置为有效么？跨天再调整状态还会扣除9.9元',																																						
				btn: ['确定', '取消'],																																								
				yes:function(){																																										
					for(var i = 0; i < chk.length; i++){
					str += (chk[i] + ",");
					}
					
					$.ajax({
						url: '/index.php?m=system&c=shopBinding&a=effective',
						type: "POST",
						dataType:"json",
						data:{data: str, action:"T"},
						success:function(data){
							if(data.code == "ok"){
								for(var j = 0; j < idArr.length; j++){
									self.arr[idArr[j]].status = 1;
								}
								layer.msg("操作成功",{
									icon: 1,
									time: 2000
								});
							}else{
								layer.msg("操作失败",{
									icon: 2,
									time: 2000
								});
							}
						}
					});		
					layer.closeAll();
				}																																													
			}); 	
		},
		invalid:function(){
			var self = this;
			var chk = [];
			var idArr = [];
			var str = "";
			
			$('input[name="my-checkbox"]:checked').each(function(){ 
				chk.push($(this).val()); 
				idArr.push($(this).prop("id"))
			}); 
			
			if(chk.length == 0){
				layer.open({																																										
						title: '提示'																																									
						,content: '请至少选择一条数据'																																					
					});
				return false;
			}
			
			layer.open({																																											
				title: '提示',																																										
				content: '确定设置为无效么？跨天再调整状态还会扣除9.9元',																																						
				btn: ['确定', '取消'],																																								
				yes:function(){																																										
					for(var i = 0; i < chk.length; i++){
						str += (chk[i] + ",");
					}
					
					$.ajax({
						url: '/index.php?m=system&c=shopBinding&a=effective',
						type: "POST",
						dataType:"json",
						data:{data: str, action:"F"},
						success:function(data){
							if(data.code == "ok"){
								for(var j = 0; j < idArr.length; j++){
									self.arr[idArr[j]].status = 0;
								}
								layer.msg("操作成功",{
									icon: 1,
									time: 2000
								});
							}else{
								layer.msg("操作失败",{
									icon: 2,
									time: 2000
								});
							}
						}
					});
					layer.closeAll();
				}																																													
			});
		},
		autoMerge:function(isAutoMerge){
			var self = this;
			var chk = [];
			var idArr = [];
			var str = "";
			
			$('input[name="my-checkbox"]:checked').each(function(){ 
				chk.push($(this).val()); 
				idArr.push($(this).prop("id"))
			}); 
			
			if(chk.length == 0){
				layer.open({																																										
						title: '提示'																																									
						,content: '请至少选择一条数据'																																					
					});
				return false;
			}
			
			for(var i = 0; i < chk.length; i++){
				str += (chk[i] + ",");
			}
			
			$.ajax({
				url: '/index.php?m=system&c=shopBinding&a=autoMerge',
				type: "POST",
				dataType:"json",
				data:{data: str, isAutoMerge:isAutoMerge},
				success:function(data){
					if(data.code == "ok"){
						for(var j = 0; j < idArr.length; j++){
							self.arr[idArr[j]].isAutoMerge = isAutoMerge;
						}
						layer.msg("操作成功",{
							icon: 1,
							time: 2000
						});
					}else{
						layer.msg("操作失败",{
							icon: 2,
							time: 2000
						});
					}
				}
			});
		},
		add:function(name){
			var self = this;
			if(name == "juanpi"){
				$("#juanpi").css("display","block");
				$('#jp_btn').show();
			}else if(name == "pdd"){
				$("#shopname1").val("");
				$("#shopname1").attr("disabled", false);
				$("#shopsortname1").val("");
				$("#shopsortname1").attr("disabled", false);
				$("#appkey1").val("");
				$("#appkey1").attr("disabled", false);
				$("#sessionkey1").val("");
				layer.open({																																											
					type: 1,																																											
					title: '添加拼多多店铺',																																								
					skin: 'layui-layer-rim', //加上边框																																					
					area: ['968px', '350px'], //宽高																																					
					shade: 0.3,																																											
					content: $("#pdd"),	
					btn: ['确定添加', '取消']
					,yes: function(index, layero){
						self.addTure("PDD");
					},
					cancel: function (index, layero) {																																					
																																																		
					}																																													
				});
				//$("#pdd").css("display","block");
			}else if(name == "SUNING"){
				$("#SN-shopname").val("");
				$("#SN-shopname").attr("disabled", false);
				$("#SN-shopsortname").val("");
				$("#SN-shopsortname").attr("disabled", false);
				$("#SN-appkey").val("");
				$("#SN-appkey").attr("disabled", false);
				$("#SN-secretKey").val("");
				$("#SN-secretKey").attr("disabled", false);
				$("#SN-server_url").val("");
				$("#SN-server_url").attr("disabled", false);
				layer.open({
					type: 1,
					title: '添加苏宁店铺',
					skin: 'layui-layer-rim', //加上边框
					area: ['968px', '470px'], //宽高
					shade: 0.3,
					content: $("#SUNING"),
					btn: ['确定添加', '取消']
					,yes: function(index, layero){
						self.addTure("SUNING");
					},
					cancel: function (index, layero) {

					}
				});
				//$("#pdd").css("display","block");
				//269 zpg else if 
			} else if (name == "IKUCUN") {
				$("#IKUCUN-shopname").val("");
				$("#IKUCUN-shopname").attr("disabled", false);
				$("#IKUCUN-shopsortname").val("");
				$("#IKUCUN-shopsortname").attr('disabled');
				$("#IKUCUN-appkey").val("");
				$("#IKUCUN-appkey").attr("disabled", false);
				$("#IKUCUN-secretKey").val("");
				$("#IKUCUN-secretKey").attr("disabled", false);
				$("#IKUCUN-server_url").val("");
				$("#IKUCUN-server_url").attr("disabled", false);
				layer.open({
					type: 1,
					title: '添加爱库存店铺',
					skin: 'layui-layer-rim',
					area: ['968px', '470px'],
					shade: 0.3,
					content: $("#IKUCUN"),
					btn: ['确定添加', '取消']
					,yes: function(index, layero) {
						self.addTure("IKUCUN");
					},
					cancel: function (index, layero) {
						
					}
				});

			} else if(name == "CQSHOP"){
                $("#shopname1").val("");
                $("#shopname1").attr("disabled", false);
                $("#shopsortname1").val("");
                $("#shopsortname1").attr("disabled", false);
                $("#appkey1").val("");
                $("#appkey1").attr("disabled", false);
                $("#sessionkey1").val("");
                layer.open({
                    type: 1,
                    title: '添加超群商城店铺',
                    skin: 'layui-layer-rim', //加上边框
                    area: ['968px', '470px'], //宽高
                    shade: 0.3,
                    content: $("#CQSHOP"),
                    btn: ['确定添加', '取消']
                    ,yes: function(index, layero){
                        self.addTure("CQSHOP");
                    },
                    cancel: function (index, layero) {

                    }
                });
                //$("#pdd").css("display","block");
            }else if(name == "JM"){
				$("#JM").css("display","block");
			}else if(name == "XX"){
				layer.open({																																											
					type: 1,																																											
					title: '添加线下店铺',																																								
					skin: 'layui-layer-rim', //加上边框																																					
					area: ['968px', '250px'], //宽高																																					
					shade: 0.3,																																											
					content: $("#XX"),	
					btn: ['确定添加', '取消']
					,yes: function(index, layero){
						self.addTure("XX");
					},
					cancel: function (index, layero) {																																					
																																																		
					},
					success:function(){
						$("#shopname_XX").val("");
						$("#shopsortname_XX").val("");
					}					
				});
			}else if(name == "chuchujie"){
				$("#shopname_ccj").val("");
				$("#shopname_ccj").attr("disabled", false);
				$("#shopsortname_ccj").val("");
				$("#shopsortname_ccj").attr("disabled", false);
				$("#appkey_ccj").val("");
				$("#appkey_ccj").attr("disabled", false);
				$("#secretKey_ccj").val("");
				$("#secretKey_ccj").attr("disabled", false);
				$("#sessionkey_ccj").val("");
				$("#sessionkey_ccj").attr("disabled", false);
				layer.open({																																											
					type: 1,																																											
					title: '添加楚楚街店铺',																																								
					skin: 'layui-layer-rim', //加上边框																																					
					area: ['968px', '450px'], //宽高																																					
					shade: 0.3,																																											
					content: $("#chuchujie"),	
					btn: ['确定添加', '取消']
					,yes: function(index, layero){
						self.addTure("chuchujie");
					},
					cancel: function (index, layero) {																																					
																																																		
					}																																													
				});
				//$("#pdd").css("display","block");
			}else if(name == "TPLUS"){
                $("#tplus-shopname").val("");
				$("#tplus-shopname").attr("disabled", false);
                $("#tplus-shopsortname").val("");
                $("#tplus-server_url").val("");
                $("#tplus-appkey").val("");
                $("#tplus-secretKey").val("");
                $("#tplus-sessionkey").val("");
				
                layer.open({
                    type: 1,
                    title: '添加用友T+Cloud',
                    skin: 'layui-layer-rim', //加上边框
                    area: ['968px', '470px'], //宽高
                    shade: 0.3,
                    content: $("#TPLUS"),
                    btn: ['确定添加', '取消']
                    ,yes: function(index, layero){
                        self.addTure("TPLUS");
                    },
                    cancel: function (index, layero) {

                    }
                });
            }else if(name == "fangxingou"){
				$("#fangxingou").css("display","block");
			}else if(name == "xiaohongshu"){
				$("#xiaohongshu").css("display","block");
				$('#xhs_btn').show();
			}else if(name == "shuaibao"){
				$("#shuaibao").css("display","block");
				$('#shuaibao_btn').show();
			}else if(name == "HYK"){
				$("#HYK").css("display","block");
				$('#HYK_btn').show();
			}
		},
		addTure:function(name){

			var data = [];
			var self = this;
			if(name == "juanpi"){
				
				if($("#shopname").val() == ""){
				layer.open({																																										
					title: '提示'																																									
					,content: '请填写店铺名称'																																					
				}); 
				return false;
				}
				
				if($("#shopsortname").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写店铺简称'																																					
					}); 
					return false;
				}
				
				if($("#sessionkey").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写店铺对接秘钥'																																					
					});
					return false;
				}
				
				var newData = {
					shopname:$("#shopname").val(),
					shopsortname:$("#shopsortname").val(),
					shopid:"JP-" + $("#shopname").val(),
					shoptype:"JP",
					status:1,
					sessionkey:$("#sessionkey").val(),
					expire_time:$("#expireTime").val(),
					auth_expire_time:$("#expireTime").val(),
				}
				data.push(newData);
				$.ajax({
					url: '/index.php?m=system&c=shopBinding&a=addTure',
					type: "POST",
					dataType:"json",
					data:{data: data},
					success:function(data){
						if(data.code == "ok"){
							$("#juanpi").css("display","none");
							reloadnow(self,self.arr);
						}else{
							layer.msg("操作失败",{
								icon: 2,
								time: 2000
							});
						}
					}
				});
			}else if(name == "fangxingou"){
				if($("#fangxingou-shopname").val() == ""){
				layer.open({																																										
					title: '提示'																																									
					,content: '请填写店铺名称'																																					
				}); 
				return false;
				}
				
				if($("#fangxingou-shopsortname").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写店铺简称'																																					
					}); 
					return false;
				}
				
				if($("#fangxingou-appkey").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写Appkey'																																					
					});
					return false;
				}
				
				if($("#fangxingou-secretkey").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写Appsecret'																																					
					});
					return false;
				}
				
				var newData = {
					shopname:$("#fangxingou-shopname").val(),
					shopsortname:$("#fangxingou-shopsortname").val(),
					shopid:"FXG-" + $("#fangxingou-shopname").val(),
					shoptype:"FXG",
					status:1,
					sessionkey:$("#fangxingou-secretkey").val(),
					expire_time:'F',
					appkey:$("#fangxingou-appkey").val(),
					secretkey:$("#fangxingou-secretkey").val()
				}
				data.push(newData);
				$.ajax({
					url: '/index.php?m=system&c=shopBinding&a=addTure',
					type: "POST",
					dataType:"json",
					data:{data: data},
					success:function(data){
						if(data.code == "ok"){
							$("#fangxingou").css("display","none");
							reloadnow(self,self.arr);
						}else{
							layer.msg("操作失败",{
								icon: 2,
								time: 2000
							});
						}
					}
				});
			}else if(name == "IKUCUN"){
				if($("#IKUCUN-shopname").val() == ""){
					layer.open({
						title: '提示'
						,content: '请填写店铺名称'
					});
					return false;
				}

				if($("#IKUCUN-shopsortname").val() == ""){
					layer.open({
						title: '提示'
						,content: '请填写店铺简称'
					});
					return false;
				}

				if($("#IKUCUN-appkey").val() == ""){
					layer.open({
						title: '提示'
						,content: '请填写Appkey'
					});
					return false;
				}

				if($("#IKUCUN-secretkey").val() == ""){
					layer.open({
						title: '提示'
						,content: '请填写Appsecret'
					});
					return false;
				}

				var newData = {
					shopname:$("#IKUCUN-shopname").val(),
					shopsortname:$("#IKUCUN-shopsortname").val(),
					shopid:"IKUCUN-" + $("#IKUCUN-shopname").val(),
					shoptype:"IKUCUN",
					status:1,
					sessionkey:$("#IKUCUN-secretkey").val(),
					expire_time:'F',
					appkey:$("#IKUCUN-appkey").val(),
					secretkey:$("#IKUCUN-secretkey").val()
				}
				data.push(newData);
				$.ajax({
					url: '/index.php?m=system&c=shopBinding&a=addTure',
					type: "POST",
					dataType:"json",
					data:{data: data},
					success:function(data){
						if(data.code == "ok"){
							$("#IKUCUN").css("display","none");
							reloadnow(self,self.arr);
						}else{
							layer.msg("操作失败",{
								icon: 2,
								time: 2000
							});
						}
					}
				});
			}else if(name == "pdd"){
				if($("#shopname1").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写店铺名称'																																					
					});
				return false;
				}
				
				if($("#sessionkey1").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写接口密码'																																					
					});
					return false;
				}
				
				if($("#appkey1").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写接入码'																																					
					});
					return false;
				}
				
				var newData = {
					shopname:$("#shopname1").val(),
					shopsortname:$("#shopsortname1").val(),
					shopid:"PDD-" + $("#shopname1").val(),
					shoptype:"PDD",
					status:1,
					sessionkey:$("#sessionkey1").val(),
					expire_time:"F",
					auth_expire_time:"F",
					appkey:$("#appkey1").val(),
					secretkey:$("#sessionkey1").val(),
				}
				data.push(newData);
				
				$.ajax({
					url: '/index.php?m=system&c=shopBinding&a=addTure',
					type: "POST",
					dataType:"json",
					data:{data: data},
					success:function(data){
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							reloadnow(self);							
							layer.closeAll();
						}else{
							layer.msg(data.msg,{
								icon: 0,
								time: 2000
							});
						}
					}
				});
			}else if(name == "CQSHOP"){
                if($("#cq-shopname").val() == ""){
                    layer.open({
                        title: '提示'
                        ,content: '请填写店铺ID'
                    });
                    return false;
                }

                if($("#cq-appkey").val() == ""){
                    layer.open({
                        title: '提示'
                        ,content: '请填写appkey'
                    });
                    return false;
                }
                if($("#cq-secretKey").val() == ""){
                    layer.open({
                        title: '提示'
                        ,content: '请填写SecretKey'
                    });
                    return false;
                }
				if($("#cq-sessionkey").val() == ""){
                    layer.open({
                        title: '提示'
                        ,content: '请填写SessionKey'
                    });
                    return false;
                }
                if($("#cq-server_url").val() == ""){
                    layer.open({
                        title: '提示'
                        ,content: '请填写商城接口地址URL'
                    });
                    return false;
                }

                var newData = {
                    shopname:$("#cq-shopname").val(),
                    shopsortname:$("#cq-shopsortname").val(),
                    shopid:"CQSHOP_" + $("#cq-shopname").val(),
                    shoptype:"CQSHOP",
                    status:1,
                    expire_time:"F",
                    auth_expire_time:"F",
                    sessionkey:$("#cq-sessionkey").val(),
                    appkey:$("#cq-appkey").val(),
                    secretkey:$("#cq-secretKey").val(),
					server_url:$("#cq-server_url").val(),
                }
                data.push(newData);

                $.ajax({
                    url: '/index.php?m=system&c=shopBinding&a=addTure',
                    type: "POST",
                    dataType:"json",
                    data:{data: data},
                    success:function(data){
                        if(data.code == "ok"){
                            layer.msg(data.msg,{
                                icon: 1,
                                time: 2000
                            });
                            reloadnow(self);
                            layer.closeAll();
                        }else{
                            layer.msg(data.msg,{
                                icon: 0,
                                time: 2000
                            });
                        }
                    }
                });
            }else if(name == "SUNING"){
				if($("#SN-shopname").val() == ""){
					layer.open({
						title: '提示'
						,content: '请填写店铺SUNING ID'
					});
					return false;
				}

				if($("#SN-appkey").val() == ""){
					layer.open({
						title: '提示'
						,content: '请填写appkey'
					});
					return false;
				}
				if($("#SN-secretKey").val() == ""){
					layer.open({
						title: '提示'
						,content: '请填写SecretKey'
					});
					return false;
				}

				if($("#SN-server_url").val() == ""){
					layer.open({
						title: '提示'
						,content: '请填写商城接口地址URL'
					});
					return false;
				}

				var newData = {
					shopname:$("#SN-shopname").val(),
					shopsortname:$("#SN-shopsortname").val(),
					shopid:"SUNING_" + $("#SN-shopname").val(),
					shoptype:"SUNING",
					status:1,
					expire_time:"F",
					auth_expire_time:"F",

					appkey:$("#SN-appkey").val(),
					secretkey:$("#SN-secretKey").val(),
					server_url:$("#SN-server_url").val(),
				}
				data.push(newData);

				$.ajax({
					url: '/index.php?m=system&c=shopBinding&a=addTure',
					type: "POST",
					dataType:"json",
					data:{data: data},
					success:function(data){
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							reloadnow(self);
							layer.closeAll();
						}else{
							layer.msg(data.msg,{
								icon: 0,
								time: 2000
							});
						}
					}
				});
			}else if(name == "XX"){
				
				if($("#shopname_XX").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写店铺名称'																																					
					});
					return false;
				}
				
				var newData = {
					shopname:$("#shopname_XX").val(),
					shopsortname:$("#shopsortname_XX").val(),
					shopid:"XX-" + $("#shopname_XX").val(),
					shoptype:"XX",
					status:1,
					sessionkey:'',
					expire_time:"F",
					auth_expire_time:"F",
					appkey:'',
					secretkey:'',
				}
				data.push(newData);
				
				$.ajax({
					url: '/index.php?m=system&c=shopBinding&a=addTure',
					type: "POST",
					dataType:"json",
					data:{data: data},
					success:function(data){
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							reloadnow(self);							
							layer.closeAll();
						}else{
							layer.msg(data.msg,{
								icon: 0,
								time: 2000
							});
						}
					}
				});
				
			}else if(name == "JM"){
				if($("#shopname2").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写店铺名称'																																					
					});
					return false;
				}
				
				if($("#shopsortname2").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写店铺简称'																																					
					});
					return false;
				}
				
				if($("#sessionkey2").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写接口签名'																																					
					});
					return false;
				}
				
				if($("#appkey2").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写商家发货系统ID'																																					
					});
					return false;
				}
				
				if($("#secretkey2").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写商家键值'																																					
					});
					return false;
				}
				
				var newData = {
					shopname:$("#shopname2").val(),
					shopsortname:$("#shopsortname2").val(),
					shopid:"JM-" + $("#shopname2").val(),
					shoptype:"JM",
					status:1,
					sessionkey:$("#sessionkey2").val(),
					expire_time:"F",
					appkey:$("#appkey2").val(),
					secretkey:$("#secretkey2").val()
				}
				data.push(newData);
				$.ajax({
					url: '/index.php?m=system&c=shopBinding&a=addTure',
					type: "POST",
					dataType:"json",
					data:{data: data},
					success:function(data){
						if(data.code == "ok"){
							$("#JM").css("display","none");
							reloadnow(self,self.arr);
						}else{
							layer.msg("操作失败",{
								icon: 2,
								time: 2000
							});
						}
					}
				});
			}else if(name == "chuchujie"){
				if($("#shopname_ccj").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写店铺名称'																																					
					});
					return false;
				}
				
				if($("#appkey_ccj").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写ORG_NAME'																																					
					});
					return false;
				}
				
				if($("#secretKey_ccj").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写APP_ID'																																					
					});
					return false;
				}
				
				if($("#sessionkey_ccj").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写APP_SECRET'
					});
					return false;
				}

				var newData = {
					shopsortname:$("#shopsortname_ccj").val(),
					shopid:"CCJ-" + $("#shopname_ccj").val(),
					shopname: $("#shopname_ccj").val(),
					shoptype:"CCJ",
					status:1,
					sessionkey:$("#sessionkey_ccj").val(),
					expire_time:"F",
					auth_expire_time:"F",
					appkey:$("#appkey_ccj").val(),
					secretkey:$("#secretKey_ccj").val(),
				}
				data.push(newData);
				
				$.ajax({
					url: '/index.php?m=system&c=shopBinding&a=addTure',
					type: "POST",
					dataType:"json",
					data:{data: data},
					success:function(data){
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							reloadnow(self);							
							layer.closeAll();
						}else{
							layer.msg(data.msg,{
								icon: 0,
								time: 2000
							});
						}
					}
				});
			}else if(name == "TPLUS"){
                if($("#tplus-shopname").val() == ""){
                    layer.open({
                        title: '提示'
                        ,content: '请填写店铺名称'
                    });
                    return false;
                }
                if($("#tplus-server_url").val() == ""){
                    layer.open({
                        title: '提示'
                        ,content: '服务器地址'
                    });
                    return false;
                }
                if($("#tplus-appkey").val() == ""){
                    layer.open({
                        title: '提示'
                        ,content: '请填写用户名'
                    });
                    return false;
                }
				if($("#tplus-secretKey").val() == ""){
                    layer.open({
                        title: '提示'
                        ,content: '请填写密码'
                    });
                    return false;
                }
				if($("#tplus-sessionkey").val() == ""){
                    layer.open({
                        title: '提示'
                        ,content: '请填写账套'
                    });
                    return false;
                }
				
                var newData = {
                    shopname:$("#tplus-shopname").val(),
                    shopsortname:$("#tplus-shopsortname").val(),
                    shopid:"TPLUS_" + $("#tplus-appkey").val(),
                    shoptype:"TPLUS",
                    status:1,
                    expire_time:"F",
                    auth_expire_time:"F",
                    sessionkey:$("#tplus-sessionkey").val(),
                    appkey:$("#tplus-appkey").val(),
                    secretkey:$("#tplus-secretKey").val(),
					server_url:$("#tplus-server_url").val(),
                }
                data.push(newData);

                $.ajax({
                    url: '/index.php?m=system&c=shopBinding&a=addTure',
                    type: "POST",
                    dataType:"json",
                    data:{data: data},
                    success:function(data){
                        if(data.code == "ok"){
                            layer.msg(data.msg,{
                                icon: 1,
                                time: 2000
                            });
                            reloadnow(self);
                            layer.closeAll();
                        }else{
                            layer.msg(data.msg,{
                                icon: 0,
                                time: 2000
                            });
                        }
                    }
                });
            }else if(name == "xiaohongshu"){
				if($("#XHS-shopname").val() == ""){
				layer.open({																																										
					title: '提示'																																									
					,content: '请填写店铺名称'																																					
				}); 
				return false;
				}
				
				if($("#XHS-shopsortname").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写店铺简称'																																					
					}); 
					return false;
				}
				
				if($("#XHS-appkey").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写app-key'																																					
					});
					return false;
				}
				
				if($("#XHS-appsecret").val() == ""){
					layer.open({																																										
						title: '提示'																																									
						,content: '请填写app-secret'																																					
					});
					return false;
				}
				
				var newData = {
					shopname:$("#XHS-shopname").val(),
					shopsortname:$("#XHS-shopsortname").val(),
					shopid:"XHS-" + $("#XHS-shopname").val(),
					shoptype:"XHS",
					status:1,
					sessionkey:$("#XHS-appsecret").val(),
					secretkey:$("#XHS-appsecret").val(),
					appkey:$("#XHS-appkey").val(),
					expire_time:"F",
                    auth_expire_time:"F",
				}
				data.push(newData);
				$.ajax({
					url: '/index.php?m=system&c=shopBinding&a=addTure',
					type: "POST",
					dataType:"json",
					data:{data: data},
					success:function(data){
						if(data.code == "ok"){
							$("#xiaohongshu").css("display","none");
							reloadnow(self,self.arr);
						}else{
							layer.msg("操作失败",{
								icon: 2,
								time: 2000
							});
						}
					}
				});
			}else if(name == "shuaibao"){
				if($("#SSBB-shopname").val() == ""){
					layer.open({
						title: '提示'
						,content: '请填写店铺名称'
					}); 
					return false;
					}
				
				if($("#SSBB-shopsortname").val() == ""){
					layer.open({						
						title: '提示'								
						,content: '请填写店铺简称'							
					}); 
					return false;
				}
				
				if($("#SSBB-sessionkey").val() == ""){
					layer.open({						
						title: '提示'								
						,content: '请填写店铺对接秘钥'							
					});
					return false;
				}
				
				var newData = {
					shopname:$("#SSBB-shopname").val(),
					shopsortname:$("#SSBB-shopsortname").val(),
					shopid:"shuaibao-" + $("#SSBB-shopname").val(),
					shoptype:"SSBB",
					status:1,
					sessionkey:$("#SSBB-sessionkey").val(),
				}
				data.push(newData);
				$.ajax({
					url: '/index.php?m=system&c=shopBinding&a=addTure',
					type: "POST",
					dataType:"json",
					data:{data: data},
					success:function(data){
						if(data.code == "ok"){
							$("#shuaibao").css("display","none");
							reloadnow(self,self.arr);
						}else{
							layer.msg("操作失败",{
								icon: 2,
								time: 2000
							});
						}
					}
				});
			}else if(name == "HYK"){
				if($("#HYK-shopname").val() == ""){
					layer.open({
						title: '提示'
						,content: '请填写店铺名称'
					}); 
					return false;
					}
				
				if($("#HYK-shopsortname").val() == ""){
					layer.open({						
						title: '提示'								
						,content: '请填写店铺简称'							
					}); 
					return false;
				}
				
				if($("#HYK-sessionkey").val() == ""){
					layer.open({						
						title: '提示'								
						,content: '请填写店铺对接秘钥'							
					});
					return false;
				}
				
				var newData = {
					shopname:$("#HYK-shopname").val(),
					shopsortname:$("#HYK-shopsortname").val(),
					shopid:"HYK-" + $("#HYK-shopname").val(),
					shoptype:"HYK",
					status:1,
					sessionkey:$("#HYK-sessionkey").val(),
				}
				data.push(newData);
				$.ajax({
					url: '/index.php?m=system&c=shopBinding&a=addTure',
					type: "POST",
					dataType:"json",
					data:{data: data},
					success:function(data){
						if(data.code == "ok"){
							$("#HYK").css("display","none");
							reloadnow(self,self.arr);
						}else{
							layer.msg("操作失败",{
								icon: 2,
								time: 2000
							});
						}
					}
				});
			}
		},
		closenow:function(a){
			$("input[name='reset']").each(function(){
				$(this).val("");
			});
			$("#" + a).css("display","none");
			
		},
		subscription:function(shoptype){
			if(shoptype == "TB" || shoptype == "TM"){
				window.open("https://fuwu.taobao.com/ser/detail.htm?service_code=FW_GOODS-1000009415&tracelog=search");
			}else if(shoptype == "MGJ"){
				window.open("https://oauth.mogujie.com/authorize?response_type=code&app_key=100175&redirect_uri=https://erp.jetm3.com/index_onErp_mgj.php&state=JQ");
			}else if(shoptype == "JD"){
				window.open("http://fw.jd.com/430022.html");
			}
		},
		refresh:function(shoptype,appkey){
			if(shoptype == "TB" || shoptype == "TM"){
				window.open("https://oauth.taobao.com/authorize?response_type=code&client_id=23058998&redirect_uri=https://erp.jetm3.com/index_onErp.php&state=2589005&view=web");
			}else if(shoptype == "MGJ"){
				if(appkey == "100629"){
					window.open("https://oauth.mogujie.com/authorize?response_type=code&app_key=100629&redirect_uri=https://erp.jetm3.com/index_onErp_mgj2.php&state=JQ");
				}else{
					layer.msg("此应用已失效，请联系超群重新订应用",{
						icon: 1,
						time: 2000
					});
				}
			}else if(shoptype == "IKUCUN"){
				var data = [];
				var newData = {
					shoptype:shoptype,
					appkey:appkey,

				};
				data.push(newData);
				$.ajax({
					url: '/index.php?m=system&c=shopBinding&a=ikcGenSign',
					type: "POST",
					dataType:"json",
					data:{data: data},
					success:function(data){

						if(data.code == "ok"){
							layer.msg("签名成功",{
								icon: 1,
								time: 2000
							});
						}else{
							layer.msg("签名失败",{
								icon: 2,
								time: 2000
							});
						}
					}
				});
			}else if(shoptype == "JD"){
				window.open("https://oauth.jd.com/oauth/authorize?response_type=code&client_id=EB2715259E9EA6B8C1C3F5CF7353F390&redirect_uri=https://erp.jetm3.com/index_onErp_jd.php&state=2589005");
			}else if(shoptype == 'YZ' || shoptype == 'YZY'){
				window.open("https://yingyong.youzan.com/cloud-app-detail/43467");
			}
		},
		replaceCode:function(rowObj){
			var self = this;
			var shoptype = rowObj.shoptype;
			var shopid = rowObj.shopid;
			var dataObj = self.arr;
			if(shoptype == "PDD"){
				for(var i in dataObj){
					if(dataObj[i]['shopid'] == shopid){
						rowObj = dataObj[i];
					}
				}
				$("#shopname1").val(rowObj.shopname);
				$("#shopname1").attr("disabled", true);
				$("#shopsortname1").val(rowObj.shopsortname);
				$("#shopsortname1").attr("disabled", true);
				$("#appkey1").val(rowObj.appkey);
				$("#appkey1").attr("disabled", true);
				$("#sessionkey1").val(rowObj.sessionkey);
				layer.open({																																											
					type: 1,																																											
					title: '更换Screct',																																								
					skin: 'layui-layer-rim', //加上边框																																					
					area: ['968px', '350px'], //宽高
					shade: 0.3,																																											
					content: $("#pdd"),	
					btn: ['确定更换', '取消']
					,yes: function(index, layero){
						if($("#sessionkey1").val() == ""){
							layer.open({																																										
								title: '提示'																																									
								,content: '请填写接口密码'																																					
							});
							return false;
						}
						
						$.ajax({
							url: '/index.php?m=system&c=shopBinding&a=editSessionkey',
							type: "POST",
							dataType:"json",
							data:{shopid: shopid, secretkey: $("#sessionkey1").val(), sessionkey: $("#sessionkey1").val()},
							success:function(data){
								if(data.code == "ok"){
									layer.msg("操作成功",{
										icon: 1,
										time: 2000
									});
									console.log(self.arr);
									reloadnow(self,self.arr);
									layer.close(index);
								}else{
									layer.msg("操作失败",{
										icon: 2,
										time: 2000
									});
								}
							}
						});
					},
					cancel: function (index, layero) {																																					
																																																		
					}																																													
				});
			}else if(shoptype == "CQSHOP"){
                for(var i in dataObj){
                    if(dataObj[i]['shopid'] == shopid){
                        rowObj = dataObj[i];
                    }
                }
                $("#cq-shopname").val(rowObj.shopid.replace("CQSHOP_", ""));
                $("#cq-shopname").attr("disabled", true);
                $("#cq-shopsortname").val(rowObj.shopsortname);
                $("#cq-shopsortname").attr("disabled", true);
				$("#cq-server_url").val(rowObj.server_url);
                $("#cq-appkey").val(rowObj.appkey);
                $("#cq-secretKey").val(rowObj.secretkey);
                $("#cq-sessionkey").val(rowObj.sessionkey);

                layer.open({
                    type: 1,
                    title: '更换Screct',
                    skin: 'layui-layer-rim', //加上边框
                    area: ['968px', '450px'], //宽高
                    shade: 0.3,
                    content: $("#CQSHOP"),
                    btn: ['确定更换', '取消']
                    ,yes: function(index, layero){
                        if($("#cq-shopname").val() == ""){
							layer.open({
								title: '提示'
								,content: '请填写店铺ID'
							});
							return false;
						}

						if($("#cq-appkey").val() == ""){
							layer.open({
								title: '提示'
								,content: '请填写appkey'
							});
							return false;
						}
						if($("#cq-secretKey").val() == ""){
							layer.open({
								title: '提示'
								,content: '请填写SecretKey'
							});
							return false;
						}
						if($("#cq-sessionkey").val() == ""){
							layer.open({
								title: '提示'
								,content: '请填写SessionKey'
							});
							return false;
						}
						if($("#cq-server_url").val() == ""){
							layer.open({
								title: '提示'
								,content: '请填写商城接口地址URL'
							});
							return false;
						}

                        $.ajax({
                            url: '/index.php?m=system&c=shopBinding&a=editSessionkey',
                            type: "POST",
                            dataType:"json",
                            data:{shopid:shopid, secretkey: $("#cq-secretKey").val(),sessionkey: $("#cq-sessionkey").val(),appkey: $("#cq-appkey").val(),server_url: $("#cq-server_url").val()},
                            success:function(data){
                                if(data.code == "ok"){
                                    layer.msg("操作成功",{
                                        icon: 1,
                                        time: 2000
                                    });
                                    console.log(self.arr);
                                    reloadnow(self,self.arr);
                                    layer.close(index);
                                }else{
                                    layer.msg("操作失败",{
                                        icon: 2,
                                        time: 2000
                                    });
                                }
                            }
                        });
                    },
                    cancel: function (index, layero) {

                    }
				});
			  //zpg 1160 else if 
            } else if(name == "IKUCUN"){
				if($("#IKUCUN-shopname").val() == ""){
					layer.open({
						title: '提示'
						,content: '请填写店铺IKUCUN ID'
					});
					return false;
				}

				if($("#IKUCUN-appkey").val() == ""){
					layer.open({
						title: '提示'
						,content: '请填写appkey'
					});
					return false;
				}
				if($("#IKUCUN-secretKey").val() == ""){
					layer.open({
						title: '提示'
						,content: '请填写SecretKey'
					});
					return false;
				}

				if($("#IKUCUN-server_url").val() == ""){
					layer.open({
						title: '提示'
						,content: '请填写商城接口地址URL'
					});
					return false;
				}

				var newData = {
					shopname:$("#IKUCUN-shopname").val(),
					shopsortname:$("#IKUCUN-shopsortname").val(),
					shopid:"IKUCUN_" + $("#IKUCUN-shopname").val(),
					shoptype:"IKUCUN",
					status:1,
					expire_time:"F",
					auth_expire_time:"F",

					appkey:$("#IKUCUN-appkey").val(),
					secretkey:$("#IKUCUN-secretKey").val(),
					server_url:$("#IKUCUN-server_url").val(),
				}
				data.push(newData);

				$.ajax({
					url: '/index.php?m=system&c=shopBinding&a=addTure',
					type: "POST",
					dataType:"json",
					data:{data: data},
					success:function(data){
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							reloadnow(self);
							layer.closeAll();
						}else{
							layer.msg(data.msg,{
								icon: 0,
								time: 2000
							});
						}
					}
				});
				// }结束zpg 
			}  else if(shoptype == "SUNING"){
				for(var i in dataObj){
					if(dataObj[i]['shopid'] == shopid){
						rowObj = dataObj[i];
					}
				}
				$("#SN-shopname").val(rowObj.shopid.replace("SUNING_", ""));
				$("#SN-shopname").attr("disabled", true);
				$("#SN-shopsortname").val(rowObj.shopsortname);
				$("#SN-shopsortname").attr("disabled", true);
				$("#SN-server_url").val(rowObj.server_url);
				$("#SN-appkey").val(rowObj.appkey);
				$("#SN-secretKey").val(rowObj.secretkey);


				layer.open({
					type: 1,
					title: '更换Screct',
					skin: 'layui-layer-rim', //加上边框
					area: ['968px', '450px'], //宽高
					shade: 0.3,
					content: $("#SUNING"),
					btn: ['确定更换', '取消']
					,yes: function(index, layero){
						if($("#SN-shopname").val() == ""){
							layer.open({
								title: '提示'
								,content: '请填写店铺ID'
							});
							return false;
						}

						if($("#SN-appkey").val() == ""){
							layer.open({
								title: '提示'
								,content: '请填写appkey'
							});
							return false;
						}
						if($("#SN-secretKey").val() == ""){
							layer.open({
								title: '提示'
								,content: '请填写SecretKey'
							});
							return false;
						}

						if($("#SN-server_url").val() == ""){
							layer.open({
								title: '提示'
								,content: '请填写商城接口地址URL'
							});
							return false;
						}

						$.ajax({
							url: '/index.php?m=system&c=shopBinding&a=editSessionkey',
							type: "POST",
							dataType:"json",
							data:{shopid:shopid, secretkey: $("#SN-secretKey").val(),appkey: $("#SN-appkey").val(),server_url: $("#SN-server_url").val()},
							success:function(data){
								if(data.code == "ok"){
									layer.msg("操作成功",{
										icon: 1,
										time: 2000
									});
									console.log(self.arr);
									reloadnow(self,self.arr);
									layer.close(index);
								}else{
									layer.msg("操作失败",{
										icon: 2,
										time: 2000
									});
								}
							}
						});
					},
					cancel: function (index, layero) {

					}
				});
			} else if(shoptype == "CCJ"){
				for(var i in dataObj){
					if(dataObj[i]['shopid'] == shopid){
						rowObj = dataObj[i];
					}
				}
				$("#shopname_ccj").val(rowObj.shopname);
				$("#shopname_ccj").attr("disabled", true);
				$("#shopsortname_ccj").val(rowObj.shopsortname);
				$("#shopsortname_ccj").attr("disabled", true);
				$("#appkey_ccj").val(rowObj.appkey);
				$("#appkey_ccj").attr("disabled", true);
				$("#secretKey_ccj").val(rowObj.secretkey);
				$("#sessionkey_ccj").val(rowObj.sessionkey);
				layer.open({																																											
					type: 1,																																											
					title: '更换授权',																																								
					skin: 'layui-layer-rim', //加上边框																																					
					area: ['968px', '450px'], //宽高
					shade: 0.3,																																											
					content: $("#chuchujie"),	
					btn: ['确定更换', '取消']
					,yes: function(index, layero){
						if($("#shopname_ccj").val() == ""){
							layer.open({																																										
								title: '提示'																																									
								,content: '请填写店铺名称'																																					
							});
							return false;
						}
						
						if($("#appkey_ccj").val() == ""){
							layer.open({																																										
								title: '提示'																																									
								,content: '请填写ORG_NAME'																																					
							});
							return false;
						}
						
						if($("#secretKey_ccj").val() == ""){
							layer.open({																																										
								title: '提示'																																									
								,content: '请填写APP_ID'																																					
							});
							return false;
						}
						
						if($("#sessionkey_ccj").val() == ""){
							layer.open({																																										
								title: '提示'																																									
								,content: '请填写APP_SECRET'
							});
							return false;
						}
						
						$.ajax({
							url: '/index.php?m=system&c=shopBinding&a=editSessionkey',
							type: "POST",
							dataType:"json",
							data:{shopid: shopid, appkey: $("#appkey_ccj").val(),secretkey: $("#secretKey_ccj").val(), sessionkey: $("#sessionkey_ccj").val()},
							success:function(data){
								if(data.code == "ok"){
									layer.msg("操作成功",{
										icon: 1,
										time: 2000
									});
									console.log(self.arr);
									reloadnow(self,self.arr);
									layer.close(index);
								}else{
									layer.msg("操作失败",{
										icon: 2,
										time: 2000
									});
								}
							}
						});
					},
					cancel: function (index, layero) {																																					
																																																		
					}																																													
				});
			}else if(shoptype == "TPLUS"){
                for(var i in dataObj){
                    if(dataObj[i]['shopid'] == shopid){
                        rowObj = dataObj[i];
                    }
                }
				
                $("#tplus-shopname").val(rowObj.shopid.replace("TPLUS_", ""));
                $("#tplus-shopname").attr("disabled", true);
                $("#tplus-shopsortname").val(rowObj.shopsortname);
				$("#tplus-server_url").val(rowObj.server_url);
                $("#tplus-appkey").val(rowObj.appkey);
                $("#tplus-secretKey").val(rowObj.secretkey);
                $("#tplus-sessionkey").val(rowObj.sessionkey);

                layer.open({
                    type: 1,
                    title: '修改T+Cloud配置',
                    skin: 'layui-layer-rim', //加上边框
                    area: ['968px', '450px'], //宽高
                    shade: 0.3,
                    content: $("#TPLUS"),
                    btn: ['确定更换', '取消']
                    ,yes: function(index, layero){
                        if($("#tplus-shopname").val() == ""){
							layer.open({
								title: '提示'
								,content: '请填写店铺名称'
							});
							return false;
						}
						if($("#tplus-server_url").val() == ""){
							layer.open({
								title: '提示'
								,content: '服务器地址'
							});
							return false;
						}
						if($("#tplus-appkey").val() == ""){
							layer.open({
								title: '提示'
								,content: '请填写用户名'
							});
							return false;
						}
						if($("#tplus-secretKey").val() == ""){
							layer.open({
								title: '提示'
								,content: '请填写密码'
							});
							return false;
						}
						if($("#tplus-sessionkey").val() == ""){
							layer.open({
								title: '提示'
								,content: '请填写账套'
							});
							return false;
						}

                        $.ajax({
                            url: '/index.php?m=system&c=shopBinding&a=editSessionkey',
                            type: "POST",
                            dataType:"json",
                            data:{shopid:shopid,secretkey: $("#tplus-secretKey").val(),sessionkey: $("#tplus-sessionkey").val(),appkey: $("#tplus-appkey").val(), server_url: $("#tplus-server_url").val()},
                            success:function(data){
                                if(data.code == "ok"){
                                    layer.msg("操作成功",{
                                        icon: 1,
                                        time: 2000
                                    });
                                    console.log(self.arr);
                                    reloadnow(self,self.arr);
                                    layer.close(index);
                                }else{
                                    layer.msg("操作失败",{
                                        icon: 2,
                                        time: 2000
                                    });
                                }
                            }
                        });
                    },
                    cancel: function (index, layero) {

                    }
                });
            }else if(shoptype == "JP"){
				for(var i in dataObj){
					if(dataObj[i]['shopid'] == shopid){
						rowObj = dataObj[i];
					}
				}
				$("#shopname").val(rowObj.shopname);
				$("#shopname").attr("disabled", true);
				$("#shopsortname").val(rowObj.shopsortname);
				$("#shopsortname").attr("disabled", true);
				$("#sessionkey").val(rowObj.sessionkey);
				$("#expireTime").val(rowObj.expire_time);
				$('#jp_btn').hide();
				
				layer.open({																																											
					type: 1,																																											
					title: '更换秘钥',																																								
					skin: 'layui-layer-rim', //加上边框																																					
					area: ['800px', '330px'], //宽高
					shade: 0.3,																																											
					content: $("#juanpi"),	
					btn: ['确定更换', '取消']
					,yes: function(index, layero){
						if($("#sessionkey").val() == ""){
							layer.open({																																										
								title: '提示'																																									
								,content: '请填写接口秘钥'																																					
							});
							return false;
						}
						
						$.ajax({
							url: '/index.php?m=system&c=shopBinding&a=editSessionkeyJP',
							type: "POST",
							dataType:"json",
							data:{shopid: shopid, sessionkey: $("#sessionkey").val(), expire_time: $("#expireTime").val()},
							success:function(data){
								if(data.code == "ok"){
									layer.msg("操作成功",{
										icon: 1,
										time: 2000
									});
									console.log(self.arr);
									reloadnow(self,self.arr);
									layer.close(index);
								}else{
									layer.msg("操作失败",{
										icon: 2,
										time: 2000
									});
								}
							}
						});
					},
					cancel: function (index, layero) {																																					
																																																		
					}																																													
				});
			}
		},
		blurNow:function(shopid){
			var shopsortname = $(event.target).val();
			$(event.target).css("border","1px solid white");
			$.ajax({
				url: '/index.php?m=system&c=shopBinding&a=changeShopsortname',
				type: "POST",
				dataType:"json",
				data:{shopid:shopid,shopsortname:shopsortname},
				success:function(data){
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
					}
				}
			});
		},
		blurShopname:function(shopid){
			var shopname = $(event.target).val();
			$(event.target).css("border","1px solid white");
			
			if(shopname == ""){
				layer.msg("请输入店铺名称！",{
					icon: 0,
					time: 2000
				});
				return false;
			}
			
			$.ajax({
				url: '/index.php?m=system&c=shopBinding&a=changeShopname',
				type: "POST",
				dataType:"json",
				data:{shopid:shopid,shopname:shopname},
				success:function(data){
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
					}
				}
			});
		},
		focusNow:function(){
			$(event.target).css("border","1px solid lightblue");
		},
		changeCustomerCode:function(shopid,customer_code){
			var self = this;
			layer.prompt({
				value: customer_code,
				title: '京东快递商家编码'
			},function(value, index, elem){
				$.ajax({
					url: '/index.php?m=system&c=shopBinding&a=changeCustomerCode',
					type: "POST",
					dataType:"json",
					data:{shopid:shopid,customer_code:value},
					success:function(data){
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							layer.close(index);
							reloadnow(self,self.arr);
						}
					}
				});
			});
		},
		changeWareHouseCode:function(shopid,wareHouseCode){
			var self = this;
			layer.prompt({
				value: wareHouseCode,
				title: '京东快递发货仓编码'
			},function(value, index, elem){
				$.ajax({
					url: '/index.php?m=system&c=shopBinding&a=changeWareHouseCode',
					type: "POST",
					dataType:"json",
					data:{shopid:shopid,wareHouseCode:value},
					success:function(data){
						if(data.code == "ok"){
							layer.msg(data.msg,{
								icon: 1,
								time: 2000
							});
							layer.close(index);
							reloadnow(self,self.arr);
						}
					}
				});
			});
		},
		changeSendAddress:function(shopid,shoptype){
			var self = this;
			
			$("#is_weigong").hide();
			if(shoptype == "阿里巴巴"){
				$("#is_weigong").show();
			}
			for(var i = 0; i < self.arr.length; i++){
				if(self.arr[i].shopid == shopid){
					if(self.arr[i].shop_print_province != ""){
						loadProvince();
						var areaValue = "";
						var a = "";
						var index1 = "";
						$("#province").val(self.arr[i].shop_print_province);
						
						var value = $("#province").find("option[value="+self.arr[i].shop_print_province+"]").attr("name");
						var d = value.split('_');
						var code = d[0];
						var count = d[1];
						var index = d[2];
						if(self.arr[i].shop_print_city != ""){
							loadCity(Area[index].mallCityList);
							$("#city").val(self.arr[i].shop_print_city);
							areaValue = $("#city").find("option[value="+self.arr[i].shop_print_city+"]").attr("name");
							a = areaValue.split('_');
							index1 = a[2];
						}
						if(self.arr[i].shop_print_district != ""){
							loadArea(Area[index].mallCityList[index1].mallAreaList);
							$("#area").val(self.arr[i].shop_print_district);
						}
					}
					form.render();
					$("#address").val(self.arr[i].shop_print_detail);
					$("#username").val(self.arr[i].shop_print_username);
					$("#tel").val(self.arr[i].shop_print_tel);
					$("#set_weigong").val(self.arr[i].is_weigong);
					
					break;
				}
			}
			
			layer.open({
				type: 1,
				title: '修改快递打印信息',
				skin: 'layui-layer-rim', //加上边框
				area: ['700px', '480px'], //宽高
				shade: 0.3,
				content: $("#edit-pages"),
				btn: ['确定', '清空', '取消'],
				yes: function(index, layero){
					self.saveAddress(shopid,index);
				},
				btn2: function(index, layero){
					$("#province").val("");
					$("#city").val("");
					$("#area").val("");
					$("#address").val("");
					$("#username").val("");
					$("#tel").val("");
					
					form.render();
					return false;
				},
				cancel: function (index, layero) {																																					
					
				}
			});
		},
		QCInfo:function(shopid){
			var self = this;
			
			for(var i = 0; i < self.arr.length; i++){
				if(self.arr[i].shopid == shopid){
					
					form.render();
					$("#zj_company").val(self.arr[i].zj_company);
					$("#zj_productMan").val(self.arr[i].zj_productMan);
					$("#zj_productAddress").val(self.arr[i].zj_productAddress);
					$("#zj_productTel").val(self.arr[i].zj_productTel);
					
					break;
				}
			}
			
			layer.open({
				type: 1,
				title: '修改质检信息',
				skin: 'layui-layer-rim', //加上边框
				area: ['700px', '480px'], //宽高
				shade: 0.3,
				content: $("#edit-pages2"),
				btn: ['确定', '清空', '取消'],
				yes: function(index, layero){
					self.saveQcInfo(shopid,index);
				},
				btn2: function(index, layero){
					$("#zj_company").val("");
					$("#zj_productMan").val("");
					$("#zj_productAddress").val("");
					$("#zj_productTel").val("");
					
					form.render();
					return false;
				},
				cancel: function (index, layero) {																																					
					
				}
			});
		},
		changeDefaultStorage:function(shopid,defaultStorage){
			var self = this;
			
			$("#pages1-storage").val(defaultStorage);
			
			layer.open({
				type: 1,
				title: '修改店铺默认仓库',
				skin: 'layui-layer-rim', //加上边框
				area: ['500px', '280px'], //宽高
				shade: 0.3,
				content: $("#edit-pages1"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					var storageVal = $("#pages1-storage").val();
					
					$.ajax({
						url: '/index.php?m=system&c=shopBinding&a=changeDefaultStorage',
						type: "POST",
						dataType:"json",
						data:{shopid: shopid, storageVal: storageVal},
						success:function(data){
							if(data.code == "ok"){
								layer.msg(data.msg,{
									icon: 1,
									time: 2000
								});
								layer.close(index);
								reloadnow(self,self.arr);
							}
						}
					});
				},
				cancel: function (index, layero) {																																					
					
				}
			});
		},
		saveAddress:function(shopid,index){
			var self = this;
			
			var province = $("#province").val();
			var city = $("#city").val();
			var area = $("#area").val();
			var address = $("#address").val();
			var username = $("#username").val();
			var tel = $("#tel").val();
			var set_weigong = $("#set_weigong").val();
			
			$.ajax({
				url: '/index.php?m=system&c=shopBinding&a=saveAddress',
				type: "POST",
				dataType:"json",
				data:{shopid: shopid, province: province, city: city, area: area, address: address, username: username, tel: tel, set_weigong: set_weigong},
				success:function(data){
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						
						layer.close(index);
						reloadnow(self,self.arr);
					}
				}
			});
		},
		saveQcInfo:function(shopid,index){
			var self = this;
			
			var zj_company = $("#zj_company").val();
			var zj_productMan = $("#zj_productMan").val();
			var zj_productAddress = $("#zj_productAddress").val();
			var zj_productTel = $("#zj_productTel").val();
			
			$.ajax({
				url: '/index.php?m=system&c=shopBinding&a=saveQcInfo',
				type: "POST",
				dataType:"json",
				data:{shopid: shopid, zj_company: zj_company, zj_productMan: zj_productMan, zj_productAddress: zj_productAddress, zj_productTel: zj_productTel},
				success:function(data){
					if(data.code == "ok"){
						layer.msg(data.msg,{
							icon: 1,
							time: 2000
						});
						
						layer.close(index);
						reloadnow(self,self.arr);
					}
				}
			});
		}
	},
});

function reloadnow(self, arr){
	$.ajax({
		url: '/index.php?m=system&c=shopBinding&a=getData',
		type: "POST",
		dataType:"json",
		data:{},
		success:function(data){
			self.arr = data;
		}
	});
}

function loadProvince() {
	var proHtml = '<option name="" value=""></option>';
	for (var i = 0; i < areaData.length; i++) {
		proHtml += '<option name="' + areaData[i].provinceCode + '_' + areaData[i].mallCityList.length + '_' + i + '" value="' + areaData[i].provinceName+ '">' + areaData[i].provinceName + '</option>';
	}
	//初始化省数据
	$form.find('select[name=province]').append(proHtml);
	form.render();
	form.on('select(province)', function(data) {
		//$form.find('select[name=area]').html('<option value="">请选择县/区</option>').parent().hide();
		var value = data.value;
		value = $("#province").find("option[value="+value+"]").attr("name");
		var d = value.split('_');
		var code = d[0];
		var count = d[1];
		var index = d[2];
		if (count > 0) {
			loadCity(areaData[index].mallCityList);
			
		} else {
			//$form.find('select[name=city]').parent().hide();
		}
	});
}
 //加载市数据
function loadCity(citys) {
	var cityHtml = '<option name="" value=""></option>';
	for (var i = 0; i < citys.length; i++) {
		cityHtml += '<option name="' + citys[i].cityCode + '_' + citys[i].mallAreaList.length + '_' + i + '" value="' + citys[i].cityName + '">' + citys[i].cityName + '</option>';
	}
	$form.find('select[name=city]').html(cityHtml).parent().show();
	form.render();
	form.on('select(city)', function(data) {
		var value = data.value;
		value = $("#city").find("option[value="+value+"]").attr("name");
		var d = value.split('_');
		var code = d[0];
		var count = d[1];
		var index = d[2];
		if (count > 0) {
			loadArea(citys[index].mallAreaList);
		} else {
			$form.find('select[name=area]').parent().show();
		}
	});
}
 //加载县/区数据
function loadArea(areas) {
	var areaHtml = '<option name="" value=""></option>';
	for (var i = 0; i < areas.length; i++) {
		areaHtml += '<option value="' + areas[i].areaName + '">' + areas[i].areaName + '</option>';
	}
	$form.find('select[name=area]').html(areaHtml).parent().show();
	form.render();
	form.on('select(area)', function(data) {
		//console.log(data);
	});
}