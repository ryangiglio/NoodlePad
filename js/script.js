/* Author: 

*/
$(function() {
	var pads = [{title : "HTML5 Hackathon"},
							{title : "Another Group"}
							];
	$.tmpl(padTitleTemplate, pads).appendTo("#sidebar");
	$('#create_pad').click(function(){
		$('#new_pad_form').show();
	})
	$('.pad_title').live('click', function(){
		// load text and image
	})
})






















