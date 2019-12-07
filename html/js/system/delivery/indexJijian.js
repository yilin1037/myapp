var tabShow = {};
var iframeArr = [];
window.setInterval("refreshIframe()", 200);
layui.use('element', function(){
    var $ = layui.jquery,element = layui.element(); //Tab的切换功能，切换事件监听等，需要依赖element模块
    tabChange(0);
    element.on('tab(tab)', function(elem){
        tabChange(elem.index);
    });
    function tabChange(index){
        if(tabShow[index]){
            return;
        }
		
        tabShow[index] = 1;
        mainHeight = window.innerHeight-56;
        var tabContent = $(".layui-tab-content .layui-tab-item:eq("+index+")");
        var tabContentUrl = tabContent.attr('data-url');
        var iframe = '<iframe id="iframe'+index+'" src="' + tabContentUrl + '" style="height:' + mainHeight + 'px;"></iframe>';
		iframeArr[index] = "iframe"+index;
		console.log(iframeArr[index])
        tabContent.html(iframe);
    }
});

function refreshIframe()
{
	var nowHeight = window.innerHeight-56;
	if(mainHeight != nowHeight)
	{
		for (i=0; i<iframeArr.length; i++)
		{
			var obj = $('#'+iframeArr[i]);
			if(obj)
			{
				obj.height(nowHeight);	
			}
		}	
	}
	mainHeight = nowHeight;
}