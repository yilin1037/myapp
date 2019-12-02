var tableList = new Vue({
	el: '#tableList',
	data: {
		data:[],
	},
	mounted: function() {
		var self = this;
		
		//======================================================================================日期选择器=======================================================================================================
		layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {																													//===========
            var $ = layui.jquery, element = layui.element, layer = layui.layer ;																														//===========
           //触发事件
			
		  
																																														//===========
																																																	//===========
        });	
																																														//===========
		//======================================================================================日期选择器结束===================================================================================================
		
	},
	methods: {
		add:function(){
			var tr = "";
			var time = new Date();
			time = time.getTime();
			tr += "<tr class='"+time+"'><td class='skin-minimal'><div class='deleteTr' onclick='deleteTr(\""+time+"\")' style='cursor:pointer;'><i class='layui-icon' style='font-size: 14px; color: black;'>&#x1006;</i></div></td><td><input type='text' class='input_1' style='outline:none;border:1px solid white;width:100%;' onfocus='focusNow()' onblur='blurNow()'></td><td><input type='text' class='input_2' style='outline:none;border:1px solid white;width:100%;' value='1' onfocus='focusNow()' onblur='blurNow()'></td></tr>";
			$(".body_1").append(tr);
		}
	},
																																																	
});	


$(document).ready(function(){
    $('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox_minimal',
		radioClass: 'iradio_minimal',
		increaseArea: '20%'
    });
});	

function deleteTr(cla){
	$("." + cla).remove();
}

function focusNow(){
	$(event.target).css("border","1px solid #1e9fff");
}

function blurNow(){
	$(event.target).css("border","1px solid white");
}

																																																
