var flow = new Vue({
    el: '#flow',
    data: {
        shopArr:[],
        expressArr:[],
        hui:false,                                               //判断灰旗是否勾选
        red:false,                                               //判断红旗是否勾选
        yellow:false,                                            //判断黄旗是否勾选
        green:false,                                             //判断绿旗是否勾选
        blue:false,                                              //判断蓝旗是否勾选
        pink:false,                                              //判断粉旗是否勾选
        noRemark:false,                                          //无留言且无备注
        haveRemark:false,                                        //有留言或备注
        print:"",                                                //标签打印组内是否打印标记
        facePrint:"",                                            //面单组内是否打印标记
        coding:true,                                             
        babyNum:"1",
        badyOrder:false,
        order:"",
        searchData:"",
        express:"",
        nowPage:false,
        allPage:false,
        isAll:0,
        quickArr:[],                                             //快捷查询数组
        shopId:"",
        orderStatus:"",
        remark:"",
        data:[],
        pageNo:1,
        pageCount:0,
        pageSize:50,
        allNum:0,
        total:{},
        layprint:"",
        layprintTplBq:"",
        layprintTplCq:"",
        defaultMsg:"",
        expressSort:"",
        prd_no:"",
        type:"",
        preDeliveryMsg:"",
        num:"",
        sku_name:"",
        faceMakeMsg:[],
        refundAgree:"",
        getTemplate:[],  //电子面单模板
        getTemplateCheck:[],  //质检标签模板
        disableNum:0,
    },
    mounted: function() {
        var self = this;
        var nameArr = $("#user").val();
        if(localStorage.getItem(nameArr)){
            var newArr = JSON.parse(localStorage.getItem(nameArr));
            self.quickArr = newArr;
        }
        
        self.getTotal();
        
        $("#unique_code").focus();
        layui.use(['tree', 'layer','element'], function(){
            var layer = layui.layer,element=layui.element
            ,$ = layui.jquery; 
          
           
        });
        
        //========================================================================================获取店铺=======================================================================================================
        $.ajax({                                                                                                                                                                                    //===========
            url: "/index.php?m=system&c=quickStrike&a=getShop",                                                                                                                                     //===========
            type: 'post',                                                                                                                                                                           //===========
            data: {},                                                                                                                                                                               //===========
            dataType: 'json',                                                                                                                                                                       //===========
            success: function (data) {                                                                                                                                                              //===========
                self.shopArr = data;                                                                                                                                                                //===========
            }                                                                                                                                                                                       //===========
        });                                                                                                                                                                                         //===========
        //=======================================================================================获取店铺结束====================================================================================================
        
        //========================================================================================获取快递=======================================================================================================
        $.ajax({                                                                                                                                                                                
            url: "/index.php?m=system&c=delivery&a=getExpress",                                                                                                                                     
            type: 'post',                                                                                                                                                                           
            data: {},                                                                                                                                                                               
            dataType: 'json',                                                                                                                                                                       
            success: function (data) {                                                                                                                                                              
                self.expressArr = data;                                                                                                                                                             
            }                                                                                                                                                                                       
        });                                                                                                                                                                                         
        //=======================================================================================获取快递结束====================================================================================================
        
        //======================================================================================日期选择器=======================================================================================================
        layui.use(['element', 'layer','form', 'layedit', 'laydate'], function () {                                                                                                                  
            var $ = layui.jquery, element = layui.element, layer = layui.layer ;                                                                                                                    
            var form = layui.form(),layer = layui.layer,layedit = layui.layedit,laydate = layui.laydate;                                                                                            
            // 初始化表格                                                                                                                                                                            
            var jqtb = $('#dateTable').DataTable({                                                                                                                                                  
                "`dom": '<"top">rt<"bottom"flp><"clear">',                                                                                                                                          
                "autoWidth": false,                     // 自适应宽度                                                                                                                                
                "paging": true,                                                                                                                                                                     
                "pagingType": "full_numbers",                                                                                                                                                       
                "processing": true,                                                                                                                                                                 
                "serverSide": true,//开启服务器获取数据                                                                                                                                              
                "fnServerParams": function (aoData) {                                                                                                                                               
                },                                                                                                                                                                                  
                //请求url                                                                                                                                                                         
                "sAjaxSource": "index.php?m=system&c=message&a=getChildAccount",                                                                                                                    
                // 初始化表格                                                                                                                                                                        
            });                                                                                                                                                                                     
                                                                                                                                                                                                    
        }); 
                                                                                                                                                                                        
        //======================================================================================日期选择器结束===================================================================================================
        
        searchALLNow(self,'F');
    },
    methods: {
        //===================================================================================== 查询模块标签点击事件 ============================================================================================
        //                                                                                                                                                                                          //===========
        //      点击时通过传过来的值判断是哪个标签执行此方法                                                                                                                                      //===========
        //                                                                                                                                                                                          //===========
        //      $(".labelGroup div").each(function(){                                                                                                                                               //===========
        //          $(".labelGroup .ic").remove();                                                                                                                                                  //===========
        //          $(this).css("borderColor","#c2c2c2");                                                                                                                                           //===========
        //      });                                                                                                                                                                                 //===========
        //                                                                                                                                                                                          //===========
        //      类似此类代码均为做每个组内的初始化操作                                                                                                                                             //===========
        //                                                                                                                                                                                          //===========
        //=======================================================================================================================================================================================================
        //              |
        //              |
        //              |   
        //              |  
        //            \ | /
        //             \|/
        searchAdd:function(group,who){
            var self = this;
            var toggle = event.currentTarget;
            $(".quick_1 button").each(function(){
                $(".quick_1 .ic").remove();             
                $(this).css("borderColor","#c2c2c2");                                                                                                                                       
            });
            //==================================================================================标签打印组选择标签===============================================================================================
            //                                                                                                                                                                                      =============
            //      此模块为单选标签，只能同时选中一个，点击后将状态记录到 self.print 查询时直接拿此变量值即可                                                                                     =============
            //      点击全部时 self.print 恢复默认值                                                                                                                                              =============
            //                                                                                                                                                                                      =============
            //===================================================================================================================================================================================================
            if(group == "labelGroup"){                                                                                                                                                              //===========
                $(".labelGroup div").each(function(){                                                                                                                                               //===========
                    $(".labelGroup .ic").remove();                                                                                                                                                  //===========
                    $(this).removeClass("border");                                                                                                                                              //===========
                });                                                                                                                                                                                 //===========
                $(toggle).append("<i class='ic'></i>");                                                                                                                         //===========
                $(toggle).addClass("border");                                                                                                                                           //===========
                if(who == "donnot"){                                                                                                                                                                //===========
                    self.print = "1";                                                                                                                                                               //===========
                    $("#searchArr .lab").remove();                                                                                                                                                  //===========
                    $("#searchArr").append("<span class='add lab rem'>标签未打印<i class='dele' id='labelGroup' onclick='closeNow(\"labelGroup\")'></i></span>");                                    //===========
                }else if(who == "do"){                                                                                                                                                              //===========
                    self.print = "2";                                                                                                                                                               //===========
                    $("#searchArr .lab").remove();                                                                                                                                                  //===========
                    $("#searchArr").append("<span class='add lab rem'>标签已打印<i class='dele' id='labelGroup' onclick='closeNow(\"labelGroup\")'></i></span>");                                    //===========
                }else if(who == "all"){                                                                                                                                                             //===========
                    self.print = "";                                                                                                                                                                //===========
                    $("#searchArr .lab").remove();                                                                                                                                                  //===========
                }                                                                                                                                                                                   //===========
            }                                                                                                                                                                                       //===========
            //================================================================================标签打印组选择标签结束=============================================================================================
            
            //====================================================================================面单打印组选择标签=============================================================================================
            //                                                                                                                                                                                      =============
            //      此模块为单选标签，只能同时选中一个，点击后将状态记录到 self.facePrint 查询时直接拿此变量值即可                                                                                 =============
            //      点击全部时 self.facePrint 恢复默认值                                                                                                                                          =============
            //                                                                                                                                                                                      =============
            //===================================================================================================================================================================================================
            else if(group == "faceGroup"){                                                                                                                                                          //===========
                $(".faceGroup div").each(function(){                                                                                                                                                //===========
                    $(".faceGroup .ic").remove();                                                                                                                                                   //===========
                    $(this).removeClass("border");                                                                                                                                              //===========
                });                                                                                                                                                                                 //===========
                $(toggle).append("<i class='ic'></i>");                                                                                                                         //===========
                $(toggle).addClass("border");                                                                                                                                           //===========
                if(who == "faceDonnot"){                                                                                                                                                            //===========
                    self.facePrint = "1";                                                                                                                                                           //===========
                    $("#searchArr .face").remove();                                                                                                                                                 //===========
                    $("#searchArr").append("<span class='add face rem'>面单未打印<i class='dele' id='faceGroup' onclick='closeNow(\"faceGroup\")'></i></span>");                                 //===========
                }else if(who == "faceDo"){                                                                                                                                                          //===========
                    self.facePrint = "2";                                                                                                                                                           //===========
                    $("#searchArr .face").remove();                                                                                                                                                 //===========
                    $("#searchArr").append("<span class='add face rem'>面单已打印<i class='dele' id='faceGroup' onclick='closeNow(\"faceGroup\")'></i></span>");                                 //===========
                }else if(who == "all"){                                                                                                                                                             //===========
                    self.facePrint = "0";                                                                                                                                                           //===========
                    $("#searchArr .face").remove();                                                                                                                                                 //===========
                }                                                                                                                                                                                   //===========
            }                                                                                                                                                                                       //===========
            //==================================================================================面单打印组选择标签结束===========================================================================================
            
            //======================================================================================条件筛选组选择标签===========================================================================================
            //                                                                                                                                                                                      =============
            //      此模块为单选标签，只能同时选中一个，点击后将状态记录到 self.remark 查询时直接拿此变量值即可                                                                                        =============
            //      此组无全部按钮，所以第二次点击相同标签，需取消选中状态，同时 self.remark 恢复为默认值，所以要多做一层判断                                                                     =============
            //      判断方法：通过在 data 内给定每个标签一个对应的变量 记录此时是否为选中状态                                                                                                        =============
            //                  self.haveRemark   --------  有留言或有备注 标签是否选中                                                                                                              =============
            //                  self.noRemark     --------  无留言且无备注 标签是否选中                                                                                                              =============
            //                                                                                                                                                                                      =============
            //===================================================================================================================================================================================================
            else if(group == "conditionGroup"){                                                                                                                                                     //===========
                $(".conditionGroup div").each(function(){                                                                                                                                           //===========
                    $(".conditionGroup .ic").remove();                                                                                                                                              //===========
                    $(this).removeClass("border");                                                                                                                                              //===========
                });                                                                                                                                                                                 //===========
                $(toggle).append("<i class='ic'></i>");                                                                                                                         //===========
                $(toggle).addClass("border");                                                                                                                                           //===========
                if(who == "haveRemark"){                                                                                                                                                            //===========
                    if(self.haveRemark == false){                                                                                                                                                   //===========
                        self.remark = "1";                                                                                                                                                          //===========
                        $("#searchArr .remar").remove();                                                                                                                                            //===========
                        $("#searchArr").append("<span class='add remar rem'>有留言或备注<i class='dele' id='conditionGroup' onclick='closeNow(\"conditionGroup\")'></i></span>");                 //===========
                        self.haveRemark = true;                                                                                                                                                     //===========
                        self.noRemark = false;                                                                                                                                                      //===========
                    }else if(self.haveRemark == true){                                                                                                                                              //===========
                        self.remark = "";                                                                                                                                                           //===========
                        $("#searchArr .remar").remove();                                                                                                                                            //===========
                        self.haveRemark = false;                                                                                                                                                    //===========
                        $(".conditionGroup .ic").remove();                                                                                                                                          //===========
                        $(toggle).removeClass("border");                                                                                                                                        //===========
                    }                                                                                                                                                                               //===========
                }else if(who == "noRemark"){                                                                                                                                                        //===========
                    if(self.noRemark == false){                                                                                                                                                     //===========
                        self.remark = "2";                                                                                                                                                          //===========
                        $("#searchArr .remar").remove();                                                                                                                                            //===========
                        $("#searchArr").append("<span class='add remar rem'>无留言且无备注<i class='dele' id='conditionGroup' onclick='closeNow(\"conditionGroup\")'></i></span>");                    //===========
                        self.noRemark = true;                                                                                                                                                       //===========
                        self.haveRemark = false;                                                                                                                                                    //===========
                    }else if(self.noRemark == true){                                                                                                                                                //===========
                        self.remark = "";                                                                                                                                                           //===========
                        $("#searchArr .remar").remove();                                                                                                                                            //===========
                        self.noRemark = false;                                                                                                                                                      //===========
                        $(".conditionGroup .ic").remove();                                                                                                                                          //===========
                        $(toggle).removeClass("border");                                                                                                                                        //===========
                    }                                                                                                                                                                               //===========
                }                                                                                                                                                                                   //===========
            }                                                                                                                                                                                       //===========
            //=====================================================================================条件筛选组选择标签结束========================================================================================
            
            //=======================================================================================宝贝数量组选择标签==========================================================================================
            //                                                                                                                                                                                      =============
            //      此模块为单选标签，只能同时选中一个，点击后将状态记录到 self.babyNum 查询时直接拿此变量值即可                                                                                   =============
            //      此组无全部按钮，所以第二次点击相同标签，需取消选中状态，同时 self.babyNum 恢复为默认值，所以要多做一层判断                                                                        =============
            //      判断方法：通过在 data 内给定每个标签一个对应的变量 记录此时是否为选中状态                                                                                                        =============
            //                  self.isSingle   --------  单款单件 标签是否选中                                                                                                                       =============
            //                  self.multiple   --------  单款多件 标签是否选中                                                                                                                       =============
            //                  self.variety    --------  多款多件 标签是否选中                                                                                                                       =============
            //                                                                                                                                                                                      =============
            //===================================================================================================================================================================================================
            else if(group == "babyGroup"){                                                                                                                                                          //===========
                $(".babyGroup div").each(function(){                                                                                                                                                //===========
                    $(".babyGroup .ic").remove();                                                                                                                                                   //===========
                    $(this).removeClass("border");                                                                                                                                          //===========
                });                                                                                                                                                                                 //===========
                $(toggle).append("<i class='ic'></i>");                                                                                                                         //===========
                $(toggle).addClass("border");                                                                                                                                               //===========
                if(who == "single"){                                                                                                                                                                //===========
                    //if(self.isSingle == false){                                                                                                                                                       //===========
                        self.babyNum = 1;                                                                                                                                                           //===========
                        $("#searchArr .sin").remove();                                                                                                                                              //===========
                        $("#searchArr").append("<span class='add sin rem'>单款单件<i class='dele' id='babyGroup' onclick='closeNow(\"babyGroup\")'></i></span>");                                   //===========
                        //self.isSingle = true;                                                                                                                                                     //===========
                        //self.multiple = false;                                                                                                                                                        //===========
                        //self.variety = false;                                                                                                                                                     //===========
                    //}                                                                                                                                                                         //===========
                }else if(who == "multiple"){                                                                                                                                                        //===========
                    //if(self.multiple == false){                                                                                                                                                       //===========
                        self.babyNum = 2;                                                                                                                                                           //===========
                        $("#searchArr .sin").remove();                                                                                                                                              //===========
                        $("#searchArr").append("<span class='add sin rem'>单款多件<i class='dele' id='babyGroup' onclick='closeNow(\"babyGroup\")'></i></span>");                                   //===========
                        //self.multiple = true;                                                                                                                                                     //===========
                        //self.isSingle = false;                                                                                                                                                        //===========
                        //self.variety = false;                                                                                                                                                     //===========
                    //}                                                                                                                                                                         //===========
                }
            }                                                                                                                                                                                       //===========
            //=====================================================================================宝贝数量组选择标签接结束======================================================================================
            
            //===========================================================================================旗帜组选择标签==========================================================================================
            //                                                                                                                                                                                      =============
            //      此模块为多选标签，可同时选中多个，并且第二次点击后需要取消选中，每个旗帜在 data 内都有对应是否选中状态记录值                                                                   =============
            //      点击全部则取消所有此组内选中的标签                                                                                                                                               =============
            //      判断方法：通过在 data 内给定每个标签一个对应的变量 记录此时是否为选中状态                                                                                                        =============
            //                  状态值在 data 内有注释标明                                                                                                                                            =============
            //                                                                                                                                                                                      =============
            //===================================================================================================================================================================================================
            else if(group == "bannerArr"){                                                                                                                                                          //===========
                $(toggle).append("<i class='ic'></i>");                                                                                                                         //===========
                $(toggle).addClass("border");                                                                                                                                           //===========
                $(".bannerArr .all .ic").remove();                                                                                                                                                  //===========
                $(".bannerArr .all").removeClass("border");                                                                                                                                     //===========
                if(who == "hui"){                                                                                                                                                                   //===========
                    if(self.hui == false){                                                                                                                                                          //===========
                        $("#searchArr .ban").append("<span class='bannerA hui rem' style='background-image:url(\"images/hui.png\");background-size:100% 100%;'></span>");                           //===========
                        self.hui = true;                                                                                                                                                            //===========
                    }else if(self.hui == true){                                                                                                                                                     //===========
                        $("#searchArr .ban .hui").remove();                                                                                                                                         //===========
                        self.hui = false;                                                                                                                                                           //===========
                        $(toggle).removeClass("border");                                                                                                                                        //===========
                        $(".bannerArr .banner_1 .ic").remove();                                                                                                                                     //===========
                    }                                                                                                                                                                               //===========
                }else if(who == "red"){                                                                                                                                                             //===========
                    if(self.red == false){                                                                                                                                                          //===========
                        $("#searchArr .ban").append("<span class='bannerA red rem' style='background-image:url(\"images/red.png\");background-size:100% 100%;'></span>");                           //===========
                        self.red = true;                                                                                                                                                            //===========
                    }else if(self.red == true){                                                                                                                                                     //===========
                        $("#searchArr .ban .red").remove();                                                                                                                                         //===========
                        self.red = false;                                                                                                                                                           //===========
                        $(toggle).removeClass("border");                                                                                                                                            //===========
                        $(".bannerArr .banner_2 .ic").remove();                                                                                                                                     //===========
                    }                                                                                                                                                                               //===========
                }else if(who == "yellow"){                                                                                                                                                          //===========
                    if(self.yellow == false){                                                                                                                                                       //===========
                        $("#searchArr .ban").append("<span class='bannerA yellow rem' style='background-image:url(\"images/yellow.png\");background-size:100% 100%;'></span>");                     //===========
                        self.yellow = true;                                                                                                                                                         //===========
                    }else if(self.yellow == true){                                                                                                                                                  //===========
                        $("#searchArr .ban .yellow").remove();                                                                                                                                      //===========
                        self.yellow = false;                                                                                                                                                        //===========
                        $(toggle).removeClass("border");                                                                                                                                        //===========
                        $(".bannerArr .banner_3 .ic").remove();                                                                                                                                     //===========
                    }                                                                                                                                                                               //===========
                }else if(who == "green"){                                                                                                                                                           //===========
                    if(self.green == false){                                                                                                                                                        //===========
                        $("#searchArr .ban").append("<span class='bannerA green rem' style='background-image:url(\"images/green.png\");background-size:100% 100%;'></span>");                       //===========
                        self.green = true;                                                                                                                                                          //===========
                    }else if(self.green == true){                                                                                                                                                   //===========
                        $("#searchArr .ban .green").remove();                                                                                                                                       //===========
                        self.green = false;                                                                                                                                                         //===========
                        $(toggle).removeClass("border");                                                                                                                                        //===========
                        $(".bannerArr .banner_4 .ic").remove();                                                                                                                                     //===========
                    }                                                                                                                                                                               //===========
                }else if(who == "blue"){                                                                                                                                                            //===========
                    if(self.blue == false){                                                                                                                                                         //===========
                        $("#searchArr .ban").append("<span class='bannerA blue rem' style='background-image:url(\"images/blue.png\");background-size:100% 100%;'></span>");                         //===========
                        self.blue = true;                                                                                                                                                           //===========
                    }else if(self.blue == true){                                                                                                                                                    //===========
                        $("#searchArr .ban .blue").remove();                                                                                                                                        //===========
                        self.blue = false;                                                                                                                                                          //===========
                        $(toggle).removeClass("border");                                                                                                                                    //===========
                        $(".bannerArr .banner_5 .ic").remove();                                                                                                                                     //===========
                    }                                                                                                                                                                               //===========
                }else if(who == "pink"){                                                                                                                                                            //===========
                    if(self.pink == false){                                                                                                                                                         //===========
                        $("#searchArr .ban").append("<span class='bannerA pink rem' style='background-image:url(\"images/fen.png\");background-size:100% 100%;'></span>");                          //===========
                        self.pink = true;                                                                                                                                                           //===========
                    }else if(self.pink == true){                                                                                                                                                    //===========
                        $("#searchArr .ban .pink").remove();                                                                                                                                        //===========
                        self.pink = false;                                                                                                                                                          //===========
                        $(toggle).removeClass("border");                                                                                                                                        //===========
                        $(".bannerArr .banner_6 .ic").remove();                                                                                                                                     //===========
                    }                                                                                                                                                                               //===========
                }else if(who == "all"){                                                                                                                                                             //===========
                    $("#searchArr .ban span").remove();                                                                                                                                             //===========
                                                                                                                                                                                                    //===========
                    $(".bannerArr div").each(function(){                                                                                                                                            //===========
                        $(".bannerArr .ic").remove();                                                                                                                                               //===========
                        $(this).removeClass("border");                                                                                                                                          //===========
                    });                                                                                                                                                                             //===========
                                                                                                                                                                                                    //===========
                    $(toggle).append("<i class='ic'></i>");                                                                                                                     //===========
                    $(toggle).addClass("border");                                                                                                                                       //===========
                                                                                                                                                                                                    //===========
                    self.hui = false;                                                                                                                                                               //===========
                    self.red = false;                                                                                                                                                               //===========
                    self.green = false;                                                                                                                                                             //===========
                    self.yellow = false;                                                                                                                                                            //===========
                    self.blue = false;                                                                                                                                                              //===========
                    self.pink = false;                                                                                                                                                              //===========
                }                                                                                                                                                                                   //===========
                                                                                                                                                                                                    //===========
            }else if(group == "refundGroup"){                                                                                                                                                       //===========
                $(".refundGroup div").each(function(){                                                                                                                                          //===========
                    $(".refundGroup .ic").remove();                                                                                                                                             //===========
                    $(this).removeClass("border");                                                                                                                                              //===========
                });                                                                                                                                                                                 //===========
                $(toggle).append("<i class='ic'></i>");                                                                                                                         //===========
                $(toggle).addClass("border");                                                                                                                                           //===========
                if(who == "refundagree"){                                                                                                                                                           //===========
                    if(self.refundAgree == ""){                                                                                                                                                 //===========
                        self.refundAgree = "1";                                                                                                                                                         //===========
                        $("#searchArr .reagree").remove();                                                                                                                                          //===========
                        $("#searchArr").append("<span class='add reagree'>包含退款申请<i class='dele' id='refundGroup' onclick='closeNow(\"refundGroup\")'></i></span>");                 //===========
                    }else if(self.refundAgree == "1"){                                                                                                                                              //===========
                        self.refundAgree = "";                                                                                                                                                          //===========
                        $("#searchArr .reagree").remove();                                                                                                                                          //===========
                        $(".refundGroup .ic").remove();                                                                                                                                         //===========
                        $(toggle).removeClass("border");                                                                                                                                        //===========
                    }                                                                                                                                                                               //===========
                }                                                                                                                                                                                   //===========
            }
            searchALLNow(self,'F');
            self.getTotal();
        },
        //===========================================================================================旗帜组选择标签结束==========================================================================================    
        
        //====================================================================================================重置按钮===========================================================================================
        resetNow:function(){                                                                                                                                                                        //===========
            var self = this;                                                                                                                                                                        //===========
            resetF(self,'F');                                                                                                                                                                       //===========
        },                                                                                                                                                                                          //===========
        //====================================================================================================重置结束===========================================================================================
        
        //====================================================================================================查询方法===========================================================================================
        searchALL:function(){                                                                                                                                                                       
            var self = this;                                                                                                                                                                        
            searchALLNow(self,'F');                                                                                                                                                                 
            $(".quick_1 button").each(function(){
                $(".quick_1 .ic").remove();             
                $(this).css("borderColor","#c2c2c2");                                                                                                                                       
            });
        },                                                                                                                                                                                          
        //==================================================================================================查询方法结束=========================================================================================
        
        //============================================================================================排序选择按钮===============================================================================================
        //                                                                                                                                                                                          =============
        //      点击排序按钮 将 self.order 改变，用来记录此刻根据什么要求排序                                                                                                                       =============
        //      因为每次点击需要切换状态以及箭头方向（正序或者倒序），所以每个按钮都在 data 内有唯一对应的变量记录此时的状态                                                                       =============
        //      并且每次点击一个按钮时，其他按钮对应的状态值都要做初始化（false）                                                                                                                 =============
        //              self.coding         -----         商家编码排序按钮 对应状态值  （true，false）                                                                                              =============
        //              self.orderAmount    -----         订单金额排序按钮 对应状态值  （true，false）                                                                                              =============
        //              self.babyNum        -----         宝贝数量排序按钮 对应状态值  （true，false）                                                                                              =============
        //              下拉选项按钮不需要记录此刻的状态，只需要将上述三个按钮状态值初始化为 false 即可，然后改变 self.order 值即可                                                                 =============
        //                                                                                                                                                                                          =============
        //=======================================================================================================================================================================================================
        orderBy:function(type){                                                                                                                                                                     
            var toggle = event.currentTarget;                       //-----获取点击元素本身                                                                                                         
            var self = this;                                                                                                                                                                        
                                                                                                                                                                                                    
            $(".orderByDiv").removeClass("must");                   //------------------------------------------------------------------                                                            
            $(".orderByDiv").css("zIndex",0);                       //                          初始化                                                                                             
            $(".orderD .orderImg").remove();                        //  每次点击排序按钮时都将样式恢复原始状态 再根据下面判断做样式修改                                                                
            $(".orderD").find(".orderText").css("top","0");         //------------------------------------------------------------------                                                            
                                                                                                                                                                                                    
            if(type == "coding"){                                   //-----商家编码排序按钮                                                                                                         
                                                                                                                                                                    
                self.badyOrder = false;                                                                                                                                                             
                                                                                                                                                                                                    
                $(toggle).find(".orderText").css("top","-7px");     //--------------                                                                                                                
                $(toggle).addClass("must");                         //  做样式修改                                                                                                                   
                $(toggle).css("zIndex",10);                         //--------------                                                                                                                
                if(self.coding == false){                                                                                                                                                           
                    self.order = "codingDown";                                                                                                                                                      
                    $(toggle).append("<span class='orderImg' style='background-image:url(\"images/toDown.png\");background-size:100% 100%;'></span>");                                              
                    self.coding = true;                                                                                                                                                         
                }else if(self.coding == true){                                                                                                                                                      
                    self.order = "codingUp";                                                                                                                                                        
                    $(toggle).append("<span class='orderImg' style='background-image:url(\"images/toUp.png\");background-size:100% 100%;'></span>");                                                
                    self.coding = false;                                                                                                                                                                
                }                                                                                                                                                                                   
            }else if(type == "babyNum"){                            //-----宝贝数量排序按钮                                                                                                         
                                                                                                                                                                        
                self.coding = false;                                                                                                                                                                
                                                                                                                                                                                                    
                $(toggle).find(".orderText").css("top","-7px");     //--------------                                                                                                                
                $(toggle).addClass("must");                         //  做样式修改                                                                                                                   
                $(toggle).css("zIndex",10);                         //--------------                                                                                                                
                                                                                                                                                                                                    
                if(self.badyOrder == false){                                                                                                                                                            
                    self.order = "babyNumDown";                                                                                                                                                     
                    $(toggle).append("<span class='orderImg' style='background-image:url(\"images/toDown.png\");background-size:100% 100%;'></span>");                                              
                    self.badyOrder = true;                                                                                                                                                          
                }else if(self.badyOrder == true){                                                                                                                                                       
                    self.order = "babyNumUp";                                                                                                                                                       
                    $(toggle).append("<span class='orderImg' style='background-image:url(\"images/toUp.png\");background-size:100% 100%;'></span>");                                                
                    self.badyOrder = false;                                                                                                                                                         
                }                                                                                                                                                                                   
            }                                                                                                                                                           
            $(".orderHide").css("display","none");                                                                                                                                                  
                                                                                                                                                                                                    
            searchALLNow(self,'F');                                                                                                                                                                     
                                                                                                                                                                                                    
        },                                                                                                                                                                                          
        //================================================================================排序选择按钮结束=======================================================================================================
        
        //===================================================================================== 当前页 全部页 事件 ==============================================================================================
        //                                                                                                                                                                                          
        //      点击时通过传过来的值判断是哪个按钮执行此方法                                                                                                                                      
        //                                                                                                                                                                          
        //      type          : 判断是当前页还是全部页 
        //      nowPage       : 判断当前页 i（.inputTe） 标签是否为勾选状态
        //      allPage       : 判断全部页 i（.inputTe） 标签是否为勾选状态
        //      isAll         : 记录目前为全部页还是当前页，用于传入后台做判断
        //      event.target  : 获取当前点击对象
        //
        //      为避免button 内的checkbox勾选无效，所以用 i（.inputTe） 标签画一个 虚拟 checkbox 每次点击切换背景颜色
        //                                                                                                                                                                                          
        //=======================================================================================================================================================================================================
        //              |
        //              |   
        //              |  
        //            \ | /
        //             \|/
        selectAll:function(type){
            var self = this;
            if(type == "now"){
                $(".currentAll").find(".inputTe").each(function(){
                    $(this).css("color","white");
                });
                self.isAll = 0;
                self.allPage = false;
                if(self.nowPage == false){
                    if($(event.target).attr('value') != "icon"){
                        $(event.target).find(".inputTe").css("color","black");
                    }else{
                        $(event.target).css("color","black");
                    }
                    self.nowPage = true;
                    $(".skin-minimal input[name='order']").iCheck('check'); 
                }else if(self.nowPage == true){
                    if($(event.target).attr('value') != "icon"){
                        $(event.target).find(".inputTe").css("color","white");
                    }else{
                        $(event.target).css("color","white");
                    }
                    self.nowPage = false;
                    $(".skin-minimal input[name='order']").iCheck('uncheck');   
                }
            }else if(type == "all"){
                $(".current").find(".inputTe").each(function(){
                    $(this).css("color","white");
                });
                self.nowPage = false;
                if(self.allPage == false){
                    if($(event.target).attr('value') != "icon"){
                        $(event.target).find(".inputTe").css("color","black");
                    }else{
                        $(event.target).css("color","black");
                    }
                    self.allPage = true;
                    $(".skin-minimal input[name='order']").iCheck('check'); 
                    self.isAll = 1;
                }else if(self.allPage == true){
                    if($(event.target).attr('value') != "icon"){
                        $(event.target).find(".inputTe").css("color","white");
                    }else{
                        $(event.target).css("color","white");
                    }
                    self.allPage = false;
                    $(".skin-minimal input[name='order']").iCheck('uncheck');   
                    self.isAll = 0;
                }
            }
            
        },
        
        //保存快捷查询
        save_quick:function(){
            var self = this;
            layer.open({                                                                                                                                                                            
                type: 1,                                                                                                                                                                            
                title: '保存快捷查询',                                                                                                                                                                    
                skin: 'layui-layer-rim', //加上边框                                                                                                                                                 
                area: ['600px', '200px'], //宽高                                                                                                                                                  
                shade: 0.3,                                                                                                                                                                         
                content: $("#table-print"), 
                btn: ['确定', '取消']
                ,yes: function(index, layero){
                    //按钮【按钮一】的回调
                    var name = $("#quick_name").val();
                    if(name == ""){
                        layer.msg('请输入名称',{
                            icon: 0,
                            time: 2000
                        });
                        return  
                    }
                    
                    var dateBegin = $("#dateBegin").val();                                                                                                                                                          
                    var dateEnd = $("#dateEnd").val();  
                    /***********/
                    var orderSelect = $("#separator1").val();
                    var prd_no = $('.prd_no').val();
                    var sku_name = $(".sku_name").val();
                    var sku_prd_no = $('.sku_prd_no').val();
                    var num_iid = $('.num_iid').val();
                    /***********/
                    
                    self.banner = "";                                                                                                                                                                               
                    if(self.hui){                                                                                                                                                                                   
                        self.banner += (0 + ",");                                                                                                                                                                   
                    }                                                                                                                                                                                               
                                                                                                                                                                                                                    
                    if(self.red){                                                                                                                                                                                   
                        self.banner += (1 + ",");                                                                                                                                                                   
                    }                                                                                                                                                                                               
                                                                                                                                                                                                                    
                    if(self.yellow){                                                                                                                                                                                
                        self.banner += (2 + ",");                                                                                                                                                                   
                    }                                                                                                                                                                                               
                                                                                                                                                                                                                    
                    if(self.green){                                                                                                                                                                                 
                        self.banner += (3 + ",");                                                                                                                                                                   
                    }                                                                                                                                                                                               
                                                                                                                                                                                                                    
                    if(self.blue){                                                                                                                                                                                  
                        self.banner += (4 + ",");                                                                                                                                                                   
                    }                                                                                                                                                                                               
                                                                                                                                                                                                                    
                    if(self.pink){                                                                                                                                                                                  
                        self.banner += (5 + ",");                                                                                                                                                                   
                    }                                                                                                                                                                                               
                                                                                                                                                                                                                    
                    if(self.banner != ""){                                                                                                                                                                          
                        self.banner = self.banner.substring(0,self.banner.length-1);                                                                                                                                
                    }                           
                        
                    var data = {
                        "print":self.print,
                        "facePrint":self.facePrint,
                        "shopId":self.shopId,
                        "remark":self.remark,
                        "babyNum":self.babyNum,
                        "express":self.express,
                        "banner":self.banner,
                        "orderStatus":self.orderStatus,
                        "refundAgree":self.refundAgree,
                        "dateBegin":dateBegin,
                        "dateEnd":dateEnd,
                        "order":self.order,
                        "orderSelect": orderSelect,
                        "prd_no":prd_no,
                        "sku_prd_no":sku_prd_no,
                        "num_iid":num_iid,
                        "sku_name":sku_name
                    };
                    var a = 0;
                    var nameArr = $("#user").val();
                    if(localStorage.getItem(nameArr)){
                        var newArr = JSON.parse(localStorage.getItem(nameArr));
                        for(var i = 0; i < newArr.length; i++){
                            if(name == newArr[i]){
                                layer.msg("此名称已存在，请重新输入",{
                                    icon: 0,
                                    time: 2000
                                });
                                a++;
                            }
                        }
                        if(a > 0){
                            return false;
                        }else{
                            newArr.push(name);
                            localStorage.setItem(nameArr, JSON.stringify(newArr));
                        }
                    }else{
                        var newArr = [];
                        newArr.push(name);
                        localStorage.setItem(nameArr, JSON.stringify(newArr));
                    }
                    
                    localStorage.setItem(name, JSON.stringify(data));
                    
                    self.quickArr.push(name);
                    
                    layer.close(index);
                }
                ,btn2: function(index, layero){
                    //按钮【按钮二】的回调
                    
                    
                    //return false 开启该代码可禁止点击该按钮关闭
                },
                cancel: function (index, layero) {                                                                                                                                                  
                                                                                                                                                                                                    
                },
                success:function(){
                    $("#quick_name").val("");
                    $("#quick_name").focus();
                }
            }); 
            //var str = JSON.stringify(obj);
            //localStorage.setItem(Key, value);
            //localStorage.getItem(Key);
            
        },
        
        //快捷查询按钮点击事件
        quick_search:function(value){
            var self = this;
            var toggle = event.currentTarget;
            
            $(".babyGroup div").each(function(){                                                                                                                                                
                $(".babyGroup .ic").remove();                                                                                                                                                   
                $(this).css("borderColor","#c2c2c2");                                                                                                                                           
            });
            
            $(".labelGroup div").each(function(){                                                                                                                                               
                $(".labelGroup .ic").remove();                                                                                                                                                  
                $(this).css("borderColor","#c2c2c2");                                                                                                                                           
            });
            
            $(".faceGroup div").each(function(){                                                                                                                                                
                $(".faceGroup .ic").remove();                                                                                                                                                   
                $(this).css("borderColor","#c2c2c2");                                                                                                                                           
            }); 
            
            $(".conditionGroup div").each(function(){                                                                                                                                           
                $(".conditionGroup .ic").remove();                                                                                                                                              
                $(this).css("borderColor","#c2c2c2");                                                                                                                                           
            }); 
            
            $(".refundGroup div").each(function(){                                                                                                                                          
                $(".refundGroup .ic").remove();                                                                                                                                             
                $(this).css("borderColor","#c2c2c2");                                                                                                                                           
            }); 
            
            $(".bannerArr div").each(function(){                                                                                                                                            
                $(".bannerArr .ic").remove();                                                                                                                                               
                $(this).css("borderColor","#c2c2c2");                                                                                                                                       
            });
            
            $("#searchArr .ban span").remove();

            $(".quick_1 button").each(function(){
                $(".quick_1 .ic").remove();             
                $(this).css("borderColor","#c2c2c2");                                                                                                                                       
            });

            $(toggle).append("<i class='ic'><i class='ri'></i></i>");                                                                                                                           
            $(toggle).css("borderColor","#1e9fff"); 
            
            self.hui = false;                                                                                                                                                               
            self.red = false;                                                                                                                                                               
            self.green = false;                                                                                                                                                             
            self.yellow = false;                                                                                                                                                            
            self.blue = false;                                                                                                                                                              
            self.pink = false;
            
            var searchArr = JSON.parse(localStorage.getItem(value));
            
            if(searchArr.babyNum == 1){          
                self.babyNum = 1;   
                $(".Single").append("<i class='ic'><i class='ri'></i></i>");    
                $(".Single").css("borderColor","#1e9fff");  
                $("#searchArr .sin").remove();                                                                                                                                              
                $("#searchArr").append("<span class='add sin rem'>单款单件<i class='dele' id='babyGroup' onclick='closeNow(\"babyGroup\")'></i></span>");
            }else if(searchArr.babyNum == 2){        
                self.babyNum = 2;   
                $(".multiple").append("<i class='ic'><i class='ri'></i></i>");  
                $(".multiple").css("borderColor","#1e9fff");
                $("#searchArr .sin").remove();                                                                                                                                              
                $("#searchArr").append("<span class='add sin rem'>单款多件<i class='dele' id='babyGroup' onclick='closeNow(\"babyGroup\")'></i></span>");
            }
            
            if(searchArr.print == "0"){
                $(".all_print").append("<i class='ic'><i class='ri'></i></i>");                                                                                                                         
                $(".all_print").css("borderColor","#1e9fff");
                self.print = "0";
                $("#searchArr .lab").remove();
            }else if(searchArr.print == "1"){
                self.print = "1";
                $("#searchArr .lab").remove();                                                                                                                                                  
                $("#searchArr").append("<span class='add lab rem'>标签未打印<i class='dele' id='labelGroup' onclick='closeNow(\"labelGroup\")'></i></span>");
                $(".no_print").append("<i class='ic'><i class='ri'></i></i>");                                                                                                                          
                $(".no_print").css("borderColor","#1e9fff");
            }else if(searchArr.print == "2"){
                self.print = "2";
                $("#searchArr .lab").remove();                                                                                                                                                  
                $("#searchArr").append("<span class='add lab rem'>标签已打印<i class='dele' id='labelGroup' onclick='closeNow(\"labelGroup\")'></i></span>");
                $(".already_print").append("<i class='ic'><i class='ri'></i></i>");                                                                                                                         
                $(".already_print").css("borderColor","#1e9fff");
            }
            
            if(searchArr.facePrint == "0"){
                self.facePrint = "0";                                                                                                                                                           
                $("#searchArr .face").remove();
                $(".all_faceGroup").append("<i class='ic'><i class='ri'></i></i>");                                                                                                                         
                $(".all_faceGroup").css("borderColor","#1e9fff");   
            }else if(searchArr.facePrint == "1"){
                self.facePrint = "1";                                                                                                                                                           
                $("#searchArr .face").remove();                                                                                                                                                 
                $("#searchArr").append("<span class='add face rem'>面单未打印<i class='dele' id='faceGroup' onclick='closeNow(\"faceGroup\")'></i></span>");
                $(".no_faceGroup").append("<i class='ic'><i class='ri'></i></i>");                                                                                                                          
                $(".no_faceGroup").css("borderColor","#1e9fff");
            }else if(searchArr.facePrint == "2"){
                self.facePrint = "2";                                                                                                                                                           
                $("#searchArr .face").remove();                                                                                                                                                 
                $("#searchArr").append("<span class='add face rem'>面单已打印<i class='dele' id='faceGroup' onclick='closeNow(\"faceGroup\")'></i></span>");
                $(".already_faceGroup").append("<i class='ic'><i class='ri'></i></i>");                                                                                                                         
                $(".already_faceGroup").css("borderColor","#1e9fff");
            }
            
            if(searchArr.remark == "1"){
                self.remark = "1";
                $(".have_re").append("<i class='ic'><i class='ri'></i></i>");                                                                                                                           
                $(".have_re").css("borderColor","#1e9fff"); 
                $("#searchArr .remar").remove();                                                                                                                                            
                $("#searchArr").append("<span class='add remar rem'>有留言或备注<i class='dele' id='conditionGroup' onclick='closeNow(\"conditionGroup\")'></i></span>");
                self.haveRemark = true;                                                                                                                                                     
                self.noRemark = false;
            }else if(searchArr.remark == "2"){
                self.remark = "2";
                $(".no_re").append("<i class='ic'><i class='ri'></i></i>");                                                                                                                         
                $(".no_re").css("borderColor","#1e9fff");   
                $("#searchArr .remar").remove();                                                                                                                                            
                $("#searchArr").append("<span class='add remar rem'>无留言且无备注<i class='dele' id='conditionGroup' onclick='closeNow(\"conditionGroup\")'></i></span>");    
                self.noRemark = true;                                                                                                                                                       
                self.haveRemark = false;
            }else if(searchArr.remark == ""){
                self.remark = "";
                self.haveRemark = false;
                self.noRemark = false;
                $("#searchArr .remar").remove();
                $(".conditionGroup div").each(function(){                                                                                                                                           
                    $(".conditionGroup .ic").remove();                                                                                                                                              
                    $(this).css("borderColor","#c2c2c2");                                                                                                                                           
                });
            }
            
            if(searchArr.refundAgree == "1"){
                self.refundAgree = "1";
                $(".have_reagree").append("<i class='ic'><i class='ri'></i></i>");                                                                                                                          
                $(".have_reagree").css("borderColor","#1e9fff");
                $("#searchArr .reagree").remove();
                $("#searchArr").append("<span class='add reagree'>包含退款申请<i class='dele' id='refundGroup' onclick='closeNow(\"refundGroup\")'></i></span>");
            }else if(searchArr.refundAgree == ""){
                self.refundAgree = "";
                $("#searchArr .reagree").remove();
                $(".refundGroup div").each(function(){                                                                                                                                          
                    $(".refundGroup .ic").remove();                                                                                                                                             
                    $(this).css("borderColor","#c2c2c2");                                                                                                                                           
                });
            }
            
            if(searchArr.banner != ""){
                var bannerArr = searchArr.banner.split(",");
                for(var j = 0; j < bannerArr.length; j++){
                    if(bannerArr[j] == 0){
                        self.hui = true;
                        $("#searchArr .ban").append("<span class='bannerA hui rem' style='background-image:url(\"images/hui.png\");background-size:100% 100%;'></span>");
                        $(".banner_1").append("<i class='ic'><i class='ri'></i></i>");                                                                                                                          
                        $(".banner_1").css("borderColor","#1e9fff");                    
                    }else if(bannerArr[j] == 1){
                        $("#searchArr .ban").append("<span class='bannerA red rem' style='background-image:url(\"images/red.png\");background-size:100% 100%;'></span>");                           
                        self.red = true;
                        $(".banner_2").append("<i class='ic'><i class='ri'></i></i>");                                                                                                                          
                        $(".banner_2").css("borderColor","#1e9fff");
                    }else if(bannerArr[j] == 2){
                        $("#searchArr .ban").append("<span class='bannerA yellow rem' style='background-image:url(\"images/yellow.png\");background-size:100% 100%;'></span>");                     
                        self.yellow = true; 
                        $(".banner_3").append("<i class='ic'><i class='ri'></i></i>");                                                                                                                          
                        $(".banner_3").css("borderColor","#1e9fff");
                    }else if(bannerArr[j] == 3){
                        $("#searchArr .ban").append("<span class='bannerA green rem' style='background-image:url(\"images/green.png\");background-size:100% 100%;'></span>");                       
                        self.green = true;
                        $(".banner_4").append("<i class='ic'><i class='ri'></i></i>");                                                                                                                          
                        $(".banner_4").css("borderColor","#1e9fff");
                    }else if(bannerArr[j] == 4){
                        $("#searchArr .ban").append("<span class='bannerA blue rem' style='background-image:url(\"images/blue.png\");background-size:100% 100%;'></span>");                         
                        self.blue = true;
                        $(".banner_5").append("<i class='ic'><i class='ri'></i></i>");                                                                                                                          
                        $(".banner_5").css("borderColor","#1e9fff");
                    }else if(bannerArr[j] == 5){
                        $("#searchArr .ban").append("<span class='bannerA pink rem' style='background-image:url(\"images/fen.png\");background-size:100% 100%;'></span>");                          
                        self.pink = true;
                        $(".banner_6").append("<i class='ic'><i class='ri'></i></i>");                                                                                                                          
                        $(".banner_6").css("borderColor","#1e9fff");
                    }
                }
            }else if(searchArr.banner == ""){
                self.hui = false;                                                                                                                                                               
                self.red = false;                                                                                                                                                               
                self.green = false;                                                                                                                                                             
                self.yellow = false;                                                                                                                                                            
                self.blue = false;                                                                                                                                                              
                self.pink = false;
                
                $("#searchArr .ban span").remove();                                                                                                                                             
                                                                                                                                                                                                    
                $(".bannerArr div").each(function(){                                                                                                                                            
                    $(".bannerArr .ic").remove();                                                                                                                                               
                    $(this).css("borderColor","#c2c2c2");                                                                                                                                       
                });
                
                $(".banner_all").append("<i class='ic'><i class='ri'></i></i>");                                                                                                                            
                $(".banner_all").css("borderColor","#1e9fff");
            }
            
            $("#express").val(searchArr.express);
            self.express = searchArr.express;
            if(searchArr.express != ""){
                $("#searchArr .express").remove();                                                                                                                                                          
                $("#searchArr").append("<span class='add express rem'>" + $("#express option[value="+searchArr.express+"]").text() + "<i class='dele' id='specialGroup' onclick='closeNow(\"express\")'></i></span>");  
            }
            
            $("#orderStatus").val(searchArr.orderStatus);
            self.orderStatus = searchArr.orderStatus;
            if(searchArr.orderStatus != ""){
                $("#searchArr .orderStatus").remove();                                                                                                                                                      
                $("#searchArr").append("<span class='add orderStatus rem'>" + $("#orderStatus option[value="+searchArr.orderStatus+"]").text() + "<i class='dele' id='specialGroup' onclick='closeNow(\"orderStatus\")'></i></span>");  
            }
            
            $("#dateBegin").val(searchArr.dateBegin);
            $("#dateEnd").val(searchArr.dateEnd);
            
            $("#shop").val(searchArr.shopId);
            self.shopId = searchArr.shopId;
            if(searchArr.shopId != ""){
                $("#searchArr .shop").remove();
                $("#searchArr").append("<span class='add shop rem'>" + $("#shop option[value="+searchArr.shopId+"]").text() + "<i class='dele' id='specialGroup' onclick='closeNow(\"shop\")'></i></span>");
            }
            
            $("#separator1").val(searchArr.orderSelect);
            if(searchArr.orderSelect == "prd_no"){
                if(searchArr.prd_no == undefined){
                    searchArr.prd_no = "";
                }
                $(".changeDiv").html("<input class='prd_no inp'  placeholder='商品编号' onkeydown='keyDownSearch()' name='reset' value="+searchArr.prd_no+">");
            }else if(searchArr.orderSelect == "sku_name"){
                if(searchArr.sku_name == undefined){
                    searchArr.sku_name = "";
                }
                $(".changeDiv").html("<input class='sku_name inp'  placeholder='线上主商品编号' onkeydown='keyDownSearch()' name='reset' value="+searchArr.sku_name+">");
            }else if(searchArr.orderSelect == "sku_prd_no"){
                if(searchArr.sku_prd_no == undefined){
                    searchArr.sku_prd_no = "";
                }
                $(".changeDiv").html("<input class='sku_prd_no inp'  placeholder='线上sku编码' onkeydown='keyDownSearch()' name='reset' value="+searchArr.sku_prd_no+">");
            }else if(searchArr.orderSelect == "num_iid"){
                if(searchArr.num_iid == undefined){
                    searchArr.num_iid = "";
                }
                $(".changeDiv").html("<input class='num_iid inp'  placeholder='网店商品ID' onkeydown='keyDownSearch()' name='reset' value="+searchArr.num_iid+">");
            }
            
            searchALLNow(self,'F');
            
        },
        
        //=============================================分页开始============================//
        page: function(pager){
            var self = this;            
            if(pager == "first"){
                self.pageNo = 1;
            }else if(pager == "prev"){
                if(self.pageNo == 1){
                    return false;
                }
                self.pageNo = self.pageNo - 1;
            }else if(pager == "next"){
                if(self.pageNo == self.pageCount){
                    return false;
                }
                self.pageNo = self.pageNo + 1;
            }else if(pager == "last"){
                self.pageNo = self.pageCount;
            }
            
            searchALLNow(self,'page');
            
            $("input[name='order']").iCheck('uncheck');
            $(".inputTe").css("color","white");
            self.isAll = 0;
            self.nowPage = false;
            self.allPage = false;
        },
        
        //=============================================分页结束============================//
        
        //获取数量
        getTotal:function(){
            var self = this;
            $.ajax({                                                                                                                                                                                        
                url: "/index.php?m=system&c=quickStrike&a=getTotal",                                                                                                                                        
                type: 'post',                                                                                                                                                                               
                data: {babyNum:self.babyNum},                                                                                                                                                                                   
                dataType: 'json',                                                                                                                                                                           
                success: function (data) {
                    self.total = data;
                }                                                                                                                                                                                           
            });         
        },
        
        // //刷新统计
        // refreshTotal:function(){
        //     var self = this;
        //     self.getTotal();
        // },
        
        //打标签
        label_print:function(prd_no,type,sku_name,express_type){
        
            var self = this;
            if(type != "no"){
                if($("input[name='order']").filter(':checked').length == 0){                                                                                                                            
                    layer.msg('请选择至少一条数据',{
                        icon: 0,
                        time: 2000
                    });                                                                                                                                                                             
                    return false;                                                                                                                                                                       
                }
                var data = "";
                var sku_name = "";
                // var num ="";
                var num =0;
                $("input[name='order']:checkbox").each(function(){                                                                                                      
                    if(true == $(this).is(':checked')){                                                                                                                                             
                        data += ($(this).val()+",");    
                        sku_name += ($(this).attr("sku_name")+",");
                        num++;
                        // num += ($(this).attr("num")+",");
                    }                                                                                                                                                           
                });
                data = data.substring(0,data.length-1);
                sku_name = sku_name.substring(0,sku_name.length-1);
                // num = num.substring(0,num.length-1);
                prd_no = data;
            }else{
                if(prd_no != "a"){
                    var num = $("."+md5(prd_no+sku_name+express_type)).val();
                }
            }
            doGetPrinters(function(data){
                self.layprint =  data;                                                                                                                                                              
            });                                                                                                                                                                                     
                                                                                                                                                                                                
            $("#layprint").val("");                                         //-----初始化选择框                                                                                                       
            $("#layprintTplBq").val("");                                        //-----初始化选择框                                                                                                       
            
            
            self.layprintTplBq = printTplBq;
            // else{
            //     var num = "";
            // }
            if(num == "" || num == 0){
                layer.msg("数量为0",{
                    icon: 2,
                    time: 2000
                });
                return false;
            }
            layer.open({                                                                                                                                                                            
                type: 1,                                                                                                                                                                            
                title: '打印标签',                                                                                                                                                                  
                skin: 'layui-layer-rim', //加上边框                                                                                                                                                 
                area: ['700px', '400px'], //宽高                                                                                                                                                  
                shade: 0.3,                                                                                                                                                                         
                content: $("#print"),       
                btn: ['确定打印']
                ,yes: function(index, layero){
                    //按钮【按钮一】的回调
                    
                    self.print_now(prd_no,type,num,sku_name,express_type);
                    
                    layer.close(index);
                },
                cancel: function (index, layero) {                                                                                                                                                  
                                                                                                                                                                                                
                },
                success:function(){
                    $.ajax({                                                                                                                                                                                        
                        url: "/index.php?m=system&c=quickStrike&a=getPrinter",                                                                                                                                      
                        type: 'post',                                                                                                                                                                               
                        data: {},                                                                                                                                                                                   
                        dataType: 'json',                                                                                                                                                                           
                        success: function (data) {
                            if(data['result'].printer != "" && data['bq'].id != ""){
                                $("#layprint").val(data['result'].printer);
                                $("#layprintTplBq").val(data['bq'].id);
                            }else if(data['result'].printer != "" && data['bq'].id == ""){
                                $("#layprint").val(data['result'].printer);
                                $("#layprintTplBq").val("");
                                printerPrompt("未设置默认打印模板","标签设计","index.php?m=print&c=bqDesign&a=index");
                            }else if(data['result'].printer == "" && data['bq'].id != ""){
                                $("#layprint").val("");
                                printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
                                $("#layprintTplBq").val(data['bq'].id);
                            }else{
                                $("#layprint").val("");
                                $("#layprintTplBq").val("");
                                printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
                            }
                        }                                                                                                                                                                                           
                    });
                }
            });             
        },
        //打质检标签
        label_printCQ:function(prd_no,type,sku_name,express_type){
            var self = this;
            
            if(type != "no"){
                if($("input[name='order']").filter(':checked').length == 0){                                                                                                                            
                    layer.msg('请选择至少一条数据',{
                        icon: 0,
                        time: 2000
                    });                                                                                                                                                                             
                    return false;                                                                                                                                                                       
                }
                // if($(obj.target).parent().parent().children(":first").children(":first").attr('class')=='icheckbox_minimal'){
                //     layer.msg('请至少勾选当前这一条',{
                //         icon: 0,
                //         time: 2000
                //     });                                                                                                                                                                             
                //     return false;  
                // }
                var data = "";
                var sku_name = "";
                $("input[name='order']:checkbox").each(function(){                                                                                                      
                    if(true == $(this).is(':checked')){                                                                                                                                             
                        data += ($(this).val()+",");    
                        sku_name += ($(this).attr("sku_name")+",");
                    }                                                                                                                                                           
                });                                                                                                                                                                 
                data = data.substring(0,data.length-1);
                sku_name = sku_name.substring(0,sku_name.length-1);
                prd_no = data;
            }
                                                                                                                                        
            doGetPrinters(function(data){
                self.layprint =  data;                                                                                                                                                              
            });                                                                                                                                                                                     
                                                                                                                                                                                                
            $("#layprint").val("");                                         //-----初始化选择框                                                                                                       
            $("#layprintTplCq").val("");                                        //-----初始化选择框                                                                                                       
            
            
            self.layprintTplCq = printTplPrdtZJ;
                
            if(prd_no != "a"){
                var num = $("."+md5(prd_no+sku_name+express_type)).val();
            }else{
                var num = "";
            }
            
            if(num == "" || num == 0){
                layer.msg("数量为0",{
                    icon: 2,
                    time: 2000
                });
                return false;
            }
            layer.open({                                                                                                                                                                            
                type: 1,                                                                                                                                                                            
                title: '打印质检标签',                                                                                                                                                                    
                skin: 'layui-layer-rim', //加上边框                                                                                                                                                 
                area: ['700px', '400px'], //宽高                                                                                                                                                  
                shade: 0.3,                                                                                                                                                                         
                content: $("#printCQ"),     
                btn: ['确定打印']
                ,yes: function(index, layero){
                    //按钮【按钮一】的回调
                    //  $.ajax({                                                                                                                                                                                        
                    //     url: "/index.php?m=system&c=quickStrike&a=getPrinterCQ",                                                                                                                                        
                    //     type: 'post',                                                                                                                                                                               
                    //     data: {},                                                                                                                                                                                   
                    //     dataType: 'json',                                                                                                                                                                           
                    //     success: function (data) {
                    //         if(data['result'].printer != "" && data['cq'].id != ""){
                    //             $("#layprintCq").val(data['result'].printer);
                    //             $("#layprintTplCq").val(data['cq'].id);
                    //         }else{
                    //             layer.msg("请先配置打印机或设置打印模板",{
                    //                 icon: 2,
                    //                 time: 2000
                    //             });
                    //         }s
                    //     }                                                                                                                                                                                           
                    // });
                    self.print_nowCQ(prd_no,type,num,sku_name,express_type);
                    
                    layer.close(index);
                },
                cancel: function (index, layero) {                                                                                                                                                  
                                                                                                                                                                                                
                }
                ,
                success:function(){
                    $.ajax({                                                                                                                                                                                        
                        url: "/index.php?m=system&c=quickStrike&a=getPrinterCQ",                                                                                                                                        
                        type: 'post',                                                                                                                                                                               
                        data: {},                                                                                                                                                                                   
                        dataType: 'json',                                                                                                                                                                           
                        success: function (data) {
                            if(data['result'].printer != "" && data['cq'].id != ""){
                                $("#layprintCq").val(data['result'].printer);
                                $("#layprintTplCq").val(data['cq'].id);
                            }else{
                                layer.msg("请先配置打印机或设置打印模板",{
                                    icon: 2,
                                    time: 2000
                                });
                            }
                        }                                                                                                                                                                                           
                    });
                }
            });
        },
        label_closed:function(prd_no,sku_name,express_type,num,type=''){
            var self = this;
            if(type != "no"){
                if($("input[name='order']").filter(':checked').length == 0){                                                                                                                            
                    layer.msg('请选择至少一条数据',{
                        icon: 0,
                        time: 2000
                    });                                                                                                                                                                             
                    return false;                                                                                                                                                                       
                }
                // if($(obj.target).parent().parent().children(":first").children(":first").attr('class')=='icheckbox_minimal'){                                                                                                                            
                //     layer.msg('请至少勾选当前这一条数据',{
                //         icon: 0,
                //         time: 2000
                //     });                                                                                                                                                                             
                //     return false;                                                                                                                                                                       
                // }
                var data = "";
                var sku_name = "";
                var num =0;
                $("input[name='order']:checkbox").each(function(){                                                                                                      
                    if(true == $(this).is(':checked')){                                                                                                                                             
                        data += ($(this).val()+",");    
                        sku_name += ($(this).attr("sku_name")+",");
                        num++;
                    }                                                                                                                                                           
                });                                                                                                                                                                 
                data = data.substring(0,data.length-1);
                sku_name = sku_name.substring(0,sku_name.length-1);
                prd_no = data;
            }
            if(num == "" || num == 0){
                layer.msg("数量为0",{
                    icon: 2,
                    time: 2000
                });
                return false;
            }
                
            layer.confirm('确认关闭此爆款全部标签？', function(index){
                layer.close(index);
                $.ajax({                                                                                                                                                                    
                    url: "/index.php?m=system&c=quickStrike&a=close_label",                                                                                                                         
                    type: 'post',                                                                                                                                                                       
                    data: {prd_no:prd_no,type:type,isAll:'0',num:num,data:self.searchData,sku_name:sku_name,express:express_type},
                    dataType: 'json',                                                                                                                                                       
                    success: function (data) {                                                                                                                                                      
                        layer.msg('关闭完成',{
                            icon: 1,
                            time: 2000
                        });     
                        
                    }                                                                                                                                                                   
                });
            });
        },
        
        key_up:function(tid_num,storage_num,index){
            var self = this;
            var a = $(event.target);
            var e = event || window.event;
            var av = a.val();
            if(WMS_STOCK_BAOKUAN=='T'){
                // if((av * 1) > (tid_num * 1)){
                //     layer.msg('输入数量不能大于订单数量',{
                //         icon: 0,
                //         time: 2000
                //     });
                    
                //     if((WMS_MODEL == "T" || WMS_MODEL == "PT") && ((tid_num * 1) > (storage_num * 1))){
                //         a.val(storage_num);
                //         self.data[index].print_num = storage_num;
                //     }else{
                //         a.val(tid_num);
                //         self.data[index].print_num = tid_num;
                //     }
                //     return false;
                // }
                
                if((WMS_MODEL == "T" || WMS_MODEL == "PT") && ((av * 1) > (storage_num * 1))){
                    layer.msg('输入数量不能大于应发商品数量',{
                        icon: 0,
                        time: 2000
                    });
                    if((tid_num * 1) > (storage_num * 1)){
                        a.val(storage_num);
                        self.data[index].print_num = storage_num;
                    }else{
                        a.val(tid_num);
                        self.data[index].print_num = tid_num;
                    }
                    return false;
                }
                
                if(a.val() == "0"){
                    layer.msg('请输入正确的订单数量',{
                        icon: 0,
                        time: 2000
                    });
                    if((WMS_MODEL == "T" || WMS_MODEL == "PT") && ((tid_num * 1) > (storage_num * 1))){
                        a.val(storage_num);
                        self.data[index].print_num = storage_num;
                    }else{
                        a.val(tid_num);
                        self.data[index].print_num = tid_num;
                    }
                    return false;
                }
                self.data[index].print_num = av;
            }else{
                if((av * 1) > (tid_num * 1)){
                    layer.msg('输入数量不能大于订单数量',{
                        icon: 0,
                        time: 2000
                    });
                    
                    if((WMS_MODEL == "T" || WMS_MODEL == "PT") && ((tid_num * 1) > (storage_num * 1))){
                        a.val(storage_num);
                        self.data[index].print_num = storage_num;
                    }else{
                        a.val(tid_num);
                        self.data[index].print_num = tid_num;
                    }
                    return false;
                }
                
                if((WMS_MODEL == "T" || WMS_MODEL == "PT") && ((av * 1) > (storage_num * 1))){
                    layer.msg('输入数量不能大于库存数量',{
                        icon: 0,
                        time: 2000
                    });
                    if((tid_num * 1) > (storage_num * 1)){
                        a.val(storage_num);
                        self.data[index].print_num = storage_num;
                    }else{
                        a.val(tid_num);
                        self.data[index].print_num = tid_num;
                    }
                    return false;
                }
                
                if(a.val() == "0"){
                    layer.msg('请输入正确的订单数量',{
                        icon: 0,
                        time: 2000
                    });
                    if((WMS_MODEL == "T" || WMS_MODEL == "PT") && ((tid_num * 1) > (storage_num * 1))){
                        a.val(storage_num);
                        self.data[index].print_num = storage_num;
                    }else{
                        a.val(tid_num);
                        self.data[index].print_num = tid_num;
                    }
                    return false;
                }
                self.data[index].print_num = av;
            }
            
            
        },
        
        key_upMake:function(value,index){
            var self = this;
            var a = $(event.target);
            var e = event || window.event;
            var av = a.val();
            if((av * 1) > (value * 1)){
                layer.msg('输入数量不能大于订单数量',{
                    icon: 0,
                    time: 2000
                });
                a.val(value);
            }else if(a.val() == "0"){
                layer.msg('请输入正确的订单数量',{
                    icon: 0,
                    time: 2000
                });
                a.val(value);
            }else{
                self.faceMakeMsg[index].print_num_end = a.val();
            }
            
        },
        
        print_now:function(prd_no,type,number,sku_name,express_type){
            var self = this;
            var num = number;
            
            if($("#layprintTplBq").val() != 0){                                                                                                                                                     
                var unprintTplBq = $("#layprintTplBq").val();                                                                                                                                       
            }else{
                layer.msg('请选择打印模板！',{
                    icon: 2,
                    time: 2000
                });
                return                                                                                                                                                                              
            }
            
            if($("#layprint").val() != 0){                                                                                                                                                          
                var unprintname = $("#layprint").val();                                                                                                                                             
            }else{
                layer.msg('请选择打印机！',{
                    icon: 2,
                    time: 2000
                });
                return                                                                                                                                                                              
            }                                                                                                                                                                                       
            
            $.ajax({                                                                                                                                                                    
                url: "/index.php?m=system&c=quickStrike&a=printData",                                                                                                                           
                type: 'post',                                                                                                                                                                       
                data: {prd_no:prd_no,type:type,isAll:self.isAll,num:num,data:self.searchData,sku_name:sku_name,express:express_type},
                dataType: 'json',                                                                                                                                                       
                success: function (data) {                                                                                                                                                      
                    if(data[0] != ""){                                                                                                                                                  
                        var percent = 0;                                            //-----进度条初始化                                                                                   
                        layer.closeAll();                                                                                                                                               
                        $(".sche").css("display","block");                          //-----进度条窗口显示                                                                              
                                                                                                                                                                                                
                        var i = 0;                                                                                                                                                      
                        countSecond(i,data);                                                                                                                                                            
                        function countSecond(i,data)                                                                                                                                    
                        {                                                                                                                                                       
                                                                                                                                                                            
                            if(i<data.length){                                                                                                                                          
                                layui.use('element', function(){                    //----------                                                                                    
                                    var element = layui.element();                  //                                                                                          
                                    element.init();                                 //  进度条                                                                                 
                                    percent += Math.ceil(100 / data.length);        //                                                                                                  
                                    element.progress('demo', percent + '%');        //                                                                                              
                                });                                                 //----------                                                                                
                                                                                                                                                                                        
                                printTpl[unprintTplBq](unprintname,data[i]);                                                                                                            
                                i = i+1;                                                                                                                                        
                                setTimeout(function(){                                                                                                                                  
                                    countSecond(i,data);                                                                                                                                
                                }, 1000)                                                                                                                                        
                            }else{                                                                                                                                              
                                $(".sche").css("display","none");                   //-----进度条窗口关闭                                                                              
                                searchALLNow(self,'F'); 
                                layer.msg('打印完成',{
                                    icon: 1,
                                    time: 2000
                                });                                                                                             
                                return                                                                                                                                                  
                            }                                                                                                                                                       
                                                                                                                                                                                        
                        }   
                        $("input[name='order']").iCheck('uncheck');
                        $(".inputTe").css("color","white");
                        self.isAll = 0;
                        self.nowPage = false;
                        self.allPage = false;
                    }else{
                        layer.msg("此货品已挂单或标签已关闭，请重新选择",{
                            icon: 2,
                            time: 2000
                        });
                    }                                                                                                                                                                   
                }                                                                                                                                                                   
            }); 
        },
        
        print_nowCQ:function(prd_no,type,number,sku_name,express_type){
            var self = this;
            var num = number;
            
            if($("#layprintTplCq").val() != 0){                                                                                                                                                     
                var unprintTplCq = $("#layprintTplCq").val();                                                                                                                                       
            }else{
                layer.msg('请选择打印模板！',{
                    icon: 2,
                    time: 2000
                });
                return                                                                                                                                                                              
            }
            
            if($("#layprintCq").val() != 0){                                                                                                                                                            
                var unprintname = $("#layprintCq").val();                                                                                                                                               
            }else{
                layer.msg('请选择打印机！',{
                    icon: 2,
                    time: 2000
                });
                return                                                                                                                                                                              
            }                                                                                                                                                                                       
            
            $.ajax({                                                                                                                                                                    
                url: "/index.php?m=system&c=quickStrike&a=printDataCQ",                                                                                                                         
                type: 'post',                                                                                                                                                                       
                data: {prd_no:prd_no,type:type,isAll:self.isAll,num:num,data:self.searchData,sku_name:sku_name,express:express_type},
                dataType: 'json',                                                                                                                                                       
                success: function (data) {                                                                                                                                                      
                    if(data.unique_code != ""){                                                                                                                                                 
                        printCQlabel(data.unique_code,unprintTplCq,unprintname);
                    }else{
                        layer.msg("数据异常",{
                            icon: 2,
                            time: 2000
                        });
                    }                                                                                                                                                               
                }                                                                                                                                                                   
            }); 
        },
        checkFunc:function(storage_num, obj_id){
            var arr = obj_id.split('-');
            $("."+arr[0]).each(function () {
                $(this).hide();
            })
            $('#'+obj_id).show();
        },
        singlePlaneBatch:function(){//批量爆款无标快打
            var self = this;
             

            if($("input[name='order']").filter(':checked').length == 0){                                                                                                                            
                layer.msg('请选择至少一条数据',{
                    icon: 0,
                    time: 2000
                });                                                                                                                                                                             
                return false;
            }
            
            var actionObj = [];
            $("input[name='order']:checkbox").each(function(){                                                                                                      
                if(true == $(this).is(':checked')){                                                                                                                                             
                    var prd_no = $(this).val();
                    var sku_name = $(this).attr("sku_name");
                    var express_type = $(this).attr("express_type");
                    var num = 0;
                    var prd_loc = '';
                    if($('input[name="'+md5(prd_no + sku_name + express_type)+'"]').val())
                    {
                        var radio = $('input[name="'+md5(prd_no + sku_name + express_type)+'"]:checked').val(); 
                        if(radio)
                        {
                            num = $("#"+radio).val();
                            var arr = radio.split('-');
                            prd_loc = arr[1];
                        }
                    }
                    else
                    {
                        num = $("."+md5(prd_no + sku_name + express_type)).val();   
                    }
                    
                    
                    if(num > 0){
                        actionObj.push({
                            prd_no: prd_no,
                            sku_name: sku_name,
                            express_type: express_type,
                            num: num,
                            prd_loc:prd_loc
                        }); 
                    }
                }
            });
            
            if(actionObj.length == 0){
                layer.msg('没有可以发货的订单',{
                    icon: 0,
                    time: 2000
                });                                                                                                                                                                             
                return false;
            }
            
            layer.open({                                                                                                                                                                            //===========
                type: 1,                                                                                                                                                                            //===========
                title: '预发货',                                                                                                                                                                   //===========
                skin: 'layui-layer-rim', //加上边框                                                                                                                                                 //===========
                area: ['700px', '500px'], //宽高                                                                                                                                                  //===========
                shade: 0.3,                                                                                                                                                                         //===========
                content: $("#edit-pages8"),                                                                                                                                                         //===========
                cancel: function (index, layero) {                                                                                                                                                  //===========
                                                                                                                                                                                                    //===========
                }                                                                                                                                                                                   //===========
            }); 
            
            $("#progress-delivery").css("display","block");
            var time = new Date().getTime();
            
            $.ajax({
                url: "/index.php?m=system&c=quickStrike&a=preDeliveryBatch",                                                                                                                                        
                type: 'post',                                                                                                                                                                               
                data: {data: self.searchData, actionObj: actionObj, time: time},
                dataType: 'json',                                                                                                                                                                           
                success: function (data) {
                    self.preDeliveryMsg = "";
                    if(data.code == "error"){
                        self.preDeliveryMsg = data.error_msg;
                        if(data.countSuccess > 0){
                            get_printBatch(self, actionObj);
                        }
                    }else if(data.code == "ok"){
                        layer.closeAll();
                        layer.msg('预发货成功',{
                            icon: 1,
                            time: 2000
                        });
                        
                        get_printBatch(self, actionObj);
                    }
                }
            })
            
            var Interval = setInterval(function(){
                $.ajax({                                                                                                                                                                                        
                    url: "/index.php?m=system&c=quickStrike&a=getDeliveryPer",                                                                                                                                      
                    type: 'post',                                                                                                                                                                               
                    data: {time: time},                                                                                                                                                                                 
                    dataType: 'json',                                                                                                                                                                           
                    success: function (data) {
                        if(data == null){
                            clearInterval(Interval);
                        }
                        layui.use('element', function(){                    //----------                                                                                    
                            var element = layui.element();                  //                                                                                          
                            element.init();                                 //  进度条                                                                                 
                            element.progress('delivery', data.per + '%');   //  
                            $("#pages8-title").html(data.msg);                  
                        });
                            
                        if(data.code == "end"){
                            clearInterval(Interval);
                            
                        }
                    },error: function(){
                        clearInterval(Interval);
                    }
                });
            },1000);
        },
        singlePlane:function(prd_no,type,sku_name,express_type,item_num,obj){
            var self = this;
            self.prd_no = prd_no;
            self.type = type;
            if(type != "no"){
                if($("input[name='order']").filter(':checked').length == 0){                                                                                                                            
                    layer.msg('请选择至少一条数据',{
                        icon: 0,
                        time: 2000
                    });                                                                                                                                                                             
                    return false;                                                                                                                                                                       
                }
                // if($(obj.target).parent().parent().children(":first").children(":first").attr('class')=='icheckbox_minimal'){                                                                                                                            
                //     layer.msg('请至少勾选当前这一条数据',{
                //         icon: 0,
                //         time: 2000
                //     });                                                                                                                                                                             
                //     return false;                                                                                                                                                                       
                // }
                var data = "";
                var sku_name = "";
                var express_type = "";
                $("input[name='order']:checkbox").each(function(){                                                                                                      
                    if(true == $(this).is(':checked')){                                                                                                                                             
                        data += ($(this).val()+",");
                        sku_name += ($(this).attr("sku_name")+",");
                        express_type += ($(this).attr("express_type")+",");
                    }                                                                                                                                                           
                });                                                                                                                                                                 
                data = data.substring(0,data.length-1);
                sku_name = sku_name.substring(0,sku_name.length-1);
                express_type = express_type.substring(0,express_type.length-1);
                prd_no = data;
                
            }
            self.sku_name = sku_name;
            self.express_type = express_type;
            
            var time = new Date().getTime();
            var prd_loc = '';
            if($('input[name="'+md5(prd_no + sku_name + express_type)+'"]').val())
            {
                var radio = $('input[name="'+md5(prd_no + sku_name + express_type)+'"]:checked').val(); 
                if(radio)
                {
                    num = $("#"+radio).val();
                    var arr = radio.split('-');
                    prd_loc = arr[1];
                }
            }
            else
            {
                var num = $("."+md5(prd_no+sku_name+express_type)).val();
            }
            
            if(num <= 0){
                layer.msg('请先录入打印订单数量',{
                    icon: 0,
                    time: 2000
                });
                
                return false;
            }
            
            // layer.open({                                                                                                                                                                            //===========
            //     type: 1,                                                                                                                                                                            //===========
            //     title: '预发货',                                                                                                                                                                   //===========
            //     skin: 'layui-layer-rim', //加上边框                                                                                                                                                 //===========
            //     area: ['700px', '500px'], //宽高                                                                                                                                                  //===========
            //     shade: 0.3,                                                                                                                                                                         //===========
            //     content: $("#edit-pages8"),                                                                                                                                                         //===========
            //     cancel: function (index, layero) {                                                                                                                                                  //===========
            //                                                                                                                                                                                         //===========
            //     }                                                                                                                                                                                   //===========
            // }); 
            layer.open({
                type: 1,
                title: '预发货',                                                                                                                                                                   //===========
                skin: 'layui-layer-rim', //加上边框                                                                                                                                                 //===========
                area: ['700px', '500px'], //宽高  
                content: $("#edit-pages8"),                                                                                                                                                  //===========
                shade: 0.3
              ,btn: ['确定打印', '取消']
              ,yes: function(index, layero){
                //按钮【按钮一】的回调
                    // $("#progress-delivery").css("display","block");
            
                    // $.ajax({                                                                                                                                                                                        
                    //     url: "/index.php?m=system&c=quickStrike&a=preDelivery",                                                                                                                                     
                    //     type: 'post',                                                                                                                                                                               
                    //     data: {data: self.searchData,prd_no: prd_no, isAll: self.isAll,time: time,sku_name:sku_name,num: num, express: express_type, prd_loc: prd_loc},                                                                                                                                                                                 
                    //     dataType: 'json',                                                                                                                                                                           
                    //     success: function (data) {
                    //             self.preDeliveryMsg = "";
                    //         if(data.code == "error"){
                    //             self.preDeliveryMsg = data.error_msg;
                    //             if(item_num != ''){
                    //                 if(data.error_msg.length == item_num){
                                        
                    //                 }else{
                    //                     get_print(self,prd_no,type,sku_name,express_type);
                    //                 }
                    //             }else{
                    //                 var print_num = 0;
                    //                 $("input[name='order']:checkbox").each(function(){                                                                                                      
                    //                     if(true == $(this).is(':checked')){     
                    //                         print_num += ($(this).attr("tid_num")*1);
                    //                     }                                                                                                                                                           
                    //                 }); 
                    //                 if(data.error_msg.length == print_num){
                                        
                    //                 }else{
                    //                     get_print(self,prd_no,type,sku_name,express_type);
                    //                 }
                                    
                    //             }
                                
                    //         }else if(data.code == "ok"){
                    //             layer.closeAll();
                    //             layer.msg('预发货成功',{
                    //                 icon: 1,
                    //                 time: 2000
                    //             });
                    //             get_print(self,prd_no,type,sku_name,express_type);
                                
                    //         }
                    //     }
                    // })
                    
                    // var Interval = setInterval(function(){
                    //     $.ajax({                                                                                                                                                                                        
                    //         url: "/index.php?m=system&c=quickStrike&a=getDeliveryPer",                                                                                                                                      
                    //         type: 'post',                                                                                                                                                                               
                    //         data: {time: time},                                                                                                                                                                                 
                    //         dataType: 'json',                                                                                                                                                                           
                    //         success: function (data) {
                    //             if(data == null){
                    //                 clearInterval(Interval);
                    //             }
                    //             layui.use('element', function(){                    //----------                                                                                    
                    //                 var element = layui.element();                  //                                                                                          
                    //                 element.init();                                 //  进度条                                                                                 
                    //                 element.progress('delivery', data.per + '%');   //  
                    //                 $("#pages8-title").html(data.msg);                  
                    //             });
                                    
                    //             if(data.code == "end"){
                    //                 clearInterval(Interval);
                                    
                    //             }
                    //         },error: function(){
                    //             clearInterval(Interval);
                    //         }
                    //     });
                    // },1000);
              }
              ,btn2: function(index, layero){
                //按钮【按钮二】的回调
                //return false 开启该代码可禁止点击该按钮关闭
              }
              ,cancel: function(){ 
                //右上角关闭回调
                
                //return false 开启该代码可禁止点击该按钮关闭
              }
            });
   
            
            //$("#progress-delivery").css("display","block");
            
            $.ajax({                                                                                                                                                                                        
                url: "/index.php?m=system&c=quickStrike&a=preDelivery",                                                                                                                                     
                type: 'post',                                                                                                                                                                               
                data: {data: self.searchData,prd_no: prd_no, isAll: self.isAll,time: time,sku_name:sku_name,num: num, express: express_type, prd_loc: prd_loc},                                                                                                                                                                                 
                dataType: 'json',                                                                                                                                                                           
                success: function (data) {
                    self.preDeliveryMsg = "";
                    if(data.code == "error"){
                        self.preDeliveryMsg = data.error_msg;
                        if(item_num != ''){
                            if(data.error_msg.length == item_num){
                                
                            }else{
                                get_print(self,prd_no,type,sku_name,express_type);
                            }
                        }else{
                            var print_num = 0;
                            $("input[name='order']:checkbox").each(function(){                                                                                                      
                                if(true == $(this).is(':checked')){     
                                    print_num += ($(this).attr("tid_num")*1);
                                }                                                                                                                                                           
                            }); 
                            if(data.error_msg.length == print_num){
                                
                            }else{
                                get_print(self,prd_no,type,sku_name,express_type);
                            }
                            
                        }
                        
                    }else if(data.code == "ok"){
                        layer.closeAll();
                        layer.msg('预发货成功',{
                            icon: 1,
                            time: 2000
                        });
                        get_print(self,prd_no,type,sku_name,express_type);
                        var Interval = setInterval(function(){
                            $.ajax({                                                                                                                                                                                        
                                url: "/index.php?m=system&c=quickStrike&a=getDeliveryPer",                                                                                                                                      
                                type: 'post',                                                                                                                                                                               
                                data: {time: time},                                                                                                                                                                                 
                                dataType: 'json',                                                                                                                                                                           
                                success: function (data) {
                                    if(data == null){
                                        clearInterval(Interval);
                                    }
                                    layui.use('element', function(){                    //----------                                                                                    
                                        var element = layui.element();                  //                                                                                          
                                        element.init();                                 //  进度条                                                                                 
                                        element.progress('delivery', data.per + '%');   //  
                                        $("#pages8-title").html(data.msg);                  
                                    });
                                        
                                    if(data.code == "end"){
                                        clearInterval(Interval);
                                        
                                    }
                                },error: function(){
                                    clearInterval(Interval);
                                }
                            });
                        },1000);
                        
                    }
                }
            });
            
            
        },
        faceMake:function(){
            var self = this;
            
             $("#printdateBegin").val(startPrintdateBegin);                                                                                                                                                         
            $("#printdateEnd").val(startPrintdateEnd);  
            
            $.ajax({                                                                                                                                                                    
                url: "/index.php?m=system&c=quickStrike&a=face_make",                                                                                                                           
                type: 'post',                                                                                                                                                               
                data: {printdateBegin: startPrintdateBegin, printdateEnd: startPrintdateEnd},
                dataType: 'json',                                                                                                                                                       
                success: function (data) {
                    if(data){
                        self.faceMakeMsg = data.data;
                    }
                    
                    layer.open({
                        type: 1,                                                                                                                                                                            
                        title: '面单补打',                                                                                                                                                              
                        skin: 'layui-layer-rim', //加上边框                                                                                                                                                 
                        area: ['800px', '600px'], //宽高                                                                                                                                                  
                        shade: 0.3,                                                                                                                                                                         
                        content: $("#faceMakeWindow")
                    });
                }
            })
        },
        printSearch:function(){
            var self = this;
            
            var printdateBegin = $("#printdateBegin").val();                                                                                                                                                            
            var printdateEnd = $("#printdateEnd").val();    
    
            $.ajax({                                                                                                                                                                    
                url: "/index.php?m=system&c=quickStrike&a=face_make",                                                                                                                           
                type: 'post',                                                                                                                                                               
                data: {printdateBegin: printdateBegin, printdateEnd: printdateEnd},
                dataType: 'json',                                                                                                                                                       
                success: function (data) {
                    if(data){
                        self.faceMakeMsg = data.data;
                    }
                }
            })
        },
        markface_pr:function(type,index,show,PRINT_BAT_NO,prd_no,sku_name){
            var self = this;
            self.disableNum = 1;
            console.log("markface_pr");
            console.log(self.disableNum);
            self.markface_now(type,index,show,PRINT_BAT_NO,prd_no,sku_name);
        },
        markface:function(PRINT_BAT_NO,prd_no,sku_name){
            var self = this;
            doMarkface(self,PRINT_BAT_NO,prd_no,sku_name);
        },
        markface_now:function(type,index,show,PRINT_BAT_NO,prd_no,sku_name){
            var self = this;    
            self.defaultMsg = [];
            var isrepeat = "";

            if($("#layprintTplBqMake" + index).val() != 0){                                                                                                                                                     
                var unprintTplBq = $("#layprintTplBqMake" + index).val();                                                                                                                                       
            }else{
                layer.msg('请选择打印模板！',{
                    icon: 2,
                    time: 2000
                });
                return false;
            }
            
            if($("#layprintMake" + index).val() != 0){                                                                                                                                                          
                var unprintname = $("#layprintMake" + index).val();                                                                                                                                             
            }else{
                layer.msg('请选择打印机！',{
                    icon: 2,
                    time: 2000
                });
                return                                                                                                                                                                              
            }       
            
            if(PRINT_BAT_NO == ""){
                layer.msg('请选择打印的订单！',{
                    icon: 2,
                    time: 2000
                });
                return false;
            }
            $(".searchBtn").prop("disabled",true);
            
            var print_index_start = $("." + md5(PRINT_BAT_NO + prd_no + sku_name + "_STAR")).val();
            var print_index_end = $("." + md5(PRINT_BAT_NO + prd_no + sku_name + "_END")).val();
            
            $.ajax({                                                                                                                                                                    
                url: "/index.php?m=system&c=quickStrike&a=face_nowMake",                                                                                                                            
                type: 'post',                                                                                                                                                               
                data: {type:type,show:show,PRINT_BAT_NO:PRINT_BAT_NO,prd_no: prd_no, sku_name: sku_name, print_index_start: print_index_start, print_index_end: print_index_end, printTpl: unprintTplBq},
                dataType: 'json',                                                                                                                                                       
                success: function (data) {
                    self.disableNum = self.disableNum - 1;
                    if(self.disableNum == 0){
                        setTimeout(function(){
                            $(".searchBtn").prop("disabled",false); 
                        },3000);
                    }
                    console.log("face_nowMake");
                    console.log(self.disableNum);
                    
                    if(data.dataCheck && data.numCheck > 0){
                        self.defaultMsg = data.dataCheck;
                        
                        layer.open({
                            type: 1,                                                                                                                                                                            
                            title: '打印详情',                                                                                                                                                              
                            skin: 'layui-layer-rim', //加上边框                                                                                                                                                 
                            area: ['800px', '400px'], //宽高                                                                                                                                                  
                            shade: 0.3,                                                                                                                                                                         
                            content: $("#default")                                                                                                                                                                                  
                        }); 
                    }
                    if(data.dates && data.dates.length > 0){
                        var newData = [];                       
                        var percent = 0;                                            
                        var num = 0;
                        if(show == "F"){
                            doGetPrinters(function(){
                                newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'F');//订单数据,商品数据，订单详情数据, 预览
                                
                                if(unprintname){
                                    printTpl[unprintTplBq](unprintname,newData);
                                }
                            });
                        }else if(show == "show"){
                            doGetPrinters(function(){
                                newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'T');//订单数据,商品数据，订单详情数据, 预览
                                
                                if(unprintname){
                                    printTpl[unprintTplBq](unprintname,newData,true);
                                }else{
                                    layer.msg('打印机不存在,无法预览', {time: 2000, icon:2});
                                }
                            });
                        }
                    }                                                                                                                                       
                },error: function (jqXHR, textStatus, errorThrown) {
                    self.disableNum = self.disableNum - 1;
                    if(self.disableNum == 0){
                        $(".searchBtn").prop("disabled",false); 
                    }
                    console.log("face_nowMake_error");
                    console.log(self.disableNum);
                }
            });
        },
        face_nowBatch:function(express,index,show,send,batch){
            var self = this;
            self.defaultMsg = [];
            var isrepeat = "";
            if($("#layprintTplBatchBq" + index).val() != 0){
                var unprintTplBq = $("#layprintTplBatchBq" + index).val();
            }else{
                layer.msg('请选择打印模板！',{
                    icon: 2,
                    time: 2000
                });
                return
            }
            
            if($("#layprintBatch" + index).val() != 0){                                                                                                                                                         
                var unprintname = $("#layprintBatch" + index).val();                                                                                                                                                
            }else{
                layer.msg('请选择打印机！',{
                    icon: 2,
                    time: 2000
                });
                return                                                                                                                                                                              
            }
            var actionObj = [];
            $("input[name='order']:checkbox").each(function(){   
                console.log($(this));                                                                                                   
                if(true == $(this).is(':checked')){                                                                                                                                             
                    var prd_no = $(this).val();
                    var sku_name = $(this).attr("sku_name");
                    var express_type = $(this).attr("express_type");
                    var num = $("."+md5(prd_no + sku_name + express_type)).val();
                    if(num > 0 && express_type == express){
                        actionObj.push({
                            prd_no: prd_no,
                            sku_name: sku_name,
                            express_type: express_type,
                            num: num
                        }); 
                    }
                }
            });
            if(actionObj.length == 0){
                layer.msg('请选择打印的订单！',{
                    icon: 2,
                    time: 2000
                });
                return;
            }
            
            if($("#printInputBatch" + index).is(':checked')){
                isrepeat = "no";
            }else{
                isrepeat = "yes";
            }
            
            var a = $(event.target);
            //a.prop("disabled",true);
            $(".searchBtn").prop("disabled",true);
            
            /*setTimeout(function(){
                a.prop("disabled",false);
            },1000);*/
            $.ajax({                                                                                                                                                                    
                url: "/index.php?m=system&c=quickStrike&a=face_nowBatch",                                                                                                                           
                type: 'post',                                                                                                                                                               
                data: {data:self.searchData, actionObj: actionObj, express_type: express, isrepeat: isrepeat, show: show, printTpl: unprintTplBq},
                dataType: 'json',           
                success: function (data) {
                    //a.prop("disabled",false);
                    self.disableNum = self.disableNum - 1;
                    if(self.disableNum == 0){
                        $(".searchBtn").prop("disabled",false); 
                    }
                    if(data.dataCheck && data.numCheck > 0){
                        self.defaultMsg = data.dataCheck;
                        layer.open({
                            type: 1,
                            title: '打印详情',
                            skin: 'layui-layer-rim', 
                            area: ['800px', '400px'], 
                            shade: 0.3,
                            content: $("#default"),
                            id: 'previewImage',
                            cancel: function(){ 
                                //searchALLNow(flow,'F');
                            }                                               
                        }); 
                    }
                    
                    if(data.dates && data.dates.length > 0){
                        var newData = [];                       
                        var percent = 0;                                            
                        var num = 0;
                        if(show == "F"){
                            doGetPrinters(function(){
                                newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'F');//订单数据,商品数据，订单详情数据, 预览
                                
                                if(unprintname){
                                    if(send == "T"){
                                        printTpl[unprintTplBq](unprintname,newData,false,true);//第四个参数暂时没有用
                                        //searchALLNow(flow,'F');
                                        
                                        //if(batch != 'batch'){
                                            //var expressSort = self.expressSort;
                                            //expressSort.splice(index,1);
                                            //self.expressSort = expressSort;
                                            self.expressSort[index]['print'] = 'F';
                                        //}
                                    }else{
                                        printTpl[unprintTplBq](unprintname,newData);
                                    }
                                }
                            });
                        }else if(show == "show"){
                            doGetPrinters(function(){
                                newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'T');//订单数据,商品数据，订单详情数据, 预览
                                
                                if(unprintname){
                                    printTpl[unprintTplBq](unprintname,newData,true);
                                }else{
                                    layer.msg('打印机不存在,无法预览', {time: 2000, icon:2});
                                }
                            });
                        }
                    }                                                                                                                                       
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    self.disableNum = self.disableNum - 1;
                    if(self.disableNum == 0){
                        $(".searchBtn").prop("disabled",false); 
                    }
                    console.log("face_nowBatch_error");
                    console.log(self.disableNum);
                }
            });
        },
        //==============================================================================面单打印 预览 按钮===============================================================================================
        face_now:function(type,index,show,send,sku_name,express_type){
            var self = this;
            self.defaultMsg = [];
            var prd_no = self.prd_no;
            var isrepeat = "";
                                                                                                                                                                                            
            if($("#layprintTplBq" + index).val() != 0){                                                                                                                                                     
                var unprintTplBq = $("#layprintTplBq" + index).val();                                                                                                                                       
            }else{
                layer.msg('请选择打印模板！',{
                    icon: 2,
                    time: 2000
                });
                return                                                                                                                                                                              
            }
            
            if($("#layprint" + index).val() != 0){                                                                                                                                                          
                var unprintname = $("#layprint" + index).val();                                                                                                                                             
            }else{
                layer.msg('请选择打印机！',{
                    icon: 2,
                    time: 2000
                });
                return                                                                                                                                                                              
            }       
            if(self.type != "no"){
                var data = "";
                $("input[name='order']:checkbox").each(function(){    
                    if(true == $(this).is(':checked')){                                                                                                                                             
                        data += ($(this).val()+",");
                    
                    }                                                                                                                                                           
                });                                                                                                                                                                 
                data = data.substring(0,data.length-1);
                if(data == ''){
                    layer.msg('请选择打印的订单！',{
                        icon: 2,
                        time: 2000
                    });
                    return  
                }else{
                    prd_no = data;
                }
            }
            if($("#printInput" + index).is(':checked')){
                isrepeat = "no";
            }else{
                isrepeat = "yes";
            }
            
            var num1 = $("."+md5(prd_no+sku_name+express_type)).val();
            
            var a = $(event.target);
            //a.prop("disabled",true);
            $(".searchBtn").prop("disabled",true);
            
            /*setTimeout(function(){
                a.prop("disabled",false);
            },1000);*/
            $.ajax({                                                                                                                                                                    
                url: "/index.php?m=system&c=quickStrike&a=face_now",                                                                                                                            
                type: 'post',                                                                                                                                                               
                data: {data:self.searchData,isAll:self.isAll,type:type,isrepeat:isrepeat,show:show,prd_no:prd_no,num:num1,pr_type:self.type,sku_name:sku_name,express:express_type, printTpl: unprintTplBq},                                                                                                                                                                    
                dataType: 'json',                                                                                                                                                       
                success: function (data) {
                    //a.prop("disabled",false);
                    self.disableNum = self.disableNum - 1;
                    if(self.disableNum == 0){
                        $(".searchBtn").prop("disabled",false); 
                    }
                    // console.log("face_now");
                    // console.log(self.disableNum);
                    if(data.dataCheck && data.numCheck > 0){
                        self.defaultMsg = data.dataCheck;
                        
                        layer.open({
                            type: 1,                                                                                                                                                                            
                            title: '打印详情',                                                                                                                                                              
                            skin: 'layui-layer-rim', //加上边框                                                                                                                                                 
                            area: ['800px', '400px'], //宽高                                                                                                                                                  
                            shade: 0.3,                                                                                                                                                                         
                            content: $("#default")                                                                                                                                                                                  
                        }); 
                    }
                    if(data.dates && data.dates.length > 0){
                        var newData = [];                       
                        var percent = 0;                                            
                        var num = 0;
                        if(show == "F"){
                            doGetPrinters(function(){
                                newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'F');//订单数据,商品数据，订单详情数据, 预览
                                
                                if(unprintname){
                                    if(send == "T"){
                                        printTpl[unprintTplBq](unprintname,newData,false,true);//第四个参数暂时没有用
                                        searchALLNow(flow,'F');
                                        
                                        var expressSort = self.expressSort;
                                        expressSort.splice(index,1);
                                        self.expressSort = expressSort;
                                    }else{
                                        printTpl[unprintTplBq](unprintname,newData);
                                    }
                                }
                            });
                        }else if(show == "show"){
                            doGetPrinters(function(){
                                newData = doGetPrintersFunc(data.unprintall,data.down,data.dates,'T');//订单数据,商品数据，订单详情数据, 预览
                                
                                if(unprintname){
                                    printTpl[unprintTplBq](unprintname,newData,true);
                                }else{
                                    layer.msg('打印机不存在,无法预览', {time: 2000, icon:2});
                                }
                            });
                        }
                    }                                                                                                                                       
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    self.disableNum = self.disableNum - 1;
                    if(self.disableNum == 0){
                        $(".searchBtn").prop("disabled",false); 
                    }
                    // console.log("face_now_error");
                    // console.log(self.disableNum);
                    //a.prop("disabled",false);
                    //$(".searchBtn").prop("disabled",false);
                }
            });
        },
        //============================================================================面单打印 预览 按钮结束=============================================================================================
        
        //=====================================================================面单打印所有=========================================================================================
        face_pr:function(type,index,show,send){
            var self = this;
            $(".searchBtn").prop("disabled",true);
            self.disableNum = 1;
            // console.log("face_pr");
            // console.log(self.disableNum);
            self.face_now(type,index,show,send,self.sku_name,self.express_type);
        },
        print_all:function(){
            var self = this;
            //$("#print_all").prop("disabled",true);
            $(".searchBtn").prop("disabled",true);
            self.disableNum = self.expressSort.length;
            for(var i = 0; i < self.expressSort.length; i++){
                self.face_pr(self.expressSort[i].type,i,'F','T');
            }
            /*setTimeout(function(){
                $("#print_all").prop("disabled",false);
            },1000)*/
        },
        face_pr_batch:function(express,index,show,send,batch){
            var self = this;
            // $(".searchBtn").prop("disabled",true);
            // self.disableNum = 1;
            // console.log("face_pr_batch");
            // console.log(self.disableNum);
            self.face_nowBatch(express,index,show,send,batch);
        },
        print_allBatch:function(){
            var self = this;
            //$("#print_allBatch").prop("disabled",true);
            // $(".searchBtn").prop("disabled",true);
            // self.disableNum = self.expressSort.length;
            // console.log("print_allBatch");
            // console.log(self.disableNum);
            for(var i = 0; i < self.expressSort.length; i++){
                self.face_nowBatch(self.expressSort[i].type,i,'F','T','batch');
            }
            /*setTimeout(function(){
                $("#print_allBatch").prop("disabled",false);
            },1000)*/
            //self.expressSort = [];
        },
        MakePrint_all:function(){
            var self = this;
            /*$("#MakePrint_all").prop("disabled",true);
            setTimeout(function(){
                $("#MakePrint_all").prop("disabled",false);
            },3000)*/
            $(".searchBtn").prop("disabled",true);
            self.disableNum = self.expressSort.length;
            console.log("MakePrint_all");
            console.log(self.disableNum);
            for(var i = 0; i < self.expressSort.length; i++){
                self.markface_now(self.expressSort[i].type,i,'F',self.expressSort[i].PRINT_BAT_NO,self.expressSort[i].prd_no,self.expressSort[i].sku_name);
            }
        },
        //===================================================================面单打印所有结束=======================================================================================
        
        deleteNow:function(index){
            var self = this;
            localStorage.removeItem(self.quickArr[index]);
            var nameArr = $("#user").val();
            self.quickArr.splice(index,1);
            localStorage.setItem(nameArr,JSON.stringify(self.quickArr));
            $(".quick_1 button").each(function(){
                $(".quick_1 .ic").remove();             
                $(this).css("borderColor","#c2c2c2");                                                                                                                                       
            });
        },
    },
    
    
                                                                                                                                                                                                
                                                                                                                                                                                                    
});

//=============================================================================================================选择标签删除方法==================================================================================



function closeNow(group){                                                                                                                                                                           
    if(group == "labelGroup"){                                                                                                                                                                      
        $("#searchArr .lab").remove();                                                                                                                                                              
                                                                                                                                                                                                    
        flow.print = "0";                                                                                                                                                                               
                                                                                                                                                                                                    
        $(".labelGroup div").each(function(){                                                                                                                                                       
            $(".labelGroup .ic").remove();                                                                                                                                                          
            $(this).removeClass("border");                                                                                                                                                          
        });                                                                                                                                                                                         
                                                                                                                                                                                                    
        $(".labelGroup .all").append("<i class='ic'></i>");                                                                                                                     
        $(".labelGroup .all").addClass("border");                                                                                                                                       
    }else if(group == "faceGroup"){                                                                                                                                                                 
        $("#searchArr .face").remove();                                                                                                                                                             
                                                                                                                                                                                                    
        flow.facePrint = "0";                                                                                                                                                                           
                                                                                                                                                                                                    
        $(".faceGroup div").each(function(){                                                                                                                                                        
            $(".faceGroup .ic").remove();                                                                                                                                                           
            $(this).removeClass("border");                                                                                                                                              
        });                                                                                                                                                                                         
                                                                                                                                                                                                    
        $(".faceGroup .all").append("<i class='ic'></i>");                                                                                                                      
        $(".faceGroup .all").addClass("border");                                                                                                                                                
    }else if(group == "bannerArr"){                                                                                                                                                                 
        $("#searchArr .ban span").remove();                                                                                                                                                         
                                                                                                                                                                                                    
        flow.banner = "";                                                                                                                                                                           
                                                                                                                                                                                                    
        $(".bannerArr div").each(function(){                                                                                                                                                        
            $(".bannerArr .ic").remove();                                                                                                                                                           
            $(this).removeClass("border");                                                                                                                                                  
        });                                                                                                                                                                                         
                                                                                                                                                                                                    
        $(".bannerArr .all").append("<i class='ic'></i>");                                                                                                                      
        $(".bannerArr .all").addClass("border");                                                                                                                                        
                                                                                                                                                                                                    
        flow.hui = false;                                                                                                                                                                           
        flow.red = false;                                                                                                                                                                           
        flow.green = false;                                                                                                                                                                         
        flow.yellow = false;                                                                                                                                                                        
        flow.blue = false;                                                                                                                                                                          
        flow.pink = false;                                                                                                                                                                          
    }else if(group == "conditionGroup"){                                                                                                                                                            
        $("#searchArr .remar").remove();                                                                                                                                                            
                                                                                                                                                                                                    
        $(".conditionGroup div").each(function(){                                                                                                                                                   
            $(".conditionGroup .ic").remove();                                                                                                                                                      
            $(this).css("borderColor","#c2c2c2");                                                                                                                                                               
        });                                                                                                                                                                                         
                                                                                                                                                                                                    
        flow.remark = "";                                                                                                                                                                                                                       
        flow.noRemark = false;                                                                                                                                                                      
        flow.haveRemark = false;                                                                                                                                                                    
                                                                                                                                                                                                    
    }else if(group == "refundGroup"){                                                                                                                                                           
        $("#searchArr .reagree").remove();                                                                                                                                                          
                                                                                                                                                                                                    
        $(".refundGroup div").each(function(){                                                                                                                                                  
            $(".refundGroup .ic").remove();                                                                                                                                                     
            $(this).css("borderColor","#c2c2c2");               
        });                                                                                                                                                                                         
                                                                                                                                                                                                    
        flow.refundAgree = "";                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                    
    }else if(group == "babyGroup"){                                                                                                                                                                 
        $("#searchArr .sin").remove();                                                                                                                                                              
                                                                                                                                                                                                    
        $(".babyGroup div").each(function(){                                                                                                                                                        
            $(".babyGroup .ic").remove();                                                                                                                                                           
            $(this).removeClass("border");                                                                                                                                                      
        });                                                                                                                                                                                         
                                                                                                                                                                                                    
        flow.babyNum = "1"; 
        $(".Single").append("<i class='ic'></i>");                                                                                                                      
        $(".Single").addClass("border");
        //flow.variety = false;                                                                                                                                                                     
        //flow.isSingle = false;                                                                                                                                                                        
        //flow.multiple = false;                                                                                                                                                                        
    }else if(group == "shop"){                                                                                                                                                                      
        $("#searchArr .shop").remove();                                                                                                                                                             
        $("#shop").val("");                                                                                                                                                                         
        flow.shopId = "";                                                                                                                                                                           
    }else if(group == "express"){                                                                                                                                                                   
        $("#searchArr .express").remove();                                                                                                                                                          
        $("#express").val("");                                                                                                                                                                      
        flow.express = "";                                                                                                                                                                          
    }else if(group == "orderStatus"){                                                                                                                                                               
        flow.orderStatus = "";                                                                                                                                                                      
        $("#searchArr .orderStatus").remove();                                                                                                                                                      
        $("#orderStatus").val("");                                                                                                                                                                  
    }                                                                                                                                                                                       
                                                                                                                                                                                                    
    searchALLNow(flow,'F'); 
    flow.getTotal();
}                                                                                                                                                                                                   
//===========================================================================================================选择标签删除方法结束================================================================================ 

//========================================================================================================选择店铺===============================================================================================
function shopChange(a){                                                                                                                                                                             //===========
    var toggle = event.currentTarget;                                                                                                                                                               //===========
    if(toggle.value != ""){                                                                                                                                                                     //===========
        flow.shopId = toggle.value;                                                                                                                                                                 //===========
        $("#searchArr .shop").remove();                                                                                                                                                             //===========
        $("#searchArr").append("<span class='add shop rem'>" + a + "<i class='dele' id='specialGroup' onclick='closeNow(\"shop\")'></i></span>");                                                   //===========
    }else if(toggle.value == ""){                                                                                                                                                                   //===========
        flow.shopId = "";                                                                                                                                                                           //===========
        $("#searchArr .shop").remove();                                                                                                                                                             //===========
    }                                                                                                                                                                                               //===========
    searchALLNow(flow,'F');                                                                                                                                                                         //===========
}                                                                                                                                                                                                   //===========
//======================================================================================================选择店铺结束=============================================================================================

//======================================================================================================选择发货快递=============================================================================================
function expressChange(a){                                                                                                                                                                          //===========
    var toggle = event.currentTarget;                                                                                                                                                               //===========
    if(toggle.value != ""){                                                                                                                                                                     //===========
        flow.express = toggle.value;                                                                                                                                                                //===========
        $("#searchArr .express").remove();                                                                                                                                                          //===========
        $("#searchArr").append("<span class='add express rem'>" + a + "<i class='dele' id='specialGroup' onclick='closeNow(\"express\")'></i></span>");                                             //===========
    }else if(toggle.value == ""){                                                                                                                                                                   //===========
        flow.express = "";                                                                                                                                                                          //===========
        $("#searchArr .express").remove();                                                                                                                                                          //===========
    }                                                                                                                                                                                               //===========
    searchALLNow(flow,'F');                                                                                                                                                                         //===========
}                                                                                                                                                                                                   //===========
//====================================================================================================选择发货快递结束===========================================================================================

//======================================================================================================选择订单状态=============================================================================================
function orderChange(a){                                                                                                                                                                            //===========
    var toggle = event.currentTarget;                                                                                                                                                               //===========
    if(toggle.value != ""){                                                                                                                                                                     //===========
        flow.orderStatus = toggle.value;                                                                                                                                                            //===========
        $("#searchArr .orderStatus").remove();                                                                                                                                                      //===========
        $("#searchArr").append("<span class='add orderStatus rem'>" + a + "<i class='dele' id='specialGroup' onclick='closeNow(\"orderStatus\")'></i></span>");                                     //===========
    }else if(toggle.value == ""){                                                                                                                                                                   //===========
        flow.orderStatus = "";                                                                                                                                                                      //===========
        $("#searchArr .orderStatus").remove();                                                                                                                                                      //===========
    }                                                                                                                                                                                               //===========
    searchALLNow(flow,'F');                                                                                                                                                                         //===========
}                                                                                                                                                                                                   //===========
//====================================================================================================选择订单状态结束===========================================================================================

//===========================================================================================重置方法封装========================================================================================================
function resetF(self,special){                                                                                                                                                                      
    $("input[name='reset']").val("");                                                                                                                                                                               
    $("textarea").val("");                                                                                                                                                                          
    $("#shop").val("");                                                                                                                                                                             
    $("#express").val("");                                                                                                                                                                          
    $("#orderStatus").val("");                                                                                                                                                                      
    $("#separator1").val("prd_no");                                                                                                                                                                 
    $(".changeDiv").html("<input class='prd_no inp' placeholder='商品编号' onkeydown='keyDownSearch()' name='reset'>");                                                                                             
    //===========
    $(".labelGroup div").each(function(){                                                                                                                                                           
        $(".labelGroup .ic").remove();                                                                                                                                                              
        $(this).removeClass("border");                                                                                                                                                          
    });                                                                                                                                                                                             
                                                                                                                                                                                                    
    $(".labelGroup .all").append("<i class='ic'></i>");                                                                                                                         
    $(".labelGroup .all").addClass("border");                                                                                                                                           
                                                                                                                                                                                                    
    $(".faceGroup div").each(function(){                                                                                                                                                            
        $(".faceGroup .ic").remove();                                                                                                                                                               
        $(this).removeClass("border");                                                                                                                                                          
    });                                                                                                                                                                                             
                                                                                                                                                                                                    
    $(".faceGroup .all").append("<i class='ic'></i>");                                                                                                                          
    $(".faceGroup .all").addClass("border");                                                                                                                                        
                                                                                                                                                                                                    
    $(".picGroup div").each(function(){                                                                                                                                                             
        $(".picGroup .ic").remove();                                                                                                                                                                
        $(this).removeClass("border");                                                                                                                                                              
    });                                                                                                                                                                                             
                                                                                                                                                                                                    
    $(".picGroup .all").append("<i class='ic'></i>");                                                                                                                               
    $(".picGroup .all").addClass("border");                                                                                                                                             
                                                                                                                                                                                                    
    $(".bannerArr div").each(function(){                                                                                                                                                            
        $(".bannerArr .ic").remove();                                                                                                                                                               
        $(this).removeClass("border");                                                                                                                                                          
    });                                                                                                                                                                                             
                                                                                                                                                                                                    
    $(".bannerArr .all").append("<i class='ic'><i class='ri'></i></i>");                                                                                                                            
    $(".bannerArr .all").addClass("border");                                                                                                                                            
                                                                                                                                                                                                    
    $(".conditionGroup div").each(function(){                                                                                                                                                       
        $(".conditionGroup .ic").remove();
        $(this).removeClass("border");          
        $(this).css("borderColor","#c2c2c2");                                                                                                                                                           
    });     
    
    $(".refundGroup div").each(function(){  
        $("#searchArr .reagree").remove();
        $(".refundGroup .ic").remove();
        $(this).removeClass("border");  
        $(this).css("borderColor","#c2c2c2");       
    }); 
                                                                                                                                                                                                    
    $(".babyGroup div").each(function(){                                                                                                                                                            
        $(".babyGroup .ic").remove();                                                                                                                                                           
        $(this).removeClass("border");                                                                                                                                                  
    });                                                                                                                                                                                             
                                                                                                                                                                                                    
    $(".statusGroup div").each(function(){                                                                                                                                                          
        $(".statusGroup .ic").remove();                                                                                                                                                             
        $(this).removeClass("border");                                                                                                                                                      
    });                                                                                                                                                                                             
                                                                                                                                                                                                    
    $("#searchArr .rem").remove();                                                                                                                                                                  
                                                                                                                                                                                                    
    $("#searchArr .refu").remove();                                                                                                                                                                 
                                                                                                                                                                                                    
    $(".specialGroup div").each(function(){                                                                                                                                                         
        $(".specialGroup .ic").remove();                                                                                                                                                            
        $(this).removeClass("border");                                                                                                                                                  
    });     

    $(".quick_1 button").each(function(){
        $(".quick_1 .ic").remove();             
        $(this).removeClass("border");                                                                                                                                      
    });
    
    $(".Single").append("<i class='ic'><i class='ri'></i></i>");    
    $(".Single").addClass("border");    
                                                                                                                                                                                                    
                                                                                                                                                                                                    
                                                                                                                                                                                                    
    self.hui = false;                                                                                                                                                                               
    self.red = false;                                                                                                                                                                               
    self.green = false;                                                                                                                                                                             
    self.yellow = false;                                                                                                                                                                            
    self.blue = false;                                                                                                                                                                              
    self.pink = false;                                                                                                                                                                              
    self.noRemark = false;                                                                                                                                                                          
    self.haveRemark = false;                                                                                                                                                                        
    self.isSingle = false;                                                                                                                                                                          
    self.multiple = false;                                                                                                                                                                          
                                                                                                                                                                                                    
    self.print = "0";                                                                                                                                                                                                                  
    self.facePrint = "0";                                                                                                                                                                                                                    
    self.remark = "";                                                                                                                                                                                                                        
    self.babyNum = "1";
    self.badyOrder = false; 
    self.banner = "";                                                                                                                                                                               
    self.express = "";                                                                                                                                                                              
    self.shopId = "";                                                                                                                                                                               
    self.orderStatus = "";      
    self.refundAgree = "";
    $(".inputTe").css("color","white");
    $("input[name='order']").iCheck('uncheck');
    self.isAll = 0;
    self.nowPage = false;
    self.allPage = false;   
}                                                                                                                                                                                                   
//=========================================================================================重置方法封装结束======================================================================================================

function orderSelect(a){
    if(a == "prd_no"){
        $(".changeDiv").html("<input class='" + a + " inp'  placeholder='商品编号' onkeydown='keyDownSearch()' name='reset'>");
    }else if(a == "sku_name"){
        $(".changeDiv").html("<input class='" + a + " inp'  placeholder='线上主商品编号' onkeydown='keyDownSearch()' name='reset'>");
    }else if(a == "sku_prd_no"){
        $(".changeDiv").html("<input class='" + a + " inp'  placeholder='线上sku编码' onkeydown='keyDownSearch()' name='reset'>");
    }else if(a == "num_iid"){
        $(".changeDiv").html("<input class='" + a + " inp'  placeholder='网店商品ID' onkeydown='keyDownSearch()' name='reset'>");
    }
}

//============================================================================================查询方法封装=======================================================================================================
function searchALLNow(self,page){
    var dateBegin = $("#dateBegin").val();                                                                                                                                                          
    var dateEnd = $("#dateEnd").val();  
    /***********/
    var orderSelect = $("#separator1").val();
    var prd_no = $('.prd_no').val();
    var sku_name = $(".sku_name").val();
    var sku_prd_no = $('.sku_prd_no').val();
    var num_iid = $('.num_iid').val();
    /***********/
    
    if(page == "F"){
        self.pageNo = 1;
    }
    
    self.banner = "";                                                                                                                                                                               
    if(self.hui){                                                                                                                                                                                   
        self.banner += (0 + ",");                                                                                                                                                                   
    }                                                                                                                                                                                               
                                                                                                                                                                                                    
    if(self.red){                                                                                                                                                                                   
        self.banner += (1 + ",");                                                                                                                                                                   
    }                                                                                                                                                                                               
                                                                                                                                                                                                    
    if(self.yellow){                                                                                                                                                                                
        self.banner += (2 + ",");                                                                                                                                                                   
    }                                                                                                                                                                                               
                                                                                                                                                                                                    
    if(self.green){                                                                                                                                                                                 
        self.banner += (3 + ",");                                                                                                                                                                   
    }                                                                                                                                                                                               
                                                                                                                                                                                                    
    if(self.blue){                                                                                                                                                                                  
        self.banner += (4 + ",");                                                                                                                                                                   
    }                                                                                                                                                                                               
                                                                                                                                                                                                    
    if(self.pink){                                                                                                                                                                                  
        self.banner += (5 + ",");                                                                                                                                                                   
    }                                                                                                                                                                                               
                                                                                                                                                                                                    
    if(self.banner != ""){                                                                                                                                                                          
        self.banner = self.banner.substring(0,self.banner.length-1);                                                                                                                                
    }                                                                                                                                                                                               
                                                                                                                                                                                                    
    var data = {
        "pageSize":self.pageSize,
        "pageNo":self.pageNo,
        "print":self.print,                                                                                                                                                                         
        "facePrint":self.facePrint,                                                                                                                                                                     
        "shopId":self.shopId,                                                                                                                                                                       
        "remark":self.remark,                                                                                                                                                                       
        "babyNum":self.babyNum,                                                                                                                                                                     
        "express":self.express,                                                                                                                                                                     
        "banner":self.banner,                                                                                                                                                                               
        "orderStatus":self.orderStatus,                                                                                                                                                             
        "refundAgree":self.refundAgree,
        "dateBegin":dateBegin,                                                                                                                                                                      
        "dateEnd":dateEnd,                                                                                                                                                                          
        "order":self.order,
        "orderSelect": orderSelect,
        "prd_no":prd_no,
        "sku_prd_no":sku_prd_no,
        "num_iid":num_iid,
        "sku_name":sku_name
    };  

    self.searchData = data;
    
    $.ajax({                                                                                                                                                                                        
        url: "/index.php?m=system&c=quickStrike&a=getData",                                                                                                                                     
        type: 'post',                                                                                                                                                                               
        data: {data: data},                                                                                                                                                                                 
        dataType: 'json',                                                                                                                                                                           
        success: function (data) {
            /*var gridData = data.data;
            var pageCount = data.pageCount;
            var pageNo = data.pageNo;
            var pageSize = data.pageSize;
            var result_total = data.result_total;
            
            self.gridArr = gridData;
            self.pageCount = pageCount;
            self.pageNo = pageNo;
            self.pageSize = pageSize;
            self.result_total = result_total;*/
            flow.data = data.result;
            flow.pageCount = Math.ceil(data.count / flow.pageSize);
            flow.allNum = data.count;
            $(document).ready(function(){
                $('.skin-minimal input').iCheck({
                    checkboxClass: 'icheckbox_minimal',
                    radioClass: 'iradio_minimal',
                    increaseArea: '20%'
                });
            });
            
            setTimeout(function(){
                $('.changeColor').on('ifChecked ifUnchecked', function(event){                                                                                                                                          
                                                                                                                                                                                    
                    if (event.type == 'ifChecked') {            
                        $(event.target).parent().parent().parent().css("backgroundColor","#f8f8c7");
                    } else {                                                                                                                                                                                        
                        $(event.target).parent().parent().parent().css("backgroundColor","rgb(249, 249, 249)");                                                                                                                                 
                    }                                                                                                                                                                                               
                }); 
            },200);
            $("input[name='order']").iCheck('uncheck');
            $(".inputTe").css("color","white");
            self.isAll = 0;
            self.nowPage = false;
            self.allPage = false;
            
        }                                                                                                                                                                                           
    });                                                                                                                                                                                             
}                                                                                                                                                                                                   
//==========================================================================================查询方法封装结束=====================================================================================================

function keyDownSearch(){
    if(event.keyCode==13){
        searchALLNow(flow,'F');
    }
}

function cbPrintSend(self,num){//打印并发货
        var prd_no = self.prd_no;
        
        if(flow.type != "no"){
            var data = "";
            $("input[name='order']:checkbox").each(function(){                                                                                                      
                if(true == $(this).is(':checked')){                                                                                                                                             
                    data += ($(this).val()+",");                                                                                                                                                
                }                                                                                                                                                           
            });                                                                                                                                                                 
            data = data.substring(0,data.length-1);
            prd_no = data;
        }
        
        $.ajax({                                                                                                                                                                                        
            url: "/index.php?m=system&c=quickStrike&a=printOrderSend",                                                                                                                                      
            type: 'post',                                                                                                                                                                               
            data: {data:self.searchData,isAll:self.isAll,prd_no:prd_no,type:flow.type,sku_name:flow.sku_name,num:num},                                                                                                                                                                                  
            dataType: 'json',
            async:false,
            success: function (data) {
                layer.msg("发货成功",{
                    icon: 1,
                    time: 2000
                });
                searchALLNow(flow,'F');
            }                                                                                                                                                                                           
        });
        //}
    //}
}

function cbPrintView(data){
    var double_row = $("input[name='double_row']").parent().find('.layui-form-checkbox').hasClass('layui-form-checked');
    var width = $("input[name='width']").val() * 8;
    var height = $("input[name='height']").val() * 8;
    if(double_row){
        width = width * 2;
    }
    console.log(data);
    layer.open({
        type: 1
        ,title: false //不显示标题栏
        ,closeBtn: false
        ,area: ['400px','650px']
        ,shade: 0.8
        ,shadeClose:true
        ,id: 'previewImage' //设定一个id，防止重复弹出
        ,btn: ['关闭']
        ,moveType: 1 //拖拽模式，0或者1
        ,content: '<div style="width:'+width+'px;height:'+height+'px;"><img style="width:350px;height:580px;" src="'+data['previewImage'][0]+'" /></div>'
    });
}

function get_printBatch(self,actionObj){
    $.ajax({
        url: "/index.php?m=system&c=quickStrike&a=printFaceBatch",                                                                                                                                      
        type: 'post',                                                                                                                                                                               
        data: {data: actionObj},
        dataType: 'json',                                                                                                                                                                           
        success: function (data) {
            if(data){
                self.expressSort = data;
                self.printTplDzmd = printTplDzmd;
                doGetPrinters(function(data){                                                                                                                                                           
                    self.layprint =  data;                                                                                                                                                              
                });                                                                                                                                                                                     
                                                                                                                                                                                                        
                $("#layprint1").val(0);                                         //-----初始化选择框                                                                                                       
                $("#layprintTplBq1").val(0);                                    //-----初始化选择框                                                                                                       
                                                                                                                                                                                                        
                self.layprintTplBq = printTplBq;    
                
                $(document).ready(function(){
                    $('#prin input').iCheck({
                        checkboxClass: 'icheckbox_minimal',
                        radioClass: 'iradio_minimal',
                        increaseArea: '20%'
                    });
                    
                    $.ajax({                                                                                                                                                                                        
                        url: "/index.php?m=system&c=delivery&a=getMianDan",                                                                                                                                     
                        type: 'post',                                                                                                                                                                               
                        data: {},                                                                                                                                                                                   
                        dataType: 'json',                                                                                                                                                                           
                        success: function (data) {
                            if(data.printer != ""){
                                $("select[name='layprintTplBatchname']").change(function () {
                                    var tplVal = $(this).children('option:selected').val();
                                    var selectId = $(this)[0].id;
                                    var selectIdx = selectId.replace("layprintTplBatchBq","");
                                    
                                    $("#layprintBatch" + selectIdx).val(data.printer);
                                });
                            }else{
                                $("#printer select").val(0);
                                printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
                            }
                        }                                                                                                                                                                                           
                    });
                    
                    setTimeout(function(){
                        $("select[name='layprintTplBatchname']").change();
                    },200);
                });
            }
        }
    });
    
    layer.open({                                                                                                                                                                            
        type: 1,                                                                                                                                                                            
        title: "打单并发货1",                                                                                                                                                                    
        skin: 'layui-layer-rim', //加上边框                                                                                                                                                 
        area: ['1200px', '400px'], //宽高                                                                                                                                                 
        shade: 0.3,
        content: $("#facePopBatch"),
        cancel: function(index, layero){
            
        },
        success:function(){
            
        }
    });
}

function get_print(self,prd_no,type,sku_name,express_type){
    $.ajax({
        url: "/index.php?m=system&c=quickStrike&a=printFace",                                                                                                                                       
        type: 'post',                                                                                                                                                                               
        data: {data: self.searchData, isAll: self.isAll,prd_no:prd_no,type:type,sku_name:sku_name,express:express_type},                                                                                                                                                                                    
        dataType: 'json',                                                                                                                                                                           
        success: function (data) {
            if(data){
                self.expressSort = data;
                self.printTplDzmd = printTplDzmd;
                doGetPrinters(function(data){                                                                                                                                                           
                    self.layprint =  data;                                                                                                                                                              
                });                                                                                                                                                                                     
                                                                                                                                                                                                        
                $("#layprint1").val(0);                                         //-----初始化选择框                                                                                                       
                $("#layprintTplBq1").val(0);                                    //-----初始化选择框                                                                                                       
                                                                                                                                                                                                        
                self.layprintTplBq = printTplBq;    
                
                $(document).ready(function(){
                    $('#prin input').iCheck({
                        checkboxClass: 'icheckbox_minimal',
                        radioClass: 'iradio_minimal',
                        increaseArea: '20%'
                    });
                });
                
            }
        }                                                                                                                                                                                           
    });

    layer.open({                                                                                                                                                                            
        type: 1,                                                                                                                                                                            
        title: "打单并发货2",                                                                                                                                                                    
        skin: 'layui-layer-rim', //加上边框                                                                                                                                                 
        area: ['1200px', '400px'], //宽高                                                                                                                                                 
        shade: 0.3,     
        
        content: $("#facePop"),
        cancel: function(index, layero){
            if(type == "page"){
                searchALLNow(self,'F');
                $("input[name='order']").iCheck('uncheck'); 
                $(".inputTe").css("color","white");
                self.isAll = 0;
                self.nowPage = false;
                self.allPage = false;
            }
        },
        success:function(){
            $.ajax({                                                                                                                                                                                        
                url: "/index.php?m=system&c=delivery&a=getMianDan",                                                                                                                                     
                type: 'post',                                                                                                                                                                               
                data: {},                                                                                                                                                                                   
                dataType: 'json',                                                                                                                                                                           
                success: function (data) {
                    if(data.printer != ""){
                        $("#printer select").val(data.printer);
                    }else{
                        $("#printer select").val(0);
                        printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
                    }
                }                                                                                                                                                                                           
            });
        }
    });
}

function doMarkface(self,PRINT_BAT_NO, prd_no, sku_name){
    var print_index_start = $("." + md5(PRINT_BAT_NO + prd_no + sku_name + "_STAR")).val();
    var print_index_end = $("." + md5(PRINT_BAT_NO + prd_no + sku_name + "_END")).val();
    
    $.ajax({                                                                                                                                                                                        
        url: "/index.php?m=system&c=quickStrike&a=markface",                                                                                                                                        
        type: 'post',                                                                                                                                                                               
        data: {PRINT_BAT_NO: PRINT_BAT_NO, prd_no: prd_no, sku_name: sku_name, print_index_start: print_index_start, print_index_end: print_index_end},                                                                                                                                                                                 
        dataType: 'json',                                                                                                                                                                           
        success: function (data) {
            if(data){
                self.expressSort = data;
                self.printTplDzmd = printTplDzmd;
                doGetPrinters(function(data){                                                                                                                                                           
                    self.layprint =  data;                                                                                                                                                              
                });                                                                                                                                                                                     
                                                                                                                                                                                                        
                $("#layprint1").val(0);                                         //-----初始化选择框                                                                                                       
                $("#layprintTplBq1").val(0);                                    //-----初始化选择框                                                                                                       
                                                                                                                                                                                                        
                self.layprintTplBq = printTplBq;    
                
                $(document).ready(function(){
                    $('#prin input').iCheck({
                        checkboxClass: 'icheckbox_minimal',
                        radioClass: 'iradio_minimal',
                        increaseArea: '20%'
                    });
                });
            }
        }                                                                                                                                                                                           
    });

    layer.open({                                                                                                                                                                            
        type: 1,                                                                                                                                                                            
        title: "补打面单",                                                                                                                                                                  
        skin: 'layui-layer-rim', //加上边框                                                                                                                                                 
        area: ['1200px', '400px'], //宽高                                                                                                                                                 
        shade: 0.3,     
        
        content: $("#facePopMake"),
        cancel: function(index, layero){
            
        },
        success:function(){
            $.ajax({                                                                                                                                                                                        
                url: "/index.php?m=system&c=delivery&a=getMianDan",                                                                                                                                     
                type: 'post',                                                                                                                                                                               
                data: {},                                                                                                                                                                                   
                dataType: 'json',                                                                                                                                                                           
                success: function (data) {
                    if(data.printer != ""){
                        $("#printer select").val(data.printer);
                    }else{
                        $("#printer select").val(0);
                        printerPrompt("未设置默认打印机","默认打印机设置","index.php?m=system&c=printer&a=printer");
                    }
                }                                                                                                                                                                                           
            });
        }
    });
}

//=========================================================================================返回顶部、操作航固定==============================================================================================
clearfixFixTop();
function clearfixFixTop(){
    var clearfixClientTop = $("#btnGroupFixed").offset().top;
    var scrollReturnTop = $('<div>',{'class':'scrollReturnTop'}); 
    $("#btnGroupFixed").append(scrollReturnTop);
    $("body").on("click",".scrollReturnTop",function(){
        $("body,html").stop().animate({scrollTop:0},500);
    });
    $(window).scroll(function(){
        var windowScrollTop = $(window).scrollTop();
        if(windowScrollTop>clearfixClientTop){
            $("#btnGroupFixed").addClass("btnArrFixed");
            $("#btnGroupPageFixed").addClass("btnPageFixed");
        }else if(windowScrollTop<clearfixClientTop){
            $("#btnGroupFixed").removeClass("btnArrFixed");
            $("#btnGroupPageFixed").removeClass("btnPageFixed");
        }
        if(windowScrollTop>0){
            $(".scrollReturnTop").css("display","block");
        }else{
            $(".scrollReturnTop").css("display","none");
        }
    });
}

function printCQlabel(unique_code,printTplModule,print){
    $.ajax({                                
        url: "/index.php?m=system&c=printShip&a=getPrintDataCQ",
        type: 'post',                           
        data: {unique_code: unique_code},
        async:false,
        dataType: 'json',               
        success: function (data) {
            printTpl[printTplModule](print,data);   
        }
    });
}                                                                                                                                                                                           
