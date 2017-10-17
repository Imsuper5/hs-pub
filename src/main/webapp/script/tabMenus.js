function menuEvent() {
	//var t = $("#j-nav-menu-container"), i = t.find(".nav-show-control");
	/*function n() {
		s = setTimeout(function() {
			i.css({
				overflow : "visible"
			}).addClass("nav-show-control-show")
		}, 100)
	}
	function e() {
		clearTimeout(s), i.css({
			overflow : "hidden"
		}).removeClass("nav-show-control-show")
	}
	try {
		var s = 0;
		t.find(".menu-title").mouseenter(function() {
			$(this).parent().hasClass("menu-item-index") || n()
		}), t.find(".menu-item-box").mouseleave(e)
	} catch (m) {

	}*/
}
function getmenus(obj, divid, x, y) {
	var div = '';
	var top = '<div class="menu-item menu-item-lanmu"><a class="menu-title" href="javascript:;">';
	var top1 = '</a><div class="menu-content"> ';
	var subtop = ' <ul class="menu-sub-list"> <li class="menu-sub-item-wp">';
	var bottom = "</div></div>";
	var menus = obj.items;
	if (menus != undefined) {
		for (var i = 0; i < menus.length; i++) {
			div += top + menus[i].title + top1;
			var chilren = menus[i].items;
			for (var j = 0; j < chilren.length; j++) {
				var url=getUrlRandom(chilren[j].url);
				div += subtop + '<a class="menu-sub-item J_menuItem" href="'
						+ url + '">' + chilren[j].title
						+ '</a></li> </ul>';
				// 首页
				if (i == x && j == y) {
					firstFr(url)
				}
			}
			div += bottom;
		}
	}
	 
	$("#" + divid).append(div);
}
function getIndexmenus(obj, divid, x, y) {
	var div = '';
	var top1 = '</span><span class=""></span></a><ul class="nav nav-second-level">';
	var bottom = "</ul></li>";
	var menus = obj.items;
	var faArray = ['fa-my-home','fa-my-group','fa-my-manage','fa-my-setting']
	if (menus != undefined) {
		for (var i = 0; i < menus.length; i++) {
			var top = '<li class="active"><a href="javascript:;" disabled class="my_active"><i class="fa my-fa '+faArray[i]+'"></i><span class="nav-label">';
			div += top + menus[i].title + top1;
			var chilren = menus[i].items;
			for (var j = 0; j < chilren.length; j++) {
				var url=getUrlRandom(chilren[j].url);
				if(i == x && j == y){
					div += ' <li class="my_li_active"><a class="J_menuItem my_active" href="' + url
					+ '">' + chilren[j].title + '</a></li>';
				}else{
					div += ' <li><a class="J_menuItem" href="' + url
					+ '">' + chilren[j].title + '</a></li>';
				}
				// 首页
				if (i == x && j == y) {
					firstFr(url)
				}
			}
			div += bottom;
		}
	}
	$("#" + divid).append(div);
}
function firstFr(url) {
	var firstTitle = '<a href="javascript:;" class="my_active J_menuTab" data-id="'
			+ url + '">首页</a>';
	$(".page-tabs-content").append(firstTitle);
	var firstFr1 = '<iframe class="J_iframe" name="iframe0" width="100%" src="';
	var firstFr2 = '" frameborder="0" data-id="';
	var firstFr3 = '" seamless></iframe>';
	$("#content-main").append(firstFr1 + url + firstFr2 + url + firstFr3);
}
function getUrlRandom(url) {
	if (url != null) {
		// 加入随机数，解决url被浏览器缓存导致不刷新的问题
		var randomnumber = Math.floor(Math.random() * 100000);
		url = url + "?randomnumber=" + randomnumber;
	}
	return url;
}
