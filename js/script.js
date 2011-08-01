/* Author: 

*/
$(function() {
	$('#writeToggle').click(function(){
		if ($('#drawToggle').hasClass('activeMode')){
			$('#padText').attr('contenteditable', true);
			$(this).addClass('activeMode');
			$('#drawToggle').removeClass('activeMode');
		}
	})
	$('#drawToggle').click(function(){
		if ($('#writeToggle').hasClass('activeMode')){
			$('#padText').removeAttr('contenteditable');
			$(this).addClass('activeMode');
			$('#writeToggle').removeClass('activeMode');
		}
	})
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
	$('#username').keydown(function(e){
		if (e.keyCode == 13){
			$('#username').blur();
			e.preventDefault();
		}
	})
})






















