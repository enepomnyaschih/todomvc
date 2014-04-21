# jWidget TodoMVC Example

> jWidget is a purely object-oriented solution which doesn't rely on mystic custom HTML templates and unclear update cycles.

> _[jWidget - http://enepomnyaschih.github.io/jwidget/index.html#!/guide/home](http://enepomnyaschih.github.io/jwidget/index.html#!/guide/home)_


## Learning jWidget

The [jWidget website](http://enepomnyaschih.github.io/jwidget/index.html#!/guide/home) is a great resource for getting started.

Here are some links you may find helpful:

* [Documentation](http://enepomnyaschih.github.io/jwidget/index.html#!/guide/home)
* [API Reference](http://enepomnyaschih.github.io/jwidget/index.html#!/api)
* [Getting started](http://enepomnyaschih.github.io/jwidget/index.html#!/guide/ensample1)
* [jWidget on GitHub](https://github.com/enepomnyaschih/jwidget)

Get help from other jWidget users:

* [jWidget on Twitter](http://twitter.com/jwidgetproject)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Implementation

We create an [observable array](http://enepomnyaschih.github.io/jwidget/index.html#!/api/JW.ObservableArray) of todos,
and 3 [filterers](http://enepomnyaschih.github.io/jwidget/0.9.0/index.html#!/api/JW.AbstractCollection.Filterer):

* currentFilterer, based on current route (All, Active or Completed). Builds filteredTodos observable array.
Main todo list is bound to this array.
* activeFilterer. Builds activeTodos observable array just to bind number of active items in footer to the length
of this array.
* completedFilterer. Builds completedTodos observable array just to bind number of completed items in "Clear" button
to the length of this array.

Filterers are extremely fast in performance, that's why we don't fear to use 3 of them at once.

Routing is implemented via binding to the observable property
[JW.UI.hash](http://enepomnyaschih.github.io/jwidget/0.9.0/index.html#!/api/JW.UI-static-property-hash).
On initialization, we create a [registry](http://enepomnyaschih.github.io/jwidget/0.9.0/index.html#!/api/Registry)
of 3 filters and take a filter from this registry whenever hash value is changed.
The same registry is used to render the options in the footer.


## Running

[jWidget SDK](https://github.com/enepomnyaschih/jwsdk/wiki/en) command line tool is used to build the application.
Folder "release" contains a built version of the application for you already.

To build the application from source code, install [Bower](http://bower.io/) and
[jWidget SDK](https://github.com/enepomnyaschih/jwsdk/wiki/en). Next, resolve the dependencies in "public" folder
using Bower:

    bower install

After that, build the application from command line in a root folder:

    jwsdk debug jwsdk-config

To build release version, run:

    jwsdk release jwsdk-config
