(function () {
	'use strict';

	TodoMVC.Todo = function (title, completed) {
		TodoMVC.Todo._super.call(this);
		this.title = this.own(new JW.Property(title));
		this.completed = this.own(new JW.Property(completed));
	};

	JW.extend(TodoMVC.Todo, JW.Class, {
		// JW.Property<String> title;
		// JW.Property<Boolean> completed;
	});
})();
