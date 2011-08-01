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
	$('#new_pad').submit(function(e){
		e.preventDefault();
		var title = $('#pad_title').val();
		var pad = [{title: title}];	
		$.tmpl(padTitleTemplate, pad).prependTo("#fileList");
		$('#pad_title').val('');
		$('#new_pad_form').hide();
	})
})






















