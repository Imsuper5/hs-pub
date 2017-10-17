var mappings = {};

/**
 * 根据表格编号查询映射关系
 * @param gridIds 表格编号,多个之间用半角逗号隔开
 */
function loadFieldMapping(){
	postData({
		url: "/common/gridfieldmapping/getGridFieldMappingList.json",
		async: false,
		callback: function(data){
			mappings = data;
		}
	});
}

/**
 * 获取字段映射名
 * @param gridId 表格id
 * @param fieldName 列字段名(多个字段以逗号隔开)
 * @returns
 */
function getMappingNames(gridId, fieldName){
	if (mappings == undefined){
		loadFieldMapping();
	}
	var length = mappings.length;
	var mappingNames = "";
	var fields = fieldName.split(",");
	for(var j=0; j< fields.length; j++){
		for(var i=0 ; i<length ; i++){
			if(mappings[i].gridId == gridId && mappings[i].fieldName == fields[j]){
				mappingNames += mappings[i].mappingName + ",";
			}
		}
	}

	if (mappingNames) {
		mappingNames = mappingNames.substring(0, mappingNames.length - 1)
	}
	return mappingNames;
}