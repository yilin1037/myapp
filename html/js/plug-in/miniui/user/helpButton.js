if (!window.UserControl) window.UserControl = {};

UserControl.HelpButton = function () {
    UserControl.HelpButton.superclass.constructor.call(this);
    this.initComponents();
    this.bindEvents();
}

mini.extend(UserControl.HelpButton, mini.Button, {
    uiCls: 'uc-helpbutton',
    hclass:'',
    hname:'',
    htext:'',
    initComponents: function () {
        this.set({
            plain:'true',
            iconCls:'icon-help',
            img:'/images/help.png'
        });
    },
    bindEvents: function () {
        this.on('click', function (e) {
            if($(window).data("MSSQL_DB") == 'M31'){
                var helpPrompt = mini.prompt("请输入帮助内容：", "请输入",
                    function (action, value) {
                        if (action == "ok") {
                            $.ajax({
                                url: "/core.php?f=diy&m=bill&c=help&a=setHelp",
                                data:{hclass:e.sender.hclass,hname:e.sender.hname,text:value}
                            });
                        }
                    },
                    true
                );
                $("#"+helpPrompt).find("textarea").text(e.sender.htext);
            }
        });
    },
    _setId : function (){
        if(this.hclass && this.hname){
            this.setId(this.hclass+'_'+this.hname);
        } 
    },
    setHclass: function (value) {
        this.hclass = value;
        this._setId();
    },
    setHname: function (value) {
        this.hname = value;
        this._setId();
    },
    getAttrs: function (el) {
        var attrs = UserControl.HelpButton.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs,
            ["hclass","hname"]
        );
        return attrs;
    }
});
mini.regClass(UserControl.HelpButton, "columnsdatafrid");
function loadHelpToolTip(){
    setTimeout(function(){
        var tip = new mini.ToolTip();
        tip.set({
            target: document,
            selector: '.uc-helpbutton',
            placement: 'bottomleft',
            cls: 'helpTip',
            onbeforeopen: function (e) {
                e.cancel = false;
            },
            onopen: function (e) {
                var el = e.element;
                var id = $(el).attr("id");
                var helpObject = mini.get(id);
                if(helpObject){
                    this.showLoading();
                    $.ajax({
                        url: "/core.php?f=diy&m=bill&c=help&a=view",
                        data:{hclass:helpObject.hclass,hname:helpObject.hname},
                        type: "post",
                        dataType: "json",
                        success: function (data) {
                            helpObject.htext = data['text'];
                            tip.setContent('<strong>'+data['text']+'</strong>');
                        }
                    });
                }
            }
        });
    }, 500);
}