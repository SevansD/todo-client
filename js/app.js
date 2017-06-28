(function (window) {
	'use strict';
	$('.toggle-all').click(toggleAll);
	$('#showAll').click(showAll);
	$('#showActive').click(showActive);
	$('#showInActive').click(showInActive);
	$("#modal_trigger").leanModal({
		top: 100,
		overlay: 0.6,
		closeButton: ".modal_close"
	});

	function toggleAll() {
		var todo = $('.todo-list').children('li:not(.completed)');
		todo.each(function () {
			if (!$(this).hasClass('completed')) {
				todo.addClass('completed');
				todo.find('.toggle').attr('checked', true);
			}
		});
	}

	function showActive() {
		var todo = $('.todo-list').children('.completed');
		todo.each(function () {
			todo.hide();
		});
		var todo2 = $('.todo-list').children('li:not(.completed)');
		todo2.each(function () {
			todo2.show();
		});
		$('.filter').removeClass('selected');
		$(this).addClass('selected');
	}

	function showInActive() {
		var todo = $('.todo-list').children('li:not(.completed)');
		todo.each(function () {
			todo.hide();
		});
		var todo2 = $('.todo-list').children('.completed');
		todo2.each(function () {
			todo2.show();
		});
		$('.filter').removeClass('selected');
		$(this).addClass('selected');
	}

	function showAll() {
		var todo = $('.todo-list').children('li');
		todo.each(function () {
			todo.show();
		});
		$('.filter').removeClass('selected');
		$(this).addClass('selected');
	}

})(window);

$(function() {
	// Calling Login Form
	$("#login_form").click(function() {
		$(".social_login").hide();
		$(".user_login").show();
		return false;
	});

	// Calling Register Form
	$("#register_form").click(function() {
		$(".social_login").hide();
		$(".user_register").show();
		$(".header_title").text('Register');
		return false;
	});

	// Going back to Social Forms
	$(".back_btn").click(function() {
		$(".user_login").hide();
		$(".user_register").hide();
		$(".social_login").show();
		$(".header_title").text('Login');
		return false;
	});
});
