$('.i-checks').iCheck({
	checkboxClass : 'icheckbox_square-green',
	radioClass : 'iradio_square-green',
});
if (navigator.userAgent.indexOf("MSIE 9.0") > 0) {
	$("textarea").change(function() {
		done(this);
	}).keyup(function() {
		done(this);
	}).keydown(function() {
		done(this);
	});
	function done(obj) {
		var len = $(obj).attr("maxlength");
		if (obj.value.length > len) {
			obj.value = obj.value.substr(0, len);
		}
	}
}


