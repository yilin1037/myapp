var vueObj = new Vue({
    el: '#app',
    data: {
        dateBegin: '',
        dateEnd: '',
        expressList: [],
    },
    mounted: function() {
        var self = this;
        var tempjson = new Array();
        var jqtb;
        //layui 模块 入口

        var columns = [
            [ //标题栏
                { field: 'index', width: 80, title: '序号', "width": 60, fixed: true }
            ]
        ];
        columns[0].push({ field: 'adddate', title: '日期', "width": 120 });
        columns[0].push({ field: 'accountSum', title: '发货账号数量', "width": 120 });

        //console.log(paramObject.expressObj);
        for (var i = 0; i < paramObject.expressObj.length; i++) {
            columns[0].push({ field: paramObject.expressObj[i].express_form + '_' + paramObject.expressObj[i].express_type + 'Sum', title: paramObject.expressObj[i].name, "width": 120 });
        }
        columns[0].push({ field: 'orderSum', title: '面单数量', "width": 120 });
        columns[0].push({ field: 'moneySum', title: '扣费金额', "width": 120 });

        $(document).ready(function() {
            layui.use(['table', 'element', 'layer', 'form', 'laydate'], function() {
                var table = layui.table,
                    element = layui.element,
                    layer = layui.layer,
                    form = layui.form;
                var laydate = layui.laydate;
                //时间选择器
                laydate.render({
                    elem: '#dateBegin',
                    type: 'date',
                    done: function(value, date, endDate) {
                        self.dateBegin = value;
                    }
                });

                laydate.render({
                    elem: '#dateEnd',
                    type: 'date',
                    done: function(value, date, endDate) {
                        self.dateEnd = value;
                    }
                });

                var tab = table.render({
                    elem: '#LAY_table_user',
                    url: 'index.php?m=report&c=sendOrderDetail&a=summaryShippingTable',
                    cols: columns,
                    id: 'testReload',
                    page: true,
                    limit: 20 //每页默认显示的数量
                        ,
                    height: 'full-145'
                });

                var $ = layui.$,
                    active = {
                        reload: function() {
                            tab.reload({
                                where: {
                                    dateBegin: self.dateBegin,
                                    dateEnd: self.dateEnd,
                                    expressName: self.expressName,
                                }
                            });
                        }
                    };

                $('#submitSearch').on('click', function() {
                    var type = $(this).data('type');
                    self.expressName = $("#expressName").val();
                    active[type] ? active[type].call(this) : '';
                });

                $('.key_search').on('keydown', function() {
                    var e = event || window.event;
                    if (e.keyCode == 13) {
                        var type = $(this).data('type');

                        active[type] ? active[type].call(this) : '';
                    }
                });
            });
        });
        $.ajax({
            url: '/?m=report&c=sendOrderDetail&a=getexpress',
            dataType: 'json',
            type: "post",
            data: {},
            success: function(data) {
                vueObj.expressList = data;
            }
        })
    },
    methods: {
        resetNow: function() {
            var self = this;
            $("#dateBegin").html("");
            $("#dateEnd").html("");
            $("#expressName").html("");
            self.dateBegin = "";
            self.dateEnd = "";
            $("#expressName").val("");
        },
        ToExcel: function() {
            var self = this;
            var dateBegin = self.dateBegin;
            var dateEnd = self.dateEnd;
            var expressName = $("#expressName").val();
            var url = "?m=report&c=sendOrderDetail&a=outputExcel&dateBegin=" + dateBegin + "&dateEnd=" + dateEnd + "&expressName=" + expressName;
            $("#ifile").attr('src', url);
        }
    }
});