var _gridId = 0;// gridID
var _menuRightId = ""; // 菜单附加权限 1-查询,2-操作
var _appServer = "";// 项目路径 如：/jcmanage
// test

/**
 * 公用js初始化
 */
function commonInit(option) {
	var defaultOption = {
		modelEnName : "",
		queryUrl : "",
		exportUrl : "",
		printUrl : "",
		exportExtraData : "",
		gridObj : null,
		costomQueryFormId : "",
		gridId : "", // 一个页面如果有多个grid时，需要传这个值
		proQuery : {
			width : "auto",
			height : "auto",
			afterOpenDialog : null
		},
		keywordQuery : {
			queryFormId : "",
			keyword : null,
			keyId : null
		},
		beforeQuery : null,
		afterQuery : null,
		printHead : null,
		fieldSelectID : "fieldSelect",// 字段选择
		printID : "print",// 打印
		exportID : "export",// 导出
		refreshID : "refreshBtn",// 刷新
		keywordBtnID : "keywordBtn",// 快捷查询按钮
		keywordFieldID : "keywordField",// 快捷查询输入框
		proQueryBtnID : "submit",// 高级查询
		moreOperID : "moreOper",// 更多操作
		defaultSortFieldName : null,// 默认排序字段
		defaultSortType : "desc",// 默认排序方式
		pageResize : null,// 页面自适应
		advQueryBtnID : "advQueryBtn",// 高级查询显隐按钮
		seniorBtnID : "seniorBtn",// 高级查询触发按钮
		advQueryFormID : "advQueryForm",// 高级查询from表单
		beforeAdvQuery : null,// 高级查询前触发事件
		afterAdvQuery : null
	// 高级查询后触发事件
	};

	option = $.extend(true, defaultOption, option);

	// 更多操作点击初始化
	// moreOper(option.moreOperID);

	// 字段选择监听
	$("#" + option.fieldSelectID).bind("click", function() {
		if (option.gridId) {
			_gridId = option.gridId;
		}
		fieldSelect();
	});

	// 刷新
	$("#" + option.refreshID).click(
			function() {
				if (option.beforeQuery != null
						&& typeof (option.beforeQuery) == "function") {
					var r = option.beforeQuery();
					// console.log(r);
					if (r === false) {
						return;
					}
				}
				// 找到排序属性
				var orderName = option.gridObj.grid.orderName;
				var order = option.gridObj.grid.order;
				if (orderName == undefined || orderName == "") {
					orderName = option.defaultSortFieldName;
					order = option.defaultSortType;
				}
				option.gridObj.bind(option.queryUrl, option.costomQueryFormId,
						option.keywordQuery.keyword);
				option.gridObj.refresh(default_page_size, 0, orderName, order);
				formReset(option.modelEnName + "ProQueryForm");// 清空表单数据
				if (option.afterQuery != null
						&& typeof (option.afterQuery) == "function") {
					option.afterQuery();
				}
			});

	// 导出Excel
	if (option.exportUrl != "") {
		$("#" + option.exportID).click(function() {
			exportData(option);
		});
	}
	// 快捷查询
	$("#" + option.keywordBtnID).click(function() {
		keywordSearch(option);
	});
	$("#" + option.keywordFieldID).keyup(function(e) {
		if (e.keyCode == 13) {
			keywordSearch(option);
		}
	});

	// 高级查询显隐事件
	$("#" + option.advQueryBtnID).click(function() {
		if ($("#gjSearch").css("display") == "none") {
			$("#gjSearch").css("width", $(window).width() - 13);
			$("#gjSearch").show();
		} else {
			$("#gjSearch").hide();
		}
	});
	// 高级查询
	$("#" + option.seniorBtnID).click(
			function() {
				if (option.beforeAdvQuery != null
						&& typeof (option.beforeAdvQuery) == "function") {
					var r = option.beforeAdvQuery();
					if (r === false) {
						return;
					}
				}
				// 找到排序属性
				var orderName = option.gridObj.grid.orderName;
				var order = option.gridObj.grid.order;
				if (orderName == undefined || orderName == "") {
					orderName = option.defaultSortFieldName;
					order = option.defaultSortType;
				}
				option.gridObj.bind(option.queryUrl, option.advQueryFormID);
				option.gridObj.refresh(default_page_size, 0, orderName, order);
				// formReset(option.advQueryFormID);// 清空表单数据

				$("#gjSearch").hide();
				if (option.afterAdvQuery != null
						&& typeof (option.afterAdvQuery) == "function") {
					option.afterAdvQuery();
				}
			});
	$("#reset").click(function() {
		if ($("#" + option.advQueryFormID).length > 0) {
			$("#" + option.advQueryFormID)[0].reset();
		}
		$("#gjSearch").hide();
	});
	addTabindexAuto(option.modelEnName + "WrapProQuery");
	// 高级查询
	$("#" + option.proQueryBtnID)
			.attr("dialogid", (option.modelEnName + "WrapProQuery"))
			.click(
					function() {
						if (option.beforeQuery != null
								&& typeof (option.beforeQuery) == "function") {
							var r = option.beforeQuery();
							if (r === false) {
								return;
							}
						}
						$("#" + option.modelEnName + "WrapProQuery")
								.dialog(
										{
											modal : true,
											width : option.proQuery.width,
											height : option.proQuery.height,
											title : '高级查询',
											close : function() {
												$(this).dialog('destroy');
											},// 关闭后还原初始状态
											buttons : {
												'确定' : function() {
													option.gridObj
															.bind(
																	option.queryUrl,
																	option.modelEnName
																			+ "ProQueryForm");
													option.gridObj.refresh();
													$(
															"#"
																	+ option.keywordFieldID)
															.val("");
													$(this).dialog('close');
													if (option.afterQuery != null
															&& typeof (option.afterQuery) == "function") {
														option.afterQuery();
													}
												},
												'取消' : function() {
													$(this).dialog('close');
												},
												'重置' : function() {
													formReset(option.modelEnName
															+ "ProQueryForm");
												}
											}
										});
						$(".ui-dialog-buttonset button:last").addClass(
								"btnResetPop");// 重置按钮添加样式

						if (option.proQuery.afterOpenDialog != null) {
							option.proQuery.afterOpenDialog();
						}
					});
	$(window).resize(
			function() {
				$("#gjSearch").css("width", $(window).width() - 13);
				if (option.pageResize != null
						&& typeof (option.pageResize) == "function") {
					option.pageResize();
				}
			});
}

/**
 * 是否有操作权限
 * 
 * @returns {Boolean}
 */
function hasOperRight() {
	// return _menuRightId.indexOf("2")>=0;
	return true;
}

/**
 * 快捷查询
 * 
 * @param option
 */
function keywordSearch(option) {
	if (option.beforeQuery != null && typeof (option.beforeQuery) == "function") {
		var r = option.beforeQuery();
		if (r === false) {
			return;
		}
	}
	var orderName = option.gridObj.grid.orderName;
	var order = option.gridObj.grid.order;
	if (orderName == undefined || orderName == "") {
		orderName = option.defaultSortFieldName;
		order = option.defaultSortType;
	}
	if (option.keywordQuery.queryFormId != "") {
		option.gridObj.bind(option.queryUrl, option.keywordQuery.queryFormId);
		option.gridObj.refresh(default_page_size, 0, orderName, order);
		// option.gridObj.refresh(100,0, option.defaultSortFieldName,
		// option.defaultSortType);
	} else {
		var keywords = "";
		if (typeof (option.keywordQuery.keyword) == "function") {
			keywords = option.keywordQuery.keyword();
		} else {
			keywords = option.keywordQuery.keyword;
		}
		var keyId = option.keywordQuery.keyId;
		formReset(option.modelEnName + "ProQueryForm");
		option.gridObj.bind(option.queryUrl, option.keywordQuery.queryFormId,
				keywords, keyId);
		option.gridObj.refresh(default_page_size, 0, orderName, order);
		// option.gridObj.refresh(100,0, option.defaultSortFieldName,
		// option.defaultSortType);
	}
	if (option.afterQuery != null && typeof (option.afterQuery) == "function") {
		option.afterQuery();
	}
}

var _oldData = {};

/**
 * 操作初始化
 * 
 * @param option
 */
function operInit(option) {
	var defaultOption = {
		gridObj : null,
		modelEnName : "", // 模块英文名
		modelName : "", // 模块中文名
		keyField : "", // 主键,多个用逗号隔开
		add : {
			width : "auto",
			height : "auto",
			submitUrl : "",
			beforeOpenDialog : null,
			afterOpenDialog : null,
			beforeSubmit : null,
			afterSubmit : null,
			addFormId : null,
			unresetId : ""
		},
		update : {
			width : "auto",
			height : "auto",
			getUrl : "",
			afterGetData : null,
			submitUrl : "",
			beforeOpenDialog : null,
			afterOpenDialog : null,
			beforeSubmit : null,
			afterSubmit : null,
			beforeUpdate : null,
			rightCode : ""
		},
		destory : {
			delUrl : "",
			keyDesField : "",
			updateStatus : "",
			msg : "",
			beforeOpertor : null
		},
		freeze : {
			freUrl : "",
			keyDesField : "",
			updateStatus : "",
			msg : "",
			beforeOpertor : null
		},
		unfreeze : {
			unfreUrl : "",
			keyDesField : "",
			updateStatus : "",
			msg : "",
			beforeOpertor : null
		}
	};

	option = $.extend(true, defaultOption, option);

	// 新增
	if (hasOperRight()) {
		$("#" + option.modelEnName + "Add")
				.attr("dialogid", (option.modelEnName + "WrapAdd"))
				.click(
						function() {
							if (option.add.beforeOpenDialog != null) {
								if (!option.add.beforeOpenDialog()) {
									return;
								}
							}
							$("#" + option.modelEnName + "WrapAdd")
									.dialog(
											{
												modal : true,
												width : option.add.width,
												height : option.add.height,
												title : '新建' + option.modelName,
												close : function() {
													$(this).dialog('destroy');
												},// 关闭后还原初始状态
												buttons : {
													'确认' : function() {
														var formId = option.modelEnName
																+ "AddForm";
														if (option.add.addFormId != null) {
															formId = option.add
																	.addFormId();
														}
														var v = $("#" + formId)
																.validationEngine(
																		'validate');// 验证不通过返回false
														if (!v) {
															return;
														}
														ajaxSubmit({
															url : option.add.submitUrl,
															gridObj : option.gridObj,
															formId : formId,
															winId : option.modelEnName
																	+ "WrapAdd",
															afterSubmit : option.add.afterSubmit
														});
													},
													'取消' : function() {
														formReset(
																option.modelEnName
																		+ "AddForm",
																option.add.unresetId);
														$(this).dialog('close');
													}
												}
											});
						});

		addTabindexAuto(option.modelEnName + "WrapAdd");
	} else {
		$(".hasOperRight").remove();// 移除有操作权限的元素集合
	}

	addTabindexAuto(option.modelEnName + "WrapUpdate");

	// 绑定列表行双击事件
	if (checkOperRigth(option.update.rightCode) && option.update.getUrl) {
		var grid = option.gridObj.grid;
		if (undefined == grid) {
			grid = option.gridObj;
		}
		grid.attachEvent("onRowDblClicked", function(rowId) {
			openUpdateWin(option, rowId);
		});
	}

	// 绑定修改按钮事件
	if (checkOperRigth(option.update.rightCode) && option.update.getUrl) {
		$("#" + option.modelEnName + "Update").attr("dialogid",
				(option.modelEnName + "WrapUpdate")).click(function() {
			var selectedId = null;
			var grid = option.gridObj.grid;
			if (undefined == grid) {
				selectedId = option.gridObj.getSelectedRowId();
			} else {
				selectedId = grid.getSelectedRowId();
			}
			if (selectedId != null) {
				openUpdateWin(option, selectedId);
			} else {
				alertMsg({
					msg : "请选择要操作的行"
				});
				return;
			}
		});
	}

	// 绑定删除事件
	// if(hasOperRight()){
	// $("#"+option.modelEnName+"Delete").click(function(){
	// deleteGrid(option);
	// alert("123");
	// });
	// }
	// 绑定注销事件
	if (hasOperRight()) {
		$("#" + option.modelEnName + "Destory").click(function() {
			cancelGrid_zrt({
				gridObj : option.gridObj,
				modelEnName : option.modelEnName, // 模块英文名
				modelName : option.modelName, // 模块中文名
				keyField : option.keyField, // 主键,多个用逗号隔开
				url : option.destory.delUrl,
				statusField : option.destory.keyDesField,
				status : option.destory.updateStatus,
				msg : option.destory.msg,
				destory : {
					beforeOpertor : option.destory.beforeOpertor
				}
			});
		});
	}
	// 绑定冻结事件
	if (hasOperRight()) {
		$("#" + option.modelEnName + "Freeze").click(function() {
			cancelGrid_zrt({
				gridObj : option.gridObj,
				modelEnName : option.modelEnName, // 模块英文名
				modelName : option.modelName, // 模块中文名
				keyField : option.keyField, // 主键,多个用逗号隔开
				url : option.freeze.freUrl,
				statusField : option.freeze.keyDesField,
				status : option.freeze.updateStatus,
				msg : option.freeze.msg,
				freeze : {
					beforeOpertor : option.freeze.beforeOpertor
				}
			});
		});
	}

	// 绑定解冻事件
	if (hasOperRight()) {
		$("#" + option.modelEnName + "UnFreeze").click(function() {
			cancelGrid_zrt({
				gridObj : option.gridObj,
				modelEnName : option.modelEnName, // 模块英文名
				modelName : option.modelName, // 模块中文名
				keyField : option.keyField, // 主键,多个用逗号隔开
				url : option.unfreeze.unfreUrl,
				statusField : option.unfreeze.keyDesField,
				status : option.unfreeze.updateStatus,
				msg : option.unfreeze.msg,
				unfreeze : {
					beforeOpertor : option.unfreeze.beforeOpertor
				}
			});
		});
	}
}

/**
 * 自动给元素加tabindex
 * 
 * @param divId
 */
function addTabindexAuto(divId) {
	var tabObjs = $("#" + divId).find("table");

	if (tabObjs.length == 0) {
		return;
	}
	var index = 1;
	var indexRight = 1;
	for (var k = 0; k < tabObjs.length; k++) {
		tabObj = tabObjs.eq(k);
		var firstTr = tabObj.find("tr").eq(0);
		if (firstTr.find("td").length <= 1) {
			return false;
		}

		var tdList = tabObj.find("td");
		var tdObj = null;
		var tdLen = tdList.length;
		var leftIndex = Math.ceil(tdLen / 2);
		indexRight = index + leftIndex + 1;
		for (var i = 0; i < tdLen; i++) {
			tdObj = tdList[i];
			var currentIndex = 0;

			$(tdObj).children("input,select").each(function() {
				if (!$(this).prop("readonly")) {
					if (i % 2 == 0) {
						currentIndex = index++;
					} else {
						currentIndex = indexRight++;
					}
					$(this).attr("tabindex", currentIndex);
				}
			});
		}

		index = indexRight;
	}
}

/**
 * 去掉数据库里默认空格
 * 
 * @param data
 */
function getNoSpaceData(data) {
	data = $.trim(data);
	data = data.replace("\u0000", "");
	return data;
}

/**
 * 打开修改窗口
 * 
 * @param option
 * @param selectedId
 */
function openUpdateWin(option, selectedId) {
	if (option.update.beforeUpdate != null) {
		if (!option.update.beforeUpdate()) {
			return;
		}
	}

	if (option.update.beforeOpenDialog != null) {
		option.update.beforeOpenDialog(option, selectedId);
	}
	var grid = option.gridObj.grid;
	if (undefined == grid) {
		grid = option.gridObj;
	}
	// 先根据主键组合查询条件
	var keyFields = option.keyField;
	var keyFieldList = keyFields.split(",");
	var keyData = {};
	for (var i = 0; i < keyFieldList.length; i++) {
		var colIndex = grid.getColIndexById(keyFieldList[i]);// 得到指定头所在列的索引
		var value = grid.cellById(selectedId, colIndex).getValue();// 得到指定头指定行的值
		keyData[keyFieldList[i]] = value;
	}
	// 获取一条记录
	postData({
		url : option.update.getUrl,
		data : keyData,
		callback : function(result) {
			if (option.update.afterGetData != null) {
				option.update.afterGetData(result);
			}
			_oldData = result;
			$("#" + option.modelEnName + "UpdateForm")
					.find("input,select")
					.each(
							function() {
								$(this).removeClass("edited");
								var controlName = $(this).attr("name");
								if (result[controlName] != undefined) {
									var itemList = getNoSpaceData(result[controlName]);
									$(this).val(itemList);

									/* 多选下拉菜单，获取选中值 */
									if ($(this).attr("multiple") == "multiple") {
										var items = itemList.split(",");
										var options = $(this).children();
										for (var i = 0; i < options.length; i++) {
											var selectVal = options.eq(i).attr(
													"value");
											var _exist = $.inArray(selectVal,
													items);
											if (_exist >= 0) {
												options.eq(i).prop("selected",
														true);
											}
										}
										$(this).multiselect('refresh');
									}
								}
							});

			$("#" + option.modelEnName + "UpdateForm").find("input").each(
					function() {
						if (!hasOperRight()) { // 没有操作权限
							$(this).prop("disabled", true);
						} else {
							$(this).bind("input change", function() {
								var name = $(this).attr("name");
								var v = $(this).val();
								if (v != _oldData[name]) {
									$(this).addClass("edited");
								} else {
									$(this).removeClass("edited");
								}
							});
						}
					});
			$("#" + option.modelEnName + "UpdateForm").find("select").each(
					function() {
						$(this).next().css("color", "#333");
						if ($(this).attr("multiple") == undefined) {
							$(this).selectmenu("refresh");
							if (!hasOperRight()) {
								$(this).prop("disabled", true);
							} else {
								var name = $(this).attr("name");

								$(this).selectmenu(
										{
											change : function(event, ui) {
												var v = ui.item.value;

												if (v != _oldData[name]) {
													$(this).next().css("color",
															"red");
													$(this).addClass("edited");
												} else {
													$(this).next().css("color",
															"#333");
													$(this).removeClass(
															"edited");
												}
											}
										});
							}
						} else {
							if (hasOperRight()) {
								$(this).bind("change", function() {
									var name = $(this).attr("name");
									var v = $(this).val();

									if (v != _oldData[name]) {
										$(this).next().css("color", "red");
										$(this).addClass("edited");
									} else {
										$(this).next().css("color", "#333");
										$(this).removeClass("edited");
									}
								});
							}
						}
					});
			var buttonsList = {};
			if (hasOperRight()) {
				buttonsList['确定'] = function() {
					if (option.update.beforeSubmit != null) {
						option.update.beforeSubmit();
					}
					// 获取checkbox提交前列表值
					var checkboxListEdited = $(
							"#" + option.modelEnName + "UpdateForm").find(
							"input[type='checkbox']");
					var checkboxValEdited = "";
					checkboxListEdited.each(function() {
						if ($(this).is(":checked")) {
							return checkboxValEdited += ($(this).val() + "|");
						}
					});
					if (checkboxValEdited != checkboxValUnedited) {
						$(this).addClass("edited");
					} else {
						$(this).removeClass("edited");
					}

					var checkboxListEdited_1 = $(
							"#" + option.modelEnName + "UpdateForm").find(
							"select").find("option");
					var checkboxValEdited_1 = "";
					checkboxListEdited_1
							.each(function() {
								if ($(this).is(":selected")) {
									return checkboxValEdited_1 += ($(this)
											.val() + "|");
								}
							});
					if (checkboxValEdited_1 != checkboxValUnedited_1) {
						$(this).addClass("edited");
					} else {
						$(this).removeClass("edited");
					}

					if ($(".edited").length == 0 /*
													 * &&
													 * $(".select-show").length==0
													 */) {
						$(this).dialog('close');
						return;
					}
					var v = $("#" + option.modelEnName + "UpdateForm")
							.validationEngine('validate');// 验证不通过返回false
					if (!v) {
						return;
					}
					confirmMsg({
						msg : "确定修改吗？",
						yes : function() {
							ajaxSubmit({
								url : option.update.submitUrl,
								gridObj : option.gridObj,
								formId : option.modelEnName + "UpdateForm",
								winId : option.modelEnName + "WrapUpdate",
								afterSubmit : option.update.afterSubmit
							});

							$("#" + option.modelEnName + "UpdateForm").find(
									"input,select").each(function() {
								$(this).removeClass("edited");
								$(this).next().css("color", "#333");
							});
						}
					});
				};
			}
			buttonsList["取消"] = function() {
				$(this).dialog('close');
				$("#" + option.modelEnName + "UpdateForm").find("input,select")
						.each(function() {
							$(this).removeClass("edited");
							$(this).next().css("color", "#333");
						});
			};

			// 打开修改窗口
			$("#" + option.modelEnName + "WrapUpdate").dialog({
				modal : true,
				width : option.update.width,
				height : option.update.height,
				title : '修改' + option.modelName,
				close : function() {
					$(this).dialog('destroy');
				},// 关闭后还原初始状态
				buttons : buttonsList
			});

			if (option.update.afterOpenDialog != null) {
				option.update.afterOpenDialog(result);
			}
			// 获取checkbox未修改前列表值
			var checkboxListUnedited = $(
					"#" + option.modelEnName + "UpdateForm").find(
					"input[type='checkbox']");
			var checkboxValUnedited = "";
			checkboxListUnedited.each(function() {
				if ($(this).is(":checked")) {
					return checkboxValUnedited += ($(this).val() + "|");
				}
			});

			// 获取checkbox未修改前列表值
			var checkboxListUnedited_1 = $(
					"#" + option.modelEnName + "UpdateForm").find("select")
					.find("option");
			var checkboxValUnedited_1 = "";
			checkboxListUnedited_1.each(function() {
				if ($(this).is(":selected")) {
					return checkboxValUnedited_1 += ($(this).val() + "|");
				}
			});
		}
	});
}

/**
 * 非阻塞弹出提示框
 * 
 * @param option{msg:"",callback:function(){}}
 */
function alertMsg(option) {
	var defaultOption = {
		title : "",
		text : ""
	};
	if (typeof (option) != "object") {
		defaultOption.text = option;
	} else {
		msg = option.msg;
		callback = option.callback;
	}
	option = $.extend(defaultOption, option);
	swal({
		title : option.title,
		text : option.text,
		type : "warning"
	});
}

/**
 * 非阻塞弹出确认框
 * 
 * @param option{msg:"",yes:function(){},no:function(){}}
 */
function confirmMsg(option) {
	var defaultOption = {
		btnText : "确定",
		title : "您确定要删除这条信息吗",
		text : "删除后将无法恢复，请谨慎操作！",
		yes : function() {
		},
		no : function() {
		}
	};

	option = $.extend(defaultOption, option);

	swal({
		title : option.title,
		text : option.text,
		type : "warning",
		showCancelButton : true,
		confirmButtonColor : "#FF910E",
		confirmButtonText : "确定",
		cancelButtonText : "取消",
		closeOnConfirm : false
	}, function() {
		if (option.yes != null && typeof (option.yes) == "function") {
			var r = option.yes();
			if (r === false) {
				return;
			}
		}
	});
}

/**
 * 非阻塞错误弹出提示框
 * 
 * @param option{msg:"",callback:function(){}}
 */
function errorMsg(option) {
	var msg = "";
	var callback = null;

	if (typeof (option) != "object") {
		msg = option;
	} else {
		msg = option.msg;
		callback = option.callback;
	}
	swal({
		title : "出错啦！",
		text : msg,
		type : "error"
	}, function() {
		if (callback != null) {
			callback();
		}
	});
}
function swaltimer(a, b, c, d) {
	if (d == undefined)
		d = 2000;
	swal({
		title : a,
		text : b,
		type : c,
		timer : d
	});
}

var commomErrorArray =[
           {"code":"210018","msg":"操作失败:用户角色无权限","loginOut":"0"},
           {"code":"300006","msg":"操作失败:登录信息已经失效，请重新登录","loginOut":"1"},
           {"code":"300007","msg":"操作失败:用户未登录，请先登录","loginOut":"1"}
]

function dealWithErrorMsg(str){
	var defaultObj = {
		msg  : "操作失败:系统异常,请稍后再试",
		flag : "0"
	};
	if(str == undefined && str == nul){
		return defaultObj;
	}
	jQuery.each(commomErrorArray, function(inx, obj) {  
		if(str.indexOf(obj.code) >= 0){
			defaultObj.msg = obj.msg;
			defaultObj.flag = obj.loginOut;
			return  defaultObj;
		}
	});  
	return defaultObj;
}


function commonLoginOutErrorMsg(str){
	if(str != undefined && str != null){
		var obj = dealWithErrorMsg(str);
		errorMsg({
			msg : obj.msg,
			callback:function(){
				if(obj.flag == "1"){
					window.parent.location.href = _appServer + "/loginOut.htm"
				}
			}
		});
		return;
	}
}
/**
 * wangkai10341 Post提交数据
 * 
 * @param option
 *            参数{ url:请求的URL, type:请求方式,默认为POST data:null, 提交的数据 callback:null,
 *            回调方法 datatype:"json", 传递的数据格式,默认为json async:true 是否异步提交,默认是 }
 */
function postData(option) {
	var defaultOption = {
		url : "",
		type : "POST",
		data : null,
		callback : null,
		completeCallback : null,// 完成回调
		datatype : "json",
		async : true,
		contentType : "",
		errorCallback : false,
		autoErrorMsg : true
	// 出错了是否回调
	};
	option = $.extend(defaultOption, option);
	if (option.contentType == "json") {
		option.contentType = "application/json; charset=utf-8";
	} else {
		option.contentType = "application/x-www-form-urlencoded;charset=UTF-8";
	}
	if (option.url == "") {
		alert("url不能为空");
		return;
	}
	option.url = _appServer + option.url;
	$
			.ajax({
				type : option.type,
				data : option.data,
				async : option.async,
				dataType : option.datatype,
				contentType : option.contentType,
				url : option.url,
				success : function(result) {
					if (result.messageCode != undefined
							&& (result.messageCode != "200")) {
						if (result.messageCode == "300"
								|| result.messageCode == "301") {
							swal("登录超时",result.message,"error");
							setTimeout(function(){
								var url = result.data;
								if (url != undefined) {
									window.parent.location.href = _appServer + url;
								}
							},2000);														
							return;
						} else {
							if (option.autoErrorMsg)
								errorMsg(result.message);
							return;
						}
					}

					if (result.success != undefined && !result.success) {
						// 判断返回成功或出错
						if (option.autoErrorMsg)
							commonLoginOutErrorMsg(result.message);
						if (!option.errorCallback) {
							return;
						}
					}
					if(result.message != undefined){
						if (result.message.success != undefined && !result.message.success) {
							// 判断返回成功或出错
							if (option.autoErrorMsg)
								commonLoginOutErrorMsg(result.message.message);
							if (!option.errorCallback) {
								return;
							}
						}
					}
					
					if (result.success != undefined && result.success) {
						// operTip({m_msg:"操作成功", m_type: "operSuccess"});
					}

					// 回调函数
					if (option.callback != null) {
						option.callback(result);
					}
				},
				error : function(jqXHR, textStatus, errorThrown) {
					if (textStatus != undefined) {
						commonLoginOutErrorMsg(textStatus);
					} else {
						commonLoginOutErrorMsg(jqXHR.statusTex);
					}
				},
				complete : function(jqXHR, textStatus) {
					if (option.completeCallback) {
						option.completeCallback(jqXHR, textStatus);
					}
				}
			});
}

/**
 * fangst 获取数据
 * 
 * @param option
 *            参数{ url:请求的URL, type:请求方式,默认为POST data:null, 提交的数据 callback:null,
 *            回调方法 datatype:"json", 传递的数据格式,默认为json async:true 是否异步提交,默认是 }
 */
function queryData(option) {
	var defaultOption = {
		url : "",
		type : "POST",
		data : null,
		callback : null,
		datatype : "json",
		async : true,
		contentType : "",
		errorCallback : false
	// 出错了是否回调
	};
	option = $.extend(defaultOption, option);
	if (option.contentType == "json") {
		option.contentType = "application/json; charset=utf-8";
	} else {
		option.contentType = "application/x-www-form-urlencoded;charset=UTF-8";
	}
	if (option.url == "") {
		alert("url不能为空");
		return;
	}
	option.url = _appServer + option.url;
	$.ajax({
		type : option.type,
		data : option.data,
		async : option.async,
		dataType : option.datatype,
		contentType : option.contentType,
		url : option.url,
		success : function(result) {
			// 判断返回成功或出错
			if (result.success != undefined && !result.success) {
				if (!option.errorCallback) {
					return;
				}
			}
			// 回调函数
			if (option.callback != null) {
				option.callback(result);
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
		},
		complete : function() {
		}
	});
}

var _stockAutocompleteData = [];

/**
 * 证券代码自动提示
 */
function stockAutocomplete(options) {
	var defaultOptions = {
		filters : {/* 过滤条件为{ID:字段名}格式, 例如: marketNoAdd:market_no */},
		id : "keywordField",
		stockNameId : "",// 自动填写框
		interCodeId : "",// 自动填写框
		callback : null
	};

	options = $.extend(defaultOptions, options);

	// 处理过滤条件字符串

	var url = "/baseinfo/rqstock/getRqStockAutoComplate.json";
	$("#" + options.id)
			.autocomplete(
					{
						minLength : 1,
						autoFocus : true,
						source : function(request, response) {
							var filterList = "";
							if ($.isEmptyObject(options.filters)) {

							} else {
								for ( var filter in options.filters) {
									// 传到后台的数据格式{字段名：值}, 例：{market_no : "1,2,3"}

									filterList = filterList
											+ options.filters[filter] + "="
											+ $("#" + filter).val() + "&";
								}
								filterList = filterList.substring(0,
										filterList.length - 1);
							}
							postData({
								url : url,
								data : {
									searchInfo : request.term,
									filterList : filterList
								},
								callback : function(data) {
									_stockAutocompleteData = data;
									response($.map(data, function(item) {
										return {
											// label是默认显示的
											label : item.reportCode + " "
													+ item.stockName,
											value : item.reportCode,
											stockName : item.stockName,
											interCode : item.reportCode,
											marketNo : item.marketNo
										};
									}));
								}
							});
						},
						select : function(event, obj) {
							if (options.stockNameId != "") {
								$("#" + options.stockNameId).val(
										obj.item.stockName);
							}
							if (options.interCodeId != "") {
								$("#" + options.interCodeId).val(
										obj.item.interCode);
							}
							if (options.callback != null) {
								options.callback(obj.item);
							}
						},
						change : function(event, obj) {
							if (obj.item == null) {
								var stockName = "";
								var interCode = 0;
								if (_stockAutocompleteData.length > 0) {
									var v = $("#" + options.id).val();
									for (var i = 0; i < _stockAutocompleteData.length; i++) {
										if (v == _stockAutocompleteData[i].reportCode) {
											stockName = _stockAutocompleteData[i].stockName;
											interCode = _stockAutocompleteData[i].interCode;
											break;
										}
									}
								}
								if (options.stockNameId != "") {
									$("#" + options.stockNameId).val(stockName);
								}
								if (options.interCodeId != "") {
									$("#" + options.interCodeId).val(interCode);
								}
							}
							_stockAutocompleteData = [];
						}
					});
}

var _stockAutocompleteData_in = [];

function stockAutocomplete_in(options) {
	var defaultOptions = {
		filters : {/* 过滤条件为{ID:字段名}格式, 例如: marketNoAdd:market_no */},
		id : "keywordField",
		stockNameId : "",// 自动填写框
		interCodeId : "",// 自动填写框
		callback : null
	};

	options = $.extend(defaultOptions, options);

	// 处理过滤条件字符串

	var url = "/transferin/rqstock/getRQStockByCode.json";
	$("#" + options.id)
			.autocomplete(
					{
						minLength : 1,
						autoFocus : true,
						source : function(request, response) {
							var filterList = "";
							if ($.isEmptyObject(options.filters)) {

							} else {
								for ( var filter in options.filters) {
									// 传到后台的数据格式{字段名：值}, 例：{market_no : "1,2,3"}

									filterList = filterList
											+ options.filters[filter] + "="
											+ $("#" + filter).val() + "&";
								}
								filterList = filterList.substring(0,
										filterList.length - 1);
							}
							postData({
								url : url,
								data : {
									searchInfo : request.term,
									filterList : filterList
								},
								callback : function(data) {
									_stockAutocompleteData_in = data;
									response($.map(data, function(item) {
										return {
											// label是默认显示的
											label : item.reportCode + " "
													+ item.stockName,
											value : item.reportCode,
											stockName : item.stockName,
											interCode : item.reportCode,
											marketNo : item.marketNo,
											gsFeeRatio : item.gsFeeRatio,
											hsFeeRatio : item.hsFeeRatio

										};
									}));
								}
							});
						},
						select : function(event, obj) {
							if (options.stockNameId != "") {
								$("#" + options.stockNameId).val(
										obj.item.stockName);
							}
							if (options.interCodeId != "") {
								$("#" + options.interCodeId).val(
										obj.item.interCode);
							}
							if (options.callback != null) {
								options.callback(obj.item);
							}
						},
						change : function(event, obj) {
							if (obj.item == null) {
								var stockName = "";
								var interCode = 0;
								if (_stockAutocompleteData_in.length > 0) {
									var v = $("#" + options.id).val();
									for (var i = 0; i < _stockAutocompleteData_in.length; i++) {
										if (v == _stockAutocompleteData_in[i].reportCode) {
											stockName = _stockAutocompleteData_in[i].stockName;
											interCode = _stockAutocompleteData_in[i].interCode;
											break;
										}
									}
								}
								if (options.stockNameId != "") {
									$("#" + options.stockNameId).val(stockName);
								}
								if (options.interCodeId != "") {
									$("#" + options.interCodeId).val(interCode);
								}
							}
							_stockAutocompleteData_in = [];
						}
					});
}

/**
 * 点击显示通用功能列表 其他更改操作pop层
 */
function moreOper(object) {
	var object = $("#" + object);
	if (object) {
		object.unbind('click').bind('click', function(e) {
			e.stopPropagation();
			$(this).next().toggle();
		});

		var operPop = object.next();
		operPop.hover(function() {
			$(this).show();
		}, function() {
			$(this).hide();
		});
		operPop.click(function() {
			$(this).hide();
		});
		object.mouseout(function() {
			operPop.hide();
		});
	}
}

/**
 * 表格列表获取自适应高度值
 */
function gridGetHgt(option) {
	var windowHeight = $(window).height();
	var defaultOption = {
		id : "",
		extraHeight : 0,// 额外总高度
		topHeight : 0,// 顶部toolbar固定高度是43
		footHeight : 0
	// 底部分页条固定高度是30
	};
	option = $.extend(defaultOption, option);
	if (option.extraHeight != 0) {
		var heightVal = windowHeight - option.extraHeight + "px";
	} else {
		var heightVal = windowHeight - option.topHeight - option.footHeight
				+ "px";
	}
	$("#" + option.id).css("height", heightVal);
}

/**
 * 表格列表获取自适应宽度值
 */
function gridGetWidth(option) {
	var windowWidth = $(window).width();
	var defaultOption = {
		id : "",
		extraWidth : 0,// 额外总高度
		topWidth : 0,// 顶部toolbar固定高度是43
		footWidthght : 0
	// 底部分页条固定高度是30
	};
	option = $.extend(defaultOption, option);
	if (option.extraWidth != 0) {
		var widthVal = windowWidth - option.extraWidth + "px";
	} else {
		var widthVal = windowWidth - option.topWidth - option.footWidth + "px";
	}
	$("#" + option.id).css("width", widthVal);
}
/**
 * 表格列表基于父级容器获取自适应高度值
 */
function gridGetHgtByParent(option) {
	var windowHeight = $("#" + option.id).parent().height();
	var defaultOption = {
		id : "",
		extraHeight : 0,// 额外总高度
		topHeight : 0,// 顶部toolbar固定高度是43
		footHeight : 0
	// 底部分页条固定高度是30
	};
	option = $.extend(defaultOption, option);
	if (option.extraHeight != 0) {
		var heightVal = windowHeight - option.extraHeight + "px";
	} else {
		var heightVal = windowHeight - option.topHeight - option.footHeight
				+ "px";
	}
	$("#" + option.id).css("height", heightVal);
}
/**
 * 表格列表基于父级容器获取自适应宽度值
 */
function gridGetWidthByParent(option) {
	// var windowWidth = $(window).width();
	var defaultOption = {
		id : "",
		extraWidth : 0,// 额外总高度
		topWidth : 0,// 顶部toolbar固定高度是43
		footWidthght : 0
	// 底部分页条固定高度是30
	};
	var windowWidth = $("#" + option.id).parent().width();
	option = $.extend(defaultOption, option);
	if (option.extraWidth != 0) {
		var widthVal = windowWidth - option.extraWidth + "px";
	} else {
		var widthVal = windowWidth - option.topWidth - option.footWidth + "px";
	}
	$("#" + option.id).css("width", widthVal);
}
/**
 * 表单重置：包括 单选刷新
 * 
 * @param object
 *            表单id
 */
function formReset(object, unresetId) {
	var unresetVal = $("#" + unresetId).val();
	if ($("#" + object).length > 0) {
		$("#" + object)[0].reset();
	}
	// $(':input','#'+object)
	// .not(':button, :submit, :reset, :hidden')
	// .val('')
	// .removeAttr('checked');
	// .removeAttr('selected');
	$("#" + unresetId).val(unresetVal);
	$("#" + object).find("select").each(function() {
		// if ($(this).attr("multiple") == undefined) {
		// $(this).selectmenu("refresh");
		// }
	});
}

/**
 * 字段选择功能
 */
function fieldSelect() {
	var url = "/common/field/getHeaderColumn.json";
	var option = {
		url : url,
		data : {
			gridId : 0
		},
		callback : columnSelectedCallBack
	};
	//
	postData(option);
}

var _myGrid = null;
var _oldGridId = 0;
/**
 * 字段选择按钮点击-返回函数
 */
function columnSelectedCallBack(data) {
	// 定义表格框架以及标题行
	if (_myGrid == null || _oldGridId != _gridId) {
		$("#fieldGridbox").css({
			width : "442px",
			height : "355px"
		});
		if (_myGrid == null) {
			_myGrid = new CommonGridObject("fieldGridbox", _appServer, data);
		}
		var grid = _myGrid.grid;
		grid.enableColumnMove(false); // 列不能移动
		grid.setEditable(true);
		_oldGridId = _gridId;
		// 设置列显示类型
		/*
		 * for ( var i = 0; i < data.length; i++) { _myGrid.setColumnType(i,
		 * data[i].fieldType); }
		 */

		// 设置列显示类型
		_myGrid.setColumnType(0, "txt");
		_myGrid.setColumnType(1, "txt");
		_myGrid.setColumnType(2, "ch");
		_myGrid.setColumnType(3, "ch");
		_myGrid.setColumnType(4, "txt");
		_myGrid.setColumnType(5, "ch");

		// 绑定grid列表选项
		_myGrid.bind("/common/field/getGridList.json?gridId=" + _gridId, "");

		// checkbox格式的列点击事件监听
		grid.setOnCheckHandler(function(rowId, columIndex, selectState) {
			//
			var fieldName = grid.getColumnId(columIndex);
			var rowIndex = grid.getRowIndex(rowId);
			var rowNum = grid.getRowsNum();
			//
			if (fieldName == "isFrozen") {
				// 冻结该字段时，该字段前的所有都冻结
				for (var i = rowIndex - 1; i >= 0; i--) {
					grid.cells2(i, columIndex).setValue(1);
				}
				// 解冻该字段时，该字段后面的所有都解冻
				for (var j = rowIndex + 1; j < rowNum; j++) {
					grid.cells2(j, columIndex).setValue(0);
				}
			}
		});

		// 标题列点击事件
		grid.setOnHeaderClickHandler(function(index, obj) {
			var fieldName = grid.getColumnId(index);
			// 针对是否可见、是否打印功能
			if (fieldName == "visibleFlag" || fieldName == "printFlag") {
				var rowNum = grid.getRowsNum();
				//
				var check = grid.getCheckedRows(index);
				if (check.length == 0) {
					// 全选
					grid.setCheckedRows(index, 1);
				} else {
					var checkRows = check.split(",");
					if (checkRows.length < rowNum) {
						// 全选
						grid.setCheckedRows(index, 1);
					} else {
						// 全不选
						grid.setCheckedRows(index, 0);
					}
				}
			}
		});
	}

	// 从绑定的url获取数据
	_myGrid.refresh();

	// 显示弹出层
	$("#fieldDialog").dialog({
		width : "auto",
		height : "auto",
		title : "字段选择",
		closeText : "关闭",
		modal : true,
		buttons : [ {
			text : "确定",
			click : function() {
				saveColumnSelected(data, _myGrid.grid);
				$(this).dialog("close");
			}
		}, {
			text : "取消",
			click : function() {
				$(this).dialog("close");
			}
		} ]
	});// dialog结束
}

/**
 * 修改列属性选择
 * 
 * @param 列
 *            tab索引
 */
function saveColumnSelected(params, grid) {
	//
	var gridId = _gridId;

	// 判断有没有修改的记录
	var ids = grid.getChangedRows(true);
	if (ids.length > 0) {
		//
		var list = new Array();
		var rowIndex = 0;

		// 循环行
		grid.forEachRow(function(rowId) {
			// rowIndex第一行是0，所以要加1
			rowIndex = grid.getRowIndex(rowId) + 1;

			var fieldName = "";
			var visibleFlag = "";
			var isFrozen = "";
			var printFlag = "";
			var filedCaption = "";

			// 循环列
			for (var i = 0; i < params.length; i++) {
				// 获取当前单元格对象
				var columnObj = grid.cellById(rowId, i);
				var columnValue = columnObj.getValue();

				// 取fieldIndex,fieldIndex列隐藏
				if (i == 0) {
					fieldIndex = columnValue;
				}
				//
				var fieldId = grid.getColumnId(i);

				if (fieldId == "fieldName") {
					fieldName = columnValue;
				} else if (fieldId == "visibleFlag") {
					visibleFlag = columnValue;
				} else if (fieldId == "isFrozen") {
					isFrozen = columnValue;
				} else if (fieldId == "printFlag") {
					printFlag = columnValue;
				}
			}
			// grid列表更新
			list.push({
				gridId : gridId,
				fieldName : fieldName,
				visibleFlag : visibleFlag,
				printFlag : printFlag,
				isFrozen : isFrozen,
				displayOrder : rowIndex
			});
		});

		//
		var url = "/common/field/updateField.json";
		var data = JSON.stringify(list);

		postData({
			url : url,
			data : data,
			contentType : "json",
			callback : function(data) {
				window.location.reload();
			}
		});
		/*
		 * $.ajax({ type : "POST", url : _appServer + url, data : data,
		 * contentType : "application/json;charset=UTF-8", dataType : "json",
		 * success : function(data) { console.log(data.message); } });
		 */
	}
}

/**
 * 表单提交
 * 
 * @param object
 */
function ajaxSubmit(option) {
	// {url: _appServer+option.add.submitUrl, formId:
	// option.modelEnName+"AddForm", winId: option.modelEnName+"WrapAdd"});
	var values = $("#" + option.formId).serializeJson();
	postData({
		url : option.url,
		data : values,
		errorCallback : true,
		callback : function(data) {
			if (data.success) {
				operTip({
					m_msg : '操作成功',
					m_type : 'operSuccess'
				});
				if (option.gridObj != undefined) {
					option.gridObj.refresh();
				}
				if (option.afterSubmit != null) {
					option.afterSubmit();
				}
			} else {
				operTip({
					m_msg : data.message,
					m_type : 'operError'
				});
			}
			formReset(option.formId);
			$("#" + option.winId).dialog("close");
		}
	});
}

/**
 * 列表打印功能
 * 
 * @param tabIndex
 *            tab索引
 */
function listPrint(list, printUrl) {
	window.print();
	return;
	var dataList = null;
	// 创建表格
	$("#printGrid").append("<table width='100%' id='printTable'></table>");
	// 列头信息
	$("#printTable").append("<tr id='thead'></tr>");
	var i;
	var j;
	var cellItem = "";
	for (i = 0; i < list.length; i++) {
		$("#thead").append(
				"<td width='" + list[i].width + "'>" + list[i].fieldCaption
						+ "	" + "</td>");
	}
	// 异步获取数据网格对象
	alert(dictionary);
	postData({
		url : printUrl,
		data : dataList,
		callback : function(data) {
			// printGrid中绘制表格
			// alert(data.length);
			for ( var row in data) {
				$("#printTable").append("<tr id='" + "pRow" + row + "'></tr>");
				// alert(data[row]);
				for (i = 0; i < list.length; i++) {
					for ( var cell in data[row]) {
						// alert(cell+'='+row[cell]);
						// alert(cell+"="+data[row][cell]);
						// 数据对应列头
						if (list[i]["fieldName"] == cell) {
							// 数据字典翻译
							for ( var dict in dictionary) {
								// alert(list[i].dictNo);
								// alert(dictionary[dict]["dictNo"]);
								if (list[i]["dictNo"] == dictionary[dict]["dictNo"]) {
									// alert(9999);
									for (j = 0; j < dictionary[dict]["items"].length; j++) {
										if (dictionary[dict]["items"][j]["value"] == data[row][cell]) {
											cellItem = dictionary[dict]["items"][j]["text"];
										}
									}
								}
							}
							cellItem = data[row][cell];
							$("#pRow" + row)
									.append("<td>" + cellItem + "</td>");
						}
					}
				}
			}
		}
	});

	// printGrid动态添加css
	// 打印
}

/**
 * 导出数据功能
 * 
 * @param tabIndex
 * 
 */
function exportData(option) {
	var rowCount = option.gridObj.grid.getRowsNum();
	if (rowCount == 0) {
		alertMsg("记录数为0!");
		return;
	}
	var exportUrl = _appServer + option.exportUrl + "?gridId=";
	if (option.gridId != "") {
		exportUrl += option.gridId;
	} else {
		exportUrl += _gridId;
	}
	if (option.exportExtraData != "") {
		exportUrl += "&" + option.exportExtraData;
	}
	var keywordValue = $.trim($("#" + option.keywordFieldID).val());
	var keywordItem = "";

	if (keywordValue != "") {
		var keywords = "";
		if (typeof (option.keywordQuery.keyword) == "function") {
			keywords = option.keywordQuery.keyword();
		} else {
			keywords = option.keywordQuery.keyword;
		}
		keywordItem = keywords + ":" + keywordValue + ",";
	}
	var queryFormId = option.gridObj.grid.formId;
	if (queryFormId != "") {
		$("#" + queryFormId).find("input,select").each(function() {
			var proName = $(this).attr("name");
			var proValue = $(this).val();
			if (proValue == "" || proValue == undefined) {
			} else {
				keywordItem = keywordItem + proName + ":" + proValue + ",";
			}
		});
	}

	post(exportUrl, keywordItem);

	function post(url, itemList) {
		var postForm = document.createElement("form");// 表单对象
		postForm.method = "post";
		postForm.action = url;
		var arr = itemList.split(",");
		for (var i = 0; i < arr.length; i++) {
			var keyCombi = arr[i].split(":");
			var queryInput = document.createElement("input");
			queryInput.setAttribute("name", keyCombi[0]);
			queryInput.setAttribute("value", keyCombi[1]);
			postForm.appendChild(queryInput);
		}
		document.body.appendChild(postForm);
		postForm.submit();
		document.body.removeChild(postForm);
	}
}

/**
 * 通用列表删除
 */
function deleteGrid(option) {
	var grid = option.gridObj.grid;
	if (undefined == grid) {
		grid = option.gridObj;
	}
	// 得到选中行id
	var selectedId = grid.getSelectedRowId();
	if (selectedId == undefined) {
		alertMsg({
			msg : "请选择要操作的行"
		});
		return;
	}
	// 得到选中行数量
	var num = selectedId.split(",").length;
	// 得到传入参数
	var keys = option.keyField.split(",");
	var selecteds = selectedId.split(",");
	// 一行被选中
	function ajaxDelete() {
		var list = new Array();
		for (var j = 0; j < selecteds.length; j++) {
			selectedId = selecteds[j];
			var arr = {};
			for (var i = 0; i < keys.length; i++) {
				var colIndex = grid.getColIndexById(keys[i]);// 获得指定行id
				var value = grid.cellById(selectedId, colIndex).getValue();// 获得值
				var indexkey = keys[i];
				arr[indexkey] = value;
			}
			list.push(arr);
		}
		var realdata = JSON.stringify(list);
		postData({
			url : option.del.delUrl,
			data : realdata,
			contentType : "json",
			callback : function(data) {
				var success = data.success;
				if (success) {
					operTip({
						m_msg : '删除成功',
						m_type : 'operSuccess'
					});
					option.gridObj.refresh();
					if (option.del.afterSubmit != null) {
						option.del.afterSubmit();
					}
				} else {
					operTip({
						m_msg : '删除失败：' + data.message,
						m_type : 'operError'
					});
				}
			}
		});
	}
	if (num == 1) {
		confirmMsg({
			msg : "确认删除被选记录？",
			yes : function() {
				ajaxDelete();
			},
			no : function() {
			}
		});
	}
	// 多行被选中
	if (num > 1) {
		confirmMsg({
			msg : "确认删除被选记录？",
			yes : function() {
				ajaxDelete();
			},
			no : function() {
			}
		});
	}

}

/**
 * 注销,冻结,解冻通用
 */
function cancelGrid_zrt(option) {
	var defaultOption = {
		gridObj : null,
		modelEnName : "", // 模块英文名
		modelName : "", // 模块中文名
		keyField : "", // 主键,多个用逗号隔开
		url : "",
		status : "",
		statusField : "",
		msg : "",
		destory : {
			beforeOpertor : null
		},
		freeze : {
			beforeOpertor : null
		},
		unfreeze : {
			beforeOpertor : null
		}
	};
	option = $.extend(true, defaultOption, option);
	var gridCancel = option.gridObj.grid;
	// 得到选中行id
	var selectedId = gridCancel.getSelectedRowId();
	if (selectedId == undefined) {
		alertMsg({
			msg : "请选择行记录"
		});
		return;
	}

	if (option.destory.beforeOpertor != null) {
		if (!option.destory.beforeOpertor()) {
			return;
		}
	}

	if (option.freeze.beforeOpertor != null) {
		if (!option.freeze.beforeOpertor()) {
			return;
		}
	}

	if (option.unfreeze.beforeOpertor != null) {
		if (!option.unfreeze.beforeOpertor()) {
			return;
		}
	}

	// 得到选中行数量
	var num = selectedId.split(",").length;
	;
	// 得到传入参数
	var keys = option.keyField.split(",");
	var selecteds = selectedId.split(",");
	// 一行被选中
	if (num == 1) {
		confirmMsg({
			msg : "确定要" + option.msg + "吗？",
			yes : function() {
				var list = new Array();
				var arr = {};
				for (var i = 0; i < keys.length; i++) {
					var colIndex = gridCancel.getColIndexById(keys[i]);// 获得指定行id
					var value = gridCancel.cellById(selectedId, colIndex)
							.getValue(); // 获得值
					var indexkey = keys[i];
					arr[indexkey] = value;
				}
				var key = option.statusField;
				if (key != "") {
					arr[key] = option.status;
				}
				list.push(arr);

				postData({
					url : option.url,
					data : arr,
					callback : function(data) {
						var success = data.success;
						if (success) {
							operTip({
								m_msg : option.msg + '成功',
								m_type : 'operSuccess'
							});
							option.gridObj.refresh();
						} else {
							operTip({
								m_msg : option.msg + '失败：' + data.message,
								m_type : 'operError'
							});
						}
					}
				});
			},
			no : function() {
			}
		});
	}
	// 多行被选中
	if (num > 1) {
		confirmMsg({
			msg : "确定要" + option.msg + "吗？",
			yes : function() {
				var list = new Array();
				for (var j = 0; j < selecteds.length; j++) {
					selectedId = selecteds[j];
					var arr = {};
					for (var i = 0; i < keys.length; i++) {
						var colIndex = gridCancel.getColIndexById(keys[i]);// 获得指定行id
						var value = gridCancel.cellById(selectedId, colIndex)
								.getValue();// 获得值
						var indexkey = keys[i];
						arr[indexkey] = value;
					}
					list.push(arr);
				}
				var realdata = JSON.stringify(list);
				postData({
					url : option.url,
					data : realdata,
					contentType : "json",
					callback : function(data) {
						var success = data.success;
						if (success) {
							operTip({
								m_msg : option.msg + '成功',
								m_type : 'operSuccess'
							});
							option.gridObj.refresh();
						} else {
							operTip({
								m_msg : option.msg + '失败：' + data.message,
								m_type : 'operError'
							});
						}
					}
				});
			},
			no : function() {
			}
		});
	}
}

/**
 * 注销,冻结,解冻通用
 */
function cancelGrid(option) {
	var defaultOption = {
		gridObj : null,
		modelEnName : "", // 模块英文名
		modelName : "", // 模块中文名
		keyField : "", // 主键,多个用逗号隔开
		url : "",
		msg : ""
	};
	option = $.extend(true, defaultOption, option);

	var gridCancel = option.gridObj.grid;
	// 得到选中行id
	var selectedId = gridCancel.getSelectedRowId();
	if (selectedId == undefined) {
		alertMsg({
			msg : "请选择行记录"
		});
		return;
	}
	// 得到选中行数量
	var num = selectedId.split(",").length;
	// 得到传入参数
	var keys = option.keyField.split(",");
	var selecteds = selectedId.split(",");
	// 一行被选中
	if (num == 1) {
		confirmMsg({
			msg : "确定要" + option.msg + "该" + option.modelName + "吗？",
			yes : function() {
				// confirmMsg({msg:option.msg
				// +"后"+option.modelName+"将无法恢复，请确定"+option.msg+"该"+option.modelName+"？",yes:function(){
				var list = new Array();
				var arr = {};
				for (var i = 0; i < keys.length; i++) {
					var colIndex = gridCancel.getColIndexById(keys[i]);// 获得指定行id
					var value = gridCancel.cellById(selectedId, colIndex)
							.getValue(); // 获得值
					var indexkey = keys[i];
					arr[indexkey] = value;
				}
				list.push(arr);
				var realdata = JSON.stringify(list);
				postData({
					url : option.url,
					data : realdata,
					contentType : "json",
					callback : function(data) {
						var success = data.success;
						if (success) {
							operTip({
								m_msg : option.msg + '成功',
								m_type : 'operSuccess'
							});
							option.gridObj.refresh();
						} else {
							operTip({
								m_msg : option.msg + '失败：' + data.message,
								m_type : 'operError'
							});
						}
					}
				});
			},
			no : function() {
			}
		});
	}
	// 多行被选中
	if (num > 1) {
		confirmMsg({
			msg : "确定要" + option.msg + "该" + option.modelName + "吗？",
			yes : function() {
				// confirmMsg({msg: option.msg +
				// "后"+option.modelName+"将无法恢复，请确定" +
				// option.msg + "该"+option.modelName+"？",yes:function(){
				var list = new Array();
				for (var j = 0; j < selecteds.length; j++) {
					selectedId = selecteds[j];
					var arr = {};
					for (var i = 0; i < keys.length; i++) {
						var colIndex = gridCancel.getColIndexById(keys[i]);// 获得指定行id
						var value = gridCancel.cellById(selectedId, colIndex)
								.getValue();// 获得值
						var indexkey = keys[i];
						arr[indexkey] = value;
					}
					list.push(arr);
				}
				var realdata = JSON.stringify(list);
				postData({
					url : option.url,
					data : realdata,
					contentType : "json",
					callback : function(data) {
						var success = data.success;
						if (success) {
							operTip({
								m_msg : option.msg + '成功',
								m_type : 'operSuccess'
							});
							option.gridObj.refresh();
						} else {
							operTip({
								m_msg : option.msg + '失败：' + data.message,
								m_type : 'operError'
							});
						}
					}
				});
			},
			no : function() {
			}
		});
	}
}

/**
 * 通用列表查询
 * 
 */
function CommonGridObject(divId, path, params, fixedcol, gridId) {

	var coltype = "";
	var width = "";
	var align = "";
	var header = "";
	var columnIds = "";
	var colSort = "";
	var length = params.length;
	var headerStyleArr = new Array();
	var grid = new dhtmlXGridObject(divId);

	for (var i = 0; i < length; i++) // 循环整合数据
	{
		// 列类型
		if (params[i].fieldType == "m") {
			// 金额数字格式化
			coltype = coltype + "ron,";
			grid.setNumberFormat("0,000.00", i, ".", ",");
		} else if (params[i].fieldType == "integer") {
			// 整数格式化
			coltype = coltype + "ron,";
			grid.setNumberFormat("0,000", i, ".", ",");
		} else if (params[i].fieldType == "d") {
			coltype = coltype + "dhxCalendar,";
			grid.setDateFormat("%Y/%m/%d");
		} else if (params[i].fieldType == "") {
			coltype = coltype + "ron,";
		} else {
			coltype = coltype + params[i].fieldType + ",";
		}
		// 列对齐方式
		columnIds = columnIds + params[i].fieldName + ",";
		if (params[i].align) {
			align = align + params[i].align + ",";
		} else {
			align = align + "center,";
		}
		// 头样式
		header = header + params[i].fieldCaption + ",";
		if (params[i].headerStyle) {
			headerStyleArr.push(params[i].headerStyle);
			headerStyleArr.push("vertical-align:middle;");
		} else {
			headerStyleArr.push("text-align:center;vertical-align:middle;");
		}
		// 排序
		if (params[i].sort) {
			colSort = colSort + params[i].sort + ",";
		} else {
			colSort = colSort + "na,";
		}

	}

	// grid超出屏幕滚动
	var gridWrapName = $("#" + divId).parent().attr("class");
	if (gridWrapName == "gridOverWrap") {
		for (var i = 0; i < length; i++) {
			width = width + params[i].width + ",";
		}
	} else {
		for (var i = 0; i < length; i++) // 循环整合列宽
		{
			width = width + params[i].width + ",";
		}
		// width += "*,";
	}

	grid.setGridId(gridId);
	grid.setImagePath(path + "/plugins/dhtmlGrid/dhtmlxGrid/imgs/");
	grid.setHeader(header.substring(0, header.length - 1), undefined,
			headerStyleArr);
	grid.setInitWidths(width.substring(0, width.length - 1));// 列宽值
	grid.setColAlign(align.substring(0, align.length - 1));
	grid.setColumnIds(columnIds.substring(0, columnIds.length - 1));
	grid.setColSorting(colSort.substring(0, colSort.length - 1));
	grid.setColTypes(coltype.substring(0, coltype.length - 1));
	grid.setMultiselect(true);
	grid.setSkin("dhx_skyblue");
	
	this.enableSmartRendering = function(){
		grid.enableSmartRendering(true);
	}
	
	grid.init();
	if (fixedcol > 0) {
		grid.splitAt(fixedcol); // 冻结列
	}
	grid.enableColumnMove(true); // 移动列
	grid.enableDragAndDrop(false);
	grid.setEditable(false);
	grid.enableMultiline(false);
	grid.enableRowsHover(true, "cursorPointer");
	// 隐藏列,字典列,格式化列
	for (var i = 0; i < length; i++) {
		if (params[i].visibleFlag == '0') {
			grid.setColumnHidden(i, true);
		} else {
			if (params[i].dictNo != 0) {
				grid.setColumnExcellType(i, "coro");
				var combo = grid.getCombo(i);
				var items = getDict(params[i].dictNo);
				if (!items) {
					continue;
				}
				var itemLength = items.length;
				for (var j = 0; j < itemLength; j++) {
					combo.put(items[j].value, items[j].text);
				}
			}
		}
	}

	// 设置列位置---
	grid.setOnAfterColumnMove(function(oldInd, newInd) {
		var i = 0;
		var length = 0;
		if (oldInd > newInd) {
			i = newInd;
			length = oldInd;
		} else {
			i = oldInd;
			length = newInd;
		}

		var list = new Array();
		for (; i <= length; i++) {
			var fieldName = grid.getColumnId(i);
			for (var j = 0; j < params.length; j++) {
				var param = params[j];
				if (param.fieldName == fieldName) {
					list.push({
						layoutId : param.layoutId,
						fieldName : param.fieldName,
						displayOrder : i
					});
				}
			}
		}

		/*
		 * postData({ url :
		 * "/common/layout/updateGridIndex.json?gridId="+_gridId, data :
		 * JSON.stringify(list), contentType : "json", callback : function(data) {
		 * //console.log(data.message); } });
		 */
		/*
		 * $.ajax({ type : "POST", url : path +
		 * "/common/layout/updateGridIndex.json", data : JSON.stringify(list),
		 * contentType : "application/json;charset=UTF-8", dataType : "json",
		 * success : function(data) { console.log(data.message); } });
		 */
		return true;
	});
	// 设置列宽
	// var index = undefined;
	// grid.setOnResize(function(ind, width, obj) {
	// index = ind;
	// return true;
	// });
	// grid.setOnResizeEnd(function(obj) {
	// // var width = obj.getColWidth(index); // 得到最新的列宽
	// // var param = params[index];
	// // var data = {
	// // gridId : param.gridId,
	// // fieldName : param.fieldName,
	// // fieldWidth : width
	// // };
	// // $.ajax({
	// // url : path + "/common/layout/updateWidth.json?gridId="+_gridId,
	// // data : data,
	// // dataType : 'json',
	// // success : function(data) {
	// // console.log(data.message);
	// // }
	// // });
	// return true;
	// });

	var orderArr = new Array();

	// 点击列头排序
	grid.setOnColumnSort(function(ind, type, direction) {
		var fieldName = grid.getColumnId(ind);
		var order = "";
		if (orderArr[fieldName] == undefined) {
			order = "asc";
			orderArr[fieldName] = "asc";
		} else {
			// console.log(orderArr[fieldName]);
			if (orderArr[fieldName] == "desc") {
				order = "asc";
				orderArr[fieldName] = "asc";
			} else {
				order = "desc";
				orderArr[fieldName] = "desc";
			}
		}
		grid.refresh(default_page_size, 0, fieldName, order);
		return false;
	});

	this.enablePaging = function(pageDivId, orderName, order) {
		grid.enablePaging(pageDivId, orderName, order);
	};

	this.refresh = function(pageSize, pageNo, orderName, order, assignType) {
		grid.refresh(pageSize, pageNo, orderName, order, assignType);
	};

	this.bind = function(url, formId, keyWords, keyId, elementsId) {
		grid.binding(url, formId, keyWords, keyId, elementsId);
	};

	this.setColumnType = function(columnId, type) {
		grid.setColumnExcellType(columnId, type);
	};

	this.clear = function() {
		grid.clearAll();
		grid.clearData();
	};
	
	this.startFastOperations = function(){
		grid.startFastOperations();
	}
	
	this.stopFastOperations = function(){
		grid.stopFastOperations();
	}
	
	this.grid = grid;

	// $(window).resize(function(){
	// /*grid.refresh();
	// grid.setSizes();*/
	// /*gridGetHgt();*/
	// });

	$("img[tooltip]").each(function() {
		var img = $(this);
		img.css("position", "relative");
		img.css("float", "right");
		img.css("height", "10px");
		img.css("width", "10px");
		img.css("margin-right", "4px");
		img.attr("src", _appServer + "/images/icoConfirm.png");

		$(img).tooltip({
			show : {
				effect : "slideDown",
				delay : 250
			},
			position : {
				my : "left bottom",
				at : "center top"
			}
		});
	});
}

function deleteColumn(grid, index){
	grid.deleteColumn(index);
}

function addColumn(grid, option) {
	var defaultOption = {
		index : 0,
		id : "",
		title : "",
		colType : "ed",
		width : 100,
		sort : "na",
		align : "left",
		valign : "middle",
		reseved : null,
		columnColor : null,
		oper : null
	};
	option = $.extend(defaultOption, option);

	// 添加操作列
	if (grid) {
		grid.insertColumn(option.index, option.title, option.colType,
				option.width, option.sort, option.align, option.valign,
				option.reseved, option.columnColor);
		if (option.id != "") {
			grid.setColumnId(option.index, option.id);
		}
		if (option.oper) {
			var operators = option.oper.title + "^javascript:"
					+ option.oper.event + "^_self";
			grid.attachEvent("onRowCreated", function(rId, rObj, rXml) {
				var self = this;
				var cell = self.cellById(rId, option.index);
				if (cell) {
					cell.setValue(operators);
				}
			});
		}
	}
}


function addOperatorColumn(grid, option) {
	var defaultOption = {
		index : 0,
		id : "",
		title : "",
		colType : "link",
		width : 100,
		sort : "na",
		align : "center",
		valign : "middle",
		reseved : null,
		columnColor : null,
		oper : null
	};
	option = $.extend(defaultOption, option);

	// 添加操作列
	if (grid) {
		grid.insertColumn(option.index, option.title, option.colType,
				option.width, option.sort, option.align, option.valign,
				option.reseved, option.columnColor);
		if (option.id != "") {
			grid.setColumnId(option.index, option.id);
		}
		if (option.oper) {
			var operators = option.oper.title + "^javascript:"
					+ option.oper.event + "^_self";
			grid.attachEvent("onRowCreated", function(rId, rObj, rXml) {
				var self = this;
				var cell = self.cellById(rId, option.index);
				if (cell) {
					cell.setValue(operators);
				}
			});
		}
	}
}

/**
 * 获取单元格数据值
 * 
 * @param grid
 *            表格对象
 * @param rId
 *            行号
 * @param columnName
 *            列名(字段名)
 * @returns 正确情况返回单元格的值，否则返回null
 */
function getGridColValue(grid, rId, columnName) {
	if (grid != undefined) {
		var colIndex = grid.getColIndexById(columnName);// 获得指定行id
		if (colIndex != undefined) {
			 try{
		        var str = escape2Html(grid.cellById(rId, colIndex).getValue());// 获得值
		    }catch(e){
		    	return null;
		    }
			return str
		}
	}
	return null;
}


function escape2Html(str) { 
	 var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'}; 
	 return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];}); 
} 
/**
 * 设置表格单元格文本显示样式
 * 
 * @param grid
 *            表格对象
 * @param rId
 *            行号
 * @param columnName
 *            列名(字段名)
 * @param style
 *            样式代码，比如：color:red;font-weight: bold;
 */
function setGridCellTextStyle(grid, rId, columnName, style) {
	if (grid != undefined) {
		var colIndex = grid.getColIndexById(columnName);
		if (colIndex != undefined) {
			grid.setCellTextStyle(rId, colIndex, style);
		}
	}
}

/**
 * 给单元格赋值
 * 
 * @param grid
 *            表格对象
 * @param rId
 *            行号
 * @param columnName
 *            列名(字段名)
 * @returns 正确情况返回单元格的值，否则返回null
 */
function setGridColValue(grid, rId, columnName, value) {
	if (grid != undefined) {
		var colIndex = grid.getColIndexById(columnName);// 获得指定行id
		if (colIndex != undefined) {
			grid.cellById(rId, colIndex).setValue(value);// 获赋值
		}
	}
}
/**
 * 获取当前页面的域名+应用 如：http://localhost:8080/zrtc/
 * 
 * @returns
 */
function getHostUrl() {
	var curPath = window.location.href;
	var pathName = window.location.pathname;
	var pos = curPath.indexOf(pathName);
	var localhostPath = curPath.substring(0, pos); // 获取带"/"的项目名
	var projectName = pathName
			.substring(0, pathName.substr(1).indexOf('/') + 1);
	var rootPath = localhostPath + projectName;

	return rootPath;
}

/**
 * 通用树控件
 * 
 */
function commonTreeObject(option) {
	var tree;
	var defaultOption = {
		divId : "",
		checkBoxesState : 0,// 0：无多选框,1:允许半选状态,2:不允许半选状态
		afterCheck : null
	};
	var optionReal = $.extend(true, defaultOption, option);

	$("#" + optionReal.divId).html("");
	tree = new dhtmlXTreeObject(optionReal.divId, "100%", "100%", 0);
	tree.setImagePath(_appServer + "/plugin/dhtmlxTree/imgs/csh_dhx_skyblue/");
	tree.setDataMode("json");

	this.initData = function() {
		if (optionReal.checkBoxesState == 1) {// 是否需要多选框
			tree.enableCheckBoxes(1);
			tree.enableThreeStateCheckboxes(true);
		} else if (optionReal.checkBoxesState == 2) {
			tree.enableCheckBoxes(1);
		}
		if (optionReal.afterCheck != null) {
			tree.setOnCheckHandler(optionReal.afterCheck);
		}
	};
	this.clear = function() {
		$("#" + optionReal.divId).empty();
	};
	this.loadData = function(data) {
		this.initData();
		tree.loadJSONObject(data);
	};
	this.isItemChecked = function(itemId) {
		return tree.isItemChecked(itemId);
	};
	this.setCheck = function(itemId, status) {
		tree.setCheck(itemId, status);
	};
	this.getAllCheckedBranches = function() {
		return tree.getAllCheckedBranches();
	};

	this.tree = tree;
	this.initData();
}

/**
 * 通用树表格控件
 * 
 */
function commonTreeGridObject(option) {
	var mygrid;
	var defaultOption = {
		divId : ""
	};
	var optionReal = $.extend(true, defaultOption, option);

	mygrid = new dhtmlXGridObject(optionReal.divId);
	mygrid.selMultiRows = true;
	mygrid.imgURL = _appServer + "/plugin/dhtmlxTree/imgs/csh_dhx_skyblue/";
	mygrid.enableTreeGridLines();
	mygrid.init();
	mygrid.loadXML("treegrid.xml");
}

/**
 * 证券内码生成
 */
function interCodeGenerate(mn, reportCode) {

	if (mn == 0) {
		$("interCodeAdd").attr("readonly", true);
	} else if (reportCode == undefined || reportCode == "") {
		$("#interCodeAdd").val("");
	} else {
		var interCodetmp;
		var interCode;
		var i;
		var marketNo;
		var sn = sequenceNoGet(mn) + "";
		var sequenceNo = sn;
		// int型转字符串并补零
		marketNo = mn.toString();
		for (i = 0; i < (3 - mn.toString().length); i++) {
			marketNo = "0" + marketNo;
		}
		for (i = 0; i < (6 - sn.length); i++) {
			sequenceNo = "0" + sequenceNo;
		}
		// alert(reportCode.length);
		// 沪，深，银行间
		if (marketNo == "001" || marketNo == "002" || marketNo == "005") {
			// reportCode小于6位且为数字
			if (!isNaN(parseInt(reportCode, 10)) && reportCode.length <= 6) {
				// 0+reportCode+marketNo
				for (i = 0; i < (6 - reportCode.length); i++) {
					reportCode = "0" + reportCode;
				}
				interCodetmp = "0" + reportCode + marketNo;
			}
			// reportCode大于等于6位或不为数字
			else {
				// 1+序号+marketNo
				interCodetmp = "1" + sequenceNo + marketNo;
			}
		} else {
			// 1+序号+marketNo
			interCodetmp = "1" + sequenceNo + marketNo;
		}

		// 字符串转化为整数
		interCode = parseInt(interCodetmp, 10);
		return interCode;
		// alert(interCode);
	}
}

/**
 * 序号获取
 */
function sequenceNoGet(mn) {
	var mkn = null;
	postData({
		url : "/common/interCodeGenerate/sequenceNoGet.json",
		data : {
			marketNo : mn
		},
		async : false,
		callback : function(data) {
			mkn = data;
		}
	});
	return mkn;
}

/*
 * Ajax overlay 1.0 Author: Simon Ilett @ aplusdesign.com.au Descrip: Creates
 * and inserts an ajax loader for ajax calls / timed events Date: 03/08/2011
 */
function ajaxLoader(el, options) {
	// Becomes this.options
	var defaults = {
		bgColor : '',
		duration : 150,
		opacity : 1.0,
		classOveride : false
	};
	this.options = jQuery.extend(defaults, options);
	this.container = $(el);
	this.init = function() {
		var container = this.container;
		// Delete any other loaders
		this.remove();
		// Create the overlay
		var overlay = $('<div></div>').css({
			'background-color' : this.options.bgColor,
			'opacity' : this.options.opacity,
			'width' : container.width() - 20,
			'height' : $(window).height(),
			'position' : 'absolute',
			'top' : '0px',
			'left' : '0px',
			'z-index' : 99999
		}).addClass('ajax_overlay');
		// add an overiding class name to set new loader style
		if (this.options.classOveride) {
			overlay.addClass(this.options.classOveride);
		}
		// insert overlay and loader into DOM
		container.append(overlay.append(
				$('<div></div>').addClass('ajax_loader')).fadeIn(
				this.options.duration));
	};

	this.remove = function() {
		var overlay = this.container.children(".ajax_overlay");
		if (overlay.length) {
			overlay.fadeOut(this.options.classOveride, function() {
				overlay.remove();
			});
		}
	}

	this.init();
}

/**
 * 初始化工具栏操作员权限
 * 
 * @param toolbarId
 *            工具栏的id或class
 * @param operRights
 *            操作员的权限列表
 */
function initToolbarOperRight(toolbarId, operRights) {
	var toolbar = $("." + toolbarId);
	if (toolbar && operRights) {
		var hasRight = false;
		$("input[rightcode]").each(function() {
			hasRight = false;
			var rightcode = $(this).attr("rightcode");
			for (var i = 0; i < operRights.length; i++) {
				if (operRights[i].operCode == rightcode) {
					hasRight = true;
					break;
				}
			}
			if (hasRight == false) {
				$(this).css("display", "none");
			}
		});
	}
}

/**
 * 检查权限
 * 
 * @param rightCode
 *            权限代码
 * @returns {Boolean}
 */
function checkOperRigth(rightCode) {
	// 兼容没有设置right
	if (rightCode == undefined || rightCode == "") {
		return true;
	}

	if (_operRights) {
		for (var i = 0; i < _operRights.length; i++) {
			if (_operRights[i].operCode == rightCode) {
				return true;
			}
		}
	}

	return false;
}

/**
 * 获取系统初始化日期
 */
function getSystemInitDate() {
	var initDate = new Date();
	postData({
		url : "/common/systeminfo/getInitDate.json",
		async : false,
		callback : function(result) {
			if (result.initDate != undefined) {
				var fmtDate = formatDate(result.initDate, "-");
				initDate = new Date(fmtDate.replace(/-/g, "/"));// hewenxiu，解决兼容性问题
			}
		}
	});

	return initDate;
}

/**
 * 手动清除表格中显示警告的div
 */
function clearDivShow() {
	$(".formError").closest('.formErrorOuter').remove();
	$(".formError").remove();
}


//显示错误或提示信息（需要引用jNotify相关文件）
function showError(tips, TimeShown, autoHide) {
    jError( 
			//下面的内容为提示的内容。
			'<strong>'+tips+'</strong>',
			{
				//下面为提示框的具体参数设置。
				autoHide : autoHide,   //jnotify自动隐藏 true false
				clickOverlay : false,  //jnotify弹出层单击遮罩层才关闭提示条（遮罩层即半透明黑色背景）
				MinWidth : 250,   //jnotify弹出层宽度
				TimeShown : TimeShown,   //显示时长。只有当autoHide（自动隐藏）参数为true时起作用。
				ShowTimeEffect : 200,   //jnotify完全显示出来花费时间。
				HideTimeEffect : 200,   //与上面参数相反，jnotify从页面上消失所需时间
				LongTrip : 20,          //当jnotify弹出层提示条显示和隐藏时的位移
				HorizontalPosition : 'center',  //jnotify弹出层提示条位于水平方向上的位置，参数有left,center,right
				VerticalPosition : 'center',    //jnotify弹出层提示条位于垂直方向上的位置，参数有top,center,bottom
				ShowOverlay : true,   //是否显示遮罩层（遮罩层即半透明黑色背景）
				ColorOverlay : '#000',   //遮罩层颜色
				OpacityOverlay : 0.3,   //遮罩层透明度，最大是1，最小是0.1
				onClosed : function(){
				},   //关闭jnotify弹出层提示条调用的函数
				onCompleted : function(){}   //打开jnotify弹出层提示条调用的函数
			}
	);
}

//显示提示信息
function showSuccess(tips, TimeShown, autoHide) {
	jSuccess( 
			//下面的内容为提示的内容。
			'<strong>'+tips+'</strong>',
			{
				//下面为提示框的具体参数设置。
				autoHide : autoHide,   //jnotify自动隐藏 true false
				clickOverlay : false,  //jnotify弹出层单击遮罩层才关闭提示条（遮罩层即半透明黑色背景）
				MinWidth : 250,   //jnotify弹出层宽度
				TimeShown : TimeShown,   //显示时长。只有当autoHide（自动隐藏）参数为true时起作用。
				ShowTimeEffect : 200,   //jnotify完全显示出来花费时间。
				HideTimeEffect : 200,   //与上面参数相反，jnotify从页面上消失所需时间
				LongTrip : 20,          //当jnotify弹出层提示条显示和隐藏时的位移
				HorizontalPosition : 'center',  //jnotify弹出层提示条位于水平方向上的位置，参数有left,center,right
				VerticalPosition : 'center',    //jnotify弹出层提示条位于垂直方向上的位置，参数有top,center,bottom
				ShowOverlay : true,   //是否显示遮罩层（遮罩层即半透明黑色背景）
				ColorOverlay : '#000',   //遮罩层颜色
				OpacityOverlay : 0.3,   //遮罩层透明度，最大是1，最小是0.1
				onClosed : function(){
				},   //关闭jnotify弹出层提示条调用的函数
				onCompleted : function(){}   //打开jnotify弹出层提示条调用的函数
			}
	);
}

//显示提示信息
function showNotify(tips, TimeShown, autoHide) {
	jNotify( 
			//下面的内容为提示的内容。
			'<strong>'+tips+'</strong>',
			{
				//下面为提示框的具体参数设置。
				autoHide : autoHide,   //jnotify自动隐藏 true false
				clickOverlay : false,  //jnotify弹出层单击遮罩层才关闭提示条（遮罩层即半透明黑色背景）
				MinWidth : 250,   //jnotify弹出层宽度
				TimeShown : TimeShown,   //显示时长。只有当autoHide（自动隐藏）参数为true时起作用。
				ShowTimeEffect : 200,   //jnotify完全显示出来花费时间。
				HideTimeEffect : 200,   //与上面参数相反，jnotify从页面上消失所需时间
				LongTrip : 20,          //当jnotify弹出层提示条显示和隐藏时的位移
				HorizontalPosition : 'center',  //jnotify弹出层提示条位于水平方向上的位置，参数有left,center,right
				VerticalPosition : 'center',    //jnotify弹出层提示条位于垂直方向上的位置，参数有top,center,bottom
				ShowOverlay : true,   //是否显示遮罩层（遮罩层即半透明黑色背景）
				ColorOverlay : '#000',   //遮罩层颜色
				OpacityOverlay : 0.3,   //遮罩层透明度，最大是1，最小是0.1
				onClosed : function(){
				},   //关闭jnotify弹出层提示条调用的函数
				onCompleted : function(){}   //打开jnotify弹出层提示条调用的函数
			}
	);
}


//生成一个惟一的ID
function getModalID() {
	var d = new Date();
	var vYear = d.getFullYear();
	var vMon = d.getMonth() + 1;
	var vDay = d.getDate();
	var h = d.getHours();
	var m = d.getMinutes();
	var se = d.getSeconds();
	var sse = d.getMilliseconds();
	return 't_' + vYear + vMon + vDay + h + m + se + sse;
}

//浏览器内部实现html的转码与解码
var HtmlUtil = {
	    htmlEncode:function (html){
	        var temp = document.createElement("div");
	        (temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
	        var output = temp.innerHTML;
	        temp = null;
	        return output;
	    },
	    htmlDecode:function (text){
	        var temp = document.createElement("div");
	        temp.innerHTML = text;
	        var output = temp.innerText || temp.textContent;
	        temp = null;
	        return output;
	    }
};

/**
 * 加密方法。没有过滤首尾空格，即没有trim.    
 * 加密可以加密N次，对应解密N次就可以获取明文    
 * @param mingwen
 * @param times
 */
 function encodeBase64(mingwen, times) {
	var code = "";
	var num = 1;
	if (typeof times == 'undefined' || times == null || times == "") {
		num = 1;
	} else {
		var vt = times + "";
		num = parseInt(vt);
	}
	if (typeof mingwen == 'undefined' || mingwen == null || mingwen == "") {
	} else {
		$.base64.utf8encode = true;
		code = mingwen;
		for (var i = 0; i < num; i++) {
			code = $.base64.btoa(code);
		}
	}
	return code;
}