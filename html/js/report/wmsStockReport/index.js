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
					,url: 'index.php?m=report&c=wmsStockReport&a=wmsStockReportList'
					,cols: [[
						{field:'index', title: '序号',"width":60 ,fixed: true}
						,{field:'prd_no', title: '商家编码',"width":200}
						,{field:'sku_name', title: '销售属性',"width":200}
						,{field:'title', title: '商品名称',"width":400}
						,{field:'unit', title: '单位',"width":80}
						,{field:'wh_name', title: '仓库',"width":120}
						,{field:'prd_loc_name', title: '货位',"width":120}
						,{field:'qty', title: '数量',"width":100}
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
							wh:$("#wh").val(),
							prd_loc:$("#prd_loc").val(),
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
		
        //导出
        $("#submitExcel").click(function () {
			var indexLoad = layer.load();
            execAjax({
                m:'report',
                c:'wmsStockReport',
                a:'exportWmsStockReport',
                data:{data: self.selectData},
                success:function(data){
                    layer.close(indexLoad);
                    $("#excelFileId").val(data['id']);
                    $("#excelForm").submit();
                }
            });
        });
    },
    methods: {
		querydata:function(){
			var self = this;
			self.selectData = {
				prd_no:$("#prd_no").val(),
				wh:$("#wh").val(),
				prd_loc:$("#prd_loc").val(),
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
			$("#wh").val("");
			$("#wh_name").val("");
			$("#prd_loc").val("");
			self.selectData = [];
		},
		openSelectProduct:function(){
			layer.open({
                title :'选择商品',
                type: 2,
                shade: false,
                area: ['700px', '560px'],
                maxmin: false,
                content: '?m=widget&c=selectStorage&a=index&type=1'
            });
		}
    }
});

function searchData()
{
	vueObj.tab.reload();
}

function cbProductRows(data){
	var wh = data[0].wh;
	var name = data[0].name;

	$("#wh").val(wh);
	$("#wh_name").val(name);
}