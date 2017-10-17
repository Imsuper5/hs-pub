/**
 * 百分比列 说明： 值显示时会乘以100，取值时会除以100 保留两位小数
 */
function eXcell_persent(cell) {
	this.base = eXcell_edn;
	this.base(cell)
	/**
	 * 设置值 百分比设置值时乘以100，并加上%符号
	 */
	this.setValue = function(val) {
		if (!val || val.toString()._dhx_trim() == "")
			val = 0;

		val = val * 100;// 百分比 乘100转换

		var newValue = "- -";
		if (val != 0) {
			newValue = this.grid._aplNF(val.toFixed(2), this.cell._cellIndex)
					+ "%";
		}

		this.cell.innerHTML = newValue;
	}
	/**
	 * 获取值 百分比数据列获取值时要去掉%字符，并除以100
	 */
	this.getValue = function() {
		var val = this.cell.innerHTML;
		if (!val || val == "- -") {
			val = 0;
			return val;
		}
		val = val.replace("%", "");
		var dValue = parseFloat(val);
		dValue = dValue / 100;
		return dValue;
	}
}
eXcell_persent.prototype = new eXcell_edn;

/**
 * 日期格式列 说明： 时间的格式为时分秒，如9:12:11秒，则值为91211 如果时间只有5位则需要实例为6位，如9:12:11，则补0处理
 */
function eXcell_hsdate(f) {
	this.base = eXcell_ed;
	this.base(f);

	this.setValue = function(val) {
		var b = / /i;
		var dataValue = "";
		if (!val || val.toString()._dhx_trim() == "") {
			dataValue = "";
		} else {
			dataValue = val.toString();
			if (dataValue == "" || dataValue == "0")
				dataValue = "";
			else {
				var year = dataValue.charAt(0) + dataValue.charAt(1)
						+ dataValue.charAt(2) + dataValue.charAt(3);
				var month = dataValue.charAt(4) + dataValue.charAt(5);
				var day = dataValue.charAt(6) + dataValue.charAt(7);
				dataValue = year + "/" + month + "/" + day;
			}
		}

		this.cell.innerHTML = dataValue;
	}

	/**
	 * 获取值 日期获取值
	 */
	this.getValue = function() {
		var dataValue = this.cell.innerHTML;
		if (!dataValue || dataValue == "") {
			dataValue = 0;
			return dataValue;
		}
		dataValue = dataValue.replace(/\//g, '');
		var tdataValue = parseInt(dataValue);
		return tdataValue;
	}
}
eXcell_hsdate.prototype = new eXcell_ed;

/**
 * 时间显示单元 说明： 时间的格式为时分秒，如9:12:11秒，则值为91211 如果时间只有5位则需要实例为6位，如9:12:11，则补0处理
 */
function eXcell_hstime(f) {
	this.base = eXcell_ed;
	this.base(f);
	this.getValue = function() {
		var value = this.cell.innerHTML.toString();
		value = value.replace(value, ":");
		return value;
	};

	this.setValue = function(val) {
		var b = / /i;
		var timeValue = "";
		if (!val || val.toString()._dhx_trim() == "") {
			timeValue = "";
		} else {
			timeValue = val.toString();

			// 如果时间只有5位则需要实例为6位，如9:12:11，则补0处理
			// if (timeValue.length == 5){
			// timeValue = "0"+timeValue;
			// }
			var length = timeValue.length;
			for (var i = 6; i > length; i--) {
				timeValue = "0" + timeValue;
			}

			if (timeValue == "")
				timeValue = "00:00:00";
			else {
				var tmp = "";
				for (i = 0; i < timeValue.length; i++) {
					if ((i > 0) && (i % 2 == 0)) {
						tmp += ":";
					}

					tmp += timeValue.charAt(i);
				}

				timeValue = tmp;
			}
		}

		this.cell.innerHTML = timeValue;
	}
}
eXcell_hstime.prototype = new eXcell_ed;

/**
 * 完整日期时间显示单元 说明： 时间的格式为时分秒，如2016/08/08 9:12:11秒，则值为20160808091211
 * 如果时间只有5位则需要实例为6位，如9:12:11，则补0处理
 */
function eXcell_hsdatetime(f) {
	this.base = eXcell_ed;
	this.base(f);

	this.setValue = function(val) {
		var b = / /i;
		var timeValue = "";
		if (!val || val.toString()._dhx_trim() == "") {
			timeValue = "";
		} else {
			timeValue = val.toString();
			if (timeValue == ""||timeValue == "0")
				timeValue = "";
			else {
				var year = timeValue.charAt(0) + timeValue.charAt(1)
						+ timeValue.charAt(2) + timeValue.charAt(3);
				var month = timeValue.charAt(4) + timeValue.charAt(5);
				var day = timeValue.charAt(6) + timeValue.charAt(7);
				var dataValue = year + "/" + month + "/" + day;

				var tmp = "";
				for (i = 8; i < timeValue.length; i++) {
					if ((i > 8) && (i % 2 == 0)) {
						tmp += ":";
					}

					tmp += timeValue.charAt(i);
				}

				timeValue = dataValue + " " + tmp;
			}
		}
		//this.cell.innerHTML = new Date(parseInt(val)).toLocaleString().replace(/:\d{1,2}$/,' ');       
		this.cell.innerHTML = timeValue;
	}
}
eXcell_hsdatetime.prototype = new eXcell_ed;

/**
 * 毫秒级时间戳格式化显示 1471239638543
 */
function eXcell_hsmillionstime(f) {
	this.base = eXcell_ed;
	this.base(f);

	this.setValue = function(val) {
		if(val.toString().length == 10){
			val = val*1000;
		}
		this.cell.innerHTML = new Date(parseInt(val)).toLocaleString().substr(0,20);//new Date(parseInt(val)).toLocaleString().replace(/:\d{1,2}$/,' ');       
	}
}
eXcell_hsmillionstime.prototype = new eXcell_ed;

/**
 * 单位万换算 说明： 值显示时会乘以10000，取值时会除以10000 保留两位小数
 */
function eXcell_unitconverter(cell) {
	this.base = eXcell_edn;
	this.base(cell)

	this.setValue = function(val) {
		if (!val || val.toString()._dhx_trim() == "")
			val = 0;

		val = val / 10000;// 换算成万单位
		var newValue = "0";
		if (val != 0) {
			newValue = (val.toFixed(2) + '').replace(
					/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
		}

		this.cell.innerHTML = newValue;
	}

	this.getValue = function() {
		var val = this.cell.innerHTML;
		if (!val || val == "") {
			val = 0;
			return val;
		}
		val = val.replace(",", "");
		var dValue = parseFloat(val);
		dValue = dValue * 10000;
		return dValue;
	}
}
eXcell_unitconverter.prototype = new eXcell_edn;

/**
 * 单位亿算 说明： 值显示时会乘以100000000，取值时会除以100000000 保留两位小数
 */
function eXcell_millionconverter(cell) {
	this.base = eXcell_edn;
	this.base(cell)

	this.setValue = function(val) {
		if (!val || val.toString()._dhx_trim() == "")
			val = 0;

		val = val / 100000000;// 换算成万单位
		var newValue = "0";
		if (val != 0) {
			newValue = (val.toFixed(2) + '').replace(
					/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
		}

		this.cell.innerHTML = newValue;
	}

	this.getValue = function() {
		var val = this.cell.innerHTML;
		if (!val || val == "") {
			val = 0;
			return val;
		}
		val = val.replace(",", "");
		var dValue = parseFloat(val);
		dValue = dValue * 100000000;
		return dValue;
	}
}
eXcell_millionconverter.prototype = new eXcell_edn;

/**
 * 序号计数列，兼容分页时同步页码
 */
function eXcell_hscntr(b) {
	this.cell = b;
	this.grid = this.cell.parentNode.grid;
	if (!this.grid._ex_cntr_ready && !this._realfake)
		this.grid._ex_cntr_ready = !0, this.grid._h2
				&& this.grid.attachEvent("onOpenEn", function() {
					this.resetCounter(b._cellIndex)
				}), this.grid.attachEvent("onBeforeSorting", function() {
			var a = this;
			window.setTimeout(function() {
				a.resetCounter
						&& (a._fake && !a._realfake
								&& b._cellIndex < a._fake._cCount ? a._fake
								.resetCounter(b._cellIndex) : a
								.resetCounter(b._cellIndex))
			}, 1);
			return !0
		});
	this.edit = function() {
	};
	this.getValue = function() {
		return this.cell.innerHTML
	};
	this.setValue = function() {
		this.cell.style.paddingRight = "2px";
		var a = this.cell;
		window.setTimeout(function() {
			if (a.parentNode) {
				var b = a.parentNode.rowIndex;
				if (a.parentNode.grid.currentPage || b < 0
						|| a.parentNode.grid._srnd) {
					// 分页时行号需要按页码计算
					var idx = a.parentNode.grid.rowsBuffer
							._dhx_find(a.parentNode);
					b = a.parentNode.grid.currentPage
							* a.parentNode.grid.rowsBufferOutSize
							+ a.parentNode.rowIndex;
				}
				if (!(b <= 0))
					a.innerHTML = b, a.parentNode.grid._fake
							&& a._cellIndex < a.parentNode.grid._fake._cCount
							&& a.parentNode.grid._fake.rowsAr[a.parentNode.idd]
							&& a.parentNode.grid._fake.cells(a.parentNode.idd,
									a._cellIndex).setCValue(b), a = null
			}
		}, 100)
	}
}
dhtmlXGridObject.prototype.resetCounter = function(b) {
	this._fake && !this._realfake && b < this._fake._cCount
			&& this._fake.resetCounter(b, this.currentPage);
	var a = b || 0;
	this.currentPage && (a = (this.currentPage - 1) * this.rowsBufferOutSize);
	for (a = 0; a < this.rowsBuffer.length; a++)
		if (this.rowsBuffer[a] && this.rowsBuffer[a].tagName == "TR"
				&& this.rowsAr[this.rowsBuffer[a].idd])
			this.rowsAr[this.rowsBuffer[a].idd].childNodes[b].innerHTML = a + 1
};
eXcell_hscntr.prototype = new eXcell;
