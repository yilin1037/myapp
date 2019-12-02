if (!window.UserControl) window.UserControl = {};

UserControl.MenuButton = function () {
    UserControl.MenuButton.superclass.constructor.call(this);
    this.initComponents();
    this.bindEvents();
}

mini.extend(UserControl.MenuButton, mini.MenuButton, {
    uiCls: 'uc-menubutton',
    hclass:'',
    hname:'',
    htext:'',
    initComponents: function () {
    },
    bindEvents: function () {
        var t = this;
        var el = this.getEl();
        var menuTimeout;
        $(el).mouseenter(function () {
            this.click();
            var menu = t.menu;
            var menuId = menu['id'];
            $("#"+menuId).unbind("mouseenter").mouseenter(function () {
                if (menuTimeout) {
                    clearTimeout(menuTimeout);
                }
            }).unbind("mouseleave").mouseleave(function () {
                var menu = t.menu;
                menu.hide();
            });
        }).mouseleave(function () {
            menuTimeout = setTimeout(function() {
                var menu = t.menu;
                menu.hide();
            },10);
        });
    }
});
mini.regClass(UserControl.MenuButton, "columnsdatafrid");