var dictionary = null;

/**
 * 根据字典编号查询(同步调用,调用时需要在列表之前)
 * 
 * @param dictNos
 *            字典编号,多个之间用半角逗号隔开
 */
function loadDict(dictNos) {
	postData({
		url : "/common/dictionary/loadDict.json",
		data : {
			dictNos : dictNos
		},
		async : false,
		callback : function(data) {
			dictionary = data;
		}
	});
}

function getDict(dictNo, filter) {
	if (dictionary == undefined) {
		return null;
	}
	var length = dictionary.length;
	for (var i = 0; i < length; i++) {
		if (dictionary[i].dictNo == dictNo) {
			return dictionary[i].items;
		}
	}
	return null;
}

/**
 * 根据字典类别编号，条目编号取单条
 */
function getDictItem(dictNo, itemNo) {
	if (dictionary == undefined) {
		return null;
	}
	var length = dictionary.length;
	for (var i = 0; i < length; i++) {
		if (dictionary[i].dictNo == dictNo) {
			var items = dictionary[i].items;
			if (items != null && items.length != 0) {
				for (var j = 0; j < items.length; j++) {
					if (items[j].value == itemNo) {
						return dictionary[i].items[j];
					}
				}
			}
		}
	}
	return null;
}
