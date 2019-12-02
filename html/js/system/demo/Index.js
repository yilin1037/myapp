var grid = mini.get('grid');
var replace_type = mini.get("replace_type");
function addRowName(){
    grid.addRow({}, 0);
}
function saveReplace(){
	var json = mini.encode(grid.data);
	$.ajax({
		url:'/?m=system&c=demo&a=saveReplace',	
		data:{
            replace_type:replace_type.getValue(),
            data:json
        },
		dataType:"json",
		type:"POST",
		success: function(data)
		{
			if(data.code == 'ok')
			{
				mini.showTips({
					content: "<b>成功</b> <br/>数据保存成功",
					state: 'success',
					x: 'center',
					y: 'top',
					timeout: 3000
				});	
				grid.reload();
			}
			else
			{
				mini.showTips({
					content: "<b>成功</b> <br/>数据保存失败",
					state: 'danger',
					x: 'center',
					y: 'top',
					timeout: 3000
				});		
			}
		}
	});
}

function removeRow(){
	grid.commitEdit();
    var SynChange = grid.getChanges();
    var rows = grid.getSelecteds();
	if(rows.length == 0){      
		alert("至少选择一条数据");
	} else if (rows.length > 0) {
		var remove = "";
		for(var i = 0; i < rows.length; i++){   
		    if(rows[i]._state == "added"){ 
				grid.removeRow(rows[i]);
			}else{ 
			remove += rows[i].id + ",";     
			}
		}
		if(remove != ""){
			//点击删除按钮之后，判断页面是否有以编辑或添加但未保存数据
		if(SynChange.length > 0){
				alert("含有未保存数据，请先保存");
				return false;
		}else if(SynChange.length == 0){
			$.ajax({
				type:'POST',
				url:'/?m=system&c=demo&a=deleteReplace',
				dataType:'text',
				data:{"data":remove},
				success:function(data){	
					if(data > 0){
						mini.showTips({
							content: '删除成功',    
							state: 'success',      //default|success|info|warning|danger
							x: top,          //left|center|right
							y: top,          //top|center|bottom
							timeout: 2000     //自动消失间隔时间。默认2000（2秒）。
						});
						grid.reload();
						grid.clearSelect(true);
					}
					
				}
			});
		}
	  }
	}
		
}