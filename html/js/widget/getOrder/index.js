
var vueObj = new Vue({
    el: '#app',
    data: {
        shopConfigItems:[],
		isShow:true,
    },
    mounted: function () {
        layui.use(['form', 'layedit', 'laydate', 'element'], function(){
            var element = layui.element();
			var form = layui.form();
            loadShopConfig();
			loadAutoOrder(form);
			
			form.on('switch(autoOrder)', function(data){
				var check = data.elem.checked;
				saveAutoOrder(form,check);
			});
        });
    },
    methods: {
        auth:function(shoptype){
			if(shoptype == "TB" || shoptype == "TM"){
				window.open("https://oauth.taobao.com/authorize?response_type=code&client_id=23058998&redirect_uri=https://erp.jetm3.com/index_onErp.php&state=2589005&view=web");
			}else if(shoptype == "JD"){
				window.open("https://oauth.jd.com/oauth/authorize?response_type=code&client_id=EB2715259E9EA6B8C1C3F5CF7353F390&redirect_uri=https://erp.jetm3.com/index_onErp_jd.php&state=2589005");
			}else if(shoptype == "ALBB"){
				window.open("https://auth.1688.com/auth/authorize.htm?site=china&client_id=7201479&redirect_uri=https://erp.jetm3.com/index_onErp_albb.php&state=2589005");
			}else if(shoptype == "MGJ"){
				window.open("https://oauth.mogujie.com/authorize?response_type=code&app_key=100629&redirect_uri=https://erp.jetm3.com/index_onErp_mgj2.php&state=JQ");
			}else if(shoptype == "PDD"){
				window.open("http://mms.pinduoduo.com/open.html?response_type=code&client_id=3cd6d1c964634a84a49818a966719705&redirect_uri=https://erp.jetm3.com/index_onErp_pdd.php&state=JQ");
			}
        },
        getOrder:function(shopid,shopname){
			var date1 = $("#date1").val();
			var date2 = $("#date2").val();
			if(date1 == "" && date2 != ""){
				layer.msg("请选择开始日期",{
					icon: 2,
					time: 2000
				});
				return false;
			}
			if(date1 != "" && date2 == ""){
				layer.msg("请选择结束日期",{
					icon: 2,
					time: 2000
				});
				return false;
			}
			if(date1 != "" && date2 != ""){
				if(date1 >= date2){
					layer.msg("开始日期必须小于结束日期",{
						icon: 2,
						time: 2000
					});
					return false;
				}
				var diffdate = new Date(date2).getTime() - new Date(date1).getTime();
				var diffdays = Math.ceil(diffdate/(24*3600*1000));
				if(diffdays > 7){
					layer.msg("每次最多抓单3天的订单",{
						icon: 2,
						time: 2000
					});
					return false;
				}
			}
			
			var Interval = setInterval(function(){
				$.ajax({																																														
					url: "/index.php?m=widget&c=getOrder&a=getOrderProgress",																																		
					type: 'post',																																																																																								
					dataType: 'text',																																											
					success: function (text) {
						$("#htmlInfo").val(text);
					},error: function(){
						clearInterval(Interval);
					}
				});
			},1000);
			
            execAjax({
				m:'widget',
				c:'getOrder',
				a:'downOrder',
				data:{shopid: shopid, shopname: shopname, date1: date1, date2: date2},
				success:function(data){
					if(data.code == "complete"){
						layer.msg("抓单完成",{
							icon: 1,
							time: 2000
						});
						loadShopConfig();
						
						setTimeout(function(){
							clearInterval(Interval);
						},1000);
					}else if(data.code == "continue"){
						layer.msg("系统正在自动抓单中，请稍候再试",{
							icon: 1,
							time: 5000
						});
						loadShopConfig();
						
						setTimeout(function(){
							clearInterval(Interval);
						},1000);
					}
				}
			});
        },
        getOrderByTid:function(shopid){
			layer.open({																																											
				type: 1,																																											
				title: '按订单号抓取订单',																																								
				skin: 'layui-layer-rim', //加上边框																																					
				area: ['400px', '300px'], //宽高																																					
				shade: 0.3,	
				offset: '20%',																																									
				content: $("#edit-pages1"),
				btn: ['确定', '取消'],
				yes: function(index, layero){
					vueObj.downOrderByTid(index);
				},
				btn2: function(index, layero){
					
				}																																													
			});
			
			$("#pages1-shopid").val(shopid);
			$("#downtid").val("");
        },
		downOrderByTid:function(index){
			var shopid = $("#pages1-shopid").val();
			var downtid = $("#downtid").val();
			
			if(downtid == ""){
				layer.msg("请输入订单号",{
					icon: 2,
					time: 2000
				});
				return false;
			}
			if(shopid == ""){
				layer.msg("请选择一个店铺",{
					icon: 2,
					time: 2000
				});
				return false;
			}
			
			layer.close(index);
			
			var reg = /[\r\n]/g;
			downtid = downtid.replace(reg,",");
			
			execAjax({
				m:'widget',
				c:'getOrder',
				a:'downOrderByTid',
				data:{shopid: shopid, downtid: downtid},
				success:function(data){
					if(data.code == "complete"){
						layer.msg("抓单完成",{
							icon: 1,
							time: 2000
						});
					}
				}
			});
		},
    }
});

function loadShopConfig(){
    execAjax({
        m:'widget',
        c:'getOrder',
        a:'getShopConfig',
        data:{},
        success:function(data){
            vueObj.shopConfigItems = data;
        }
    });
}

function loadAutoOrder(form){
	execAjax({
        m:'widget',
        c:'getOrder',
        a:'loadAutoOrder',
        data:{},
        success:function(data){
            if(data.isAutoOrder == '0'){
				$("#autoOrder").attr("checked",true);
				form.render('checkbox','autoOrder');
			}else if(data.isAutoOrder == '1'){
				$("#autoOrder").attr("checked",false);
				form.render('checkbox','autoOrder');
			}
        }
    });
}

function saveAutoOrder(form,check){
	execAjax({
        m:'widget',
        c:'getOrder',
        a:'saveAutoOrder',
        data:{check: check},
        success:function(data){

        }
    });
}
