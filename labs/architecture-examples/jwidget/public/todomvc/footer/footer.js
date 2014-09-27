(function () {
	'use strict';

	TodoMVC.Footer = function (data) {
		TodoMVC.Footer._super.call(this);
		this.data = data; // TodoMVC.App.Data
	};

	JW.extend(TodoMVC.Footer, JW.UI.Component, {
		renderRoot: function (el) {
			this.own(new JW.UI.VisibleUpdater(el, this.data.todos.length));
		},

		renderFilters: function () {
			var filterViews, filterViewMap, selectedFilterView;

			// First, create an array of filter views using JW.Array.$map method
			filterViews = this.own(JW.Array.$map(TodoMVC.Filter.itemArray, function (filter) {
				return new TodoMVC.Footer.Filter(filter);
			}, this)).ownItems();

			// Index filter views by their string hash
			filterViewMap = filterViews.index(JW.byField('filter.hash'));

			// Bind a currently selected filter view to a currently selected filter model
			selectedFilterView = this.own(JW.Functor([this.data.filter], function(filter) {
				return filterViewMap[filter.hash];
			}, this)).target;

			// Next instruction will manage 'selected' property of filter views
			this.own(new JW.Switcher([selectedFilterView], {
				init: function (filterView) {
					filterView.selected.set(true);
				},
				done: function (filterView) {
					filterView.selected.set(false);
				},
				scope: this
			}));

			// Return the array of views to render them into element with jwid="filters"
			return filterViews;
		},

		renderCountActive: function (el) {
			this.own(new JW.UI.TextUpdater(el, this.data.activeTodoCount));
		},

		renderPluralActive: function (el) {
			var plural = this.own(new JW.Functor([this.data.activeTodoCount], function (count) {
				return (count === 1) ? '' : 's';
			}, this)).target;
			this.own(new JW.UI.TextUpdater(el, plural));
		},

		renderClearCompleted: function (el) {
			this.own(new JW.UI.VisibleUpdater(el, this.data.completedTodoCount));

			el.click(JW.inScope(function () {
				this.data.todos.performFilter(this.data.todos.filter(function (todo) {
					return !todo.completed.get();
				}, this));
			}, this));
		},

		renderCountCompleted: function (el) {
			this.own(new JW.UI.TextUpdater(el, this.data.completedTodoCount));
		}
	});
})();
