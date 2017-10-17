;$(function ($){
    $.fn.placeholder = function (optons){
        var settings = $.extend({
            placeholderColorToOther:"#999", // Firefox 提示文字颜色
            placeholderColorToIe:"#999", // ie 提示文字颜色
            onInputHide:false, // 采用支持placeholder浏览器的placeholder效果，当开始输入的时候，才隐藏提示，默认为false
            calcPageOffset:true // 是否计算定位位置，默认true，设置Left和top
        },optons);
         
        return this.each(function (i,obj){
            var isCan = "placeholder" in document.createElement("input");
            if (!isCan){ // 不支持placeholder属性 则用模拟span来实现
                setSpan(obj);
            }
        });
             
        // 模拟span标签
        function setSpan(obj){
            var placeholderStr  = $(obj).attr("placeholder");
            // span 标签的样式及参数
            var textAlign = $(obj).css("text-align");
            var display = "inline-block";
            if ($(obj).val() != ""){
                display = "none";
            }
            var width = $(obj).width();
            if (obj.tagName == "TEXTAREA"){
                width = $(obj).attr("maxwidth");
            }
            var height = $(obj)[0].tagName == "TEXTAREA" ? $(obj).css("line-weight") : $(obj).innerHeight();
            if($(obj).parent().hasClass("p-b"))
            	height=$(obj).height();
            var tempSpan = $('<span class="wrap-placeholder" style="position:absolute;text-align:'+textAlign+';display:'+display+'; overflow:hidden;color:'+settings.placeholderColorToIe+'; height:'+height+'px;">'+placeholderStr+'</span>');
            tempSpan.css({
                "margin-left":$(obj).css("margin-left"),
                "margin-top":$(obj).css("margin-top"),
                "font-size":$(obj).css("font-size"),
                "font-family":$(obj).css("font-family"),
                "font-weight":$(obj).css("font-weight"),
                "padding-left":parseInt($(obj).css("padding-left")) + 2 + "px",
                "line-height":$(obj)[0].tagName == "TEXTAREA" ? $(obj).css("line-weight") : height + "px",
                "padding-top":$(obj)[0].tagName == "TEXTAREA" ? parseInt($(obj).css("padding-top")) + 2 : 0,
                "min-width":$(obj).css("min-width")
            });

        	function move() {
	            if(settings.calcPageOffset == false){
	            	return;
	            } 
	            var offset = $(obj).offset();
	            var top    = offset.top;
	            var left   = offset.left;
	            // 减去控件页面偏移量
				var currentOffset = $(obj).attr("offset");
				if (currentOffset){
					left -= currentOffset;
				}
	           //  tempSpan.css({
	            //     top: top,
	            //     left: left
	            // });
	        }

			move();
            $(obj).before(tempSpan.click(function (){
                // 判断是否执行相应的操作，如果obj是不可用的，则不执行
                if ($(obj).is(":enabled")){
                    $(obj).trigger("focus");
                }
                 
            }));
            if (settings.onInputHide){
                 
                $(obj).on("input",function (){
                    tempSpan.hide();
                }).blur(function (){
                    if ($(obj).val() == ""){
                        tempSpan.show();
                    }
                     
                });
            }else {
                 
                $(obj).focus(function (){
                    tempSpan.hide();                     
                }).blur(function (){
	                    if ($(obj).val() == ""){
   	                         tempSpan.show();
   	                     }else{
                              tempSpan.hide();
                         }        	               	                           
                }).change(function(){
	               if ($(obj).val() == ""){
	   	                    tempSpan.show();
	   	               }else{
	   		                tempSpan.hide();
	   	               }   
                });
            }

	        // 窗口缩放时处理
	        $(window).resize(function() {
	            move();
	        });	
        }
    }
     
}(jQuery));
