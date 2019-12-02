if (!window.UserControl) window.UserControl = {};

UserControl.ButtonAutoComplete = function () {

    UserControl.ButtonAutoComplete.superclass.constructor.call(this);
    
    this.initComponents();
    this.bindEvents();
}

mini.extend(UserControl.ButtonAutoComplete, mini.ButtonEdit, {
    uiCls: 'uc-buttonautocomplete',
	param:{},
    initComponents: function () {
		var El = this.getEl();
		var cls = El.className;
		El.className = cls.replace(" mini-popupedit","");
		$(".mini-buttonedit-button",El).css('display','inline-block');
    },
    bindEvents: function () {
		var type = true;
		var isFirst = true;
		var row = false;
        var cell = false;
        var isFocus = false;
        var isValuechanged = false;
        var isdbClick = false;
		this.on("buttonclick",function(e){
            var tab = getActiveTab();
			var sender = e.sender;
			var grid = sender.param['gridId']?getTabObjById(tab,sender.param['gridId']):getTabObjById(tab,"datagrid1");
			if(grid && grid.param && sender.param['DJTYPE'] != 'MARK' && sender.param['DJTYPE'] != 'H_MARK' && sender.param['DJTYPE'] != 'DS_MARK' && sender.param['DJTYPE'] != 'DS_MARKS' && sender.param['DJTYPE'] != 'DS_MARK_QTY' && grid.param['DJTYPE'] && sender.param['DJTYPE'] != grid.param['DJTYPE']){
                sender.param['DJTYPE'] = grid.param['DJTYPE'];
                sender.param['PLACE'] = 'B';
			}
            if(sender.param['WINDOW_DEFINE_ID']){
                sender.param['PLACE']['this'] = this;
                openWidgetWindow(sender.param);
                isValuechanged = false;
            }else if(sender.param['DJTYPE'] && sender.param["TNAME"] && sender.param["FIELD"]){
				type = "buttonclick";
				SetInitial(sender.param['PLACE']);
				var sum = sender.param['SUM']?sender.param['SUM']:1;
				if(sender.param['PLACE'] == 'H'){
					var winType = 'Single';
				}else if(sender.param['PLACE'] == 'B'){
					var winType = 'Resume';
					row = grid.getSelected();
					sum = sender.param['SUM']?sender.param['SUM']:999;
				}
                Definition_Logo(sender.param['DJTYPE'],sender.param["TNAME"],sender.param["FIELD"],sum,winType,false,sender.param["isAddTable"],grid,this,row,sender.param["MARK_FIELD"],true,false,sender.param['isView']);
                isValuechanged = false;
            }
            isFocus = false;
		}).on("click",function(e){
            if(isdbClick){
                var tab = getActiveTab();
                var sender = e.sender;
    			var grid = sender.param['gridId']?getTabObjById(tab,sender.param['gridId']):getTabObjById(tab,"datagrid1");
    			if(grid && sender.param['DJTYPE'] != 'MARK' && sender.param['DJTYPE'] != 'DS_MARK' && sender.param['DJTYPE'] != 'DS_MARKS' && sender.param['DJTYPE'] != grid.param['DJTYPE']){
                    sender.param['DJTYPE'] = grid.param['DJTYPE'];
                    sender.param['PLACE'] = 'B';
    			}
                
                if(sender.param['DJTYPE'] && sender.param["TNAME"] && sender.param["FIELD"] && $(tab).data("TYPE_Documents")!='look'){
    				type = "buttonclick";
    				SetInitial(sender.param['PLACE']);
    				var sum = sender.param['SUM']?sender.param['SUM']:1;
    				if(sender.param['PLACE'] == 'H'){
    					var winType = 'Single';
    				}else if(sender.param['PLACE'] == 'B'){
    					var winType = 'Resume';
    					row = grid.getSelected();
    					sum = sender.param['SUM']?sender.param['SUM']:999;
    				}
    				Definition_Logo(sender.param['DJTYPE'],sender.param["TNAME"],sender.param["FIELD"],sum,winType,false,sender.param["isAddTable"],grid,this,row,sender.param["MARK_FIELD"],false,false,sender.param['isView']);
                    isValuechanged = false;
                }
                isFocus = false;
            }
            isdbClick = true;
            setTimeout(function(){
                isdbClick = false;
            },200);
		}).on("enter",function(e){
            var tab = getActiveTab();
            var sender = e.sender;
            var grid = sender.param['gridId']?getTabObjById(tab,sender.param['gridId']):getTabObjById(tab,"datagrid1");
			
            if(grid && grid.param && sender.param['DJTYPE'] != 'MARK' && sender.param['DJTYPE'] != 'DS_MARK' && sender.param['DJTYPE'] != 'DS_MARKS' && sender.param['DJTYPE'] != grid.param['DJTYPE']){
                sender.param['DJTYPE'] = grid.param['DJTYPE'];
                sender.param['PLACE'] = 'B';
			}
            if(isValuechanged && sender.param['WINDOW_DEFINE_ID']){
                row = grid.getEditorOwnerRow(sender);
                cell = grid.getCurrentCell();
				if(!row){
					row = grid.getSelected();
				}
                sender.param['row'] = row;
                sender.param['cell'] = cell;
                sender.param['this'] = this;
                inputWidgetWindow(sender.param);
                isFirst = true;
                isValuechanged = false;
            }else if(isValuechanged && sender.param['DJTYPE'] && sender.param["TNAME"] && sender.param["FIELD"]){
                SetInitial(sender.param['PLACE']);
                var sum = sender.param['SUM']?sender.param['SUM']:1;
				if(sender.param['PLACE'] == 'H'){
					var winType = 'Single';
				}else if(sender.param['PLACE'] == 'B'){
					var winType = 'Resume';
				}
                if(sender.param['PLACE'] == 'B'){
					row = grid.getEditorOwnerRow(sender);
                    cell = grid.getCurrentCell();
					if(!row){
						row = grid.getSelected();
					}
				}
                Definition_Input(sender.param['DJTYPE'],sender.param["TNAME"],sender.param["FIELD"],sum,winType,false,sender.param["isAddTable"],grid,this,row,cell,sender.param["MARK_FIELD"],sender.param['isView']);
				isFirst = true;
                isValuechanged = false;
			}
            textNextFocus(sender);
            isFocus = false;
		}).on("focus",function(e){
            isFocus = true;
		}).on("valuechanged",function(e){
            if(notOpen){
                isValuechanged = true;
            }
		}).on("blur",function(e){
            if(isFocus && isValuechanged){
                var tab = getActiveTab();
                var sender = e.sender;
                var grid = sender.param['gridId']?getTabObjById(tab,sender.param['gridId']):getTabObjById(tab,"datagrid1");
    			if(isValuechanged && sender.param['DJTYPE'] && sender.param["TNAME"] && sender.param["FIELD"]){
    				SetInitial(sender.param['PLACE']);
    				if(sender.param['PLACE'] == 'H'){
    					var winType = 'Single';
    				}else if(sender.param['PLACE'] == 'B'){
    					var winType = 'Resume';
    				}
                    if(sender.param['PLACE'] == 'B'){
    					row = grid.getEditorOwnerRow(sender);
                        cell = grid.getCurrentCell();
    					if(!row){
    						row = grid.getSelected();
    					}
    				}
                    if(sender.param['PLACE'] == "H" || winType =="Single"){
                		var editButton = getTabObjById(tab,sender.param["TNAME"]+"_"+sender.param["FIELD"]);
                		if(sender.param["DJTYPE"] == 'MARK' && sender.param["TNAME"] == 'MF_MARK' && sender.param["MARK_FIELD"]){
                			editButton = getTabObjById(tab,sender.param["MARK_FIELD"]);
                		}
                	}else if(sender.param['PLACE'] == "B" || winType =="Resume"){
                	   if(grid){
                			//自定义单据
                            var editButton = grid.getCellEditor(sender.param["TNAME"]+"_"+sender.param["FIELD"]);
                			//特殊位置调用
                            var editButton2 = grid.getCellEditor(sender.param["FIELD"]);
                            
                            if(sender.param["DJTYPE"] == 'MARK' && sender.param["TNAME"] == 'MF_MARK' && sender.param["MARK_FIELD"]){
                				editButton = grid.getCellEditor(sender.param["MARK_FIELD"]);
                				var rowData = [];
                				rowData[sender.param["MARK_FIELD"]] = '';
                				rowData['RE_'+sender.param["MARK_FIELD"]] = '';
                				grid.updateRow(row,rowData);
                			}else if(row){
                			    if(editButton){
                                    var rowData = [];
                    				rowData[sender.param["TNAME"]+"_"+sender.param["FIELD"]] = '';
                    				rowData['RE_'+sender.param["TNAME"]+"_"+sender.param["FIELD"]] = '';
                                    if(sender.param["FIELD"] == 'CUR_ID'){
                                        rowData[sender.param["TNAME"]+"_EXC_RTO"] = '1';
                                    }
                    				grid.updateRow(row,rowData);
                			    }else if(editButton2){
                                    var rowData = [];
                    				rowData[sender.param["FIELD"]] = '';
                    				rowData['RE_'+sender.param["FIELD"]] = '';
                                    if(sender.param["FIELD"] == 'CUR_ID'){
                                        rowData[sender.param["TNAME"]+"_EXC_RTO"] = '1';
                                    }
                    				grid.updateRow(row,rowData);
                			    }else{
                                    //grid.rejectRecord(row);
                			    }
                                rowGrid(true);
                			}
                			rowGrid(true);
                		}else if(Table_Sub){
                			var Table_Subs = Table_Sub.split(',');
                			for(var n in Table_Subs){
                				if(typeof(Table_Subs[n]) == 'string'){
                					var grid = getTabObjById(tab,"datagrid"+(n*1+1));
                					if(grid){
                                        //自定义单据
                						var editButton = grid.getCellEditor(sender.param["TNAME"]+"_"+sender.param["FIELD"]);
                						//特殊位置调用
                                        var editButton2 = grid.getCellEditor(sender.param["FIELD"]);
                                        if(sender.param["DJTYPE"] == 'MARK' && sender.param["TNAME"] == 'MF_MARK' && sender.param["MARK_FIELD"]){
                							editButton = grid.getCellEditor(sender.param["MARK_FIELD"]);
                							var rowData = [];
                							rowData[sender.param["MARK_FIELD"]] = '';
                							rowData['RE_'+sender.param["MARK_FIELD"]] = '';
                							grid.updateRow(row,rowData);
                						}else if(row){
                							var rowData = [];
                							rowData[sender.param["TNAME"]+"_"+sender.param["FIELD"]] = '';
                							rowData['RE_'+sender.param["TNAME"]+"_"+sender.param["FIELD"]] = '';
                							if(sender.param["FIELD"] == 'CUR_ID'){
                                                rowData[sender.param["TNAME"]+"_EXC_RTO"] = '1';
                                            }
                                            grid.updateRow(row,rowData);
                						}
                						rowGrid(true);
                					}
                				}
                			}
                		}
                	}
                	if(editButton){
                		editButton.setValue('');
                		try{
                            editButton.setText('');
                        }catch(err){}
                        if(sender.param["FIELD"] == 'CUR_ID'){
                            var editButtonExcRto = getTabObjById(tab,sender.param["TNAME"]+"_EXC_RTO");
                            if(editButtonExcRto){
                                editButtonExcRto.setValue('1');
                            }
                        }
                	}else if(editButton2){
                        editButton2.setValue('');
                		try{
                            editButton2.setText('');
                        }catch(err){}
                        if(sender.param["FIELD"] == 'CUR_ID'){
                            var editButtonExcRto = getTabObjById(tab,sender.param["TNAME"]+"_EXC_RTO");
                            if(editButtonExcRto){
                                editButtonExcRto.setValue('1');
                            }
                        }
                	}else if(cell){
                        try{
                            var cellObj = cell[1];
                            var rowEmpty = {};
                            if(cellObj['name']){
                                rowEmpty[cellObj['name']] = '';
                                var editButton = grid.getCellEditor(cellObj['name']);
                                if(editButton){
                                    editButton.setValue('');
                            		try{
                                        editButton.setText('');
                                    }catch(err){}
                                }
                            }
                            if(cellObj['displayField']){
                                rowEmpty[cellObj['displayField']] = '';
                            }
                            if(sender.param["FIELD"] == 'CUR_ID'){
                                rowEmpty[sender.param["TNAME"]+"_EXC_RTO"] = '1';
                            }
                            grid.updateRow(row,rowEmpty);
                        }catch(err){}
                	}
                    isFirst = true;
                    isValuechanged = false;
    			}
            }
		}).on("hidepopup",function(e){
            var tab = getActiveTab();
			var sender = e.sender;
			var grid = sender.param['gridId']?getTabObjById(tab,sender.param['gridId']):getTabObjById(tab,"datagrid1");
			if(sender.param['DJTYPE'] && sender.param["TNAME"] && sender.param["FIELD"]){
				SetInitial(sender.param['PLACE']);
				if(sender.param['PLACE'] == 'H'){
					var winType = 'Single';
				}else if(sender.param['PLACE'] == 'B'){
					var winType = 'Resume';
				}
				Definition_Input(sender.param['DJTYPE'],sender.param["TNAME"],sender.param["FIELD"],1,winType,false,sender.param["isAddTable"],grid,this,row,sender.param["MARK_FIELD"]);
				isFirst = true;
			}
		});
		this.on("beforeshowpopup",function(e){
			var sender = e.sender;
			if(sender.param['DJTYPE'] && sender.param["TNAME"] && sender.param["FIELD"]){
				if(type && type == "buttonclick"){
					e.cancel = true;
				}
				sender.setValue(sender.getText());
				type = true;
			}else{
				e.cancel = true;
			}
		});
		this.on("showpopup",function(e){
            var tab = getActiveTab();
			var sender = e.sender;
			var grid = sender.param['gridId']?getTabObjById(tab,sender.param['gridId']):getTabObjById(tab,"datagrid1");
			if(sender.param['DJTYPE'] && sender.param["TNAME"] && sender.param["FIELD"]){
				if(isFirst){
					var G_Where = initWhere(sender.param,grid);
					sender.param['WHERE_TEXT'] = G_Where;
					var url = sender.param['url'];
					var urlParam = url+'?_=_';
					for(var p in sender.param){
						if(p!='url'){
							urlParam += '&'+p+'='+encodeURIComponent(sender.param[p]);
						}
					}
					$.ajax({
						type:"POST",
						dataType:"json",
						url:'/inc/widget/grid/Ajax_Columns.php',
						data:sender.param,
						success: function(data){
							sender.setColumns(data);
							if(data[0]){
								sender.setValueField(data[0]['field']);
								sender.setTextField(data[0]['field']);
							}
                            
						},
						error: function(){
							alert("initReturn error");
						}
					});
					sender.setUrl(url+urlParam);
					isFirst = false;
				}
				if(sender.param['PLACE'] == 'B'){
					row = grid.getEditorOwnerRow(sender);
					if(!row){
						row = grid.getSelected();
					}
				}
			}
		});
    },
    getAttrs: function (el) {
        var attrs = UserControl.ButtonAutoComplete.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs,
            ["param"]
        );
        return attrs;
    }
});
mini.regClass(UserControl.ButtonAutoComplete, "buttonautocomplete");