/* Author: 

*/
$(function() {
	var pads = [{title : "HTML5 Hackathon"},
							{title : "Another Group"},
							{title : "Okay"}
							];
	$.tmpl(padTitleTemplate, pads).appendTo("#fileList");
	$('#create_pad').click(function(){
		$('#new_pad_form').show();
	})
})






















