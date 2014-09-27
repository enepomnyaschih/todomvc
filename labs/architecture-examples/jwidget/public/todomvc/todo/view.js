(function () {
	'use strict';

	TodoMVC.Todo.View = function (data, todo) {
		TodoMVC.Todo.View._super.call(this);

		// We pass data into TodoMVC.Todo.View directly just to be able to remove a todo from todos array.
		// This is acceptable in terms of OOD principles, but if you don't like a dependency on global
		// data object here, you can alternatively create a JW.Event removeEvent object here, trigger
		// it on the destroy button click, catch it in TodoMVC.App class and remove a todo from the list.
		this.data = data; // TodoMVC.App.Data
		this.todo = todo; // TodoMVC.Todo
	};

	JW.extend(TodoMVC.Todo.View, JW.UI.Component, {
		renderRoot: function (el) {
			this.own(new JW.UI.ClassUpdater(el, 'completed', this.todo.completed));
		},

		renderCheckbox: function (el) {
			this.own(new JW.UI.PropUpdater(el, 'checked', this.todo.completed));
			this.own(new JW.UI.CheckedListener(el, this.todo.completed));
		},

		renderTitle: function (el) {
			this.own(new JW.UI.TextUpdater(el, this.todo.title));
			el.dblclick(JW.inScope(this._beginEdit, this));

			// Prevent short effect of text selection on double click
			el.mousedown(JW.UI.preventDefault);
		},

		renderDestroy: function (el) {
			el.click(JW.inScope(function () {
				this.data.todos.removeItem(this.todo);
			}, this));
		},

		renderEdit: function (el) {
			el.blur(JW.inScope(this._endEdit, this));
			el.keydown(JW.inScope(this._onEditKeyDown, this));
		},

		_beginEdit: function () {
			this.el.addClass('editing');
			this.getElement('edit').val(this.todo.title.get()).select().focus();
		},

		_endEdit: function () {
			var value;

			// We don't want to handle blur events from an item that is no
			// longer being edited. Relying on the CSS class here has the
			// benefit of us not having to maintain state in the DOM and the
			// JavaScript logic (copied this trick from Backbone solution).
			if (!this.el.hasClass('editing')) {
				return;
			}
			this.el.removeClass('editing');

			value = jQuery.trim(this.getElement('edit').val());
			if (value !== '') {
				this.todo.title.set(value);
			} else {
				this.data.todos.removeItem(this.todo);
			}
		},

		_onEditKeyDown: function (e) {
			if (e.which === TodoMVC.ENTER_KEY) {
				this._endEdit();
			} else if (e.which === TodoMVC.ESC_KEY) {
				this.el.removeClass('editing');
			}
		}
	});
})();
