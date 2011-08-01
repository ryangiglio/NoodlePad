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

var NoodlePadDrawing = {
  main_context: null,
  temp_context: null,
  drawing: false,
  path: null,

  setCanvas: function(id_main, id_temp) {
    canvas = document.getElementById(id_main);
    NoodlePadDrawing.main_context = canvas.getContext('2d');

    canvas = document.getElementById(id_temp);
    context = canvas.getContext('2d');

    canvas.addEventListener('mousedown', NoodlePadDrawing.beginLine, false);
    canvas.addEventListener('mousemove', NoodlePadDrawing.moveLine, false);
    canvas.addEventListener('mouseup', NoodlePadDrawing.endLine, false);
    canvas.addEventListener('mouseout', NoodlePadDrawing.endLine, false);

    NoodlePadDrawing.temp_context = context;
  },  
  
  getPoint: function(event) {
    return {
      x: event.clientX - NoodlePadDrawing.temp_context.canvas.offsetLeft - $('#sidebar').width() - 21,
      y: event.clientY - NoodlePadDrawing.temp_context.canvas.offsetTop
    }
  },
  strokeLine: function(context, path, style, width) {
    context.beginPath();
    context.moveTo(path[0].x, path[0].y);
    for(i=1; i<path.length; i++) {
      context.lineTo(path[i].x,path[i].y);
    }

    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = style;
    context.lineWidth = width;
    context.stroke();
    context.closePath();
  },
  drawLine: function(context, path) {
    NoodlePadDrawing.strokeLine(context, path, "rgba(0,0,0,0.25)", 10);
    NoodlePadDrawing.strokeLine(context, path, "rgba(0,0,0,0.5)", 7);
    NoodlePadDrawing.strokeLine(context, path, "rgba(128,128,128,1)", 5);
  },
  beginLine: function(event) {
    console.log('beginLine');
    NoodlePadDrawing.drawing = true;
    path = new Array(NoodlePadDrawing.getPoint(event));
  },
  moveLine: function(event) {
    if (!NoodlePadDrawing.drawing) return;

    path.push(NoodlePadDrawing.getPoint(event));
    NoodlePadDrawing.temp_context.clearRect(0,0,50000,50000);
    NoodlePadDrawing.drawLine(NoodlePadDrawing.temp_context, path);
  },
  endLine: function(event) {
    if (!NoodlePadDrawing.drawing) return;

    NoodlePadDrawing.temp_context.clearRect(0,0,50000,50000);
    NoodlePadDrawing.drawLine(NoodlePadDrawing.main_context, path);
    NoodlePadDrawing.drawing = false;

    console.log(path);
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
        $('#padText').css('z-index', '103');
	})
	$('#drawToggle').click(function(){
		if ($('#writeToggle').hasClass('activeMode')){
			$('#padText').removeAttr('contenteditable');
			$(this).addClass('activeMode');
			$('#writeToggle').removeClass('activeMode');
		}
        $('#padText').css('z-index', '99');
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
	$('.padTitle').click(function(){
		$('#padText').html('test<br>hi');
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
    $('#tempPad').replaceWith('<canvas id="tempPad" width=' + $('#tempPad').width() + ' height=' + $('#tempPad').height() + '></canvas>');
    $('#mainPad').replaceWith('<canvas id="mainPad" width=' + $('#mainPad').width() + ' height=' + $('#mainPad').height() + '></canvas>');

  NoodlePadDrawing.setCanvas('mainPad', 'tempPad');    
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
