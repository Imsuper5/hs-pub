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
	var myfriend = new Array();
	var Alchoose = new Array();
	$("#" + option.uid).val();
	$("#" + option.jid).val();
	var leftnum = 0;
	// 转换好友数据
	if (option.data != null) {
		for (var i = 0; i < option.data.length; i++) {
			var father = {};
			father.text = option.data[i].name;
			father.tags = [ option.data[i].nums ];
			father.group = true;
			var nodes = new Array();
			var item = option.data[i].item;
			for (var j = 0; j < item.length; j++) {
				var child = {};
				child.text = item[j].name;
				child.jid = item[j].id;
				child.uid = item[j].userId;
				child.group = false;
				nodes.push(child);
				// 已选好友
				if (option.chsedata != "") {
					userids = option.chsedata.split(",");
					for (var k = 0; k < userids.length; k++) {
						if (item[j].userId == userids[k])
							Alchoose.push(child);
					}
				}
				leftnum++;
			}
			father.nodes = nodes;
			myfriend.push(father);
		}
	}
	// 显示已选栏
	choose();
	$("#" + option.id).treeview(
			{
				nodeIcon : "glyphicon glyphicon-user",
				color : "yellow",
				backColor : "#1ab394",
				onhoverColor : "orange",
				borderColor : "red",
				showBorder : !1,
				showTags : !0,
				highlightSelected : !0,
				selectedColor : "yellow",
				selectedBackColor : "darkorange",
				data : myfriend,
				onNodeSelected : function(e, o) {
					var ischoose = false;
					var nodes = new Array();
					if (o.group) {
						if (o.nodes != undefined)
							nodes = o.nodes;
					} else {
						nodes.push(o);
					}
					for (var i = 0; i < nodes.length; i++) {
						var ret = true;
						for (var j = 0; j < Alchoose.length; j++) {
							if (Alchoose[j].uid == nodes[i].uid
									|| Alchoose.length >= 100)
								ret = false;
						}
						if (ret) {
							Alchoose.push(nodes[i]);
							ischoose = true;
						}
					}
					if (ischoose)
						choose();
				}
			});

	function choose() {
		$("#" + option.chseid).treeview({
			nodeIcon : "glyphicon glyphicon-user",
			color : "yellow",
			backColor : "#1ab394",
			onhoverColor : "orange",
			borderColor : "red",
			showBorder : !1,
			showTags : !0,
			highlightSelected : !0,
			selectedColor : "yellow",
			selectedBackColor : "darkorange",
			data : Alchoose,
			onNodeSelected : function(e, o) {
				var ret = false;
				for (var j = 0; j < Alchoose.length; j++) {
					if (Alchoose[j].uid == o.uid) {
						Alchoose.splice(j, 1);
						ret = true;
					}
				}
				if (ret)
					choose();
			}
		});
		callback();
	}
	function callback() {
		var jids = "", uids = "";
		for (var j = 0; j < Alchoose.length; j++) {
			jids += "," + Alchoose[j].jid;
			uids += "," + Alchoose[j].uid;
		}
		if (jids.length > 0) {
			jids = jids.substr(1, jids.length);
		}
		if (uids.length > 0) {
			uids = uids.substr(1, uids.length);
		}

		$("#" + option.jid).val(jids);
		$("#" + option.uid).val(uids);

		$("#left-num").html(leftnum);
		$("#right-num").html(Alchoose.length);
	}
}
