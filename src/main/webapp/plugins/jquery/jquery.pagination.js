/**
 * This jQuery plugin displays pagination links inside the selected elements.
 *
 * @author Gabriel Birke (birke *at* d-scribe *dot* de)
 * @version 1.1
 * @param {int} maxentries Number of entries to paginate
 * @param {Object} opts Several options (see README for documentation)
 * @return {Object} jQuery Object
 */
jQuery.fn.pagination = function(maxentries, opts) {
    opts = jQuery.extend({
    	maxentries:maxentries,//总行数
    	items_per_page:null,//每页显示的条目数可选参数，默认是100
    	perPageList:[100,150,200,250],
    	numPages:Math.ceil(maxentries / opts.items_per_page),//最大页码
        current_page: 0,   //当前页码
        dhtmlObj:null,//要分页的dhtmlGrid对象
        first:"首页",
        last:"末页",
        prev_text: "上一页",
        next_text: "下一页",
        ellipse_text: "...",//省略的页数用什么文字表示可选字符串参数，默认是"..."
        prev_show_always: true,//是否显示上一页
        next_show_always: true,//是否显示下一页
        link_to: "javascript:;",//点击页面工具条要链接的位置，用""括起来
        callback: function() { return false; }
    }, opts || {});

    return this.each(function() {
    /**
    * 计算页码的最大值
    */
    function numPages() {
        return Math.ceil(maxentries / opts.items_per_page);
    }    

    /**
    * Calculate start and end point of pagination links depending on 
    * current_page and num_display_entries.
    * @return {Array}
    */
    function getInterval() {
        var ne_half = Math.ceil(opts.num_display_entries / 2);
        var np = numPages();
        var upper_limit = np - opts.num_display_entries;
        var start = current_page > ne_half ? Math.max(Math.min(current_page - ne_half, upper_limit), 0) : 0;
        var end = current_page > ne_half ? Math.min(current_page + ne_half, np) : Math.min(opts.num_display_entries, np);
        return [start, end];
    }

    /**
    * This is the event handling function for the pagination links. 
    * @param {int} page_id The new page number
    */
    function pageSelected(page_id, evt) {
        current_page = page_id;
        opts.current_page=page_id;
        //drawLinks();
        var continuePropagation = opts.callback(opts);
        if (!continuePropagation) {
            if (evt.stopPropagation) {
                evt.stopPropagation();
            }
            else {
                evt.cancelBubble = true;
            }
        }
        return continuePropagation;
    }

    /**
    * This function inserts the pagination links into the container element
    */
    function drawLinks() {
        panel.empty();
        var interval = getInterval();
        var np = numPages();

        // This helper function returns a handler function that calls pageSelected with the right page_id
        var getClickHandler = function(page_id) {
            return function(evt) { return pageSelected(page_id, evt); }
        }
        // Helper function for generating a single link (or a span tag if it'S the current page)
        var appendItem = function(page_id, appendopts) {
            page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1); // Normalize page id to sane value
            appendopts = jQuery.extend({ text: page_id + 1, classes: "current" }, appendopts || {});
            if (page_id == current_page) {
                var lnk = $("<span class='current'>" + (appendopts.text) + "</span>");
            }
            else {
                var lnk = $("<a>" + (appendopts.text) + "</a>")
                    .bind("click", getClickHandler(page_id))
                    .attr('href', opts.link_to.replace(/__id__/, page_id));


            }
            if (appendopts.classes) { lnk.removeAttr('class'); lnk.addClass(appendopts.classes); }
            panel.append(lnk);
        }

        //当前页码
        var numPagesHtml = "<span id='numPagesId'>" + (current_page+1) + "/" + np + "</span>";
        panel.append(numPagesHtml);              


        // Generate "Previous"-Link
        if (opts.prev_text && (current_page > 0 || opts.prev_show_always)) {

            appendItem(0,{text:opts.first,classes:"disabled"});
            appendItem(current_page - 1, { text: opts.prev_text, classes: "disabled" });
        }
        // Generate starting points
        if (interval[0] > 0 && opts.num_edge_entries > 0) {
            var end = Math.min(opts.num_edge_entries, interval[0]);
            for (var i = 0; i < end; i++) {
                appendItem(i);
            }
            if (opts.num_edge_entries < interval[0] && opts.ellipse_text) {
                jQuery("<span>" + opts.ellipse_text + "</span>").appendTo(panel);
            }
        }
        // Generate interval links
        for (var i = interval[0]; i < interval[1]; i++) {
            appendItem(i);
        }
        // Generate ending points
        if (interval[1] < np && opts.num_edge_entries > 0) {
            if (np - opts.num_edge_entries > interval[1] && opts.ellipse_text) {
                jQuery("<span>" + opts.ellipse_text + "</span>").appendTo(panel);
            }
            var begin = Math.max(np - opts.num_edge_entries, interval[1]);
            for (var i = begin; i < np; i++) {
                appendItem(i);
            }

        }
        // Generate "Next"-Link
        if (opts.next_text && (current_page < np - 1 || opts.next_show_always)) {
            appendItem(current_page + 1, { text: opts.next_text, classes: "disabled" });
            appendItem(numPages,{text: opts.last,classes:"disabled"});
        }

        var pageListArr = opts.perPageList;

        var pageListHtml = "<span style='display:none'>每页显示</span>" 
            + "<select name='items_per_page_value' class='items_per_page_value' style='display:none'>";

        for(var i=0;i<pageListArr.length;i++){
            pageListHtml += "<option value='"+pageListArr[i]+"'";
            if(pageListArr[i]==opts.items_per_page){
                pageListHtml += " selected='selected' ";
            }

            pageListHtml +=">"+pageListArr[i]+"</option>";
        }

        pageListHtml += "</select>";
        //pageListHtml.children().eq(0).addAttr("selected","selected");

        //每页显示条数
        var selectPageList=$(pageListHtml).one("change",function(evt){
                opts.items_per_page = $(".items_per_page_value").val(); 
                pageSelected(0,evt);
            });
        panel.append(selectPageList);
        //下拉选择每页显示条数
       

    }

        // Extract current_page from options
        var current_page = opts.current_page;
        // Create a sane value for maxentries and items_per_page        

        maxentries = (!maxentries || maxentries < 0) ? 1 : maxentries;//总条目数必选参数，整数
        opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0) ? 1 : opts.items_per_page;
        
        
        
        // Store DOM element for easy access from all inner functions
        var panel = jQuery(this);

        

        // Attach control functions to the DOM element 
        this.selectPage = function(page_id) { pageSelected(page_id); }
        this.prevPage = function() {
            if (current_page > 0) {
                pageSelected(current_page - 1);
                return true;
            }
            else {
                return false;
            }
        }
        this.nextPage = function() {
            if (current_page < numPages() - 1) {
                pageSelected(current_page + 1);
                return true;
            }
            else {
                return false;
            }
        }
        this.getItemPerPage=function(){
            return opts.items_per_page;
        }
        // When all initialisation is done, draw the links
        drawLinks();
    });
}