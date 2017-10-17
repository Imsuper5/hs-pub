//分页控件
dhtmlXGridObject.prototype.enablePaging = function(pageDivId) {

	$("#" + pageDivId).pagination(0, {
		dhtmlObj : this,
		callback : this.pageselectCallback
	// 回调函数，在这个函数中写显示列表代码
	});
	this.pageDivId = pageDivId;
};

// 分页获取后台数据
dhtmlXGridObject.prototype.pageselectCallback = function(opts) {
	//opts.dhtmlObj.refresh($(".items_per_page_value").val(), opts.current_page,opts.orderName, opts.order);
	opts.dhtmlObj.refresh(default_page_size, opts.current_page,opts.orderName, opts.order);
};

// 获取url
dhtmlXGridObject.prototype.binding = function(url, formId, keyWords, keyId) {
	this.url = url;
	this.formId = formId;
	this.keyWords = keyWords;
	this.keyId = keyId;
};

// 设置表格id
dhtmlXGridObject.prototype.setGridId = function(gridId) {
	this.gridId = gridId;
};

// 提交表单查询后台数据
// assignType枚举类：screen-fresh、div-fresh、msg-fresh
dhtmlXGridObject.prototype.refresh = function(pageSize, pageNo, orderName,
		order, assignType) {
	this.orderName = orderName;
	this.order = order;
	var gridObject = this;
	var el = null;
	if (assignType == undefined
			|| assignType == global_fresh_position.fullScreen) {
		el = document.body;
	} else if (assignType == global_fresh_position.div) {
		el = gridObject.entBox;
	} else {
		el = gridObject.objBox;
	}
	var lodingBox = new ajaxLoader(el);

	var values = {};
	if (this.formId != "") {
		values = $("#" + this.formId).serializeJson();
	}

	var rows = null;
	var url = this.url;
	var pageDivId = gridObject.pageDivId;
	if (pageDivId != undefined) {
		if (url.indexOf("?") == -1) {
			url += "?";
		} else {
			url += "&";
		}

		if (pageSize == undefined) {
			//pageSize = $(".items_per_page_value").val();
			pageSize = default_page_size;
		}
		url += "pageSize=" + pageSize;
		if (pageNo == undefined) {
			pageNo = 0;
		}
		url += "&pageNo=" + pageNo;
		var startRow=pageSize*pageNo;
		url += "&startRow=" + startRow;
		if (orderName != undefined) {
			var nameMappgin = getMappingNames(gridObject.gridId, orderName);
			url += "&sortName=" + nameMappgin;
			url += "&sortType=" + order;
		}
		if (this.keyWords != undefined) {
			if (this.keyId == null) {
				values[this.keyWords] = $("#keywordField").val();
			} else {
				values[this.keyWords] = $("#" + this.keyId).val();
			}
		}
	} else {
		if (orderName != undefined) {
			if (url.indexOf("?") == -1) {
				url += "?";
			} else {
				url += "&";
			}

			var nameMappgin = getMappingNames(gridObject.gridId, orderName);
			url += "&sortName=" + nameMappgin;
			url += "&sortType=" + order;
		}
		if (this.keyWords != undefined) {
			if (this.keyId == null) {
				values[this.keyWords] = $("#keywordField").val();
			} else {
				values[this.keyWords] = $("#" + this.keyId).val();
			}
		}
	}
	
	var allData;
	if(!gloadl_pagination_flag){
		return;
	}
	gloadl_pagination_flag = false;
	postData({
		url : url,
		data : values,
		callback : function(data) {
			allData = data;
			var message = data.message;
			if (message.success) {				
				rows = data.rows;
				if (rows == null) {
					$(".getDataTips").html("未加载到数据！");
				} else {
					$(".getDataTips").hide();
				}
				gridObject.clearAll();
				// 排序箭头显示
				if (orderName != undefined) {
					var orderColIndex = gridObject.getColIndexById(orderName);
					if (orderColIndex != undefined) {
						gridObject.setSortImgState(true, orderColIndex, order);
					}
				}
				var datas = new dhtmlXDataStore({
					data : rows,
					datatype : "json"
				});
				gridObject.currentPage = pageNo;
				gridObject.rowsBufferOutSize = pageSize;
				gridObject.sync(datas);
				if (pageDivId != undefined) {
						
					$("#" + pageDivId).pagination(data.rowCount, {
						current_page : pageNo,
						items_per_page : pageSize,
						dhtmlObj : gridObject,
						orderName : orderName,
						order : order,
						callback : gridObject.pageselectCallback
					});
				}
			} else {
				alertMsg("读取数据失败:" + message.message);
			}
			gloadl_pagination_flag = true;
			if (lodingBox) {
				lodingBox.remove();
			}
		},
		completeCallback : function(jqXHR, textStatus) {			
			//请求完成返回之后才重绘分页信息
			gloadl_pagination_flag = true;
			if (lodingBox) {
				lodingBox.remove();
			}
			if (pageDivId != undefined) {
				$("#" + pageDivId).pagination(allData.rowCount, {
					current_page : pageNo,
					items_per_page : pageSize,
					dhtmlObj : gridObject,
					orderName : orderName,
					order : order,
					callback : gridObject.pageselectCallback
				});
			}
		}
	});
};

dhtmlXGridObject.prototype.clearData = function(pageId, rowCount, pageNo,
		pageSize) {
	var gridObject = this;
	var pageDivId = gridObject.pageDivId;

	$("#" + pageDivId).pagination(0, {
		current_page : 0,
		items_per_page : default_page_size,
		dhtmlObj : gridObject
	});
};
