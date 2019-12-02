var vueObj = new Vue({
    el: '#app',
    data: {
        prdtItems: [],
    },
    mounted: function () {
        layui.use('element', function(){
            var $ = layui.jquery
            ,element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: '销售分析'
                },
                tooltip: {},
                legend: {
                    data:[]
                },
                xAxis: {
                    data: []
                },
                yAxis: {},
                series: []
            };
            myChart.setOption(option, true);
            loadReport('thisM');
            $("#reportType").find('li').on('click',function(){
                loadReport($(this).attr('lay-id'));
            });
            function loadReport(type){
                myChart.showLoading();
                execAjax({
                    m:'report',
                    c:'salesAnalysis',
                    a:'salesAnalysisReportData',
                    data:{type:type},
                    success:function(data){
                        myChart.hideLoading();
                        myChart.setOption({
                            legend: {
                                data:['销售额']
                            },
                            xAxis: {
                                data: data['Chart']['dataName']
                            },
                            series: [{
                                // 根据名字对应到相应的系列
                                name: '销售额',
                                type: 'bar',
                                data: data['Chart']['dataMoney']
                            }]
                        });
                        vueObj.prdtItems = data['Sale'];
                    }
                });
            }
        });
    },
    methods: {
        
    }
});