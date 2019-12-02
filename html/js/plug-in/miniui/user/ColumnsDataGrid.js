if (!window.UserControl) window.UserControl = {};

UserControl.ColumnsDataGrid = function () {
    UserControl.ColumnsDataGrid.superclass.constructor.call(this);
    this.initComponents();
    this.bindEvents();
}

mini.extend(UserControl.ColumnsDataGrid, mini.DataGrid, {
    uiCls: 'uc-columnsdatafrid',
	isLoad:false,
	isReduce:false,
    saveTimeout:false,
	param:{},
    params:{},
    initComponents: function () {
		this.set({
            resultAsTree:false
        });
    },
    bindEvents: function () {
    	
		this.on('columnschanged', function (e) {
            var _ = this.getIsLoad();
			if(!_ && this.param['DJTYPE'] && this.param['TYPE'] && this.param['KEY']){
				var imageCol = this.getColumn('image');
				if(imageCol){
					if(imageCol['visible']){
						//this.addCls ('imagedatafrid');
						this.setVirtualScroll(false);
					}else{
						//this.removeCls ('imagedatafrid');
						this.setVirtualScroll(true);
					}
				}
				
				var columns = {};
				if(this.isReduce){
					for(var i in this.columns){
                        if(typeof this.columns[i] == 'object'){
    						columns[i] = {};
    						columns[i]['type'] = this.columns[i]['type'];
    						columns[i]['displayField'] = this.columns[i]['displayField'];
    						columns[i]['name'] = this.columns[i]['name'];
    						columns[i]['headerStyle'] = this.columns[i]['headerStyle'];
    						columns[i]['field'] = this.columns[i]['field'];
    						columns[i]['headerAlign'] = this.columns[i]['headerAlign'];
    						columns[i]['width'] = this.columns[i]['width'];
    						columns[i]['visible'] = this.columns[i]['visible'];
    						columns[i]['allowResize'] = this.columns[i]['allowResize'];
    						columns[i]['allowMove'] = this.columns[i]['allowMove'];
    						columns[i]['allowSort'] = this.columns[i]['allowSort'];
    						columns[i]['allowDrag'] = this.columns[i]['allowDrag'];
    						columns[i]['readOnly'] = this.columns[i]['readOnly'];
    						columns[i]['autoEscape'] = this.columns[i]['autoEscape'];
    						columns[i]['enabled'] = this.columns[i]['enabled'];
    						columns[i]['vtype'] = this.columns[i]['vtype'];
    						columns[i]['decimalPlaces'] = this.columns[i]['decimalPlaces'];
    						columns[i]['dataType'] = this.columns[i]['dataType'];
    						columns[i]['align'] = this.columns[i]['align'];
    						columns[i]['dateFormat'] = this.columns[i]['dateFormat'];
                        }
					}
				}else{
					columns = this.columns;
				}
				this.param['VAL'] = mini.encode(columns);
                this.params[this.param['DJTYPE'] +'-'+ this.param['TYPE']] = this.param;
                if(this.saveTimeout){
                    clearTimeout(this.saveTimeout);
                }
                this.saveTimeout = setTimeout(function() {
                    $.ajax({
    					type:"POST",
    					dataType:"json",
    					url:'/inc/ajax/class/public_class.php?use=saveVal',
    					data:this.params[this.param['DJTYPE'] +'-'+ this.param['TYPE']]
    				});
                }.bind(this), 800);
			}
        });
    },
	setIsLoad: function(_){
		this.isLoad = _;
	},
	getIsLoad: function(){
		return this.isLoad;
	},
    getAttrs: function (el) {
        var attrs = UserControl.ColumnsDataGrid.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs,
            ["param"]
        );
        return attrs;
    }
});
mini.regClass(UserControl.ColumnsDataGrid, "columnsdatafrid");