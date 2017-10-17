/*******************************************************************************
 * form表单序列化
 * 
 * @param $
 */
(function($) {
	$.fn.serializeJson = function() {
		var serializeObj = {};
		var array = this.serializeArray();
		var str = this.serialize();
		$(array).each(function() {
			if (serializeObj[this.name]) {
				if ($.isArray(serializeObj[this.name])) {
					serializeObj[this.name] += "," + this.value;
				} else {
					serializeObj[this.name] += "," + this.value;
				}
			} else {
				serializeObj[this.name] = this.value;
			}
		});
		return serializeObj;
	};
})(jQuery);

/**
 * 单选,数据从数据字典获取
 * 
 * @param object{id:"",dictNo:1,selectOption:{},
 *            filter:[1,2]}
 */
function singleSelect(options) {
	var defaultOption = {
		id : "",
		dictNo : "",
		initValue : "", // 初始化值
		defaultValue : "", // 不选择时的值
		showDefaultOption : true,
		filterStyle : "remove",// remove为过滤，retain为保留
		filter : [],
		selectOption : {
			id : "",
			searchBox : false,
			width : 160
		}
	};

	options = $.extend(true, defaultOption, options);
	options.selectOption.id = options.id;
	var items = getDict(options.dictNo); // 从数据字典获取数据

	$("#" + options.id).empty();
	if (options.showDefaultOption) {
		var defaultOption = "<option";
		if (options.initValue === "") {
			defaultOption += " title='selected' selected='selected'";
		}
		defaultOption += " value='" + options.defaultValue + "'>"
				+ select_default_text + "</option>";
		$("#" + options.id).append(defaultOption);
	}

	if (items != undefined) {
		var length = items.length;
		var filter = options.filter;
		var filterStyle = options.filterStyle;
		var len = filter.length;
		var flag = false;
		for (var i = 0; i < length; i++) {
			flag = false;
			for (var j = 0; j < len; j++) {
				if (items[i].value == filter[j]) {
					flag = true;
				}
			}
			if (filterStyle == "remove") {
				if (!flag) {
					if (options.initValue != ""
							&& options.initValue == items[i].value) {
						$("#" + options.id).append(
								"<option title='selected' selected='selected' value=\""
										+ items[i].value + "\">"
										+ items[i].text + "</option>");
					} else {
						if (options.showDefaultOption == false && i == 0) {
							$("#" + options.id).append(
									"<option title='selected' value=\""
											+ items[i].value + "\">"
											+ items[i].text + "</option>");
						} else {
							$("#" + options.id).append(
									"<option value=\"" + items[i].value + "\">"
											+ items[i].text + "</option>");
						}
					}
				}
			} else {
				if (flag) {
					if (options.initValue != ""
							&& options.initValue == items[i].value) {
						$("#" + options.id).append(
								"<option title='selected' selected='selected' value=\""
										+ items[i].value + "\">"
										+ items[i].text + "</option>");
					} else {
						if (options.showDefaultOption == false && i == 0) {
							$("#" + options.id).append(
									"<option title='selected' value=\""
											+ items[i].value + "\">"
											+ items[i].text + "</option>");
						} else {
							$("#" + options.id).append(
									"<option value=\"" + items[i].value + "\">"
											+ items[i].text + "</option>");
						}
					}
				}
			}
		}
	}

	// var selectOption = options["selectOption"];
	// $("#" + options.id).selectmenu(selectOption);

	// $("#" + options.id).selectmenu("refresh");
}

function singleSelect_zrt(options) {
	var defaultOption = {
		id : "",
		dictNo : "",
		initValue : "",
		filterValue : ""
	};
	options = $.extend(true, defaultOption, options);
	var items = getDict(options.dictNo); // 从数据字典获取数据

	if (items != undefined) {
		$("#" + options.id).append("<option value=''>==请选择==</option>");
		var length = items.length;
		for (var i = 0; i < length; i++) {
			// add by fangst 顾虑不需要的项
			if (options.filterValue != "") {
				if (options.filterValue.indexOf(items[i].value) < 0) {
					if (options.initValue != ""
							&& options.initValue == items[i].value) {
						$("#" + options.id).append(
								"<option title='selected' selected='selected' value=\""
										+ items[i].value + "\">"
										+ items[i].text + "</option>");
					} else {
						$("#" + options.id).append(
								"<option value=\"" + items[i].value + "\">"
										+ items[i].text + "</option>");
					}
				}
			} else {
				if (options.initValue != ""
						&& options.initValue == items[i].value) {
					$("#" + options.id).append(
							"<option title='selected' selected='selected' value=\""
									+ items[i].value + "\">" + items[i].text
									+ "</option>");
				} else {
					$("#" + options.id).append(
							"<option value=\"" + items[i].value + "\">"
									+ items[i].text + "</option>");
				}
			}
		}
	}
}

/**
 * 单选,数据自己获取
 * 
 * @param
 * option{id:"",list:null,valueField:"",showDefaultOption:true,textField:"",selectOption:{}}
 */
function singleSelectCustom(options) {
	var defaultOption = {
		id : "",
		list : null,
		valueField : "",
		textField : "",
		initValue : "",
		backEndSearch : false,
		searchUrl : "",
		defaultValue : "", // 不选择时的值
		showDefaultOption : true,
		filterField : "",
		filter : "",
		selectOption : {
			id : "",
			backEndSearch : false,
			searchUrl : "",
			rows : "20",
			valueField : "",
			textField : "",
			searchBox : false,
			width : 160
		}
	};

	options = $.extend(true, defaultOption, options);
	options.selectOption.id = options.id;
	options.selectOption.valueField = options.valueField;
	options.selectOption.textField = options.textField;

	var items = options["list"];

	var length = 0;

	$("#" + options.id).empty();

	if (options.showDefaultOption) {
		$("#" + options.id).append(
				"<option title='selected' value='" + options.defaultValue
						+ "'>" + select_default_text + "</option>");
	}

	if (items != null) {
		length = items.length;
	}
	// 异步获取
	for (var i = 0; i < length; i++) {
		var item = items[i];
		if (options.filterField != "") {
			if (options.filter.indexOf(item[options.filterField]) != -1) {
				if (options.initValue != ""
						&& options.initValue == item[options.valueField]) {
					$("#" + options.id).children().eq(0).attr("title", "");
					$("#" + options.id).append(
							"<option title='selected' selected='selected' value=\""
									+ item[options.valueField] + "\">"
									+ item[options.textField] + "</option>");
				} else {
					if (options.showDefaultOption == false && i == 0) {
						$("#" + options.id).children().eq(0).attr("title", "");
						$("#" + options.id)
								.append(
										"<option title='selected' value=\""
												+ item[options.valueField]
												+ "\">"
												+ item[options.textField]
												+ "</option>");
					} else {
						$("#" + options.id).append(
								"<option value=\"" + item[options.valueField]
										+ "\">" + item[options.textField]
										+ "</option>");
					}
				}
			}

		} else {
			if (options.initValue != ""
					&& options.initValue == item[options.valueField]) {
				$("#" + options.id).children().eq(0).attr("title", "");
				$("#" + options.id).append(
						"<option title='selected' selected='selected' value=\""
								+ item[options.valueField] + "\">"
								+ item[options.textField] + "</option>");
			} else {
				if (options.showDefaultOption == false && i == 0) {
					$("#" + options.id).children().eq(0).attr("title", "");
					$("#" + options.id).append(
							"<option title='selected' value=\""
									+ item[options.valueField] + "\">"
									+ item[options.textField] + "</option>");
				} else {
					$("#" + options.id).append(
							"<option value=\"" + item[options.valueField]
									+ "\">" + item[options.textField]
									+ "</option>");
				}
			}

		}
	}

	// $("#" + options.id).selectmenu(options.selectOption);

	// $("#" + options.id).selectmenu("refresh");
}

/**
 * 多选
 * 
 * @param object
 */
function multiSelect(options) {
	var defaults = {
		id : null,// 单个表单元素id
		dictNo : "",
		filterStyle : "remove",// remove为过滤，retain为保留
		filter : [],// 筛选值
		initValue : "",
		defaultText : select_default_text,// 默认提示文字
		searchBox : false,// 下拉显示搜索输入框，false为不显示
		indiscriminateText : "不区分"
	};
	options = $.extend(defaults, options);

	var items = getDict(options.dictNo);
	$("#" + options.id).empty();

	var length = 0;
	if (items != null) {
		var length = items.length;
		var filter = options.filter;
		var filterStyle = options.filterStyle;
		var len = filter.length;
		var flag = false;
		for (var i = 0; i < length; i++) {
			flag = false;
			for (var j = 0; j < len; j++) {
				if (items[i].value == filter[j]) {
					flag = true;
				}
			}

			var initValueList = options.initValue.split(",");
			var _exist = $.inArray(items[i].value.toString(), initValueList);

			if (filterStyle == "remove") {
				if (!flag) {
					$("#" + options.id).append(
							"<option value=\"" + items[i].value + "\">"
									+ items[i].text + "</option>");
					if (_exist >= 0) {
						$("#" + options.id).children().eq(i).prop("selected",
								true).attr("title", "selected");
					} else {
						$("#" + options.id).children().eq(i).prop("selected",
								false);
					}
				}
			} else {
				if (flag) {
					if (_exist >= 0) {
						$("#" + options.id).append(
								"<option title='selected' selected='selected' value=\""
										+ items[i].value + "\">"
										+ items[i].text + "</option>");
					} else {
						$("#" + options.id).append(
								"<option value=\"" + items[i].value + "\">"
										+ items[i].text + "</option>");
					}
				}
			}
		}

	}

	$("#" + options.id).multiselect({
		noneSelectedText : options.defaultText,
		checkAllText : "全选",
		uncheckAllText : '全不选',
		selectedList : 4,
		searchBox : options.searchBox
	});

	$("#" + options.id).multiselect("refresh");

	var indiscriminateObj = $("#" + options.id).children().eq(0);
	$("#" + options.id).bind(
			"change",
			function() {
				var optionsList = $("#" + options.id).children("option");
				for (var i = 0; i < optionsList.length; i++) {
					var optionSelectedIndex = $.inArray(optionsList.eq(i).attr(
							"value"), $("#" + options.id).val());
					if (optionSelectedIndex >= 0) {
						optionsList.eq(i).attr("title", "selected");
					} else {
						optionsList.eq(i).attr("title", "");
					}
				}

				// 选择“不区分”，其他选择不可选
				var hasIndiscr = $.inArray("-1", $("#" + options.id).val());
				if (hasIndiscr >= 0) {
					$("#" + options.id).multiselect("uncheckAll");
					indiscriminateObj.prop("selected", true);
					$("#" + options.id).multiselect("refresh");
				}
			});

	// 下拉选项含“不区分”则隐藏header
	if (indiscriminateObj.html() == options.indiscriminateText) {
		$("#" + options.id).multiselect({
			header : false
		});
	} else {
		$("#" + options.id).multiselect({
			header : true
		});
	}
}

/**
 * 多选,数据自己获取
 * 
 * @param option{id:"",list:null,valueField:"",textField:"",selectOption:{}}
 */
function multiSelectCustom(options) {
	var defaults = {
		id : null,// 单个表单元素id
		valueField : "",
		textField : "",
		initValue : "",// 默认初始值
		list : null,
		defaultText : select_default_text,// 默认提示文字
		searchBox : false,// 下拉显示搜索输入框，false为不显示
		indiscriminateText : "不区分",
		backEndSearch : false,
		searchUrl : "",
		rows : "20"
	};
	options = $.extend(defaults, options);

	var items = options["list"];
	var length = 0;
	if (items != null) {
		length = items.length;
	}

	$("#" + options.id).empty();

	for (var i = 0; i < length; i++) {
		var initValueList = options.initValue.split(",");
		var _exist = $.inArray(items[i][options.valueField].toString(),
				initValueList);
		$("#" + options.id).append(
				"<option value=\"" + items[i][options.valueField] + "\">"
						+ items[i][options.textField] + "</option>");
		if (_exist >= 0) {
			$("#" + options.id).children().eq(i).prop("selected", true).attr(
					"title", "selected");
		} else {
			$("#" + options.id).children().eq(i).prop("selected", false);
		}
	}
	
	$("#" + options.id).multiselect({
		noneSelectedText : options.defaultText,
		checkAllText : "全选",
		uncheckAllText : '全不选',
		selectedList : 4,
		searchBox : options.searchBox,
		backEndSearch : options.backEndSearch,
		searchUrl : options.searchUrl,
		rows : options.rows,
		valueField : options.valueField,
		textField : options.textField,
		id : options.id
	});
	$("#" + options.id).multiselect("refresh");

	var indiscriminateObj = $("#" + options.id).children().eq(0);
	$("#" + options.id).bind(
			"change",
			function() {
				var optionsList = $("#" + options.id).children("option");
				for (var i = 0; i < optionsList.length; i++) {
					var optionSelectedIndex = $.inArray(optionsList.eq(i).attr(
							"value"), $("#" + options.id).val());
					if (optionSelectedIndex >= 0) {
						optionsList.eq(i).attr("title", "selected");
						optionsList.eq(i).attr("checked", "checked");
					} else {
						optionsList.eq(i).attr("title", "");
					}
				}

				// 选择“不区分”，其他选择不可选
				/*var hasIndiscr = $.inArray("-1", $("#" + options.id).val());
				if (hasIndiscr >= 0) {
					$("#" + options.id).multiselect("uncheckAll");
					indiscriminateObj.prop("selected", true);
					$("#" + options.id).multiselect("refresh");
				}*/
			});

	// 下拉选项含“不区分”则隐藏header
	/*if (indiscriminateObj.html() == options.indiscriminateText) {
		$("#" + options.id).multiselect({
			header : false
		});
	} else {
		$("#" + options.id).multiselect({
			header : true
		});
	}*/
}

/**
 * 日历控件
 * 
 * @param object
 */
function datePicker(options) {
	var defaults = {
		id : "",
		limite : false,
		changeMonth : true,
		changeYear : true,
		addDays : 0,
		maxDate : "",
		beforeShowDay : null,
		onSelect : null,
		defaultDate : null,
	};
	options = $.extend(defaults, options);

	$("#" + options.id).datepicker({
		beforeShowDay : options.beforeShowDay,
		changeMonth : options.changeMonth,
		changeYear : options.changeYear,
		onSelect : options.onSelect,
		showButtonPanel : true,
		onClose : function(dateText, inst) {
			//if ($(window.event.srcElement).hasClass('ui-datepicker-close')) {
				//document.getElementById(this.id).value = '';
			//}
		}
	});

	var curDate = new Date();
	if (options.defaultDate != null) {
		curDate = options.defaultDate;
		$("#" + options.id).datepicker("option", "defaultDate", curDate);
	}

	if (options.limite) {
		if (options.addDays != 0) {
			var nowDay = curDate;
			var d = nowDay.setDate(nowDay.getDate() + options.addDays);
			var s = new Date(d);
		} else {
			var s = curDate;
		}
		;
		$("#" + options.id).datepicker("option", "minDate", s);
		if (options.maxDate != '') {
			$("#" + options.id).datepicker("option", "maxDate",
					new Date(options.maxDate));
		}
	}
	;
	// $("#" + options.id).datepicker("setDate",getSystemInitDate());

	$("#" + options.id).datepicker().attr("readonly", "readonly").css(
			"opacity", "1");// 只可以选，不可以输入
}

/**
 * 日历范围控件组合
 * 
 * @param options
 */
function datePickerRange(options) {
	var defaults = {
		fromId : "",
		toId : "",
		changeMonth : true,
		changeYear : true
	};
	options = $.extend(defaults, options);
	$("#" + options.fromId).datepicker(
			{
				changeYear : options.changeYear,
				changeMonth : options.changeMonth,
				onClose : function(selectedDate) {
					$("#" + options.toId).datepicker("option", "minDate",
							selectedDate);
				}
			}).attr("readonly", "readonly").css("opacity", "1");// 只可以选，不可以输入
	$("#" + options.toId).datepicker(
			{
				changeYear : options.changeYear,
				changeMonth : options.changeMonth,
				onClose : function(selectedDate) {
					$("#" + options.fromId).datepicker("option", "maxDate",
							selectedDate);
				}
			}).attr("readonly", "readonly").css("opacity", "1");
}

/**
 * 输入数字三位逗号隔开(不包含小数点)
 * 
 * @param object
 */

function numFormat(obj) {
	var val = obj.value.replace(/\D/, '');
	obj.value = val.match(/\d{3}|\d{2}|\d/g).join(',');
}

/**
 * 输入数字三位逗号隔开(包含小数点)
 * 
 * @param object
 */
function floatFormat(obj) {
	var vb = obj.value.split('.');
	var val = vb[0].replace(/\D/, '');
	if (obj.value.length > 0)
		obj.value = val.match(/\d{3}|\d{2}|\d/g).join(',')
				+ (vb.length > 1 ? '.' + vb[1] : '');
}
/**
 * 小数显示三位逗号隔开
 * 
 * @param object
 */
function moneyFormat(s, n) {
	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
	t = "";
	for (var i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	return t.split("").reverse().join("") + "." + r;
}

/**
 * 非小数显示三位逗号隔开
 * 
 * @param object
 */
function intFormat(s) {
	// s = parseInt((s + "").replace(/[^\d\.-]/g, "")) + "";
	var l = s.split(".")[0].split("").reverse();
	t = "";
	for (var i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	return t.split("").reverse().join("");
}

/**
 * 自定义方法验证
 * 
 * @param options
 */
function customFun(options) {
	var defaults = {
		id : "",
		required : true,
		fun : null
	};
	options = $.extend(defaults, options);

	validateFn(defaults);
}

/**
 * 验证是否为正整数
 * 
 * @param options
 */
function IsValidDate(data) {
	var pattern = /^[1-9]\d*$/;
	if (!pattern.test(data)) {
		return false;
	} else {
		if (parseInt(data) > global_max_int) {
			return false;
		} else {
			return true;
		}
	}
}
/**
 * 验证是否为非负整数
 * 
 * @param options
 */
function IsNotNegativeDate(data) {
	var pattern = /^[1-9]\d*|0$/;
	if (!pattern.test(data)) {
		return false;
	} else {
		if (parseInt(data) > global_max_int) {
			return false;
		} else {
			return true;
		}
	}
}
/**
 * 验证是否为数字验证
 * 
 * @param options
 */
function IsNumDate(data) {
	var pattern = /^[\-\+]?([0-9]+)?([\.]([0-9]+))?$/;
	if (!pattern.test(data)) {
		return false;
	} else {
		return true;
	}
}
/**
 * 验证是否为非负数字验证
 * 
 * @param options
 */
function IsNotNegativeNumDate(data) {
	var pattern = /^([0-9]+)?([\.]([0-9]+))?$/;
	if (!pattern.test(data)) {
		return false;
	} else {
		return true;
	}
}
/**
 * 验证是否为整数验证
 * 
 * @param options
 */
function IsIntDate(data) {
	var pattern = /^[-\+]?\d+$/;
	if (!pattern.test(data)) {
		return false;
	} else {
		return true;
	}
}
/**
 * 数字验证并弹出
 * 
 * @param type:Num,Int,posInt,noNeInt,noNeNum
 */
function numMsg(id, type, msg) {
	var value = $("#" + id).val();
	var bool = true;
	if (value != "") {
		if (type == "Num" && !IsNumDate(value)) {
			alertMsg({
				msg : msg + "：必须输入数字！",
				id : id
			});
			bool = false;
		}
		if (type == "Int" && !IsIntDate(value)) {
			alertMsg({
				msg : msg + "：必须输入整数！",
				id : id
			});
			bool = false;
		}
		if (type == "posInt" && !IsValidDate(value)) {
			alertMsg({
				msg : msg + "：必须输入正整数！",
				id : id
			});
			bool = false;
		}
		if (type == "noNeInt" && !IsNotNegativeDate(value)) {
			alertMsg({
				msg : msg + "：必须输入非负整数！",
				id : id
			});
			bool = false;
		}
		if (type == "noNeNum" && !IsNotNegativeNumDate(value)) {
			alertMsg({
				msg : msg + "：必须输入非负数字！",
				id : id
			});
			bool = false;
		}
	}
	return bool;
}
/**
 * 相互比较,数字验证并弹出
 * 
 * @param type:Num,Int,posInt,noNeInt,noNeNum
 */
function compareMsg(minID, maxID, type, msg) {
	if (!numMsg(minID, type, msg)) {
		return false;
	}
	if (!numMsg(maxID, type, msg)) {
		return false;
	}
	var bool = true;
	var minvalue = $("#" + minID).val();
	var maxvalue = $("#" + maxID).val();
	if (maxvalue != "" && parseInt(maxvalue) == 0) {
		alertMsg({
			msg : msg + "：上限不能为0，请重新输入！",
			id : maxID
		});
		bool = false;
	}
	if (minvalue != "" && maxvalue != ""
			&& parseFloat(maxvalue) < parseFloat(minvalue)) {
		alertMsg({
			msg : msg + "：大小关系不正确，请重新输入！",
			id : maxID
		});
		bool = false;
	}
	return bool;
}
/**
 * 表单验证控件的初始化参数
 * 
 * @param object
 */
function validateEngine(object) {
	$("#" + object.id).validationEngine({
		maxErrorsPerField : 1,
		showOneMessage : true,
		scroll : false,
		autoHidePrompt : true,
		autoHideDelay : validateDelay
	// validationEventTriggers:"blur"
	});
}

/**
 * 弹出悬浮层形式操作信息框
 * 
 * @param object
 * @param m_type:operInfo,operSuccess,operError,operWarn
 */
function operTip(options) {
	var defaults = {
		m_msg : '',
		m_type : ''
	};
	var opts = $.extend(defaults, options);
	var tipDiv = ("<span class='" + opts.m_type + "'><em>" + opts.m_msg + "</em></span>");// 获取提示信息和类别
	$(tipDiv).appendTo("body");
	setTimeout(function() {
		$("." + opts.m_type).remove();
	}, 2000);// 定时器2秒后消失
};

// 纵向tabs
function tabsVerti(object) {
	$('ul.' + object).each(function() {
		$(this).find('li').each(function(i) {
			$(this).click(function() {
				$(this).addClass('current').siblings().removeClass('current');
			});
		});
	});
}

/* 定制水平tab */
function horiTabs(idName) {
	$("#" + idName).find('ul li').click(
			function() {
				var liindex = $("#" + idName).find('ul li').index(this);
				$(this).addClass('on').siblings().removeClass('on');
				$("#" + idName).find('.product-wrap div').eq(liindex).fadeIn(
						150).siblings('div').hide();
				var liWidth = $(this).width();
				$("#" + idName).find('ul p').stop(false, true).animate({
					'left' : liindex * liWidth + 'px'
				}, 300);
			});
}

/* 只读input添加样式 */
$(function() {
	$("input[type='text'][readonly]").addClass("stateDis");
	// $("input[type='text']").css("width","146px");
});

/**
 * 操作员下拉控件
 * 
 * @param option
 */
function operatorMultiSelect(options) {
	var defaultOption = {
		id : "operatorMultiSelect",
		url : "",
		searchBox : true
	};
	options = $.extend(true, defaultOption, options);
	postData({
		url : options.url,
		callback : function(result) {
			multiSelectCustom({
				id : options.id,
				list : result,
				valueField : "operatorNo",
				textField : "operatorName",
				searchBox : options.searchBox
			});
		}
	});
}

/**
 * 公司 产品 下拉框 需要传入url 返回值需要是pageDTO类型
 */
function fundAndAssetMultiSelect(options) {
	var defaultOption = {
		fundSelectOptionId : "fundSelectOptionId",
		assetSelectOptionId : "assetSelectOptionId",
		getFundPageDTOUrl : "",
		getAssetPageDTOUrl : "",
		searchBox : true
	};

	options = $.extend(true, defaultOption, options);

	postData({
		url : options.getFundPageDTOUrl,
		// data:{companyId:1000},//在方法里取当前登录员的公司ID
		callback : function(data) {
			var array = new Array();
			var items = data.rows;
			if (items != null) {
				for (var i = 0; i < items.length; i++) {
					var fundName = items[i].fundName;
					var fundId = items[i].fundId;
					var item = {
						value : fundId,
						text : fundName
					};
					array.push(item);
				}
			} else {
				array = null;
			}
			multiSelectCustom({
				id : options.fundSelectOptionId,
				showDefaultOption : true,
				list : array,
				valueField : "value",
				textField : "text",
				searchBox : options.searchBox
			});
		}
	});

	multiSelectCustom({
		id : options.assetSelectOptionId,
		showDefaultOption : true,
		list : null,
		valueField : "value",
		textField : "text",
		searchBox : options.searchBox
	});

	$("#" + options.fundSelectOptionId).bind("change", function() {
		var v = $("#" + options.fundSelectOptionId).val();
		var fundIdList = "";
		for (var i = 0; i < v.length; i++) {
			fundIdList += v[i] + ",";
		}
		// console.log(fundIdList);
		postData({
			url : options.getAssetPageDTOUrl,
			data : {
				fundIdList : fundIdList
			},// 在方法里set当前登录员的公司Id
			callback : function(data) {
				var array = new Array();
				var items = data.rows;
				if (items != null) {
					for (var i = 0; i < items.length; i++) {
						var assetName = items[i].assetName;
						var assetId = items[i].assetId;
						var item = {
							value : assetId,
							text : assetId + "-" + assetName
						};
						array.push(item);
					}
				} else {
					array = null;
				}
				multiSelectCustom({
					id : options.assetSelectOptionId,
					showDefaultOption : true,
					list : array,
					valueField : "value",
					textField : "text",
					searchBox : options.searchBox
				});
			}
		});
	});
}

/**
 * 日期格式化显示
 * 
 * @param srcDate
 *            日期
 * @param mark
 *            间隔符
 * @returns {String}
 */
function formatDate(srcDate, mark) {
	var dateValue = "";

	if (srcDate != undefined && srcDate.toString() != "") {
		dateValue = srcDate.toString();
	}

	if (mark == undefined) {
		mark = "/";
	}
	if (dateValue == "" || dateValue == "0")
		dateValue = "";
	else {
		var year = dateValue.charAt(0) + dateValue.charAt(1)
				+ dateValue.charAt(2) + dateValue.charAt(3);
		var month = dateValue.charAt(4) + dateValue.charAt(5);
		var day = dateValue.charAt(6) + dateValue.charAt(7);
		dateValue = year + mark + month + mark + day;
	}

	return dateValue;
}

/**
 * 日期格式化显示
 * 
 * @param srcDate
 *            日期
 * @param mark
 *            间隔符
 * @returns {String}
 */
function formatTime(srcTime, mark) {
	var b = / /i;
	var timeValue = "";
	if (!srcTime || srcTime.toString() == "") {
		timeValue = "";
	} else {
		timeValue = srcTime.toString();

		var length = timeValue.length;
		for (var i = 6; i > length; i--) {
			timeValue = "0" + timeValue;
		}

		if (timeValue == "")
			timeValue = "00" + mark + "00" + mark + "00";
		else {
			var tmp = "";
			for (i = 0; i < timeValue.length; i++) {
				if ((i > 0) && (i % 2 == 0)) {
					tmp += mark;
				}

				tmp += timeValue.charAt(i);
			}

			timeValue = tmp;
		}
	}

	return timeValue;
}
// 日期格式化方法
Date.prototype.Format = function(fmt) { // author: meizz
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

Date.prototype.addDays = function(d) {
	this.setDate(this.getDate() + d);
	return this;
};

Date.prototype.addWeeks = function(w) {
	this.addDays(w * 7);
	return this;
};

Date.prototype.addMonths = function(m) {
	var d = this.getDate();
	this.setMonth(this.getMonth() + m);
	if (this.getDate() < d)
		this.setDate(0);
	return this;
};

Date.prototype.addYears = function(y) {
	var m = this.getMonth();
	this.setFullYear(this.getFullYear() + y);
	if (m < this.getMonth()) {
		this.setDate(0);
	}
	return this;
};
function getCurrentPage() {
	var page = 0;
	var text = $("#numPagesId").text();
	if (text != null && text.length > 0) {
		var pagestr = text.split("/")[0];
		if (pagestr != null && pagestr.length > 0)
			page = parseInt(pagestr) - 1;
	}
	return page;
};
function setSelectItem(object, fieldname, fieldvalue) {
	object.selectname = fieldname;
	object.selectvalue = fieldvalue;
};
function getSelectItem(object, subobject, rId) {
	var fieldname = object.selectname;
	var fieldvalue = object.selectvalue;
	var value = getGridColValue(subobject, rId, fieldname);// 获取成交序号
	if (fieldvalue != undefined && fieldvalue == value)
		object.grid.selectRowById(rId,false,true,true);
};
$.validator.setDefaults({
	highlight : function(a) {
		$(a).closest(".form-group").removeClass("has-success").addClass(
				"has-error")
	},
	success : function(a) {
		a.closest(".form-group").removeClass("has-error")
				.removeClass("p-error").addClass("has-success")
	},
	errorElement : "label",
	errorPlacement : function(a, b) {
		if (b.is(":radio") || b.is(":checkbox")) {
			a.appendTo(b.parent().parent().parent());
		} else {
			a.appendTo(b.parent());
		}
	},
	errorClass : "help-block m-b-none",
	validClass : "help-block m-b-none"
});
// 手机号码验证
jQuery.validator
		.addMethod(
				"isPhone",
				function(value, element) {
					var length = value.length;
					return this.optional(element)
							|| (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
									.test(value));
				}, "请正确填写您的手机号码。");

// 电话号码验证
jQuery.validator.addMethod("isTel", function(value, element) {
	var tel = /^0\d{2,3}-?\d{7,8}$/;//区号+号码，区号以0开头，3位或4位
	return this.optional(element) || (tel.test(value));
}, "请正确填写您的电话号码。");

//电话号码或手机号码验证
jQuery.validator.addMethod("isTelOrPhone", function(value, element) {
	var tel = /^0\d{2,3}-?\d{7,8}$/;//区号+号码，区号以0开头，3位或4位
	var phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;	
	return this.optional(element) || (tel.test(value) || phone.test(value));
}, "请正确填写您的电话或手机号码。");


// 匹配密码，长度在6-20之间，必须包含数字和字母
jQuery.validator.addMethod("isPwd", function(value, element) {
	var str = value;
	if (str.length < 6 || str.length > 20)
		return false;
	if (!/[a-zA-Z]/.test(str))
		return false;
	if (!/[0-9]/.test(str))
		return false;
	var p = /(?!^\d+$)(?!^[a-zA-Z]+$)^[0-9a-zA-Z]{6,20}$/;
	if (!p.test(str))
		return false;

	return true;
}, "长度在6-20之间，必须且只能包含数字和字母");
// 数字和字母
jQuery.validator.addMethod("onlyLetterNumber", function(value, element) {
	var str = value;
	if (str.length < 6 || str.length > 20)
		return false;
	if (!/^[0-9a-zA-Z]+$/.test(str))
		return false;

	return true;
}, "只能填写数字与英文字母");
// 登录账户验证,必须是手机号码或者邮箱正确格式
jQuery.validator.addMethod("isLonginAccount", function(value, element) {
	var str = value;
	if (str.length < 6)
		return false;
	if (!(/^1[3|4|5|7|8][0-9]\d{8,8}$/.test(str))
			&& !(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
					.test(str))) {
		return false;
	}
	return true;
}, "请输入正确的邮箱或者手机号码");
// 登录账户验证,必须是手机号码或者邮箱正确格式
function checkSpecialChar(str, element) {
	var SpecialCharacters = "~!@/'\"#$%&^*(){}[]+-_:;<>,?|";
	for (var i = 0; i < SpecialCharacters.length; i++) {
		if (str.indexOf(SpecialCharacters[i]) != -1) {
			layer.tips("包含特殊字符！", $("#" + element), {
				tips : [ 1, '#ec2d2d' ],
				time : 4000
			});
			return false;
		}
	}
	return true;
};
function addValidatorLabel(id,text){
	 $("#"+id).closest(".form-group").removeClass("has-success").addClass(
		"has-error");
	var obj=$("label#"+id+"-error");
	if(obj!=undefined && obj!=null && obj.length>0){
		obj.html(text);
		obj.css("display","block");
	}else{
		var icon="<label id=\""+id+"-error\" class=\"help-block m-b-none\" for=\""+id+"\">"+text+"</label>";
		 $("#"+id).after(icon);
	}
}
function delValidatorLabel(id){
	 $("#"+id).closest(".form-group").removeClass("has-error")
		.removeClass("p-error").addClass("has-success");
	 $("label#"+id+"-error").html("");
}