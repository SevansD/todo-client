(function ($) {
	$.fn.onEnter = function (func) {
		this.bind('keypress', function (e) {
			if (e.keyCode == 13) func.apply(this, [e]);
		});
		return this;
	};
})(jQuery);
(function (window) {
	load();
	'use strict';
	// Dynamic
	var $todo = $('.todo-list');
	$todo.on('click', '.toggle', toggle);
	$todo.on('click', '.destroy', destroy);
	$todo.on('dblclick', '.element', updateStart);
	$todo.on('focusout', '.edit', updateFinish);
	$todo.on('onEnter', '.edit', updateFinish);

	$('.toggle-all').click(toggleAll);
	$('#showAll').click(showAll);
	$('#showActive').click(showActive);
	$('#showInActive').click(showInActive);
	$('#loginbtn').click(login);
	$('#registerbtn').click(register);
	$('#logout').click(logout);
	$('.clear-completed').click(clearCompleted);

	$('.new-todo').onEnter(createNew);
	$("#modal_trigger").leanModal({
		top: 100,
		overlay: 0.6,
		closeButton: ".modal_close"
	});

	function toggleAll() {
		var $todo = $('.todo-list').children('li:not(.completed)');
		$todo.each(function () {
			if (!$(this).hasClass('completed')) {
				$(this).addClass('completed');
				$(this).find('.toggle').attr('checked', true);
				markAsCompleted($(this).data('id'))
			}
		});
		updateTodoCounter();
	}

	function toggle() {
		var $todo = $(this).parent().parent();
		var status = $(this).prop( "checked" );
		switch (status) {
			case false:
				markAsUnCompleted($todo.data('id'));
				$todo.removeClass('completed');
				break;
			case true:
				markAsCompleted($todo.data('id'));
				$todo.addClass('completed');
				break;
		}
	}

	function markAsCompleted(id) {
		var token = localStorage.getItem('token');
		var uid = localStorage.getItem('uid');
		var user = localStorage.getItem('uname');

		if (token !== undefined) {
			$.ajax({
				type: 'POST',
				headers: {
					'X-UserId': uid,
					'X-UserName': user,
					'X-Token': token
				},
				url: 'http://todos.backend/api/markAsCompleted',
				data: {
					'id': id
				}
			});
		}
	}

	function markAsUnCompleted(id) {
		var token = localStorage.getItem('token');
		var uid = localStorage.getItem('uid');
		var user = localStorage.getItem('uname');

		if (token !== undefined) {
			$.ajax({
				type: 'POST',
				headers: {
					'X-UserId': uid,
					'X-UserName': user,
					'X-Token': token
				},
				url: 'http://todos.backend/api/markAsUnCompleted',
				data: {
					'id': id
				}
			});
		}
	}

	function logIn(user) {
		$('#modal_trigger').hide();
		var $user = $('.user');
		$user.children('span').html('Hello ' + user);
		$user.show();
	}

	function createNew() {
		showAll();
		var token = localStorage.getItem('token');
		var uid = localStorage.getItem('uid');
		var user = localStorage.getItem('uname');
		if (token !== undefined && uid !== undefined && token !== null && uid !== null) {
			$.ajax({
				type: 'POST',
				headers: {
					'X-UserId': uid,
					'X-UserName': user,
					'X-Token': token
				},
				data: {
					'message': $(this).val()
				},
				url: 'http://todos.backend/api/create',
				success: function (json) {
					var data = jQuery.parseJSON(json);
					if (data['id'] !== undefined) {
						createTodo(data['id'], data['message'], data['isCompleted']);
					}
				}
			});
		}
	}

	function load() {
		var token = localStorage.getItem('token');
		var uid = localStorage.getItem('uid');
		var user = localStorage.getItem('uname');
		if (user !== undefined && user !== null) {
			logIn(user);
		}
		if (token !== undefined && uid !== undefined && token !== null && uid !== null) {
			$.ajax({
				type: 'GET',
				headers: {
					'X-UserId': uid,
					'X-UserName': user,
					'X-Token': token
				},
				url: 'http://todos.backend/api/getAll',
				success: function (json) {
					var data = jQuery.parseJSON(json);
					if (data['items'] !== undefined) {
						data['items'].forEach(function (element) {
							createTodo(element['id'], element['message'], element['isCompleted']);
						});
					}
				}
			});
		}
	}

	function createTodo(id, text, isCompleted) {
		var $todolist = $('.todo-list');
		$todolist.append('<li class="' + (isCompleted === '1' ? 'completed ' : '') + 'element" data-id="' + id + '">' +
			'<div class="view">' +
			'<input class="toggle" type="checkbox" ' + (isCompleted === "1" ? 'checked' : '') + '>' +
			'<label class="todo-label">' + text + '</label>' +
			'<button class="destroy"></button>' +
			'</div>\n' +
			'<input class="edit" value="' + text + '">' +
			'</li>');
		$('.new-todo').val('');
		updateTodoCounter();
	}

	function updateTodoCounter() {
		$('.todo-count>strong').html($('.todo-list li:not(.completed)').length);
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
			type: 'POST',
			url: 'http://user.backend/login',
			data: {
				'username': $username,
				'password': $password
			},
			success: function (json) {
				var data = jQuery.parseJSON(json);
				if (data['status'] === 'ok') {
					setData(data);
					$('.modal_close').click();
					logIn(data['userName']);
					load();
				} else {
					alert(data['error']);
				}
			},
			error: function (json) {
				var data = jQuery.parseJSON(json.responseText);
				showError(data['errors']);
			}
		});
	}

	function logout() {
		localStorage.clear();
		$('#modal_trigger').show();
		var $user = $('.user');
		$user.children('span').html();
		$user.hide();
	}

	function register() {
		var $username = $('#username-reg').val();
		var $password = $('#password-reg').val();
		$.ajax({
			type: 'POST',
			url: 'http://user.backend/register',
			data: {
				'username': $username,
				'password': $password
			},
			success: function (json) {
				var data = jQuery.parseJSON(json);
				if (data['status'] === 'ok') {
					setData(data);
					$('.modal_close').click();
					logIn(data['userName']);
					load();
				} else {
					alert(data['error']);
				}
			},
			error: function (json) {
				var data = jQuery.parseJSON(json.responseText);
				showError(data['errors']);
			}
		});
	}

	function destroy() {
		var $parent = $(this).parent().parent();
		var token = localStorage.getItem('token');
		var uid = localStorage.getItem('uid');
		var user = localStorage.getItem('uname');
		if (token !== undefined) {
			$.ajax({
				type: 'DELETE',
				url: 'http://todos.backend/api/delete/' + $parent.data('id'),
				headers: {
					'X-UserId': uid,
					'X-UserName': user,
					'X-Token': token
				},
				success: function() {
					$parent.remove();
					updateTodoCounter();
				}
			});
		}
	}

	function updateStart() {
		var $edit = $(this).children('.edit');
		$edit.show();
		$edit.focus();
		var val = $edit.val();
		$edit.val('');
		$edit.val(val);
		$(this).children('.view').hide();
	}

	function updateFinish() {
		$(this).hide();
		var $children = $(this).parent().children('.view');
		var $label = $children.children('.todo-label');
		var oldVal = $label.html();
		$label.html($(this).val());
		$children.show();
		var token = localStorage.getItem('token');
		var uid = localStorage.getItem('uid');
		var user = localStorage.getItem('uname');
		if (token !== undefined && String($(this).val()) !== String(oldVal)) {
			$.ajax({
				type: 'POST',
				url: 'http://todos.backend/api/update',
				headers: {
					'X-UserId': uid,
					'X-UserName': user,
					'X-Token': token
				},
				data: {
					'id': $(this).parent().data('id'),
					'message': $(this).val()
				}
			});
		}
	}

	function clearCompleted() {
		var $elements = $todo.children('.completed');
		var token = localStorage.getItem('token');
		var uid = localStorage.getItem('uid');
		var user = localStorage.getItem('uname');
		$elements.each(function() {
			if (token !== undefined) {
				var element = $(this);
				$.ajax({
					type: 'DELETE',
					url: 'http://todos.backend/api/delete/' + $(this).data('id'),
					headers: {
						'X-UserId': uid,
						'X-UserName': user,
						'X-Token': token
					},
					success: function() {
						element.remove();
						updateTodoCounter();
					}
				});
			}
		});
	}

	function setData(data) {
		localStorage.setItem('token', data['sid']);
		localStorage.setItem('uid', data['userId']);
		localStorage.setItem('uname', data['userName']);
	}

	function showError(error) {
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
