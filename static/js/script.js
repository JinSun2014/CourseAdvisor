$(document).ready(function() {


	/*
	 * Functions
	 */

	var setHeights = function() {
		wHeight = $(window).height();
		hHeight = $('header').height();
		vHeight = wHeight - hHeight;
		$('div.drawer').height(vHeight);
		$('main').height(vHeight);
		$('ul.results-list').height($('main').height() - $('section.query').height() - 132);
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
	};



	/*
	 * Run on document ready
	 */

	setHeights();




	/*
	 * Events
	 */

	$('input').on("keypress", function(e) {
		if (e.keyCode == 13) {
            
            query();
            return false;
        }
	});

});