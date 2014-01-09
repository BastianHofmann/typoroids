(function() {

	var App = {
		Views: {},
		Models: {},
		Collections: {}
	};

	window.App = App;

	window.vent = _.extend({}, Backbone.Events);

	// var chars = 'fjdksla;ghtybnvmruiec,x.zwoqp/\'][675849302-1=',
	// 	keys = '';

	// chars = chars.split('');

	// console.log(keys);

	// for (var i = 0; i < 200; i++)
	// {
	// 	keys + chars[Math.floor(i + i * 0.25)];

	// 	if ((Math.random() * (4 - 1) + 1) == 1)
	// 		keys + chars[Math.floor(i + 1)];

	// 	keys + chars[Math.floor(i + i * 0.25)];

	// 	if ((Math.random() * (4 - 1) + 1) == 1)
	// 		keys + chars[Math.floor(i + 1)];

	// 	keys + chars[Math.floor(i + i * 0.25)];

	// 	if ((Math.random() * (4 - 1) + 1) == 1)
	// 		keys + chars[Math.floor(i + 1)];

	// 	keys + chars[Math.floor(i + i * 0.25)];

	// 	if ((Math.random() * (4 - 1) + 1) == 1)
	// 		keys + chars[Math.floor(i + 1)];

	// 	keys + 'sadasd';

	// 	console.log(keys + 'sadasd');
	// }

	// console.log(keys);

	App.Models.Key = Backbone.Model.extend({

		defaults: {
			sequence: 'ffff',
			current: false
		}

	});

	App.Collections.Keys = Backbone.Collection.extend({

		model: App.Models.Key

	});

	App.Views.Keyboard = Backbone.View.extend({

		initialize: function()
		{
			vent.on('done', this.next, this);
		},

		next: function()
		{
			this.collection = new App.Collections.Keys(this.collection.slice(1, this.collection.length));

			this.collection.at(0).set('current', true);

			this.render();
		},

		render: function()
		{
			this.$el.empty();

			this.collection.each(this.add, this);

			return this;
		},

		add: function(key)
		{
			var keyView = new App.Views.Key({ model: key});

			this.$el.append(keyView.render().el);
		}

	});

	App.Views.Key = Backbone.View.extend({

		initialize: function()
		{
			this.at = 0;

			this.keys = this.model.get('sequence').split('');
		},

		render: function()
		{
			var data = this.model.toJSON(),
				keys = this.keys;

			data.class = 'row';

			if (data.current)
			{
				data.class = 'row current';

				$(document).keypress(this, this.typed);
			}

			this.$el.html('<div class="' + data.class + '"></div>');

			for (var i = 0; i < keys.length; i++)
			{
				data.keyClass = 'key';

				if (data.current && this.at == i)
					data.keyClass = 'key current';

				this.$el.find('.row').append('<span class="' + data.keyClass + ' i-' + i + '">' + keys[i] +'</span>');
			}

			return this;
		},

		typed: function(event)
		{
			var view = event.data;

			if (view.keys[view.at] == String.fromCharCode(event.charCode))
			{
				view.$el.find('.current .i-' + view.at).addClass('correct');

				var next = view.at + 1;

				view.$el.find('.i-' + next).addClass('current');
				
				view.at = view.at + 1;

				if (view.at == 4)
				{
					vent.trigger('done');
				}
			}
			else
			{
				view.$el.find('.current .i-' + view.at).addClass('false');
			}
		},

	});

	App.Views.App = Backbone.View.extend({

		el: $('#app'),

		initialize: function()
		{
			var keys = new App.Collections.Keys([
				{sequence: 'ffff'},
				{sequence: 'ffjj'},
				{sequence: 'fjfj'},
				{sequence: 'fffj'},
				{sequence: 'fjff'},
				{sequence: 'ffdd'},
				{sequence: 'jjdd'},
				{sequence: 'ffll'},
				{sequence: 'fkfk'},
				{sequence: 'dkff'},
				{sequence: 'ddll'},
				{sequence: 'jjkl'},
				{sequence: 'ffll'},
				{sequence: 'ddll'},
				{sequence: 'llss'},
				{sequence: 'ssfs'},
				{sequence: 'kkaa'},
				{sequence: 'alal'},
				{sequence: 'dkll'},
				{sequence: 'aadd'},
				{sequence: 'slls'},
				{sequence: ';;aa'},
				{sequence: 'addd'},
				{sequence: 'llld'},
				{sequence: 'ddds'},
				{sequence: 'ssjj'},
				{sequence: 'ffaa'},
				{sequence: ';;ad'}
			]);

			keys.at(0).set('current', true);

			this.render(keys);
		},

		render: function(keys)
		{
			var keyboard = new App.Views.Keyboard({collection: keys});

			this.$el.html(keyboard.render().el);
		}

	});

})();