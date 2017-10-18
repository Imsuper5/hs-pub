//v.3.6 build 130417

/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
To use this component please contact sales@dhtmlx.com to obtain license
*/
dhtmlXGridObject.prototype.enablePaging = function(a, b, c, d, e, g) {
	this._pgn_parentObj = typeof d == "string" ? document.getElementById(d) : d;
	this._pgn_recInfoParentObj = typeof g == "string" ? document.getElementById(g) : g;
	this.pagingOn = a;
	this.showRecInfo = e;
	this.rowsBufferOutSize = parseInt(b);
	this.currentPage = 1;
	this.pagesInGroup = parseInt(c);
	this._init_pgn_events();
	this.setPagingSkin("default")
};
dhtmlXGridObject.prototype.setXMLAutoLoading = function(a, b) {
	this.xmlFileUrl = a;
	this._dpref = b
};
dhtmlXGridObject.prototype.changePageRelative = function(a) {
	this.changePage(this.currentPage + a)
};
dhtmlXGridObject.prototype.changePage = function(a) {
	arguments.length == 0 && (a = this.currentPage || 0);
	a = parseInt(a);
	a = Math.max(1, Math.min(a, Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize)));
	if (this.callEvent("onBeforePageChanged", [this.currentPage, a])) this.currentPage = parseInt(a), this._reset_view(), this._fixAlterCss(), this.callEvent("onPageChanged", this.getStateOfView())
};
dhtmlXGridObject.prototype.setPagingSkin = function(a, b) {
	this._pgn_skin = this["_pgn_" + a];
	if (a == "toolbar") this._pgn_skin_tlb = b
};
dhtmlXGridObject.prototype.setPagingTemplates = function(a, b) {
	this._pgn_templateA = this._pgn_template_compile(a);
	this._pgn_templateB = this._pgn_template_compile(b);
	this._page_skin_update()
};
dhtmlXGridObject.prototype._page_skin_update = function() {
	if (!this.pagesInGroup) this.pagesInGroup = Math.ceil(Math.min(5, this.rowsBuffer.length / this.rowsBufferOutSize));
	var a = Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize);
	if (a && a < this.currentPage) return this.changePage(a);
	this.pagingOn && this._pgn_skin && this._pgn_skin.apply(this, this.getStateOfView())
};
dhtmlXGridObject.prototype._init_pgn_events = function() {
	this.attachEvent("onXLE", this._page_skin_update);
	this.attachEvent("onClearAll", this._page_skin_update);
	this.attachEvent("onPageChanged", this._page_skin_update);
	this.attachEvent("onGridReconstructed", this._page_skin_update);
	this._init_pgn_events = function() {}
};
dhtmlXGridObject.prototype._pgn_default = function() {
	if (!this.pagingBlock) {
		this.pagingBlock = document.createElement("DIV");
		this.pagingBlock.className = "pagingBlock";
		this.recordInfoBlock = document.createElement("SPAN");
		this.recordInfoBlock.className = "recordsInfoBlock";
		if (!this._pgn_parentObj) return;
		this._pgn_parentObj.appendChild(this.pagingBlock);
		this._pgn_recInfoParentObj && this.showRecInfo && this._pgn_recInfoParentObj.appendChild(this.recordInfoBlock);
		if (!this._pgn_templateA) this._pgn_templateA = this._pgn_template_compile("[prevpages:&lt;:&nbsp;] [currentpages:,&nbsp;] [nextpages:&gt;:&nbsp;]"), this._pgn_templateB = this._pgn_template_compile("Results <b>[from]-[to]</b> of <b>[total]</b>")
	}
	var a = this.getStateOfView();
	this.pagingBlock.innerHTML = this._pgn_templateA.apply(this, a);
	this.recordInfoBlock.innerHTML = this._pgn_templateB.apply(this, a);
	this._pgn_template_active(this.pagingBlock);
	this._pgn_template_active(this.recordInfoBlock);
	this.callEvent("onPaging", [])
};
dhtmlXGridObject.prototype._pgn_block = function(a) {
	for (var b = Math.floor((this.currentPage - 1) / this.pagesInGroup) * this.pagesInGroup, c = Math.min(Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize), b + this.pagesInGroup), d = [], e = b + 1; e <= c; e++) e == this.currentPage ? d.push("<a class='dhx_not_active'><b>" + e + "</b></a>") : d.push("<a onclick='this.grid.changePage(" + e + "); return false;'>" + e + "</a>");
	return d.join(a)
};
dhtmlXGridObject.prototype._pgn_link = function(a, b, c) {
	if (a == "prevpages" || a == "prev") return this.currentPage == 1 ? c : "<a onclick='this.grid.changePageRelative(-1*" + (a == "prev" ? "1" : "this.grid.pagesInGroup") + "); return false;'>" + b + "</a>";
	if (a == "nextpages" || a == "next") return this.rowsBuffer.length / this.rowsBufferOutSize <= this.currentPage ? c : this.rowsBuffer.length / (this.rowsBufferOutSize * (a == "next" ? 1 : this.pagesInGroup)) <= 1 ? c : "<a onclick='this.grid.changePageRelative(" + (a == "next" ? "1" : "this.grid.pagesInGroup") + "); return false;'>" + b + "</a>";
	if (a == "current") {
		var d = this.currentPage + (b ? parseInt(b) : 0);
		return d < 1 || Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize) < d ? c : "<a " + (d == this.currentPage ? "class='dhx_active_page_link' " : "") + "onclick='this.grid.changePage(" + d + "); return false;'>" + d + "</a>"
	}
	return b
};
dhtmlXGridObject.prototype._pgn_template_active = function(a) {
	var b = a.getElementsByTagName("A");
	if (b) for (var c = 0; c < b.length; c++) b[c].grid = this
};
dhtmlXGridObject.prototype._pgn_template_compile = function(a) {
	a = a.replace(/\[([^\]]*)\]/g, function(a, c) {
		c = c.split(":");
		switch (c[0]) {
		case "from":
			return '"+(arguments[1]*1+(arguments[2]*1?1:0))+"';
		case "total":
			return '"+arguments[3]+"';
		case "to":
			return '"+arguments[2]+"';
		case "current":
		case "prev":
		case "next":
		case "prevpages":
		case "nextpages":
			return "\"+this._pgn_link('" + c[0] + "','" + c[1] + "','" + c[2] + "')+\"";
		case "currentpages":
			return "\"+this._pgn_block('" + c[1] + "')+\""
		}
	});
	return new Function('return "' + a + '";')
};
dhtmlXGridObject.prototype.i18n.paging = {
	results: "Results",
	records: "Records from ",
	to: " to ",
	page: "Page ",
	perpage: "rows per page",
	first: "To first Page",
	previous: "Previous Page",
	found: "Found records",
	next: "Next Page",
	last: "To last Page",
	of: " of ",
	notfound: "No Records Found"
};
dhtmlXGridObject.prototype.setPagingWTMode = function(a, b, c, d) {
	this._WTDef = [a, b, c, d]
};
dhtmlXGridObject.prototype._pgn_bricks = function(a, b, c) {
	var d = (this.skin_name || "").split("_")[1],
		e = "";
	if (d == "light" || d == "modern" || d == "skyblue") e = "_" + d;
	this.pagerElAr = [];
	this.pagerElAr.pagerCont = document.createElement("DIV");
	this.pagerElAr.pagerBord = document.createElement("DIV");
	this.pagerElAr.pagerLine = document.createElement("DIV");
	this.pagerElAr.pagerBox = document.createElement("DIV");
	this.pagerElAr.pagerInfo = document.createElement("DIV");
	this.pagerElAr.pagerInfoBox = document.createElement("DIV");
	var g = this.globalBox || this.objBox;
	this.pagerElAr.pagerCont.style.width = g.clientWidth + "px";
	this.pagerElAr.pagerCont.style.overflow = "hidden";
	this.pagerElAr.pagerCont.style.clear = "both";
	this.pagerElAr.pagerBord.className = "dhx_pbox" + e;
	this.pagerElAr.pagerLine.className = "dhx_pline" + e;
	this.pagerElAr.pagerBox.style.clear = "both";
	this.pagerElAr.pagerInfo.className = "dhx_pager_info" + e;
	this.pagerElAr.pagerCont.appendChild(this.pagerElAr.pagerBord);
	this.pagerElAr.pagerCont.appendChild(this.pagerElAr.pagerLine);
	this.pagerElAr.pagerCont.appendChild(this.pagerElAr.pagerInfo);
	this.pagerElAr.pagerLine.appendChild(this.pagerElAr.pagerBox);
	this.pagerElAr.pagerInfo.appendChild(this.pagerElAr.pagerInfoBox);
	this._pgn_parentObj.innerHTML = "";
	this._pgn_parentObj.appendChild(this.pagerElAr.pagerCont);
	if (this.rowsBuffer.length > 0) {
		var j = 20,
			k = 22;
		if (a > this.pagesInGroup) {
			var f = document.createElement("DIV"),
				h = document.createElement("DIV");
			f.className = "dhx_page" + e;
			h.innerHTML = "&larr;";
			f.appendChild(h);
			this.pagerElAr.pagerBox.appendChild(f);
			var i = this;
			f.pgnum = (Math.ceil(a / this.pagesInGroup) - 1) * this.pagesInGroup;
			f.onclick = function() {
				i.changePage(this.pgnum)
			};
			j += k
		}
		for (var l = 1; l <= this.pagesInGroup; l++) {
			f = document.createElement("DIV");
			h = document.createElement("DIV");
			f.className = "dhx_page" + e;
			pageNumber = (Math.ceil(a / this.pagesInGroup) - 1) * this.pagesInGroup + l;
			if (pageNumber > Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize)) break;
			h.innerHTML = pageNumber;
			f.appendChild(h);
			a == pageNumber ? (f.className += " dhx_page_active" + e, h.className = "dhx_page_active" + e) : (i = this, f.pgnum = pageNumber, f.onclick = function() {
				i.changePage(this.pgnum)
			});
			j += parseInt(k / 3) * pageNumber.toString().length + 15;
			h.style.width = parseInt(k / 3) * pageNumber.toString().length + 8 + "px";
			this.pagerElAr.pagerBox.appendChild(f)
		}
		if (Math.ceil(a / this.pagesInGroup) * this.pagesInGroup < Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize)) f = document.createElement("DIV"), h = document.createElement("DIV"), f.className = "dhx_page" + e, h.innerHTML = "&rarr;", f.appendChild(h), this.pagerElAr.pagerBox.appendChild(f), i = this, f.pgnum = Math.ceil(a / this.pagesInGroup) * this.pagesInGroup + 1, f.onclick = function() {
			i.changePage(this.pgnum)
		}, j += k;
		this.pagerElAr.pagerLine.style.width = j + "px"
	}
	if (this.rowsBuffer.length > 0 && this.showRecInfo) this.pagerElAr.pagerInfoBox.innerHTML = this.i18n.paging.records + (b + 1) + this.i18n.paging.to + c + this.i18n.paging.of + this.rowsBuffer.length;
	else if (this.rowsBuffer.length == 0) this.pagerElAr.pagerLine.parentNode.removeChild(this.pagerElAr.pagerLine), this.pagerElAr.pagerInfoBox.innerHTML = this.i18n.paging.notfound;
	this.pagerElAr.pagerBox.appendChild(document.createElement("SPAN")).innerHTML = "&nbsp;";
	this.pagerElAr.pagerBord.appendChild(document.createElement("SPAN")).innerHTML = "&nbsp;";
	this.pagerElAr.pagerCont.appendChild(document.createElement("SPAN")).innerHTML = "&nbsp;";
	this.callEvent("onPaging", [])
};
dhtmlXGridObject.prototype._pgn_toolbar = function(a, b, c) {
	if (!this.aToolBar) this.aToolBar = this._pgn_createToolBar();
	var d = Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize);
	this._WTDef[0] && (this.aToolBar.enableItem("right"), this.aToolBar.enableItem("rightabs"), this.aToolBar.enableItem("left"), this.aToolBar.enableItem("leftabs"), this.currentPage >= d && (this.aToolBar.disableItem("right"), this.aToolBar.disableItem("rightabs")), this.currentPage == 1 && (this.aToolBar.disableItem("left"), this.aToolBar.disableItem("leftabs")));
	if (this._WTDef[2]) {
		var e = this;
		this.aToolBar.forEachListOption("pages", function(a) {
			e.aToolBar.removeListOption("pages", a)
		});
		for (var g = 0; g < d; g++) this.aToolBar.addListOption("pages", "pages_" + (g + 1), NaN, "button", this.i18n.paging.page + (g + 1));
		this.aToolBar.setItemText("pages", "<div style='width:100%; text-align:right'>" + this.i18n.paging.page + a + "</div>")
	}
	this._WTDef[1] && (this.getRowsNum() ? this.aToolBar.setItemText("results", "<div style='width:100%; text-align:center'>" + this.i18n.paging.records + (b + 1) + this.i18n.paging.to + c + "</div>") : this.aToolBar.setItemText("results", this.i18n.paging.notfound));
	this._WTDef[3] && this.aToolBar.setItemText("perpagenum", "<div style='width:100%; text-align:right'>" + this.rowsBufferOutSize.toString() + " " + this.i18n.paging.perpage + "</div>");
	this.callEvent("onPaging", [])
};
dhtmlXGridObject.prototype._pgn_createToolBar = function() {
	this.aToolBar = new dhtmlXToolbarObject(this._pgn_parentObj, this._pgn_skin_tlb || "dhx_blue");
	this._WTDef || this.setPagingWTMode(!0, !0, !0, !0);
	var a = this;
	this.aToolBar.attachEvent("onClick", function(b) {
		b = b.split("_");
		switch (b[0]) {
		case "leftabs":
			a.changePage(1);
			break;
		case "left":
			a.changePage(a.currentPage - 1);
			break;
		case "rightabs":
			a.changePage(99999);
			break;
		case "right":
			a.changePage(a.currentPage + 1);
			break;
		case "perpagenum":
			if (b[1] === this.undefined) break;
			a.rowsBufferOutSize = parseInt(b[1]);
			a.changePage();
			a.aToolBar.setItemText("perpagenum", "<div style='width:100%; text-align:right'>" + b[1] + " " + a.i18n.paging.perpage + "</div>");
			break;
		case "pages":
			if (b[1] === this.undefined) break;
			a.changePage(b[1]);
			a.aToolBar.setItemText("pages", "<div style='width:100%; text-align:right'>" + a.i18n.paging.page + b[1] + "</div>")
		}
	});
	this._WTDef[0] && (this.aToolBar.addButton("leftabs", NaN, "", this.imgURL + "ar_left_abs.gif", this.imgURL + "ar_left_abs_dis.gif"), this.aToolBar.setWidth("leftabs", "20"), this.aToolBar.addButton("left", NaN, "", this.imgURL + "ar_left.gif", this.imgURL + "ar_left_dis.gif"), this.aToolBar.setWidth("left", "20"));
	this._WTDef[1] && (this.aToolBar.addText("results", NaN, this.i18n.paging.results), this.aToolBar.setWidth("results", "150"), this.aToolBar.disableItem("results"));
	this._WTDef[0] && (this.aToolBar.addButton("right", NaN, "", this.imgURL + "ar_right.gif", this.imgURL + "ar_right_dis.gif"), this.aToolBar.setWidth("right", "20"), this.aToolBar.addButton("rightabs", NaN, "", this.imgURL + "ar_right_abs.gif", this.imgURL + "ar_right_abs_dis.gif"), this.aToolBar.setWidth("rightabs", "20"));
	this._WTDef[2] && (this.aToolBar.addButtonSelect("pages", NaN, "select page", [], null, null, !0, !0), this.aToolBar.setWidth("pages", "75"));
	var b;
	if (b = this._WTDef[3]) {
		this.aToolBar.addButtonSelect("perpagenum", NaN, "select size", [], null, null, !0, !0);
		typeof b != "object" && (b = [5, 10, 15, 20, 25, 30]);
		for (var c = 0; c < b.length; c++) this.aToolBar.addListOption("perpagenum", "perpagenum_" + b[c], NaN, "button", b[c] + " " + this.i18n.paging.perpage);
		this.aToolBar.setWidth("perpagenum", "135")
	}
	return this.aToolBar
};


//v.3.6 build 130417

/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
To use this component please contact sales@dhtmlx.com to obtain license
*/