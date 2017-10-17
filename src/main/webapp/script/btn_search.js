var addBtnGroupSearch = function(id, index, submitname, beferQuery, afterQuery,
		isall) {
	this.id = id;// 总div容器
	this.index = index;// 几行
	this.submitname = submitname;// 回传值
	this.beferQuery = beferQuery;// 前执行事件
	this.afterQuery = afterQuery;// 后执行事件
	var btn_index = 0;
	var ckb_index = 0;
	var toolbar = $("#" + id);
	if (toolbar.length && toolbar.length > 0) {
		// btn-all
		if ($("#btn-all").length == 0 && isall && index == 1) {
			// 自动加载showall按钮
			toolbar
					.append('<div class="top" id="div-1"><div class="top-header btn-group" id="div-1-btnall" style="margin-left: 61px;"><input type="button" id="btn-all" value="SHOW All" class="btn btn-outline btn-primary mybtnWH"  /></div></div>');
			btndown("btn-all");
			// 全选、反全选事件
			$("#btn-all").click(function() {
				allBtnStart(id);
				// 后执行事件
				if (afterQuery != null && typeof (afterQuery) == "function") {
					var r = afterQuery();
					if (r === false) {
						return;
					}
				}
			});
		}

		if ($("#div-" + index).length == 0) // 加载第一层
			toolbar.append('<div class="top" id="div-' + index + '"></div>');
		if ($("#div-" + index + "-" + submitname).length == 0)// 加载第二层
			$("#div-" + index).append(
					'<div class="top-header btn-group" id="div-' + index + '-'
							+ submitname + '" ></div>');
		// 事件
		this.addspan = function(text, numCN) {
			style = "";
			if (numCN != undefined)
				style = "style='height:17px;width:" + 12 * numCN + "px;'";
			$("#div-" + index + "-" + submitname).append(
					'<span class="top-text"' + style + '>' + text + '</span>');
		}
		this.addbtn = function(name, submitval, more) {
			var btn = '<input type="button" id="btn-' + index + '-'
					+ submitname + '-' + btn_index + '" value="' + name
					+ '" submitval="' + submitval
					+ '" class="btn btn-outline btn-primary mybtnWH"  />';
			$("#div-" + index + '-' + submitname).append(btn);
			// 初始赋值
			if (btn_index == 0) {
				btndown('btn-' + index + '-' + submitname + '-' + btn_index);
				$("#" + submitname).val(submitval);
			}
			// 多选按钮组加 moreBtn class
			if (more == "more") {
				$("#btn-" + index + "-" + submitname + "-" + btn_index)
						.addClass("moreBtn");
			}
			// /每个btn绑定事件
			$("#btn-" + index + "-" + submitname + "-" + btn_index)
					.click(
							function() {
								// 后执行事件
								if (beferQuery != null
										&& typeof (beferQuery) == "function") {
									var r = beferQuery();
									if (r === false) {
										return;
									}
								}
								// showall按钮复位
								var idstr = this.id.split("-");
								if (idstr[3] != "0") {
									btnup('btn-all');
								}
								if (more == "more") {
									// 样式改变
									if ($(this).hasClass("btndown")) {
										btnup(this.id);
									} else {
										btndown(this.id);
									}
									// 兄弟按钮样式改变
									var btndownVal = "";
									var otherBtn = $("input[id^='" + idstr[0]
											+ "-" + idstr[1] + "-" + idstr[2]
											+ "']");
									for (var j = 0; j < otherBtn.length; j++) {
										if (otherBtn[j].id != this.id
												&& !$(otherBtn[j]).hasClass(
														"moreBtn")) {
											btnup(otherBtn[j].id);
										}
										if ($(otherBtn[j]).hasClass("btndown"))
											btndownVal += $(otherBtn[j]).attr(
													"submitval")
													+ ",";
									}
									// 赋值
									if (btndownVal.length > 0)
										btndownVal = btndownVal.substring(0,
												btndownVal.length - 1);
									$("#" + idstr[2]).val(btndownVal);
								} else {
									// 样式改变
									btndown(this.id);
									// 兄弟按钮样式改变
									var otherBtn = $("input[id^='" + idstr[0]
											+ "-" + idstr[1] + "-" + idstr[2]
											+ "']");
									for (var j = 0; j < otherBtn.length; j++) {
										if (otherBtn[j].id != this.id) {
											btnup(otherBtn[j].id);
										}
									}
									// 赋值
									$("#" + idstr[2]).val(
											$(this).attr("submitval"));
								}

								// 后执行事件
								if (afterQuery != null
										&& typeof (afterQuery) == "function") {
									var r = afterQuery();
									if (r === false) {
										return;
									}
								}
							});
			btn_index++;
		}
		this.addDicbtn = function(dictNo, more, start, end) {
			var dict = getDict(dictNo);
			if (dict != null) {
				var sIndex = 0, eIndex = dict.length;
				if (start != null && start < dict.length) {
					sIndex = start;
					if (end != null && end < dict.length && end > start)
						eIndex = end;
				}

				for (var i = sIndex; i < eIndex; i++) {
					var name = dict[i].text;
					var submitval = dict[i].value;
					var btn = '<input type="button" id="btn-'
							+ index
							+ '-'
							+ submitname
							+ '-'
							+ btn_index
							+ '" value="'
							+ name
							+ '" submitval="'
							+ submitval
							+ '" class="btn btn-outline btn-primary mybtnWH"  />';
					$("#div-" + index + '-' + submitname).append(btn);
					// 初始赋值
					if (btn_index == 0) {
						btndown('btn-' + index + '-' + submitname + '-'
								+ btn_index);
						$("#" + submitname).val(submitval);
					}
					// 多选按钮组加 moreBtn class
					if (more == "more") {
						$("#btn-" + index + "-" + submitname + "-" + btn_index)
								.addClass("moreBtn");
					}
					// /每个btn绑定事件
					$("#btn-" + index + "-" + submitname + "-" + btn_index)
							.click(
									function() {
										// 后执行事件
										if (beferQuery != null
												&& typeof (beferQuery) == "function") {
											var r = beferQuery();
											if (r === false) {
												return;
											}
										}
										// showall按钮复位
										var idstr = this.id.split("-");
										if (idstr[3] != "0") {
											btnup('btn-all');
										}
										if (more == "more") {
											// 样式改变
											if ($(this).hasClass("btndown")) {
												btnup(this.id);
											} else {
												btndown(this.id);
											}

											// 兄弟按钮样式改变
											var btndownVal = "";
											var otherBtn = $("input[id^='"
													+ idstr[0] + "-" + idstr[1]
													+ "-" + idstr[2] + "']");
											for (var j = 0; j < otherBtn.length; j++) {
												if (otherBtn[j].id != this.id
														&& !$(otherBtn[j])
																.hasClass(
																		"moreBtn")) {
													btnup(otherBtn[j].id);
												}
												if ($(otherBtn[j]).hasClass(
														"btndown"))
													btndownVal += $(otherBtn[j])
															.attr("submitval")
															+ ",";
											}
											// 都为up状态，初始化
											if ($("input[id^='" + idstr[0]
													+ "-" + idstr[1] + "-"
													+ idstr[2] + "'].btndown").length == 0) {
												btndown(idstr[0] + "-"
														+ idstr[1] + "-"
														+ idstr[2] + "-0");
												btndownVal = $(
														"#" + idstr[0] + "-"
																+ idstr[1]
																+ "-"
																+ idstr[2]
																+ "-0").attr(
														"submitval")+ ",";
											}

											// 赋值
											if (btndownVal.length > 0)
												btndownVal = btndownVal
														.substring(
																0,
																btndownVal.length - 1);
											$("#" + idstr[2]).val(btndownVal);

										} else {
											// 样式改变
											btndown(this.id);
											// 兄弟按钮样式改变
											var otherBtn = $("input[id^='"
													+ idstr[0] + "-" + idstr[1]
													+ "-" + idstr[2] + "']");
											for (var j = 0; j < otherBtn.length; j++) {
												if (otherBtn[j].id != this.id) {
													btnup(otherBtn[j].id);
												}
											}
											// 赋值
											$("#" + idstr[2]).val(
													$(this).attr("submitval"));
										}

										// 后执行事件
										if (afterQuery != null
												&& typeof (afterQuery) == "function") {
											var r = afterQuery();
											if (r === false) {
												return;
											}
										}
									});
					btn_index++;
				}
			}

		}
		this.addListbtn = function(list, textField, valueField, more, addClass) {
			if (list != null) {
				for (var i = 0; i < list.length; i++) {
					var item = list[i];
					var name = item[textField];
					var submitval = item[valueField];
					var btn = '<input type="button" id="btn-'
							+ index
							+ '-'
							+ submitname
							+ '-'
							+ btn_index
							+ '" value="'
							+ name
							+ '" submitval="'
							+ submitval
							+ '" class="btn btn-outline btn-primary mybtnWH"  />';
					$("#div-" + index + '-' + submitname).append(btn);
					// 初始赋值
					if (btn_index == 0) {
						btndown('btn-' + index + '-' + submitname + '-'
								+ btn_index);
						$("#" + submitname).val(submitval);
					}
					// 多选按钮组加 moreBtn class
					if (more == "more") {
						$("#btn-" + index + "-" + submitname + "-" + btn_index)
								.addClass("moreBtn");
					}
					// 加 额外 class
					if (addClass!=null && addClass.length >0) {
						$("#btn-" + index + "-" + submitname + "-" + btn_index)
								.addClass(addClass);
					}
					// /每个btn绑定事件
					$("#btn-" + index + "-" + submitname + "-" + btn_index)
							.click(
									function() {
										// 后执行事件
										if (beferQuery != null
												&& typeof (beferQuery) == "function") {
											var r = beferQuery();
											if (r === false) {
												return;
											}
										}
										// showall按钮复位
										var idstr = this.id.split("-");
										if (idstr[3] != "0") {
											btnup('btn-all');
										}
										if (more == "more") {
											// 样式改变
											if ($(this).hasClass("btndown")) {
												btnup(this.id);
											} else {
												btndown(this.id);
											}
											// 兄弟按钮样式改变
											var btndownVal = "";
											var otherBtn = $("input[id^='"
													+ idstr[0] + "-" + idstr[1]
													+ "-" + idstr[2] + "']");
											for (var j = 0; j < otherBtn.length; j++) {
												if (otherBtn[j].id != this.id
														&& !$(otherBtn[j])
																.hasClass(
																		"moreBtn")) {
													btnup(otherBtn[j].id);
												}
												if ($(otherBtn[j]).hasClass(
														"btndown"))
													btndownVal += $(otherBtn[j])
															.attr("submitval")
															+ ",";
											}
											// 都为up状态，初始化
											if ($("input[id^='" + idstr[0]
													+ "-" + idstr[1] + "-"
													+ idstr[2] + "'].btndown").length == 0) {
												btndown(idstr[0] + "-"
														+ idstr[1] + "-"
														+ idstr[2] + "-0");
												btndownVal = $(
														"#" + idstr[0] + "-"
																+ idstr[1]
																+ "-"
																+ idstr[2]
																+ "-0").attr(
														"submitval")+ ",";
											}

											// 赋值
											if (btndownVal.length > 0)
												btndownVal = btndownVal
														.substring(
																0,
																btndownVal.length - 1);
											$("#" + idstr[2]).val(btndownVal);

										} else {
											// 样式改变
											btndown(this.id);
											// 兄弟按钮样式改变
											var otherBtn = $("input[id^='"
													+ idstr[0] + "-" + idstr[1]
													+ "-" + idstr[2] + "']");
											for (var j = 0; j < otherBtn.length; j++) {
												if (otherBtn[j].id != this.id) {
													btnup(otherBtn[j].id);
												}
											}
											// 赋值
											$("#" + idstr[2]).val(
													$(this).attr("submitval"));
										}

										// 后执行事件
										if (afterQuery != null
												&& typeof (afterQuery) == "function") {
											var r = afterQuery();
											if (r === false) {
												return;
											}
										}
									});
					btn_index++;
				}
			}

		}
		this.addckb = function(name, submitval) {
			var ckb = ' <label class="top-ckb" id="lab-' + index + '-'
					+ submitname + '-' + ckb_index
					+ '"><input type="checkbox" " value="' + submitval
					+ '" class="i-checks">' + name + '</label>';
			$("#div-" + index + "-" + submitname).append(ckb);
			$("#lab-" + index + "-" + submitname + "-" + ckb_index).on(
					"ifChecked ifUnchecked",
					function(event) {
						// 后执行事件
						if (beferQuery != null
								&& typeof (beferQuery) == "function") {
							var r = beferQuery();
							if (r === false) {
								return;
							}
						}
						var vals = "";
						$(this).find(":checked").each(function() {
							vals += $(this).val() + ",";
						});
						if (vals.length > 0) {
							vals = vals.substr(0, vals.length - 1);
						}
						$("#" + submitname).val(vals);
						// 后执行事件
						if (afterQuery != null
								&& typeof (afterQuery) == "function") {
							var r = afterQuery();
							if (r === false) {
								return;
							}
						}
					});
			ckb_index++;
		}

		this.addlable = function(subid) {
			$("#div-" + index + "-" + submitname).append(
					'<input id="' + subid + '" name="' + subid
							+ '" class="top-input-text" type="text" >');
		}
	}
}
function allBtnStart(id) {
	var allBtn = $("#" + id).find("input.btn");
	for (var j = 0; j < allBtn.length; j++) {
		var idstr = allBtn[j].id.split("-");
		if (idstr.length == 4 && idstr[3] != "0") {
			btnup(allBtn[j].id);
		} else if (idstr.length < 4) {
			btndown(allBtn[j].id);
		} else {
			btndown(allBtn[j].id);
			$("#" + idstr[2]).val($(allBtn[j]).attr("submitval"));
		}
	}
	var alllabel = $("#" + id).find("input.top-input-text");
	for (var j = 0; j < alllabel.length; j++) {
		alllabel[j].value = "";
	}
}
function btndown(id) {
	if ($("#" + id).length > 0) {
		if (!$("#" + id).hasClass("btndown")) {
			$("#" + id).addClass("btndown");
			$("#" + id).removeClass("btnup");
		}
	}
}
function btnup(id) {
	if ($("#" + id).length > 0) {
		if (!$("#" + id).hasClass("btnup")) {
			$("#" + id).addClass("btnup");
			$("#" + id).removeClass("btndown");
		}
	}
}
$('.i-checks').iCheck({
	checkboxClass : 'icheckbox_square-green',
	radioClass : 'iradio_square-green',
});