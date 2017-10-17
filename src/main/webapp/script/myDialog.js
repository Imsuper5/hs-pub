function dialogOpen(id) {
	var o = $("#" + id).closest("div.modal[role='dialog']");
	o.css("display", "block");
	if ($(".modal-backdrop").length == 0) {
		var backdropdiv = '<div class="modal-backdrop  in"></div>';
		$(document.body).append(backdropdiv);
	}

}
function dialogClose(e) {
	var o = $(e).closest("div.modal[role='dialog']");
	o.css("display", "none");
	var divs = $("div.modal[role='dialog']:visible");
	if (divs.length == 0)
		$(".modal-backdrop").remove();
}
$("button[data-dismiss='modal']").bind("click", function() {
	dialogClose(this);
});
function dialogAllClose() {
	var divs = $("div.modal[role='dialog']");
	for (var i = 0; i < divs.length; i++) {
		if (divs[i].attributes["style"] != undefined)
			divs[i].attributes["style"].value = "display:none;";
	}
	$(".modal-backdrop").remove();
}
