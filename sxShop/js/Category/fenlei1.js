(function (angular) {
    'use strict';
    angular.module('category', [])
        .controller('ControllerSea', ['$scope', function ($scope) {
            $scope.sea = {};
        }])
        .controller('Controller_cont', ['$scope', '$http', '$templateCache', '$sce',
            function ($scope, $http, $templateCache, $localStorage, $sessionStorage, $window) {
                //on 接收 完直接向下级传$broadcast
                storage_session.removeAll();
                lscat.removeAll();

                $scope.Ta = '0';
                $scope.Pi = '0';
                $scope.Yj = '0';
                $scope.keywords = '0';
                $scope.pagesize = 20;


                $scope.pagination = function (count, page) {
                    if (count > 0) {

                        storage_session.set('cur' + $scope.Pi + '_' + $scope.Yj + '_' + $scope.Ta, page);
                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                    } else {
                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                    }
                }
                $scope.getUrlParam = function (name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]); return null;
                }
                $scope.getserverdata = function (page,MyCat) {

                    if (!page)
                    {
                        page=1;
                    }
                    storage_session.set('cur' + $scope.Pi + '_' + $scope.Yj + '_' + $scope.Ta, page);
                    mui('#refreshContainer').pullRefresh().refresh(true);////很重要
                    //nickname=0;

                    var shadowy2 = $scope.getUrlParam('page-shadowy2');
                    var shadowy1 = $scope.getUrlParam('page-shadowy1');
                    if(shadowy2 && $scope.Yj=='0'){
                        $scope.Yj=shadowy2;
                        shadowy2=-1;
                    }
                    if(shadowy1 && $scope.Pi=='0'){
                        $scope.Pi=shadowy1;
                        shadowy1=-1;
                    }
                    if(storage_local.isSet("ecs_users")){
                        if(storage_local.get("ecs_users").length>0){
                            nickname=storage_local.get("ecs_users");
                        }
                    }
                    if(nickname==0)
                    {
                        window.location ='index.php';
                        return false;
                    }

                    $.ajax({
                            url: 'categoryList2.php?act=getpinpai&endDate=0&nickname='+nickname+'&page='+page+'&Pi='+$scope.Pi+'&Yj='+$scope.Yj+'&Ta='+$scope.Ta+'&keywords='+$scope.keywords,
                        type: 'POST',
                        async: true,
                        timeout: 200000,
                        dataType: 'json',

                        beforeSend: function () {
                            // $('.waiting').show();
                        },
                        complete: function (data) {

                            //jqdb.delete()
                            // $('.waiting').html('身份确认中jqdb'+nickname+'....');
                        },
                        success: function (data, textStatus, jqXHR) {

                            //$('.waiting').html('身份确认中.......');

                            if( ($scope.Ta == '0' && $scope.keywords == '0' && page==1 && $scope.Pi == '0' && $scope.Yj == '0') || shadowy1==-1 || shadowy2==-1)  {

                                storage_local.set("conf", data.conf);
                                storage_local.set("users", data.ecs_users);
                                storage_local.set("endDate", data.endDate);
                                storage_local.set("B2B2C", data.B2B2C);
                                storage_local.set("position", data.position);
                                storage_local.set("USER_CHECK_STATE", data.USER_CHECK_STATE);

                                $scope.$broadcast('conf', storage_local.get("conf"));
                                $scope.conf = storage_local.get("conf");

                                    $scope.$broadcast('MyYiJi', data.YiJi);
                                    $scope.$broadcast('MyPin', data.pinpai);
                                    $scope.$broadcast('MyTab', data.smallcate);


                                if (!indexedDBS) {
                                    websql_chuli(data.pinpai, 'pinpai')
                                    websql_chuli(data.YiJi, 'YiJi', 'YiJi')
                                    websql_chuli(data.smallcate, 'smallcate')
                                    websql_chuli(data.ecs_touch_shop_config, 'ecs_touch_shop_config')
                                    websql_chuli(data.ecs_keywords, 'ecs_keywords')
                                }else{
                                    jqdb.YiJi.bulkPut(data.YiJi)
                                    jqdb.smallcate.bulkPut(data.smallcate)
                                    jqdb.pinpai.bulkPut(data.pinpai)
                                    jqdb.ecs_touch_shop_config.bulkPut(data.ecs_touch_shop_config)
                                    jqdb.ecs_keywords.bulkPut(data.ecs_keywords)
                                }

                            }
                           // alert(111);
                            $scope.pagination(data.count, page)
                            $scope.$broadcast(MyCat, data.allproduct);

                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {

                            setTimeout(function () {
                                $('.waiting').html('身份确认失败准备跳转....');
                                window.location ='index.php';

                            },1000)

                        }
                    })
                }
                $scope.getpin_pp = function (page, MyCat) {
                    $scope.getserverdata(page,MyCat);
                }


                $scope.$on("PinEvent", function (event, msg) {

                    $scope.Ta = 0;
                    $scope.Yj = 0;
                    $scope.Pi = msg;
                    storage_session.set('cur' + $scope.Pi + '_' + $scope.Yj + '_' + $scope.Ta, 1)
                    if (!indexedDBS) {

                        var contacts = lib.queryAll('YiJi', {sort: [["sort_order", "ASC"]]});
                        var obj = {cat_id: 0, name: "全部分类"};
                        contacts.splice(0, 0, obj);
                        $scope.$broadcast('MyYiJi', contacts);

                        var contacts = lib.queryAll('smallcate', {sort: [["sort_order", "ASC"]]});
                        $scope.$broadcast('MyTab', contacts);

                        storage_session.set('cur' + $scope.Pi + '_' + $scope.Yj + '_' + $scope.Ta, 1)
                        $scope.getpin_pp(1, 'MyCat')
                    } else {
                        jqdb.YiJi.orderBy('sort_order').toArray(function (contacts) {
                            var obj = {cat_id: 0, name: "全部分类"};
                            contacts.splice(0, 0, obj);
                            $scope.$broadcast('MyYiJi', contacts);
                        })
                        jqdb.smallcate.orderBy('sort_order').toArray(function (contacts) {
                            $scope.$broadcast('MyTab', contacts);
                        })
                        storage_session.set('cur' + $scope.Pi + '_' + $scope.Yj + '_' + $scope.Ta, 1)
                        $scope.getpin_pp(1, 'MyCat')
                    }
                });
                $scope.$on("YiJiEvent", function (event, msg) {
                    $scope.Ta = 0;
                    $scope.Yj = msg;
                    storage_session.set('cur' + $scope.Pi + '_' + $scope.Yj + '_' + $scope.Ta, 1)
                    if (!indexedDBS) {
                        if ($scope.Yj != 0) {
                            var contacts = lib.queryAll('smallcate', {
                                query: function (row) {
                                    return row.parent_id == $scope.Yj
                                }, sort: [["sort_order", "ASC"]]
                            });
                            $scope.$broadcast('MyTab', contacts);

                        } else {
                            var contacts = lib.queryAll('smallcate', {sort: [["sort_order", "ASC"]]});
                            $scope.$broadcast('MyTab', contacts);
                        }
                    } else {
                        if ($scope.Yj != 0) {
                            jqdb.smallcate.orderBy('sort_order').filter(function (row) {
                                return row.parent_id == $scope.Yj
                            }).toArray(function (contacts) {
                                $scope.$broadcast('MyTab', contacts);
                            })
                        } else {
                            jqdb.smallcate.orderBy('sort_order').toArray(function (contacts) {
                                $scope.$broadcast('MyTab', contacts);
                            })
                        }
                    }
                    $scope.getpin_pp(1, 'MyCat')
                });
                $scope.$on("TabEvent", function (event, msg) {

                    $scope.Ta = msg;
                    storage_session.set('cur' + $scope.Pi + '_' + $scope.Yj + '_' + $scope.Ta, 1)
                    $scope.getpin_pp(1, 'MyCat')
                });

                $scope.$on("cabEvent_page", function (event) {
                    $http.get("", {cache: $templateCache}).success(function (userComments) {
                        storage_session.set('cur' + $scope.Pi + '_' + $scope.Yj + '_' + $scope.Ta, storage_session.get('cur' + $scope.Pi + '_' + $scope.Yj + '_' + $scope.Ta) + 1);
                        $scope.getpin_pp(storage_session.get('cur' + $scope.Pi + '_' + $scope.Yj + '_' + $scope.Ta), 'MyCat_page');
                    })

                });
                $scope.$on("seachEvent", function (event, keyword) {

                    $scope.keywords=keyword;
                    $scope.getpin_pp(1, 'MyCat')

                });

            }])
        .controller('Controller_pp', ['$scope', '$http', '$templateCache', '$sce', function ($scope, $http, $templateCache) {

            $scope.showPin = function (itemId) {
                $scope.$emit('PinEvent', itemId);
            };
            $scope.$on("MyPin", function (event, msg) {
                $scope.pinpais = msg;
                if (indexedDBS) {
                    $scope.$apply()
                }
            });

        }])
        .controller('Controller_yj', ['$scope', '$http', '$templateCache', '$sce', function ($scope, $http, $templateCache) {
            $scope.showYiJi = function (itemId) {
                $scope.$emit('YiJiEvent', itemId);
            };
            $scope.$on("MyYiJi", function (event, msg) {

                $scope.YiJis = msg;
                if (indexedDBS) {
                    $scope.$apply()
                }
            });
        }])
        .controller('Controller_seach', ['$scope', '$http', '$templateCache', '$sce', function ($scope, $http, $templateCache) {
            $scope.seach = function (keyword) {

                $scope.$emit('seachEvent', keyword);

            };

        }])
        .controller('Controller_tab', ['$scope', '$http', '$templateCache', '$sce', function ($scope, $http, $templateCache, $sce) {
            //$emit 上级传值

            $scope.showTab = function (itemId) {
                $scope.$emit('TabEvent', itemId);
            };
            $scope.$on("MyTab", function (event, msg) {
                var arrRes = Enumerable.From(msg).Where("x=>x.name=='促销品'").ToArray();
                if (arrRes.length == 0) {
                    var obj = {cat_id: 2, name: "非促销"};
                    msg.splice(0, 0, obj);
                    var obj = {cat_id: 1, name: "促销品"};
                    msg.splice(0, 0, obj);
                    $scope.tabs = msg;
                    if (indexedDBS) {
                        $scope.$apply()
                    }
                } else {
                    $scope.tabs = msg;
                    if (indexedDBS) {
                        $scope.$apply()
                    }
                }
            });
        }])
        .controller('Controller_cat', ['$scope', '$http', '$templateCache', '$sce', function ($scope, $http, $templateCache, $sce) {
            $scope.$on("MyCat", function (event, msg) {
                if (msg.length > 0) {
                    mui('#refreshContainer').pullRefresh().scrollTo(0, 0)
                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                }
                $scope.cats = msg
                if (indexedDBS) {
                    $scope.$apply()
                }
            });
            $scope.$on("seach", function (event, msg) {

                $scope.cats = msg;
                if (indexedDBS) {
                    $scope.$apply()
                }
            });
            $scope.$on("conf", function (event, msg) {
                console.log(msg)
                $scope.conf = msg;
                // if (indexedDBS) {
                //     $scope.$apply()
                // }
            });
            $scope.$on("MyCat_page", function (event, msg) {
                //console.log(event.targetScope.Pi)
                if (msg.length > 0) {
                    $scope.cats = Enumerable.From($scope.cats).Union(msg).ToArray();
                    if (indexedDBS) {
                        $scope.$apply()
                    }
                }
            });
            $scope.upPullfresh = function () {

                $scope.$emit('cabEvent_page');
            };
        }])
        .filter("imgform", function () {
            return function (src) {
                if (src == "" || src == undefined) {
                    return "javascript:;";
                } else {
                    if(src.indexOf("http")!=-1)
                        return src;
                    else
                        return '../' + src;
                }
            };
        })
        .filter("goodsurl", function () {
            return function (src) {
                if (src == "" || src == undefined) {
                    return "javascript:;";
                } else {
                    return 'goods.php?id=' + src;
                }
            };
        })
        .directive('cusTvale', function () {
            var func = function ($scope, $element, $attrs, $ctrl) {
                $attrs.$set('id', $scope.tab.cat_id);
            }
            return {
                compile: function () {
                    return func
                },
                restrict: 'A'
            }
        })
        .directive('cusPvale', function () {
            var func = function ($scope, $element, $attrs, $ctrl) {
                $attrs.$set('id', $scope.pinpai.brand_id);
            }
            return {
                compile: function () {
                    return func
                },
                restrict: 'A'
            }
        })
        .directive('cusYvale', function () {
            var func = function ($scope, $element, $attrs, $ctrl) {
                $attrs.$set('id', $scope.YiJi.cat_id);
            }
            return {
                compile: function () {
                    return func
                },
                restrict: 'A'
            }
        })
        .directive('cusLvale', function () {
            var func = function ($scope, $element, $attrs, $ctrl) {
                $attrs.$set('id', $scope.cat.goods_id);
            }
            return {
                compile: function () {
                    return func
                },
                restrict: 'A'
            }
        })
        .directive('cusJianvale', function () {
            var func = function ($scope, $element, $attrs, $ctrl) {
                $attrs.$set('id', 'cusJianvale' + $scope.cat.goods_id);
            }
            return {
                compile: function () {
                    return func
                },
                restrict: 'A'
            }
        })
        .directive('cusJiavale', function () {
            var func = function ($scope, $element, $attrs, $ctrl) {
                $attrs.$set('id', $scope.cat.goods_id);
            }
            return {
                compile: function () {
                    return func
                },
                restrict: 'A'
            }
        })
        .directive('cusHiddenid', function () {
            var func = function ($scope, $element, $attrs, $ctrl) {
                $attrs.$set('id', 'cusHiddenid' + $scope.cat.goods_id);
            }
            return {
                compile: function () {
                    return func
                },
                restrict: 'A'
            }
        })
        .directive("nav", function () {
            var option = {
                restrict: "E",
                templateUrl: 'position.html',
                replace: false
            };
            upcartInfo();
            return option;
        })
})(window.angular);

