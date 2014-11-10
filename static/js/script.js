$(document).ready(function() {


	/*
	 * Plugins
	 */

	$.fn.animateRotate = function(startAngle, endAngle, duration, easing, complete) {
	    var args = $.speed(duration, easing, complete);
	    var step = args.step;
	    return this.each(function(i, e) {
	        args.step = function(now) {
	            $.style(e, 'transform', 'rotate(' + now + 'deg)');
	            if (step) return step.apply(this, arguments);
	        };

	        $({deg: startAngle}).animate({deg: endAngle}, args);
	    });
	};



	/*
	 * Functions
	 */

	var setDimensions = function() {

		/* Widths */
		wWidth = $(window).width();
		var diDrawer = $('div.drawer').width();
		if(wWidth <= 800) {
			$('div.drawer').removeClass('open');
			var dfDrawer = 27;
			$('div.drawer').width(dfDrawer);
			$('button.drawer-toggle i').css('transform', 'rotate(180deg)');
		}
		else {
			var dfDrawer = 250;
			$('div.drawer').width(dfDrawer);
			$('button.drawer-toggle i').css('transform', 'rotate(0deg)');
		}

		/* Heights */
		wHeight = $(window).height();
		hHeight = $('header').height();
		vHeight = wHeight - hHeight;

		$('div.drawer').height(vHeight);
		$('main').height(vHeight);
		$('ul.results-list').height(wHeight - $('section.results').offset().top);

		dHeight = $('div.drawer').height();
		if (dHeight < 505) {
			$('div.past-questions').addClass('closed');
		}
		else {
			$('div.past-questions').removeClass('closed');	
		}
	};
	var postQuery = function() {
		var query = $('section.query input').val();
		$.post( "http://www.github.com", function( query ) {
		  	$( "section.query input" ).html( data );
		});
	};
	var removeResults = function() {
		$('ul.results-list').slideUp(220);
		$('ul.results-list > li').remove();
		$('h5.results-summary').css('opacity', 0);
	};
	var query = function() {
		// Make sure on input change event handler is effective
		$('input.question').blur();

		// Promise to query after cleanup
		var promise = new Promise(function(resolve, reject) {

			removeResults();

			if ($('ul.results-list > li').length == 0) {
				resolve("Stuff worked!");
			}
			else {
				reject(Error("Fuck"));
			}
		});

		// Follow through with promise
		promise.then(function(result) {
			console.log(result);
			var question  = $('section.query input.question').val();
			// processSampleResponse(question);
			processResponse(question);

		}, function(err) {
			console.log(err);
		});
	};
	var processResponse = function(q) {
		// Start processing time
		var start = new Date();

		var token     = $("input[name='csrfmiddlewaretoken']").val();
		var query_url = window.location.pathname + 'query';

		$.post(query_url, {
			'csrfmiddlewaretoken': token,
			'question': q,
		}, function(response){
      		if (response.success){
		        console.log(response);

		        // Get array of words in question
		        var qWords = q.split(" ");

		        // For each class in response
		        var numClasses = response.question.evidencelist.length;
		        if (numClasses > 5) {
		            numClasses = 5;
		        }

		        for(var i=0; i<numClasses; i++) {

		          	// If confidence significant enough
		          	var confidence = parseConfidence(response.question.evidencelist[i].value);
		          	if(confidence > 0.002) {

		            	// Start making the list element
		            	var element = '<li class="result"><div class="result-left"><ul><li class="result-confidence"><i class="fa fa-check"></i><span>';

		            	// Add confidence to list element
		            	element += (confidence + '</span></li><li class="result-add-to-schedule impossible"><i class="fa fa-plus"></i><span>Add</span></li><li class="result-course-info"><i class="fa fa-info"></i><span>Course</span></li></ul></div><div class="result-middle"><h3 class="result-class-title">');

		            	// Add class title to list element
		            	var classTitle = parseTitle(response.question.evidencelist[i].title);
		            	element += (classTitle + '</h3></div><div class="result-right"><span>See reasoning</span><i class="fa fa-angle-down"></i></div><div class="result-expand closed"><h4>What<br><span>Watson</span><br>Found</h4><ul class="relevant-text">');

		            	// Add reasoning to list element
		            	var reasoning = parseReasoning(response.question.evidencelist[i].text, qWords);
		            	element += ("<li>... " + reasoning + " ...</li></ul></div></li>");

		            	// Add list element to markup
		            	$('ul.results-list').append(element);
		          	}
		        }

		        $('ul.results-list').slideDown(350);
		        setResultsSummary(start);
		        updatePastQuestions(response.history);
		    }
      		else {
        		alert('Cannot recognize this question.');
      		}
    	});
	};
	var toggleDrawer = function() {
		var t = 400;
		var open = $('div.drawer').hasClass('open');

		var wWidth = $(window).width();
		// Small width
		if (wWidth <= 800) {
			if(open) {
				var diDrawer = $('div.drawer').width();
				var dfDrawer = 27;

				$('div.drawer').animate({
					width: dfDrawer
				}, {duration: t, queue: false});
				$('button.drawer-toggle i').animateRotate(0, -180, t, "linear");

				$('div.drawer').removeClass('open');
			}
			else {
				var diDrawer = $('div.drawer').width();
				var dfDrawer = 250;

				$('div.drawer').animate({
					width: dfDrawer
				}, {duration: t, queue: false});
				$('button.drawer-toggle i').animateRotate(-180, 0, t, "linear");

				$('div.drawer').addClass('open');
			}
		}
		// Large width
		else {
			if(open) {
				var diDrawer = $('div.drawer').width();
				var diMain = $('main').width();
				var dfDrawer = 50;
				var dfMain = diMain + diDrawer - dfDrawer;

				$('div.drawer').animate({
					width: dfDrawer
				}, {duration: t, queue: false});
				$('main').animate({
					width: dfMain
				}, {duration: t, queue: false});
				$('button.drawer-toggle i').animateRotate(0, -180, t, "linear");

				$('div.drawer').removeClass('open');
			}
			else {
				var diDrawer = $('div.drawer').width();
				var diMain = $('main').width();
				var dfDrawer = 250;
				var dfMain = diMain - dfDrawer + diDrawer;

				$('div.drawer').animate({
					width: dfDrawer
				}, {duration: t, queue: false});
				$('main').animate({
					width: dfMain
				}, {duration: t, queue: false});
				$('button.drawer-toggle i').animateRotate(-180, 0, t, "linear");

				$('div.drawer').addClass('open');
			}
		}
		return;
	};
	var toggleReasoning = function($element) {
		var t = 200;
		var open = $element.siblings('div.result-expand').hasClass('open');

		if(open) {
			$element.children('i').animateRotate(180, 0, t, "linear");
			$element.siblings('div.result-expand').slideUp();
			$element.siblings('div.result-expand').removeClass('open');
			$element.siblings('div.result-expand').addClass('closed');
		}
		else {
			$element.children('i').animateRotate(0, 180, t, "linear");
			$element.siblings('div.result-expand').slideDown();
			$element.siblings('div.result-expand').removeClass('closed');
			$element.siblings('div.result-expand').addClass('open');
		}
		return;
	};
	var parseConfidence = function(c) {
		// Returns 0 if c < 0.0001

		// If confidence has exponential 
		if(c.indexOf('E') > -1) {

			// Get value of exponential
			var exp = c[c.indexOf('E') + 2];

			// Truncate the exponential off
			var cNew = c.substring(0, c.indexOf('E'));

			// Convert to value, rounded to 4 decimal places
			var cFloat = parseFloat(cNew);
			var cWithExp = cFloat * Math.pow(10, (-1 * parseFloat(exp)));
			var cRounded = Number(cWithExp.toFixed(4));

			return cRounded;
		}

		// Confidence doesn't have exponential
		else {
			var cFloat = parseFloat(c);
			var cRounded = Number(cFloat.toFixed(4));

			return cRounded;
		}
	};
	var parseTitle = function(t) {
		var maxLength = 70;
		if(t.length > maxLength) {
			return t.substring(0, maxLength) + '...';
		}
		return t;
	};
	var parseReasoning = function(r, qw) {
		var rWords = r.split(" ");
		var rWordsLength = rWords.length;
		var reasoning = '';

		for(var i=0; i<rWordsLength; i++) {
			if(qw.indexOf(rWords[i]) > -1) {
				reasoning += '<b>' + rWords[i] + '</b> ';
			}
			else {
				reasoning += rWords[i] + ' ';
			}
		}
		return reasoning;
	};
	var setResultsSummary = function(start) {

		// Set number of results
		var numResults = $('ul.results-list > li').length;
		$('span.results-quantity').html(numResults);

		// Set time results took to load
		var end = new Date();
		var t = (end - start) / 1000;
		$('span.results-time').html('(' + t + ' seconds)');

		$('h5.results-summary').fadeTo(300, 1.0);
		return;
	};
	var updatePastQuestions = function(h) {

		// Remove old past questions
		$('ul.past-questions > li').remove();

		// Parse new past questions
		var hList = h.split("##");
		var hListLength = hList.length;

		// Add new past questions to markup
		for (var i=0; i<hListLength; i++) {
			var li = '<li>';
			li += hList[i];
			li += '</li>';
			$('ul.past-questions').append(li);
		}
	};
	var processSampleResponse = function(q) {
		// What course should I take to be a good game designer?

		// Start processing time
		var start = new Date();

		// Get array of words in question
		var qWords = q.split(" ");
		
		// For each class in response
		var numClasses = sampleResponse.question.evidencelist.length;
		for(var i=0; i<numClasses; i++) {

			// If confidence significant enough
			var confidence = parseConfidence(sampleResponse.question.evidencelist[i].value);
			if(confidence > 0.002) {

				// Start making the list element
				var element = '<li class="result"><div class="result-left"><ul><li class="result-confidence"><i class="fa fa-check"></i><span>';

				// Add confidence to list element
				element += (confidence + '</span></li><li class="result-add-to-schedule impossible"><i class="fa fa-plus"></i><span>Add</span></li><li class="result-course-info"><i class="fa fa-info"></i><span>Course</span></li></ul></div><div class="result-middle"><h3 class="result-class-title">');

				// Add class title to list element
				var classTitle = parseTitle(sampleResponse.question.evidencelist[i].title);
				element += (classTitle + '</h3></div><div class="result-right"><span>See reasoning</span><i class="fa fa-angle-down"></i></div><div class="result-expand closed"><h4>What<br><span>Watson</span><br>Found</h4><ul class="relevant-text">');

				// Add reasoning to list element
				var reasoning = parseReasoning(sampleResponse.question.evidencelist[i].text, qWords);
				element += ("<li>... " + reasoning + " ...</li></ul></div></li>");

				// Add list element to markup
				$('ul.results-list').append(element);
			}
		}

		$('ul.results-list').slideDown(350);
		setResultsSummary(start);
		updatePastQuestions(sampleResponse.history);
		return;
	};
	var togglePastQuestions = function($target) {
		dHeight = $('div.drawer').height();
		if (dHeight < 505) {
			if ($target.hasClass('closed')) {
				$target.removeClass('closed');
			}
			else {
				$target.addClass('closed');
			}
		}
	}



	/*
	 * Events
	 */

	$(window).resize(function() {

		setDimensions();
	}).resize();
	$('input.question').on("keypress", function(e) {
		if (e.keyCode == 13) {
            query();
            return false;
        }
	});
	$('button.drawer-toggle').click(function() {

		toggleDrawer();
	});
	$(document).on('click', 'div.result-right', function() {

		toggleReasoning($(this));
	});
	$(document).on('click', 'ul.past-questions > li', function() {
		var q = $(this).html();
		$('input.question').val(q);
		query();
	});
	$('div.past-questions').click(function() {

		togglePastQuestions($(this));
	});

});
