(function () {
	'use strict';

	TodoMVC.App = function (data) {
		TodoMVC.App._super.call(this);
		this.data = data; // TodoMVC.App.Data
	};

	JW.extend(TodoMVC.App, JW.UI.Component, {
		renderInput: function (el) {
			el.keydown(JW.inScope(this._onInputKeyDown, this));
		},

		renderMain: function (el) {
			this.own(new JW.UI.VisibleUpdater(el, this.data.todos.length));
		},

		renderToggleAll: function (el) {
			var checked = this.own(new JW.Functor([this.data.activeTodoCount], function (activeTodoCount) {
				return activeTodoCount === 0;
			}, this)).target;
			this.own(new JW.UI.PropUpdater(el, 'checked', checked));

			// We can't bind to 'change' event, because JW.UI.PropUpdater above triggers it whenever it changes
			// checkbox value via data binding. So, let's listen click.
			el.click(JW.inScope(function () {
				var checked = el.prop('checked');
				this.data.todos.each(function (todo) {
					todo.completed.set(checked);
				}, this);
			}, this));
		},

		renderTodos: function () {
			// We render the filtered item views on demand and destroy them when they no longer match the criteria.
			// Alternatively, we could render all item views at once and then add/remove them to DOM on demand -
			// on your preference.
			return this.own(this.data.filteredTodos.createMapper({
				createItem: function (todo) {
					return new TodoMVC.Todo.View(this.data, todo);
				},
				destroyItem: JW.destroy,
				scope: this
			})).target;
		},

		renderFooter: function () {
			return this.own(new TodoMVC.Footer(this.data));
		},

		_onInputKeyDown: function (e) {
			var value;

			if (e.which !== TodoMVC.ENTER_KEY) {
				return;
			}

			value = jQuery.trim(this.getElement('input').val());
			if (value === '') {
				return;
			}

			this.data.todos.add(new TodoMVC.Todo(value, false));
			this.getElement('input').val('');
		}
	});
})();
