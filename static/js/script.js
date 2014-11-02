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
    var question = $('section.query input.question').val();
    var token = $("input[name='csrfmiddlewaretoken']").val();
    var query_url = window.location.pathname + 'query';
    console.log(token);
    $.post(query_url, {
      'csrfmiddlewaretoken': token,
      'question': question,
    }, function(response){
      if (response.success){
        console.log(response);
      }
      else{
        alert('Cannot recognize this question.');
      }
    });
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
