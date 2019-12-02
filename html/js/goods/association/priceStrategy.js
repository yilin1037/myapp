var table;
var vueObj = new Vue({
    el: '#app',
    data: {
		
    },
    mounted: function () {
		var self = this;
        var tempjson = new Array();
        var jqtb;
        //layui 模块 入口
		
		$(document).ready(function(){
			layui.use(['table','element','layer','form','laydate'], function(){
				  table = layui.table;
				  var element=layui.element,layer=layui.layer,form = layui.form;
				  var laydate = layui.laydate;
				  //时间选择器
				  layer.load(2);
				  var tab = table.render({
					elem: '#LAY_table_user'
					,url: 'index.php?m=goods&c=association&a=priceStrategyList'
					
					,cols: [[
					   {field:'index', 			title: '序号',	    "width": 60,    fixed: true, 'rowspan': 2}
					  ,{field:'prd_no', 		title: '商品编号',  "width": 120,   fixed: true, 'rowspan': 2}
					  ,{field:'title', 			title: '商品名称',  "width": 180,   fixed: true, 'rowspan': 2}
					  ,{field:'cost_price', 	title: '成本价',    "width": 100,   fixed: true, 'rowspan': 2, edit: 'text'} 
					  ,{field:'', 				title: '等级一',	"colspan":10} 
					  ,{field:'', 				title: '等级二',	"colspan":10} 
					  ,{field:'', 				title: '等级三',	"colspan":10} 
					  ,{field:'', 				title: '等级四',	"colspan":10} 
					  ,{field:'', 				title: '等级五',	"colspan":10} 
					],[
						 {field:'level1num1', 		title: '数量1',	"width":70 , edit: 'text'}
						,{field:'level1addprice1', 	title: '加成1',	"width":70 , edit: 'text'}
						,{field:'level1num2', 		title: '数量2',	"width":70 , edit: 'text'}
						,{field:'level1addprice2', 	title: '加成2',	"width":70 , edit: 'text'}
						,{field:'level1num3', 		title: '数量3',	"width":70 , edit: 'text'}
						,{field:'level1addprice3', 	title: '加成3',	"width":70 , edit: 'text'}
						,{field:'level1num4', 		title: '数量4',	"width":70 , edit: 'text'}
						,{field:'level1addprice4', 	title: '加成4',	"width":70 , edit: 'text'}
						,{field:'level1num5', 		title: '数量5',	"width":70 , edit: 'text'}
						,{field:'level1addprice5', 	title: '加成5',	"width":70 , edit: 'text'}
						
						,{field:'level2num1', 		title: '数量1',	"width":70 , edit: 'text'}
						,{field:'level2addprice1', 	title: '加成1',	"width":70 , edit: 'text'}
						,{field:'level2num2', 		title: '数量2',	"width":70 , edit: 'text'}
						,{field:'level2addprice2', 	title: '加成2',	"width":70 , edit: 'text'}
						,{field:'level2num3', 		title: '数量3',	"width":70 , edit: 'text'}
						,{field:'level2addprice3', 	title: '加成3',	"width":70 , edit: 'text'}
						,{field:'level2num4', 		title: '数量4',	"width":70 , edit: 'text'}
						,{field:'level2addprice4', 	title: '加成4',	"width":70 , edit: 'text'}
						,{field:'level2num5', 		title: '数量5',	"width":70 , edit: 'text'}
						,{field:'level2addprice5', 	title: '加成5',	"width":70 , edit: 'text'}
						
						,{field:'level3num1', 		title: '数量1',	"width":70 , edit: 'text'}
						,{field:'level3addprice1', 	title: '加成1',	"width":70 , edit: 'text'}
						,{field:'level3num2', 		title: '数量2',	"width":70 , edit: 'text'}
						,{field:'level3addprice2', 	title: '加成2',	"width":70 , edit: 'text'}
						,{field:'level3num3', 		title: '数量3',	"width":70 , edit: 'text'}
						,{field:'level3addprice3', 	title: '加成3',	"width":70 , edit: 'text'}
						,{field:'level3num4', 		title: '数量4',	"width":70 , edit: 'text'}
						,{field:'level3addprice4', 	title: '加成4',	"width":70 , edit: 'text'}
						,{field:'level3num5', 		title: '数量5',	"width":70 , edit: 'text'}
						,{field:'level3addprice5', 	title: '加成5',	"width":70 , edit: 'text'}
						
						,{field:'level4num1', 		title: '数量1',	"width":70 , edit: 'text'}
						,{field:'level4addprice1', 	title: '加成1',	"width":70 , edit: 'text'}
						,{field:'level4num2', 		title: '数量2',	"width":70 , edit: 'text'}
						,{field:'level4addprice2', 	title: '加成2',	"width":70 , edit: 'text'}
						,{field:'level4num3', 		title: '数量3',	"width":70 , edit: 'text'}
						,{field:'level4addprice3', 	title: '加成3',	"width":70 , edit: 'text'}
						,{field:'level4num4', 		title: '数量4',	"width":70 , edit: 'text'}
						,{field:'level4addprice4', 	title: '加成4',	"width":70 , edit: 'text'}
						,{field:'level4num5', 		title: '数量5',	"width":70 , edit: 'text'}
						,{field:'level4addprice5', 	title: '加成5',	"width":70 , edit: 'text'}
						
						,{field:'level5num1', 		title: '数量1',	"width":70 , edit: 'text'}
						,{field:'level5addprice1', 	title: '加成1',	"width":70 , edit: 'text'}
						,{field:'level5num2', 		title: '数量2',	"width":70 , edit: 'text'}
						,{field:'level5addprice2', 	title: '加成2',	"width":70 , edit: 'text'}
						,{field:'level5num3', 		title: '数量3',	"width":70 , edit: 'text'}
						,{field:'level5addprice3', 	title: '加成3',	"width":70 , edit: 'text'}
						,{field:'level5num4', 		title: '数量4',	"width":70 , edit: 'text'}
						,{field:'level5addprice4', 	title: '加成4',	"width":70 , edit: 'text'}
						,{field:'level5num5', 		title: '数量5',	"width":70 , edit: 'text'}
						,{field:'level5addprice5', 	title: '加成5',	"width":70 , edit: 'text'}
					]]
					,id: 'gridTable'
					,page: true
					,limit: 20 //每页默认显示的数量
					,height: 'full-90'
					,done: function(res, curr, count){
						layer.closeAll('loading');
					}
				  });
				  
				  var $ = layui.$, active = {
					reload: function(){
						layer.load(2);
						tab.reload({
							where: {
								prd_no: $("#prd_no").val(),
								title: $("#title").val(),
							}
						});
					}
				  };
				  
				  $('#submitSearch').on('click', function(){
					var type = $(this).data('type');
					
					active[type] ? active[type].call(this) : '';
				  });
				  
				  $('.key_search').on('keydown', function(){
					  var e = event || window.event;
					  if(e.keyCode == 13){
						var type = $(this).data('type');
					
						active[type] ? active[type].call(this) : '';
					  }
				  });
			});
		});
    },
    methods: {
        resetNow:function(){
			var self = this;
			$("#prd_no").val("");
            $("#title").val("");
		},
		saveData:function(){
			var self = this;
			var gridTable = table['cache']['gridTable'];
			var dataJson = mini.encode(gridTable);
			dataJson = encodeURI(dataJson);
			
			execAjax({
                m:'goods',
                c:'association',
                a:'priceStrategyListSave',
				data:{gridTable: dataJson},
                success:function(data){
                    layer.msg('保存成功',{
						icon: 1,
						time: 2000
					});
					table.reload('gridTable');
                }
            });
		}
    }
});