var navBar = $('#services-menu');

	if('<%=preference.dataValues.navColor%>') {
		var navColor = '<%=preference.dataValues.navColor %>'
		$(navBar).css('backgroundColor', navColor);
	 } 
	// FOR THE AJAX CALL TO DELETE
	$('#reset').on('click', function(e) {
		e.preventDefault();
		$.ajax({
		    url: '/profile/navcolor',
		    type: 'DELETE',
		});
 		window.location = '/profile'
 	})