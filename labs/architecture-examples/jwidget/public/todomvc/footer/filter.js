(function () {
	'use strict';

	TodoMVC.Footer.Filter = function (filter) {
		TodoMVC.Footer.Filter._super.call(this);
		this.filter = filter; // TodoMVC.Filter
		this.selected = this.own(new JW.Property(false));
	};

	JW.extend(TodoMVC.Footer.Filter, JW.UI.Component, {
		renderLink: function (el) {
			el.text(this.filter.name);
			el.attr('href', '#' + this.filter.hash);
			this.own(new JW.UI.ClassUpdater(el, 'selected', this.selected));
		}
	});
})();
