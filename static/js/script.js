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

	var setHeights = function() {
		wHeight = $(window).height();
		hHeight = $('header').height();
		vHeight = wHeight - hHeight;

		$('div.drawer').height(vHeight);
		$('main').height(vHeight);
		$('ul.results-list').height(wHeight - $('section.results').offset().top);
	};
	var postQuery = function() {
		var query = $('section.query input').val();
		$.post( "http://www.github.com", function( query ) {
		  	$( "section.query input" ).html( data );
		});
	}
	var query = function() {
		$('h5.results-summary').fadeTo(500, 1.0);
		$('ul.results-list').slideDown();
		processResponse();
	};
	var processResponse = function() {
		// var question = "elephant";
		var question  = $('section.query input.question').val();
		var token     = $("input[name='csrfmiddlewaretoken']").val();
		var query_url = window.location.pathname + 'query';

		console.log(token);

		$.post(query_url, {
			'csrfmiddlewaretoken': token,
			'question': question,
		}, function(response){
			if (response.success){
		    	console.log(response);
		    	var title = response.question.answers[0].text;
		    	title = title.split('-');
		    	$('li.result:first-child h3').html(title[1]);
		    	$('li.result:first-child li.result-confidence > span').html(response.question.answers[0].confidence);
		  	}
		  	else{
		    	alert('Cannot recognize this question.');
		  	}
		});
	};
	var toggleDrawer = function() {
		var t = 400;
		var open = $('div.drawer').hasClass('open');

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
			$('button.drawer-toggle i.left').animateRotate(0, -180, t, "linear");

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
			$('button.drawer-toggle i.left').animateRotate(-180, 0, t, "linear");

			$('div.drawer').addClass('open');
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



	/*
	 * Run on document ready
	 */

	setHeights();




	/*
	 * Events
	 */

	$('input.question').on("keypress", function(e) {
		if (e.keyCode == 13) {
            
            query();
            return false;
        }
	});
	$('button.drawer-toggle').click(function() {
		toggleDrawer();
	});
	$('div.result-right').click(function() {
		toggleReasoning($(this));
	});

});
