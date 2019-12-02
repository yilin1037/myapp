var vueObj = new Vue({
    el: '#app',
    data: {
		selectData:[]
    },
    mounted: function () {
		var self = this;
        //layui 模块 入口
		
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
				var table = layui.table,element=layui.element,layer=layui.layer,form = layui.form;
				var laydate = layui.laydate;

				var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=report&c=wmsStockReport&a=wmsStockRWarningList'
					,cols: [[
						{field:'index', title: '序号',"width":60 ,fixed: true}
						,{field:'prd_no', title: '商家编码',"width":200}
						,{field:'sku_name', title: '销售属性',"width":200}
						,{field:'title', title: '商品名称',"width":400}
						,{field:'unit', title: '单位',"width":80}
						,{field:'qty', title: '现存量',"width":100}
						,{field:'qty_min', title: '库存下限',"width":100}
						,{field:'qty_sale', title: '最近15天平均日销量',"width":180}
						,{field:'day_sale', title: '预估销售天数',"width":120}
					]]
					,id: 'testReload'
					,page: true
					,height: 'full-70'
					,limits: [20, 50, 100]
					,limit: 50
				});
				  
				var $ = layui.$, active = {
					reload: function(){
						self.selectData = {
							prd_no:$("#prd_no").val(),
							day_sale:$("#day_sale").val(),
						};
						tab.reload({
							where: {
								data: self.selectData
							}
						});
					}
				};
				
				self.tab = active;

				$('#submitSearch').on('click', function(){
					var type = $(this).data('type');
					active[type] ? active[type].call(this) : '';
				});
			});
		});
    },
    methods: {
		querydata:function(){
			var self = this;
			self.selectData = {
				prd_no:$("#prd_no").val(),
				day_sale:$("#day_sale").val(),
			};
			self.tab.reload({
				where: {
					data: self.selectData
				}
			});
		},
        resetNow:function(){
			var self = this;
			$("#prd_no").val("");
			$("#day_sale").val("");
			self.selectData = [];
		},
    }
});

function searchData()
{
	vueObj.tab.reload();
}