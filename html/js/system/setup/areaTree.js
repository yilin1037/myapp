mini.parse();
        
var tree = mini.get("tree2");

function ok(){
	CloseWindow("ok");
}     

function SetLook(data){
	SetData(data);
	$('.ac-btn').hide();
}

function GetData() {
	var value = tree.getValue(true);
	return value;
}

function SetData(data){
	if($.trim(data) != ""){
		tree.setValue(data,false);
	} 
}

function onBeforeNodeCheck(e) {
	var tree = e.sender;
	var node = e.node;
	if (tree.hasChildren(node)) {
		//e.cancel = true;
	}
}
function onBeforeTreeLoad(e) {
	var tree = e.sender;    //树控件
	var node = e.node;      //当前节点
	var params = e.params;  //参数对象
	
	//可以传递自定义的属性
	params.myField = "123"; //后台：request对象获取"myField"
}

function CloseWindow(action) {
	if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
	else window.close();            
}

function checkALL(){
	var tree = mini.get("tree2");
	var nodes = tree.getAllChildNodes(tree.getRootNode());
	tree.checkNodes(nodes);
}

function uncheckALL(){
	var tree = mini.get("tree2");
	var nodes = tree.getAllChildNodes(tree.getRootNode());
	tree.uncheckNodes(nodes);
}