(function () {
	'use strict';

	TodoMVC.App.Data = function () {
		var currentFilterer, activeFilterer, completedFilterer;

		TodoMVC.App.Data._super.call(this);

		// Full Todo array.
		// Notice that we "own" everything that we create there to make sure that all aggregated objects
		// will be destroyed automatically if we want to destroy this instance of TodoMVC.App.Data.
		this.todos = this.own(new JW.ObservableArray()).ownItems();

		// By URL hash, we detect TodoMVC.Filter instance which determines filtering function.
		// JW.Functor will update the filter on fly, whenever URL hash changes.
		this.filter = this.own(new JW.Functor([JW.UI.hash], function (hash) {
			return TodoMVC.Filter.getItem(hash) || TodoMVC.Filter.getItem('/');
		}, this)).target;

		// We want to add/remove items in DOM on refiltering. The easiest way to do this is to filter
		// items in model first and to bind view to this model.
		// Instead, we could just show/hide the items in DOM on refiltering instead of adding/removal,
		// but it is on your preference. Both solutions are acceptable.
		// Filterer builds a new array filtered by criteria.
		currentFilterer = this.own(this.todos.createFilterer({
			filterItem: this.filter.func
		}));

		// The filterer puts the matching items into a target array.
		this.filteredTodos = currentFilterer.target;

		// Let's reconfigure the filtering criteria whenever filter changes.
		this.own(new JW.Updater([this.filter], function (filter) {
			currentFilterer.reconfigure({
				filterItem: filter.func
			});
		}, this));

		// Also, we want to always be aware of count of active and completed Todo items.
		// Let's create matching item counters for that. They are very similar to filterers,
		// but instead of creating a filtered collection they just create an integer property.
		activeCounter = this.own(this.todos.createCounter({
			filterItem: function (item) {
				return !item.completed.get();
			}
		}));

		this.activeTodoCount = activeCounter.target;

		completedCounter = this.own(this.todos.createCounter({
			filterItem: function (item) {
				return item.completed.get();
			}
		}));

		this.completedTodoCount = completedCounter.target;

		// Next instruction will listen completed.changeEvent for each item of source array in order to
		// update filtered arrays. It will work for newly created items as well.
		this.own(this.todos.createMapper({
			createItem: function (todo) {
				// Object aggregation technique lets us do next tweaks. If you want to create multiple objects and
				// destroy them at once, just create a new empty object and aggregate them into it.
				var pool = new JW.Class();
				pool.own(todo.title.changeEvent.bind(this.updateStorage, this));
				pool.own(todo.completed.changeEvent.bind(function () {
					currentFilterer.refilterItem(todo);
					activeCounter.recount();
					completedCounter.recount();
					this.updateStorage();
				}, this));
				return pool;
			},
			destroyItem: JW.destroy,
			scope: this
		}));

		this.own(this.todos.changeEvent.bind(this.updateStorage, this));

		// JW.Property with ownValue technique can be used to set non-conflicting timeouts.
		this._storageUpdateTimeout = this.own(new JW.Property()).ownValue();
	};

	JW.extend(TodoMVC.App.Data, JW.Class, {
		/*
		JW.AbstractArray<TodoMVC.Todo> todos;
		JW.AbstractArray<TodoMVC.Todo> filteredTodos;
		JW.Property<Integer> activeTodoCount;
		JW.Property<Integer> completedTodoCount;
		JW.Property<TodoMVC.Filter> filter;
		*/

		// This method issues localStorage update in 0 milliseconds to make sure that we won't update it multiple
		// times in a row, because this can be heavy operation in terms of performance.
		updateStorage: function () {
			// Set new timeout.
			// JW.Timeout is just an adapter of setTimeout which calls clearTimeout on destruction.
			// Previous timeout in _storageUpdateTimeout will be cleared automatically because we've
			// called ownValue method for it in constructor.
			this._storageUpdateTimeout.set(new JW.Timeout(function () {
				localStorage['todos-jwidget'] = JSON.stringify(this.todos.map(function (todo) {
					return {
						title: todo.title.get(),
						completed: todo.completed.get()
					};
				}, this));
			}, this));
		},

		// This method is called from boot.js file right after data model initialization.
		loadFromStorage: function () {
			var todos,
			    json = localStorage['todos-jwidget'];

			this.todos.clear();
			if (!json) {
				return;
			}

			todos = JSON.parse(json);
			this.todos.addAll(JW.Array.map(todos, function (todoJson) {
				return new TodoMVC.Todo(todoJson.title, todoJson.completed);
			}, this));
		}
	});
})();
