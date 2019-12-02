///
function cuxiaojia(mun, type, o, b2b2c) {
    var spec = '';
    var spectf = 0;
    var goods_id = storage_session.get('goods_id');
    var result_subfeili = arguments[4] ? arguments[4] : "0";//  原型"result_" + $(jiajian_o).attr('goods_id')  缓存标识
    var result_catid = arguments[5] ? arguments[5] : "0";   //  购物车id
    var result_goodsid = arguments[6] ? arguments[6] : "0";  //
    var result = "result_" + goods_id;
    if (result_subfeili != "0") {
        result = result_subfeili;
    }

    var danjian = storage_session.get(result + '.shop_price');

    var goods_number = storage_session.get(result + '.goodsinfo.goods_number');
    var ob_beishu;
    var totalnum_chuqudangqian = 0;

    var beishu = 1;
    if (storage_session.get(result + '.STTR') == 'YETATTR') {
        spec = $(o).attr('goods_attr');
        spectf = 1;
    }

    if (b2b2c == 'b2c') {

        if (storage_session.get(result + '.STTR') == 'NOTATTR') {
            totalnum_chuqudangqian = 0;
        } else {
            totalnum_chuqudangqian = mun;
        }

        ob_beishu = o.next().next();
        // 库存数 都取加减后的隐藏域
        //库存数 都取加减后的隐藏域

        if ($(ob_beishu).attr('kucunshu')) {
            goods_number = $(ob_beishu).attr('kucunshu');
        }
        beishu = $(ob_beishu).val();
    } else {
        if (storage_session.isSet('totalnum_chuqudangqian')) {
            totalnum_chuqudangqian = storage_session.get('totalnum_chuqudangqian');
        }
        ob_beishu = o;
        //库存数 都取加减后的隐藏域
        if ($(ob_beishu).attr('product_number')) {
            goods_number = $(ob_beishu).attr('product_number');
        }

        beishu = $(ob_beishu).attr('unitnum');

    }
    //倍数 都取加减后的隐藏域
    if (!mun)mun = 0;
    var shuliang = 1;
    if (beishu > 1) {
        shuliang = parseInt(beishu);
    }
    if (type == "jia") {

        mun = parseInt(mun) + parseInt(shuliang);

    } else if (type == "jian") {
        mun = (parseInt(mun) - parseInt(shuliang)) < 0 ? 0 : parseInt(mun) - parseInt(shuliang);

    } else {
        mun = mun;
    }

alert(mun)
    //库存报警数
    var warn_number = storage_session.get(result + '.goodsinfo.warn_number');
    ///起批数量  只有B2B 有作用
    var qipishuliang = 0;
    if (storage_session.isSet(result + '.volume_price')) {//有促销价格
        qipishuliang = storage_session.get(result + '.volume_price')[0].split('|')[0];
    }

    if (storage_session.get(result + '.B2B2C') == 'B2B') {

        if (parseInt(warn_number) >= parseInt(qipishuliang) || parseInt(goods_number) - parseInt(mun) < parseInt(warn_number)) {
            //启用库存报警为控制数量
            if (type == "jian" && parseInt(mun) < parseInt(warn_number)) {
                mun = parseInt(0);
            }
            if (mun == 0) {
                mun = parseInt(0);
            } else {
                if (parseInt(goods_number) - parseInt(mun) < parseInt(warn_number)) {

                    if (beishu > 1) {
                        mun = beishu * parseInt((parseInt(goods_number) - parseInt(warn_number)) / parseInt(beishu));
                    } else {
                        mun = parseInt(goods_number) - parseInt(warn_number);
                    }
                    //alert("库存低于最低限量1！");
                    //return false;
                }
            }
        } else {
            //启用起批算数量控制
            if (type == "jian" && parseInt(mun) < parseInt(qipishuliang)) {
                mun = parseInt(0);
            }
            if (mun == 0) {
                mun = parseInt(0);
            } else {
                if (parseInt(mun) < parseInt(qipishuliang)) {
                    //alert("批发数量不能低于起批数量"+qipishuliang+"件！");
                    if (parseInt(beishu) > 1 && parseInt(beishu) <= parseInt(qipishuliang)) {

                        mun = parseInt(beishu) * Math.ceil(parseInt(qipishuliang) / parseInt(beishu));

                    } else if (parseInt(beishu) > 1 && parseInt(beishu) >= parseInt(qipishuliang)) {
                        mun = parseInt(beishu);

                    } else {
                        mun = parseInt(qipishuliang);

                    }
                }
            }
        }
    } else {
        //库存控制
        if (type == "jian" && parseInt(mun) < parseInt(warn_number)) {
            mun = parseInt(0);
        }
        if (mun == 0) {
            mun = parseInt(0);
        } else {
            if (parseInt(goods_number) - parseInt(mun) < parseInt(warn_number)) {

                if (beishu > 1) {
                    mun = beishu * parseInt((parseInt(goods_number) - parseInt(warn_number)) / parseInt(beishu));
                } else {
                    mun = parseInt(goods_number) - parseInt(warn_number);
                }
                alert("库存低于最低限量2！")
                return false;
            }
        }
    }
    alert(mun)
    ////当前数--已经选择的数量  促销用
    totalnum_chuqudangqian = parseInt(totalnum_chuqudangqian) + parseInt(mun);
    alert(totalnum_chuqudangqian)
    ////算促销价格
    $(o).val(mun);
    var ajxurl = '../../flow.php?step=get_final_price';
    if (result_subfeili != "0") {
        var goods = new Object();
        var spec_arr = new Array();
        goods.quick = 1;
        goods.spec = spec_arr;
        goods.goods_id = $(o).attr('goods_id');
        goods.number = mun;
        goods.parent = 0;
        var baseprice=0;
        if (storage_session.get('recid_' + $(o).attr('goods_id'))&& parseInt(storage_session.get('recid_' + $(o).attr('goods_id'))) > 0) {
            alert(0)
            ajxurl = '../../flow.php?step=update_group_cart&rec_id=' + storage_session.get('recid_' + $(o).attr('goods_id')) + '&number=' + mun + '&goods_id=' + $(o).attr('goods_id');
        } else if (result_catid > 0 && result_goodsid > 0) {
            alert(1)
            ajxurl = '../../flow.php?step=update_group_cart&rec_id=' + result_catid + '&number=' + mun + '&goods_id=' + result_goodsid;
        } else {
            alert(2)
            ajxurl = '../../flow.php?step=add_to_cart&get_v=2';
        }

        $.ajax({
            url: ajxurl,
            type: 'POST', //GET
            async: true,    //或false,是否异步
            data: {
                goods: $.toJSON(goods)
            },
            timeout: 5000,    //超时时间
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {

                $(o).parent().parent().parent().parent().parent().prev().find("span").first().text('￥' + data.final_price)
                $(o).parent().parent().parent().parent().parent().prev().find("span").last().text(data.subtotal)
                //alert($(o).attr('goods_id'))
                if (indexedDBS) {
                    jqdb.allproduct.update($(o).attr('goods_id'), {cartnum:mun}).then(function (updated) {
                        if (updated)
                            console.log ("Friend number 2 was renamed to Number 2");
                        else
                            console.log ("Nothing was updated - there were no friend with primary key: 2");
                    });
                }else{
                    lib.update("allproduct", {cartnum: mun}, function(row) {
                        row.goods_id = $(o).attr('goods_id');
                    });
                }
                if (result_catid > 0 && result_goodsid > 0) {
                    select_cart_goods();
                    upcartInfo(data);
                } else {
                    //分类中
                    upcartInfo(data);
                }
            }
        })
    } else {
        //alert(8)
        var volume_goods  = '0'; //商品最终购买价格
        var volume_price  = '0'; //商品优惠价格    阶梯价格  ecs_volume_price
        var promote_price = '0'; //商品促销价格    goods
        var user_price    = '0'; //商品会员价格
        var baseprice=0;

        if(spectf==1){
            baseprice= $(o).attr('price')>0 ? $(o).attr('price'):0;
        }
        if (indexedDBS) {
            jqdb.result_all.where("goods_id").equals(storage_session.get(result + '.goodsinfo.goods_id')).toArray(function (contacts) {
                //console.log(contacts)
                if(contacts.length>1){
                    for(var i = 0;i < contacts.length; i++) {
                        if (totalnum_chuqudangqian >= contacts[i]['volume_number'])
                        {
                            volume_price =contacts[i]['volume_price'];
                        }
                    }
                }else{
                    volume_price=contacts[0]['hydj_price'];
                }
                if(volume_price=== null){
                    volume_price=contacts[0]['hydj_price']
                }
                console.log('起批价'+volume_price)
                user_price=contacts[0]['hydj_price'];
                console.log( '会员价'+user_price)

                var start=contacts[0]['promote_start_date']+'000'
                var end=contacts[0]['promote_end_date']+'000'
                if( parseInt(start) <=parseInt(new Date().getTime())<=parseInt(end) ){
                    promote_price=contacts[0]['promote_price']
                }else{
                    promote_price=user_price
                }
                console.log('促销价'+promote_price)

                danjian = Math.min(volume_price,user_price,promote_price)+parseFloat(baseprice);
                console.log('最后价格'+danjian)

                //$(".d-pnum").text(parseFloat(parseFloat(danjian).toFixed(2)));
                var totalnum = 0;
                var numinit = 0;

                $(o).parent().parent().find(".num").text(parseFloat(danjian).toFixed(2))
                $(o).attr("heji", (parseFloat(danjian) * parseInt(mun)));
                $(".amount-input").each(function () {
                    totalnum = parseInt(totalnum) + parseInt($(this).val());
                    numinit = parseFloat(numinit) + parseFloat($(this).attr("heji"));
                });
                $(".total-num").text(totalnum);
                $(".num-init").text(parseFloat(numinit).toFixed(2));

            })
        }else{
            // alert()
            var contacts = lib.queryAll('result_all', {
                query: function (row) {
                    return row.goods_id == storage_session.get(result + '.goodsinfo.goods_id')
                }
            });
            console.log(contacts)
            if(contacts.length>1){
                for(var i = 0;i < contacts.length; i++) {
                    if (totalnum_chuqudangqian >= contacts[i]['volume_number'])
                    {
                        volume_price =contacts[i]['volume_price'];
                    }
                }
            }else{
                volume_price=contacts[0]['hydj_price'];
            }
            if(volume_price=== null){
                volume_price=contacts[0]['hydj_price']
            }
            console.log('起批价'+volume_price)
            user_price=contacts[0]['hydj_price'];
            console.log( '会员价'+user_price)

            var start=contacts[0]['promote_start_date']+'000'
            var end=contacts[0]['promote_end_date']+'000'
            if( parseInt(start) <=parseInt(new Date().getTime())<=parseInt(end) ){
                promote_price=contacts[0]['promote_price']
            }else{
                promote_price=user_price
            }
            console.log('促销价'+promote_price)

            danjian = Math.min(volume_price,user_price,promote_price)+parseFloat(baseprice)
            console.log('最后价格'+danjian)

            //$(".d-pnum").text(parseFloat(parseFloat(danjian).toFixed(2)));
            var totalnum = 0;
            var numinit = 0;

            $(o).parent().parent().find(".num").text(parseFloat(danjian).toFixed(2))

            $(o).attr("heji", (parseFloat(danjian) * parseInt(mun)));
            $(".amount-input").each(function () {
                totalnum = parseInt(totalnum) + parseInt($(this).val());
                numinit = parseFloat(numinit) + parseFloat($(this).attr("heji"));
            });
            $(".total-num").text(totalnum);
            $(".num-init").text(parseFloat(numinit).toFixed(2));
        }
    }

}
//购物车入口
function addToCart(goodsId, parentId) {
    var goods = new Object();
    var spec_arr = new Array();
    var fittings_arr = new Array();
    var number = 1;
    var quick = 0;
    goods.quick = quick;
    goods.spec = [];
    goods.goods_id = goodsId;
    goods.number = number;
    goods.parent = (typeof(parentId) == "undefined") ? 0 : parseInt(parentId);
    storage_session.set("goods_id", goodsId);

    if (!storage_session.isSet("result_" + goodsId)) {
        Ajax.call('../../flow.php?step=add_to_cart', 'get_v=1&goods=' + $.toJSON(goods), addToCartResponse, 'POST', 'JSON');
    } else {
        addToCartResponse(storage_session.get("result_" + goodsId));
    }
}


//购物车和分类加购物车
function setstore(goodsId, parentId) {

    var goods = new Object();
    var spec_arr = new Array();
    var fittings_arr = new Array();
    var number = 1;
    var quick = 0;
    goods.quick = quick;
    goods.spec = [];
    goods.goods_id = goodsId;
    goods.number = number;
    goods.parent = (typeof(parentId) == "undefined") ? 0 : parseInt(parentId);
    storage_session.set("goods_id", goodsId);
    if (!storage_session.isSet("result_" + goodsId)) {
        Ajax.call('../../flow.php?step=add_to_cart', 'get_v=1&goods=' + $.toJSON(goods), getstores, 'POST', 'JSON');
    }
}
function getstores(result) {
    if (result.USER_CHECK_STATE == '0') {
        alert("会员没有审核通过，请通知平台审核！！");
        return false;
    }
    if (!indexedDBS) {
        lib.truncate("ecs_cart")
        for(var i = 0; i < result.ecs_cart.length; i++) {
            lib.insertOrUpdate("ecs_cart", {rec_id: result.ecs_cart[i].rec_id}, result.ecs_cart[i] );
        }
        lib.commit();
    }else{
        jqdb.ecs_cart.where("rec_id").aboveOrEqual(0).delete();
        jqdb.ecs_cart.bulkPut(result.ecs_cart)
    }

    storage_session.set("result_" + result.goods_id, result);
}
function addToCart_jisuan(jiajian_o, fangshi) {

    var result_catid = arguments[2] ? arguments[2] : "0";
    var result_goodsid = arguments[3] ? arguments[3] : "0";
    var goods = new Object();
    var spec_arr = new Array();
    setstore($(jiajian_o).attr('goods_id'), 0);
    cuxiaojia(parseInt(jiajian_o.val()), fangshi, jiajian_o, 'b2c', "result_" + $(jiajian_o).attr('goods_id'), result_catid, result_goodsid);

}
function addToCart_jian(o) {
    var result_catid = arguments[1] ? arguments[1] : "0";
    var result_goodsid = arguments[2] ? arguments[2] : "0";
    var jiajian_o = $(o).next();
    addToCart_jisuan(jiajian_o, "jian", result_catid, result_goodsid);
}
function addToCart_jia(o) {

    var result_catid = arguments[1] ? arguments[1] : "0";
    var result_goodsid = arguments[2] ? arguments[2] : "0";
    var jiajian_o = $(o).prev();

    addToCart_jisuan(jiajian_o, "jia", result_catid, result_goodsid);

}
function addToCart_jiajian(o) {
    var result_catid = arguments[1] ? arguments[1] : "0";
    var result_goodsid = arguments[2] ? arguments[2] : "0";
    var jiajian_o = $(o);
    addToCart_jisuan(jiajian_o, "", result_catid, result_goodsid);
}
//购物车和分类也加购物车
function jian_b2c(o) {

    var jiajian_o = $(o).next();
    cuxiaojia(parseInt(jiajian_o.val()), 'jian', jiajian_o, 'b2c');

}
function jia_b2c(o) {

    var jiajian_o = $(o).prev();
    cuxiaojia(parseInt(jiajian_o.val()), 'jia', jiajian_o, 'b2c');

}
function jiajian_b2c(o) {
    var jiajian_o = $(o);
    cuxiaojia(parseInt(jiajian_o.val()), '', jiajian_o, 'b2c');

}

function jian_b2b(o) {
    var jiajian_o = $(o).next();
    var totalnum_chuqudangqian = 0;
    $(".amount-input").each(function () {
        if (jiajian_o.attr('goods_attr') != $(this).attr('goods_attr')) {
            totalnum_chuqudangqian = parseInt(totalnum_chuqudangqian) + parseInt($(this).val());
        }
    });
    storage_session.set({'totalnum_chuqudangqian': totalnum_chuqudangqian});
    cuxiaojia(parseInt(jiajian_o.val()), 'jian', jiajian_o, 'b2b');


}

function jia_b2b(o) {
    var jiajian_o = $(o).prev();
    var totalnum_chuqudangqian = 0;
    $(".amount-input").each(function () {
        if (jiajian_o.attr('goods_attr') != $(this).attr('goods_attr')) {
            totalnum_chuqudangqian = parseInt(totalnum_chuqudangqian) + parseInt($(this).val());
        }
    });
    storage_session.set({'totalnum_chuqudangqian': totalnum_chuqudangqian});
    cuxiaojia(parseInt(jiajian_o.val()), 'jia', jiajian_o, 'b2b');


}
function jiajian_b2b(o) {
    var jiajian_o = $(o);
    var totalnum_chuqudangqian = 0;
    $(".amount-input").each(function () {
        if (jiajian_o.attr('goods_attr') != $(this).attr('goods_attr')) {
            totalnum_chuqudangqian = parseInt(totalnum_chuqudangqian) + parseInt($(this).val());
        }
    });
    storage_session.set({'totalnum_chuqudangqian': totalnum_chuqudangqian});
    cuxiaojia(parseInt(jiajian_o.val()), '', jiajian_o, 'b2b');


}

//获取选择属性后，再次提交到购物车
function submit_div_B2B(goods_id, parentId, iszhijiegoumai) {
    if (parseInt($(".total-num").text()) == 0) {
        alert('还没有选择货品！！');
        return false;
    }
    var goods = new Object();
    var spec_arr = new Array();
    var fittings_arr = new Array();
    $(".amount-input").each(function () {
        if ($(this).val() > 0) {
            number = $(this).val();
            var quick = 1;
            goods.quick = quick;
            goods.spec = $(this).attr("goods_attr").split("|");
            goods.goods_id = goods_id;
            goods.number = number;

            goods.parent = (typeof(parentId) == "undefined") ? 0 : parseInt(parentId);
            Ajax.call('../../flow.php?step=add_to_cart', 'get_v=2&goods=' + $.toJSON(goods), upcartInfo, 'POST', 'JSON', false);
        }
    });
    if (iszhijiegoumai == 1) {
        if (window.top != window.self) {
            window.top.location.href = '../../flow.php?step=cart';
        } else {
            location.href = '../../flow.php?step=cart';
        }
    }

    document.body.removeChild(docEle('speDiv'));
    document.body.removeChild(docEle('mask'));


}

function submit_div(goods_id, parentId, iszhijiegoumai) {
    if (parseInt($(".total-num").text()) == 0) {
        alert('还没有选择货品！！');
        return false;
    }
    var goods = new Object();
    var spec_arr = new Array();
    var fittings_arr = new Array();

    var jiajian = $("#jiajian").val();
    var number = 1;

    if (jiajian > 0) {
        number = jiajian;
    }
    var input_arr = document.getElementsByTagName('input');
    var quick = 1;

    var spec_arr = new Array();
    var j = 0;

    for (i = 0; i < input_arr.length; i++) {
        var prefix = input_arr[i].name.substr(0, 5);

        if (prefix == 'spec_' && (
                ((input_arr[i].type == 'radio' || input_arr[i].type == 'checkbox') && input_arr[i].checked))) {
            spec_arr[j] = input_arr[i].value;
            j++;
        }
    }

    goods.quick = quick;
    goods.spec = spec_arr;
    goods.goods_id = goods_id;
    goods.number = number;

    goods.parent = (typeof(parentId) == "undefined") ? 0 : parseInt(parentId);


    document.body.removeChild(docEle('speDiv'));
    document.body.removeChild(docEle('mask'));

    var i = 0;
    var sel_obj = document.getElementsByTagName('select');
    if (iszhijiegoumai == 1) {

        Ajax.call('../../flow.php?step=add_to_cart', 'get_v=2&goods=' + $.toJSON(goods), '', 'POST', 'JSON', false);
        if (window.top != window.self) {
            window.top.location.href = '../../flow.php?step=cart';
        } else {
            location.href = '../../flow.php?step=cart';
        }
    } else {
        Ajax.call('../../flow.php?step=add_to_cart', 'get_v=2&goods=' + $.toJSON(goods), addToCartResponse, 'POST', 'JSON', false);
    }
}


//b2b
function changeAtt(t, src, key) {

    $(".getprice").val(parseFloat($(".oldprice").text()) + parseFloat($(t).attr("p")));
    $(".prices").text($("#jiajian").val() + " 件 " + parseFloat($("#jiajian").val()) * parseFloat($(".getprice").val()) + " 元");

    if ($(".spec_a_" + src).hasClass('hover')) {

        $('.spec_value_' + src).attr("checked", false);
        $('.spec_value_quick_' + src).attr("checked", false);

        $(".catt_" + key).find("a").removeClass('hover');
        $(".catt_quick_" + key).find("a").removeClass('hover');

        //$(".spec_a_"+src).addClass('hover');
        //$(".spec_a_quick_"+src).addClass('hover');
        //changePrice();
    }
    else {
        $('.spec_value_' + src).attr("checked", 'checked');
        $('.spec_value_quick_' + src).attr("checked", 'checked');
        $(".catt_" + key).find("a").removeClass('hover');
        $(".catt_quick_" + key).find("a").removeClass('hover');
        $(".spec_a_" + src).addClass('hover');
        $(".spec_a_quick_" + src).addClass('hover');
        changePrice(src);
    }


}

function changeAtt_B2C(t, src, key) {
    var produc_tinfo = storage_session.get('price');
    var arrayObject = new Array();
    $(".xuan_a_" + key).each(function () {
        $(this).removeClass('cattsel');
    });
    $(t).find("input").attr("checked", 'checked');
    $(t).addClass('cattsel');
    arrayObject = [];
    $("input[id^='spec_value_']").each(function () {
        if ($(this).is(':checked')) {
            console.log($(this).val());
            arrayObject.push($(this).val());
        }
    })
    //console.log(produc_tinfo.productinfo)
    for (var i in produc_tinfo.productinfo) {

        if (produc_tinfo.productinfo[i].goods_attr) {
            ss = produc_tinfo.productinfo[i].goods_attr.split("|").sort().toString();
        } else {
            ss = '';
        }

        if (arrayObject.sort().toString() == ss) {

            var sumprice = 0;
            if (produc_tinfo.productinfo[i].unitnum > 1) {

                $(".unit-d-amount-control").css('display', '');
                $(".m-detail-purchasing-label").html('&nbsp库存数：' + produc_tinfo.productinfo[i].product_number + "件");
                $("#beishu").attr('kucunshu', produc_tinfo.productinfo[i].product_number);
                $(".amount-input").attr("readonly", "readonly");
                $(".amount-input").val(0);
                $("#beishu").val(produc_tinfo.productinfo[i].unitnum);

                for (var i in produc_tinfo.message) {
                    for (var j in produc_tinfo.message[i].values) {
                        if (arrayObject.contains(produc_tinfo.message[i].values[j].id)) {
                            sumprice = parseFloat(sumprice) + parseFloat(produc_tinfo.message[i].values[j].price);
                        }
                    }
                }
                $("#beishu").attr('danjia', sumprice + parseFloat(produc_tinfo.shop_price));


                break;
            } else {
                $(".unit-d-amount-control").css('display', '');
                $(".m-detail-purchasing-label").html('&nbsp库存数：' + produc_tinfo.productinfo[i].product_number + "件");
                $("#beishu").attr('kucunshu', produc_tinfo.productinfo[i].product_number);
                $(".amount-input").removeAttr("readonly");
                $(".amount-input").val(0);
                $("#beishu").val(1);
                //$("#beishu").attr(produc_tinfo.productinfo[i]);
                for (var i in produc_tinfo.message) {
                    for (var j in produc_tinfo.message[i].values) {
                        if (arrayObject.contains(produc_tinfo.message[i].values[j].id)) {
                            sumprice = parseFloat(sumprice) + parseFloat(produc_tinfo.message[i].values[j].price);
                        }
                    }
                }
                $("#beishu").attr('danjia', sumprice + parseFloat(produc_tinfo.shop_price));

                break;
            }

        } else {
            $("#beishu").removeAttr('danjia');
            $("#beishu").removeAttr('kucunshu');
            $("#beishu").val(1);
            $(".unit-d-amount-control").css('display', 'none');
            $(".m-detail-purchasing-label").html('&nbsp此特征货品无库存....');
        }
    }
}


function upcartInfo(result) {
    if(result!='0'){
        storage_local.set('upcartInfo', result);
    }else{
        result= storage_local.get('upcartInfo');
    }
    var cartInfo = document.getElementById('ECS_CARTINFO');
    var cartInfo1 = document.getElementById('ECS_CARTINFO1');

    if (cartInfo) {
        cartInfo.innerHTML = result.content;
    }
    if (cartInfo1) {
        cartInfo1.innerHTML = result.content;
    }
}
/* *
 * 处理添加商品到购物车的反馈信息
 */
function addToCartResponse(result) {
    if(!indexedDBS) {
        lib.truncate("ecs_cart")
        for(var i = 0; i < result.ecs_cart.length; i++) {
            lib.insertOrUpdate("ecs_cart", {rec_id: result.ecs_cart[i].rec_id}, result.ecs_cart[i] );
        }
        lib.commit();
    }else{
        jqdb.ecs_cart.where("rec_id").aboveOrEqual(0).delete();
        jqdb.ecs_cart.bulkPut(result.ecs_cart)
    }


    if (result.USER_CHECK_STATE == '0') {
        alert("启用会员没有审核通过，请通知平台审核！！");
        return false;
    }

    if (!storage_session.isSet("result_" + result.goods_id)) {
        storage_session.set("result_" + result.goods_id, result);
    }
    if (result.error > 0) {
        // 如果需要缺货登记，跳转
        if (result.error == 2) {
            if (confirm(result.message)) {
                Ajax.call('../../flow.php?step=add_to_cart', 'get_v=2&goods=' + $.toJSON(goods), upcartInfo, 'POST', 'JSON', false);
                if (window.top != window.self) {
                    window.top.location.href = '../../user.php?act=add_booking&id=' + result.goods_id + '&spec=' + result.product_spec;
                } else {
                    location.href = '../../user.php?act=add_booking&id=' + result.goods_id + '&spec=' + result.product_spec;
                }

            }
        }
        // 没选规格，弹出属性选择框
        else if (result.error == 6) {
            if (result.STTR == 'NOTATTR') {//b2b b2c 通用
                openSpeDiv_NOTATTR(result.message, result.goods_id, result.parent, result.goods_thumb, result.goods_name, result);
            } else {
                if (result.B2B2C == 'B2B') {
                    openSpeDiv_B2B(result.message, result.goods_id, result.parent, result.goods_thumb, result.goods_name, result);
                } else {
                    openSpeDiv_B2C(result.message, result.goods_id, result.parent, result.goods_thumb, result.goods_name, result);
                }
            }

        }
        else {
            alert(result.message);
        }
    }
    else {

        //直接购买
        var cartInfo = document.getElementById('ECS_CARTINFO');
        var cartInfo1 = document.getElementById('ECS_CARTINFO1');
        var cart_url = '../../flow.php?step=cart';
        if (cartInfo) {
            cartInfo.innerHTML = result.content;
        }
        if (cartInfo1) {
            cartInfo1.innerHTML = result.content;
        }
        if (result.one_step_buy == '1') {
            if (window.top != window.self) {
                window.top.location.href = cart_url;
            } else {
                location.href = cart_url;
            }

        }
    }
}


var pmwinposition = new Array();

var userAgent = navigator.userAgent.toLowerCase();
var is_opera = userAgent.indexOf('opera') != -1 && opera.version();
var is_moz = (navigator.product == 'Gecko') && userAgent.substr(userAgent.indexOf('firefox') + 8, 3);
var is_ie = (userAgent.indexOf('msie') != -1 && !is_opera) && userAgent.substr(userAgent.indexOf('msie') + 5, 3);
function pmwin(action, param) {
    var objs = document.getElementsByTagName("OBJECT");
    if (action == 'open') {
        for (i = 0; i < objs.length; i++) {
            if (objs[i].style.visibility != 'hidden') {
                objs[i].setAttribute("oldvisibility", objs[i].style.visibility);
                objs[i].style.visibility = 'hidden';
            }
        }
        var clientWidth = document.body.clientWidth;
        var clientHeight = document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
        var scrollTop = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
        var pmwidth = 800;
        var pmheight = clientHeight * 0.9;
        if (!$$('pmlayer')) {
            div = document.createElement('div');
            div.id = 'pmlayer';
            div.style.width = pmwidth + 'px';
            div.style.height = pmheight + 'px';
            div.style.left = ((clientWidth - pmwidth) / 2) + 'px';
            div.style.position = 'absolute';
            div.style.zIndex = '999';
            $$('append_parent').appendChild(div);
            $$('pmlayer').innerHTML = '<div style="width: 800px; background: #666666; margin: 5px auto; text-align: left">' +
                '<div style="width: 800px; height: ' + pmheight + 'px; padding: 1px; background: #FFFFFF; border: 1px solid #7597B8; position: relative; left: -6px; top: -3px">' +
                '<div onmousedown="pmwindrag(event, 1)" onmousemove="pmwindrag(event, 2)" onmouseup="pmwindrag(event, 3)" style="cursor: move; position: relative; left: 0px; top: 0px; width: 800px; height: 30px; margin-bottom: -30px;"></div>' +
                '<a href="###" onclick="pmwin(\'close\')"><img style="position: absolute; right: 20px; top: 15px" src="images/close.gif" title="关闭" /></a>' +
                '<iframe id="pmframe" name="pmframe" style="width:' + pmwidth + 'px;height:100%" allowTransparency="true" frameborder="0"></iframe></div></div>';
        }
        $$('pmlayer').style.display = '';
        $$('pmlayer').style.top = ((clientHeight - pmheight) / 2 + scrollTop) + 'px';
        if (!param) {
            pmframe.location = '../../pm.php';
        }
        else {
            pmframe.location = '../../pm.php?' + param;
        }
    }
    else if (action == 'close') {
        for (i = 0; i < objs.length; i++) {
            if (objs[i].attributes['oldvisibility']) {
                objs[i].style.visibility = objs[i].attributes['oldvisibility'].nodeValue;
                objs[i].removeAttribute('oldvisibility');
            }
        }
        hiddenobj = new Array();
        $$('pmlayer').style.display = 'none';
    }
}

var pmwindragstart = new Array();
function pmwindrag(e, op) {
    if (op == 1) {
        pmwindragstart = is_ie ? [event.clientX, event.clientY] : [e.clientX, e.clientY];
        pmwindragstart[2] = parseInt($$('pmlayer').style.left);
        pmwindragstart[3] = parseInt($$('pmlayer').style.top);
        doane(e);
    }
    else if (op == 2 && pmwindragstart[0]) {
        var pmwindragnow = is_ie ? [event.clientX, event.clientY] : [e.clientX, e.clientY];
        $$('pmlayer').style.left = (pmwindragstart[2] + pmwindragnow[0] - pmwindragstart[0]) + 'px';
        $$('pmlayer').style.top = (pmwindragstart[3] + pmwindragnow[1] - pmwindragstart[1]) + 'px';
        doane(e);
    }
    else if (op == 3) {
        pmwindragstart = [];
        doane(e);
    }
}

function doane(event) {
    e = event ? event : window.event;
    if (is_ie) {
        e.returnValue = false;
        e.cancelBubble = true;
    }
    else if (e) {
        e.stopPropagation();
        e.preventDefault();
    }
}

/* *
 * 添加礼包到购物车
 */
function addPackageToCart(packageId) {
    var package_info = new Object();
    var number = 1;

    package_info.package_id = packageId
    package_info.number = number;

    Ajax.call('../../flow.php?step=add_package_to_cart', 'package_info=' + $.toJSON(package_info), addPackageToCartResponse, 'POST', 'JSON');
}

/* *
 * 处理添加礼包到购物车的反馈信息
 */
function addPackageToCartResponse(result) {
    if (result.error > 0) {
        if (result.error == 2) {
            if (confirm(result.message)) {
                if (window.top != window.self) {
                    window.top.location.href = '../../user.php?act=add_booking&id=' + result.goods_id;
                } else {
                    location.href = '../../user.php?act=add_booking&id=' + result.goods_id;
                }

            }
        }
        else {
            alert(result.message);
        }
    }
    else {
        var cartInfo = document.getElementById('ECS_CARTINFO');
        var cartInfo1 = document.getElementById('ECS_CARTINFO1');
        var cart_url = '../../flow.php?step=cart';
        if (cartInfo) {
            cartInfo.innerHTML = result.content;
        }
        if (cartInfo1) {
            cartInfo1.innerHTML = result.content;
        }


        if (result.one_step_buy == '1') {
            if (window.top != window.self) {
                window.top.location.href = cart_url;
            } else {
                location.href = cart_url;
            }

        }
        else {
            switch (result.confirm_type) {
                case '1' :
                    if (confirm(result.message))
                        if (window.top != window.self) {
                            window.top.location.href = cart_url;
                        } else {
                            location.href = cart_url;
                        }
                    break;
                case '2' :
                    if (!confirm(result.message))
                        if (window.top != window.self) {
                            window.top.location.href = cart_url;
                        } else {
                            location.href = cart_url;
                        }
                    break;
                case '3' :
                    if (window.top != window.self) {
                        window.top.location.href = cart_url;
                    } else {
                        location.href = cart_url;
                    }
                    break;
                default :
                    break;
            }
        }
    }
}

function setSuitShow(suitId) {
    var suit = document.getElementById('suit_' + suitId);

    if (suit == null) {
        return;
    }
    if (suit.style.display == 'none') {
        suit.style.display = '';
    }
    else {
        suit.style.display = 'none';
    }
}
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
Array.prototype.min = function () {
    var min = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) {
        if (this[i] < min) {
            min = this[i];
        }
    }
    return min;
}
//最大值
Array.prototype.max = function () {
    var max = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) {
        if (this[i] > max) {
            max = this[i];
        }
    }
    return max;
}
/* 以下四个函数为属性选择弹出框的功能函数部分 */
//检测层是否已经存在
function docEle() {
    return document.getElementById(arguments[0]) || false;
}
function openSpeDiv_NOTATTR(message, goods_id, parent, img_url, goods_name, price) {

    var _id = "speDiv";
    var m = "mask";
    if (docEle(_id)) document.removeChild(docEle(_id));
    if (docEle(m)) document.removeChild(docEle(m));
    //计算上卷元素值
    var scrollPos;
    if (typeof window.pageYOffset != 'undefined') {
        scrollPos = window.pageYOffset;
    }
    else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
        scrollPos = document.documentElement.scrollTop;
    }
    else if (typeof document.body != 'undefined') {
        scrollPos = document.body.scrollTop;
    }
    var i = 0;
    var sel_obj = document.getElementsByTagName('select');
    while (sel_obj[i]) {
        sel_obj[i].style.visibility = "hidden";
        i++;
    }
// 新激活图层
    var newDiv = document.createElement("div");
    newDiv.id = _id;
    newDiv.style.position = "fixed";
    newDiv.style.zIndex = "10000";
    newDiv.style.width = "100%";
    newDiv.style.height = "75%";
    newDiv.style.bottom = "0px";

    var vprice = 0;
    //生成层内内容
    var shuxing = '';
    var tezheng = '';
    var active = 'operator-btn-active';

    if (price == undefined) {
        vprice = 0;
    } else {
        vprice = parseFloat(price.shop_price.replace('￥', ''));
    }
    var bs = '';
    if (price.goodsinfo.beishu > 1) {
        bs = 'readonly=readonly';
    }

    newDiv.innerHTML = "<div class='m-detail-purchasing-header  J_Style_PreventTouchMoveThrough'>" +
        "<div class='d-header'>" +
        "<dl><dt data-trace='sku-preview'>" +
        "<img alt='' class='img-priview' data-origin=''  src='../../" + img_url + "'>" +
        "</dt><dd>" +
        "<div onclick='javascript:cancel_div()' class='d-close'>" +
        "<i class='icons icons-close'></i>" +
        "</div>" +
        "<div class='titles'>" + goods_name + "</div>" +
        "<div class='price'>" +
        "<p class='price-unit' style='margin: 1em 0;color: #ff7300;'> <span class='fd-cny'>￥</span> <span class='d-pnum'>" + price.shop_price + "</span> </p> " +
        "</div> </dd></dl></div> </div>" +
        <!-- sku说明 -->
        "<ul class='m-detail-purchasing-label J_Style_PreventTouchMoveThrough'>" +
        "<li class='item'> </li>" +

        "</ul>" +
        "<div class='m-detail-purchasing-list m-detail-purchasing-list-sku'>" +
        <!-- sku内容 -->
        "<div class='d-content'>" +
        <!-- 二维sku -->
        "<div class='scroll-container obj-sku-selector'>" +

        "<ul class='sku-item item-operator  item-selector-container' id='j-multi-sku-operator-list'>" +

        "</ul>" +
        " </div>" +
        <!-- 一维sku -->
        <!--非sku-->
        "</div>" +
        "</div>" +
        <!-- sku说明 -->
        "<div><div class='m-detail-purchasing-order J_Style_PreventTouchMoveThrough'>" +
        "<span class='purchasing-info'> " +
        "<div style='position: absolute;top: .2rem;' class='unit-d-amount-control'> " +
        "<a href='javascript:void(0)' onclick='jian_b2c(this)' class='amount-down' style='touch-action: manipulation; -webkit-user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);'>–</a>" +
        "<input onkeyup='jiajian_b2c(this)' id='jiajian' pattern='d*' maxlength='10' value='0' " + bs + " class='amount-input' heji='0' type='number'>" +
        "<a href='javascript:void(0)' onclick='jia_b2c(this)' class='amount-up' style='touch-action: manipulation; -webkit-user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);'>+</a> " +

        "<input id='beishu' danjia='" + price.shop_price + "' value='" + price.goodsinfo.beishu + "' type='hidden'>   " +
        "</div></span>" +
        "<span class='purchasing-total-count'> 共<b class='total-num' id='j-purchase-total-amount'>0</b><span>件</span>" +
        "<span class='total-count'>  ￥ <b class='num-init' id='j-purchase-total-price'>0.00</b>  </span>   " +
        "</span>   </div>   </div>   " +
        "<div class='m-detail-action-operator-pur '>  <div class='d-content'>  <div class='unit-d-order-action'>  <button class='do-cart do-order detail-btn-hint' data-type='cart' onclick='submit_div(" + goods_id + ",0,0)' data-trace='order'>加入购物车</button>  <button class='do-purchase do-order detail-btn-important' onclick='submit_div(" + goods_id + ",0,1)' data-type='purchase' data-trace='purchase'>立即订购</button>  </div>   </div>   </div>";

    document.body.appendChild(newDiv);
    // mask图层
    var newMask = document.createElement("div");
    newMask.id = m;
    newMask.style.position = "absolute";
    newMask.style.zIndex = "9999";
    newMask.style.width = document.body.scrollWidth + "px";
    newMask.style.height = document.body.scrollHeight + "px";
    newMask.style.top = "0px";
    newMask.style.left = "0px";
    newMask.style.background = "black";
    newMask.style.filter = "alpha(opacity=60)";
    newMask.style.opacity = "0.80";
    document.body.appendChild(newMask);
}
//生成属性选择层
function openSpeDiv_B2B(message, goods_id, parent, img_url, goods_name, price) {
    if (message[0].length == 0) {
        alert("可能库存不足！！");
        return false;
    }
    var _id = "speDiv";
    var m = "mask";
    if (docEle(_id)) document.removeChild(docEle(_id));
    if (docEle(m)) document.removeChild(docEle(m));
    //计算上卷元素值
    var scrollPos;
    if (typeof window.pageYOffset != 'undefined') {
        scrollPos = window.pageYOffset;
    }
    else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
        scrollPos = document.documentElement.scrollTop;
    }
    else if (typeof document.body != 'undefined') {
        scrollPos = document.body.scrollTop;
    }
    var i = 0;
    var sel_obj = document.getElementsByTagName('select');
    while (sel_obj[i]) {
        sel_obj[i].style.visibility = "hidden";
        i++;
    }
    // 新激活图层
    var newDiv = document.createElement("div");
    newDiv.id = _id;
    newDiv.style.position = "fixed";
    newDiv.style.zIndex = "10000";
    newDiv.style.width = "100%";
    newDiv.style.height = "75%";
    newDiv.style.bottom = "0px";

    var vprice = 0;
    //生成层内内容
    if (price == undefined) {
        vprice = 0;
    } else {
        vprice = parseFloat(price.shop_price.replace('￥', ''));
    }
    var shuxing = '';
    var tezheng = '';
    var active = 'operator-btn-active';

    //var message = Object.keys(message[0]);

    for (var i in message[0]) {

        tezheng += "<div " + active + " style='width: 100%;' class='tengzhengbs' id='sku-selector-" + message[0][i].product.product_id + "'>";


        tezheng += "<li class='d-spec-operator' >" +
            "<div class='spec-operator-item'>" +
            "<div class='item-content'>" +
            "<div class='item-content-mid'>" +
            " <span href='#' title='' class='operator-text'>" + message[0][i].attr_value + "</span>" +
            "  </div>" +
            "  </div>" +
            "  </div>" +

            "  <div class='spec-operator-item j-box-amount-ctrl'>" +
            "  <div class='item-content'>" +
            <!-- 二维sku -->
            "   <div class='item-content-compensate' data-can-book-num='999'>" +
            "  <div class='unit-d-amount-control' data-amount-num-show='0_t_1477400479961'" +
            "data-amount-first-prop='" + message[0][i].attr_value + "'" +
            "data-amount-spec-id='" + message[0][i].product.product_id + "'>" +
            " <a href='javascript:void(0)' onclick='jian_b2b(this)' class='amount-down'" +
            "style='touch-action: manipulation; -webkit-user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);'>–</a>" +
            "<input " +
            "goodsid='" + goods_id + "' " +
            "goods_attr='" + message[0][i].product.goods_attr + "' " +
            "shopprice='" + parseFloat(vprice) + "' " +
            "unitnum='" + message[0][i].product.unitnum + "' " +
            "product_number='" + message[0][i].product.product_number + "' " +
            "product_sn='" + message[0][i].product.product_sn + "' " +
            "product_id='" + message[0][i].product.product_id + "'  " +
            "heji='0'  " +
            "price='" + message[0][i].attr_price + "' ";
        if (message[0][i].product.unitnum > 1) {
            tezheng += " readonly='readonly'";
        } else {
            tezheng += " onkeyup='jiajian_b2b(this)'";
        }
		console.log(message[0][i])
        tezheng += "type='number' id='jiajian' pattern='\d*' maxlength='10' value="+message[0][i].goods_attr_number+" class='amount-input'>" +
            " <a href='javascript:void(0)' onclick='jia_b2b(this)' class='amount-up'" +
            "style='touch-action: manipulation; -webkit-user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);'>+</a>" +
            "   </div>" +
            // "   <p class='can-book-count'>库存:<span class='num'>" + message[0][i].product.product_number + "</span>&nbsp;金额:<span class='num'>" + message[0][i].attr_price + "</span></p>" +
            "   <p class='can-book-count' style='position: relative;top: 2px;'>金额:￥<span class='num'>" + message[0][i].attr_price + "</span></p>" +

            "   </div>" +
            <!-- 一维sku 和 非sku -->
            <!-- 非sku -->
            "</div>" +
            " </div>" +
            "</li>";

        tezheng += "</div>";

    }
    newDiv.innerHTML = "<div class='m-detail-purchasing-header  J_Style_PreventTouchMoveThrough'>" +
        "<div class='d-header'>" +
        "<dl>" +
        "<dt data-trace='sku-preview'>" +
        "<img alt='' class='img-priview' data-origin='' src='../../" + img_url + "'>" +
        "</dt>" +
        "<dd>" +
        "<div onclick='javascript:cancel_div()' class='d-close'>" +
        "<i class='icons icons-close'></i>" +
        "</div>" +
        "<div class='titles'>" + goods_name + "</div>" +
        "<div class='price'>" +
        "<p class='price-unit' style='margin: 1em 0;color: #ff7300;'>" +
        " <span class='fd-cny'>¥</span>" +
        " <span class='d-pnum'>" + (parseFloat(price.maxminprice.min()) + parseFloat(vprice)) + "</span>" +
        " </p>" +
        "<span class='d-pnum-split' style='margin-top: 10px;'>-</span>" +
        "<p class='price-unit' style='margin: 1em 0;color: #ff7300;'>" +
        " <span class='fd-cny'>¥</span>" +
        "<span class='d-pnum'>" + (parseFloat(price.maxminprice.max()) + parseFloat(vprice)) + "</span>" +
        " </p>" +
        " </div>" +
        " </dd>" +
        "</dl>" +
        "</div>" +
        " </div><div>" +
        <!-- sku说明 -->
        "<ul class='m-detail-purchasing-label J_Style_PreventTouchMoveThrough'>" +
        "<li class='item'> 属性</li>" +
        // "<li class='item'> 特征</li>"+
        "<li class='item'>数量</li>" +
        "</ul>" +
        "<div class='m-detail-purchasing-list m-detail-purchasing-list-sku'>" +
        <!-- sku内容 -->
        "<div class='d-content'>" +
        <!-- 二维sku -->
        "<div class='scroll-container obj-sku-selector'>" +
        // "<ul class='sku-item item-selector item-selector-container'>"+
        //
        // shuxing +
        //
        // "</ul>"+
        "<ul class='sku-item item-operator  item-selector-container' id='j-multi-sku-operator-list'>" +
        tezheng +
        "</ul>" +
        " </div>" +
        <!-- 一维sku -->
        <!--非sku-->
        "</div>" +
        "</div>" +
        <!-- 总数总价实时计算 -->
        "<div class='m-detail-purchasing-order J_Style_PreventTouchMoveThrough'>" +
        "<span class='purchasing-info'>" +

        "</span>" +
        "<span class='purchasing-total-count'>" +
        " 共<b class='total-num' id='j-purchase-total-amount'>0</b><span>件</span>" +
        "<span class='total-count'>" +
        "  ¥ <b class='num-init' id='j-purchase-total-price'>0.00</b>" +
        "  </span>" +
        "   </span>" +
        "   </div>" +
        "   </div>" +
        <!-- 下单弹层底部按钮-->
        "   <div class='m-detail-action-operator-pur '>" +
        "  <div class='d-content'>" +
        "  <div class='unit-d-order-action'>" +
        "  <button class='do-cart do-order detail-btn-hint' data-type='cart' onclick='submit_div_B2B(" + goods_id + "," + parent + ",0)' data-trace='order'>加入购物车</button>" +
        "  <button class='do-purchase do-order detail-btn-important'  onclick='submit_div_B2B(" + goods_id + "," + parent + ",1)' data-type='purchase' data-trace='purchase'>立即订购</button>" +
        <!-- 代销下单 -->
        "  </div>" +
        "   </div>" +
        "   </div>" +
        "  </div>";
    //document.body.style.overlfow='hidden';

    document.body.appendChild(newDiv);


    // mask图层
    var newMask = document.createElement("div");
    newMask.id = m;
    newMask.style.position = "absolute";
    newMask.style.zIndex = "9999";
    newMask.style.width = document.body.scrollWidth + "px";
    newMask.style.height = document.body.scrollHeight + "px";
    newMask.style.top = "0px";
    newMask.style.left = "0px";
    newMask.style.background = "black";
    newMask.style.filter = "alpha(opacity=60)";
    newMask.style.opacity = "0.80";
    document.body.appendChild(newMask);

    //   $(':input').labelauty();


}
// 关闭mask和新图层
function openSpeDiv_B2C(message, goods_id, parent, img_url, goods_name, price) {
    storage_session.set('price', price);
    price = storage_session.get('price');
    var _id = "speDiv";
    var m = "mask";
    if (docEle(_id)) document.removeChild(docEle(_id));
    if (docEle(m)) document.removeChild(docEle(m));
    //计算上卷元素值
    var scrollPos;
    if (typeof window.pageYOffset != 'undefined') {
        scrollPos = window.pageYOffset;
    }
    else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
        scrollPos = document.documentElement.scrollTop;
    }
    else if (typeof document.body != 'undefined') {
        scrollPos = document.body.scrollTop;
    }

    var i = 0;
    var sel_obj = document.getElementsByTagName('select');
    while (sel_obj[i]) {
        sel_obj[i].style.visibility = "hidden";
        i++;
    }

    // 新激活图层
    var newDiv = document.createElement("div");
    newDiv.id = _id;
    newDiv.style.position = "fixed";
    newDiv.style.zIndex = "10000";
    newDiv.style.width = "100%";
    newDiv.style.height = "75%";
    newDiv.style.bottom = "0px";

    var vprice = 0;
    //生成层内内容
    var shuxing = '';
    var tezheng = '';
    var active = 'operator-btn-active';

    if (price == undefined) {
        vprice = 0;
    } else {
        vprice = parseFloat(price.shop_price.replace('￥', ''));
    }
    var str2 = '';

    if (message == null) {
        str2 += "无特征";
    } else {
        for (var spec = 0; spec < message.length; spec++) {
            str2 += "<li id='choose-version'><div class='dt'>" + message[spec]['name'] + "</div><div class='dd catt'> <input type='hidden' name='spec_attr_type' value='" + message[spec]['attr_type'] + "'><ul class='ys_xuan' id='xuan_28'>";


            if (message[spec]['attr_type'] == 1) {
                for (var val_arr = 0; val_arr < message[spec]['values'].length; val_arr++) {

                    str2 += "<a  onclick=changeAtt_B2C(this," + message[spec]['values'][val_arr]['id'] + "," + message[spec]['attr_id'] + ")    name=" + message[spec]['attr_id'] + " class='xuan_a_" + message[spec]['attr_id'] + "'  > <div style='padding:3px 7px;'>" + message[spec]['values'][val_arr]['label'] + "</div><input  style='display:none;'  p=" + message[spec]['values'][val_arr]['price'] + "  type='radio' name='spec_" + message[spec]['attr_id'] + "' value='" + message[spec]['values'][val_arr]['id'] + "' id='spec_value_" + message[spec]['values'][val_arr]['id'] + "' /></a>";

                }

            }
            else {
                for (var val_arr = 0; val_arr < message[spec]['values'].length; val_arr++) {
                    str2 += "<a  onclick=changeAtt_B2C(this," + message[spec]['values'][val_arr]['id'] + "," + message[spec]['attr_id'] + ")  " +
                        "href='javascript:' name='" + message[spec]['attr_id'] + "' class='xuan_a_" + message[spec]['attr_id'] + "'  > <div style='padding:3px 7px;'>" + message[spec]['values'][val_arr]['label'] + "</div><input style='display:none;'   p=" + message[spec]['values'][val_arr]['price'] + "  type='checkbox' name='spec_" + message[spec]['attr_id'] + "' value='" + message[spec]['values'][val_arr]['id'] + "' id='spec_value_" + message[spec]['values'][val_arr]['id'] + "' /></a>";
                }

            }
            str2 += "</ul><input type='hidden' name='spec_list' value='" + val_arr + "'></div> </li>";
        }
    }


    newDiv.innerHTML = "<div class='m-detail-purchasing-header  J_Style_PreventTouchMoveThrough'>" +
        "<div class='d-header'>" +
        "<dl>" +
        "<dt data-trace='sku-preview'>" +
        "<img alt='' class='img-priview' data-origin='' src='../../" + img_url + "'>" +
        "</dt>" +
        "<dd>" +
        "<div onclick='javascript:cancel_div()' class='d-close'>" +
        "<i class='icons icons-close'></i>" +
        "</div>" +
        "<div class='titles'>" + goods_name + "</div>" +
        "<div class='price'>" +
        "<p class='price-unit' style='margin: 1em 0;color: #ff7300;'>" +
        " <span class='fd-cny'>¥</span>" +
        " <span class='d-pnum'>" + (parseFloat(price.maxminprice.min()) + parseFloat(vprice)) + "</span>" +
        " </p>" +
        "<span class='d-pnum-split' style='margin-top: 10px;'>-</span>" +
        "<p class='price-unit' style='margin: 1em 0;color: #ff7300;'>" +
        " <span class='fd-cny'>¥</span>" +
        "<span class='d-pnum'>" + (parseFloat(price.maxminprice.max()) + parseFloat(vprice)) + "</span>" +
        " </p>" +
        " </div>" +
        " </dd>" +
        "</dl>" +
        "</div>" +
        " </div><div>" +
        <!-- sku说明 -->
        "<ul class='m-detail-purchasing-label J_Style_PreventTouchMoveThrough'>" +
        "<li class='item'>" +
        " </li>" +
        // "<li class='item'> 特征</li>"+
        "<li class='item'></li>" +
        "</ul>" +
        "<div class='m-detail-purchasing-list m-detail-purchasing-list-sku'>" +
        <!-- sku内容 -->
        "<div class='d-content'>" +
        <!-- 二维sku -->
        "<div class='scroll-container obj-sku-selector'>" +
        // "<ul class='sku-item item-selector item-selector-container'>"+
        //
        // shuxing +
        //
        // "</ul>"+
        "<ul class='sku-item item-operator  item-selector-container' id='j-multi-sku-operator-list'>" +
        str2 +
        "</ul>" +
        " </div>" +
        <!-- 一维sku -->
        <!--非sku-->
        "</div>" +
        "</div>" +
        <!-- 总数总价实时计算 -->
        "<div class='m-detail-purchasing-order J_Style_PreventTouchMoveThrough'>" +
        "<span class='purchasing-info'>" +
        " <div style='position: absolute;top: .2rem;display: none;' class='unit-d-amount-control'  > " +
        "<a href='javascript:void(0)' onclick='jian_b2c(this)' class='amount-down' style='touch-action: manipulation; -webkit-user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);'>–</a>" +
        "<input  type='number'  onkeyup='jiajian_b2c(this)' id='jiajian' pattern='d*' maxlength='10' class='amount-input'>" +
        "<a href='javascript:void(0)' onclick='jia_b2c(this)' class='amount-up' style='touch-action: manipulation; -webkit-user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);'>+</a> <input  type='hidden' id='beishu' value='1' >   </div>" +
        "</span>" +
        "<span class='purchasing-total-count'>" +
        " 共<b class='total-num' id='j-purchase-total-amount'>0</b><span>件</span>" +
        "<span class='total-count'>" +
        "  ¥ <b class='num-init' id='j-purchase-total-price'>0.00</b>" +
        "  </span>" +
        "   </span>" +
        "   </div>" +
        "   </div>" +
        <!-- 下单弹层底部按钮-->
        "   <div class='m-detail-action-operator-pur '>" +
        "  <div class='d-content'>" +
        "  <div class='unit-d-order-action'>" +
        "  <button class='do-cart do-order detail-btn-hint' data-type='cart' onclick='submit_div(" + goods_id + "," + parent + ",0)' data-trace='order'>加入购物车</button>" +
        "  <button class='do-purchase do-order detail-btn-important'  onclick='submit_div(" + goods_id + "," + parent + ",1)' data-type='purchase' data-trace='purchase'>立即订购</button>" +
        <!-- 代销下单 -->
        "  </div>" +
        "   </div>" +
        "   </div>" +
        "  </div>";

    document.body.appendChild(newDiv);


    // mask图层
    var newMask = document.createElement("div");
    newMask.id = m;
    newMask.style.position = "absolute";
    newMask.style.zIndex = "9999";
    newMask.style.width = document.body.scrollWidth + "px";
    newMask.style.height = document.body.scrollHeight + "px";
    newMask.style.top = "0px";
    newMask.style.left = "0px";
    newMask.style.background = "black";
    newMask.style.filter = "alpha(opacity=60)";
    newMask.style.opacity = "0.80";
    document.body.appendChild(newMask);

}

function cancel_div() {
    document.body.removeChild(docEle('speDiv'));
    document.body.removeChild(docEle('mask'));
    //document.body.style.overlfow='scroll';
    var i = 0;
    var sel_obj = document.getElementsByTagName('select');
    while (sel_obj[i]) {
        sel_obj[i].style.visibility = "";
        i++;
    }
}
function changeshuxing(o, id) {
    $(".operator-btn").each(function () {
        $(this).removeClass('operator-btn-active');
    });
    $(o).addClass("operator-btn-active");
    $(".tengzhengbs").each(function () {
        $(this).hide();
    });
    $("#sku-selector-" + id).show();

}



function opencartDiv(price, name, pic, goods_brief, goods_id, total, number) {
    var _id = "speDiv";
    var m = "mask";

    if (docEle(_id)) document.removeChild(docEle(_id));
    if (docEle(m)) document.removeChild(docEle(m));
//计算上卷元素值
    var scrollPos;
    if (typeof window.pageYOffset != 'undefined') {
        scrollPos = window.pageYOffset;
    }
    else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
        scrollPos = document.documentElement.scrollTop;
    }
    else if (typeof document.body != 'undefined') {
        scrollPos = document.body.scrollTop;
    }

    var i = 0;
    var sel_obj = document.getElementsByTagName('select');
    while (sel_obj[i]) {
        sel_obj[i].style.visibility = "hidden";
        i++;
    }

// 新激活图层
    var newDiv = document.createElement("div");
    newDiv.id = _id;
    newDiv.style.position = "fixed";
    newDiv.style.zIndex = "10000";
    newDiv.style.width = "90%";
    newDiv.style.margin = "0 5%";
    newDiv.style.height = "270px";
    newDiv.style.bottom = "60px";
    newDiv.style.left = "0px"; // 屏幕居中
    newDiv.style.background = "#fff";
    newDiv.className = "shopdiv";
    var html = '';

//生成层内内容
    html = '<div class=cardivfloat><div class=cartitle><span class=cartdivfloattitle>商品已成功添加到购物车！</span><a href=\'javascript:cancel_div()\'  class="con_close">关闭</a></div></div><div class="cartpopDiv"><div class="toptitle clearfix"><a href="../../goods.php?id=' + goods_id + '" class="pic"><img src=../' + pic + ' width="100" height="100"/></a><p class=conprice><font style="color:#666">' + name + '</font><br>  <font style="color:#ec5151; font-weight:700; font-size:16px;">' + price + '</font></div>';

    html += '<div class="coninfo">';
    html += '购物车共有<font style="color:#ec5151; font-size:14px;"><strong>' + number + '</strong></font>件商品&nbsp;&nbsp;&nbsp;合计：<font style="colorec5151; font-size:14px;"><strong>' + total + '</strong></font>';
    html += '</div>';


    html += "<div class=cartbntfloat clearfix ><a href=\'javascript:cancel_div()\' class=greyBtn>继续购买</a><a href='../../flow.php' class=redBtn>去购物车</a></div>";
    html += '</div></div>';
    newDiv.innerHTML = html;
    document.body.appendChild(newDiv);
// mask图层
    var newMask = document.createElement("div");
    newMask.id = m;
    newMask.style.position = "absolute";
    newMask.style.zIndex = "9999";
    newMask.style.width = document.body.scrollWidth + "px";
    newMask.style.height = document.body.scrollHeight + "px";
    newMask.style.top = "0px";
    newMask.style.left = "0px";
    newMask.style.background = "#000000";
    newMask.style.filter = "alpha(opacity=30)";
    newMask.style.opacity = "0.40";
    document.body.appendChild(newMask);

}

/**
 * 获得选定的商品属性
 */
function getSelectedAttributes(formBuy) {
    var spec_arr = new Array();
    var j = 0;

    for (i = 0; i < formBuy.elements.length; i++) {
        var prefix = formBuy.elements[i].name.substr(0, 5);

        if (prefix == 'spec_' && (
            ((formBuy.elements[i].type == 'radio' || formBuy.elements[i].type == 'checkbox') && formBuy.elements[i].checked) ||
            formBuy.elements[i].tagName == 'SELECT')) {
            spec_arr[j] = formBuy.elements[i].value;
            j++;
        }
    }

    return spec_arr;
}


/* *
 * 添加商品到收藏夹
 */
function collect(goodsId) {
    Ajax.call('../../user.php?act=collect', 'id=' + goodsId, collectResponse, 'GET', 'JSON');
}

/* *
 * 处理收藏商品的反馈信息
 */
function collectResponse(result) {
    alert(result.message);
}

/* *
 * 处理会员登录的反馈信息
 */
function signInResponse(result) {
    toggleLoader(false);

    var done = result.substr(0, 1);
    var content = result.substr(2);

    if (done == 1) {
        document.getElementById('member-zone').innerHTML = content;
    }
    else {
        alert(content);
    }
}

/* *
 * 评论的翻页函数
 */
function gotoPage(page, id, type) {
    Ajax.call('../../comment.php?act=gotopage', 'page=' + page + '&id=' + id + '&type=' + type, gotoPageResponse, 'GET', 'JSON');
}

function gotoPageResponse(result) {
    document.getElementById("ECS_COMMENT").innerHTML = result.content;
}

/* *
 * 商品购买记录的翻页函数
 */
function gotoBuyPage(page, id) {
    Ajax.call('../../goods.php?act=gotopage', 'page=' + page + '&id=' + id, gotoBuyPageResponse, 'GET', 'JSON');
}

function gotoBuyPageResponse(result) {
    document.getElementById("ECS_BOUGHT").innerHTML = result.result;
}
/* *
 * 取得格式化后的价格
 * @param : float price
 */
function getFormatedPrice(price) {
    if (currencyFormat.indexOf("%s") > -1) {
        return currencyFormat.replace('%s', advFormatNumber(price, 2));
    }
    else if (currencyFormat.indexOf("%d") > -1) {
        return currencyFormat.replace('%d', advFormatNumber(price, 0));
    }
    else {
        return price;
    }
}

/* *
 * 夺宝奇兵会员出价
 */

function bid(step) {
    var price = '';
    var msg = '';
    if (step != -1) {
        var frm = document.forms['formBid'];
        price = frm.elements['price'].value;
        id = frm.elements['snatch_id'].value;
        if (price.length == 0) {
            msg += price_not_null + '\n';
        }
        else {
            var reg = /^[\.0-9]+/;
            if (!reg.test(price)) {
                msg += price_not_number + '\n';
            }
        }
    }
    else {
        price = step;
    }

    if (msg.length > 0) {
        alert(msg);
        return;
    }

    Ajax.call('../../snatch.php?act=bid&id=' + id, 'price=' + price, bidResponse, 'POST', 'JSON')
}

/* *
 * 夺宝奇兵会员出价反馈
 */

function bidResponse(result) {
    if (result.error == 0) {
        document.getElementById('ECS_SNATCH').innerHTML = result.content;
        if (document.forms['formBid']) {
            document.forms['formBid'].elements['price'].focus();
        }
        newPrice(); //刷新价格列表
    }
    else {
        alert(result.content);
    }
}


/* *
 * 夺宝奇兵最新出价
 */

function newPrice(id) {
    Ajax.call('../../snatch.php?act=new_price_list&id=' + id, '', newPriceResponse, 'GET', 'TEXT');
}

/* *
 * 夺宝奇兵最新出价反馈
 */

function newPriceResponse(result) {
    document.getElementById('ECS_PRICE_LIST').innerHTML = result;
}

/* *
 *  返回属性列表
 */
function getAttr(cat_id) {
    var tbodies = document.getElementsByTagName('tbody');
    for (i = 0; i < tbodies.length; i++) {
        if (tbodies[i].id.substr(0, 10) == 'goods_type')tbodies[i].style.display = 'none';
    }

    var type_body = 'goods_type_' + cat_id;
    try {
        document.getElementById(type_body).style.display = '';
    }
    catch (e) {
    }
}

/* *
 * 截取小数位数
 */
function advFormatNumber(value, num) // 四舍五入
{
    var a_str = formatNumber(value, num);
    var a_int = parseFloat(a_str);
    if (value.toString().length > a_str.length) {
        var b_str = value.toString().substring(a_str.length, a_str.length + 1);
        var b_int = parseFloat(b_str);
        if (b_int < 5) {
            return a_str;
        }
        else {
            var bonus_str, bonus_int;
            if (num == 0) {
                bonus_int = 1;
            }
            else {
                bonus_str = "0."
                for (var i = 1; i < num; i++)
                    bonus_str += "0";
                bonus_str += "1";
                bonus_int = parseFloat(bonus_str);
            }
            a_str = formatNumber(a_int + bonus_int, num)
        }
    }
    return a_str;
}

function formatNumber(value, num) // 直接去尾
{
    var a, b, c, i;
    a = value.toString();
    b = a.indexOf('.');
    c = a.length;
    if (num == 0) {
        if (b != -1) {
            a = a.substring(0, b);
        }
    }
    else {
        if (b == -1) {
            a = a + ".";
            for (i = 1; i <= num; i++) {
                a = a + "0";
            }
        }
        else {
            a = a.substring(0, b + num + 1);
            for (i = c; i <= b + num; i++) {
                a = a + "0";
            }
        }
    }
    return a;
}

/* *
 * 根据当前shiping_id设置当前配送的的保价费用，如果保价费用为0，则隐藏保价费用
 *
 * return       void
 */
function set_insure_status() {
    // 取得保价费用，取不到默认为0
    var shippingId = getRadioValue('shipping');
    var insure_fee = 0;
    if (shippingId > 0) {
        if (document.forms['theForm'].elements['insure_' + shippingId]) {
            insure_fee = document.forms['theForm'].elements['insure_' + shippingId].value;
        }
        // 每次取消保价选择
        if (document.forms['theForm'].elements['need_insure']) {
            document.forms['theForm'].elements['need_insure'].checked = false;
        }

        // 设置配送保价，为0隐藏
        if (document.getElementById("ecs_insure_cell")) {
            if (insure_fee > 0) {
                document.getElementById("ecs_insure_cell").style.display = '';
                setValue(document.getElementById("ecs_insure_fee_cell"), getFormatedPrice(insure_fee));
            }
            else {
                document.getElementById("ecs_insure_cell").style.display = "none";
                setValue(document.getElementById("ecs_insure_fee_cell"), '');
            }
        }
    }
}

/* *
 * 当支付方式改变时出发该事件
 * @param       pay_id      支付方式的id
 * return       void
 */
function changePayment(pay_id) {
    // 计算订单费用
    calculateOrderFee();
}

function getCoordinate(obj) {
    var pos =
    {
        "x": 0, "y": 0
    }

    pos.x = document.body.offsetLeft;
    pos.y = document.body.offsetTop;

    do
    {
        pos.x += obj.offsetLeft;
        pos.y += obj.offsetTop;

        obj = obj.offsetParent;
    }
    while (obj.tagName.toUpperCase() != 'BODY')

    return pos;
}

function showCatalog(obj) {
    var pos = getCoordinate(obj);
    var div = document.getElementById('ECS_CATALOG');

    if (div && div.style.display != 'block') {
        div.style.display = 'block';
        div.style.left = pos.x + "px";
        div.style.top = (pos.y + obj.offsetHeight - 1) + "px";
    }
}

function hideCatalog(obj) {
    var div = document.getElementById('ECS_CATALOG');

    if (div && div.style.display != 'none') div.style.display = "none";
}

function sendHashMail() {
    Ajax.call('../../user.php?act=send_hash_mail', '', sendHashMailResponse, 'GET', 'JSON')
}

function sendHashMailResponse(result) {
    alert(result.message);
}

/* 订单查询 */
function orderQuery() {
    var order_sn = document.forms['ecsOrderQuery']['order_sn'].value;

    var reg = /^[\.0-9]+/;
    if (order_sn.length < 10 || !reg.test(order_sn)) {
        alert(invalid_order_sn);
        return;
    }
    Ajax.call('../../user.php?act=order_query&order_sn=s' + order_sn, '', orderQueryResponse, 'GET', 'JSON');
}

function orderQueryResponse(result) {
    if (result.message.length > 0) {
        alert(result.message);
    }
    if (result.error == 0) {
        var div = document.getElementById('ECS_ORDER_QUERY');
        div.innerHTML = result.content;
    }
}

function display_mode(str) {
    document.getElementById('display').value = str;
    setTimeout(doSubmit, 0);
    function doSubmit() {
        document.forms['listform'].submit();
    }
}

function display_mode_wholesale(str) {
    document.getElementById('display').value = str;
    setTimeout(doSubmit, 0);
    function doSubmit() {
        document.forms['wholesale_goods'].action = "../../wholesale.php";
        document.forms['wholesale_goods'].submit();
    }
}

/* 修复IE6以下版本PNG图片Alpha */
function fixpng() {
    var arVersion = navigator.appVersion.split("MSIE")
    var version = parseFloat(arVersion[1])

    if ((version >= 5.5) && (document.body.filters)) {
        for (var i = 0; i < document.images.length; i++) {
            var img = document.images[i]
            var imgName = img.src.toUpperCase()
            if (imgName.substring(imgName.length - 3, imgName.length) == "PNG") {
                var imgID = (img.id) ? "id='" + img.id + "' " : ""
                var imgClass = (img.className) ? "class='" + img.className + "' " : ""
                var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' "
                var imgStyle = "display:inline-block;" + img.style.cssText
                if (img.align == "left") imgStyle = "float:left;" + imgStyle
                if (img.align == "right") imgStyle = "float:right;" + imgStyle
                if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle
                var strNewHTML = "<span " + imgID + imgClass + imgTitle
                    + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";"
                    + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
                    + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>"
                img.outerHTML = strNewHTML
                i = i - 1
            }
        }
    }
}

function hash(string, length) {
    var length = length ? length : 32;
    var start = 0;
    var i = 0;
    var result = '';
    filllen = length - string.length % length;
    for (i = 0; i < filllen; i++) {
        string += "0";
    }
    while (start < string.length) {
        result = stringxor(result, string.substr(start, length));
        start += length;
    }
    return result;
}

function stringxor(s1, s2) {
    var s = '';
    var hash = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var max = Math.max(s1.length, s2.length);
    for (var i = 0; i < max; i++) {
        var k = s1.charCodeAt(i) ^ s2.charCodeAt(i);
        s += hash.charAt(k % 52);
    }
    return s;
}

var evalscripts = new Array();
function evalscript(s) {
    if (s.indexOf('<script') == -1) return s;
    var p = /<script[^\>]*?src=\"([^\>]*?)\"[^\>]*?(reload=\"1\")?(?:charset=\"([\w\-]+?)\")?><\/script>/ig;
    var arr = new Array();
    while (arr = p.exec(s)) appendscript(arr[1], '', arr[2], arr[3]);
    return s;
}

function $$(id) {
    return document.getElementById(id);
}

function appendscript(src, text, reload, charset) {
    var id = hash(src + text);
    if (!reload && in_array(id, evalscripts)) return;
    if (reload && $$(id)) {
        $$(id).parentNode.removeChild($$(id));
    }
    evalscripts.push(id);
    var scriptNode = document.createElement("script");
    scriptNode.type = "text/javascript";
    scriptNode.id = id;
    //scriptNode.charset = charset;
    try {
        if (src) {
            scriptNode.src = src;
        }
        else if (text) {
            scriptNode.text = text;
        }
        $$('append_parent').appendChild(scriptNode);
    }
    catch (e) {
    }
}

function in_array(needle, haystack) {
    if (typeof needle == 'string' || typeof needle == 'number') {
        for (var i in haystack) {
            if (haystack[i] == needle) {
                return true;
            }
        }
    }
    return false;
}
