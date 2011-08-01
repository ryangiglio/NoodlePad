var ws = $.websocket("ws://192.168.159.173:8080/NoodlePadApp/pad", {
	open : function() {
				output("onopen");
			},
	events : {
		message : function(e) {
			output("echo from server : " + e.data);
		},
		close : function(e) {

		}
	}
});
		
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
  
  loadCanvas: function(paths) {
    NoodlePadDrawing.main_context.clearRect(0,0,50000,50000);
    for (i=0; i<paths.length; i++) {
      NoodlePadDrawing.drawLine(NoodlePadDrawing.main_context, paths[i]);
    }
  },
  
  sendPath: function(path) {
    console.log(JSON.stringify(path));
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

    NoodlePadDrawing.sendPath(path);
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
	var pads = [{title : "HTML5 Hackathon", id : 1},
							{title : "Another Group", id : 2},
							{title : "Okay", id : 3}
							];
	// var pads = ws.send('pad_list');
	$.tmpl(padTitleTemplate, pads).appendTo("#fileList");
	$('#new_pad').submit(function(e){
		e.preventDefault();
		var title = $('#pad_title').val();
		var pad = [{title: title}];	
		$.tmpl(padTitleTemplate, pad).appendTo("#fileList");
		$('#pad_title').val('').blur();

        // Create a new pad
        NoodlePadDrawing.loadCanvas([]);
	})
	$('.padTitle').click(function(){
		$('#padText').html('test<br>hi');
        NoodlePadDrawing.loadCanvas(
            [[{"x":762,"y":255},{"x":761,"y":255},{"x":759,"y":255},{"x":748,"y":250},{"x":731,"y":245},{"x":706,"y":238},{"x":669,"y":237},{"x":647,"y":237},{"x":607,"y":239},{"x":583,"y":247},{"x":559,"y":262},{"x":548,"y":275},{"x":543,"y":294},{"x":543,"y":312},{"x":561,"y":333},{"x":597,"y":360},{"x":646,"y":389},{"x":690,"y":416},{"x":724,"y":445},{"x":738,"y":460},{"x":743,"y":468},{"x":752,"y":485},{"x":752,"y":495},{"x":742,"y":502},{"x":723,"y":509},{"x":696,"y":514},{"x":664,"y":516},{"x":625,"y":517},{"x":592,"y":509},{"x":577,"y":498},{"x":568,"y":488},{"x":562,"y":462},{"x":564,"y":444},{"x":585,"y":410},{"x":618,"y":386},{"x":664,"y":367},{"x":717,"y":351},{"x":750,"y":341},{"x":772,"y":331},{"x":789,"y":322},{"x":795,"y":314},{"x":798,"y":302},{"x":796,"y":286},{"x":784,"y":269},{"x":770,"y":254},{"x":750,"y":240},{"x":738,"y":234},{"x":731,"y":232},{"x":723,"y":229},{"x":720,"y":229},{"x":719,"y":229},{"x":719,"y":230},{"x":723,"y":242},{"x":745,"y":260},{"x":782,"y":293},{"x":825,"y":321},{"x":853,"y":335},{"x":885,"y":344},{"x":902,"y":346},{"x":920,"y":347},{"x":935,"y":344},{"x":943,"y":335},{"x":946,"y":322},{"x":948,"y":303},{"x":948,"y":284},{"x":946,"y":260},{"x":931,"y":227},{"x":911,"y":204},{"x":892,"y":191},{"x":864,"y":178},{"x":846,"y":174},{"x":831,"y":172},{"x":825,"y":172},{"x":823,"y":172},{"x":824,"y":177},{"x":840,"y":189},{"x":870,"y":210},{"x":911,"y":239},{"x":939,"y":258},{"x":973,"y":277},{"x":1000,"y":290},{"x":1020,"y":304},{"x":1033,"y":320},{"x":1040,"y":331},{"x":1044,"y":338},{"x":1046,"y":343},{"x":1047,"y":345},{"x":1047,"y":342},{"x":1047,"y":326},{"x":1051,"y":303},{"x":1061,"y":261},{"x":1066,"y":243},{"x":1073,"y":202},{"x":1074,"y":161},{"x":1073,"y":144},{"x":1065,"y":132},{"x":1052,"y":124},{"x":1042,"y":124},{"x":1030,"y":127},{"x":1019,"y":140},{"x":1014,"y":152},{"x":1011,"y":174},{"x":1011,"y":207},{"x":1014,"y":237},{"x":1017,"y":294},{"x":1017,"y":327},{"x":1001,"y":392},{"x":979,"y":442},{"x":956,"y":483},{"x":935,"y":519},{"x":922,"y":539},{"x":904,"y":561},{"x":882,"y":580},{"x":857,"y":595},{"x":825,"y":604},{"x":790,"y":605},{"x":759,"y":605},{"x":727,"y":595},{"x":708,"y":580},{"x":695,"y":559},{"x":691,"y":535},{"x":691,"y":512},{"x":707,"y":479},{"x":754,"y":464},{"x":817,"y":469},{"x":868,"y":487},{"x":908,"y":500},{"x":937,"y":507},{"x":968,"y":513},{"x":979,"y":513},{"x":989,"y":513},{"x":993,"y":501},{"x":992,"y":476},{"x":973,"y":445},{"x":933,"y":398},{"x":897,"y":370},{"x":819,"y":321},{"x":739,"y":278},{"x":652,"y":234},{"x":594,"y":210},{"x":545,"y":195},{"x":496,"y":183},{"x":477,"y":182},{"x":468,"y":181},{"x":463,"y":180},{"x":463,"y":172},{"x":469,"y":158},{"x":492,"y":131},{"x":521,"y":112},{"x":545,"y":106},{"x":570,"y":106},{"x":586,"y":115},{"x":585,"y":134},{"x":546,"y":180},{"x":494,"y":222},{"x":430,"y":264},{"x":366,"y":304},{"x":325,"y":328},{"x":295,"y":345},{"x":285,"y":349},{"x":273,"y":355},{"x":268,"y":356},{"x":271,"y":348},{"x":307,"y":321},{"x":357,"y":304},{"x":424,"y":296},{"x":507,"y":304},{"x":542,"y":331},{"x":573,"y":378},{"x":587,"y":430},{"x":578,"y":477},{"x":541,"y":512},{"x":498,"y":536},{"x":431,"y":558},{"x":381,"y":566},{"x":329,"y":570},{"x":316,"y":571},{"x":298,"y":572},{"x":292,"y":572},{"x":291,"y":572},{"x":294,"y":572},{"x":311,"y":572},{"x":326,"y":582},{"x":342,"y":602},{"x":352,"y":628},{"x":355,"y":649},{"x":349,"y":680},{"x":327,"y":701},{"x":281,"y":717},{"x":236,"y":716},{"x":194,"y":695},{"x":175,"y":677},{"x":174,"y":673},{"x":163,"y":642},{"x":161,"y":584},{"x":166,"y":517},{"x":180,"y":454},{"x":199,"y":383},{"x":214,"y":346},{"x":223,"y":322},{"x":236,"y":302},{"x":246,"y":292},{"x":260,"y":285},{"x":283,"y":283},{"x":323,"y":296},{"x":359,"y":338},{"x":398,"y":410},{"x":435,"y":490},{"x":461,"y":547},{"x":491,"y":616},{"x":521,"y":663},{"x":553,"y":694},{"x":587,"y":716},{"x":612,"y":727},{"x":647,"y":734},{"x":694,"y":736},{"x":736,"y":729},{"x":778,"y":712},{"x":800,"y":701},{"x":814,"y":691},{"x":829,"y":673},{"x":833,"y":660},{"x":835,"y":635},{"x":824,"y":594},{"x":787,"y":560},{"x":726,"y":524},{"x":669,"y":501},{"x":592,"y":483},{"x":516,"y":475},{"x":449,"y":474},{"x":409,"y":473},{"x":380,"y":470},{"x":365,"y":465},{"x":347,"y":453},{"x":346,"y":434},{"x":357,"y":403},{"x":402,"y":331},{"x":419,"y":309},{"x":444,"y":287},{"x":474,"y":272},{"x":519,"y":268},{"x":580,"y":284},{"x":655,"y":334},{"x":796,"y":450},{"x":842,"y":472},{"x":877,"y":486},{"x":900,"y":495},{"x":910,"y":499},{"x":914,"y":502},{"x":912,"y":506},{"x":823,"y":525},{"x":744,"y":532},{"x":659,"y":539},{"x":582,"y":548},{"x":542,"y":554},{"x":510,"y":559},{"x":495,"y":561},{"x":487,"y":562},{"x":491,"y":563},{"x":544,"y":566},{"x":641,"y":585},{"x":759,"y":617},{"x":836,"y":642},{"x":919,"y":670},{"x":982,"y":689},{"x":1002,"y":692},{"x":1017,"y":692},{"x":1031,"y":672},{"x":1039,"y":647},{"x":1054,"y":556},{"x":1057,"y":489},{"x":1057,"y":448},{"x":1044,"y":360},{"x":959,"y":195},{"x":904,"y":146},{"x":823,"y":108},{"x":738,"y":102},{"x":692,"y":110},{"x":633,"y":155},{"x":624,"y":165},{"x":609,"y":199},{"x":633,"y":233},{"x":666,"y":268},{"x":732,"y":359},{"x":745,"y":395},{"x":746,"y":415},{"x":679,"y":450},{"x":592,"y":457},{"x":465,"y":464},{"x":253,"y":488},{"x":191,"y":504},{"x":161,"y":513},{"x":145,"y":518},{"x":135,"y":522},{"x":137,"y":523},{"x":151,"y":523},{"x":189,"y":548},{"x":223,"y":578},{"x":279,"y":651},{"x":292,"y":667},{"x":299,"y":678},{"x":312,"y":689},{"x":325,"y":689},{"x":367,"y":663},{"x":494,"y":528},{"x":541,"y":468},{"x":572,"y":428},{"x":595,"y":395},{"x":599,"y":388},{"x":599,"y":384},{"x":519,"y":351},{"x":440,"y":333},{"x":354,"y":323},{"x":274,"y":306},{"x":258,"y":290},{"x":253,"y":256},{"x":345,"y":98}],
           [] ]);
=======
		ws.send('pad', {title : title});
	})
	$('.padTitle').click(function(){
		var id = $(this).tmplItem().data.id;
		$('#padText').html(getSomeText(id));
>>>>>>> 0f086d56024cd76fd581d036328406bf522ad841
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

function getSomeText(id){
	if (id == 1){
		return "helo";
	} else if (id == 2){
		return "hei";
	} else if (id == 3){
		return "hi";
	}
}
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
