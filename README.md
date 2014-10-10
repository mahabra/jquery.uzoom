uzoom
======

jQuery Plugin for zooming images

# About

Plugin for zoom effect on mouse hover.

__Attention__: it's alpha test version.

# Install
```npm
$ bower install uzoom
```

# Usage
Use jQuery selector to find your images, then call `.uzoom([options])` plugin:
```javascript
$(".zoomer").uzoom();
```

Html examples:
```html
<a class="zoomer" href="bigimage.jpg"><img src="smallimage.jpg" /></a>
```
```html
<img class="zoomer" src="smallimage.jpg" data-origin="bigimage.jpg" />
```

```html
<img class="zoomer" src="smallimage.jpg" />
```

__Options:__
- "fadeDuration" - (ms) How fast big image fadin` in
- "hideCursor" - (bool) Hide cursor if it possible
- "cursor" - (string) style for cursor (default, pointer, zoom-in and others...)

# Browsers tests
- Chrome 37.0.2062.124 m
- Firefox 32.0.3 (issue exists)
- Safari 5.1.7
- IE 9

# Not supported browsers
IE <=8

# Issues
- Some bug in firefox with page scrollbar when mouse over image

# Author
Performed by Vladimir Kalmykov ([https://github.com/morulus](@morulus))
