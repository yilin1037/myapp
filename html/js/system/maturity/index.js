var remind = new Vue({
	el: '#remind',
	data: {
		maturity:[],
		text:"点击订购",
		text1:"到期时间"
	},
	mounted: function() {
		var self = this;
		var maturityArr = [];
		$.ajax({
			url: '/index.php?m=system&c=maturity&a=maturity',
			type: "POST",
			dataType:"json",
			data:{},
			success:function(data){
				if(data){
					for(var j = 0; j < data.length; j++){
						if(data[j].shoptype == "TB"){
							data[j].src = "images/taobao.jpg";
							data[j].href = "https://fuwu.taobao.com/ser/detail.html?spm=a1z13.8114210.1234-fwlb.4.SAoPrG&service_code=FW_GOODS-1000009415&from_key=%E8%B6%85%E7%BE%A4&tracelog=search";
							maturityArr.push(data[j]);
						}else if(data[j].shoptype == "TM"){
							data[j].src = "images/tianmao.png";
							data[j].href = "https://fuwu.taobao.com/ser/detail.html?spm=a1z13.8114210.1234-fwlb.4.SAoPrG&service_code=FW_GOODS-1000009415&from_key=%E8%B6%85%E7%BE%A4&tracelog=search";
							maturityArr.push(data[j]);
						}else if(data[j].shoptype == "ALBB"){
							data[j].src = "images/1688.png";
							data[j].href = "https://pc.1688.com/product/detail.htm?productCode=PiBMDLfi2wV%2Fp3ZRTkab3cOfmF8WUoLTiDzQ1f89VUY%3D&productType=GROUP&mkey=k_jqyserp&_context_layout=";
							maturityArr.push(data[j]);
						}else if(data[j].shoptype == "JD"){
							data[j].src = "images/jingdong.png";
							data[j].href = "http://fw.jd.com/430022.html";
							maturityArr.push(data[j]);
						}else if(data[j].shoptype == "EC"){
							data[j].src = "images/ecshop.png";
							
							maturityArr.push(data[j]);
						}else if(data[j].shoptype == "1HD"){
							data[j].src = "images/1haodian.png";
							data[j].href = "http://fuwu.yhd.com/application/gotoAppDetail.do?appId=4122";
							maturityArr.push(data[j]);
						}else if(data[j].shoptype == "ZBB"){
							data[j].src = "images/zhe800.png";
							data[j].href = "https://openapi.zhe800.com/oauth/code?response_type=code&client_id=ZDNhYTY2YWUtN2Y4&redirect_uri=https://erp.jetm3.com/index_onerp_zhe800.php&state=jiaqing";
							maturityArr.push(data[j]);
						}else if(data[j].shoptype == "YZ"){
							data[j].src = "images/youzan.png";
							data[j].href = "https://open.koudaitong.com/oauth/authorize?response_type=code&state=jiaqing&client_id=b67e1ce1f463a5b4fc&redirect_uri=https://erp.jetm3.com/index_onErp_youzan.php";
							maturityArr.push(data[j]);
						}else if(data[j].shoptype == "MGJ"){
							data[j].src = "images/mogujie.png";
							data[j].href = "https://oauth.mogujie.com/authorize?response_type=code&app_key=100175&redirect_uri=https://erp.jetm3.com/index_onErp_mgj.php&state=JQ";
							maturityArr.push(data[j]);
						}else if(data[j].shoptype == "MLS"){
							data[j].src = "images/meilishuo.png";
							data[j].href = "https://oauth.meilishuo.com/authorize?response_type=code&app_key=100175&redirect_uri=https://erp.jetm3.com/index_onErp_mgj.php&state=JQ";
							maturityArr.push(data[j]);
						}else if(data[j].shoptype == "CCJ"){
							data[j].src = "images/chuchujie.png";
							data[j].href = "http://seller.chuchujie.com/sqe/Shop/get_shop_secret/org_name/JQingOCT11equr";
							maturityArr.push(data[j]);
						}else if(data[j].shoptype == "WD"){
							data[j].src = "images/weidian.png";
							data[j].href = "https://fuwu.open.weidian.com/service_market/detail.do?app_key=670446";
							maturityArr.push(data[j]);
						}else if(data[j].shoptype == "BB"){
							data[j].src = "images/beibei.png";
							data[j].href = "http://api.open.beibei.com/outer/oauth/app.html?app_id=eepv";
							maturityArr.push(data[j]);
						}else if(data[j].shoptype == "MD"){
							data[j].src = "images/mengdian.png";
							data[j].href = "https://open.mengdian.com/oauth2/authorize?client_id=g3g9RZ2S&client_secret=V7qr0laZTNaWJcNo&redirect_uri=https://erp.jetm3.com/index_onErp_md.php&response_type=code&state=fuwu&scope=app_config";
							maturityArr.push(data[j]);
						}
					}
					self.maturity = maturityArr;
					
				}
			}
		});
		
	},
	methods: {

	},
});



