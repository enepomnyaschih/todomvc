(function () {
	'use strict';

	TodoMVC.Filter = function (hash, name, func) {
		TodoMVC.Filter._super.call(this);
		this.hash = hash;
		this.name = name;
		this.func = func;
	};

	JW.extend(TodoMVC.Filter, JW.Class, {
		// String hash;
		// String name;
		// Boolean func(TodoMVC.Todo todo);
	});

	JW.makeRegistry(TodoMVC.Filter, 'hash');

	TodoMVC.Filter.registerItem(new TodoMVC.Filter('/', 'All', function () {
		return true;
	}));

	TodoMVC.Filter.registerItem(new TodoMVC.Filter('/active', 'Active', function (todo) {
		return !todo.completed.get();
	}));

	TodoMVC.Filter.registerItem(new TodoMVC.Filter('/completed', 'Completed', function (todo) {
		return todo.completed.get();
	}));
})();
