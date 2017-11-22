
//À©Õ¹jq.fn
$.extend($.fn, {
	
	//Ñ¡Ïî¿¨ ***
	tab : function(opts){
		var def = {
			tabBd : "",
			  cls :"cur",
		   _event :"click"
		};
		var setting = $.extend(def,opts);	
		$(this).bind(setting._event ,fn).eq(0).trigger(setting._event);
		function fn(){
			var index = $(this).index();
			$(this).addClass(setting.cls).siblings().removeClass(setting.cls);
			$(setting.tabBd).eq(index).show().siblings().hide();			
		};
	},
	
	//ÇÐ»» ***
	tabcur : function(opts){
		var def = {
			  cls :"cur",
		   _event :"click"
		};
		var setting = $.extend(def,opts);	
		$(this).bind(setting._event ,fn).eq(0).trigger(setting._event);
		function fn(){
			$(this).addClass(setting.cls).siblings().removeClass(setting.cls);		
		};
	}
});


