(function (window) {
	load();
	'use strict';
	$('.toggle-all').click(toggleAll);
	$('#showAll').click(showAll);
	$('#showActive').click(showActive);
	$('#showInActive').click(showInActive);
	$('#loginbtn').click(login);
	$('#registerbtn').click(register);
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
				var token = localStorage.getItem('token');
				if (token !== undefined) {
					$.ajax({
						type: 'POST',
						url: 'http://todos.backend/api/markAsCompleted',
						data: {
							'id' : $(this).data('id'),
							'token':token,
							'userName': localStorage.getItem('uname'),
							'userId': localStorage.getItem('uid')
						}
					});
				}
			}
		});
	}

	function load() {
		var token = localStorage.getItem('token');
		var uid = localStorage.getItem('uid');
		if (token !== undefined && uid !== undefined) {
			$.ajax({
				type: 'GET',
				data: {
					'token':token,
					'userName': localStorage.getItem('uname'),
					'userId': localStorage.getItem('uid')
				},
				url: 'http://todos.backend/api/getAll',
				success: function(json) {
					var data = jQuery.parseJSON(json);
					console.log(data);
					data.each(function(element) {

					});
				}
			});
		}
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

	function login() {
		var $username = $('#username-login').val();
		var $password = $('#password-login').val();
		$.ajax({
			type : 'POST',
			url  : 'http://user.backend/login',
			data : {
				'username': $username,
				'password': $password
			},
			success: function(json) {
				var data = jQuery.parseJSON(json);
				if (data['status'] === 'ok') {
					setData(data);
					$('.modal_close').click();
					load();
				} else {
					alert(data['error']);
				}
			},
			error: function(json) {
				var data = jQuery.parseJSON(json.responseText);
				showError(data['errors']);
			}
		});
	}

	function register()
	{
		var $username = $('#username-reg').val();
		var $password = $('#password-reg').val();
		$.ajax({
			type : 'POST',
			url  : 'http://user.backend/register',
			data : {
				'username': $username,
				'password': $password
			},
			success: function(json) {
				var data = jQuery.parseJSON(json);
				if (data['status'] === 'ok') {
					setData(data);
					$('.modal_close').click();
					load();
				} else {
					alert(data['error']);
				}
			},
			error: function(json) {
				var data = jQuery.parseJSON(json.responseText);
				showError(data['errors']);
			}
		});
	}

	function setData(data)
	{
		localStorage.setItem('token', data['sid']);
		localStorage.setItem('uid', data['userId']);
		localStorage.setItem('uname', data['userName']);
	}

	function showError(error)
	{
		alert("You field " + error[0] + " has error: " + error[1]);
	}

	$("#login_form").click(function () {
		$(".social_login").hide();
		$(".user_login").show();
		return false;
	});

	$("#register_form").click(function () {
		$(".social_login").hide();
		$(".user_register").show();
		$(".header_title").text('Register');
		return false;
	});

	$(".back_btn").click(function () {
		$(".user_login").hide();
		$(".user_register").hide();
		$(".social_login").show();
		$(".header_title").text('Login');
		return false;
	});
})(window);
