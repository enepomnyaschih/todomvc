// define 2 global variables just to simplify debugging
var todoData, todoApp;

jQuery(function () {
	'use strict';

	todoData = new TodoMVC.App.Data();
	todoData.loadFromStorage();
	todoApp = new TodoMVC.App(todoData);
	todoApp.renderTo('body');
});
