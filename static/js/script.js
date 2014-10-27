$(document).ready(function() {


	var setHeights = function() {
		wHeight = $(window).height();
		$('div.drawer').height(wHeight);
		$('main').height(wHeight);
		$('ul.results-list').height($('main').height() - $('section.query').height() - 132);
	};
	var postQuery = function() {
		var query = $('section.query input').val();
		$.post( "http://www.github.com", function( query ) {
		  	$( "section.query input" ).html( data );
		});
	}


	setHeights();
	$('input').on("keypress", function(e) {
		if (e.keyCode == 13) {
            
            postQuery();
            return false;
        }
	});

});