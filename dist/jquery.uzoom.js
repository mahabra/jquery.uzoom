(function($) {
	var $ = $;
	var _debug = true;
	var Zoom = function(plugin) {
		var that = this;
		this.plugin = plugin;

		this.scope = {
			width: null,
			height: null,
			ready: false,
			pX: 0,
			pY: 0
		}

		// Make pseudo copy of image element
		this.portCss = $.extend({
			width: $(plugin.wraps.image).outerWidth(),
			height: $(plugin.wraps.image).outerHeight(),
			display: 'inline-block'
		}, {
			overflow: 'hidden',
			position: 'relative',
			cursor: plugin.options.hideCursor ? 'none' : plugin.options.cursor
		});

		// Set target image to background
		this.portCss['background-image'] = 'url('+plugin.scope.smallUrl+')';
		this.portCss['background-size'] = this.portCss.width+'px '+this.portCss.height+'px ';

		this.node = $(plugin.wraps.image)
		.and($('<div />', {
			"class": "ultimate-zoom-screen"
		}))
		.bind('mouseover', function() {
			plugin.scope.screenMouseOver = true;
		})
		.bind('mouseleave', function() {
			plugin.scope.screenMouseOver = false;
			plugin.destroyZoom();
		})
		.bind('mousemove', function(e) {
			that.move(e);
		})
		.css(this.portCss)
		.tie(function() {
			that.image = $(this)
				.put($('<img />'))
				.css({
					'position': 'absolute',
					'width': 'auto',
					'opacity': 0
				})
				.tie(function() {
					var node = $(this)[0];
					node.onload = function(e) {
						
						that.scope.width = node.width;
						that.scope.height = node.height;
						that.scope.ready = true;
						that.present();
					}
				})
				.attr("src", that.plugin.scope.bigUrl);

		});

		// Hide image
		$(plugin.wraps.image).hide();

		this.move = function(e) {

			if ((e.offsetX==undefined || e.offsetY==undefined) || e.currentTarget!=e.target) {
				
				var offset = $(that.node).offset();
				var offsetX = e.pageX-offset.left;
				var offsetY = e.pageY-offset.top;
				
			} else {
				
				var offsetX = e.offsetX;
				var offsetY = e.offsetY;
			};

			this.scope.pX = offsetX/this.portCss.width;
			this.scope.pY = offsetY/this.portCss.height;

			

			this.moveZoom(this.scope.pX,this.scope.pY);

		}

		this.moveZoom = function(pX, pY) {
			if (!this.scope.ready) return;
			var left = (( (this.scope.width - this.portCss.width)*pX)*-1)+'px';
			var top = (( (this.scope.height - this.portCss.height)*pY)*-1)+'px';
			this.plugin.debug('screen', this.scope.pX, this.scope.pY, left, top);

			$(this.image)[0].style.left = left;
			$(this.image)[0].style.top = top;
		}

		this.present = function() {
			$(this.image).animate({opacity:1},that.plugin.options.fadeDuration);
		}

		this.remove = function() {
			
			$(this.node).remove();
			$(plugin.wraps.image).show();
		}
	}
	var ultimateZoom = function(el, options) {
		this.el = el;
		this.options = $.extend({
			fadeDuration: 250,
			hideCursor: false,
			cursor: 'default'
		}, options);
		this.wraps = {
			image: null,
			a: null,
			zoom: null
		}
		this.objects = {
			zoom: null
		};
		this.scope = {
			smallUrl: '',
			bigUrl: false,
			screenMouseOver: false 
		}

		/**
			Search for image in two different ways:
			1. Targeting object can be <a />, so image we search inside and big image url we search in [href] attribute of <a />
			2. Targeting object can be <image />, so image is terget, and big image url we search in [data-origin]
		*/
		this.founds = function() {
			// Search image
			if ($(el)[0].tagName.toLowerCase()!='img') {
				this.wraps.image = $(el).find('img:eq(0)');
				this.wraps.a = $(el);
				var mode = 'aimage';
			}
			else {
				this.wraps.image = el;
				var mode = 'pimage';
			}

			// Test image
			if (!$(this.wraps.image).is('img')) {
				// Drop debug report
				
				this.error('Image tag not found', 
					'(Target element or child) is not <IMG /> element', 
					'Expects <IMG /> tag, '+$(this.wraps.image)[0].tagName+' found.');
				
				return false;
			}

			// Get big image url
			switch(mode) {
				case 'aimage':
					$(el).click(function() {
						return false;
					});

					this.scope.bigUrl = $(el).attr('href');

					// Test href
					if (this.scope.bigUrl=='') {
						
						this.error('Tag <a /> has no href', 'Required [href] attribute of <A /> element. Empty found.');
						
						return false; // There is no big image
					}

					this.scope.smallUrl = $(this.wraps.image).attr("src");
				break;
				case 'pimage':
					this.scope.bigUrl = $(el).data('origin');
					// Test origin
					if (this.scope.bigUrl=='') {
						
						this.error('Target tag <img /> has no [data-origin] or empty', 'Required [data-origin] attribute of <IMG /> element. Null found.');
						
						return false; // There is no big image
					}
				break;
			}

			
			this.debug('wraps', this.wraps);
			

			// Test src of image
			if (this.scope.smallUrl=='') {
				this.debug('Tag <img /> has no src', 'Required [src] attribute of <IMG /> element. Empty found.');
				return false; // There is no big image
			}
		}

		this.binds = function() {
			var plugin = this;
			$(el).bind('mouseenter', function() {
				plugin.buildZoom();
			});

			$(el).bind('mouseleave', function() {
				plugin.destroyZoom();
			});
		}

		/* Build screen for view full image */
		this.buildZoom = function() {
			
			this.objects.zoom = new Zoom(this);
			
		}

		this.destroyZoom = function() {
			this.objects.zoom.remove();
		}

		this.debug = function() {
			if (!_debug) return;
			if ("function" == typeof console.group) console.group("ultimateZoom jQuery Plugin:");
			if ("function" == console.log.apply) console.log.apply(console, arguments);
			if ("function" == typeof console.group) console.groupEnd();
		}

		this.error = function() {
			if (!_debug) return;
			if ("function" == typeof console.group) console.group("ultimateZoom jQuery Plugin:");
			if ("function" == console.error.apply) console.error.apply(console, arguments);
			if ("function" == typeof console.group) console.groupEnd();
		}

		this.founds();
		this.binds();

	}

	$.fn.ultimateZoom = $.fn.uZoom = function(options) {
		var options = options || {};
		return $(this).each(function() {
			new ultimateZoom(this, options);
		});
	}
})(jQuery);