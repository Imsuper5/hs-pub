function createFriendDiv(option) {
	var defaultOption = {
		id : "",
		data : null,
		chseid : "",
		chsedata : "",
		jid : "",
		uid : ""
	};
	option = $.extend(true, defaultOption, option);
	// 初始化值
	var leftnum = 0;
	var rightnum = 0;
	$("#" + option.uid).val("");
	$("#" + option.jid).val("");
	// 转换好友数据
	if (option.data != null) {
		if ($("#friend-select").length > 0)
			$("#friend-select").empty();
		else
			$("#" + option.id).append(
					"<select id=\"friend-select\" multiple=\"multiple\">")

		for (var i = 0; i < option.data.length; i++) {
			var groupname = option.data[i].name;
			var item = option.data[i].item;
			for (var j = 0; j < item.length; j++) {
				// 已选好友
				var selected = "";
				if (option.chsedata != "") {
					userids = option.chsedata.split(",");
					for (var k = 0; k < userids.length; k++) {
						if (item[j].userId == userids[k]){
							selected = "selected=\"selected\"";
							rightnum++;
						}							
					}
				}
				var selectoption = "<option value=\"" + item[j].id
						+ "\" data-section=\"" + groupname + "\" data-index=\""
						+ item[j].userId + "\"" + selected + ">" + item[j].name
						+ "</option>";
				$("#friend-select").append(selectoption);

				leftnum++;
			}
		}
		if ($(".tree-multiselect").length > 0) {
			$(".tree-multiselect").remove();
		}
		$("#friend-select").treeMultiselect({
			selectAllText : '全选',
			unselectAllText : '全取消',
			onChange : callback,
			enableSelectAll : true,
			sortable : true
		});
		$("#left-num").html(leftnum);
		$("#right-num").html(rightnum);
	}

	function callback() {
		var jids = "", uids = "";
		var selectdiv = $(".tree-multiselect").find(".selected").find(".item");
		for (var j = 0; j < selectdiv.length; j++) {
			jids += "," + $(selectdiv[j]).attr("data-value");
			uids += "," + $(selectdiv[j]).attr("data-index");
		}
		if (jids.length > 0) {
			jids = jids.substr(1, jids.length);
		}
		if (uids.length > 0) {
			uids = uids.substr(1, uids.length);
		}

		$("#" + option.jid).val(jids);
		$("#" + option.uid).val(uids);

		$("#right-num").html(selectdiv.length);
	}
}
