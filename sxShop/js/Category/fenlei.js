


    var conditions = {PageNum: -1, scrollTop: 0, pullable: false};

    $(document).ready(function () {

        $(window).resize(function () {

        });


        var swiper = new Swiper('.page-shadow2', {
            freeMode: true,
            freeModeMomentum: false,
            initialSlide: 0,
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            observer: true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents: true,//修改swiper的父元素时，自动初始化swiper
            slidesPerView: 4,
            spaceBetween: 0,


        })

        var swiper1 = new Swiper('.swiper-containertab', {
            freeMode: true,
            freeModeMomentum: false,
            pagination: '.swiper-pagination',
            paginationClickable: true,
            direction: 'vertical',
            slidesPerView: 10,
            spaceBetween: 0,
            observer: true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents: true,//修改swiper的父元素时，自动初始化swiper
        });
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            direction: 'vertical',
            slidesPerColumn: 4,
            slidesPerView: 16,
            observer: true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents: true,//修改swiper的父元素时，自动初始化swiper
        });
        setTimeout(function () {
            swiper1.update();

        }, 1000);


    })


    mui.ready(function () {

        setTimeout(function () {
            var is_brandcat = $(".brandcatconf").attr('brandcat');
            var yijixs = $(".brandcatconf").attr('yijixs');
            if (yijixs != '') {
                //document.getElementById('catandbrand2').style.display='none';
            }
            if (is_brandcat == '0') {

                if (yijixs == '') {
                    document.getElementById('fenleicat').style.display = 'block';
                    document.getElementById('tabtwo').style.display = 'block';
                    document.getElementById('cattwo').style.display = 'block';
                }


            }

        }, 1000);

        mui.init({
            swipeBack: false, //启用右滑关闭功能
            pullRefresh: {
                container: "#refreshContainer",
                up: {
                    height: 50,//可选.默认50.触发上拉加载拖动距离
                    auto: true,//可选,默认false.自动上拉加载一次
                    contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                    contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                    callback: function () {

                        //console.log("拉一下了")
                        //this.endPullupToRefresh(false);
                        var appElement = document.querySelector('[ng-controller=Controller_cat]');
                        var $scope = angular.element(appElement).scope();
                        $scope.upPullfresh();
                        $scope.$apply();
                    } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                }
            }
        });
        if (window.sessionStorage && window.sessionStorage.PM_Mall_scrollTop) {
            conditions.scrollTop = window.sessionStorage.PM_Mall_scrollTop;
            upPullfresh();
        }

        var scrollTop = 0;
        var scroll = mui('#refreshContainer').pullRefresh();
        document.querySelector('#refreshContainer').addEventListener('scroll', function (e) {
            scrollTop = scroll.y;
            scrollTop < -10 ? $('#goTopBtn').fadeIn() : $('#goTopBtn').fadeOut();
        });
        mui('#offCanvasSideScroll').scroll();
        mui(document).on('tap', '.checkdiv', function (e) {

            $(".tagtextareaall").hide();

        });


        mui(document).on('tap', '.buhuo', function (e) {

            alert('该商品库存不足，无法订购！');
        });
        mui(document).on('tap', '.brandcat_brand', function (e) {

            document.getElementById('brandcat_brand').style.display = 'none';
        });
        mui(document).on('tap', '.brandcat_cat', function (e) {
            document.getElementById('brandcat_cat').style.display = 'none';
        });
        mui(document).on('tap', '.brandcataaaa', function (e) {


            if ($("#brandcat_brand").css("display") == "none") {
                var headerweiapp = document.body.scrollHeight - $("#headerweiapp").height() - 86;

                document.getElementById('brandcat_brand').style.height = headerweiapp + 'px';
                document.getElementById('brandcat_brand').style.display = 'block';

            } else {
                document.getElementById('brandcat_brand').style.display = 'none';
            }
            document.getElementById('brandcat_cat').style.display = 'none';
        });

        mui(document).on('tap', '.brandcat1', function (e) {


            if ($("#containerbrand").css("display") == "none") {
                var headerweiapp = document.body.scrollHeight - $("#headerweiapp").height() - 87;
                var headerweitop = $("#headerweiapp").height();
                document.getElementById('swiper-containerbrand').style.height = headerweiapp + 'px';
                document.getElementById('containerbrand').style.height = headerweiapp + 'px';
                document.getElementById('containerbrand').style.display = 'block';

                document.getElementById('containerbrand').style.top = (headerweitop + 36) + 'px';

            } else {
                document.getElementById('containerbrand').style.display = 'none';
            }
            document.getElementById('containercat').style.display = 'none';
        });

        mui(document).on('tap', '.brandcat2', function (e) {

            if ($("#containercat").css("display") == "none") {
                var headerweiapp = document.body.scrollHeight - $("#headerweiapp").height() - 87;
                var headerweitop = $("#headerweiapp").height();
                document.getElementById('swiper-containercat').style.height = headerweiapp + 'px';
                document.getElementById('containercat').style.height = headerweiapp + 'px';
                document.getElementById('containercat').style.display = 'block';
                document.getElementById('containercat').style.top = (headerweitop + 36) + 'px';
            } else {
                document.getElementById('containercat').style.display = 'none';
            }
            document.getElementById('containerbrand').style.display = 'none';


        });

        mui(document).on('tap', '.brandcat2aaaa', function (e) {
            if ($("#brandcat_cat").css("display") == "none") {
                var headerweiapp = document.body.scrollHeight - $("#headerweiapp").height() - 86;

                document.getElementById('brandcat_cat').style.height = headerweiapp + 'px';
                document.getElementById('brandcat_cat').style.display = 'block';
            } else {
                document.getElementById('brandcat_cat').style.display = 'none';
            }
            document.getElementById('brandcat_brand').style.display = 'none';


        });
        mui(document).on('tap', '.tagtext', function (e) {
            if ($(".tagtextareaall").css("display") == "none") {
                var tagtext = this.getAttribute("tagtext");
                var headertext = this.getAttribute("headertext");
                $(".tagtextarea").html(tagtext);
                $(".tagtextareaheader").html(headertext);

                $(".tagtextareaall").show();
            } else {

                $(".tagtextareaall").hide();
            }

        });
        mui(document).on('tap', '.category-list', function (e) {
            $(this).addClass('leicur');
            var t = this;
            $.each($(".category-list"), function () {
                if (this != t)
                    $(this).removeClass('leicur');
            });
            var appElement = document.querySelector('[ng-controller=Controller_tab]');
            var $scope = angular.element(appElement).scope();
            var id = this.getAttribute("id");
            $scope.showTab(id);
            $scope.$apply();
        });
        mui(document).on('tap', '.page-seach', function (e) {


            $(this).addClass('cur');

            var appElement = document.querySelector('[ng-controller=Controller_seach]');
            var $scope = angular.element(appElement).scope();
            var keywords = $('#keyword').val();


            if (!indexedDBS) {

                lib.insert("ecs_keywords", {keywords: keywords, search: "0", user_id: "", last_update: ""});
                lib.commit();
                document.body.removeChild(docEle('searchDiv'));


                $scope.seach(keywords);
                $scope.$apply();
            } else {

                jqdb.ecs_keywords.filter(function (row) {
                    return row.keywords == keywords
                })
                    .toArray(function (keywordsrow) {

                        if (keywordsrow.length == 0) {

                            var adds = [];
                            adds.push({keywords: keywords, search: '0', user_id: '', last_update: ''})
                            jqdb.ecs_keywords.bulkPut(adds)

                        }

                        $scope.seach(keywords);
                        $scope.$apply();
                        document.body.removeChild(docEle('searchDiv'));
                    })
            }


        });
        mui(document).on('tap', '.page-shadowy', function (e) {
            $(this).addClass('cur');
            var t = this;
            $.each($(".page-shadowy"), function () {
                if (this != t)
                    $(this).removeClass('cur');
            });
            var appElement = document.querySelector('[ng-controller=Controller_yj]');
            var $scope = angular.element(appElement).scope();
            var id = this.getAttribute("id");

            $scope.showYiJi(id);
            $scope.$apply();
        });
        mui(document).on('tap', '.page-shadowp', function (e) {
            $(this).addClass('cur');
            var t = this;
            $.each($(".page-shadowp"), function () {
                if (this != t)
                    $(this).removeClass('cur');
            });
            var appElement = document.querySelector('[ng-controller=Controller_pp]');
            var $scope = angular.element(appElement).scope();
            var id = this.getAttribute("id");
            $scope.showPin(id);
            $scope.$apply();

        });
        mui(document).on('tap', '.page-shadowy1', function (e) {
            $(this).addClass('cur1');
            var t = this;
            $.each($(".page-shadowy1"), function () {
                if (this != t)
                    $(this).removeClass('cur1');
            });
            var appElement = document.querySelector('[ng-controller=Controller_yj]');
            var $scope = angular.element(appElement).scope();
            var id = this.getAttribute("id");
            document.getElementById('brandcat_cat').style.display = 'none';
            $scope.showYiJi(id);
            $scope.$apply();
        });
        mui(document).on('tap', '.page-shadowy2', function (e) {
            $(this).addClass('cur');
            var t = this;
            $.each($(".page-shadowy2"), function () {
                if (this != t)
                    $(this).removeClass('cur');
            });
            var appElement = document.querySelector('[ng-controller=Controller_yj]');
            var $scope = angular.element(appElement).scope();
            var id = this.getAttribute("id");
            document.getElementById('containercat').style.display = 'none';
            $scope.showYiJi(id);
            $scope.$apply();
        });

        mui(document).on('tap', '.page-shadowp1', function (e) {
            $(this).addClass('cur1');
            var t = this;
            $.each($(".page-shadowp1"), function () {
                if (this != t)
                    $(this).removeClass('cur1');
            });
            var appElement = document.querySelector('[ng-controller=Controller_pp]');
            var $scope = angular.element(appElement).scope();
            var id = this.getAttribute("id");
            document.getElementById('brandcat_brand').style.display = 'none';
            $scope.showPin(id);
            $scope.$apply();
        });

        mui(document).on('tap', '.page-shadowp2', function (e) {
            $(this).addClass('cur');
            var t = this;
            $.each($(".page-shadowp2"), function () {
                if (this != t)
                    $(this).removeClass('cur');
            });
            var appElement = document.querySelector('[ng-controller=Controller_pp]');
            var $scope = angular.element(appElement).scope();
            var id = this.getAttribute("id");
            document.getElementById('containerbrand').style.display = 'none';
            $scope.showPin(id);
            $scope.$apply();
        });
        mui(document).on('tap', '.lijionclink', function (e) {

            var id = this.getAttribute("id");

            addToCart(id);
        });
        mui(document).on('tap', '.jianclink', function (e) {
            var hiddenid = $(this);
            var hiddenid1 = $(this).next();

            addToCart_jian(this);
        });
        mui(document).on('tap', '.jiaclink', function (e) {

            if ($(this).attr('xian') != 0) {
                var hiddenid = $(this);
                var hiddenid1 = $(this).prev();
                var hiddenid2 = $(hiddenid1).prev();


                if ($(hiddenid1).css("display") == "none") {

                    $(hiddenid).css("margin-left", "0px");
                    $(hiddenid1).show();
                    $(hiddenid2).show();
                }
            }


            addToCart_jia(this);
        });
        mui(document).on('tap', '.clearall', function (e) {
            localStorage.removeItem("db_library")
            storage_local.removeAll()
            jqdb.delete()
        });
        mui(document).on('tap', '.pushdata', function (e) {
            location.reload();
        });
        mui(document).on('tap', '.catandbrand1', function (e) {
            var sbtitle = document.getElementById('pinpaibrand');
            var tabone = document.getElementById('tabone');
            var catone = document.getElementById('catone');
            if (sbtitle) {
                if (sbtitle.style.display == 'block') {
                    sbtitle.style.display = 'none';
                    tabone.style.display = 'none';
                    catone.style.display = 'none';

                    $('#swiper-container').height($('#swiper-container').height() + 29);
                    $('#swiper-wrapper').height($('#swiper-container').height() + 29);
                } else {
                    sbtitle.style.display = 'block';
                    tabone.style.display = 'block';
                    catone.style.display = 'block';
                    $('#swiper-container').height($('#swiper-container').height() - 29);
                    $('#swiper-wrapper').height($('#swiper-container').height() - 29);
                }

            }
        });
        mui(document).on('tap', '.catandbrand2', function (e) {
            var sbtitle = document.getElementById('fenleicat');
            var tabtwo = document.getElementById('tabtwo');
            var cattwo = document.getElementById('cattwo');
            if (sbtitle) {
                if (sbtitle.style.display == 'block') {
                    sbtitle.style.display = 'none';
                    tabtwo.style.display = 'none';
                    cattwo.style.display = 'none';
                    $('#swiper-container').height($('#swiper-container').height() + 29);
                    $('#swiper-wrapper').height($('#swiper-container').height() + 29);
                } else {
                    sbtitle.style.display = 'block';
                    tabtwo.style.display = 'block';
                    cattwo.style.display = 'block';
                    $('#swiper-container').height($('#swiper-container').height() - 29);
                    $('#swiper-wrapper').height($('#swiper-container').height() - 29);
                }

            }
        });
//		mui(document).on('tap', '.searchclink', function (e) {
//		var name = $("#searchid").val();
//        var url = "goodsList.php?goods_name_search=" + name;
//        window.parent.location.href = url;
//        });
        //当前位置
        mui(".mui-row").on('tap', '.restDefaultAddress', function () {
            mui.openWindow($(this).attr("href"));
        });
////
        //选择位置
        mui("#MyLocation").on('tap', '.Locations', function () {
            mui.openWindow("/PM_Mall/Index?Latitude=" + $(this).attr("Latitude") + "&Longitude=" + $(this).attr("Longitude")
                + "&Address=" + $(this).attr("Address") + "&City=" + $(this).attr("City"));
        });

        mui(document).on('tap', 'a.clickopenwindow', function () {
            conditions.PageNum = $("#refreshUl").find(".refresh_li_e:last").attr("PageNum");
            if (window.sessionStorage) {
                sessionStorage.PM_Mall_scrollTop = scrollTop;
                sessionStorage.PM_Containerdata = $('#refreshUl').html();
            }
            mui.openWindow($(this).attr("href"));
        });

        mui(document).on('tap', 'a.clickopenwindownav', function () {
            mui.openWindow($(this).attr("href"));
        });

        mui("#one").on('tap', '#close', function () {
            $('#one').css('display', 'none');
        });

        $.each($(".imgContainer"), function () {
            $(this).css("height", $(this).width());
        });

        mui(document).on('tap', '#goTopBtn', function () {

            mui("#refreshContainer").pullRefresh().scrollTo(0, 0);
        });

        mui(document).on('tap', '.collect', function () {

            if (indexedDBS) {

                var goods_id = $(this).attr('goodsid')


                jqdb.allproduct.update($(this).attr('goodsid'), {collect_goods: 1}).then(function (updated) {

                    $("#collect" + goods_id).hide();
                    $("#collectyes" + goods_id).show();
                });
            } else {
                lib.update("allproduct", {collect_goods: 1}, function (row) {
                    row.goods_id = $(this).attr('goodsid');
                    $("#collect" + goods_id).hide();
                    $("#collectyes" + goods_id).show();

                });
            }

            collect($(this).attr("goodsid"));
        });
        mui(document).on('tap', '.collect1yes', function () {
            var goods_id = $(this).attr('goodsid')

            if (indexedDBS) {
                jqdb.allproduct.update($(this).attr('goodsid'), {collect_goods: ''}).then(function (updated) {

                    $("#collectyes" + goods_id).hide();
                    $("#collect" + goods_id).show();
                });
            } else {
                lib.update("allproduct", {collect_goods: ''}, function (row) {
                    row.goods_id = $(this).attr('goodsid');
                    $("#collectyes" + goods_id).hide();
                    $("#collect" + goods_id).show();

                });
            }

            collectyes($(this).attr("goodsid"));
        });

    });



	$(document).ready(function() {

		$('#swiper-container').height($(window).height() - 98);
		$('#swiper-wrapper').height($(window).height() - 98);

		$("#brandcat_cat").height(300);
		if(storage_local.isSet("conf")) {
			if(storage_local.get('conf.is_pinpai') == 0) {}
		}

	}) <
