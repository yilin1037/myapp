#微店开放平台sdk php版

##当前版本信息

    当前版本： V0.1.0
    发布日期： 2015-11-10

##修改历史
 
    V0.1.0  2015-11-10  版本发布。

##文件结构信息

    api/
        ApiBase.php:				api基础类，定义了构造基础API类的处理，例如：生成参数public,param
        CPSClientApi.php:		CPS相关接口
        OAuthClientApi.php:		OAuth授权相关接口
        OrderClientApi.php:	 	订单相关接口
        ProductClientApi.php:	商品相关接口
        SimpleApiClient.php:		API通用接口处理，定义了HTTP post/get 方法，参数$public, $param 
        
    includes/
    		AutoLoader.php			PHP类文件自动状态处理
    		Defines.php				配置文件定义
    		HttpResponse.php			HTTP请求响应结果包装类
		Logger.php				日志调试类，目前是输出到响应结果中，实际使用中可以改为输出到日志文件，或者屏蔽掉日志输出处理
		NetUtils.php				Http请求封装类
		OAuthException.php		异常类
		WebStart.php				PHP 引用页面，提供了获取或设置AccessToken处理。
	token_share_example
		RedisHelper.php			redis API操作类
		RedisCacheApi.php		使用redis API实现Access_Token全局共享（实际使用中，需要根据服务型，或自用型）
		DBHelper.php				使用Mysql API实现Access_Token全局共享（实际使用中，需要根据服务型，或自用型）
	demo
		cps_demo.php				CPS相关接口演示
		oauth_demo.php			Oauth授权接口相关演示
		order_api_demo.php		订单相关接口演示
		product_api_demo.php		商品相关接口演示
		simple_api_test.php		API通用接口处理演示
    	index.php					SDK DEMO预览索引页
    	authorize.php				服务型应用授权跳转页
    	authorize_callback.php		服务型应用获取授权CODE后的回调页面（跳转该地址会带入参数：code,state）
  
    微店开放平台api还在不断增加中，详见： http://wiki.open.weidian.com/

##使用示例说明
   具体接口使用示例请参考demo中的oauth_demo,cps_demo,order_api_demo,product_api_demo中的对应使用示例。  
   基本使用方式有两种，以获取单个商品(vdian.item.get)为例:  
   
      调用方式一
       	$wdProductApi = new ProductClientApi ('access_token');
		$wdProductApi->getProduct ( '1497233640' )->data;
示例中的第一个参数 {itemid:1497233640} 对应开放平台接口描述中的param，  
不同的用户调用API只需要在new ProductClientApi 是传入不同的$access_token即可。 
public 参数在getProduct方式实现中调用父类（ApiBase）实现的。
形式： parent::buildPublicValue('vdian.item.get', $version )  
唯独$method是必传参数，如下：
$method, $version = "1.0", $format = "json"

    调用方式二
   	自行实现构造param,public 参数。
   	使用 SimpleApiClient.php 中的get/post发起HTTP 请求调用（建议统一采用POST方式，避免HTTP GET请求链接超长，无法完成正常请求处理问题）。

##联系我们
    微店开放平台官网：https://web.open.weidian.com/index
    可以访问我们的资料库获得详尽的技术文档：https://wiki.open.weidian.com/
    在线接口测试工具： https://web.open.weidian.com/playground/index
    此外，您可以通过企业QQ群 (577531386) 直接咨询