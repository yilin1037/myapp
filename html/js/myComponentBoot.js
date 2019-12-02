
var bootPathParam = __CreateJSParam("myComponentBoot.js");
var myComponentUse = bootPathParam['use'].split(",");
//使用组件
function useComponent(componentName){
    switch(componentName){
        case 'menu':
            //菜单组件
            //document.write('<script src="js/component/menu.js" type="text/javascript" ></script>');
            //document.write('<link href="css/component/menu.css" rel="stylesheet" type="text/css" />');
        break;
    }
}
for(var i in myComponentUse){
    useComponent(myComponentUse[i]);
}