(function () {
	'use strict';

	TodoMVC.Filter = function (hash, name, func) {
		TodoMVC.Filter._super.call(this);
		this.hash = hash; // String
		this.name = name; // String
		this.func = func; // Boolean func(TodoMVC.Todo todo);
	};

	JW.extend(TodoMVC.Filter, JW.Class);

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
