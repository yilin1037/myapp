mini.parse();
function SetData(data){
	if(data.rowData){
		var printers =[];
		//printers.push({id:'-1',text:''});
		for(var i = 0;i<data.rowData.length;i++){
			printers.push({id:data.rowData[i].name,text:data.rowData[i].name});
		}
		mini.get("report_printer").setData(printers);
		var tplList =[];
		//tplList.push({id:'-1',text:''});
		var tplListKc =[];
		//tplListKc.push({id:'-1',text:''});
		$.ajax({
			url: "/index.php?m=afterSale&c=unpacking&a=getDefaultSetup",
			type: 'post',
			data: {},
			dataType: 'json',
			success: function (data) {
				mini.get("report_printer").setValue(data['defaultSetup'][0]);
				for(var i = 0;i<data.tplList.length;i++){
					tplList.push({id:data.tplList[i].id,text:data.tplList[i].tpl_name});
				}
				mini.get("layprintTplBqShop").setData(tplList);
				mini.get("layprintTplBqShop").setValue(data.goodlist);
				mini.get("layprintTplBqShopBad").setData(tplList);
				mini.get("layprintTplBqShopBad").setValue(data.badlist);
				mini.get("layprintTplBqSelect").setData(tplList);
				mini.get("layprintTplBqSelect").setValue(data.Selectlist);
				for(var i = 0;i<data.tplListKc.length;i++){
					tplListKc.push({id:data.tplListKc[i].id,text:data.tplListKc[i].tpl_name});
				}
				mini.get("layprintTplBqBar").setData(tplListKc);
				mini.get("layprintTplBqBar").setValue(data.barlist);
			}
		});
  }
}
function onCancel(){
	CloseWindow("cancel");
}
function CloseWindow(action) {
	if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
	else window.close();            
}
function onOk(){
	var layprintList = mini.get("report_printer").getValue();
	var layprintTplBqShop = mini.get("layprintTplBqShop").getValue();
	if(!/^[0-9]+$/.test(layprintTplBqShop)){
		$.ajax({																				
			url: "/index.php?m=aftersale&c=aftersaleNew&a=get_id",	
			type: 'post',																		
			data: {on_id:layprintTplBqShop},
			async:false,			
			dataType: 'json',	
			success: function (data) {															
				layprintTplBqShop = data;
			}																					
		});
	}
	var layprintTplBqShopBad = mini.get("layprintTplBqShopBad").getValue();
	if(!/^[0-9]+$/.test(layprintTplBqShopBad)){
		$.ajax({																				
			url: "/index.php?m=aftersale&c=aftersaleNew&a=get_id",	
			type: 'post',																		
			data: {on_id:layprintTplBqShopBad},	
			async:false,			
			dataType: 'json',																	
			success: function (data) {															
				layprintTplBqShopBad = data;
			}																					
		});
	}
	var layprintTplBqSelect = mini.get("layprintTplBqSelect").getValue();
	if(!/^[0-9]+$/.test(layprintTplBqSelect)){
		$.ajax({																				
			url: "/index.php?m=aftersale&c=aftersaleNew&a=get_id",	
			type: 'post',																		
			data: {on_id:layprintTplBqSelect},
			async:false,			
			dataType: 'json',																	
			success: function (data) {															
				layprintTplBqSelect = data;
			}																					
		});
	}
	var layprintTplBqBar = mini.get("layprintTplBqBar").getValue();
	if(!/^[0-9]+$/.test(layprintTplBqBar)){
		$.ajax({																				
			url: "/index.php?m=aftersale&c=aftersaleNew&a=get_bar_id",	
			type: 'post',	
			async:false,
			data: {on_id:layprintTplBqBar},																				
			dataType: 'json',																	
			success: function (data) {															
				layprintTplBqBar = data;
			}																					
		});
	}

	$.ajax({
	  url: "/index.php?m=afterSale&c=unpacking&a=setupDefault",
	  type: 'post',
	  data: {
		  layprintList: layprintList, 
		  layprintTplBqShop: layprintTplBqShop, 
	      layprintTplBqShopBad: layprintTplBqShopBad,
		  layprintTplBqSelect: layprintTplBqSelect,
		  layprintTplBqBar: layprintTplBqBar,
		},
	  dataType: 'json',
	  success: function (data) {
		  if(data.code == 'ok'){
				mini.showTips({
					content: "【" + data.msg + "】",
					state: 'danger',
					x: 'center',
					y: 'center',
					timeout: 3000
				});
			CloseWindow("ok");
		  }
		 }
	});
	function CloseWindow(action) {
		if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
		else window.close();            
	}
}