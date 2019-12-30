mini.parse();
var grid1 = mini.get('grid1');
var grid2 = mini.get('grid2');

grid1.on("drawcell", function(e) {
    var record = e.record,
        column = e.column,
        field = e.field,
        value = e.value;
    if (field == 'print_type') {
        if (value == '0') {
            e.cellHtml = '<span style="color:red;">未打印<span>';
        } else {
            e.cellHtml = '已打印';
        }
    } else if (field == 'status') {
        if (record.close_unique_code == 1) {
            e.cellHtml = '<div class="yes" style="color:red;">已关闭</div>';
        } else if (record.check_stock == 1) {
            e.cellHtml = '<div class="yes" style="color:green;">挂单</div>';
        } else if (record.check_stock == 2) {
            e.cellHtml = '<div class="no" style="color:red;">缺货(原因:' + record.sold_out_memo + ')</div>';
        } else if (record.is_sync == 0) {
            e.cellHtml = '<div class="no" style="color:red;">待配货</div>';
        } else if (record.is_sync == 1) {
            e.cellHtml = '<div class="yes" style="color:green;">已推送</div>';
        }
    } else if (field == 'print_count') {
        if (value == 0) {
            e.cellHtml = '';
        }
    } else if (field == 'have_stock_name') {
        if (record.have_stock == '0') {
            e.cellStyle = "background:#FFEBD7";
        } else {
            e.cellStyle = "background:#DFFFDF";
        }
    } else if (field == 'more_code') {
        if (record.more_code == '爆款') {
            e.cellStyle = "background:#2BAA0B";
        }
    }

});

grid1.on("select", function(e) {
    getSelectCount();
})
grid1.on("deselect", function(e) {
    getSelectCount();
})

var flow = new Vue({
    el: '#flow',
    data: {
        print: 2, //标签打印组内是否打印标记
        shopId: "",
        clientId: "", //店铺
        order: "codingDown", //排序规则
        drag: "", //拖单状态
        singleMore: "", //单多件组
        single: false,
        more: false,
        dragNo: false,
        dragY: false,
        coding: true,
        babyNum: false,
        title: false,
        shopArr: [],
        clientArr: [],
        pageNum: 0,
        m: 0,
        page_m: 1,
        data: [],
        repeatCreate: 'on',
        layprint: [],
        layprintTplBq: [],
        layprintTplbkBq: [],
        isAll: 0,
        productNum: 0,
        numArr: [],
        lableMakeMsg: [],
        nowPage: false,
        allPage: false,
        expressArr: [],
        isClose: "cancel",
        searchData: "",
        order: 'codingDown',
        printType: 'shopLabel',
        have_stock: '',
        check_stock: '',
        isFirst: true,
        onOff: true,
        print_type: 'normal',
        markbatno: '',
        noRemark: false, //无留言且无备注
        haveRemark: false,
        remark: "",
        isReloadLast: '',
        express: '',
        sendStatus: '',
        orderStatus: '',
        banner: "", //旗帜数组
        hui: false, //判断灰旗是否勾选
        red: false, //判断红旗是否勾选
        yellow: false, //判断黄旗是否勾选
        green: false, //判断绿旗是否勾选
        blue: false, //判断蓝旗是否勾选
        pink: false,
        explosion_hui: false, //判断灰旗是否勾选
        explosion_red: false, //判断红旗是否勾选
        explosion_yellow: false, //判断黄旗是否勾选
        explosion_green: false, //判断绿旗是否勾选
        explosion_blue: false, //判断蓝旗是否勾选
        explosion_pink: false,
        showshop: false,
    },
    mounted: function() {
        var self = this;
        num(self);

        //日期选择器
        layui.use(['element', 'layer', 'form', 'layedit', 'laydate'], function() {
            var $ = layui.jquery,
                element = layui.element,
                layer = layui.layer;
            var form = layui.form(),
                layer = layui.layer,
                layedit = layui.layedit,
                laydate = layui.laydate;
            form.on('switch(repeatCreate)', function(data) {
                if (this.checked == true) {
                    flow.repeatCreate = 'on';
                } else {
                    flow.repeatCreate = 'off';
                }
            });
            form.on('radio(explosion_prdt_config)', function() {
                layer.open({
                    content: "/index.php?m=system&c=labelPrinting&a=explosionPrdt",
                    type: 2,
                    title: "指定货品累计数量",
                    area: ['500px', '600px'],
                });
            });
        });
        //获取店铺
        $.ajax({
            url: "/index.php?m=system&c=labelPrinting&a=getShop",
            type: 'post',
            data: {},
            dataType: 'json',
            success: function(data) {
                self.shopArr = data;

                $(document).ready(function() {
                    $('.skin-minimal-shop input').iCheck({
                        checkboxClass: 'icheckbox_minimal',
                        radioClass: 'iradio_minimal',
                        increaseArea: '20%'
                    });
                });
            }
        });

        if (SYNC_UNIQUE_CODE == 'T') {
            $.ajax({
                url: "/index.php?m=system&c=labelPrinting&a=getClient",
                type: 'post',
                data: {},
                dataType: 'json',
                success: function(data) {
                    self.clientArr = data;
                }
            });
        }
        $.ajax({
            url: "/index.php?m=system&c=delivery&a=getExpress",
            type: 'post',
            data: {},
            dataType: 'json',
            success: function(data) {
                self.expressArr = data;
            }
        });
        if (localStorage.getItem("placeArr")) {
            self.provinceArr = JSON.parse(localStorage.getItem("placeArr"));
        }
        $(document).ready(function() {
            searchALLNow(self, 'F', '');
        });

        grid1.on("beforedeselect", function(e) {
            if (self.isAll == 1) {
                layer.msg('选择全部页后无法操作单行数据，请选择当前页', {
                    icon: 0,
                    time: 2000
                });

                e.cancel = true;
            }
        });

        $(".timePay").hover(
            function() {
                $(".orderHide").css("display", "block");
            },
            function() {
                $(".orderHide").css("display", "none");
            }
        );
    },
    methods: {
        //查询模块标签点击事件
        //点击时通过传过来的值判断是哪个标签执行此方法
        //$(".labelGroup div").each(function(){	
        //	$(".labelGroup .ic").remove();
        //	$(this).css("borderColor","#c2c2c2");	
        //});
        //类似此类代码均为做每个组内的初始化操作
        createExplosionFlag: function(who) {
            var self = this;
            var toggle = event.currentTarget;
            $(toggle).append("<i class='ic'></i>");
            $(toggle).addClass("border");
            $(".explosionFlagArr .all .ic").remove();
            $(".explosionFlagArr .all").removeClass("border");
            if (who == "hui") {
                if (self.explosion_hui == false) {
                    self.explosion_hui = true;
                } else if (self.explosion_hui == true) {
                    self.explosion_hui = false;
                    $(toggle).removeClass("border");
                    $(".explosionFlagArr .banner_1 .ic").remove();
                }
            } else if (who == "red") {
                if (self.explosion_red == false) {
                    self.explosion_red = true;
                } else if (self.explosion_red == true) {
                    self.explosion_red = false;
                    $(toggle).removeClass("border");
                    $(".explosionFlagArr .banner_2 .ic").remove();
                }

            } else if (who == "yellow") {
                if (self.explosion_yellow == false) {
                    self.explosion_yellow = true;
                } else if (self.explosion_yellow == true) {
                    self.explosion_yellow = false;
                    $(toggle).removeClass("border");
                    $(".explosionFlagArr .banner_3 .ic").remove();
                }
            } else if (who == "green") {
                if (self.explosion_green == false) {
                    self.explosion_green = true;
                } else if (self.explosion_green == true) {
                    self.explosion_green = false;
                    $(toggle).removeClass("border");
                    $(".explosionFlagArr .banner_4 .ic").remove();
                }
            } else if (who == "blue") {
                if (self.explosion_blue == false) {
                    self.explosion_blue = true;
                } else if (self.explosion_blue == true) {
                    self.explosion_blue = false;
                    $(toggle).removeClass("border");
                    $(".explosionFlagArr .banner_5 .ic").remove();
                }
            } else if (who == "pink") {
                if (self.explosion_pink == false) {
                    self.explosion_pink = true;
                } else if (self.explosion_pink == true) {
                    $("#explosionFlagArr .ban .pink").remove();
                    self.explosion_pink = false;
                    $(toggle).removeClass("border");
                    $(".explosionFlagArr .banner_6 .ic").remove();
                }
            } else if (who == "all") {
                $(".explosionFlagArr div").each(function() {
                    $(".explosionFlagArr .ic").remove();
                    $(this).removeClass("border");
                });
                $(toggle).append("<i class='ic'></i>");
                $(toggle).addClass("border");
                self.explosion_hui = false;
                self.explosion_red = false;
                self.explosion_green = false;
                self.explosion_yellow = false;
                self.explosion_blue = false;
                self.explosion_pink = false;
            }
        },
        searchAdd: function(group, who) {
            var self = this;
            var toggle = event.currentTarget;
            //标签打印组选择标签
            //此模块为单选标签，只能同时选中一个，点击后将状态记录到 self.print 查询时直接拿此变量值即可
            //点击全部时 self.print 恢复默认值
            if (group == "labelGroup") {
                $(".labelGroup div").each(function() {
                    $(".labelGroup .ic").remove();
                    $(this).removeClass("border");
                });
                $(toggle).append("<i class='ic'></i>");
                $(toggle).addClass("border");
                if (who == "donnot") {
                    self.print = 0;
                    $("#searchArr .lab").remove();
                    $("#searchArr").append("<span class='add lab rem'>标签未打印<i class='dele' id='labelGroup' onclick='closeNow(\"labelGroup\")'></i></span>");
                } else if (who == "do") {
                    self.print = 1;
                    $("#searchArr .lab").remove();
                    $("#searchArr").append("<span class='add lab rem'>标签已打印<i class='dele' id='labelGroup' onclick='closeNow(\"labelGroup\")'></i></span>");
                } else if (who == "all") {
                    self.print = 2;
                    $("#searchArr .lab").remove();
                }
            } //拖单状态组选择标签
            //此模块为单选标签，只能同时选中一个，点击后将状态记录到 self.drag 查询时直接拿此变量值即可
            //此组无全部按钮，所以第二次点击相同标签，需取消选中状态，同时 self.drag 恢复为默认值，所以要多做一层判断				
            //判断方法：通过在 data 内给定每个标签一个对应的变量 记录此时是否为选中状态											
            //self.dragNo       --------  无 标签是否选中
            //self.dragY        --------  拖单 标签是否选中
            else if (group == "dragGroup") {
                $(".dragGroup div").each(function() {
                    $(".dragGroup .ic").remove();
                    $(this).removeClass("border");
                });
                $(toggle).append("<i class='ic'></i>");
                $(toggle).addClass("border");
                if (who == "no") {
                    if (self.dragNo == false) {
                        self.drag = "no";
                        $("#searchArr .dr").remove();
                        $("#searchArr").append("<span class='add dr rem'>拖单状态：无<i class='dele' id='dragGroup' onclick='closeNow(\"dragGroup\")'></i></span>");
                        self.dragNo = true;
                        self.dragY = false;
                    } else if (self.dragNo == true) {
                        self.drag = "";
                        $("#searchArr .dr").remove();
                        self.dragNo = false;
                        $(".dragGroup .ic").remove();
                        $(toggle).removeClass("border");
                    }
                } else if (who == "drag") {
                    if (self.dragY == false) {
                        self.drag = "yes";
                        $("#searchArr .dr").remove();
                        $("#searchArr").append("<span class='add dr rem'>拖单状态：拖单<i class='dele' id='dragGroup' onclick='closeNow(\"dragGroup\")'></i></span>");
                        self.dragY = true;
                        self.dragNo = false;
                    } else if (self.dragY == true) {
                        self.drag = "";
                        $("#searchArr .dr").remove();
                        self.dragY = false;
                        $(".dragGroup .ic").remove();
                        $(toggle).removeClass("border");
                    }
                }
            } else if (group == "StockGroup") {
                $(".StockGroup div").each(function() {
                    $(".StockGroup .ic").remove();
                    $(this).removeClass("border");
                });
                $(toggle).append("<i class='ic'></i>");
                $(toggle).addClass("border");
                if (who == "shop") {
                    self.have_stock = 0;
                    $("#searchArr .sto").remove();
                    $("#searchArr").append("<span class='add sto rem'>市场<i class='dele' id='StockGroup' onclick='closeNow(\"StockGroup\")'></i></span>");
                } else if (who == "storage") {
                    self.have_stock = 1;
                    $("#searchArr .sto").remove();
                    $("#searchArr").append("<span class='add sto rem'>库存<i class='dele' id='StockGroup' onclick='closeNow(\"StockGroup\")'></i></span>");
                } else if (who == "sync") {
                    self.have_stock = 2;
                    $("#searchArr .sto").remove();
                    $("#searchArr").append("<span class='add sto rem'>代拿<i class='dele' id='StockGroup' onclick='closeNow(\"StockGroup\")'></i></span>");
                } else if (who == "all") {
                    self.have_stock = '';
                    $("#searchArr .sto").remove();
                }
            } else if (group == "bannerArr") {
                $(toggle).append("<i class='ic'></i>");
                $(toggle).addClass("border");
                $(".bannerArr .all .ic").remove();
                $(".bannerArr .all").removeClass("border");
                if (who == "hui") {
                    if (self.hui == false) {
                        $("#searchArr .ban").append("<span class='bannerA hui rem' style='background-image:url(\"images/hui.png\");background-size:100% 100%;'></span>");
                        self.hui = true;
                    } else if (self.hui == true) {
                        $("#searchArr .ban .hui").remove();
                        self.hui = false;
                        $(toggle).removeClass("border");
                        $(".bannerArr .banner_1 .ic").remove();
                    }
                } else if (who == "red") {
                    if (self.red == false) {
                        $("#searchArr .ban").append("<span class='bannerA red rem' style='background-image:url(\"images/red.png\");background-size:100% 100%;'></span>");
                        self.red = true;
                    } else if (self.red == true) {
                        $("#searchArr .ban .red").remove();
                        self.red = false;
                        $(toggle).removeClass("border");
                        $(".bannerArr .banner_2 .ic").remove();
                    }
                } else if (who == "yellow") {
                    if (self.yellow == false) {
                        $("#searchArr .ban").append("<span class='bannerA yellow rem' style='background-image:url(\"images/yellow.png\");background-size:100% 100%;'></span>");
                        self.yellow = true;
                    } else if (self.yellow == true) {
                        $("#searchArr .ban .yellow").remove();
                        self.yellow = false;
                        $(toggle).removeClass("border");
                        $(".bannerArr .banner_3 .ic").remove();
                    }
                } else if (who == "green") {
                    if (self.green == false) {
                        $("#searchArr .ban").append("<span class='bannerA green rem' style='background-image:url(\"images/green.png\");background-size:100% 100%;'></span>");
                        self.green = true;
                    } else if (self.green == true) {
                        $("#searchArr .ban .green").remove();
                        self.green = false;
                        $(toggle).removeClass("border");
                        $(".bannerArr .banner_4 .ic").remove();
                    }
                } else if (who == "blue") {
                    if (self.blue == false) {
                        $("#searchArr .ban").append("<span class='bannerA blue rem' style='background-image:url(\"images/blue.png\");background-size:100% 100%;'></span>");
                        self.blue = true;
                    } else if (self.blue == true) {
                        $("#searchArr .ban .blue").remove();
                        self.blue = false;
                        $(toggle).removeClass("border");
                        $(".bannerArr .banner_5 .ic").remove();
                    }
                } else if (who == "pink") {
                    if (self.pink == false) {
                        $("#searchArr .ban").append("<span class='bannerA pink rem' style='background-image:url(\"images/fen.png\");background-size:100% 100%;'></span>");
                        self.pink = true;
                    } else if (self.pink == true) {
                        $("#searchArr .ban .pink").remove();
                        self.pink = false;
                        $(toggle).removeClass("border");
                        $(".bannerArr .banner_6 .ic").remove();
                    }
                } else if (who == "all") {
                    $("#searchArr .ban span").remove();
                    $(".bannerArr div").each(function() {
                        $(".bannerArr .ic").remove();
                        $(this).removeClass("border");
                    });
                    $(toggle).append("<i class='ic'></i>");
                    $(toggle).addClass("border");
                    self.hui = false;
                    self.red = false;
                    self.green = false;
                    self.yellow = false;
                    self.blue = false;
                    self.pink = false;
                }
            }
            //单多件组 选择标签
            //此模块为单选标签，只能同时选中一个，点击后将状态记录到 self.singleMore 查询时直接拿此变量值即可
            //此组无全部按钮，所以第二次点击相同标签，需取消选中状态，同时 self.singleMore 恢复为默认值，所以要多做一层判断
            //判断方法：通过在 data 内给定每个标签一个对应的变量 记录此时是否为选中状态
            //self.single       -------- 单件 标签是否选中
            //self.more        --------  多件 标签是否选中
            else if (group == "singleGroup") {
                $(".singleGroup div").each(function() {
                    $(".singleGroup .ic").remove();
                    $(this).removeClass("border");
                });
                $(toggle).append("<i class='ic'></i>");
                $(toggle).addClass("border");
                if (who == "single") {
                    if (self.single == false) {
                        self.singleMore = "single";
                        $("#searchArr .sin").remove();
                        $("#searchArr").append("<span class='add sin rem'>单件<i class='dele' id='singleGroup' onclick='closeNow(\"singleGroup\")'></i></span>");
                        self.single = true;
                        self.more = false;
                    } else if (self.single == true) {
                        self.singleMore = "";
                        $("#searchArr .sin").remove();
                        self.single = false;
                        $(".singleGroup .ic").remove();
                        $(toggle).removeClass("border");
                    }
                } else if (who == "more") {
                    if (self.more == false) {
                        self.singleMore = "more";
                        $("#searchArr .sin").remove();
                        $("#searchArr").append("<span class='add sin rem'>多件<i class='dele' id='singleGroup' onclick='closeNow(\"singleGroup\")'></i></span>");
                        self.more = true;
                        self.single = false;
                    } else if (self.more == true) {
                        self.singleMore = "";
                        $("#searchArr .sin").remove();
                        self.more = false;
                        $(".singleGroup .ic").remove();
                        $(toggle).removeClass("border");
                    }
                }
            } else if (group == "conditionGroup") {
                $(".conditionGroup div").each(function() {
                    $(".conditionGroup .ic").remove();
                    $(this).removeClass("border");
                });
                $(toggle).append("<i class='ic'></i>");
                $(toggle).addClass("border");
                if (who == "haveRemark") {
                    if (self.haveRemark == false) {
                        self.remark = "1";
                        $("#searchArr .remar").remove();
                        $("#searchArr").append("<span class='add remar rem'>有留言或备注<i class='dele' id='conditionGroup' onclick='closeNow(\"conditionGroup\")'></i></span>");
                        self.haveRemark = true;
                        self.noRemark = false;
                    } else if (self.haveRemark == true) {
                        self.remark = "";
                        $("#searchArr .remar").remove();
                        self.haveRemark = false;
                        $(".conditionGroup .ic").remove();
                        $(toggle).removeClass("border");
                    }
                } else if (who == "noRemark") {
                    if (self.noRemark == false) {
                        self.remark = "2";
                        $("#searchArr .remar").remove();
                        $("#searchArr").append("<span class='add remar rem'>无留言且无备注<i class='dele' id='conditionGroup' onclick='closeNow(\"conditionGroup\")'></i></span>");
                        self.noRemark = true;
                        self.haveRemark = false;
                    } else if (self.noRemark == true) {
                        self.remark = "";
                        $("#searchArr .remar").remove();
                        self.noRemark = false;
                        $(".conditionGroup .ic").remove();
                        $(toggle).removeClass("border");
                    }
                }
            }
            //标签是否关闭  选择标签
            //此模块为单选标签，只能同时选中一个，点击后将状态记录到 self.isClose 查询时直接拿此变量值即可
            //此组无全部按钮，所以第二次点击相同标签，需取消选中状态，同时 self.isClose 恢复为默认值，所以要多做一层判断
            //判断方法：通过在 data 内给定每个标签一个对应的变量 记录此时是否为选中状态
            //self.close_1       -------- 单件 标签是否选中
            //self.cancel        --------  多件 标签是否选中
            else if (group == "closeLabel") {
                $(".closeLabel div").each(function() {
                    $(".closeLabel .ic").remove();
                    $(this).removeClass("border");
                });
                $(toggle).append("<i class='ic'></i>");
                $(toggle).addClass("border");
                if (who == "close_1") {
                    self.isClose = "close_1";
                    $("#searchArr .clos").remove();
                    $("#searchArr").append("<span class='add rem clos'>已关闭<i class='dele rem clos' id='closeLabel' onclick='closeNow(\"closeLabel\")'></i></span>");
                } else if (who == "cancel") {
                    self.isClose = "cancel";
                    $("#searchArr .clos").remove();
                    $("#searchArr").append("<span class='add rem clos'>未关闭<i class='dele rem clos' id='closeLabel' onclick='closeNow(\"closeLabel\")'></i></span>");
                }
            }

            //单多件组  选择标签结束
            searchALLNow(self, 'F', '');
        },
        //重置按钮
        resetNow: function() {
            var self = this;
            resetF(self);
        },
        reloadLast: function() {
            var self = this;
            resetF(self);
            searchALLNow(self, 'F', 'reloadLast');
        },
        marketSortSet: function() {
            var self = this;

            layer.open({
                content: "/index.php?m=goods&c=association&a=cusreplace",
                type: 2,
                title: "档口排序规则设置",
                area: ['500px', '600px'],
            });
        },
        //查询方法
        searchALL: function() {
            var self = this;
            layer.load(2);
            $("#searchALL").addClass("layui-btn-disabled");
            $("#searchALL").removeClass("btn");
            $("#searchALL").addClass("btnOnlyStyle");
            searchALLNow(self, 'F', '', function() {
                layer.closeAll('loading');
                $("#searchALL").removeClass("layui-btn-disabled");
                $("#searchALL").addClass("btn");
                $("#searchALL").removeClass("btnOnlyStyle");
            });
        },
        //排序选择按钮
        //点击排序按钮 将 self.order 改变，用来记录此刻根据什么要求排序
        //因为每次点击需要切换状态以及箭头方向（正序或者倒序），所以每个按钮都在 data 内有唯一对应的变量记录此时的状态
        //并且每次点击一个按钮时，其他按钮对应的状态值都要做初始化（false）
        //self.coding ----- 商品编号排序按钮 对应状态值  （true，false）
        //self.babyNum ----- 订单号  排序按钮 对应状态值  （true，false）
        //下拉选项按钮不需要记录此刻的状态，只需要将上述两个按钮状态值初始化为 false 即可，然后改变 self.order 值即可
        orderBy: function(type) {
            var toggle = event.currentTarget; //-----获取点击元素本身
            var self = this;
            $(".orderByDiv").removeClass("must");
            $(".orderByDiv").css("zIndex", 0);
            //初始化
            $(".orderD .orderImg").remove();
            //每次点击排序按钮时都将样式恢复原始状态 再根据下面判断做样式修改
            $(".orderD").find(".orderText").css("top", "0");
            if (type == "coding") { //-----商品编号排序按钮
                self.babyNum = false;
                self.title = false;
                $(toggle).find(".orderText").css("top", "-7px");
                $(toggle).addClass("must");
                //	做样式修改
                $(toggle).css("zIndex", 200);
                if (self.coding == true) {
                    self.order = "codingUp";
                    $(toggle).append("<span class='orderImg' style='background-image:url(\"images/toUp.png\");background-size:100% 100%;'></span>");
                    self.coding = false;
                } else if (self.coding == false) {
                    self.order = "codingDown";
                    $(toggle).append("<span class='orderImg' style='background-image:url(\"images/toDown.png\");background-size:100% 100%;'></span>");
                    self.coding = true;
                }
            } else if (type == "babyNum") {
                //-----订单号 排序按钮
                self.coding = false;
                self.title = false;
                $(toggle).find(".orderText").css("top", "-7px");
                $(toggle).addClass("must");
                //	做样式修改
                $(toggle).css("zIndex", 200);
                if (self.babyNum == false) {
                    self.order = "babyNumDown";
                    $(toggle).append("<span class='orderImg' style='background-image:url(\"images/toDown.png\");background-size:100% 100%;'></span>");
                    self.babyNum = true;
                } else if (self.babyNum == true) {
                    self.order = "babyNumUp";
                    $(toggle).append("<span class='orderImg' style='background-image:url(\"images/toUp.png\");background-size:100% 100%;'></span>");
                    self.babyNum = false;
                }
            } else if (type == "title") {
                //-----订单号 排序按钮
                self.coding = false;
                self.babyNum = false;
                $(toggle).find(".orderText").css("top", "-7px");
                $(toggle).addClass("must");
                //	做样式修改
                $(toggle).css("zIndex", 200);
                if (self.title == false) {
                    self.order = "titleDown";
                    $(toggle).append("<span class='orderImg' style='background-image:url(\"images/toDown.png\");background-size:100% 100%;'></span>");
                    self.title = true;
                } else if (self.title == true) {
                    self.order = "titleUp";
                    $(toggle).append("<span class='orderImg' style='background-image:url(\"images/toUp.png\");background-size:100% 100%;'></span>");
                    self.title = false;
                }
            } else if (type == "PaymentDown") {
                $(".timePay").css("zIndex", 10); //===========
                $(".timePay").addClass("must");
                self.order = "PaymentDown";
                self.coding = false;
                self.babyNum = false;
                self.title = false;

                $(".photo").html($(toggle).html());
            } else if (type == "PaymentUp") {
                $(".timePay").css("zIndex", 10); //===========
                $(".timePay").addClass("must");
                self.order = "PaymentUp";
                self.babyNum = false;
                self.title = false;

                $(".photo").html($(toggle).html());
            }

            $(".orderHide").css("display", "none");
            searchALLNow(self, 'F', '');
        },
        //翻页按钮
        page1: function(page) {
            var self = this;
            layer.load(2);
            if (page == "first") {
                self.m = 0;
                self.page_m = 1;
                //searchALLNow(self,'page','');
            } else if (page == "last") {
                self.m = self.pageNum - 1;
                self.page_m = self.m + 1;
                //searchALLNow(self,'page','');
            } else if (page == "pre" && self.m > 0) {
                self.m--;
                self.page_m = self.m + 1;
                //searchALLNow(self,'page','');
            } else if (page == "next" && self.m <= (self.pageNum - 2)) {
                self.m++;
                self.page_m = self.m + 1;
                //searchALLNow(self,'page','');
            }
            searchALLNow(self, 'page', '', function() {
                layer.closeAll('loading');
            });

            //$("input[name='lab']").prop("checked",false);	
            $("#currentAll1").prop("checked", false);
            $("#current1").prop("checked", false);
            self.isAll = 0;
        },

        //当前页 全部页 事件							
        //		点击时通过传过来的值判断是哪个按钮执行此方法
        //		type          : 判断是当前页还是全部页	
        //		nowPage       : 判断当前页 i（.inputTe） 标签是否为勾选状态
        //		allPage       : 判断全部页 i（.inputTe） 标签是否为勾选状态
        //		isAll     	  : 记录目前为全部页还是当前页，用于传入后台做判断
        //		event.target  : 获取当前点击对象
        //
        //		为避免button 内的checkbox勾选无效，所以用 i（.inputTe） 标签画一个 虚拟 checkbox 每次点击切换背景颜色
        selectAll: function(type) {
            var self = this;
            if (type == "now") {
                $(".currentAll").find(".inputTe").each(function() {
                    $(this).css("color", "white");
                });
                self.isAll = 0;
                self.allPage = false;
                if (self.nowPage == false) {
                    if ($(event.target).attr('value') != "icon") {
                        $(event.target).find(".inputTe").css("color", "black");
                    } else {
                        $(event.target).css("color", "black");
                    }
                    self.nowPage = true;
                    //$(".skin-minimal input[name='lab']").iCheck('check');	
                    grid1.selectAll();
                } else if (self.nowPage == true) {
                    if ($(event.target).attr('value') != "icon") {
                        $(event.target).find(".inputTe").css("color", "white");
                    } else {
                        $(event.target).css("color", "white");
                    }
                    self.nowPage = false;
                    //$(".skin-minimal input[name='lab']").iCheck('uncheck');		
                    grid1.deselectAll();
                    $(".inputTe").css("color", "white");
                    self.isAll = 0;
                    self.nowPage = false;
                    self.allPage = false;
                }
            } else if (type == "all") {
                $(".current").find(".inputTe").each(function() {
                    $(this).css("color", "white");
                });
                self.nowPage = false;
                if (self.allPage == false) {
                    if ($(event.target).attr('value') != "icon") {
                        $(event.target).find(".inputTe").css("color", "black");
                        //$(event.target.parentNode).find(".inputTe").css("color","black");
                        if ($(event.target.parentNode).attr('value') == 'allPage') {
                            $(event.target.parentNode).find(".inputTe").css("color", "black");
                        }
                    } else {
                        $(event.target).css("color", "black");
                    }
                    self.allPage = true;
                    self.isAll = 1;
                    //$(".skin-minimal input[name='lab']").iCheck('check');	
                    grid1.selectAll();
                } else if (self.allPage == true) {
                    if ($(event.target).attr('value') != "icon") {
                        $(event.target).find(".inputTe").css("color", "white");
                    } else {
                        $(event.target).css("color", "white");
                    }
                    self.allPage = false;
                    self.isAll = 0;
                    self.nowPage = false;
                    self.allPage = false;
                    //$(".skin-minimal input[name='lab']").iCheck('uncheck');
                    grid1.deselectAll();
                    $(".inputTe").css("color", "white");
                }
            }

            getSelectCount();
        },
        lableMake: function() { //标签补打弹窗
            var self = this;

            $.ajax({
                url: "/index.php?m=system&c=labelPrinting&a=lable_make",
                type: 'post',
                data: {},
                dataType: 'json',
                success: function(data) {
                    if (data) {
                        self.lableMakeMsg = data.data;
                    }

                    layer.open({
                        type: 1,
                        title: '标签补打',
                        skin: 'layui-layer-rim', //加上边框																																					
                        area: ['800px', '600px'], //宽高																																					
                        shade: 0.3,
                        content: $("#labelMakeWindow")
                    });
                }
            })
        },
        printSearch: function() {
            var self = this;

            var printdateBegin = $("#printdateBegin").val();
            var printdateEnd = $("#printdateEnd").val();

            $.ajax({
                url: "/index.php?m=system&c=labelPrinting&a=lable_make",
                type: 'post',
                data: { printdateBegin: printdateBegin, printdateEnd: printdateEnd },
                dataType: 'json',
                success: function(data) {
                    if (data) {
                        self.lableMakeMsg = data.data;
                    }
                }
            })
        },
        key_upMake: function(value, index) {
            var self = this;
            var a = $(event.target);
            var e = event || window.event;
            var av = a.val();
            if ((av * 1) > (value * 1)) {
                layer.msg('输入数量不能大于订单数量', {
                    icon: 0,
                    time: 2000
                });
                a.val(value);
            } else if (a.val() == "0") {
                layer.msg('请输入正确的订单数量', {
                    icon: 0,
                    time: 2000
                });
                a.val(value);
            } else {
                self.lableMakeMsg[index].print_num_end = a.val();
            }

        },
        marklabel: function(PRINT_BAT_NO) {
            var self = this;

            var print_index_start = $("." + md5(PRINT_BAT_NO + "_STAR")).val();
            var print_index_end = $("." + md5(PRINT_BAT_NO + "_END")).val();

            $.ajax({
                url: "/index.php?m=system&c=labelPrinting&a=marklabelTypeCheck",
                type: 'post',
                data: { PRINT_BAT_NO: PRINT_BAT_NO, print_index_start: print_index_start, print_index_end: print_index_end },
                dataType: 'json',
                success: function(data) {
                    if (data.code == "ok") {

                        if (data.type == "1") {
                            //市场
                            self.printType = "shopLabel";
                            self.printOpen('F');
                            $("#layprintTplBqShopDiv").show();
                            $("#layprintTplBqStorageDiv").hide();
                            $("#radio_1").iCheck('check');
                        } else if (data.type == "2") { //库存
                            self.printType = "storageLabel";
                            self.printOpen('F');
                            $("#layprintTplBqShopDiv").hide();
                            $("#layprintTplBqStorageDiv").show();
                            $("#radio_2").iCheck('check');
                        } else if (data.type == "3") { //市场与库存
                            self.printType = "allLabel";
                            self.printOpen('F');
                            $("#layprintTplBqShopDiv").show();
                            $("#layprintTplBqStorageDiv").show();
                            $("#radio_3").iCheck('check');
                        }

                        self.print_type = 'mark';
                        self.markbatno = PRINT_BAT_NO;
                        layer.open({
                            type: 1,
                            title: '补打标签',
                            skin: 'layui-layer-rim',
                            area: ['700px', '400px'],
                            shade: 0.3,
                            content: $("#label-check"),
                            btn: ['取消'],
                            cancel: function(index, layero) {

                            }
                        });
                    } else {
                        layer.msg('无打印数据或打印数据获取失败', {
                            icon: 0,
                            time: 2000
                        });
                        return;
                    }
                }
            });
        },
        refreshHaveStock: function() {
            var self = this;
            layer.open({
                title: '提示',
                content: '使用说明：此功能会把已经挂单的货品重新匹配到可以整单发货的订单，请标签发货并且挂单完毕后操作。</br>1.设置一个重匹配挂单的标签模板，模板上设置打印挂单原群单码和新群单码。</br>2.此功能打印标签后通过原群单码找到挂单货品，扫描原标签取消挂单。</br>3.使用新标签扫描发货',
                btn: ['确定', '取消'],
                yes: function() {
                    layer.open({
                        title: '提示',
                        content: '再次确认：此功能请于全部标签发货完毕并且挂单操作完成后操作，确认要继续吗？',
                        btn: ['确定', '取消'],
                        yes: function() {
                            doGetPrinters(function(data) {
                                self.layprint = data;
                            });
                            self.layprintTplBq = printTplBq;
                            $.ajax({
                                url: "/index.php?m=system&c=labelPrinting&a=refreshHaveStock",
                                type: 'post',
                                dataType: 'json',
                                success: function(data) {
                                    if (data.code == "ok") {
                                        layer.closeAll();
                                        layer.open({
                                            type: 1,
                                            title: '打印重解析挂单标签',
                                            skin: 'layui-layer-rim', //加上边框
                                            area: ['700px', '400px'], //宽高
                                            shade: 0.3,
                                            content: $("#table-refreshHaveStock"),
                                            btn: ['确定打印'],
                                            yes: function(index, layero) {
                                                //按钮【按钮一】的回调
                                                self.setRefreshHaveStock(data.unique_code);
                                            }
                                        });
                                    } else {
                                        layer.closeAll();
                                        layer.msg(data.msg, {
                                            icon: 0,
                                            time: 3000
                                        });
                                    }
                                }
                            })
                        }
                    });
                }
            });

        },
        createExplosionCode: function() {
            var self = this;
            layer.load(2);
            $.ajax({
                url: "/index.php?m=system&c=labelPrinting&a=checkTodayExplosionCode",
                type: 'post',
                dataType: 'json',
                success: function(data) {
                    if (data.code == "ok") {
                        layer.closeAll();
                        self.setExplosionCode();
                    } else {
                        layer.closeAll();
                        layer.open({
                            title: '提示',
                            content: '今日已经生成过爆款，确认要继续生成吗？',
                            btn: ['确定', '取消'],
                            yes: function() {
                                layer.closeAll();
                                self.setExplosionCode();
                            }
                        })
                    }
                }
            })
        },
        setExplosionCode: function() {
            var self = this;
            layer.open({
                type: 1,
                title: '计算爆款标签',
                skin: 'layui-layer-rim', //加上边框
                area: ['700px', '480px'], //宽高
                shade: 0.3,
                content: $("#table-setExplosionCode"),
                btn: ['确定'],
                yes: function(index, layero) {
                    //按钮【按钮一】的回调
                    layer.closeAll();
                    var explosionPrdt = $("input[name='explosionPrdt']:checked").val();
                    if (explosionPrdt == 'num' && $('#explosionNum').val() == '') {
                        layer.msg('输入数量不正确', {
                            icon: 0,
                            time: 2000
                        });
                        return false;
                    }

                    layer.load(2);
                    var flag = "";

                    if (self.explosion_hui) {
                        flag += (0 + ",");
                    }
                    if (self.explosion_red) {
                        flag += (1 + ",");
                    }
                    if (self.explosion_yellow) {
                        flag += (2 + ",");
                    }
                    if (self.explosion_green) {
                        flag += (3 + ",");
                    }
                    if (self.explosion_blue) {
                        flag += (4 + ",");
                    }
                    if (self.explosion_pink) {
                        flag += (5 + ",");
                    }
                    if (flag != "") {
                        flag = flag.substring(0, flag.length - 1);
                    }
                    $.ajax({
                        url: "/index.php?m=system&c=labelPrinting&a=setExplosionCode",
                        type: 'post',
                        dataType: 'json',
                        data: { num: $('#explosionNum').val(), repeatCreate: self.repeatCreate, end_time: $('#end_time').val(), flag: flag, explosionPrdt: explosionPrdt },
                        success: function(data) {
                            if (data.code == "ok") {
                                layer.closeAll();
                                layer.open({
                                    title: '提示',
                                    content: data.msg,
                                    btn: ['确定'],
                                    yes: function() {
                                        layer.closeAll();
                                    }
                                })
                            } else {
                                layer.closeAll();
                                layer.open({
                                    title: '提示',
                                    content: data.msg,
                                    btn: ['确定'],
                                    yes: function() {
                                        layer.closeAll();
                                    }
                                })
                            }
                        }
                    })
                }
            });
        },
        //打印弹窗
        print1: function(order) {
            var self = this;
            self.printOrder = order ? order : self.order;
            if (self.isClose == "close_1") {
                layer.msg('已关闭标签不能打印', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }

            var selectRows = grid1.getSelecteds();
            //if($("input[name='lab']").filter(':checked').length == 0){
            if (selectRows.length == 0) {
                layer.msg('请选择至少一条数据', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }

            var data = "";
            for (var i = 0; i < selectRows.length; i++) {
                data += selectRows[i]['unique_code'] + ",";
            }
            /*$("input[name='lab']:checkbox").each(function(){
            	if(true == $(this).is(':checked')){
            		data += ($(this).val()+",");
            	}	
            });*/
            data = data.substring(0, data.length - 1);

            if (SYNC_UNIQUE_CODE == 'T') {
                self.printType = "shopLabel";
                self.printOpen('F');
                $("#layprintTplBqShopDiv").show();
                $("#layprintTplBqStorageDiv").hide();
                $("#radio_1").iCheck('check');
                self.print_type = 'normal';
                layer.open({
                    type: 1,
                    title: self.printOrder == 'seller_memo' ? '按备注排序打标签' : '打标签',
                    skin: 'layui-layer-rim',
                    area: ['700px', '400px'],
                    shade: 0.3,
                    content: $("#label-check"),
                    btn: ['取消'],
                    cancel: function(index, layero) {

                    }
                });
            } else {
                $.ajax({
                    url: "/index.php?m=system&c=labelPrinting&a=labelTypeCheck",
                    type: 'post',
                    data: { unique_code: data, isAll: self.isAll, data: self.searchData },
                    dataType: 'json',
                    success: function(data) {
                        if (data.code == "ok") {
                            if (data.type == "1") {
                                //市场
                                self.printType = "shopLabel";
                                self.printOpen('F');
                                $("#layprintTplBqShopDiv").show();
                                $("#layprintTplBqStorageDiv").hide();
                                $("#radio_1").iCheck('check');
                            } else if (data.type == "2") { //库存
                                self.printType = "storageLabel";
                                self.printOpen('F');
                                $("#layprintTplBqShopDiv").hide();
                                $("#layprintTplBqStorageDiv").show();
                                $("#radio_2").iCheck('check');
                            } else if (data.type == "3") { //市场与库存
                                self.printType = "allLabel";
                                self.printOpen('F');
                                $("#layprintTplBqShopDiv").show();
                                $("#layprintTplBqStorageDiv").show();
                                $("#radio_3").iCheck('check');
                            }

                            self.print_type = 'normal';
                            layer.open({
                                type: 1,
                                title: self.printOrder == 'seller_memo' ? '按备注排序打标签' : '打标签',
                                skin: 'layui-layer-rim',
                                area: ['700px', '400px'],
                                shade: 0.3,
                                content: $("#label-check"),
                                btn: ['取消'],
                                cancel: function(index, layero) {

                                }
                            });
                        } else {
                            layer.msg('无打印数据或打印数据获取失败', {
                                icon: 0,
                                time: 2000
                            });
                            return;
                        }
                    }
                });
            }
        },
        //打印弹窗结束
        printOpen: function(index) {
            var self = this;
            if (self.printType == "") {
                layer.msg('请选择打印标签类型', {
                    icon: 0,
                    time: 2000
                });
            }
            doGetPrinters(function(data) {
                self.layprint = data;
            });

            $("#layprint").val(0); //-----初始化选择框	
            $("#layprintTplBqShop").val(0); //-----初始化选择框
            $("#layprintTplBqStorage").val(0); //-----初始化选择框	

            if (self.printType == "shopLabel") {
                $("#layprintTplBqShopDiv").show();
                $("#layprintTplBqStorageDiv").hide();
            } else if (self.printType == "storageLabel") {
                $("#layprintTplBqShopDiv").hide();
                $("#layprintTplBqStorageDiv").show();
            } else if (self.printType == "allLabel") {
                $("#layprintTplBqShopDiv").show();
                $("#layprintTplBqStorageDiv").show();
            }

            self.layprintTplBq = printTplBq;
            if (index != 'F') {
                layer.close(index);
            }

            $.ajax({
                url: "/index.php?m=system&c=labelPrinting&a=getLabelNow",
                type: 'post',
                data: {},
                dataType: 'json',
                success: function(data) {
                    if (data['result'].printer != "" && data['bq'].id != "") {
                        $("#layprint").val(data['result'].printer);
                        $("#layprintTplBqShop").val(data['bqShop']);
                        $("#layprintTplBqStorage").val(data['bqStorage']);
                    } else if (data['result'].printer != "" && data['bq'].id == "") {
                        $("#layprint").val(data['result'].printer);
                        $("#layprintTplBqShop").val(0);
                        $("#layprintTplBqStorage").val(0);
                        printerPrompt("未设置默认打印模板", "标签设计", "index.php?m=print&c=bqDesign&a=index");
                    } else if (data['result'].printer == "" && data['bq'].id != "") {
                        $("#layprint").val(0);
                        printerPrompt("未设置默认打印机", "默认打印机设置", "index.php?m=system&c=printer&a=printer");
                        $("#layprintTplBqShop").val(data['bqShop']);
                        $("#layprintTplBqStorage").val(data['bqStorage']);
                    } else {
                        $("#layprint").val(0);
                        $("#layprintTplBqShop").val(0);
                        $("#layprintTplBqStorage").val(0);
                        printerPrompt("未设置默认打印机", "默认打印机设置", "index.php?m=system&c=printer&a=printer");
                    }
                }
            });
        },
        //确定打印
        setyesorder: function() {
            var self = this;
            var data = "";

            console.log('2');
            if ($("#setyesorder-btn").hasClass("layui-btn-disabled")) {
                console.log('1');
                return false;
            }
            $("#setyesorder-btn").addClass("layui-btn-disabled");

            if ($("#layprint").val() != 0) {
                var unprintname = $("#layprint").val();
            } else {
                layer.msg('请选择打印机', {
                    icon: 0,
                    time: 2000
                });
                $("#setyesorder-btn").removeClass("layui-btn-disabled");
                return false;
            }
            var printTypeObj = [];
            if (self.printType == "shopLabel") {
                printTypeObj = ['shopLabel'];
                if ($("#layprintTplBqShop").val() == 0) {
                    layer.msg('请选择市场标签打印模板', {
                        icon: 0,
                        time: 2000
                    });
                    $("#setyesorder-btn").removeClass("layui-btn-disabled");
                    return false;
                }
            } else if (self.printType == "storageLabel") {
                printTypeObj = ['storageLabel'];
                if ($("#layprintTplBqShop").val() == 0) {
                    layer.msg('请选择库存标签打印模板', {
                        icon: 0,
                        time: 2000
                    });
                    $("#setyesorder-btn").removeClass("layui-btn-disabled");
                    return false;
                }
            } else if (self.printType == "allLabel") {
                printTypeObj = ['storageLabel', 'shopLabel'];

                if ($("#layprintTplBqShop").val() == 0) {
                    layer.msg('请选择市场标签打印模板', {
                        icon: 0,
                        time: 2000
                    });
                    $("#setyesorder-btn").removeClass("layui-btn-disabled");
                    return false;
                }
                if ($("#layprintTplBqShop").val() == 0) {
                    layer.msg('请选择库存标签打印模板', {
                        icon: 0,
                        time: 2000
                    });
                    $("#setyesorder-btn").removeClass("layui-btn-disabled");
                    return false;
                }
            }

            if (self.print_type == 'mark') {
                var PRINT_BAT_NO = self.markbatno;
                var print_index_start = $("." + md5(PRINT_BAT_NO + "_STAR")).val();
                var print_index_end = $("." + md5(PRINT_BAT_NO + "_END")).val();

                var data1 = {
                    "PRINT_BAT_NO": PRINT_BAT_NO,
                    "print_index_start": print_index_start,
                    "print_index_end": print_index_end,
                };
            } else {
                var dateBegin = $("#dateBegin").val();
                //-----开始日期
                var dateEnd = $("#dateEnd").val();
                //-----结束日期
                var tid = "";
                var buyer_nick = "";
                var seller_memo = "";
                var unique_code = "";
                var explosion_code = "";
                var y_prd_no = "";
                var n_prd_no = "";
                if ($("#separator1").val() == "order") {
                    tid = $("#order").val();
                    //-----订单编号
                    if (tid.substring(tid.length - 1, tid.length) == ",") {
                        tid = tid.substring(0, tid.length - 1);
                        //  如果为多个拼接，则直接在前台对字符窜进行处理
                    }
                } else if ($("#separator1").val() == "buyer_nick") {
                    buyer_nick = $("#buyer_nick").val();
                    //-----买家昵称
                } else if ($("#separator1").val() == "seller_memo") {
                    seller_memo = $("#seller_memo").val();
                    //-----买家昵称
                } else if ($("#separator1").val() == "yy_prd_no") {
                    y_prd_no = $("#yy_prd_no").val();
                    //-----买家昵称
                } else if ($("#separator1").val() == "unique_code") {
                    unique_code = $("#unique_code").val();
                    //唯一码
                    if (unique_code.substring(unique_code.length - 1, unique_code.length) == ",") {
                        //如果为多个拼接，则直接在前台对字符窜进行处理
                        unique_code = unique_code.substring(0, unique_code.length - 1);
                    }
                } else if ($("#separator1").val() == "explosion_code") {
                    explosion_code = $("#explosion_code").val();
                    //-----买家昵称
                }
                if ($("#separator2").val() == "y_prd_no" && $("#y_prd_no").val() != '') {
                    //含商家编码	
                    y_prd_no = $("#y_prd_no").val();
                } else if ($("#separator2").val() == "n_prd_no") {
                    //不含商家编码
                    n_prd_no = $("#n_prd_no").val();
                }

                var date_type = 1;
                if ($("#date_type").val() == 2) {
                    date_type = 2;
                }

                var data1 = {
                    "print": self.print,
                    "drag": self.drag,
                    "singleMore": self.singleMore,
                    "shopId": self.shopId,
                    "clientId": self.clientId,
                    "order": self.order,
                    "printOrder": self.printOrder,
                    "dateBegin": dateBegin,
                    "dateEnd": dateEnd,
                    "tid": tid,
                    "buyer_nick": buyer_nick,
                    "seller_memo": seller_memo,
                    "unique_code": unique_code,
                    "explosion_code": explosion_code,
                    "y_prd_no": y_prd_no,
                    "n_prd_no": n_prd_no,
                    "have_stock": self.have_stock,
                    "isClose": self.isClose,
                    "check_stock": self.check_stock,
                    "remark": self.remark,
                    "reloadLast": self.isReloadLast,
                    "express": self.express,
                    "banner": self.banner,
                    "date_type": date_type,
					"sendStatus": self.sendStatus,
                };

                var selectRows = grid1.getSelecteds();
                if (self.isAll == 0) {
                    //-----如果是当前页				
                    /*$("input[name='lab']:checkbox").each(function(){
                    	//拼接当前页的货品唯一码	
                    	if(true == $(this).is(':checked')){
                    		data += ($(this).val()+",");					
                    	}	
                    });*/
                    for (var i = 0; i < selectRows.length; i++) {
                        data += selectRows[i]['unique_code'] + ",";
                    }
                    data = data.substring(0, data.length - 1);
                }
            }

            for (var i in printTypeObj) {
                if (typeof(printTypeObj[i]) != 'string') {
                    continue;
                }

                var thisPrintType = printTypeObj[i];

                if (thisPrintType == "shopLabel") {
                    var unprintTplBq = $("#layprintTplBqShop").val();
                } else if (thisPrintType == "storageLabel") {
                    var unprintTplBq = $("#layprintTplBqStorage").val();
                }

                if (unprintTplBq == "") {
                    layer.msg('请选择打印模板', {
                        icon: 0,
                        time: 2000
                    });

                    $("#setyesorder-btn").removeClass("layui-btn-disabled");
                    return false;
                }
                var url = SYNC_UNIQUE_CODE == 'T' ? "/index.php?m=system&c=labelPrinting&a=syncPrintData" : "/index.php?m=system&c=labelPrinting&a=printData";
                $.ajax({
                    url: url,
                    type: 'post',
                    data: { data: data, data1: data1, isAll: self.isAll, order: self.order, printOrder: self.printOrder, printType: thisPrintType, unprintTplBq: unprintTplBq, print_type: self.print_type },
                    dataType: 'json',
                    async: true,
                    success: function(data) {
                        if (data[0] != "") {
                            var percent = 0; //进度条初始化									
                            layer.closeAll();
                            $(".sche").css("display", "block"); //进度条窗口显示	
                            var i = 0;
                            //console.log(unprintTplBq);
                            countSecond(i, data, unprintTplBq);

                            function countSecond(i, data, printTplBq) {
                                if (i < data.length) {
                                    layui.use('element', function() {
                                        var element = layui.element();
                                        element.init();
                                        //进度条
                                        percent += 100 / data.length;
                                        percent = Math.ceil(percent);
                                        element.progress('demo', percent + '%');
                                    });

                                    console.log(data[i]);
                                    printTpl[printTplBq](unprintname, data[i]);
                                    i = i + 1;
                                    setTimeout(function() {
                                        countSecond(i, data, printTplBq);
                                    }, 1000)
                                } else {
                                    $(".sche").css("display", "none"); //进度条窗口关闭
                                    $("#setyesorder-btn").removeClass("layui-btn-disabled");
                                    self.isAll = 0;
                                    searchALLNow(self, 'page', '');
                                    layer.msg('打印完成', {
                                        icon: 1,
                                        time: 2000
                                    });
                                    //$(".skin-minimal input[name='lab']").iCheck('uncheck');
                                    grid1.deselectAll();
                                    $(".inputTe").css("color", "white");
                                    self.nowPage = false;
                                    self.allPage = false;
                                    num(self);
                                    return
                                }
                            }
                        } else {
                            $("#setyesorder-btn").removeClass("layui-btn-disabled");

                            if (self.isClose == "cancel") {
                                if (self.have_stock == '2') {
                                    layer.msg('代拿订单不允许打印', {
                                        icon: 0,
                                        time: 2000
                                    });
                                } else {
                                    var sync_system = $("#sync_system").val();
                                    if (sync_system != "") {
                                        layer.msg('已挂单，缺货货品或代拿订单不能打印标签', {
                                            icon: 0,
                                            time: 2000
                                        });
                                    } else {
                                        layer.msg('已挂单或缺货货品不能打印标签', {
                                            icon: 0,
                                            time: 2000
                                        });
                                    }
                                }
                            } else {
                                layer.msg('标签已关闭', {
                                    icon: 0,
                                    time: 2000
                                });
                            }
                        }
                    }
                });
            }
        },
        doPrintExplosionCode: function(printData) {
            var self = this;

            if ($("#layprintExplosion").val() != 0) {
                var unprintname = $("#layprintExplosion").val();
            } else {
                layer.msg('请选择打印机', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }

            if ($("#layprintTplExplosion").val() != 0) {
                var unprintTplBq = $("#layprintTplExplosion").val();
            } else {
                layer.msg('请选择打印模板', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }

            printData = JSON.stringify(printData);
            printData = encodeURI(printData);

            $.ajax({
                url: "/index.php?m=system&c=labelPrinting&a=printBKData",
                type: 'post',
                data: { printData: printData },
                dataType: 'json',
                async: true,
                success: function(data) {
                    if (data[0] != "") {
                        var percent = 0; //进度条初始化									
                        layer.closeAll();
                        $(".sche").css("display", "block"); //进度条窗口显示	
                        var i = 0;

                        countSecond(i, data, unprintTplBq);

                        function countSecond(i, data, printTplBq) {
                            if (i < data.length) {
                                layui.use('element', function() {
                                    var element = layui.element();
                                    element.init();
                                    //进度条
                                    percent += 100 / data.length;
                                    percent = Math.ceil(percent);
                                    element.progress('demo', percent + '%');
                                });
                                printTpl[printTplBq](unprintname, data[i]);
                                i = i + 1;
                                setTimeout(function() {
                                    countSecond(i, data, printTplBq);
                                }, 1000)
                            } else {
                                $(".sche").css("display", "none"); //进度条窗口关闭
                                grid2.reload();
                                layer.msg('打印完成', {
                                    icon: 1,
                                    time: 2000
                                });
                                return;
                            }
                        }
                    } else {
                        layer.msg('打印异常', {
                            icon: 0,
                            time: 2000
                        });
                    }
                }
            });

        },
        //模板设置
        setExcel: function(obj) {
            if (obj == 'export') {
                window.parent.addTab('setExcel', '?m=system&c=takeTemplate&a=index', '拿货单导出模板设计');
            } else if (obj == 'printer') {
                window.parent.addTab('setPrinter', '?m=system&c=takeTemplate&a=printer', '拿货单打印模板设计');
            }
        },
        //批量取消挂单
        cancelPending: function() {
            var self = this;
            var selectRows = grid1.getSelecteds();
            if (selectRows.length == 0) {
                layer.msg('请选择至少一条数据', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }
            var data = "";
            for (var i = 0; i < selectRows.length; i++) {
                data += selectRows[i]['unique_code'] + ",";
            }
            data = data.substring(0, data.length - 1);
            $.ajax({
                url: "/index.php?m=system&c=labelPrinting&a=cancelPending",
                type: 'post',
                data: { data: data },
                dataType: 'json',
                success: function(data) {
                    if (data.code == 'ok') {
                        layer.msg(data.msg, {
                            icon: 0,
                            time: 2000
                        });

                        $(".inputTe").css("color", "white");
                        self.isAll = 0;
                        self.nowPage = false;
                        self.allPage = false;
                        grid1.deselectAll();
                        searchALLNow(self, 'F', '');
                    } else {
                        layer.msg(data.msg, {
                            icon: 0,
                            time: 2000
                        });
                    }
                }
            });

        },
        //导出拿货汇总
        toExcel: function() {
            var check_stock = $("#check_stock").val();
            if (check_stock == "1" || check_stock == "2") {
                layer.msg('已挂单或缺货货品不能导出汇总', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }
            var self = this;
            if (self.isClose == "close_1") {
                layer.msg('已关闭标签不能导出', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }
            var data = "";
            var time = new Date().getTime();

            var selectRows = grid1.getSelecteds();
            /*if($("input[name='lab']").filter(':checked').length == 0){
            	layer.msg('请选择至少一条数据',{
            		icon: 0,
            		time: 2000
            	});
            	return false;
            }*/
            if (selectRows.length == 0) {
                layer.msg('请选择至少一条数据', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }

            var date_type = 1;
            if ($("#date_type").val() == 2) {
                date_type = 2;
            }
            var dateBegin = $("#dateBegin").val();
            //开始日期				
            var dateEnd = $("#dateEnd").val();
            //结束日期		
            var tid = "";
            var buyer_nick = "";
            var unique_code = "";
            var explosion_code = "";
            var y_prd_no = "";
            var n_prd_no = "";
            var seller_memo = "";
            if ($("#separator1").val() == "order") {
                tid = $("#order").val();
                //-----订单编号								
                if (tid.substring(tid.length - 1, tid.length) == ",") {
                    //如果为多个拼接，则直接在前台对字符窜进行处理	
                    tid = tid.substring(0, tid.length - 1);
                }
            } else if ($("#separator1").val() == "buyer_nick") {
                //买家昵称					
                buyer_nick = $("#buyer_nick").val();
            } else if ($("#separator1").val() == "unique_code") {
                unique_code = $("#unique_code").val();
                //唯一码	
                if (unique_code.substring(unique_code.length - 1, unique_code.length) == ",") {
                    unique_code = unique_code.substring(0, unique_code.length - 1);
                    //如果为多个拼接，则直接在前台对字符窜进行处理
                }
            } else if ($("#separator1").val() == "seller_memo") {
                seller_memo = $("#seller_memo").val();
                //-----买家昵称
            } else if ($("#separator1").val() == "yy_prd_no") {
                y_prd_no = $("#yy_prd_no").val();
                //-----买家昵称
            } else if ($("#separator1").val() == "explosion_code") {
                explosion_code = $("#explosion_code").val();
                //-----买家昵称
            }
            if ($("#separator2").val() == "y_prd_no" && $("#y_prd_no").val() != '') {
                y_prd_no = $("#y_prd_no").val(); //-----含商家编码			
            } else if ($("#separator2").val() == "n_prd_no") {
                n_prd_no = $("#n_prd_no").val(); //-----不含商家编码		
            }
            var data1 = {
                "print": self.print,
                "drag": self.drag,
                "singleMore": self.singleMore,
                "shopId": self.shopId,
                "clientId": self.clientId,
                "order": self.order,
                "dateBegin": dateBegin,
                "dateEnd": dateEnd,
                "tid": tid,
                "buyer_nick": buyer_nick,
                "unique_code": unique_code,
                "explosion_code": explosion_code,
                "y_prd_no": y_prd_no,
                "n_prd_no": n_prd_no,
                "isClose": self.isClose,
                "seller_memo": seller_memo,
                "have_stock": self.have_stock,
                "check_stock": self.check_stock,
                "remark": self.remark,
                "reloadLast": self.isReloadLast,
                "express": self.express,
                "banner": self.banner,
                "orderStatus": self.orderStatus,
                "sendStatus": self.sendStatus,
                "date_type": date_type,
            };
            console.log(data1);
            if (self.isAll == 0) {
                /*$("input[name='lab']:checkbox").each(function(){
                	if(true == $(this).is(':checked')){
                		data += ($(this).val()+",");
                	}
                	//拼接当前页的货品唯一码
                });*/
                for (var i = 0; i < selectRows.length; i++) {
                    data += selectRows[i]['unique_code'] + ",";
                }
                data = data.substring(0, data.length - 1);
            }
            /**
            var url = "/index.php?m=system&c=labelPrinting&a=toExcel&data="+data+"&data1="+data1+"&time="+time+"&isAll="+self.isAll;
            $("#ifile").attr('src',url);
            */
            $.ajax({
                url: "/index.php?m=system&c=labelPrinting&a=toExcel&loginact=file",
                type: 'post',
                data: { data: data, data1: data1, time: time, isAll: self.isAll },
                dataType: 'text',
                success: function(text) {
                    if (text) {
                        if (check_stock == "") {
                            layer.msg('已挂单或缺货货品不能导出汇总', {
                                icon: 0,
                                time: 2000
                            });
                            return false;
                        }
                    } else {
                        var url = "/xls/WaitSendorders" + time + ".xls?loginact=file";
                        $("#ifile").attr('src', url);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(jqXHR.responseText);
                }
            });

        },
        //导出挂单标签
        out_order: function() {
            var time = new Date().getTime();
            $.ajax({
                url: "/index.php?m=system&c=labelPrinting&a=outorder&loginact=file",
                type: 'post',
                data: { time: time },
                dataType: 'text',
                success: function(text) {
                    if (text) {
                        layer.msg('导出标签失败', {
                            icon: 0,
                            time: 2000
                        });
                        return false;
                    } else {
                        var url = "/xls/WaitSendorders" + time + ".xls?loginact=file";
                        $("#ifile").attr('src', url);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(jqXHR.responseText);
                }
            });

        },
        //导出标签明细
        downUniqueCode: function() {
            var check_stock = $("#check_stock").val();
            if (check_stock == "1" || check_stock == "2") {
                layer.msg('已挂单或缺货货品不能导出汇总', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }
            var self = this;
            if (self.isClose == "close_1") {
                layer.msg('已关闭标签不能导出', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }
            var data = "";
            var time = new Date().getTime();
            var dateBegin = $("#dateBegin").val();
            //开始日期				
            var dateEnd = $("#dateEnd").val();
            //结束日期		
            var tid = "";
            var buyer_nick = "";
            var unique_code = "";
            var explosion_code = "";
            var y_prd_no = "";
            var n_prd_no = "";
            var seller_memo = "";
            if ($("#separator1").val() == "order") {
                tid = $("#order").val();
                //-----订单编号								
                if (tid.substring(tid.length - 1, tid.length) == ",") {
                    //如果为多个拼接，则直接在前台对字符窜进行处理	
                    tid = tid.substring(0, tid.length - 1);
                }
            } else if ($("#separator1").val() == "buyer_nick") {
                //买家昵称					
                buyer_nick = $("#buyer_nick").val();
            } else if ($("#separator1").val() == "unique_code") {
                unique_code = $("#unique_code").val();
                //唯一码	
                if (unique_code.substring(unique_code.length - 1, unique_code.length) == ",") {
                    unique_code = unique_code.substring(0, unique_code.length - 1);
                    //如果为多个拼接，则直接在前台对字符窜进行处理
                }
            } else if ($("#separator1").val() == "seller_memo") {
                seller_memo = $("#seller_memo").val();
                //-----买家昵称
            } else if ($("#separator1").val() == "yy_prd_no") {
                y_prd_no = $("#yy_prd_no").val();
                //-----买家昵称
            } else if ($("#separator1").val() == "explosion_code") {
                explosion_code = $("#explosion_code").val();
                //-----买家昵称
            }
            if ($("#separator2").val() == "y_prd_no" && $("#y_prd_no").val() != '') {
                y_prd_no = $("#y_prd_no").val(); //-----含商家编码			
            } else if ($("#separator2").val() == "n_prd_no") {
                n_prd_no = $("#n_prd_no").val(); //-----不含商家编码		
            }
            var data = {
                "print": self.print,
                "drag": self.drag,
                "singleMore": self.singleMore,
                "shopId": self.shopId,
                "clientId": self.clientId,
                "order": self.order,
                "dateBegin": dateBegin,
                "dateEnd": dateEnd,
                "tid": tid,
                "buyer_nick": buyer_nick,
                "unique_code": unique_code,
                "explosion_code": explosion_code,
                "y_prd_no": y_prd_no,
                "n_prd_no": n_prd_no,
                "isClose": self.isClose,
                "seller_memo": seller_memo,
                "have_stock": self.have_stock,
                "check_stock": self.check_stock,
                "reloadLast": self.isReloadLast,
                "remark": self.remark,
            };
            console.log(data);
            /**
            var url = "/index.php?m=system&c=labelPrinting&a=toExcel&data="+data+"&data1="+data1+"&time="+time+"&isAll="+self.isAll;
            $("#ifile").attr('src',url);
            */
            $.ajax({
                url: "/index.php?m=system&c=labelPrinting&a=downUniqueCode&loginact=file",
                type: 'post',
                data: { data: data, time: time, isAll: 1 },
                dataType: 'text',
                success: function(text) {
                    if (text) {
                        if (check_stock == "") {
                            layer.msg('导出标签失败', {
                                icon: 0,
                                time: 2000
                            });
                            return false;
                        }
                    } else {
                        var url = "/xls/WaitSendorders" + time + ".xls?loginact=file";
                        $("#ifile").attr('src', url);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(jqXHR.responseText);
                }
            });

        },
        printCollectGoods: function() {
            var LODOP = getLodop();
            if (!LODOP.VERSION) {
                layer.alert('当前无lodop插件，请下载插件使用', {
                    icon: 6,
                    yes: function(index) {
                        window.location.href = "http://www.lodop.net/download/Lodop6.222_CLodop3.043.zip";
                        layer.close(index);
                    }
                });
                return false;
            };
            var self = this;
            var selectRows = grid1.getSelecteds();
            //var orderLen = $("input[name='lab']").filter(':checked').length;
            var orderLen = selectRows.length;
            if (orderLen == 0) {
                layer.msg('请选择至少一条数据', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }
            doGetPrinters(function(data) {
                self.layprint = data;
            });
            //$("#layCollectGoods").val(0);//-----初始化选择框
            layer.open({
                type: 1,
                title: '打印拿货汇总',
                skin: 'layui-layer-rim', //加上边框
                area: ['700px', '400px'], //宽高
                shade: 0.3,
                content: $("#table-CollectGoods"),
                btn: ['确定打印'],
                yes: function(index, layero) {
                    //按钮【按钮一】的回调
                    if (self.onOff == true) {
                        self.setCollectGoodsDSOS();
                        self.onOff = false;
                    }
                    setTimeout(function() {
                        self.onOff = true;
                    }, 200);
                }
            });
        },
        setRefreshHaveStock: function(unique_data) {
            var self = this;
            if ($("#layRefreshHaveStock").val() != 0) {
                var unprintname = $("#layRefreshHaveStock").val();
            } else {
                layer.msg('请选择打印机！', {
                    icon: 2,
                    time: 2000
                });
                return
            }
            if ($("#layprintTplRefreshHaveStock").val() != 0) {
                var unprintTplBq = $("#layprintTplRefreshHaveStock").val();
            } else {
                layer.msg('请选择打印机！', {
                    icon: 2,
                    time: 2000
                });
                return
            }
            var data1 = {
                'refreshStock': 1
            };
            var url = "/index.php?m=system&c=labelPrinting&a=printData";
            $.ajax({
                url: url,
                type: 'post',
                data: { data: unique_data, data1: data1, isAll: 0, unprintTplBq: unprintTplBq },
                dataType: 'json',
                async: true,
                success: function(data) {
                    var percent = 0; //进度条初始化									
                    layer.closeAll();
                    $(".sche").css("display", "block"); //进度条窗口显示	
                    var i = 0;
                    //console.log(unprintTplBq);
                    countSecond(i, data, unprintTplBq);

                    function countSecond(i, data, printTplBq) {
                        if (i < data.length) {
                            layui.use('element', function() {
                                var element = layui.element();
                                element.init();
                                //进度条
                                percent += 100 / data.length;
                                percent = Math.ceil(percent);
                                element.progress('demo', percent + '%');
                            });
                            console.log(unprintname);
                            exit;
                            //console.log(data[i]);
                            printTpl[printTplBq](unprintname, data[i]);
                            i = i + 1;
                            setTimeout(function() {
                                countSecond(i, data, printTplBq);
                            }, 1000)
                        } else {
                            $(".sche").css("display", "none"); //进度条窗口关闭
                            self.isAll = 0;
                            searchALLNow(self, 'F', '');
                            layer.msg('打印完成', {
                                icon: 1,
                                time: 2000
                            });
                            //$(".skin-minimal input[name='lab']").iCheck('uncheck');		
                            grid1.deselectAll();
                            $(".inputTe").css("color", "white");
                            self.nowPage = false;
                            self.allPage = false;
                            num(self);
                            return
                        }
                    }
                }
            })
        },
        setCollectGoodsDSOS: function() {
            if ($("#layCollectGoods").val() != 0) {
                var unprintname = $("#layCollectGoods").val();
            } else {
                layer.msg('请选择打印机！', {
                    icon: 2,
                    time: 2000
                });
                return
            }
            var check_stock = $("#check_stock").val();
            if (check_stock == "1" || check_stock == "2") {
                layer.msg('已挂单或缺货货品不能打印汇总', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }
            var self = this;
            if (self.isClose == "close_1") {
                layer.msg('已关闭标签不能打印汇总', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }
            var selectRows = grid1.getSelecteds();
            var data = "";
            //if($("input[name='lab']").filter(':checked').length == 0){
            if (selectRows.length == 0) {
                layer.msg('请选择至少一条数据', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }
            var dateBegin = $("#dateBegin").val();
            //开始日期				
            var dateEnd = $("#dateEnd").val();
            //结束日期		
            var tid = "";
            var buyer_nick = "";
            var unique_code = "";
            var explosion_code = "";
            var y_prd_no = "";
            var n_prd_no = "";
            var seller_memo = "";
            if ($("#separator1").val() == "order") {
                tid = $("#order").val();
                //-----订单编号								
                if (tid.substring(tid.length - 1, tid.length) == ",") {
                    //如果为多个拼接，则直接在前台对字符窜进行处理	
                    tid = tid.substring(0, tid.length - 1);
                }
            } else if ($("#separator1").val() == "buyer_nick") {
                //买家昵称					
                buyer_nick = $("#buyer_nick").val();
            } else if ($("#separator1").val() == "unique_code") {
                unique_code = $("#unique_code").val();
                //唯一码	
                if (unique_code.substring(unique_code.length - 1, unique_code.length) == ",") {
                    unique_code = unique_code.substring(0, unique_code.length - 1);
                    //如果为多个拼接，则直接在前台对字符窜进行处理
                }
            } else if ($("#separator1").val() == "seller_memo") {
                seller_memo = $("#seller_memo").val();
                //-----买家昵称
            } else if ($("#separator1").val() == "yy_prd_no") {
                y_prd_no = $("#yy_prd_no").val();
                //-----买家昵称
            } else if ($("#separator1").val() == "explosion_code") {
                explosion_code = $("#explosion_code").val();
                //-----买家昵称
            }
            if ($("#separator2").val() == "y_prd_no" && $("#y_prd_no").val() != '') {
                y_prd_no = $("#y_prd_no").val(); //-----含商家编码			
            } else if ($("#separator2").val() == "n_prd_no") {
                n_prd_no = $("#n_prd_no").val(); //-----不含商家编码		
            }
            var data1 = {
                "print": self.print,
                "drag": self.drag,
                "singleMore": self.singleMore,
                "shopId": self.shopId,
                "clientId": self.clientId,
                "order": self.order,
                "dateBegin": dateBegin,
                "dateEnd": dateEnd,
                "tid": tid,
                "buyer_nick": buyer_nick,
                "unique_code": unique_code,
                "explosion_code": explosion_code,
                "y_prd_no": y_prd_no,
                "n_prd_no": n_prd_no,
                "isClose": self.isClose,
                "seller_memo": seller_memo,
                "have_stock": self.have_stock,
                "isClose": self.isClose,
                "check_stock": self.check_stock,
                "remark": self.remark,
                "reloadLast": self.isReloadLast,
                "express": self.express,
                "banner": self.banner,
            };
            console.log(data1);
            if (self.isAll == 0) {
                /*$("input[name='lab']:checkbox").each(function(){
                	if(true == $(this).is(':checked')){
                		data += ($(this).val()+",");
                	}
                	//拼接当前页的货品唯一码
                });*/
                for (var i = 0; i < selectRows.length; i++) {
                    data += selectRows[i]['unique_code'] + ",";
                }
                data = data.substring(0, data.length - 1);
            }
            $.ajax({
                url: "/index.php?m=system&c=labelPrinting&a=getCollectGoodsPrint",
                type: 'post',
                data: { data: data, data1: data1, isAll: self.isAll },
                dataType: 'json',
                success: function(data) {
                    if (data) {
                        var percent = 0;
                        //-----进度条初始化
                        layer.closeAll();
                        $(".sche").css("display", "block");
                        //-----进度条窗口显示
                        var i = 0;
                        countSecond(i, data);

                        function countSecond(i, data) {
                            console.log(i);
                            if (i < data.length) {
                                layui.use('element', function() {
                                    var element = layui.element();
                                    element.init(); //进度条
                                    percent += Math.ceil(100 / data.length);
                                    if (percent > 100) {
                                        percent = 100;
                                    }
                                    element.progress('demo', percent + '%');
                                });
                                var printData = [];
                                printData.push(data[i]);
                                //生成一个条形码
                                $.ajax({
                                    url: "/index.php?m=system&c=labelPrinting&a=saveCusCodePrint",
                                    type: 'post',
                                    data: {
                                        data: JSON.stringify(data[i]),
                                    },
                                    dataType: 'json',
                                    success: function(good) {
                                        if (good.code == "ok") {
                                            var cusCode = good.msg;
                                            var cusList = good.datas;
                                            takeGoods(unprintname, cusList, cusCode, (i + 1));
                                        }
                                        //无论成功与失败，都打印下一个拿货单，失败的仅不打印拿货单
                                        //增加拿货单条码 成功后打印下一个
                                        i = i + 1;
                                        setTimeout(function() {
                                            countSecond(i, data);
                                        }, 1000)
                                    }
                                });
                            } else {
                                $(".sche").css("display", "none"); //-----进度条窗口关闭
                                searchALLNow(self, 'page', '');
                                layer.msg('打印完成', {
                                    icon: 1,
                                    time: 2000
                                });
                                return
                            }
                        }
                    }
                    searchALLNow(self, 'page', '');
                    $("input[name='order']").iCheck('uncheck');
                    $(".inputTe").css("color", "white");
                    self.isAll = 0;
                    self.nowPage = false;
                    self.allPage = false;
                },
                error: function() {
                    layer.msg('已挂单或缺货货品不能打印汇总', {
                        icon: 2,
                        time: 2000
                    });
                }
            });
        },
        //关闭标签
        close_label: function() {
            var self = this;
            var selectRows = grid1.getSelecteds();
            //if($("input[name='lab']").filter(':checked').length == 0){				
            if (selectRows.length == 0) {
                layer.msg('至少选择一条数据', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }
            var data = "";
            /*$("input[name='lab']:checkbox").each(function(){
            	if(true == $(this).is(':checked')){
            		data += ($(this).val()+",");				
            	}		
            });	*/
            for (var i = 0; i < selectRows.length; i++) {
                data += selectRows[i]['unique_code'] + ",";
            }
            data = data.substring(0, data.length - 1);
            $.ajax({
                url: "/index.php?m=system&c=labelPrinting&a=close_label",
                type: 'post',
                data: { unique_code: data, isAll: self.isAll, data: self.searchData },
                dataType: 'json',
                success: function(data) {
                    if (data.code == "ok") {
                        layer.msg('操作成功', {
                            icon: 1,
                            time: 2000
                        });
                        //$("input[name='lab']").iCheck('uncheck');
                        grid1.deselectAll();
                        $(".inputTe").css("color", "white");
                        self.isAll = 0;
                        self.nowPage = false;
                        self.allPage = false;
                        searchALLNow(self, 'F', '');
                    }
                }
            });
        },

        //取消关闭
        cancel_close: function() {
            var self = this;
            var selectRows = grid1.getSelecteds();
            //if($("input[name='lab']").filter(':checked').length == 0){				
            if (selectRows.length == 0) {
                layer.msg('至少选择一条数据', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }
            var data = "";
            /*$("input[name='lab']:checkbox").each(function(){
            	if(true == $(this).is(':checked')){
            		data += ($(this).val()+",");				
            	}		
            });*/
            for (var i = 0; i < selectRows.length; i++) {
                data += selectRows[i]['unique_code'] + ",";
            }
            data = data.substring(0, data.length - 1);
            $.ajax({
                url: "/index.php?m=system&c=labelPrinting&a=cancel_close",
                type: 'post',
                data: { unique_code: data, isAll: self.isAll, data: self.searchData },
                dataType: 'json',
                success: function(data) {
                    if (data.code == "ok") {
                        layer.msg('操作成功', {
                            icon: 1,
                            time: 2000
                        });
                        //$("input[name='lab']").iCheck('uncheck');
                        grid1.deselectAll();
                        self.isAll = 0;
                        self.nowPage = false;
                        self.allPage = false;
                        searchALLNow(self, 'F', '');
                    }
                }
            });
        },

        //刷新统计
        refresh: function() {
            var self = this;
            $("#refresh").html("刷新中...");
            $("#refresh").addClass("layui-btn-disabled");
            $("#refresh").removeClass("btn");
            $("#refresh").addClass("btnOnlyStyle");
            searchALLNow(self, 'F', '', function() {
                $("#refresh").html("刷新统计");
                $("#refresh").removeClass("layui-btn-disabled");
                $("#refresh").addClass("btn");
                $("#refresh").removeClass("btnOnlyStyle");
            });
        },
        //导出待配货汇总
        printStockoutCount: function() {
            var self = this;
            var check_stock = $("#check_stock").val();
            if (check_stock == "1" || check_stock == "2") {
                layer.msg('已挂单或缺货货品不能导出汇总', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }
            var self = this;
            if (self.isClose == "close_1") {
                layer.msg('已关闭标签不能导出', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }
            var data = "";
            var time = new Date().getTime();
            var selectRows = grid1.getSelecteds();
            //if($("input[name='lab']").filter(':checked').length == 0){
            if (selectRows.length == 0) {
                layer.msg('请选择至少一条数据', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }
            var dateBegin = $("#dateBegin").val();
            //开始日期				
            var dateEnd = $("#dateEnd").val();
            //结束日期		
            var tid = "";
            var buyer_nick = "";
            var unique_code = "";
            var explosion_code = "";
            var y_prd_no = "";
            var n_prd_no = "";
            var seller_memo = "";
            var date_type = 1;
            if ($("#date_type").val() == 2) {
                date_type = 2;
            }
            if ($("#separator1").val() == "order") {
                tid = $("#order").val();
                //-----订单编号								
                if (tid.substring(tid.length - 1, tid.length) == ",") {
                    //如果为多个拼接，则直接在前台对字符窜进行处理	
                    tid = tid.substring(0, tid.length - 1);
                }
            } else if ($("#separator1").val() == "buyer_nick") {
                //买家昵称					
                buyer_nick = $("#buyer_nick").val();
            } else if ($("#separator1").val() == "unique_code") {
                unique_code = $("#unique_code").val();
                //唯一码	
                if (unique_code.substring(unique_code.length - 1, unique_code.length) == ",") {
                    unique_code = unique_code.substring(0, unique_code.length - 1);
                    //如果为多个拼接，则直接在前台对字符窜进行处理
                }
            } else if ($("#separator1").val() == "seller_memo") {
                seller_memo = $("#seller_memo").val();
                //-----买家昵称
            } else if ($("#separator1").val() == "yy_prd_no") {
                y_prd_no = $("#yy_prd_no").val();
                //-----买家昵称
            } else if ($("#separator1").val() == "explosion_code") {
                explosion_code = $("#explosion_code").val();
                //-----买家昵称
            }
            if ($("#separator2").val() == "y_prd_no" && $("#y_prd_no").val() != '') {
                y_prd_no = $("#y_prd_no").val(); //-----含商家编码			
            } else if ($("#separator2").val() == "n_prd_no") {
                n_prd_no = $("#n_prd_no").val(); //-----不含商家编码		
            }
            var data1 = {
                "print": self.print,
                "drag": self.drag,
                "singleMore": self.singleMore,
                "shopId": self.shopId,
                "clientId": self.clientId,
                "order": self.order,
                "dateBegin": dateBegin,
                "dateEnd": dateEnd,
                "tid": tid,
                "buyer_nick": buyer_nick,
                "unique_code": unique_code,
                "explosion_code": explosion_code,
                "y_prd_no": y_prd_no,
                "n_prd_no": n_prd_no,
                "isClose": self.isClose,
                "seller_memo": seller_memo,
                "have_stock": self.have_stock,
                "check_stock": self.check_stock,
                "remark": self.remark,
                "reloadLast": self.isReloadLast,
                "express": self.express,
                "banner": self.banner,
                "date_type": date_type,
            };
            if (self.isAll == 0) {
                /*$("input[name='lab']:checkbox").each(function(){
                	if(true == $(this).is(':checked')){
                		data += ($(this).val()+",");
                	}
                	//拼接当前页的货品唯一码
                });*/
                for (var i = 0; i < selectRows.length; i++) {
                    data += selectRows[i]['unique_code'] + ",";
                }
                data = data.substring(0, data.length - 1);
            }
            var indexLoad = layer.load();
            $.ajax({
                url: "/index.php?m=system&c=labelPrinting&a=printStockoutCount",
                type: 'post',
                data: {
                    data: data,
                    data1: data1,
                    time: time,
                    isAll: self.isAll
                },
                dataType: 'text',
                success: function(text) {
                    layer.close(indexLoad);
                    $("input[name='order']").iCheck('uncheck');
                    $(".inputTe").css("color", "white");
                    self.isAll = 0;
                    self.nowPage = false;
                    self.allPage = false;
                    if (text) {
                        layer.msg('已挂单或缺货货品不能导出汇总', {
                            icon: 0,
                            time: 2000
                        });
                    } else {
                        var url = "/xls/WaitSendorders" + time + ".xls?loginact=file";
                        $("#ifile").attr('src', url);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    layer.msg('jqXHR.responseText', {
                        icon: 0,
                        time: 2000
                    });
                }
            })
        },
        //导出HTML
        printCollectHTML: function() {
            var check_stock = $("#check_stock").val();
            if (check_stock == "1" || check_stock == "2") {
                layer.msg('已挂单或缺货货品不能导出汇总', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }
            var self = this;
            if (self.isClose == "close_1") {
                layer.msg('已关闭标签不能导出', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }
            var data = "";
            var time = new Date().getTime();
            var selectRows = grid1.getSelecteds();
            //if($("input[name='lab']").filter(':checked').length == 0){
            if (selectRows.length == 0) {
                layer.msg('请选择至少一条数据', {
                    icon: 0,
                    time: 2000
                });
                return false;
            }
            var dateBegin = $("#dateBegin").val();
            //开始日期				
            var dateEnd = $("#dateEnd").val();
            //结束日期		
            var tid = "";
            var buyer_nick = "";
            var unique_code = "";
            var explosion_code = "";
            var y_prd_no = "";
            var n_prd_no = "";
            var seller_memo = "";
            if ($("#separator1").val() == "order") {
                tid = $("#order").val();
                //-----订单编号								
                if (tid.substring(tid.length - 1, tid.length) == ",") {
                    //如果为多个拼接，则直接在前台对字符窜进行处理	
                    tid = tid.substring(0, tid.length - 1);
                }
            } else if ($("#separator1").val() == "buyer_nick") {
                //买家昵称					
                buyer_nick = $("#buyer_nick").val();
            } else if ($("#separator1").val() == "unique_code") {
                unique_code = $("#unique_code").val();
                //唯一码	
                if (unique_code.substring(unique_code.length - 1, unique_code.length) == ",") {
                    unique_code = unique_code.substring(0, unique_code.length - 1);
                    //如果为多个拼接，则直接在前台对字符窜进行处理
                }
            } else if ($("#separator1").val() == "seller_memo") {
                seller_memo = $("#seller_memo").val();
                //-----买家昵称

            } else if ($("#separator1").val() == "yy_prd_no") {
                y_prd_no = $("#yy_prd_no").val();
                //-----买家昵称
            } else if ($("#separator1").val() == "explosion_code") {
                explosion_code = $("#explosion_code").val();
                //-----买家昵称
            }
            if ($("#separator2").val() == "y_prd_no" && $("#y_prd_no").val() != '') {
                y_prd_no = $("#y_prd_no").val(); //-----含商家编码			
            } else if ($("#separator2").val() == "n_prd_no") {
                n_prd_no = $("#n_prd_no").val(); //-----不含商家编码		
            }
            var data1 = {
                "print": self.print,
                "drag": self.drag,
                "singleMore": self.singleMore,
                "shopId": self.shopId,
                "clientId": self.clientId,
                "order": self.order,
                "dateBegin": dateBegin,
                "dateEnd": dateEnd,
                "tid": tid,
                "buyer_nick": buyer_nick,
                "unique_code": unique_code,
                "explosion_code": explosion_code,
                "y_prd_no": y_prd_no,
                "n_prd_no": n_prd_no,
                "isClose": self.isClose,
                "seller_memo": seller_memo,
                "have_stock": self.have_stock,
                "check_stock": self.check_stock,
                "remark": self.remark,
                "reloadLast": self.isReloadLast,
                "express": self.express,
                "banner": self.banner,
            };
            if (self.isAll == 0) {
                /*$("input[name='lab']:checkbox").each(function(){
                	if(true == $(this).is(':checked')){
                		data += ($(this).val()+",");
                	}
                	//拼接当前页的货品唯一码
                });*/
                for (var i = 0; i < selectRows.length; i++) {
                    data += selectRows[i]['unique_code'] + ",";
                }
                data = data.substring(0, data.length - 1);
            }
            $.ajax({
                url: "/index.php?m=system&c=labelPrinting&a=exportTakeHTML",
                type: 'post',
                data: {
                    data: data,
                    data1: data1,
                    time: time,
                    isAll: self.isAll
                },
                dataType: 'text',
                success: function(htmlData) {
                    var htmlData = JSON.parse(htmlData);
                    $("input[name='order']").iCheck('uncheck');
                    $(".inputTe").css("color", "white");
                    self.isAll = 0;
                    self.nowPage = false;
                    self.allPage = false;
                    if (htmlData['data']) {
                        var oHtml = "";
                        //添加页面头部
                        oHtml += '<!DOCTYPE html>';
                        oHtml += '<html>';
                        oHtml += '<head>';
                        oHtml += '<meta charset="UTF-8">';
                        oHtml += '<title>拿货汇总' + time + '</title>';
                        oHtml += '<style type="text/css">';
                        oHtml += '.table{text-align: center;border-collapse:collapse;}';
                        oHtml += '.trHeader{padding:0px;font-family:宋体;font-weight: bold;height:35px; line-height:35px;}';
                        oHtml += '.tdHeader{font-size:16px;background:#ffc;padding:0px 10px;}';
                        oHtml += '.trBody{height:25px; line-height:25px;}';
                        oHtml += '.tdBody{font-size:14px;height:25px;padding:2px 10px;}';
                        oHtml += '.glassImgBig{position:absolute;top:0px;left:100px;display:none;background-repeat:no-repeat;}';
                        oHtml += '</style>';
                        oHtml += '<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>';
                        oHtml += '</head>';
                        oHtml += '<body>';
                        oHtml += '<table class="table" border="1" cellpadding="0" cellspacing="0">';
                        oHtml += '<tr class="trHeader">';
                        var tplData = htmlData['tplData']['data'];
                        var sortData = htmlData['data'];
                        if (htmlData['way'] == '2') {
                            for (var i = 0; i < tplData.length; i++) {
                                if (tplData[i]['selected'] == '1') {
                                    oHtml += '<th class="tdHeader">' + tplData[i]['id'] + '</th>';
                                }
                            }
                            oHtml += '</tr>';
                            for (var m = 0; m < sortData.length; m++) {
                                oHtml += '<tr class="trBody">';
                                for (var n = 0; n < tplData.length; n++) {
                                    switch (tplData[n]['val']) {
                                        case 'cus_no':
                                            if (tplData[n]['selected'] == 1) {
                                                var smallCount = 1;
                                                if (sortData[m]['cus_no_num'] > 1) {
                                                    oHtml += '<td class="tdBody" rowspan=\"' + sortData[m]["cus_no_num"] + '\">' + sortData[m]["cus_no"] + '</td>';
                                                } else if (sortData[m]['cus_no'] != '') {
                                                    oHtml += '<td class="tdBody">' + sortData[m]["cus_no"] + '</td>';
                                                } else if (m == 0) {
                                                    oHtml += '<td class="tdBody">&nbsp;</td>';

                                                }
                                            }
                                            break;
                                        case 'prd_loc':
                                            if (tplData[n]['selected'] == 1) {
                                                if (sortData[m]['prd_loc_num'] > 1) {
                                                    oHtml += '<td class="tdBody" rowspan=\"' + sortData[m]["prd_loc_num"] + '\">' + sortData[m]['prd_loc'] + '</td>';
                                                } else if (sortData[m]['prd_loc'] != '') {
                                                    if (smallCount == 1) {
                                                        if (sortData[m]['prd_loc'] == '总计') {
                                                            oHtml += '<td class="tdBody">&nbsp;</td>';
                                                        } else {
                                                            oHtml += '<td class="tdBody">' + sortData[m]['prd_loc'] + '</td>';
                                                        }
                                                    } else {
                                                        oHtml += '<td class="tdBody">' + sortData[m]['prd_loc'] + '</td>';
                                                    }
                                                    smallCount = 2;
                                                }
                                            }
                                            break;
                                        case 'prd_no':
                                            if (tplData[n]['selected'] == 1) {
                                                if (sortData[m]['prd_no_num'] > 1) {
                                                    oHtml += '<td class="tdBody" rowspan=\"' + sortData[m]['prd_no_num'] + '\">' + sortData[m]['prd_no'] + '</td>';
                                                } else if (sortData[m]['prd_no'] != '') {
                                                    if (smallCount == 1 || smallCount == 2) {
                                                        if (sortData[m]['prd_no'] == '总计') {
                                                            oHtml += '<td class="tdBody">&nbsp;</td>';
                                                        } else {
                                                            oHtml += '<td class="tdBody">' + sortData[m]['prd_no'] + '</td>';
                                                        }
                                                    } else {
                                                        oHtml += '<td class="tdBody">' + sortData[m]['prd_no'] + '</td>';
                                                    }
                                                }
                                            }
                                            break;
                                        case 'title':
                                            if (tplData[n]['selected'] == 1) {
                                                if (sortData[m]['title_num'] > 1) {
                                                    oHtml += '<td class="tdBody" rowspan=\"' + sortData[m]['title_num'] + '\">' + sortData[m]['title'] + '</td>';
                                                } else if (sortData[m]['title'] != '') {
                                                    if (smallCount == 1 || smallCount == 2) {
                                                        if (sortData[m]['title'] == '总计') {
                                                            oHtml += '<td class="tdBody">&nbsp;</td>';
                                                        } else {
                                                            oHtml += '<td class="tdBody">' + sortData[m]['title'] + '</td>';
                                                        }
                                                    } else {
                                                        oHtml += '<td class="tdBody">' + sortData[m]['title'] + '</td>';
                                                    }
                                                }
                                            }
                                            break;
                                        case 'pic_url':
                                            if (tplData[n]['selected'] == 1) {
                                                if (sortData[m]['pic_url_num'] > 1) {
                                                    oHtml += '<td class="tdBody" rowspan=\"' + sortData[m]['pic_url_num'] + '\" style="position: relative;">';
                                                    if (sortData[m]['url'] == '&nbsp;') {
                                                        oHtml += '&nbsp;';
                                                    } else {
                                                        if (sortData[m]['url']) {
                                                            oHtml += '<img class="glassImgSmall" src="' + sortData[m]['url'] + '" width="70" height="70">';
                                                            oHtml += '<img class="glassImgBig" src="' + sortData[m]['url'] + '" width="500" height="500">';
                                                        } else {
                                                            oHtml += '&nbsp;';
                                                        }
                                                    }
                                                    oHtml += '</td>';
                                                } else if (sortData[m]['pic_url'] != '') {
                                                    oHtml += '<td class="tdBody" style="position: relative;">';
                                                    if (sortData[m]['url'] == '&nbsp;') {
                                                        oHtml += '&nbsp;';
                                                    } else {
                                                        if (sortData[m]['url']) {
                                                            oHtml += '<img class="glassImgSmall" src="' + sortData[m]['url'] + '" width="70" height="70">';
                                                            oHtml += '<img class="glassImgBig" src="' + sortData[m]['url'] + '" width="500" height="500">';
                                                        } else {
                                                            oHtml += '&nbsp;';
                                                        }
                                                    }
                                                    oHtml += '</td>';
                                                }
                                            }
                                            break;
                                        case 'sku_name1':
                                            if (tplData[n]['selected'] == 1) {
                                                if (sortData[m]['sku_name1_num'] > 1) {
                                                    oHtml += '<td class="tdBody" rowspan=\"' + sortData[m]['sku_name1_num'] + '\">' + sortData[m]['sku_name1'] + '</td>';
                                                } else if (sortData[m]['sku_name1'] != "") {
                                                    oHtml += '<td class="tdBody">' + sortData[m]['sku_name1'] + '</td>';
                                                }
                                            }
                                            break;
                                        case 'sku_name2':
                                            if (tplData[n]['selected'] == 1) {
                                                oHtml += '<td class="tdBody">' + sortData[m]['sku_name2'] + '</td>';
                                            }
                                            break;
                                        case 'num':
                                            if (tplData[n]['selected'] == 1) {
                                                oHtml += '<td class="tdBody">' + sortData[m]['num'] + '</td>';
                                            }
                                            break;
                                        case 'nums':
                                            if (tplData[n]['selected'] == 1) {
                                                if (sortData[m]['nums_num'] > 1) {
                                                    oHtml += '<td class="tdBody" rowspan=\"' + sortData[m]['nums_num'] + '\">' + sortData[m]['nums'] + '</td>';
                                                } else if (sortData[m]['nums'] != "") {
                                                    oHtml += '<td class="tdBody">' + sortData[m]['nums'] + '</td>';
                                                }
                                            }
                                            break;
                                        case 'price':
                                            if (tplData[n]['selected'] == 1) {
                                                if (sortData[m]['price_num'] > 1) {
                                                    oHtml += '<td class="tdBody" rowspan=\"' + sortData[m]['price_num'] + '\">' + sortData[m]['price'] + '</td>';
                                                } else if (sortData[m]['price'] != "") {
                                                    oHtml += '<td class="tdBody">' + sortData[m]['price'] + '</td>';
                                                }
                                            }
                                            break;
                                        case 'prices':
                                            if (tplData[n]['selected'] == 1) {
                                                if (sortData[m]['prices_num'] > 1) {
                                                    oHtml += '<td class="tdBody" rowspan=\"' + sortData[m]['prices_num'] + '\">' + sortData[m]['prices'] + '</td>';
                                                } else if (sortData[m]['prices'] != "") {
                                                    oHtml += '<td class="tdBody">' + sortData[m]['prices'] + '</td>';
                                                }
                                            }
                                            break;
                                        case 'sort_name':
                                            if (tplData[n]['selected'] == 1) {
                                                if (sortData[m]['prices_num'] > 1) {
                                                    oHtml += '<td class="tdBody" rowspan=\"' + sortData[m]['prices_num'] + '\">' + sortData[m]['sort_name'] + '</td>';
                                                } else if (sortData[m]['sort_name'] != "") {
                                                    oHtml += '<td class="tdBody">' + sortData[m]['sort_name'] + '</td>';
                                                }
                                            }
                                            break;
                                        case 'address':
                                            if (tplData[n]['selected'] == 1) {
                                                if (sortData[m]['prices_num'] > 1) {
                                                    oHtml += '<td class="tdBody" rowspan=\"' + sortData[m]['prices_num'] + '\">' + sortData[m]['address'] + '</td>';
                                                } else if (sortData[m]['address'] != "") {
                                                    oHtml += '<td class="tdBody">' + sortData[m]['address'] + '</td>';
                                                }
                                            }
                                            break;
                                    }
                                }
                                oHtml += '</tr>';
                            }
                            oHtml += '</table>';
                            oHtml += '</body>';
                            oHtml += '<script type="text/javascript">';
                            oHtml += '$(".glassImgSmall").hover(function(){ $(this).parent().find(".glassImgBig").css("display","block");},function(){$(".glassImgBig").css("display","none");})';
                            oHtml += '</script>';
                        } else if (htmlData['way'] == '1') {
                            var dataLen = sortData.length - 1;
                            oHtml += '<tr>';
                            oHtml += '	<td class="tdHeader">档口</td>';
                            oHtml += '	<td class="tdHeader">货位</td>';
                            oHtml += '	<td class="tdHeader">商品编码</td>';
                            oHtml += '	<td class="tdHeader">商品名称</td>';
                            oHtml += '	<td class="tdHeader">图片</td>';
                            oHtml += '	<td class="tdHeader">商品参数</td>';
                            oHtml += '</tr>';

                            var oldSkuId = "";
                            var countNum = 0;
                            var content = "";
                            var oldCusNo = "";
                            var oldPrdNo = "";
                            var oldTitle = "";
                            var oldPrdLoc = "";
                            var oldPicUrl = "";

                            for (var i = 0; i < sortData.length; i++) {
                                if ((sortData[i]['prd_no'] != oldSkuId || sortData[i]['cus_no'] != oldCusNo || sortData[i]['prd_loc'] != oldPrdLoc || sortData[i]['otitle'] != oldTitle) && i != 0) {
                                    oHtml += '<tr>';
                                    oHtml += '<td class="tdBody">' + (oldCusNo ? oldCusNo : '&nbsp;') + '</td>';
                                    oHtml += '<td class="tdBody">' + oldPrdLoc + '</td>';
                                    oHtml += '<td class="tdBody">' + oldPrdNo + '</td>';
                                    oHtml += '<td class="tdBody">' + oldTitle + '</td>';
                                    oHtml += '<td class="tdBody" style="position: relative;">';
                                    oHtml += '<img class="glassImgSmall" src="' + oldPicUrl + '" width="70" height="70">';
                                    oHtml += '<img class="glassImgBig" src="' + oldPicUrl + '" width="500" height="500">';
                                    oHtml += '</td>';
                                    oHtml += '<td class="tdBody">' + content + '</td>';
                                    oHtml += '</tr>';
                                    oldCusNo = sortData[i]['cus_no'];
                                    oldPrdLoc = sortData[i]['prd_loc'] ? sortData[i]['prd_loc'] : "";
                                    oldPrdNo = sortData[i]['prd_no'];
                                    oldTitle = sortData[i]['otitle'];
                                    oldPicUrl = sortData[i]['pic_url'];
                                    if (sortData[i]['sku_name']) {
                                        content = sortData[i]['sku_name'] + '*' + sortData[i]['num'] + '，';
                                    } else {
                                        content = sortData[i]['prd_no'] + '*' + sortData[i]['num'] + '，';
                                    }
                                } else {
                                    oldCusNo = sortData[i]['cus_no'] ? sortData[i]['cus_no'] : "";
                                    oldPrdLoc = sortData[i]['prd_loc'] ? sortData[i]['prd_loc'] : "";
                                    oldPrdNo = sortData[i]['prd_no'];
                                    oldTitle = sortData[i]['otitle'];
                                    oldPicUrl = sortData[i]['pic_url'];
                                    if (sortData[i]['sku_name']) {
                                        content += sortData[i]['sku_name'] + '*' + sortData[i]['num'] + '，';
                                    } else {
                                        content += sortData[i]['prd_no'] + '*' + sortData[i]['num'] + '，';
                                    }
                                }
                                if (dataLen == i) {
                                    oHtml += '<tr>';
                                    oHtml += '<td class="tdBody">' + oldCusNo + '</td>';
                                    oHtml += '<td class="tdBody">' + oldPrdLoc + '</td>';
                                    oHtml += '<td class="tdBody">' + oldPrdNo + '</td>';
                                    oHtml += '<td class="tdBody">' + oldTitle + '</td>';
                                    oHtml += '<td class="tdBody" style="position: relative;">';
                                    oHtml += '<img class="glassImgSmall" src="' + oldPicUrl + '" width="70" height="70">';
                                    oHtml += '<img class="glassImgBig" src="' + oldPicUrl + '" width="500" height="500">';
                                    oHtml += '</td>';
                                    oHtml += '<td class="tdBody">' + content + '</td>';
                                    oHtml += '</tr>';
                                }
                                countNum = countNum + parseInt(sortData[i]['num']);
                                oldSkuId = sortData[i]['prd_no'];
                            }
                            oHtml += '<tr>';
                            oHtml += '<td class="tdBody">总计</td>';
                            oHtml += '<td class="tdBody">&nbsp;</td>';
                            oHtml += '<td class="tdBody">&nbsp;</td>';
                            oHtml += '<td class="tdBody">&nbsp;</td>';
                            oHtml += '<td class="tdBody">' + countNum + '</td>';
                            oHtml += '</tr>';
                            oHtml += '</table>';
                            oHtml += '</body>';
                            oHtml += '<script type="text/javascript">';
                            oHtml += '$(".glassImgSmall").hover(function(){ $(this).parent().find(".glassImgBig").css("display","block");},function(){$(".glassImgBig").css("display","none");})';
                            oHtml += '</script>';
                        }
                        oHtml += '</html>';
                        funDownload(oHtml, '拿货汇总' + time + '.html');
                    } else {
                        layer.msg('已挂单或缺货货品不能导出汇总', {
                            icon: 0,
                            time: 2000
                        });
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(jqXHR.responseText);
                }
            });

            //导出表格封装
            var funDownload = function(content, filename) {
                var eleLink = document.createElement('a');
                eleLink.download = filename;
                eleLink.style.display = 'none';
                // 字符内容转变成blob地址
                var blob = new Blob([content]);
                eleLink.href = URL.createObjectURL(blob);
                // 触发点击
                document.body.appendChild(eleLink);
                eleLink.click();
                // 然后移除
                document.body.removeChild(eleLink);
            };
        },
        printExplosionCode: function() {
            var self = this;
            doGetPrinters(function(data) {
                self.layprint = data;
            });
            self.layprintTplbkBq = printTplBkbq;

            mini.get('explosionPrdNo').setValue('');
            mini.get('explosionCode').setValue('');
            $('#explosionPrintType').val('all');

            grid2.load({});
            layer.open({
                type: 1,
                title: '爆款标签打印',
                skin: 'layui-layer-rim', //加上边框
                area: ['900px', '550px'], //宽高
                shade: 0.3,
                content: $("#printExplosionCodeWindow"),
                btn: ['确定打印', '取消'],
                yes: function(index, layero) {
                    var selectData = grid2.getSelecteds();
                    if (selectData.length == 0) {
                        layer.msg('请先选择一个需要打印的爆款标签', {
                            icon: 0,
                            time: 2000
                        });
                    } else {
                        layer.open({
                            type: 1,
                            title: '爆款标签打印',
                            skin: 'layui-layer-rim', //加上边框
                            area: ['700px', '400px'], //宽高
                            shade: 0.3,
                            content: $("#table-printExplosionCode"),
                            btn: ['确定打印'],
                            yes: function(index, layero) {
                                self.doPrintExplosionCode(selectData);
                            }
                        });

                    }
                }
            });
        },
        shopOnly: function() {
            var self = this;
            self.showshop = !self.showshop;
            var arr = [];
            var name = [];

            $('input[name="shopList"]').each(function() {
                $(this).on('ifChecked ifUnchecked', function(event) {
                    var newArr = [];
                    var nameArr = [];
                    if (event.type == 'ifChecked') {
                        $('input[name="shopList"]').each(function() {
                            if (true == $(this).is(':checked')) {
                                newArr.push($(this).prop("class"));
                                nameArr.push($(this).val());

                            }
                        });

                        arr = newArr;
                        name = nameArr;
                    } else {
                        $('input[name="shopList"]').each(function() {
                            if (true == $(this).is(':checked')) {
                                newArr.push($(this).prop("class"));
                                nameArr.push($(this).val());
                            }
                        });
                        arr = newArr;
                        name = nameArr;
                    }
                    var a = "";
                    var b = "";
                    for (var i = 0; i < arr.length; i++) {
                        a += (arr[i] + ",");
                        b += (name[i] + ",");
                    }
                    a = a.substring(0, a.length - 1);
                    b = b.substring(0, b.length - 1);

                    $("#shop").val(a);
                    $("#shop").attr("name", b);

                    self.shopId = b;
                });
            });
        }
    }
});
//选择店铺
/*function shopChange(a){
	var toggle = event.currentTarget;
	if(toggle.value != "0"){
		flow.shopId = toggle.value;
		$("#searchArr .shop").remove();
		$("#searchArr").append("<span class='add shop rem'>" + a + "<i class='dele' id='specialGroup' onclick='closeNow(\"shop\")'></i></span>");
	}else if(toggle.value == "0"){
		flow.shopId = "";
		$("#searchArr .shop").remove();
	}
	searchALLNow(flow,'F','');
}*/
function clientChange(a) {
    var toggle = event.currentTarget;
    if (toggle.value != "0") {
        flow.clientId = toggle.value;
        $("#searchArr .client").remove();
        $("#searchArr").append("<span class='add client rem'>" + a + "<i class='dele' id='specialGroup' onclick='closeNow(\"client\")'></i></span>");
    } else if (toggle.value == "0") {
        flow.clientId = "";
        $("#searchArr .client").remove();
    }
    searchALLNow(flow, 'F', '');
}

function stockChange(a) {
    var toggle = event.currentTarget;
    if (toggle.value != "") {
        flow.check_stock = toggle.value;
        $("#searchArr .checkStock").remove();
        $("#searchArr").append("<span class='add checkStock rem'>" + a + "<i class='dele' id='specialGroup' onclick='closeNow(\"shop\")'></i></span>");
    } else if (toggle.value == "") {
        flow.check_stock = "";
        $("#searchArr .checkStock").remove();
    }
    searchALLNow(flow, 'F', '');
}

/*function dateTypeChange(a){
	var toggle = event.currentTarget;
		flow.date_type = toggle.value;
		$("#searchArr .date_type").remove();
		$("#searchArr").append("<span class='add date_type rem'>" + a + "<i class='dele' id='specialGroup' onclick='closeNow(\"date\")'></i></span>");
	searchALLNow(flow,'F','');
}*/

//订单编号select框改变时事件
function change(a) {
    $(".changeDiv input").val("");
    if (a == "order") {
        $(".changeDiv").html("<input type='text' class='babyTitle inp' placeholder='多个逗号隔开' id='order' onKeydown='keydownNow()'>");
    } else if (a == "buyer_nick") {
        $(".changeDiv").html("<input type='text' class='babyTitle inp' placeholder='请输入买家昵称' id='buyer_nick' onKeydown='keydownNow()'>");
    } else if (a == "unique_code") {
        $(".changeDiv").html("<input type='text' class='babyTitle inp' placeholder='多个逗号隔开' id='unique_code' onKeydown='keydownNow()'>");
    } else if (a == "explosion_code") {
        $(".changeDiv").html("<input type='text' class='babyTitle inp' placeholder='精确搜索' id='explosion_code' onKeydown='keydownNow()'>");
    } else if (a == "seller_memo") {
        $(".changeDiv").html("<input type='text' class='babyTitle inp' placeholder='模糊搜索' id='seller_memo' onKeydown='keydownNow()'>");
    } else if (a == "yy_prd_no") {
        $(".changeDiv").html("<input type='text' class='babyTitle inp' placeholder='含商品编号' id='yy_prd_no' onKeydown='keydownNow()'>");
    }
}
//订单编号select框改变时事件结束

//是否含商品编号select框改变时事件
function babyChange(a) {
    $(".changeDiv1 input").val("");
    if (a == "y_prd_no") {
        $(".changeDiv1").html("<input type='text' class='babyTitle inp' placeholder='含商品编号' id='y_prd_no' onKeydown='keydownNow()'>");
    } else if (a == "n_prd_no") {
        $(".changeDiv1").html("<input type='text' class='babyTitle inp' placeholder='不含商家编码' id='n_prd_no' onKeydown='keydownNow()'>");
    }
}
//是否含商品编号select框改变时事件结束

function keydownNow() {
    var e = event || window.event;
    if (e.keyCode == 13) {
        searchALLNow(flow, 'F', '');
    }
}

//选择标签删除方法
function closeNow(group) {
    //alert(group);
    if (group == "labelGroup") {
        $("#searchArr .lab").remove();
        flow.print = 2;
        $(".labelGroup div").each(function() {
            $(".labelGroup .ic").remove();
            $(this).removeClass("border");
        });
        $(".labelGroup .all").append("<i class='ic'></i>");
        $(".labelGroup .all").addClass("border");
    } else if (group == "dragGroup") {
        $("#searchArr .dr").remove();
        flow.drag = "";
        $(".dragGroup div").each(function() {
            $(".dragGroup .ic").remove();
            $(this).removeClass("border");
        });
        flow.dragNo = false;
        flow.dragY = false;
    } else if (group == "bannerArr") {
        $("#searchArr .ban span").remove();
        flow.banner = "";
        $(".bannerArr div").each(function() {
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
    } else if (group == "express") {
        $("#searchArr .express").remove();
        $("#express").val(0);
        flow.express = "";
    } else if (group == "singleGroup") {
        $("#searchArr .sin").remove();
        flow.singleMore = "";
        $(".singleGroup div").each(function() {
            $(".singleGroup .ic").remove();
            $(this).removeClass("border");
        });
        flow.single = false;
        flow.more = false;
    } else if (group == "client") {
        $("#searchArr .client").remove();
        $("#client").val(0);
        flow.shopId = "";
    } else if (group == "closeLabel") {
        $(".closeLabel div").each(function() {
            $(".closeLabel .ic").remove();
            $(this).removeClass("border");
        });
        $(".closeLabel .clo_all").append("<i class='ic'></i>");
        $(".closeLabel .clo_all").addClass("border");
        flow.isClose = "cancel";
        $("#searchArr .clos").remove();
    } else if (group == "StockGroup") {
        $("#searchArr .sto").remove();
        flow.have_stock = "";
        $(".StockGroup div").each(function() {
            $(".StockGroup .ic").remove();
            $(this).removeClass("border");
        });
        $(".StockGroup .all").append("<i class='ic'></i>");
        $(".StockGroup .all").addClass("border");
    } else if (group == "order_status") {
        $("#searchArr .order_status").remove();
        $("#order_status").val(0);
        flow.orderStatus = "0";
    } else if (group == "send_status") {
        $("#searchArr .send_status").remove();
        $("#send_status").val(0);
        flow.sendStatus = "0";
    } else if (group == "shop") { //===========
        $("#searchArr .shop").remove(); //===========
        $("#shop").val(""); //===========
        flow.showshop = false;
        $('input[name="shopList"]').each(function() {
            $(this).iCheck('uncheck');
        });
        flow.shopId = ""; //===========
    }

    searchALLNow(flow, 'F', '');
}
//重置方法封装
function resetF(self) {
    $("input").val("");
    $("#shop").val("");
    $("#client").val(0);
    $("#check_stock").val("");
    self.isAll = 0;
    $(".labelGroup div").each(function() {
        $(".labelGroup .ic").remove();
        $(this).removeClass("border");
    });
    $(".labelGroup .all").append("<i class='ic'></i>");
    $(".labelGroup .all").addClass("border");
    $(".dragGroup div").each(function() {
        $(".dragGroup .ic").remove();
        $(this).removeClass("border");
    });
    $(".singleGroup div").each(function() {
        $(".singleGroup .ic").remove();
        $(this).removeClass("border");
    });

    $(".closeLabel div").each(function() {
        $(".closeLabel .ic").remove();
        $(this).removeClass("border");
    });

    $(".conditionGroup div").each(function() {
        $(".conditionGroup .ic").remove();
        $(this).removeClass("border");
    });
    flow.isClose = "cancel";
    $(".closeLabel .clo_all").append("<i class='ic'></i>");
    $(".closeLabel .clo_all").addClass("border");
    $("#separator1").val("order")
    $(".changeDiv").html("<input type='text' class='babyTitle inp' placeholder='多个逗号隔开' id='order' onKeydown='keydownNow()'>");
    $("#separator2").val("y_prd_no")
    $(".changeDiv1").html("<input type='text' class='babyTitle inp' placeholder='含商品编号' id='y_prd_no' onKeydown='keydownNow()'>");

    self.print = 0;
    self.shopId = "";
    self.clientId = "";
    self.check_stock = "";
    self.order = "";
    self.drag = "";
    self.singleMore = "";
    self.single = false;
    self.more = false;
    self.dragNo = false;
    self.dragY = false;

    self.showshop = false;
    $('input[name="shopList"]').each(function() {
        $(this).iCheck('uncheck');
    });

    $(".bannerArr div").each(function() {
        $(".bannerArr .ic").remove();
        $(this).removeClass("border");
    });
    $(".bannerArr .all").append("<i class='ic'></i>");
    $(".bannerArr .all").addClass("border");
    self.express = '';
    self.sendStatus = '';
    self.orderStatus = '';
    //$("input[name='lab']").iCheck('uncheck');		
    grid1.deselectAll();
    $(".inputTe").css("color", "white");
    $("#express").val(0)
    $("#send_status").val(0)
    self.banner = '';
    self.hui = false;
    self.red = false;
    self.yellow = false;
    self.green = false;
    self.blue = false;
    self.pink = false;
    self.isAll = 0;
    self.nowPage = false;
    self.allPage = false;
    self.haveRemark = false;
    self.noRemark = false;
    self.remark = "";
    $("#searchArr .rem").remove();
    //searchALLNow(flow,'F','');
}

//查询方法封装

function syncUniqueCodeData() {
    var indexLoad = layer.load();
    $.ajax({
        url: '/index.php?m=system&c=labelPrinting&a=syncUniqueCodeData',
        type: 'post',
        data: {},
        dataType: 'json',
        success: function(data) {
            layer.close(indexLoad);
            layer.msg('同步标签成功', {
                icon: 1,
                time: 2000
            });
            searchALLNow(flow, 'F', '');
        },
        error: function() {
            layer.close(indexLoad);
        }
    });
}

function chooseDainaUniqueCodeData() {
    var selectRows = grid1.getSelecteds();
    if (selectRows.length == 0) {
        layer.msg('请选择至少一条数据', {
            icon: 0,
            time: 2000
        });
        return false;
    }
    var data = "";
    for (var i = 0; i < selectRows.length; i++) {
        data += selectRows[i]['unique_code'] + ",";
    }
    data = data.substring(0, data.length - 1);
    var indexLoad = layer.load();
    $.ajax({
        url: '/index.php?m=system&c=labelPrinting&a=chooseDainaUniqueCodeData',
        type: 'post',
        data: { data: data },
        dataType: 'json',
        success: function(data) {
            layer.close(indexLoad);
            if (data.code == 'ok') {
                layer.msg(data.msg, {
                    icon: 1,
                    time: 2000
                });
                searchALLNow(flow, 'F', '');
            } else {
                layer.msg(data.msg, {
                    icon: 2,
                    time: 2000
                });
            }
        },
        error: function() {
            layer.close(indexLoad);
        }
    });
}

function syncDainaUniqueCodeData() {
    var indexLoad = layer.load();
    $.ajax({
        url: '/index.php?m=system&c=labelPrinting&a=syncDainaUniqueCodeData',
        type: 'post',
        data: {},
        dataType: 'json',
        success: function(data) {
            layer.close(indexLoad);
            if (data.code == 'ok') {
                layer.msg(data.msg, {
                    icon: 1,
                    time: 2000
                });
                searchALLNow(flow, 'F', '');
            } else {
                layer.msg(data.msg, {
                    icon: 2,
                    time: 2000
                });
            }
        },
        error: function() {
            layer.close(indexLoad);
        }
    });
}

function closeCode(code) {
    $.ajax({
        url: '/index.php?m=system&c=labelPrinting&a=closeCode',
        type: 'post',
        data: { code: code },
        dataType: 'json',
        success: function(data) {
            if (data.code == 'ok') {
                searchExplosionCode();
            } else {
                layer.msg('关闭失败', {
                    icon: 2,
                    time: 2000
                });
            }
        },
    });
}

function searchALLNow(self, page, reloadLast, callback) {
    self.isReloadLast = reloadLast;
    var dateBegin = $("#dateBegin").val(); //-----开始日期						
    var dateEnd = $("#dateEnd").val();
    //-----结束日期			
    var tid = "";
    var buyer_nick = "";
    var unique_code = "";
    var seller_memo = '';
    var y_prd_no = "";
    var n_prd_no = "";
    var explosion_code = "";
    var date_type = 1;
    if (page == "F") {
        self.m = 0;
    }
    if ($("#date_type").val() == 2) {
        var date_type = 2;
    }
    if ($("#separator1").val() == "order") {
        tid = $("#order").val(); //-----订单编号										
        if (tid.substring(tid.length - 1, tid.length) == ",") {
            tid = tid.substring(0, tid.length - 1);
            // 如果为多个拼接，则直接在前台对字符窜进行处理
        }
    } else if ($("#separator1").val() == "buyer_nick") {
        buyer_nick = $("#buyer_nick").val();
        //-----买家昵称
    } else if ($("#separator1").val() == "unique_code") {
        unique_code = $("#unique_code").val();
        //唯一码
        if (unique_code.substring(unique_code.length - 1, unique_code.length) == ",") {
            unique_code = unique_code.substring(0, unique_code.length - 1);
            //如果为多个拼接，则直接在前台对字符窜进行处理		
        }
    } else if ($("#separator1").val() == "seller_memo") {
        seller_memo = $("#seller_memo").val();
        //-----买家昵称	
    } else if ($("#separator1").val() == "yy_prd_no") {
        y_prd_no = $("#yy_prd_no").val();
        //-----买家昵称	
    } else if ($("#separator1").val() == "explosion_code") {
        explosion_code = $("#explosion_code").val();
        //-----买家昵称	
    }

    if ($("#separator2").val() == "y_prd_no" && $("#y_prd_no").val() != '') {
        y_prd_no = $("#y_prd_no").val(); //-----含商家编码												
    } else if ($("#separator2").val() == "n_prd_no") {
        n_prd_no = $("#n_prd_no").val(); //-----不含商家编码		
    }

    if (self.shopId != '') {
        $("#searchArr .shop").remove(); //===========
        $("#searchArr").append("<span class='add shop rem'>" + $("#shop").val() + "<i class='dele' id='specialGroup' onclick='closeNow(\"shop\")'></i></span>");
    }

    self.banner = "";
    if (self.hui) {
        self.banner += (0 + ",");
    }
    if (self.red) {
        self.banner += (1 + ",");
    }
    if (self.yellow) {
        self.banner += (2 + ",");
    }
    if (self.green) {
        self.banner += (3 + ",");
    }
    if (self.blue) {
        self.banner += (4 + ",");
    }
    if (self.pink) {
        self.banner += (5 + ",");
    }
    if (self.banner != "") {
        self.banner = self.banner.substring(0, self.banner.length - 1);
    }
    var data = {
        "print": self.print,
        "drag": self.drag,
        "singleMore": self.singleMore,
        "shopId": self.shopId,
        "clientId": self.clientId,
        "order": self.order,
        "dateBegin": dateBegin,
        "dateEnd": dateEnd,
        "tid": tid,
        "buyer_nick": buyer_nick,
        "unique_code": unique_code,
        "explosion_code": explosion_code,
        "seller_memo": seller_memo,
        "y_prd_no": y_prd_no,
        "n_prd_no": n_prd_no,
        "isClose": self.isClose,
        "have_stock": self.have_stock,
        "check_stock": self.check_stock,
        "remark": self.remark,
        "reloadLast": self.isReloadLast,
        "express": self.express,
        "banner": self.banner,
        "orderStatus": self.orderStatus,
        "sendStatus": self.sendStatus,
        "date_type": date_type,
    };
    self.searchData = data;
    var url = SYNC_UNIQUE_CODE == 'T' ? "/index.php?m=system&c=labelPrinting&a=getSyncData" : "/index.php?m=system&c=labelPrinting&a=getData";

    $.ajax({
        url: url,
        type: 'post',
        data: { data: data, num: self.m },
        dataType: 'json',
        success: function(data) {
            self.isAll = 0;
            self.pageNum = Math.ceil(data.pageNum.num / 200);
            self.productNum = data.pageNum.num;

            grid1.setData(data.data);

            icheckLoad(self);

            self.isFirst = false;
            if (self.pageNum == 0) {
                self.page_m = 0;
            } else {
                self.page_m = self.m + 1;
            }

            //$(".skin-minimal input[name='lab']").iCheck('uncheck');		
            grid1.deselectAll();
            $(".inputTe").css("color", "white");

            self.nowPage = false;
            self.allPage = false;
            num(flow);
            if (callback && typeof(callback) == "function") {
                callback();
            }
        }
    });
}
//取数量
function num(self) {
    var url = SYNC_UNIQUE_CODE == 'T' ? "/index.php?m=system&c=labelPrinting&a=getSyncNum" : "/index.php?m=system&c=labelPrinting&a=getNum";
    $.ajax({
        url: url,
        type: 'post',
        data: {},
        dataType: 'json',
        success: function(data) {
            self.numArr = data;
        }
    });
}

//返回顶部、操作航固定
clearfixFixTop();

function clearfixFixTop() {
    var clearfixClientTop = $("#btnGroupFixed").offset().top;
    var scrollReturnTop = $('<div>', { 'class': 'scrollReturnTop' });
    $("#btnGroupFixed").append(scrollReturnTop);
    $("body").on("click", ".scrollReturnTop", function() {
        $("body,html").stop().animate({ scrollTop: 0 }, 500);
    });
    $(window).scroll(function() {
        var windowScrollTop = $(window).scrollTop();
        if (windowScrollTop > clearfixClientTop + 8) {
            $("#changeFixed").css("display", "block");
            $("#btnGroupFixed").addClass("btnArrFixed");
            $("#btnGroupPageFixed").addClass("btnPageFixed");
        } else if (windowScrollTop < clearfixClientTop) {
            $("#changeFixed").css("display", "none");
            $("#btnGroupFixed").removeClass("btnArrFixed");
            $("#btnGroupPageFixed").removeClass("btnPageFixed");
        }
        if (windowScrollTop > 0) {
            $(".scrollReturnTop").css("display", "block");
        } else {
            $(".scrollReturnTop").css("display", "none");
        }
    });
}

function dianji() {
    $.ajax({
        url: "/index.php?m=system&c=labelPrinting&a=getReportTpl",
        type: 'post',
        data: {},
        dataType: 'json',
        success: function(data) {

        }
    });
}

function icheckLoad(self) {
    $(document).ready(function() {
        $('.skin-minimal input').iCheck({
            checkboxClass: 'icheckbox_minimal',
            radioClass: 'iradio_minimal',
            increaseArea: '20%'
        });
        $('#radio_1').on('ifChecked', function(event) {
            flow.printType = "shopLabel";
            $("#layprintTplBqShopDiv").show();
            $("#layprintTplBqStorageDiv").hide();
        });

        $('#radio_2').on('ifChecked', function(event) {
            flow.printType = "storageLabel";
            $("#layprintTplBqShopDiv").hide();
            $("#layprintTplBqStorageDiv").show();
        });

        $('#radio_3').on('ifChecked', function(event) {
            flow.printType = "allLabel";
            $("#layprintTplBqShopDiv").show();
            $("#layprintTplBqStorageDiv").show();
        });

        /*$('.changeColor').on('ifUnchecked', function(event){																																			
        	if(self.isAll == 1){
        		layer.msg('选择全部页后无法操作单行数据，请选择当前页',{
        			icon: 0,
        			time: 2000
        		});
        		
        		setTimeout(function(){
        			$(event.target).iCheck('check');	
        		},200);
        	}
        });*/
    });
}

function expressChange(a) {
    var toggle = event.currentTarget;
    if (toggle.value != "0") {
        flow.express = toggle.value;
        $("#searchArr .express").remove();
        $("#searchArr").append("<span class='add express rem'>" + a + "<i class='dele' id='specialGroup' onclick='closeNow(\"express\")'></i></span>");
    } else if (toggle.value == "0") {
        flow.express = "";
        $("#searchArr .express").remove();
    }
    searchALLNow(flow, 'page');
}

function sendStatusChange(val) {
    var toggle = event.currentTarget;
    flow.sendStatus = toggle.value;
    if (toggle.value != "0") {
        $("#searchArr .send_status").remove();
        $("#searchArr").append("<span class='add send_status rem'>" + val + "<i class='dele' id='specialGroup' onclick='closeNow(\"send_status\")'></i></span>");
    } else if (toggle.value == "0") {
        flow.sendStatus = "";
        $("#searchArr .send_status").remove();
    }
    searchALLNow(flow, 'page');
}

function orderStatus(val) {
    var toggle = event.currentTarget;
    flow.orderStatus = toggle.value;
    if (toggle.value != "0") {
        $("#searchArr .order_status").remove();
        $("#searchArr").append("<span class='add order_status rem'>" + val + "<i class='dele' id='specialGroup' onclick='closeNow(\"order_status\")'></i></span>");
    } else if (toggle.value == "0") {
        flow.orderStatus = "";
        $("#searchArr .order_status").remove();
    }
    searchALLNow(flow, 'page');
}

function searchExplosionCode() {
    var explosionPrdNo = mini.get('explosionPrdNo').value;
    var explosionCode = mini.get('explosionCode').value;
    var explosionPrintType = $('#explosionPrintType').val();

    grid2.load({ explosionPrdNo: explosionPrdNo, explosionCode: explosionCode, explosionPrintType: explosionPrintType });

}

function getSelectCount() {
    if (flow.isAll == 0) {
        var tidCount = 0;
        var rows = grid1.getSelecteds();
        for (var i = 0; i < rows.length; i++) {
            tidCount++;
        }

        $('#selectOrderNum').html(tidCount);
    } else {
        $('#selectOrderNum').html(flow.productNum);
    }

}