/* Author: 

*/
function pasteHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

$(function() {
	$('#pad_title').addDefaultText('Create New');
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
	$('#new_pad').submit(function(e){
		e.preventDefault();
		var title = $('#pad_title').val();
		var pad = [{title: title}];	
		$.tmpl(padTitleTemplate, pad).appendTo("#fileList");
		$('#pad_title').val('').blur();
	})
	$('#username').keydown(function(e){
		if (e.keyCode == 13){
			$('#username').blur();
			e.preventDefault();
		}
	})
    $('#padText').keydown(function(e) {
        if ( e.keyCode == 9) {
            pasteHtmlAtCaret('&nbsp;&nbsp;&nbsp;&nbsp;');
            e.preventDefault();
        };
    });
})

$.fn.addDefaultText = function(text){
	$(this).val(text);
	$(this).addClass('default_text');
	$(this).data('default', $(this).val());
	$(this).click(function(){
			$(this).removeClass('default_text');
			if ($(this).val() == $(this).data('default')){
				$(this).val('');
			}
		})
	$(this).blur(function(){
		var default_val = $(this).data('default');
		var trimmed = $.trim($(this).val());
		if (trimmed == ''){
			$(this).addClass('default_text');
			$(this).val($(this).data('default'));
		}
	})
}
