

  (function() {
    
    var SKIP_ID = 'meta';
    var metaData = {}, metaArray = {};

    Polymer('core-meta', {
      
      /**
       * The type of meta-data.  All meta-data with the same type with be
       * stored together.
       * 
       * @attribute type
       * @type string
       * @default 'default'
       */
      type: 'default',
      
      alwaysPrepare: true,
      
      ready: function() {
        this.register(this.id);
      },
      
      get metaArray() {
        var t = this.type;
        if (!metaArray[t]) {
          metaArray[t] = [];
        }
        return metaArray[t];
      },
      
      get metaData() {
        var t = this.type;
        if (!metaData[t]) {
          metaData[t] = {};
        }
        return metaData[t];
      },
      
      register: function(id, old) {
        if (id && id !== SKIP_ID) {
          this.unregister(this, old);
          this.metaData[id] = this;
          this.metaArray.push(this);
        }
      },
      
      unregister: function(meta, id) {
        delete this.metaData[id || meta.id];
        var i = this.metaArray.indexOf(meta);
        if (i >= 0) {
          this.metaArray.splice(i, 1);
        }
      },
      
      /**
       * Returns a list of all meta-data elements with the same type.
       * 
       * @property list
       * @type array
       * @default []
       */
      get list() {
        return this.metaArray;
      },
      
      /**
       * Retrieves meta-data by ID.
       *
       * @method byId
       * @param {String} id The ID of the meta-data to be returned.
       * @returns Returns meta-data.
       */
      byId: function(id) {
        return this.metaData[id];
      }
      
    });
    
  })();
  
;

  
    Polymer('core-iconset', {
  
      /**
       * The URL of the iconset image.
       *
       * @attribute src
       * @type string
       * @default ''
       */
      src: '',

      /**
       * The width of the iconset image. This must only be specified if the
       * icons are arranged into separate rows inside the image.
       *
       * @attribute width
       * @type number
       * @default 0
       */
      width: 0,

      /**
       * A space separated list of names corresponding to icons in the iconset
       * image file. This list must be ordered the same as the icon images
       * in the image file.
       *
       * @attribute icons
       * @type string
       * @default ''
       */
      icons: '',

      /**
       * The size of an individual icon. Note that icons must be square.
       *
       * @attribute iconSize
       * @type number
       * @default 24
       */
      iconSize: 24,

      /**
       * The horizontal offset of the icon images in the inconset src image.
       * This is typically used if the image resource contains additional images
       * beside those intended for the iconset.
       *
       * @attribute offsetX
       * @type number
       * @default 0
       */
      offsetX: 0,
      /**
       * The vertical offset of the icon images in the inconset src image.
       * This is typically used if the image resource contains additional images
       * beside those intended for the iconset.
       *
       * @attribute offsetY
       * @type number
       * @default 0
       */
      offsetY: 0,
      type: 'iconset',

      created: function() {
        this.iconMap = {};
        this.iconNames = [];
        this.themes = {};
      },
  
      ready: function() {
        // TODO(sorvell): ensure iconset's src is always relative to the main
        // document
        if (this.src && (this.ownerDocument !== document)) {
          this.src = this.resolvePath(this.src, this.ownerDocument.baseURI);
        }
        this.super();
        this.updateThemes();
      },

      iconsChanged: function() {
        var ox = this.offsetX;
        var oy = this.offsetY;
        this.icons && this.icons.split(/\s+/g).forEach(function(name, i) {
          this.iconNames.push(name);
          this.iconMap[name] = {
            offsetX: ox,
            offsetY: oy
          }
          if (ox + this.iconSize < this.width) {
            ox += this.iconSize;
          } else {
            ox = this.offsetX;
            oy += this.iconSize;
          }
        }, this);
      },

      updateThemes: function() {
        var ts = this.querySelectorAll('property[theme]');
        ts && ts.array().forEach(function(t) {
          this.themes[t.getAttribute('theme')] = {
            offsetX: parseInt(t.getAttribute('offsetX')) || 0,
            offsetY: parseInt(t.getAttribute('offsetY')) || 0
          };
        }, this);
      },

      // TODO(ffu): support retrived by index e.g. getOffset(10);
      /**
       * Returns an object containing `offsetX` and `offsetY` properties which
       * specify the pixel locaion in the iconset's src file for the given
       * `icon` and `theme`. It's uncommon to call this method. It is useful,
       * for example, to manually position a css backgroundImage to the proper
       * offset. It's more common to use the `applyIcon` method.
       *
       * @method getOffset
       * @param {String|Number} icon The name of the icon or the index of the
       * icon within in the icon image.
       * @param {String} theme The name of the theme.
       * @returns {Object} An object specifying the offset of the given icon 
       * within the icon resource file; `offsetX` is the horizontal offset and
       * `offsetY` is the vertical offset. Both values are in pixel units.
       */
      getOffset: function(icon, theme) {
        var i = this.iconMap[icon];
        if (!i) {
          var n = this.iconNames[Number(icon)];
          i = this.iconMap[n];
        }
        var t = this.themes[theme];
        if (i && t) {
          return {
            offsetX: i.offsetX + t.offsetX,
            offsetY: i.offsetY + t.offsetY
          }
        }
        return i;
      },

      /**
       * Applies an icon to the given element as a css background image. This
       * method does not size the element, and it's often necessary to set 
       * the element's height and width so that the background image is visible.
       *
       * @method applyIcon
       * @param {Element} element The element to which the background is
       * applied.
       * @param {String|Number} icon The name or index of the icon to apply.
       * @param {Number} scale (optional, defaults to 1) A scaling factor 
       * with which the icon can be magnified.
       * @return {Element} The icon element.
       */
      applyIcon: function(element, icon, scale) {
        var offset = this.getOffset(icon);
        scale = scale || 1;
        if (element && offset) {
          var icon = element._icon || document.createElement('div');
          var style = icon.style;
          style.backgroundImage = 'url(' + this.src + ')';
          style.backgroundPosition = (-offset.offsetX * scale + 'px') + 
             ' ' + (-offset.offsetY * scale + 'px');
          style.backgroundSize = scale === 1 ? 'auto' :
             this.width * scale + 'px';
          if (icon.parentNode !== element) {
            element.appendChild(icon);
          }
          return icon;
        }
      }

    });

  ;

(function() {
  
  // mono-state
  var meta;
  
  Polymer('core-icon', {

    /**
     * The URL of an image for the icon. If the src property is specified,
     * the icon property should not be.
     *
     * @attribute src
     * @type string
     * @default ''
     */
    src: '',

    /**
     * Specifies the icon name or index in the set of icons available in
     * the icon's icon set. If the icon property is specified,
     * the src property should not be.
     *
     * @attribute icon
     * @type string
     * @default ''
     */
    icon: '',

    /**
     * Alternative text content for accessibility support.
     * If alt is present and not empty, it will set the element's role to img and add an aria-label whose content matches alt.
     * If alt is present and is an empty string, '', it will hide the element from the accessibility layer
     * If alt is not present, it will set the element's role to img and the element will fallback to using the icon attribute for its aria-label.
     * 
     * @attribute alt
     * @type string
     * @default ''
     */
    alt: null,

    observe: {
      'icon': 'updateIcon',
      'alt': 'updateAlt'
    },

    defaultIconset: 'icons',

    ready: function() {
      if (!meta) {
        meta = document.createElement('core-iconset');
      }

      // Allow user-provided `aria-label` in preference to any other text alternative.
      if (this.hasAttribute('aria-label')) {
        // Set `role` if it has not been overridden.
        if (!this.hasAttribute('role')) {
          this.setAttribute('role', 'img');
        }
        return;
      }
      this.updateAlt();
    },

    srcChanged: function() {
      var icon = this._icon || document.createElement('div');
      icon.textContent = '';
      icon.setAttribute('fit', '');
      icon.style.backgroundImage = 'url(' + this.src + ')';
      icon.style.backgroundPosition = 'center';
      icon.style.backgroundSize = '100%';
      if (!icon.parentNode) {
        this.appendChild(icon);
      }
      this._icon = icon;
    },

    getIconset: function(name) {
      return meta.byId(name || this.defaultIconset);
    },

    updateIcon: function(oldVal, newVal) {
      if (!this.icon) {
        this.updateAlt();
        return;
      }
      var parts = String(this.icon).split(':');
      var icon = parts.pop();
      if (icon) {
        var set = this.getIconset(parts.pop());
        if (set) {
          this._icon = set.applyIcon(this, icon);
          if (this._icon) {
            this._icon.setAttribute('fit', '');
          }
        }
      }
      // Check to see if we're using the old icon's name for our a11y fallback
      if (oldVal) {
        if (oldVal.split(':').pop() == this.getAttribute('aria-label')) {
          this.updateAlt();
        }
      }
    },

    updateAlt: function() {
      // Respect the user's decision to remove this element from
      // the a11y tree
      if (this.getAttribute('aria-hidden')) {
        return;
      }

      // Remove element from a11y tree if `alt` is empty, otherwise
      // use `alt` as `aria-label`.
      if (this.alt === '') {
        this.setAttribute('aria-hidden', 'true');
        if (this.hasAttribute('role')) {
          this.removeAttribute('role');
        }
        if (this.hasAttribute('aria-label')) {
          this.removeAttribute('aria-label');
        }
      } else {
        this.setAttribute('aria-label', this.alt ||
                                        this.icon.split(':').pop());
        if (!this.hasAttribute('role')) {
          this.setAttribute('role', 'img');
        }
        if (this.hasAttribute('aria-hidden')) {
          this.removeAttribute('aria-hidden');
        }
      }
    }

  });
  
})();
;


    Polymer('core-iconset-svg', {


      /**
       * The size of an individual icon. Note that icons must be square.
       *
       * @attribute iconSize
       * @type number
       * @default 24
       */
      iconSize: 24,
      type: 'iconset',

      created: function() {
        this._icons = {};
      },

      ready: function() {
        this.super();
        this.updateIcons();
      },

      iconById: function(id) {
        return this._icons[id] || (this._icons[id] = this.querySelector('[id="' + id +'"]'));
      },

      cloneIcon: function(id) {
        var icon = this.iconById(id);
        if (icon) {
          var content = icon.cloneNode(true);
          content.removeAttribute('id');
          var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 ' + this.iconSize + ' ' +
              this.iconSize);
          // NOTE(dfreedm): work around https://crbug.com/370136
          svg.style.pointerEvents = 'none';
          svg.appendChild(content);
          return svg;
        }
      },

      get iconNames() {
        if (!this._iconNames) {
          this._iconNames = this.findIconNames();
        }
        return this._iconNames;
      },

      findIconNames: function() {
        var icons = this.querySelectorAll('[id]').array();
        if (icons.length) {
          return icons.map(function(n){ return n.id });
        }
      },

      /**
       * Applies an icon to the given element. The svg icon is added to the
       * element's shadowRoot if one exists or directly to itself.
       *
       * @method applyIcon
       * @param {Element} element The element to which the icon is
       * applied.
       * @param {String|Number} icon The name the icon to apply.
       * @return {Element} The icon element
       */
      applyIcon: function(element, icon) {
        var root = element;
        // remove old
        var old = root.querySelector('svg');
        if (old) {
          old.remove();
        }
        // install new
        var svg = this.cloneIcon(icon);
        if (!svg) {
          return;
        }
        svg.setAttribute('height', '100%');
        svg.setAttribute('width', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.display = 'block';
        root.insertBefore(svg, root.firstElementChild);
        return svg;
      },
      
      /**
       * Tell users of the iconset, that the set has loaded.
       * This finds all elements matching the selector argument and calls 
       * the method argument on them.
       * @method updateIcons
       * @param selector {string} css selector to identify iconset users, 
       * defaults to '[icon]'
       * @param method {string} method to call on found elements, 
       * defaults to 'updateIcon'
       */
      updateIcons: function(selector, method) {
        selector = selector || '[icon]';
        method = method || 'updateIcon';
        var deep = window.ShadowDOMPolyfill ? '' : 'html /deep/ ';
        var i$ = document.querySelectorAll(deep + selector);
        for (var i=0, e; e=i$[i]; i++) {
          if (e[method]) {
            e[method].call(e);
          }
        }
      }
      

    });

  ;


  (function() {

    var p = {

      eventDelegates: {
        down: 'downAction'
      },

      activeChanged: function() {
        this.super();

        if (this.$.ripple) {
          if (this.active) {
            // FIXME: remove when paper-ripple can have a default 'down' state.
            if (!this.lastEvent) {
              var rect = this.getBoundingClientRect();
              this.lastEvent = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
              }
            }
            this.$.ripple.downAction(this.lastEvent);
          } else {
            this.$.ripple.upAction();
          }
        }

        this.adjustZ();
      },

      disabledChanged: function() {
        this._disabledChanged();
        this.adjustZ();
      },

      recenteringTouchChanged: function() {
        if (this.$.ripple) {
          this.$.ripple.classList.toggle('recenteringTouch', this.recenteringTouch);
        }
      },

      fillChanged: function() {
        if (this.$.ripple) {
          this.$.ripple.classList.toggle('fill', this.fill);
        }
      },

      adjustZ: function() {
        if (!this.$.shadow) {
          return;
        }
        if (this.active) {
          this.$.shadow.setZ(2);
        } else if (this.disabled) {
          this.$.shadow.setZ(0);
        } else {
          this.$.shadow.setZ(1);
        }
      },

      downAction: function(e) {
        this._downAction();

        if (this.hasAttribute('noink')) {
          return;
        }

        this.lastEvent = e;
        if (!this.$.ripple) {
          var ripple = document.createElement('paper-ripple');
          ripple.setAttribute('id', 'ripple');
          ripple.setAttribute('fit', '');
          if (this.recenteringTouch) {
            ripple.classList.add('recenteringTouch');
          }
          if (!this.fill) {
            ripple.classList.add('circle');
          }
          this.$.ripple = ripple;
          this.shadowRoot.insertBefore(ripple, this.shadowRoot.firstChild);
          // No need to forward the event to the ripple because the ripple
          // is triggered in activeChanged
        }
      }

    };

    Polymer.mixin2(p, Polymer.CoreFocusable);
    Polymer('paper-button-base',p);

  })();

;


  (function() {

    var waveMaxRadius = 150;
    //
    // INK EQUATIONS
    //
    function waveRadiusFn(touchDownMs, touchUpMs, anim) {
      // Convert from ms to s
      var touchDown = touchDownMs / 1000;
      var touchUp = touchUpMs / 1000;
      var totalElapsed = touchDown + touchUp;
      var ww = anim.width, hh = anim.height;
      // use diagonal size of container to avoid floating point math sadness
      var waveRadius = Math.min(Math.sqrt(ww * ww + hh * hh), waveMaxRadius) * 1.1 + 5;
      var duration = 1.1 - .2 * (waveRadius / waveMaxRadius);
      var tt = (totalElapsed / duration);

      var size = waveRadius * (1 - Math.pow(80, -tt));
      return Math.abs(size);
    }

    function waveOpacityFn(td, tu, anim) {
      // Convert from ms to s.
      var touchDown = td / 1000;
      var touchUp = tu / 1000;
      var totalElapsed = touchDown + touchUp;

      if (tu <= 0) {  // before touch up
        return anim.initialOpacity;
      }
      return Math.max(0, anim.initialOpacity - touchUp * anim.opacityDecayVelocity);
    }

    function waveOuterOpacityFn(td, tu, anim) {
      // Convert from ms to s.
      var touchDown = td / 1000;
      var touchUp = tu / 1000;

      // Linear increase in background opacity, capped at the opacity
      // of the wavefront (waveOpacity).
      var outerOpacity = touchDown * 0.3;
      var waveOpacity = waveOpacityFn(td, tu, anim);
      return Math.max(0, Math.min(outerOpacity, waveOpacity));
    }

    // Determines whether the wave should be completely removed.
    function waveDidFinish(wave, radius, anim) {
      var waveOpacity = waveOpacityFn(wave.tDown, wave.tUp, anim);

      // If the wave opacity is 0 and the radius exceeds the bounds
      // of the element, then this is finished.
      return waveOpacity < 0.01 && radius >= Math.min(wave.maxRadius, waveMaxRadius);
    };

    function waveAtMaximum(wave, radius, anim) {
      var waveOpacity = waveOpacityFn(wave.tDown, wave.tUp, anim);

      return waveOpacity >= anim.initialOpacity && radius >= Math.min(wave.maxRadius, waveMaxRadius);
    }

    //
    // DRAWING
    //
    function drawRipple(ctx, x, y, radius, innerAlpha, outerAlpha) {
      // Only animate opacity and transform
      if (outerAlpha !== undefined) {
        ctx.bg.style.opacity = outerAlpha;
      }
      ctx.wave.style.opacity = innerAlpha;

      var s = radius / (ctx.containerSize / 2);
      var dx = x - (ctx.containerWidth / 2);
      var dy = y - (ctx.containerHeight / 2);

      ctx.wc.style.webkitTransform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
      ctx.wc.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';

      // 2d transform for safari because of border-radius and overflow:hidden clipping bug.
      // https://bugs.webkit.org/show_bug.cgi?id=98538
      ctx.wave.style.webkitTransform = 'scale(' + s + ',' + s + ')';
      ctx.wave.style.transform = 'scale3d(' + s + ',' + s + ',1)';
    }

    //
    // SETUP
    //
    function createWave(elem) {
      var elementStyle = window.getComputedStyle(elem);
      var fgColor = elementStyle.color;

      var inner = document.createElement('div');
      inner.style.backgroundColor = fgColor;
      inner.classList.add('wave');

      var outer = document.createElement('div');
      outer.classList.add('wave-container');
      outer.appendChild(inner);

      var container = elem.$.waves;
      container.appendChild(outer);

      elem.$.bg.style.backgroundColor = fgColor;

      var wave = {
        bg: elem.$.bg,
        wc: outer,
        wave: inner,
        waveColor: fgColor,
        maxRadius: 0,
        isMouseDown: false,
        mouseDownStart: 0.0,
        mouseUpStart: 0.0,
        tDown: 0,
        tUp: 0
      };
      return wave;
    }

    function removeWaveFromScope(scope, wave) {
      if (scope.waves) {
        var pos = scope.waves.indexOf(wave);
        scope.waves.splice(pos, 1);
        // FIXME cache nodes
        wave.wc.remove();
      }
    };

    // Shortcuts.
    var pow = Math.pow;
    var now = Date.now;
    if (window.performance && performance.now) {
      now = performance.now.bind(performance);
    }

    function cssColorWithAlpha(cssColor, alpha) {
        var parts = cssColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (typeof alpha == 'undefined') {
            alpha = 1;
        }
        if (!parts) {
          return 'rgba(255, 255, 255, ' + alpha + ')';
        }
        return 'rgba(' + parts[1] + ', ' + parts[2] + ', ' + parts[3] + ', ' + alpha + ')';
    }

    function dist(p1, p2) {
      return Math.sqrt(pow(p1.x - p2.x, 2) + pow(p1.y - p2.y, 2));
    }

    function distanceFromPointToFurthestCorner(point, size) {
      var tl_d = dist(point, {x: 0, y: 0});
      var tr_d = dist(point, {x: size.w, y: 0});
      var bl_d = dist(point, {x: 0, y: size.h});
      var br_d = dist(point, {x: size.w, y: size.h});
      return Math.max(tl_d, tr_d, bl_d, br_d);
    }

    Polymer('paper-ripple', {

      /**
       * The initial opacity set on the wave.
       *
       * @attribute initialOpacity
       * @type number
       * @default 0.25
       */
      initialOpacity: 0.25,

      /**
       * How fast (opacity per second) the wave fades out.
       *
       * @attribute opacityDecayVelocity
       * @type number
       * @default 0.8
       */
      opacityDecayVelocity: 0.8,

      backgroundFill: true,
      pixelDensity: 2,

      eventDelegates: {
        down: 'downAction',
        up: 'upAction'
      },

      ready: function() {
        this.waves = [];
      },

      downAction: function(e) {
        var wave = createWave(this);

        this.cancelled = false;
        wave.isMouseDown = true;
        wave.tDown = 0.0;
        wave.tUp = 0.0;
        wave.mouseUpStart = 0.0;
        wave.mouseDownStart = now();

        var rect = this.getBoundingClientRect();
        var width = rect.width;
        var height = rect.height;
        var touchX = e.x - rect.left;
        var touchY = e.y - rect.top;

        wave.startPosition = {x:touchX, y:touchY};

        if (this.classList.contains("recenteringTouch")) {
          wave.endPosition = {x: width / 2,  y: height / 2};
          wave.slideDistance = dist(wave.startPosition, wave.endPosition);
        }
        wave.containerSize = Math.max(width, height);
        wave.containerWidth = width;
        wave.containerHeight = height;
        wave.maxRadius = distanceFromPointToFurthestCorner(wave.startPosition, {w: width, h: height});

        // The wave is circular so constrain its container to 1:1
        wave.wc.style.top = (wave.containerHeight - wave.containerSize) / 2 + 'px';
        wave.wc.style.left = (wave.containerWidth - wave.containerSize) / 2 + 'px';
        wave.wc.style.width = wave.containerSize + 'px';
        wave.wc.style.height = wave.containerSize + 'px';

        this.waves.push(wave);

        if (!this._loop) {
          this._loop = this.animate.bind(this, {
            width: width,
            height: height
          });
          requestAnimationFrame(this._loop);
        }
        // else there is already a rAF
      },

      upAction: function() {
        for (var i = 0; i < this.waves.length; i++) {
          // Declare the next wave that has mouse down to be mouse'ed up.
          var wave = this.waves[i];
          if (wave.isMouseDown) {
            wave.isMouseDown = false
            wave.mouseUpStart = now();
            wave.mouseDownStart = 0;
            wave.tUp = 0.0;
            break;
          }
        }
        this._loop && requestAnimationFrame(this._loop);
      },

      cancel: function() {
        this.cancelled = true;
      },

      animate: function(ctx) {
        var shouldRenderNextFrame = false;

        var deleteTheseWaves = [];
        // The oldest wave's touch down duration
        var longestTouchDownDuration = 0;
        var longestTouchUpDuration = 0;
        // Save the last known wave color
        var lastWaveColor = null;
        // wave animation values
        var anim = {
          initialOpacity: this.initialOpacity,
          opacityDecayVelocity: this.opacityDecayVelocity,
          height: ctx.height,
          width: ctx.width
        }

        for (var i = 0; i < this.waves.length; i++) {
          var wave = this.waves[i];

          if (wave.mouseDownStart > 0) {
            wave.tDown = now() - wave.mouseDownStart;
          }
          if (wave.mouseUpStart > 0) {
            wave.tUp = now() - wave.mouseUpStart;
          }

          // Determine how long the touch has been up or down.
          var tUp = wave.tUp;
          var tDown = wave.tDown;
          longestTouchDownDuration = Math.max(longestTouchDownDuration, tDown);
          longestTouchUpDuration = Math.max(longestTouchUpDuration, tUp);

          // Obtain the instantenous size and alpha of the ripple.
          var radius = waveRadiusFn(tDown, tUp, anim);
          var waveAlpha =  waveOpacityFn(tDown, tUp, anim);
          var waveColor = cssColorWithAlpha(wave.waveColor, waveAlpha);
          lastWaveColor = wave.waveColor;

          // Position of the ripple.
          var x = wave.startPosition.x;
          var y = wave.startPosition.y;

          // Ripple gravitational pull to the center of the canvas.
          if (wave.endPosition) {

            // This translates from the origin to the center of the view  based on the max dimension of
            var translateFraction = Math.min(1, radius / wave.containerSize * 2 / Math.sqrt(2) );

            x += translateFraction * (wave.endPosition.x - wave.startPosition.x);
            y += translateFraction * (wave.endPosition.y - wave.startPosition.y);
          }

          // If we do a background fill fade too, work out the correct color.
          var bgFillColor = null;
          if (this.backgroundFill) {
            var bgFillAlpha = waveOuterOpacityFn(tDown, tUp, anim);
            bgFillColor = cssColorWithAlpha(wave.waveColor, bgFillAlpha);
          }

          // Draw the ripple.
          drawRipple(wave, x, y, radius, waveAlpha, bgFillAlpha);

          // Determine whether there is any more rendering to be done.
          var maximumWave = waveAtMaximum(wave, radius, anim);
          var waveDissipated = waveDidFinish(wave, radius, anim);
          var shouldKeepWave = !waveDissipated || maximumWave;
          // keep rendering dissipating wave when at maximum radius on upAction
          var shouldRenderWaveAgain = wave.mouseUpStart ? !waveDissipated : !maximumWave;
          shouldRenderNextFrame = shouldRenderNextFrame || shouldRenderWaveAgain;
          if (!shouldKeepWave || this.cancelled) {
            deleteTheseWaves.push(wave);
          }
       }

        if (shouldRenderNextFrame) {
          requestAnimationFrame(this._loop);
        }

        for (var i = 0; i < deleteTheseWaves.length; ++i) {
          var wave = deleteTheseWaves[i];
          removeWaveFromScope(this, wave);
        }

        if (!this.waves.length && this._loop) {
          // clear the background color
          this.$.bg.style.backgroundColor = null;
          this._loop = null;
          this.fire('core-transitionend');
        }
      }

    });

  })();

;

    Polymer('paper-icon-button',{

      publish: {

        /**
         * The URL of an image for the icon. If the src property is specified,
         * the icon property should not be.
         *
         * @attribute src
         * @type string
         * @default ''
         */
        src: '',

        /**
         * Specifies the icon name or index in the set of icons available in
         * the icon's icon set. If the icon property is specified,
         * the src property should not be.
         *
         * @attribute icon
         * @type string
         * @default ''
         */
        icon: '',

        recenteringTouch: true,
        fill: false

      },

      iconChanged: function(oldIcon) {
        var label = this.getAttribute('aria-label');
        if (!label || label === oldIcon) {
          this.setAttribute('aria-label', this.icon);
        }
      }

    });

  ;

  (function() {
    /*
     * Chrome uses an older version of DOM Level 3 Keyboard Events
     *
     * Most keys are labeled as text, but some are Unicode codepoints.
     * Values taken from: http://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/keyset.html#KeySet-Set
     */
    var KEY_IDENTIFIER = {
      'U+0009': 'tab',
      'U+001B': 'esc',
      'U+0020': 'space',
      'U+002A': '*',
      'U+0030': '0',
      'U+0031': '1',
      'U+0032': '2',
      'U+0033': '3',
      'U+0034': '4',
      'U+0035': '5',
      'U+0036': '6',
      'U+0037': '7',
      'U+0038': '8',
      'U+0039': '9',
      'U+0041': 'a',
      'U+0042': 'b',
      'U+0043': 'c',
      'U+0044': 'd',
      'U+0045': 'e',
      'U+0046': 'f',
      'U+0047': 'g',
      'U+0048': 'h',
      'U+0049': 'i',
      'U+004A': 'j',
      'U+004B': 'k',
      'U+004C': 'l',
      'U+004D': 'm',
      'U+004E': 'n',
      'U+004F': 'o',
      'U+0050': 'p',
      'U+0051': 'q',
      'U+0052': 'r',
      'U+0053': 's',
      'U+0054': 't',
      'U+0055': 'u',
      'U+0056': 'v',
      'U+0057': 'w',
      'U+0058': 'x',
      'U+0059': 'y',
      'U+005A': 'z',
      'U+007F': 'del'
    };

    /*
     * Special table for KeyboardEvent.keyCode.
     * KeyboardEvent.keyIdentifier is better, and KeyBoardEvent.key is even better than that
     *
     * Values from: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent.keyCode#Value_of_keyCode
     */
    var KEY_CODE = {
      9: 'tab',
      13: 'enter',
      27: 'esc',
      33: 'pageup',
      34: 'pagedown',
      35: 'end',
      36: 'home',
      32: 'space',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      46: 'del',
      106: '*'
    };

    /*
     * KeyboardEvent.key is mostly represented by printable character made by the keyboard, with unprintable keys labeled
     * nicely.
     *
     * However, on OS X, Alt+char can make a Unicode character that follows an Apple-specific mapping. In this case, we
     * fall back to .keyCode.
     */
    var KEY_CHAR = /[a-z0-9*]/;

    function transformKey(key) {
      var validKey = '';
      if (key) {
        var lKey = key.toLowerCase();
        if (lKey.length == 1) {
          if (KEY_CHAR.test(lKey)) {
            validKey = lKey;
          }
        } else if (lKey == 'multiply') {
          // numpad '*' can map to Multiply on IE/Windows
          validKey = '*';
        } else {
          validKey = lKey;
        }
      }
      return validKey;
    }

    var IDENT_CHAR = /U\+/;
    function transformKeyIdentifier(keyIdent) {
      var validKey = '';
      if (keyIdent) {
        if (IDENT_CHAR.test(keyIdent)) {
          validKey = KEY_IDENTIFIER[keyIdent];
        } else {
          validKey = keyIdent.toLowerCase();
        }
      }
      return validKey;
    }

    function transformKeyCode(keyCode) {
      var validKey = '';
      if (Number(keyCode)) {
        if (keyCode >= 65 && keyCode <= 90) {
          // ascii a-z
          // lowercase is 32 offset from uppercase
          validKey = String.fromCharCode(32 + keyCode);
        } else if (keyCode >= 112 && keyCode <= 123) {
          // function keys f1-f12
          validKey = 'f' + (keyCode - 112);
        } else if (keyCode >= 48 && keyCode <= 57) {
          // top 0-9 keys
          validKey = String(48 - keyCode);
        } else if (keyCode >= 96 && keyCode <= 105) {
          // num pad 0-9
          validKey = String(96 - keyCode);
        } else {
          validKey = KEY_CODE[keyCode];
        }
      }
      return validKey;
    }

    function keyboardEventToKey(ev) {
      // fall back from .key, to .keyIdentifier, and then to .keyCode
      var normalizedKey = transformKey(ev.key) || transformKeyIdentifier(ev.keyIdentifier) || transformKeyCode(ev.keyCode) || '';
      return {
        shift: ev.shiftKey,
        ctrl: ev.ctrlKey,
        meta: ev.metaKey,
        alt: ev.altKey,
        key: normalizedKey
      };
    }

    /*
     * Input: ctrl+shift+f7 => {ctrl: true, shift: true, key: 'f7'}
     * ctrl/space => {ctrl: true} || {key: space}
     */
    function stringToKey(keyCombo) {
      var keys = keyCombo.split('+');
      var keyObj = Object.create(null);
      keys.forEach(function(key) {
        if (key == 'shift') {
          keyObj.shift = true;
        } else if (key == 'ctrl') {
          keyObj.ctrl = true;
        } else if (key == 'alt') {
          keyObj.alt = true;
        } else {
          keyObj.key = key;
        }
      });
      return keyObj;
    }

    function keyMatches(a, b) {
      return Boolean(a.alt) == Boolean(b.alt) && Boolean(a.ctrl) == Boolean(b.ctrl) && Boolean(a.shift) == Boolean(b.shift) && a.key === b.key;
    }

    /**
     * Fired when a keycombo in `keys` is pressed.
     *
     * @event keys-pressed
     */
    function processKeys(ev) {
      var current = keyboardEventToKey(ev);
      for (var i = 0, dk; i < this._desiredKeys.length; i++) {
        dk = this._desiredKeys[i];
        if (keyMatches(dk, current)) {
          ev.preventDefault();
          ev.stopPropagation();
          this.fire('keys-pressed', current, this, false);
          break;
        }
      }
    }

    function listen(node, handler) {
      if (node && node.addEventListener) {
        node.addEventListener('keydown', handler);
      }
    }

    function unlisten(node, handler) {
      if (node && node.removeEventListener) {
        node.removeEventListener('keydown', handler);
      }
    }

    Polymer('core-a11y-keys', {
      created: function() {
        this._keyHandler = processKeys.bind(this);
      },
      attached: function() {
        if (!this.target) {
          this.target = this.parentNode;
        }
        listen(this.target, this._keyHandler);
      },
      detached: function() {
        unlisten(this.target, this._keyHandler);
      },
      publish: {
        /**
         * The set of key combinations to listen for.
         *
         * @attribute keys
         * @type string (keys syntax)
         * @default ''
         */
        keys: '',
        /**
         * The node that will fire keyboard events.
         * Default to this element's parentNode unless one is assigned
         *
         * @attribute target
         * @type Node
         * @default this.parentNode
         */
        target: null
      },
      keysChanged: function() {
        // * can have multiple mappings: shift+8, * on numpad or Multiply on numpad
        var normalized = this.keys.replace('*', '* shift+*');
        this._desiredKeys = normalized.toLowerCase().split(' ').map(stringToKey);
      },
      targetChanged: function(oldTarget) {
        unlisten(oldTarget, this._keyHandler);
        listen(this.target, this._keyHandler);
      }
    });
  })();
;


  Polymer('core-dropdown-base',{

    publish: {

      /**
       * True if the menu is open.
       *
       * @attribute opened
       * @type boolean
       * @default false
       */
      opened: false

    },

    eventDelegates: {
      'tap': 'toggleOverlay'
    },

    overlayListeners: {
      'core-overlay-open': 'openAction'
    },

    get dropdown() {
      if (!this._dropdown) {
        this._dropdown = this.querySelector('.dropdown');
        for (var l in this.overlayListeners) {
          this.addElementListener(this._dropdown, l, this.overlayListeners[l]);
        }
      }
      return this._dropdown;
    },

    attached: function() {
      // find the dropdown on attach
      // FIXME: Support MO?
      this.dropdown;
    },

    addElementListener: function(node, event, methodName, capture) {
      var fn = this._makeBoundListener(methodName);
      if (node && fn) {
        Polymer.addEventListener(node, event, fn, capture);
      }
    },

    removeElementListener: function(node, event, methodName, capture) {
      var fn = this._makeBoundListener(methodName);
      if (node && fn) {
        Polymer.removeEventListener(node, event, fn, capture);
      }
    },

    _makeBoundListener: function(methodName) {
      var self = this, method = this[methodName];
      if (!method) {
        return;
      }
      var bound = '_bound' + methodName;
      if (!this[bound]) {
        this[bound] = function(e) {
          method.call(self, e);
        };
      }
      return this[bound];
    },

    openedChanged: function() {
      if (this.disabled) {
        return;
      }
      var dropdown = this.dropdown;
      if (dropdown) {
        dropdown.opened = this.opened;
      }
    },

    openAction: function(e) {
      this.opened = !!e.detail;
    },

    toggleOverlay: function() {
      this.opened = !this.opened;
    }

  });

;


  Polymer('paper-menu-button',{

    overlayListeners: {
      'core-overlay-open': 'openAction',
      'core-activate': 'activateAction'
    },

    activateAction: function() {
      this.opened = false;
    }

  });

;

    Polymer('core-transition', {
      
      type: 'transition',

      /**
       * Run the animation.
       *
       * @method go
       * @param {Node} node The node to apply the animation on
       * @param {Object} state State info
       */
      go: function(node, state) {
        this.complete(node);
      },

      /**
       * Set up the animation. This may include injecting a stylesheet,
       * applying styles, creating a web animations object, etc.. This
       *
       * @method setup
       * @param {Node} node The animated node
       */
      setup: function(node) {
      },

      /**
       * Tear down the animation.
       *
       * @method teardown
       * @param {Node} node The animated node
       */
      teardown: function(node) {
      },

      /**
       * Called when the animation completes. This function also fires the
       * `core-transitionend` event.
       *
       * @method complete
       * @param {Node} node The animated node
       */
      complete: function(node) {
        this.fire('core-transitionend', null, node);
      },

      /**
       * Utility function to listen to an event on a node once.
       *
       * @method listenOnce
       * @param {Node} node The animated node
       * @param {string} event Name of an event
       * @param {Function} fn Event handler
       * @param {Array} args Additional arguments to pass to `fn`
       */
      listenOnce: function(node, event, fn, args) {
        var self = this;
        var listener = function() {
          fn.apply(self, args);
          node.removeEventListener(event, listener, false);
        }
        node.addEventListener(event, listener, false);
      }

    });
  ;

    Polymer('core-key-helper', {
      ENTER_KEY: 13,
      ESCAPE_KEY: 27
    });
  ;

(function() {

  Polymer('core-overlay-layer', {
    publish: {
      opened: false
    },
    openedChanged: function() {
      this.classList.toggle('core-opened', this.opened);
    },
    /**
     * Adds an element to the overlay layer
     */
    addElement: function(element) {
      if (!this.parentNode) {
        document.querySelector('body').appendChild(this);
      }
      if (element.parentNode !== this) {
        element.__contents = [];
        var ip$ = element.querySelectorAll('content');
        for (var i=0, l=ip$.length, n; (i<l) && (n = ip$[i]); i++) {
          this.moveInsertedElements(n);
          this.cacheDomLocation(n);
          n.parentNode.removeChild(n);
          element.__contents.push(n);
        }
        this.cacheDomLocation(element);
        this.updateEventController(element);
        var h = this.makeHost();
        h.shadowRoot.appendChild(element);
        element.__host = h;
      }
    },
    makeHost: function() {
      var h = document.createElement('overlay-host');
      h.createShadowRoot();
      this.appendChild(h);
      return h;
    },
    moveInsertedElements: function(insertionPoint) {
      var n$ = insertionPoint.getDistributedNodes();
      var parent = insertionPoint.parentNode;
      insertionPoint.__contents = [];
      for (var i=0, l=n$.length, n; (i<l) && (n=n$[i]); i++) {
        this.cacheDomLocation(n);
        this.updateEventController(n);
        insertionPoint.__contents.push(n);
        parent.appendChild(n);  
      }
    },
    updateEventController: function(element) {
      element.eventController = this.element.findController(element);
    },
    /**
     * Removes an element from the overlay layer
     */
    removeElement: function(element) {
      element.eventController = null;
      this.replaceElement(element);
      var h = element.__host;
      if (h) {
        h.parentNode.removeChild(h);
      }
    },
    replaceElement: function(element) {
      if (element.__contents) {
        for (var i=0, c$=element.__contents, c; (c=c$[i]); i++) {
          this.replaceElement(c);
        }
        element.__contents = null;
      }
      if (element.__parentNode) {
        var n = element.__nextElementSibling && element.__nextElementSibling 
            === element.__parentNode ? element.__nextElementSibling : null;
        element.__parentNode.insertBefore(element, n);
      }
    },
    cacheDomLocation: function(element) {
      element.__nextElementSibling = element.nextElementSibling;
      element.__parentNode = element.parentNode;
    }
  });
  
})();
;

(function() {

  Polymer('core-overlay', {

    publish: {
      /**
       * The target element that will be shown when the overlay is 
       * opened. If unspecified, the core-overlay itself is the target.
       *
       * @attribute target
       * @type Object
       * @default the overlay element
       */
      target: null,


      /**
       * A `core-overlay`'s size is guaranteed to be 
       * constrained to the window size. To achieve this, the sizingElement
       * is sized with a max-height/width. By default this element is the 
       * target element, but it can be specifically set to a specific element
       * inside the target if that is more appropriate. This is useful, for 
       * example, when a region inside the overlay should scroll if needed.
       *
       * @attribute sizingTarget
       * @type Object
       * @default the target element
       */
      sizingTarget: null,
    
      /**
       * Set opened to true to show an overlay and to false to hide it.
       * A `core-overlay` may be made initially opened by setting its
       * `opened` attribute.
       * @attribute opened
       * @type boolean
       * @default false
       */
      opened: false,

      /**
       * If true, the overlay has a backdrop darkening the rest of the screen.
       * The backdrop element is attached to the document body and may be styled
       * with the class `core-overlay-backdrop`. When opened the `core-opened`
       * class is applied.
       *
       * @attribute backdrop
       * @type boolean
       * @default false
       */    
      backdrop: false,

      /**
       * If true, the overlay is guaranteed to display above page content.
       *
       * @attribute layered
       * @type boolean
       * @default false
      */
      layered: false,
    
      /**
       * By default an overlay will close automatically if the user
       * taps outside it or presses the escape key. Disable this
       * behavior by setting the `autoCloseDisabled` property to true.
       * @attribute autoCloseDisabled
       * @type boolean
       * @default false
       */
      autoCloseDisabled: false,

      /**
       * By default an overlay will focus its target or an element inside
       * it with the `autoFocus` attribute. Disable this
       * behavior by setting the `autoFocusDisabled` property to true.
       * @attribute autoFocusDisabled
       * @type boolean
       * @default false
       */
      autoFocusDisabled: false,

      /**
       * This property specifies an attribute on elements that should
       * close the overlay on tap. Should not set `closeSelector` if this
       * is set.
       *
       * @attribute closeAttribute
       * @type string
       * @default "core-overlay-toggle"
       */
      closeAttribute: 'core-overlay-toggle',

      /**
       * This property specifies a selector matching elements that should
       * close the overlay on tap. Should not set `closeAttribute` if this
       * is set.
       *
       * @attribute closeSelector
       * @type string
       * @default ""
       */
      closeSelector: '',

      /**
       * The transition property specifies a string which identifies a 
       * <a href="../core-transition/">`core-transition`</a> element that 
       * will be used to help the overlay open and close. The default
       * `core-transition-fade` will cause the overlay to fade in and out.
       *
       * @attribute transition
       * @type string
       * @default 'core-transition-fade'
       */
      transition: 'core-transition-fade'

    },

    captureEventName: 'tap',
    targetListeners: {
      'tap': 'tapHandler',
      'keydown': 'keydownHandler',
      'core-transitionend': 'transitionend'
    },
    
    registerCallback: function(element) {
      this.layer = document.createElement('core-overlay-layer');
      this.keyHelper = document.createElement('core-key-helper');
      this.meta = document.createElement('core-transition');
      this.scrim = document.createElement('div');
      this.scrim.className = 'core-overlay-backdrop';
    },

    ready: function() {
      this.target = this.target || this;
      // flush to ensure styles are installed before paint
      Polymer.flush();
    },

    /** 
     * Toggle the opened state of the overlay.
     * @method toggle
     */
    toggle: function() {
      this.opened = !this.opened;
    },

    /** 
     * Open the overlay. This is equivalent to setting the `opened`
     * property to true.
     * @method open
     */
    open: function() {
      this.opened = true;
    },

    /** 
     * Close the overlay. This is equivalent to setting the `opened` 
     * property to false.
     * @method close
     */
    close: function() {
      this.opened = false;
    },

    domReady: function() {
      this.ensureTargetSetup();
    },

    targetChanged: function(old) {
      if (this.target) {
        // really make sure tabIndex is set
        if (this.target.tabIndex < 0) {
          this.target.tabIndex = -1;
        }
        this.addElementListenerList(this.target, this.targetListeners);
        this.target.style.display = 'none';
        this.target.__overlaySetup = false;
      }
      if (old) {
        this.removeElementListenerList(old, this.targetListeners);
        var transition = this.getTransition();
        if (transition) {
          transition.teardown(old);
        } else {
          old.style.position = '';
          old.style.outline = '';
        }
        old.style.display = '';
      }
    },

    transitionChanged: function(old) {
      if (!this.target) {
        return;
      }
      if (old) {
        this.getTransition(old).teardown(this.target);
      }
      this.target.__overlaySetup = false;
    },

    // NOTE: wait to call this until we're as sure as possible that target
    // is styled.
    ensureTargetSetup: function() {
      if (!this.target || this.target.__overlaySetup) {
        return;
      }
      if (!this.sizingTarget) {
        this.sizingTarget = this.target;
      }
      this.target.__overlaySetup = true;
      this.target.style.display = '';
      var transition = this.getTransition();
      if (transition) {
        transition.setup(this.target);
      }
      var style = this.target.style;
      var computed = getComputedStyle(this.target);
      if (computed.position === 'static') {
        style.position = 'fixed';
      }
      style.outline = 'none';
      style.display = 'none';
    },

    openedChanged: function() {
      this.transitioning = true;
      this.ensureTargetSetup();
      this.prepareRenderOpened();
      // async here to allow overlay layer to become visible.
      this.async(function() {
        this.target.style.display = '';
        // force layout to ensure transitions will go
        this.target.offsetWidth;
        this.renderOpened();
      });
      this.fire('core-overlay-open', this.opened);
    },

    // tasks which must occur before opening; e.g. making the element visible
    prepareRenderOpened: function() {
      if (this.opened) {
        addOverlay(this);
      }
      this.prepareBackdrop();
      // async so we don't auto-close immediately via a click.
      this.async(function() {
        if (!this.autoCloseDisabled) {
          this.enableElementListener(this.opened, document,
              this.captureEventName, 'captureHandler', true);
        }
      });
      this.enableElementListener(this.opened, window, 'resize',
          'resizeHandler');

      if (this.opened) {
        // force layout so SD Polyfill renders
        this.target.offsetHeight;
        this.discoverDimensions();
        // if we are showing, then take care when positioning
        this.preparePositioning();
        this.positionTarget();
        this.updateTargetDimensions();
        this.finishPositioning();
        if (this.layered) {
          this.layer.addElement(this.target);
          this.layer.opened = this.opened;
        }
      }
    },

    // tasks which cause the overlay to actually open; typically play an
    // animation
    renderOpened: function() {
      var transition = this.getTransition();
      if (transition) {
        transition.go(this.target, {opened: this.opened});
      } else {
        this.transitionend();
      }
      this.renderBackdropOpened();
    },

    // finishing tasks; typically called via a transition
    transitionend: function(e) {
      // make sure this is our transition event.
      if (e && e.target !== this.target) {
        return;
      }
      this.transitioning = false;
      if (!this.opened) {
        this.resetTargetDimensions();
        this.target.style.display = 'none';
        this.completeBackdrop();
        removeOverlay(this);
        if (this.layered) {
          if (!currentOverlay()) {
            this.layer.opened = this.opened;
          }
          this.layer.removeElement(this.target);
        }
      }
      this.fire('core-overlay-' + (this.opened ? 'open' : 'close') + 
          '-completed');
      this.applyFocus();
    },

    prepareBackdrop: function() {
      if (this.backdrop && this.opened) {
        if (!this.scrim.parentNode) {
          document.body.appendChild(this.scrim);
          this.scrim.style.zIndex = currentOverlayZ() - 1;
        }
        trackBackdrop(this);
      }
    },

    renderBackdropOpened: function() {
      if (this.backdrop && getBackdrops().length < 2) {
        this.scrim.classList.toggle('core-opened', this.opened);
      }
    },

    completeBackdrop: function() {
      if (this.backdrop) {
        trackBackdrop(this);
        if (getBackdrops().length === 0) {
          this.scrim.parentNode.removeChild(this.scrim);
        }
      }
    },

    preparePositioning: function() {
      this.target.style.transition = this.target.style.webkitTransition = 'none';
      this.target.style.transform = this.target.style.webkitTransform = 'none';
      this.target.style.display = '';
    },

    discoverDimensions: function() {
      if (this.dimensions) {
        return;
      }
      var target = getComputedStyle(this.target);
      var sizer = getComputedStyle(this.sizingTarget);
      this.dimensions = {
        position: {
          v: target.top !== 'auto' ? 'top' : (target.bottom !== 'auto' ?
            'bottom' : null),
          h: target.left !== 'auto' ? 'left' : (target.right !== 'auto' ?
            'right' : null),
          css: target.position
        },
        size: {
          v: sizer.maxHeight !== 'none',
          h: sizer.maxWidth !== 'none'
        },
        margin: {
          top: parseInt(target.marginTop) || 0,
          right: parseInt(target.marginRight) || 0,
          bottom: parseInt(target.marginBottom) || 0,
          left: parseInt(target.marginLeft) || 0
        }
      };
    },

    finishPositioning: function(target) {
      this.target.style.display = 'none';
      this.target.style.transform = this.target.style.webkitTransform = '';
      // force layout to avoid application of transform
      this.target.offsetWidth;
      this.target.style.transition = this.target.style.webkitTransition = '';
    },

    getTransition: function(name) {
      return this.meta.byId(name || this.transition);
    },

    getFocusNode: function() {
      return this.target.querySelector('[autofocus]') || this.target;
    },

    applyFocus: function() {
      var focusNode = this.getFocusNode();
      if (this.opened) {
        if (!this.autoFocusDisabled) {
          focusNode.focus();
        }
      } else {
        focusNode.blur();
        if (currentOverlay() == this) {
          console.warn('Current core-overlay is attempting to focus itself as next! (bug)');
        } else {
          focusOverlay();
        }
      }
    },

    positionTarget: function() {
      // fire positioning event
      this.fire('core-overlay-position', {target: this.target,
          sizingTarget: this.sizingTarget, opened: this.opened});
      if (!this.dimensions.position.v) {
        this.target.style.top = '0px';
      }
      if (!this.dimensions.position.h) {
        this.target.style.left = '0px';
      }
    },

    updateTargetDimensions: function() {
      this.sizeTarget();
      this.repositionTarget();
    },

    sizeTarget: function() {
      this.sizingTarget.style.boxSizing = 'border-box';
      var dims = this.dimensions;
      var rect = this.target.getBoundingClientRect();
      if (!dims.size.v) {
        this.sizeDimension(rect, dims.position.v, 'top', 'bottom', 'Height');
      }
      if (!dims.size.h) {
        this.sizeDimension(rect, dims.position.h, 'left', 'right', 'Width');
      }
    },

    sizeDimension: function(rect, positionedBy, start, end, extent) {
      var dims = this.dimensions;
      var flip = (positionedBy === end);
      var m = flip ? start : end;
      var ws = window['inner' + extent];
      var o = dims.margin[m] + (flip ? ws - rect[end] : 
          rect[start]);
      var offset = 'offset' + extent;
      var o2 = this.target[offset] - this.sizingTarget[offset];
      this.sizingTarget.style['max' + extent] = (ws - o - o2) + 'px';
    },

    // vertically and horizontally center if not positioned
    repositionTarget: function() {
      // only center if position fixed.      
      if (this.dimensions.position.css !== 'fixed') {
        return; 
      }
      if (!this.dimensions.position.v) {
        var t = (window.innerHeight - this.target.offsetHeight) / 2;
        t -= this.dimensions.margin.top;
        this.target.style.top = t + 'px';
      }

      if (!this.dimensions.position.h) {
        var l = (window.innerWidth - this.target.offsetWidth) / 2;
        l -= this.dimensions.margin.left;
        this.target.style.left = l + 'px';
      }
    },

    resetTargetDimensions: function() {
      if (!this.dimensions || !this.dimensions.size.v) {
        this.sizingTarget.style.maxHeight = '';  
        this.target.style.top = '';
      }
      if (!this.dimensions || !this.dimensions.size.h) {
        this.sizingTarget.style.maxWidth = '';  
        this.target.style.left = '';
      }
      this.dimensions = null;
    },

    tapHandler: function(e) {
      // closeSelector takes precedence since closeAttribute has a default non-null value.
      if (e.target &&
          (this.closeSelector && e.target.matches(this.closeSelector)) ||
          (this.closeAttribute && e.target.hasAttribute(this.closeAttribute))) {
        this.toggle();
      } else {
        if (this.autoCloseJob) {
          this.autoCloseJob.stop();
          this.autoCloseJob = null;
        }
      }
    },
    
    // We use the traditional approach of capturing events on document
    // to to determine if the overlay needs to close. However, due to 
    // ShadowDOM event retargeting, the event target is not useful. Instead
    // of using it, we attempt to close asynchronously and prevent the close
    // if a tap event is immediately heard on the target.
    // TODO(sorvell): This approach will not work with modal. For
    // this we need a scrim.
    captureHandler: function(e) {
      if (!this.autoCloseDisabled && (currentOverlay() == this)) {
        this.autoCloseJob = this.job(this.autoCloseJob, function() {
          this.close();
        });
      }
    },

    keydownHandler: function(e) {
      if (!this.autoCloseDisabled && (e.keyCode == this.keyHelper.ESCAPE_KEY)) {
        this.close();
        e.stopPropagation();
      }
    },

    /**
     * Extensions of core-overlay should implement the `resizeHandler`
     * method to adjust the size and position of the overlay when the 
     * browser window resizes.
     * @method resizeHandler
     */
    resizeHandler: function() {
      this.updateTargetDimensions();
    },

    // TODO(sorvell): these utility methods should not be here.
    addElementListenerList: function(node, events) {
      for (var i in events) {
        this.addElementListener(node, i, events[i]);
      }
    },

    removeElementListenerList: function(node, events) {
      for (var i in events) {
        this.removeElementListener(node, i, events[i]);
      }
    },

    enableElementListener: function(enable, node, event, methodName, capture) {
      if (enable) {
        this.addElementListener(node, event, methodName, capture);
      } else {
        this.removeElementListener(node, event, methodName, capture);
      }
    },

    addElementListener: function(node, event, methodName, capture) {
      var fn = this._makeBoundListener(methodName);
      if (node && fn) {
        Polymer.addEventListener(node, event, fn, capture);
      }
    },

    removeElementListener: function(node, event, methodName, capture) {
      var fn = this._makeBoundListener(methodName);
      if (node && fn) {
        Polymer.removeEventListener(node, event, fn, capture);
      }
    },

    _makeBoundListener: function(methodName) {
      var self = this, method = this[methodName];
      if (!method) {
        return;
      }
      var bound = '_bound' + methodName;
      if (!this[bound]) {
        this[bound] = function(e) {
          method.call(self, e);
        };
      }
      return this[bound];
    },
  });

  // TODO(sorvell): This should be an element with private state so it can
  // be independent of overlay.
  // track overlays for z-index and focus managemant
  var overlays = [];
  function addOverlay(overlay) {
    var z0 = currentOverlayZ();
    overlays.push(overlay);
    var z1 = currentOverlayZ();
    if (z1 <= z0) {
      applyOverlayZ(overlay, z0);
    }
  }

  function removeOverlay(overlay) {
    var i = overlays.indexOf(overlay);
    if (i >= 0) {
      overlays.splice(i, 1);
      setZ(overlay, '');
    }
  }
  
  function applyOverlayZ(overlay, aboveZ) {
    setZ(overlay.target, aboveZ + 2);
  }
  
  function setZ(element, z) {
    element.style.zIndex = z;
  }

  function currentOverlay() {
    return overlays[overlays.length-1];
  }
  
  var DEFAULT_Z = 10;
  
  function currentOverlayZ() {
    var z;
    var current = currentOverlay();
    if (current) {
      var z1 = window.getComputedStyle(current.target).zIndex;
      if (!isNaN(z1)) {
        z = Number(z1);
      }
    }
    return z || DEFAULT_Z;
  }
  
  function focusOverlay() {
    var current = currentOverlay();
    // We have to be careful to focus the next overlay _after_ any current
    // transitions are complete (due to the state being toggled prior to the
    // transition). Otherwise, we risk infinite recursion when a transitioning
    // (closed) overlay becomes the current overlay.
    //
    // NOTE: We make the assumption that any overlay that completes a transition
    // will call into focusOverlay to kick the process back off. Currently:
    // transitionend -> applyFocus -> focusOverlay.
    if (current && !current.transitioning) {
      current.applyFocus();
    }
  }

  var backdrops = [];
  function trackBackdrop(element) {
    if (element.opened) {
      backdrops.push(element);
    } else {
      var i = backdrops.indexOf(element);
      if (i >= 0) {
        backdrops.splice(i, 1);
      }
    }
  }

  function getBackdrops() {
    return backdrops;
  }
})();
;


(function() {

  function docElem(property) {
    var t;
    return ((t = document.documentElement) || (t = document.body.parentNode)) && (typeof t[property] === 'number') ? t : document.body;
  }

  // View width and height excluding any visible scrollbars
  // http://www.highdots.com/forums/javascript/faq-topic-how-do-i-296669.html
  //    1) document.client[Width|Height] always reliable when available, including Safari2
  //    2) document.documentElement.client[Width|Height] reliable in standards mode DOCTYPE, except for Safari2, Opera<9.5
  //    3) document.body.client[Width|Height] is gives correct result when #2 does not, except for Safari2
  //    4) When document.documentElement.client[Width|Height] is unreliable, it will be size of <html> element either greater or less than desired view size
  //       https://bugzilla.mozilla.org/show_bug.cgi?id=156388#c7
  //    5) When document.body.client[Width|Height] is unreliable, it will be size of <body> element less than desired view size
  function viewSize() {
    // This algorithm avoids creating test page to determine if document.documentElement.client[Width|Height] is greater then view size,
    // will succeed where such test page wouldn't detect dynamic unreliability,
    // and will only fail in the case the right or bottom edge is within the width of a scrollbar from edge of the viewport that has visible scrollbar(s).
    var doc = docElem('clientWidth');
    var body = document.body;
    var w, h;
    return typeof document.clientWidth === 'number' ?
      {w: document.clientWidth, h: document.clientHeight} :
      doc === body || (w = Math.max( doc.clientWidth, body.clientWidth )) > self.innerWidth || (h = Math.max( doc.clientHeight, body.clientHeight )) > self.innerHeight ?
        {w: body.clientWidth, h: body.clientHeight} : {w: w, h: h };
  }

  Polymer('core-dropdown',{

    publish: {

      /**
       * The element associated with this dropdown, usually the element that triggers
       * the menu. If unset, this property will default to the target's parent node
       * or shadow host.
       *
       * @attribute relatedTarget
       * @type Node
       */
      relatedTarget: null,

      /**
       * The horizontal alignment of the popup relative to `relatedTarget`. `left`
       * means the left edges are aligned together. `right` means the right edges
       * are aligned together.
       *
       * @attribute halign
       * @type 'left' | 'right'
       * @default 'left'
       */
      halign: 'left',

      /**
       * The vertical alignment of the popup relative to `relatedTarget`. `top` means
       * the top edges are aligned together. `bottom` means the bottom edges are
       * aligned together.
       *
       * @attribute valign
       * @type 'top' | 'bottom'
       * @default 'top'
       */
      valign: 'top',

    },

    measure: function() {
      var target = this.target;
      // remember position, because core-overlay may have set the property
      var pos = target.style.position;

      // get the size of the target as if it's positioned in the top left
      // corner of the screen
      target.style.position = 'fixed';
      target.style.left = '0px';
      target.style.top = '0px';

      var rect = target.getBoundingClientRect();

      target.style.position = pos;
      target.style.left = null;
      target.style.top = null;

      return rect;
    },

    resetTargetDimensions: function() {
      var dims = this.dimensions;
      var style = this.target.style;
      if (dims.position.h_by === this.localName) {
        style[dims.position.h] = null;
        dims.position.h_by = null;
      }
      if (dims.position.v_by === this.localName) {
        style[dims.position.v] = null;
        dims.position.v_by = null;
      }
      this.super();
    },

    positionTarget: function() {
      if (!this.relatedTarget) {
        this.relatedTarget = this.target.parentElement || (this.target.parentNode && this.target.parentNode.host);
        if (!this.relatedTarget) {
          this.super();
          return;
        }
      }

      // explicitly set width/height, because we don't want it constrained
      // to the offsetParent
      var target = this.sizingTarget;
      var rect = this.measure();
      target.style.width = Math.ceil(rect.width) + 'px';
      target.style.height = Math.ceil(rect.height) + 'px';

      if (this.layered) {
        this.positionLayeredTarget();
      } else {
        this.positionNestedTarget();
      }
    },

    positionLayeredTarget: function() {
      var target = this.target;
      var rect = this.relatedTarget.getBoundingClientRect();

      var dims = this.dimensions;
      var margin = dims.margin;
      var vp = viewSize();

      if (!dims.position.h) {
        if (this.halign === 'right') {
          target.style.right = vp.w - rect.right - margin.right + 'px';
          dims.position.h = 'right';
        } else {
          target.style.left = rect.left - margin.left + 'px';
          dims.position.h = 'left';
        }
        dims.position.h_by = this.localName;
      }

      if (!dims.position.v) {
        if (this.valign === 'bottom') {
          target.style.bottom = vp.h - rect.bottom - margin.bottom + 'px';
          dims.position.v = 'bottom';
        } else {
          target.style.top = rect.top - margin.top + 'px';
          dims.position.v = 'top';
        }
        dims.position.v_by = this.localName;
      }

      if (dims.position.h_by || dims.position.v_by) {
        target.style.position = 'fixed';
      }
    },

    positionNestedTarget: function() {
      var target = this.target;
      var related = this.relatedTarget;

      var t_op = target.offsetParent;
      var r_op = related.offsetParent;
      if (window.ShadowDOMPolyfill) {
        t_op = wrap(t_op);
        r_op = wrap(r_op);
      }

      if (t_op !== r_op && t_op !== related) {
        console.warn('core-dropdown-overlay: dropdown\'s offsetParent must be the relatedTarget or the relatedTarget\'s offsetParent!');
      }

      // Don't use CSS to handle halign/valign so we can use
      // dimensions.position to detect custom positioning

      var dims = this.dimensions;
      var margin = dims.margin;
      var inside = t_op === related;

      if (!dims.position.h) {
        if (this.halign === 'right') {
          target.style.right = ((inside ? 0 : t_op.offsetWidth - related.offsetLeft - related.offsetWidth) - margin.right) + 'px';
          dims.position.h = 'right';
        } else {
          target.style.left = ((inside ? 0 : related.offsetLeft) - margin.left) + 'px';
          dims.position.h = 'left';
        }
        dims.position.h_by = this.localName;
      }

      if (!dims.position.v) {
        if (this.valign === 'bottom') {
          target.style.bottom = ((inside ? 0 : t_op.offsetHeight - related.offsetTop - related.offsetHeight) - margin.bottom) + 'px';
          dims.position.v = 'bottom';
        } else {
          target.style.top = ((inside ? 0 : related.offsetTop) - margin.top) + 'px';
          dims.position.v = 'top';
        }
        dims.position.v_by = this.localName;
      }
    }

  });

})();

;

  Polymer('paper-shadow',{

    publish: {

      /**
       * The z-depth of this shadow, from 0-5. Setting this property
       * after element creation has no effect. Use `setZ()` instead.
       *
       * @attribute z
       * @type number
       * @default 1
       */
      z: 1,

      /**
       * Set this to true to animate the shadow when setting a new
       * `z` value.
       *
       * @attribute animated
       * @type boolean
       * @default false
       */
      animated: false

    },

    setZ: function(newZ) {
      if (this.z !== newZ) {
        this.$['shadow-bottom'].classList.remove('paper-shadow-bottom-z-' + this.z);
        this.$['shadow-bottom'].classList.add('paper-shadow-bottom-z-' + newZ);
        this.$['shadow-top'].classList.remove('paper-shadow-top-z-' + this.z);
        this.$['shadow-top'].classList.add('paper-shadow-top-z-' + newZ);
        this.z = newZ;
      }
    }

  });
;


  Polymer('core-transition-css', {

    /**
     * The class that will be applied to all animated nodes.
     *
     * @attribute baseClass
     * @type string
     * @default "core-transition"
     */
    baseClass: 'core-transition',

    /**
     * The class that will be applied to nodes in the opened state.
     *
     * @attribute openedClass
     * @type string
     * @default "core-opened"
     */
    openedClass: 'core-opened',

    /**
     * The class that will be applied to nodes in the closed state.
     *
     * @attribute closedClass
     * @type string
     * @default "core-closed"
     */
    closedClass: 'core-closed',

    /**
     * Event to listen to for animation completion.
     *
     * @attribute completeEventName
     * @type string
     * @default "transitionEnd"
     */
    completeEventName: 'transitionend',

    publish: {
      /**
       * A secondary configuration attribute for the animation. The class
       * `<baseClass>-<transitionType` is applied to the animated node during
       * `setup`.
       *
       * @attribute transitionType
       * @type string
       */
      transitionType: null
    },

    registerCallback: function(element) {
      this.transitionStyle = element.templateContent().firstElementChild;
    },

    // template is just for loading styles, we don't need a shadowRoot
    fetchTemplate: function() {
      return null;
    },

    go: function(node, state) {
      if (state.opened !== undefined) {
        this.transitionOpened(node, state.opened);
      }
    },

    setup: function(node) {
      if (!node._hasTransitionStyle) {
        if (!node.shadowRoot) {
          node.createShadowRoot().innerHTML = '<content></content>';
        }
        this.installScopeStyle(this.transitionStyle, 'transition',
            node.shadowRoot);
        node._hasTransitionStyle = true;
      }
      node.classList.add(this.baseClass);
      if (this.transitionType) {
        node.classList.add(this.baseClass + '-' + this.transitionType);
      }
    },

    teardown: function(node) {
      node.classList.remove(this.baseClass);
      if (this.transitionType) {
        node.classList.remove(this.baseClass + '-' + this.transitionType);
      }
    },

    transitionOpened: function(node, opened) {
      this.listenOnce(node, this.completeEventName, function() {
        if (!opened) {
          node.classList.remove(this.closedClass);
        }
        this.complete(node);
      });
      node.classList.toggle(this.openedClass, opened);
      node.classList.toggle(this.closedClass, !opened);
    }

  });
;

    Polymer('paper-dropdown-transition', {

      publish: {

        /**
         * The duration of the transition in ms. You can also set the duration by
         * setting a `duration` attribute on the target:
         *
         *    <paper-dropdown duration="1000"></paper-dropdown>
         *
         * @attribute duration
         * @type number
         * @default 500
         */
        duration: 500

      },

      setup: function(node) {
        this.super(arguments);

        var to = {
          'top': '0%',
          'left': '0%',
          'bottom': '100%',
          'right': '100%'
        };

        var bg = node.$.background;
        bg.style.webkitTransformOrigin = to[node.halign] + ' ' + to[node.valign];
        bg.style.transformOrigin = to[node.halign] + ' ' + to[node.valign];
      },

      transitionOpened: function(node, opened) {
        this.super(arguments);

        if (opened) {
          if (this.player) {
            this.player.cancel();
          }

          var duration = Number(node.getAttribute('duration')) || this.duration;

          var anims = [];

          var size = node.getBoundingClientRect();

          var ink = node.$.ripple;
          // var offset = 40 / Math.max(size.width, size.height);
          var offset = 0.2;
          anims.push(new Animation(ink, [{
            'opacity': 0.9,
            'transform': 'scale(0)',
          }, {
            'opacity': 0.9,
            'transform': 'scale(1)'
          }], {
            duration: duration * offset
          }));

          var bg = node.$.background;
          var sx = 40 / size.width;
          var sy = 40 / size.height;
          anims.push(new Animation(bg, [{
            'opacity': 0.9,
            'transform': 'scale(' + sx + ',' + sy + ')',
          }, {
            'opacity': 1,
            'transform': 'scale(' + Math.max(sx, 0.95) + ',' + Math.max(sy, 0.5) + ')'
          }, {
            'opacity': 1,
            'transform': 'scale(1, 1)'
          }], {
            delay: duration * offset,
            duration: duration * (1 - offset),
            fill: 'forwards'
          }));

          var menu = node.querySelector('.menu');
          if (menu) {
            var items = menu.items || menu.children.array();
            var itemDelay = offset + (1 - offset) / 2;
            var itemDuration = duration * (1 - itemDelay) / items.length;
            var reverse = this.valign === 'bottom';

            items.forEach(function(item, i) {
              anims.push(new Animation(item, [{
                'opacity': 0
              }, {
                'opacity': 1
              }], {
                delay: duration * itemDelay + itemDuration * (reverse ? items.length - 1 - i : i),
                duration: itemDuration,
                fill: 'both'
              }));
            }.bind(this));

            anims.push(new Animation(node.$.scroller, [{
              'opacity': 1
            }, {
              'opacity': 1
            }], {
              delay: duration * itemDelay,
              duration: itemDuration * items.length,
              fill: 'both'
            }));

          } else {
            anims.push(new Animation(node.$.scroller, [{
              'opacity': 0
            }, {
              'opacity': 1
            }], {
              delay: duration * (offset + (1 - offset) / 2),
              duration: duration * 0.5,
              fill: 'both'
            }));
          }

          var group = new AnimationGroup(anims, {
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
          });
          this.player = document.timeline.play(group);
          this.player.onfinish = function() {
            this.fire('core-transitionend', this, node);
          }.bind(this);

        } else {
          this.fire('core-transitionend', this, node);
        }
      },

    });
  ;


  Polymer('paper-dropdown',{

    publish: {
      transition: 'paper-dropdown-transition'
    },

    ready: function() {
      this.super();
      this.sizingTarget = this.$.scroller;
    }

  });

;


  Polymer('core-collapse', {

    /**
     * Fired when the `core-collapse`'s `opened` property changes.
     * 
     * @event core-collapse-open
     */

    /**
     * Fired when the target element has been resized as a result of the opened
     * state changing.
     * 
     * @event core-resize
     */

    /**
     * The target element that will be opened when the `core-collapse` is 
     * opened. If unspecified, the `core-collapse` itself is the target.
     *
     * @attribute target
     * @type object
     * @default null
     */
    target: null,

    /**
     * If true, the orientation is horizontal; otherwise is vertical.
     *
     * @attribute horizontal
     * @type boolean
     * @default false
     */
    horizontal: false,

    /**
     * Set opened to true to show the collapse element and to false to hide it.
     *
     * @attribute opened
     * @type boolean
     * @default false
     */
    opened: false,

    /**
     * Collapsing/expanding animation duration in second.
     *
     * @attribute duration
     * @type number
     * @default 0.33
     */
    duration: 0.33,

    /**
     * If true, the size of the target element is fixed and is set
     * on the element.  Otherwise it will try to 
     * use auto to determine the natural size to use
     * for collapsing/expanding.
     *
     * @attribute fixedSize
     * @type boolean
     * @default false
     */
    fixedSize: false,
    
    /**
     * By default the collapsible element is set to overflow hidden. This helps
     * avoid element bleeding outside the region and provides consistent overflow
     * style across opened and closed states. Set this property to true to allow 
     * the collapsible element to overflow when it's opened.
     *
     * @attribute allowOverflow
     * @type boolean
     * @default false
     */
    allowOverflow: false,

    created: function() {
      this.transitionEndListener = this.transitionEnd.bind(this);
    },
    
    ready: function() {
      this.target = this.target || this;
    },

    domReady: function() {
      this.async(function() {
        this.afterInitialUpdate = true;
      });
    },

    detached: function() {
      if (this.target) {
        this.removeListeners(this.target);
      }
    },

    targetChanged: function(old) {
      if (old) {
        this.removeListeners(old);
      }
      if (!this.target) {
        return;
      }
      this.isTargetReady = !!this.target;
      this.classList.toggle('core-collapse-closed', this.target !== this);
      this.toggleOpenedStyle(false);
      this.horizontalChanged();
      this.addListeners(this.target);
      // set core-collapse-closed class initially to hide the target
      this.toggleClosedClass(true);
      this.update();
    },

    addListeners: function(node) {
      node.addEventListener('transitionend', this.transitionEndListener);
    },

    removeListeners: function(node) {
      node.removeEventListener('transitionend', this.transitionEndListener);
    },

    horizontalChanged: function() {
      this.dimension = this.horizontal ? 'width' : 'height';
    },

    openedChanged: function() {
      this.update();
      this.fire('core-collapse-open', this.opened);
    },

    /**
     * Toggle the opened state.
     *
     * @method toggle
     */
    toggle: function() {
      this.opened = !this.opened;
    },

    setTransitionDuration: function(duration) {
      var s = this.target.style;
      s.transition = duration ? (this.dimension + ' ' + duration + 's') : null;
      if (duration === 0) {
        this.async('transitionEnd');
      }
    },

    transitionEnd: function() {
      if (this.opened && !this.fixedSize) {
        this.updateSize('auto', null);
      }
      this.setTransitionDuration(null);
      this.toggleOpenedStyle(this.opened);
      this.toggleClosedClass(!this.opened);
      this.asyncFire('core-resize', null, this.target);
    },

    toggleClosedClass: function(closed) {
      this.hasClosedClass = closed;
      this.target.classList.toggle('core-collapse-closed', closed);
    },
    
    toggleOpenedStyle: function(opened) {
      this.target.style.overflow = this.allowOverflow && opened ? '' : 'hidden';
    },

    updateSize: function(size, duration, forceEnd) {
      this.setTransitionDuration(duration);
      this.calcSize();
      var s = this.target.style;
      var nochange = s[this.dimension] === size;
      s[this.dimension] = size;
      // transitonEnd will not be called if the size has not changed
      if (forceEnd && nochange) {
        this.transitionEnd();
      }
    },

    update: function() {
      if (!this.target) {
        return;
      }
      if (!this.isTargetReady) {
        this.targetChanged(); 
      }
      this.horizontalChanged();
      this[this.opened ? 'show' : 'hide']();
    },

    calcSize: function() {
      return this.target.getBoundingClientRect()[this.dimension] + 'px';
    },

    getComputedSize: function() {
      return getComputedStyle(this.target)[this.dimension];
    },

    show: function() {
      this.toggleClosedClass(false);
      // for initial update, skip the expanding animation to optimize
      // performance e.g. skip calcSize
      if (!this.afterInitialUpdate) {
        this.transitionEnd();
        return;
      }
      if (!this.fixedSize) {
        this.updateSize('auto', null);
        var s = this.calcSize();
        if (s == '0px') {
          this.transitionEnd();
          return;
        }
        this.updateSize(0, null);
      }
      this.async(function() {
        this.updateSize(this.size || s, this.duration, true);
      });
    },

    hide: function() {
      this.toggleOpenedStyle(false);
      // don't need to do anything if it's already hidden
      if (this.hasClosedClass && !this.fixedSize) {
        return;
      }
      if (this.fixedSize) {
        // save the size before hiding it
        this.size = this.getComputedSize();
      } else {
        this.updateSize(this.calcSize(), null);
      }
      this.async(function() {
        this.updateSize(0, this.duration);
      });
    }

  });

;

    Polymer('paper-item',{

      publish: {

        /**
         * If true, the button will be styled with a shadow.
         *
         * @attribute raised
         * @type boolean
         * @default false
         */
        raised: false,

        /**
         * By default the ripple emanates from where the user touched the button.
         * Set this to true to always center the ripple.
         *
         * @attribute recenteringTouch
         * @type boolean
         * @default false
         */
        recenteringTouch: false,

        /**
         * By default the ripple expands to fill the button. Set this to false to
         * constrain the ripple to a circle within the button.
         *
         * @attribute fill
         * @type boolean
         * @default true
         */
        fill: true

      }

    });
  ;


  Polymer('core-input', {

    publish: {

      /**
       * The "committed" value of the input, ie. the input value when the user
       * hits the "enter" key or blurs the input after changing the value. You
       * can bind to this value instead of listening for the "change" event.
       * Setting this property has no effect on the input value.
       *
       * @attribute committedValue
       * @type string
       * @default ''
       */
      committedValue: '',

      /**
       * Set to true to prevent invalid input from being entered.
       *
       * @attribute preventInvalidInput
       * @type boolean
       * @default false
       */
      preventInvalidInput: false

    },

    previousValidInput: '',

    eventDelegates: {
      input: 'inputAction',
      change: 'changeAction'
    },

    ready: function() {
      /* set ARIA attributes */
      this.disabledHandler();
      this.placeholderHandler();
    },

    attributeChanged: function(attr, old) {
      if (this[attr + 'Handler']) {
        this[attr + 'Handler'](old);
      }
    },

    disabledHandler: function() {
      if (this.disabled) {
        this.setAttribute('aria-disabled', '');
      } else {
        this.removeAttribute('aria-disabled');
      }
    },

    placeholderHandler: function() {
      if (this.placeholder) {
        this.setAttribute('aria-label', this.placeholder);
      } else {
        this.removeAttribute('aria-label');
      }
    },

    /**
     * Commits the `value` to `committedValue`
     *
     * @method commit
     */
    commit: function() {
      this.committedValue = this.value;
    },

    changeAction: function() {
      this.commit();
    },

    inputAction: function(e) {
      if (this.preventInvalidInput) {
        if (!e.target.validity.valid) {
          e.target.value = this.previousValidInput;
        } else {
          this.previousValidInput = e.target.value;
        }
      }
    }

  });

;

(function() {

window.CoreStyle = window.CoreStyle || {
  g: {},
  list: {},
  refMap: {}
};

Polymer('core-style', {
  /**
   * The `id` property should be set if the `core-style` is a producer
   * of styles. In this case, the `core-style` should have text content
   * that is cssText.
   *
   * @attribute id
   * @type string
   * @default ''
   */


  publish: {
    /**
     * The `ref` property should be set if the `core-style` element is a 
     * consumer of styles. Set it to the `id` of the desired `core-style`
     * element.
     *
     * @attribute ref
     * @type string
     * @default ''
     */
    ref: ''
  },

  // static
  g: CoreStyle.g,
  refMap: CoreStyle.refMap,

  /**
   * The `list` is a map of all `core-style` producers stored by `id`. It 
   * should be considered readonly. It's useful for nesting one `core-style`
   * inside another.
   *
   * @attribute list
   * @type object (readonly)
   * @default {map of all `core-style` producers}
   */
  list: CoreStyle.list,

  // if we have an id, we provide style
  // if we have a ref, we consume/require style
  ready: function() {
    if (this.id) {
      this.provide();
    } else {
      this.registerRef(this.ref);
      if (!window.ShadowDOMPolyfill) {
        this.require();
      }  
    }
  },

  // can't shim until attached if using SD polyfill because need to find host
  attached: function() {
    if (!this.id && window.ShadowDOMPolyfill) {
      this.require();
    }
  },

  /****** producer stuff *******/

  provide: function() {
    this.register();
    // we want to do this asap, especially so we can do so before definitions
    // that use this core-style are registered.
    if (this.textContent) {
      this._completeProvide();
    } else {
      this.async(this._completeProvide);
    }
  },

  register: function() {
    var i = this.list[this.id];
    if (i) {
      if (!Array.isArray(i)) {
        this.list[this.id] = [i];
      }
      this.list[this.id].push(this);
    } else {
      this.list[this.id] = this;  
    }
  },

  // stamp into a shadowRoot so we can monitor dom of the bound output
  _completeProvide: function() {
    this.createShadowRoot();
    this.domObserver = new MutationObserver(this.domModified.bind(this))
        .observe(this.shadowRoot, {subtree: true, 
        characterData: true, childList: true});
    this.provideContent();
  },

  provideContent: function() {
    this.ensureTemplate();
    this.shadowRoot.textContent = '';
    this.shadowRoot.appendChild(this.instanceTemplate(this.template));
    this.cssText = this.shadowRoot.textContent;
  },

  ensureTemplate: function() {
    if (!this.template) {
      this.template = this.querySelector('template:not([repeat]):not([bind])');
      // move content into the template
      if (!this.template) {
        this.template = document.createElement('template');
        var n = this.firstChild;
        while (n) {
          this.template.content.appendChild(n.cloneNode(true));
          n = n.nextSibling;
        }
      }
    }
  },

  domModified: function() {
    this.cssText = this.shadowRoot.textContent;
    this.notify();
  },

  // notify instances that reference this element
  notify: function() {
    var s$ = this.refMap[this.id];
    if (s$) {
      for (var i=0, s; (s=s$[i]); i++) {
        s.require();
      }
    }
  },

  /****** consumer stuff *******/

  registerRef: function(ref) {
    //console.log('register', ref);
    this.refMap[this.ref] = this.refMap[this.ref] || [];
    this.refMap[this.ref].push(this);
  },

  applyRef: function(ref) {
    this.ref = ref;
    this.registerRef(this.ref);
    this.require();
  },

  require: function() {
    var cssText = this.cssTextForRef(this.ref);
    //console.log('require', this.ref, cssText);
    if (cssText) {
      this.ensureStyleElement();
      // do nothing if cssText has not changed
      if (this.styleElement._cssText === cssText) {
        return;
      }
      this.styleElement._cssText = cssText;
      if (window.ShadowDOMPolyfill) {
        this.styleElement.textContent = cssText;
        cssText = WebComponents.ShadowCSS.shimStyle(this.styleElement,
            this.getScopeSelector());
      }
      this.styleElement.textContent = cssText;
    }
  },

  cssTextForRef: function(ref) {
    var s$ = this.byId(ref);
    var cssText = '';
    if (s$) {
      if (Array.isArray(s$)) {
        var p = [];
        for (var i=0, l=s$.length, s; (i<l) && (s=s$[i]); i++) {
          p.push(s.cssText);
        }
        cssText = p.join('\n\n');
      } else {
        cssText = s$.cssText;
      }
    }
    if (s$ && !cssText) {
      console.warn('No styles provided for ref:', ref);
    }
    return cssText;
  },

  byId: function(id) {
    return this.list[id];
  },

  ensureStyleElement: function() {
    if (!this.styleElement) {
      this.styleElement = window.ShadowDOMPolyfill ? 
          this.makeShimStyle() :
          this.makeRootStyle();
    }
    if (!this.styleElement) {
      console.warn(this.localName, 'could not setup style.');
    }
  },

  makeRootStyle: function() {
    var style = document.createElement('style');
    this.appendChild(style);
    return style;
  },

  makeShimStyle: function() {
    var host = this.findHost(this);
    if (host) {
      var name = host.localName;
      var style = document.querySelector('style[' + name + '=' + this.ref +']');
      if (!style) {
        style = document.createElement('style');
        style.setAttribute(name, this.ref);
        document.head.appendChild(style);
      }
      return style;
    }
  },

  getScopeSelector: function() {
    if (!this._scopeSelector) {
      var selector = '', host = this.findHost(this);
      if (host) {
        var typeExtension = host.hasAttribute('is');
        var name = typeExtension ? host.getAttribute('is') : host.localName;
        selector = WebComponents.ShadowCSS.makeScopeSelector(name, 
            typeExtension);
      }
      this._scopeSelector = selector;
    }
    return this._scopeSelector;
  },

  findHost: function(node) {
    while (node.parentNode) {
      node = node.parentNode;
    }
    return node.host || wrap(document.documentElement);
  },

  /* filters! */
  // TODO(dfreedm): add more filters!

  cycle: function(rgb, amount) {
    if (rgb.match('#')) {
      var o = this.hexToRgb(rgb);
      if (!o) {
        return rgb;
      }
      rgb = 'rgb(' + o.r + ',' + o.b + ',' + o.g + ')';
    }

    function cycleChannel(v) {
      return Math.abs((Number(v) - amount) % 255);
    }

    return rgb.replace(/rgb\(([^,]*),([^,]*),([^,]*)\)/, function(m, a, b, c) {
      return 'rgb(' + cycleChannel(a) + ',' + cycleChannel(b) + ', ' 
          + cycleChannel(c) + ')';
    });
  },

  hexToRgb: function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

});


})();
;


  (function() {

    var paperInput = CoreStyle.g.paperInput = CoreStyle.g.paperInput || {};

    paperInput.labelColor = '#757575';
    paperInput.cursorColor = '#4059a9';
    paperInput.focusedColor = '#4059a9';
    paperInput.invalidColor = '#d34336';

    Polymer('paper-input-decorator',{

      publish: {

        /**
         * The label for this input. It normally appears as grey text inside
         * the text input and disappears once the user enters text.
         *
         * @attribute label
         * @type string
         * @default ''
         */
        label: '',

        /**
         * If true, the label will "float" above the text input once the
         * user enters text instead of disappearing.
         *
         * @attribute floatingLabel
         * @type boolean
         * @default false
         */
        floatingLabel: false,

        /**
         * Set to true to style the element as disabled.
         *
         * @attribute disabled
         * @type boolean
         * @default false
         */
        disabled: {value: false, reflect: true},

        /**
         * Use this property to override the automatic label visibility.
         * If this property is set to `true` or `false`, the label visibility
         * will respect this value instead of be based on whether there is
         * a non-null value in the input.
         *
         * @attribute labelVisible
         * @type boolean
         * @default false
         */
        labelVisible: null,

        /**
         * Set this property to true to show the error message.
         *
         * @attribute isInvalid
         * @type boolean
         * @default false
         */
        isInvalid: false,

        /**
         * The message to display if the input value fails validation. If this
         * is unset or the empty string, a default message is displayed depending
         * on the type of validation error.
         *
         * @attribute error
         * @type string
         */
        error: '',

        focused: {value: false, reflect: true}

      },

      computed: {
        floatingLabelVisible: 'floatingLabel && !_labelVisible',
        _labelVisible: '(labelVisible === true || labelVisible === false) ? labelVisible : _autoLabelVisible'
      },

      ready: function() {
        // Delegate focus/blur events
        Polymer.addEventListener(this, 'focus', this.focusAction.bind(this), true);
        Polymer.addEventListener(this, 'blur', this.blurAction.bind(this), true);
      },

      attached: function() {
        this.input = this.querySelector('input,textarea');

        this.mo = new MutationObserver(function() {
          this.input = this.querySelector('input,textarea');
        }.bind(this));
        this.mo.observe(this, {childList: true});
      },

      detached: function() {
        this.mo.disconnect();
        this.mo = null;
      },

      prepareLabelTransform: function() {
        var toRect = this.$.floatedLabelText.getBoundingClientRect();
        var fromRect = this.$.labelText.getBoundingClientRect();
        if (toRect.width !== 0) {
          var sy = toRect.height / fromRect.height;
          this.$.labelText.cachedTransform =
            'scale3d(' + (toRect.width / fromRect.width) + ',' + sy + ',1) ' +
            'translate3d(0,' + (toRect.top - fromRect.top) / sy + 'px,0)';
        }
      },

      animateFloatingLabel: function() {
        if (!this.floatingLabel || this.labelAnimated) {
          return;
        }

        if (!this.$.labelText.cachedTransform) {
          this.prepareLabelTransform();
        }

        // If there's still no cached transform, the input is invisible so don't
        // do the animation.
        if (!this.$.labelText.cachedTransform) {
          return;
        }

        this.labelAnimated = true;
        // Handle interrupted animation
        this.async(function() {
          this.transitionEndAction();
        }, null, 250);

        if (this._labelVisible) {
          // Handle if the label started out floating
          if (!this.$.labelText.style.webkitTransform && !this.$.labelText.style.transform) {
            this.$.labelText.style.webkitTransform = this.$.labelText.cachedTransform;
            this.$.labelText.style.transform = this.$.labelText.cachedTransform;
            this.$.labelText.offsetTop;
          }
          this.$.labelText.style.webkitTransform = '';
          this.$.labelText.style.transform = '';
        } else {
          this.$.labelText.style.webkitTransform = this.$.labelText.cachedTransform;
          this.$.labelText.style.transform = this.$.labelText.cachedTransform;
          this.input.placeholder = '';
        }

      },

      _labelVisibleChanged: function(old) {
        // do not do the animation on first render
        if (old !== undefined) {
          this.animateFloatingLabel();
        }
      },

      labelChanged: function() {
        if (this.input) {
          this.updateInputLabel(this.input, this.label);
        }
      },

      isInvalidChanged: function() {
        this.classList.toggle('invalid', this.isInvalid);
      },

      focusedChanged: function() {
        this.updateLabelVisibility(this.input && this.input.value);
      },

      inputChanged: function(old) {
        if (this.input) {
          this.updateLabelVisibility(this.input.value);
          this.updateInputLabel(this.input, this.label);
        }
        if (old) {
          this.updateInputLabel(old, '');
        }
      },

      focusAction: function() {
        this.focused = true;
      },

      blurAction: function(e) {
        this.focused = false;
      },

      /**
       * Updates the label visibility based on a value. This is handled automatically
       * if the user is typing, but if you imperatively set the input value you need
       * to call this function.
       *
       * @method updateLabelVisibility
       * @param {string} value
       */
      updateLabelVisibility: function(value) {
        var v = (value !== null && value !== undefined) ? String(value) : value;
        this._autoLabelVisible = (!this.focused && !v) || (!this.floatingLabel && !v);
      },

      updateInputLabel: function(input, label) {
        if (this._labelVisible) {
          this.input.placeholder = this.label;
        } else {
          this.input.placeholder = '';
        }
        if (label) {
          input.setAttribute('aria-label', label);
        } else {
          input.removeAttribute('aria-label');
        }
      },

      inputAction: function(e) {
        this.updateLabelVisibility(e.target.value);
      },

      downAction: function(e) {
        if (this.disabled) {
          return;
        }

        if (this.focused) {
          return;
        }

        if (this.input) {
          this.input.focus();
          e.preventDefault();
        }

        // The underline spills from the tap location
        var rect = this.$.underline.getBoundingClientRect();
        var right = e.x - rect.left;
        this.$.focusedUnderline.style.mozTransformOrigin = right + 'px';
        this.$.focusedUnderline.style.webkitTransformOrigin = right + 'px ';
        this.$.focusedUnderline.style.transformOriginX = right + 'px';

        // Animations only run when the user interacts with the input
        this.underlineAnimated = true;

        // Cursor animation only runs if the input is empty
        if (this._labelVisible) {
          this.cursorAnimated = true;
        }
        // Handle interrupted animation
        this.async(function() {
          this.transitionEndAction();
        }, null, 250);
      },

      transitionEndAction: function() {
        this.underlineAnimated = false;
        this.cursorAnimated = false;
        this.labelAnimated = false;
        if (this._labelVisible) {
          this.input.placeholder = this.label;
        }
      }

    });

  }());

  ;


  Polymer('paper-input', {

    publish: {
      /**
       * The label for this input. It normally appears as grey text inside
       * the text input and disappears once the user enters text.
       *
       * @attribute label
       * @type string
       * @default ''
       */
      label: '',

      /**
       * If true, the label will "float" above the text input once the
       * user enters text instead of disappearing.
       *
       * @attribute floatingLabel
       * @type boolean
       * @default false
       */
      floatingLabel: false,

      /**
       * Set to true to style the element as disabled.
       *
       * @attribute disabled
       * @type boolean
       * @default false
       */
      disabled: {value: false, reflect: true},

      value: '',

      committedValue: ''

    },

    valueChanged: function() {
      this.$.decorator.updateLabelVisibility(this.value);
    },

    changeAction: function(e) {
      if (!window.ShadowDOMPolyfill) {
        // re-fire event that does not bubble across shadow roots
        this.fire('change', null, this);
      }
    }

  });

;


(function() {

  Polymer('core-toolbar', {
    
    /**
     * Controls how the items are aligned horizontally.
     * Options are `start`, `center`, `end`, `between` and `around`.
     *
     * @attribute justify
     * @type string
     * @default ''
     */
    justify: '',
    
    /**
     * Controls how the items are aligned horizontally when they are placed
     * in the middle.
     * Options are `start`, `center`, `end`, `between` and `around`.
     *
     * @attribute middleJustify
     * @type string
     * @default ''
     */
    middleJustify: '',
    
    /**
     * Controls how the items are aligned horizontally when they are placed
     * at the bottom.
     * Options are `start`, `center`, `end`, `between` and `around`.
     *
     * @attribute bottomJustify
     * @type string
     * @default ''
     */
    bottomJustify: '',
    
    justifyChanged: function(old) {
      this.updateBarJustify(this.$.topBar, this.justify, old);
    },
    
    middleJustifyChanged: function(old) {
      this.updateBarJustify(this.$.middleBar, this.middleJustify, old);
    },
    
    bottomJustifyChanged: function(old) {
      this.updateBarJustify(this.$.bottomBar, this.bottomJustify, old);
    },
    
    updateBarJustify: function(bar, justify, old) {
      if (old) {
        bar.removeAttribute(this.toLayoutAttrName(old));
      }
      if (this.justify) {
        bar.setAttribute(this.toLayoutAttrName(justify), '');
      }
    },
    
    toLayoutAttrName: function(value) {
      return value === 'between' ? 'justified' : value + '-justified';
    }
    
  });

})();

;

    Polymer('core-media-query', {

      /**
       * The Boolean return value of the media query
       *
       * @attribute queryMatches
       * @type Boolean
       * @default false
       */
      queryMatches: false,

      /**
       * The CSS media query to evaulate
       *
       * @attribute query
       * @type string
       * @default ''
       */
      query: '',
      ready: function() {
        this._mqHandler = this.queryHandler.bind(this);
        this._mq = null;
      },
      queryChanged: function() {
        if (this._mq) {
          this._mq.removeListener(this._mqHandler);
        }
        var query = this.query;
        if (query[0] !== '(') {
          query = '(' + this.query + ')';
        }
        this._mq = window.matchMedia(query);
        this._mq.addListener(this._mqHandler);
        this.queryHandler(this._mq);
      },
      queryHandler: function(mq) {
        this.queryMatches = mq.matches;
        this.asyncFire('core-media-change', mq);
      }
    });
  ;

    Polymer('core-selection', {
      /**
       * If true, multiple selections are allowed.
       *
       * @attribute multi
       * @type boolean
       * @default false
       */
      multi: false,
      ready: function() {
        this.clear();
      },
      clear: function() {
        this.selection = [];
      },
      /**
       * Retrieves the selected item(s).
       * @method getSelection
       * @returns Returns the selected item(s). If the multi property is true,
       * getSelection will return an array, otherwise it will return 
       * the selected item or undefined if there is no selection.
      */
      getSelection: function() {
        return this.multi ? this.selection : this.selection[0];
      },
      /**
       * Indicates if a given item is selected.
       * @method isSelected
       * @param {any} item The item whose selection state should be checked.
       * @returns Returns true if `item` is selected.
      */
      isSelected: function(item) {
        return this.selection.indexOf(item) >= 0;
      },
      setItemSelected: function(item, isSelected) {
        if (item !== undefined && item !== null) {
          if (isSelected) {
            this.selection.push(item);
          } else {
            var i = this.selection.indexOf(item);
            if (i >= 0) {
              this.selection.splice(i, 1);
            }
          }
          this.fire("core-select", {isSelected: isSelected, item: item});
        }
      },
      /**
       * Set the selection state for a given `item`. If the multi property
       * is true, then the selected state of `item` will be toggled; otherwise
       * the `item` will be selected.
       * @method select
       * @param {any} item: The item to select.
      */
      select: function(item) {
        if (this.multi) {
          this.toggle(item);
        } else if (this.getSelection() !== item) {
          this.setItemSelected(this.getSelection(), false);
          this.setItemSelected(item, true);
        }
      },
      /**
       * Toggles the selection state for `item`.
       * @method toggle
       * @param {any} item: The item to toggle.
      */
      toggle: function(item) {
        this.setItemSelected(item, !this.isSelected(item));
      }
    });
  ;


    Polymer('core-selector', {

      /**
       * Gets or sets the selected element.  Default to use the index
       * of the item element.
       *
       * If you want a specific attribute value of the element to be
       * used instead of index, set "valueattr" to that attribute name.
       *
       * Example:
       *
       *     <core-selector valueattr="label" selected="foo">
       *       <div label="foo"></div>
       *       <div label="bar"></div>
       *       <div label="zot"></div>
       *     </core-selector>
       *
       * In multi-selection this should be an array of values.
       *
       * Example:
       *
       *     <core-selector id="selector" valueattr="label" multi>
       *       <div label="foo"></div>
       *       <div label="bar"></div>
       *       <div label="zot"></div>
       *     </core-selector>
       *
       *     this.$.selector.selected = ['foo', 'zot'];
       *
       * @attribute selected
       * @type Object
       * @default null
       */
      selected: null,

      /**
       * If true, multiple selections are allowed.
       *
       * @attribute multi
       * @type boolean
       * @default false
       */
      multi: false,

      /**
       * Specifies the attribute to be used for "selected" attribute.
       *
       * @attribute valueattr
       * @type string
       * @default 'name'
       */
      valueattr: 'name',

      /**
       * Specifies the CSS class to be used to add to the selected element.
       * 
       * @attribute selectedClass
       * @type string
       * @default 'core-selected'
       */
      selectedClass: 'core-selected',

      /**
       * Specifies the property to be used to set on the selected element
       * to indicate its active state.
       *
       * @attribute selectedProperty
       * @type string
       * @default ''
       */
      selectedProperty: '',

      /**
       * Specifies the attribute to set on the selected element to indicate
       * its active state.
       *
       * @attribute selectedAttribute
       * @type string
       * @default 'active'
       */
      selectedAttribute: 'active',

      /**
       * Returns the currently selected element. In multi-selection this returns
       * an array of selected elements.
       * Note that you should not use this to set the selection. Instead use
       * `selected`.
       * 
       * @attribute selectedItem
       * @type Object
       * @default null
       */
      selectedItem: null,

      /**
       * In single selection, this returns the model associated with the
       * selected element.
       * Note that you should not use this to set the selection. Instead use 
       * `selected`.
       * 
       * @attribute selectedModel
       * @type Object
       * @default null
       */
      selectedModel: null,

      /**
       * In single selection, this returns the selected index.
       * Note that you should not use this to set the selection. Instead use
       * `selected`.
       *
       * @attribute selectedIndex
       * @type number
       * @default -1
       */
      selectedIndex: -1,

      /**
       * Nodes with local name that are in the list will not be included 
       * in the selection items.  In the following example, `items` returns four
       * `core-item`'s and doesn't include `h3` and `hr`.
       *
       *     <core-selector excludedLocalNames="h3 hr">
       *       <h3>Header</h3>
       *       <core-item>Item1</core-item>
       *       <core-item>Item2</core-item>
       *       <hr>
       *       <core-item>Item3</core-item>
       *       <core-item>Item4</core-item>
       *     </core-selector>
       *
       * @attribute excludedLocalNames
       * @type string
       * @default ''
       */
      excludedLocalNames: '',

      /**
       * The target element that contains items.  If this is not set 
       * core-selector is the container.
       * 
       * @attribute target
       * @type Object
       * @default null
       */
      target: null,

      /**
       * This can be used to query nodes from the target node to be used for 
       * selection items.  Note this only works if `target` is set
       * and is not `core-selector` itself.
       *
       * Example:
       *
       *     <core-selector target="{{$.myForm}}" itemsSelector="input[type=radio]"></core-selector>
       *     <form id="myForm">
       *       <label><input type="radio" name="color" value="red"> Red</label> <br>
       *       <label><input type="radio" name="color" value="green"> Green</label> <br>
       *       <label><input type="radio" name="color" value="blue"> Blue</label> <br>
       *       <p>color = {{color}}</p>
       *     </form>
       * 
       * @attribute itemsSelector
       * @type string
       * @default ''
       */
      itemsSelector: '',

      /**
       * The event that would be fired from the item element to indicate
       * it is being selected.
       *
       * @attribute activateEvent
       * @type string
       * @default 'tap'
       */
      activateEvent: 'tap',

      /**
       * Set this to true to disallow changing the selection via the
       * `activateEvent`.
       *
       * @attribute notap
       * @type boolean
       * @default false
       */
      notap: false,

      defaultExcludedLocalNames: 'template',
      
      observe: {
        'selected multi': 'selectedChanged'
      },

      ready: function() {
        this.activateListener = this.activateHandler.bind(this);
        this.itemFilter = this.filterItem.bind(this);
        this.excludedLocalNamesChanged();
        this.observer = new MutationObserver(this.updateSelected.bind(this));
        if (!this.target) {
          this.target = this;
        }
      },

      /**
       * Returns an array of all items.
       *
       * @property items
       */
      get items() {
        if (!this.target) {
          return [];
        }
        var nodes = this.target !== this ? (this.itemsSelector ? 
            this.target.querySelectorAll(this.itemsSelector) : 
                this.target.children) : this.$.items.getDistributedNodes();
        return Array.prototype.filter.call(nodes, this.itemFilter);
      },

      filterItem: function(node) {
        return !this._excludedNames[node.localName];
      },

      excludedLocalNamesChanged: function() {
        this._excludedNames = {};
        var s = this.defaultExcludedLocalNames;
        if (this.excludedLocalNames) {
          s += ' ' + this.excludedLocalNames;
        }
        s.split(/\s+/g).forEach(function(n) {
          this._excludedNames[n] = 1;
        }, this);
      },

      targetChanged: function(old) {
        if (old) {
          this.removeListener(old);
          this.observer.disconnect();
          this.clearSelection();
        }
        if (this.target) {
          this.addListener(this.target);
          this.observer.observe(this.target, {childList: true});
          this.updateSelected();
        }
      },

      addListener: function(node) {
        Polymer.addEventListener(node, this.activateEvent, this.activateListener);
      },

      removeListener: function(node) {
        Polymer.removeEventListener(node, this.activateEvent, this.activateListener);
      },

      /**
       * Returns the selected item(s). If the `multi` property is true,
       * this will return an array, otherwise it will return 
       * the selected item or undefined if there is no selection.
       */
      get selection() {
        return this.$.selection.getSelection();
      },

      selectedChanged: function() {
        // TODO(ffu): Right now this is the only way to know that the `selected`
        // is an array and was mutated, as opposed to newly assigned.
        if (arguments.length === 1) {
          this.processSplices(arguments[0]);
        } else {
          this.updateSelected();
        }
      },
      
      updateSelected: function() {
        this.validateSelected();
        if (this.multi) {
          this.clearSelection(this.selected)
          this.selected && this.selected.forEach(function(s) {
            this.setValueSelected(s, true)
          }, this);
        } else {
          this.valueToSelection(this.selected);
        }
      },

      validateSelected: function() {
        // convert to an array for multi-selection
        if (this.multi && !Array.isArray(this.selected) && 
            this.selected != null) {
          this.selected = [this.selected];
        // use the first selected in the array for single-selection
        } else if (!this.multi && Array.isArray(this.selected)) {
          var s = this.selected[0];
          this.clearSelection([s]);
          this.selected = s;
        }
      },
      
      processSplices: function(splices) {
        for (var i = 0, splice; splice = splices[i]; i++) {
          for (var j = 0; j < splice.removed.length; j++) {
            this.setValueSelected(splice.removed[j], false);
          }
          for (var j = 0; j < splice.addedCount; j++) {
            this.setValueSelected(this.selected[splice.index + j], true);
          }
        }
      },

      clearSelection: function(excludes) {
        this.$.selection.selection.slice().forEach(function(item) {
          var v = this.valueForNode(item) || this.items.indexOf(item);
          if (!excludes || excludes.indexOf(v) < 0) {
            this.$.selection.setItemSelected(item, false);
          }
        }, this);
      },

      valueToSelection: function(value) {
        var item = this.valueToItem(value);
        this.$.selection.select(item);
      },
      
      setValueSelected: function(value, isSelected) {
        var item = this.valueToItem(value);
        if (isSelected ^ this.$.selection.isSelected(item)) {
          this.$.selection.setItemSelected(item, isSelected);
        }
      },

      updateSelectedItem: function() {
        this.selectedItem = this.selection;
      },

      selectedItemChanged: function() {
        if (this.selectedItem) {
          var t = this.selectedItem.templateInstance;
          this.selectedModel = t ? t.model : undefined;
        } else {
          this.selectedModel = null;
        }
        this.selectedIndex = this.selectedItem ? 
            parseInt(this.valueToIndex(this.selected)) : -1;
      },
      
      valueToItem: function(value) {
        return (value === null || value === undefined) ? 
            null : this.items[this.valueToIndex(value)];
      },

      valueToIndex: function(value) {
        // find an item with value == value and return it's index
        for (var i=0, items=this.items, c; (c=items[i]); i++) {
          if (this.valueForNode(c) == value) {
            return i;
          }
        }
        // if no item found, the value itself is probably the index
        return value;
      },

      valueForNode: function(node) {
        return node[this.valueattr] || node.getAttribute(this.valueattr);
      },

      // events fired from <core-selection> object
      selectionSelect: function(e, detail) {
        this.updateSelectedItem();
        if (detail.item) {
          this.applySelection(detail.item, detail.isSelected);
        }
      },

      applySelection: function(item, isSelected) {
        if (this.selectedClass) {
          item.classList.toggle(this.selectedClass, isSelected);
        }
        if (this.selectedProperty) {
          item[this.selectedProperty] = isSelected;
        }
        if (this.selectedAttribute && item.setAttribute) {
          if (isSelected) {
            item.setAttribute(this.selectedAttribute, '');
          } else {
            item.removeAttribute(this.selectedAttribute);
          }
        }
      },

      // event fired from host
      activateHandler: function(e) {
        if (!this.notap) {
          var i = this.findDistributedTarget(e.target, this.items);
          if (i >= 0) {
            var item = this.items[i];
            var s = this.valueForNode(item) || i;
            if (this.multi) {
              if (this.selected) {
                this.addRemoveSelected(s);
              } else {
                this.selected = [s];
              }
            } else {
              this.selected = s;
            }
            this.asyncFire('core-activate', {item: item});
          }
        }
      },

      addRemoveSelected: function(value) {
        var i = this.selected.indexOf(value);
        if (i >= 0) {
          this.selected.splice(i, 1);
        } else {
          this.selected.push(value);
        }
      },

      findDistributedTarget: function(target, nodes) {
        // find first ancestor of target (including itself) that
        // is in nodes, if any
        while (target && target != this) {
          var i = Array.prototype.indexOf.call(nodes, target);
          if (i >= 0) {
            return i;
          }
          target = target.parentNode;
        }
      },
      
      selectIndex: function(index) {
        var item = this.items[index];
        if (item) {
          this.selected = this.valueForNode(item) || index;
          return item;
        }
      },
      
      /**
       * Selects the previous item. This should be used in single selection only.
       *
       * @method selectPrevious
       * @param {boolean} wrapped if true and it is already at the first item,
       *                  wrap to the end
       * @returns the previous item or undefined if there is none
       */
      selectPrevious: function(wrapped) {
        var i = wrapped && !this.selectedIndex ? 
            this.items.length - 1 : this.selectedIndex - 1;
        return this.selectIndex(i);
      },
      
      /**
       * Selects the next item.  This should be used in single selection only.
       *
       * @method selectNext
       * @param {boolean} wrapped if true and it is already at the last item,
       *                  wrap to the front
       * @returns the next item or undefined if there is none
       */
      selectNext: function(wrapped) {
        var i = wrapped && this.selectedIndex >= this.items.length - 1 ? 
            0 : this.selectedIndex + 1;
        return this.selectIndex(i);
      }
      
    });
  ;


  Polymer('core-drawer-panel', {

    /**
     * Fired when the narrow layout changes.
     *
     * @event core-responsive-change
     * @param {Object} detail
     * @param {boolean} detail.narrow true if the panel is in narrow layout.
     */

    publish: {

      /**
       * Width of the drawer panel.
       *
       * @attribute drawerWidth
       * @type string
       * @default '256px'
       */
      drawerWidth: '256px',

      /**
       * Max-width when the panel changes to narrow layout.
       *
       * @attribute responsiveWidth
       * @type string
       * @default '640px'
       */
      responsiveWidth: '640px',

      /**
       * The panel that is being selected. `drawer` for the drawer panel and
       * `main` for the main panel.
       *
       * @attribute selected
       * @type string
       * @default null
       */
      selected: {value: null, reflect: true},

      /**
       * The panel to be selected when `core-drawer-panel` changes to narrow
       * layout.
       *
       * @attribute defaultSelected
       * @type string
       * @default 'main'
       */
      defaultSelected: 'main',

      /**
       * Returns true if the panel is in narrow layout.  This is useful if you
       * need to show/hide elements based on the layout.
       *
       * @attribute narrow
       * @type boolean
       * @default false
       */
      narrow: {value: false, reflect: true},

      /**
       * If true, position the drawer to the right.
       *
       * @attribute rightDrawer
       * @type boolean
       * @default false
       */
      rightDrawer: false,

      /**
       * If true, swipe to open/close the drawer is disabled.
       *
       * @attribute disableSwipe
       * @type boolean
       * @default false
       */
      disableSwipe: false,
      
      /**
       * If true, ignore `responsiveWidth` setting and force the narrow layout.
       *
       * @attribute forceNarrow
       * @type boolean
       * @default false
       */
      forceNarrow: false
    },

    eventDelegates: {
      trackstart: 'trackStart',
      trackx: 'trackx',
      trackend: 'trackEnd',
      down: 'downHandler',
      up: 'upHandler',
      tap: 'tapHandler'
    },

    // Whether the transition is enabled.
    transition: false,

    // How many pixels on the side of the screen are sensitive to edge swipes and peek.
    edgeSwipeSensitivity: 15,

    // Whether the drawer is peeking out from the edge.
    peeking: false,

    // Whether the user is dragging the drawer interactively.
    dragging: false,

    // Whether the browser has support for the transform CSS property.
    hasTransform: true,

    // Whether the browser has support for the will-change CSS property.
    hasWillChange: true,
    
    // The attribute on elements that should toggle the drawer on tap, also 
    // elements will automatically be hidden in wide layout.
    toggleAttribute: 'core-drawer-toggle',

    created: function() {
      this.hasTransform = 'transform' in this.style;
      this.hasWillChange = 'willChange' in this.style;
    },

    domReady: function() {
      // to avoid transition at the beginning e.g. page loads
      // NOTE: domReady is already raf delayed and delaying another frame
      // ensures a layout has occurred.
      this.async(function() {
        this.transition = true;
      });
    },

    /**
     * Toggles the panel open and closed.
     *
     * @method togglePanel
     */
    togglePanel: function() {
      this.selected = this.isMainSelected() ? 'drawer' : 'main';
    },

    /**
     * Opens the drawer.
     *
     * @method openDrawer
     */
    openDrawer: function() {
      this.selected = 'drawer';
    },

    /**
     * Closes the drawer.
     *
     * @method closeDrawer
     */
    closeDrawer: function() {
      this.selected = 'main';
    },

    queryMatchesChanged: function() {
      this.narrow = this.queryMatches || this.forceNarrow;
      if (this.narrow) {
        this.selected = this.defaultSelected;
      }
      this.setAttribute('touch-action', this.swipeAllowed() ? 'pan-y' : '');
      this.fire('core-responsive-change', {narrow: this.narrow});
    },
    
    forceNarrowChanged: function() {
      this.queryMatchesChanged();
    },

    swipeAllowed: function() {
      return this.narrow && !this.disableSwipe;
    },
    
    isMainSelected: function() {
      return this.selected === 'main';
    },

    startEdgePeek: function() {
      this.width = this.$.drawer.offsetWidth;
      this.moveDrawer(this.translateXForDeltaX(this.rightDrawer ?
          -this.edgeSwipeSensitivity : this.edgeSwipeSensitivity));
      this.peeking = true;
    },

    stopEdgePeak: function() {
      if (this.peeking) {
        this.peeking = false;
        this.moveDrawer(null);
      }
    },

    downHandler: function(e) {
      if (!this.dragging && this.isMainSelected() && this.isEdgeTouch(e)) {
        this.startEdgePeek();
      }
    },

    upHandler: function(e) {
      this.stopEdgePeak();
    },
    
    tapHandler: function(e) {
      if (e.target && this.toggleAttribute && 
          e.target.hasAttribute(this.toggleAttribute)) {
        this.togglePanel();
      }
    },

    isEdgeTouch: function(e) {
      return this.swipeAllowed() && (this.rightDrawer ?
        e.pageX >= this.offsetWidth - this.edgeSwipeSensitivity :
        e.pageX <= this.edgeSwipeSensitivity);
    },

    trackStart : function(e) {
      if (this.swipeAllowed()) {
        this.dragging = true;

        if (this.isMainSelected()) {
          this.dragging = this.peeking || this.isEdgeTouch(e);
        }

        if (this.dragging) {
          this.width = this.$.drawer.offsetWidth;
          this.transition = false;
          e.preventTap();
        }
      }
    },

    translateXForDeltaX: function(deltaX) {
      var isMain = this.isMainSelected();
      if (this.rightDrawer) {
        return Math.max(0, isMain ? this.width + deltaX : deltaX);
      } else {
        return Math.min(0, isMain ? deltaX - this.width : deltaX);
      }
    },

    trackx : function(e) {
      if (this.dragging) {
        if (this.peeking) {
          if (Math.abs(e.dx) <= this.edgeSwipeSensitivity) {
            return; // Ignore trackx until we move past the edge peek.
          }
          this.peeking = false;
        }
        this.moveDrawer(this.translateXForDeltaX(e.dx));
      }
    },

    trackEnd : function(e) {
      if (this.dragging) {
        this.dragging = false;
        this.transition = true;
        this.moveDrawer(null);

        if (this.rightDrawer) {
          this.selected = e.xDirection > 0 ? 'main' : 'drawer';
        } else {
          this.selected = e.xDirection > 0 ? 'drawer' : 'main';
        }
      }
      if(e.xDirection > 0){
        this.fire('core-drawer-panel-trackOpen');
      }else{
        this.fire('core-drawer-panel-trackClosed');
      }
    },

    transformForTranslateX: function(translateX) {
      if (translateX === null) {
        return '';
      }
      return this.hasWillChange ? 'translateX(' + translateX + 'px)' : 
          'translate3d(' + translateX + 'px, 0, 0)';
    },

    moveDrawer: function(translateX) {
      var s = this.$.drawer.style;
      
      if (this.hasTransform) {
        s.transform = this.transformForTranslateX(translateX);
      } else {
        s.webkitTransform = this.transformForTranslateX(translateX);
      }
    }

  });

;


  Polymer('core-header-panel',{

    /**
     * Fired when the content has been scrolled.  `event.detail.target` returns
     * the scrollable element which you can use to access scroll info such as
     * `scrollTop`.
     *
     *     <core-header-panel on-scroll="{{scrollHandler}}">
     *       ...
     *     </core-header-panel>
     *
     *
     *     scrollHandler: function(event) {
     *       var scroller = event.detail.target;
     *       console.log(scroller.scrollTop);
     *     }
     *
     * @event scroll
     */

    publish: {
      /**
       * Controls header and scrolling behavior. Options are
       * `standard`, `seamed`, `waterfall`, `waterfall-tall`, `scroll` and 
       * `cover`. Default is `standard`.
       *
       * `standard`: The header is a step above the panel. The header will consume the
       * panel at the point of entry, preventing it from passing through to the
       * opposite side.
       *
       * `seamed`: The header is presented as seamed with the panel.
       *
       * `waterfall`: Similar to standard mode, but header is initially presented as
       * seamed with panel, but then separates to form the step.
       *
       * `waterfall-tall`: The header is initially taller (`tall` class is added to
       * the header).  As the user scrolls, the header separates (forming an edge)
       * while condensing (`tall` class is removed from the header).
       *
       * `scroll`: The header keeps its seam with the panel, and is pushed off screen.
       *
       * `cover`: The panel covers the whole `core-header-panel` including the
       * header. This allows user to style the panel in such a way that the panel is
       * partially covering the header.
       *
       *     <style>
       *       core-header-panel[mode=cover]::shadow #mainContainer {
       *         left: 80px;
       *       }
       *       .content {
       *         margin: 60px 60px 60px 0;
       *       }
       *     </style>
       *
       *     <core-header-panel mode="cover">
       *       <core-toolbar class="tall">
       *         <core-icon-button icon="menu"></core-icon-button>
       *       </core-toolbar>
       *       <div class="content"></div>
       *     </core-header-panel>
       *
       * @attribute mode
       * @type string
       * @default ''
       */
      mode: {value: '', reflect: true},

      /**
       * The class used in waterfall-tall mode.  Change this if the header
       * accepts a different class for toggling height, e.g. "medium-tall"
       *
       * @attribute tallClass
       * @type string
       * @default 'tall'
       */
      tallClass: 'tall',

      /**
       * If true, the drop-shadow is always shown no matter what mode is set to.
       *
       * @attribute shadow
       * @type boolean
       * @default false
       */
      shadow: false
    },

    animateDuration: 200,

    modeConfigs: {
      shadowMode: {'waterfall': 1, 'waterfall-tall': 1},
      noShadow: {'seamed': 1, 'cover': 1, 'scroll': 1},
      tallMode: {'waterfall-tall': 1},
      outerScroll: {'scroll': 1}
    },
    
    ready: function() {
      this.scrollHandler = this.scroll.bind(this);
      this.addListener();
    },
    
    detached: function() {
      this.removeListener(this.mode);
    },
    
    addListener: function() {
      this.scroller.addEventListener('scroll', this.scrollHandler);
    },
    
    removeListener: function(mode) {
      var s = this.getScrollerForMode(mode);
      s.removeEventListener('scroll', this.scrollHandler);
    },

    domReady: function() {
      this.async('scroll');
    },

    modeChanged: function(old) {
      var configs = this.modeConfigs;
      var header = this.header;
      if (header) {
        // in tallMode it may add tallClass to the header; so do the cleanup
        // when mode is changed from tallMode to not tallMode
        if (configs.tallMode[old] && !configs.tallMode[this.mode]) {
          header.classList.remove(this.tallClass);
          this.async(function() {
            header.classList.remove('animate');
          }, null, this.animateDuration);
        } else {
          header.classList.toggle('animate', configs.tallMode[this.mode]);
        }
      }
      if (configs && (configs.outerScroll[this.mode] || configs.outerScroll[old])) {
        this.removeListener(old);
        this.addListener();
      }
      this.scroll();
    },

    get header() {
      return this.$.headerContent.getDistributedNodes()[0];
    },
    
    getScrollerForMode: function(mode) {
      return this.modeConfigs.outerScroll[mode] ?
          this.$.outerContainer : this.$.mainContainer;
    },

    /**
     * Returns the scrollable element.
     *
     * @property scroller
     * @type Object
     */
    get scroller() {
      return this.getScrollerForMode(this.mode);
    },

    scroll: function() {
      var configs = this.modeConfigs;
      var main = this.$.mainContainer;
      var header = this.header;

      var sTop = main.scrollTop;
      var atTop = sTop === 0;

      this.$.dropShadow.classList.toggle('hidden', !this.shadow &&
          (atTop && configs.shadowMode[this.mode] || configs.noShadow[this.mode]));

      if (header && configs.tallMode[this.mode]) {
        header.classList.toggle(this.tallClass, atTop ||
            header.classList.contains(this.tallClass) &&
            main.scrollHeight < this.$.outerContainer.offsetHeight);
      }

      this.fire('scroll', {target: this.scroller}, this, false);
    }

  });

;


  Polymer('core-item', {
    
    /**
     * The URL of an image for the icon.
     *
     * @attribute src
     * @type string
     * @default ''
     */

    /**
     * Specifies the icon from the Polymer icon set.
     *
     * @attribute icon
     * @type string
     * @default ''
     */

    /**
     * Specifies the label for the menu item.
     *
     * @attribute label
     * @type string
     * @default ''
     */

  });

;
Polymer('core-menu');;


  Polymer('core-submenu', {

    publish: {
      active: {value: false, reflect: true}
    },

    opened: false,

    get items() {
      return this.$.submenu.items;
    },

    hasItems: function() {
      return !!this.items.length;
    },

    unselectAllItems: function() {
      this.$.submenu.selected = null;
      this.$.submenu.clearSelection();
    },

    activeChanged: function() {
      if (this.hasItems()) {
        this.opened = this.active;
      }
      if (!this.active) {
        this.unselectAllItems();
      }
    },
    
    toggle: function() {
      this.opened = !this.opened;
    },

    activate: function() {
      if (this.hasItems() && this.active) {
        this.toggle();
        this.unselectAllItems();
      }
    }
    
  });

;


    Polymer('core-icon-button', {

      /**
       * The URL of an image for the icon.  Should not use `icon` property
       * if you are using this property.
       *
       * @attribute src
       * @type string
       * @default ''
       */
      src: '',

      /**
       * If true, border is placed around the button to indicate it's
       * active state.
       *
       * @attribute active
       * @type boolean
       * @default false
       */
      active: false,

      /**
       * Specifies the icon name or index in the set of icons available in
       * the icon set.  Should not use `src` property if you are using this
       * property.
       *
       * @attribute icon
       * @type string
       * @default ''
       */
      icon: '',

      activeChanged: function() {
        this.classList.toggle('selected', this.active);
      }

    });

  ;

    Polymer('paper-fab',{

      publish: {

        /**
         * The URL of an image for the icon. If the src property is specified,
         * the icon property should not be.
         *
         * @attribute src
         * @type string
         * @default ''
         */
        src: '',

        /**
         * Specifies the icon name or index in the set of icons available in
         * the icon's icon set. If the icon property is specified,
         * the src property should not be.
         *
         * @attribute icon
         * @type string
         * @default ''
         */
        icon: '',

        /**
         * Set this to true to style this is a "mini" FAB.
         *
         * @attribute mini
         * @type boolean
         * @default false
         */
        mini: false,

        raised: true,
        recenteringTouch: false,
        fill: true

      },

      iconChanged: function(oldIcon) {
        var label = this.getAttribute('aria-label');
        if (!label || label === oldIcon) {
          this.setAttribute('aria-label', this.icon);
        }
      }

    });

  ;

        Polymer('ma-drawer', {
            mobileMode: false,
            drawerOpened: true,
            scrimDrawerOpened: false,
            narrowChanged: function () {
                var selfObj = this;
                this.async(function () {
                    if (this.narrow) {
                        this.mobileMode = true;
                        this.drawerOpened = false;
                    }
                    else {
                        this.mobileMode = false;
                        this.drawerOpened = true;
                    }
                    this.scrimDrawerOpened = false;
                    selfObj.hideShowScrimDisplay(false);
                }, 0);
            },
            ready: function () {
                var selfObj = this;
                this.$.drawerPanel.addEventListener('core-drawer-panel-trackOpen', function (el) {
                    if (!selfObj.drawerOpened) {
                        selfObj.hideShowScrimDisplay(false);
                        selfObj.scrimDrawerOpened = true;
                    }
                });
                this.$.drawerPanel.addEventListener('core-drawer-panel-trackClosed', function (el) {
                    if (!selfObj.drawerOpened) {
                        selfObj.scrimDrawerOpened = false;
                    }
                });
                this.$.drawerPanel.shadowRoot.querySelector("#scrim").addEventListener('tap', function (el) {
                    if (!selfObj.drawerOpened) {
                        selfObj.scrimDrawerOpened = false;
                        selfObj.$.drawerPanel.closeDrawer();
                    }
                });
                if (this.$.drawerPanel.narrow) {
                    this.drawerOpened = false;
                    this.mobileMode = true;
                }
                this.hideShowScrimDisplay(true);
            },
            togglePanel: function () {
                this.drawerOpened = !this.drawerOpened;
                if (this.mobileMode) {
                    this.$.drawerPanel.openDrawer();
                    this.hideShowScrimDisplay(false);
                }
                else {
                    this.$.drawerPanel.narrow = !this.$.drawerPanel.narrow;
                    this.hideShowScrimDisplay(true);
                    this.$.drawerPanel.closeDrawer();
                }
            }
            ,
            hideShowScrimDisplay: function (hide) {
                if (hide) {
                    this.$.drawerPanel.shadowRoot.querySelector("#scrim").style.display = 'none';
                } else {
                    this.$.drawerPanel.shadowRoot.querySelector("#scrim").style.display = 'block';
                }
            }
            ,
        })
        ;
    ;

        Polymer('ma-dropdown-button',{
            notificationNum: 0,
            toggle: function () {
                this.notificationNum = 0;
                if (!this.dropdown) {
                    this.dropdown = this.querySelector('paper-dropdown');
                }
                this.dropdown && this.dropdown.toggle();
            }
        });
    ;

        Polymer('ma-utils', {
            clone: function (obj) {
                if (null == obj || "object" != typeof obj) return obj;
                var copy = obj.constructor();
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
                }
                return copy;
            },
            errorsToStr: function (errors) {
                var errorVals = [];
                errors.forEach(function (err) {
                    errorVals.push(err.error);
                });
                return errorVals.join(', ');
            },
            getBaseUrl: function () {
                var re = /(.*\/)(.*\.html)/;
                var baseURL = document.URL;
                var trimmed = baseURL.split(re)[1];
                if (trimmed != null)
                    trimmed = trimmed.split('pages/')[0];
                return (trimmed != null) ? trimmed : baseURL;
            }
        });
    ;

        Polymer('ma-data-context', {
            db: {},
            models: {
                Mail: "Mail",
                Task:"Task",
                User: "User",
                Page: "Page",
                Config: "Config",
                MailUser:"MailUser",
                Notification:"Notification",
                NotificationType:"NotificationType"
            },
            firstRun: false,
            entities: [],
            ready: function() {
                var self = this;
                var opts = {};
                for (var key in this.models) {
                    var name = this.models[key];
                    $data.Entity.extend(name, MaModel[name].model);
                    opts[MaModel[name].tableName] = {
                        type: $data.EntitySet,
                        elementType: name
                    };
                };
                
                $data.EntityContext.extend("MaDb", opts);
                self.db = new MaDb({
                    provider: 'indexedDb',
                    databaseName: "MaDb",
                    version:1
                });
                self.db.onReady(function() {
                    self.db.Configs.Config.readAll()
                        .then(function(configs) {
                            if (configs.length == 0) {
                                self.seedData();
                            }
                        });
                });
            },
            seedData: function() {
                var self = this;
                var itemsWithConstraints = [];
                for (var key in self.models) {
                    var name = key;
                    var plural = MaModel[name].tableName;
                    self.db[plural].addMany(MaSeedData[name]);
                };
                self.db.saveChanges(function() {
                    window.location = window.document.URL;
                });
            },
            getJSON: function(name) {
                var ent = $data.Entity.extend(name, MaModel[name].model);
                return new ent().toJSON();
            },
            validateJSON: function(name, model) {
                var ent = $data.Entity.extend(name, MaModel[name].model);
                var jayEntity = new ent();
                for (var key in model) {
                    if(model[key] == "")
                        model[key] = null;
                    jayEntity[key] = model[key];
                }
                var isValid = jayEntity.isValid();
                var errors = [];
                if (jayEntity.ValidationErrors != null && jayEntity.ValidationErrors.length > 0) {
                    for (var key in jayEntity.ValidationErrors) {
                        errors.push({
                            name: jayEntity.ValidationErrors[key].PropertyDefinition.name,
                            error: jayEntity.ValidationErrors[key].PropertyDefinition.error
                        });
                    }
                }
                return {
                    isValid: isValid,
                    errors: errors
                };
            },
            resultsToJSON: function(items) {
                var returnItems = [];
                for (var key in items) {
                    if (items[key].hasOwnProperty("initData")) {
                        returnItems.push(items[key].initData);
                    }
                }
                return returnItems;
            }
        });
    ;

        Polymer('ma-data-repo', {
            context: null,
            ready:function() {
                this.setupContext();
            },
            setupContext:function(){
                var self = this;
                if(!window.document.querySelector("#maDataContext")){
                    var div = document.createElement("div");
                    div.innerHTML = "<ma-data-context id='maDataContext'></ma-data-context>";
                    window.document.body.appendChild(div.childNodes[0]);
                    self.context = window.document.querySelector("#maDataContext");
                }else{
                    self.context = window.document.querySelector("#maDataContext");
                }
            }
        });
    ;

        Polymer('auth-repo', {
            cookieName: "maAuth",
            authModel: {},
            ready: function() {
                this.$.repo.setupContext();
                this.async(function(){
                    this.authModel = this.$.repo.context.getJSON(this.$.repo.context.models.User);
                },null,0);
            },
            login: function(callback, authModel, args) {
                var self = this;
                var validation = this.$.repo.context.validateJSON(this.$.repo.context.models.User, authModel);
                
                if(!validation.isValid){
                    callback(false,validation.errors, args);
                    return;
                }
                this.$.repo.context.db.Users.User.query(function(user) {
                    user.Email == this.Email && user.Password == this.Password
                }, authModel).then(function(user) {
                    if(user.length > 0){
                        self.createSession(user[0].Id);
                        callback(user[0], null, args);
                    }else{
                        callback(false,null, args);     
                    }
                }).fail(function(){
                    callback(false,null, args);    
                });
            },
            register: function(callback, authModel, args) {
                var self = this;
                var validation = this.$.repo.context.validateJSON(this.$.repo.context.models.User, authModel);
                if(!validation.isValid){
                    callback(false,validation.errors, args);
                    return;
                }
                var user = this.$.repo.context.db.Users.add(authModel);
                this.$.repo.context.db.saveChanges(function() {
                    self.createSession(user.Id);
                    callback(user, null, args);
                }).fail(function(){
                    callback(false, null, args);
                });
            },
            session: function(returnSession) {
                if (returnSession == null) {
                    returnSession = false;
                }
                var name = this.cookieName + "=";
                var ca = document.cookie.split(';');

                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1);
                    if (c.indexOf(name) != -1 && returnSession == false) return true;
                    if (c.indexOf(name) != -1 && returnSession == true) return JSON.parse(c.substring(name.length, c.length));
                }
                return false;
            },
            createSession: function(id) {
                var d = new Date();
                var exdays = 10;
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toUTCString() + "; path=/";
                document.cookie = this.cookieName + "= {\"Id\" :" + id + "}" + "; " + expires;
            },
            deleteSession: function() {
                document.cookie = this.cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
            }
        });
    ;

        Polymer('notification-repo', {
            cookieName: "maAuth",
            authModel: {},
            userSession: {},
            notificationTypes: [],
            ready: function () {
                this.$.repo.setupContext();
                this.async(function () {
                    this.userSession = this.$.authRepo.session(true);
                    this.getNotificationTypes();
                }, null, 1000);
            },
            getNotificationTypes: function () {
                var self = this;
                this.$.repo.context.db.NotificationTypes.toArray(function (types) {
                    self.notificationTypes = types;
                });
            },
            saveNotification: function (type, itemId, metadata) {
                var self = this;
                var typeId = 0;
                for (var i in self.notificationTypes) {
                    if (self.notificationTypes[i].Title == type) {
                        typeId = self.notificationTypes[i].Id;
                        break;
                    }
                }
                var notification = {};
                notification.NotificationType__Id = typeId;
                notification.User__Id = self.userSession.Id;
                notification.Item_Id = itemId;
                notification.Metadata = metadata;

                self.$.repo.context.db.Notifications.addMany([notification]);
                self.$.repo.context.db.saveChanges();
            },
            getNotifications: function (callback, selfCallback) {
                var self = this;
                self.$.repo.context.db.Notifications.filter(function (notification) {
                    notification.User__Id == this.Id && notification.ReadDate == null
                }, this.userSession).toArray(function (notifications) {
                    for (var i = 0; i <= notifications.length - 1; i++) {
                        self.$.repo.context.db.Notifications.attach(notifications[i]);
                        notifications[i].ReadDate = (new Date()).getTime();
                    }
                    self.$.repo.context.db.saveChanges(function () {
                        callback(notifications, selfCallback);
                    });
                });
            }
        });
    ;

        Polymer('ma-real-time', {
            polling: 3000,
            getNotifications: function () {
                var self = this;
                self.async(function () {
                    self.getNotificationsCall();
                }, null, self.polling);
            },
            ready: function () {
                this.getNotifications();
            },
            getNotificationsCall: function () {
                this.$.repo.getNotifications(this.getNotificationsCallback, this);
            },
            getNotificationsCallback: function (notifications, self) {
                if(notifications.length > 0){
                    self.fire("new-notifications", notifications);
                }
                self.getNotifications();
            }
        });
    ;

        Polymer('ma-real-time-client', {
            polling: 3000,
            realTimeParent:{},
            ready:function(){
                this.setupParent();
            },
            setupParent:function(){
                var self = this;
                if(!window.document.querySelector("ma-real-time")){
                    var div = document.createElement("div");
                    div.innerHTML = "<ma-real-time></ma-real-time>";
                    window.document.body.appendChild(div.childNodes[0]);
                    self.realTimeParent = window.document.querySelector("ma-real-time");
                }else{
                    self.realTimeParent = window.document.querySelector("ma-real-time");
                }
                self.setupHandler();
            },
            setupHandler: function () {
                var self = this;
                self.realTimeParent.addEventListener('new-notifications', function (e) {
                    self.fire("new-notifications", e.detail);
                });
            }
        });
    ;

        Polymer('material-admin-header', {
            page: {},
            ready: function () {
                var self = this;
                if (!this.$.authRepo.session()) {
                    this.logout();
                }
                this.$.realTimeClient.addEventListener('new-notifications', function (e) {
                    for(var i=0; i<= e.detail.length-1;i++){
                        if(e.detail[i].NotificationType__Id == 2){
                            self.$.taskOption.notificationNum += 1;
                        }else if(e.detail[i].NotificationType__Id == 1){
                            self.$.mailOption.notificationNum += 1;
                        }
                    }
                });
            },
            logout: function () {
                this.$.authRepo.deleteSession();
                window.location = "pages/auth/auth.html";
            }
        });
    ;

        Polymer('ma-config-repo', {
            getPages: function(callback, args) {
                var self = this;
                self.async(function(){
                    self.$.repo.context.db
                            .Pages
                            .Page
                            .readAll().then(function(items) {
                                callback(self.$.repo.context.resultsToJSON(items), args);
                            });
                },null,0);
            }
        });
    ;

        Polymer('ma-core-item-link', {
            link: ""
        });
    ;

        Polymer('material-admin-drawer', {
            ready: function() {}
        });
    ;

        Polymer('ma-grid-item', {
            ready: function() {
            }
        });
    ;

        Polymer('ma-grid', {
            ready: function() {
                var items = this.querySelectorAll("ma-grid-item");
                for (var key in items) {
                    var item = items[key];
                    item.className += " ma-u-xl-" + item.large + "-24 ma-u-lg-" + item.large + "-24 ma-u-md-" + item.medium + "-24 ma-u-sm-" + item.small + "-24";
                };
            }
        });
    ;


(function () {

// create some basic transition styling data.
var transitions = CoreStyle.g.transitions = CoreStyle.g.transitions || {};
transitions.duration = '500ms';
transitions.heroDelay = '50ms';
transitions.scaleDelay = '500ms';
transitions.cascadeFadeDuration = '250ms';

Polymer('core-transition-pages',{

  publish: {
    /**
     * This class will be applied to the scope element in the `prepare` function.
     * It is removed in the `complete` function. Used to activate a set of CSS
     * rules that need to apply before the transition runs, e.g. a default opacity
     * or transform for the non-active pages.
     *
     * @attribute scopeClass
     * @type string
     * @default ''
     */
    scopeClass: '',

    /**
     * This class will be applied to the scope element in the `go` function. It is
     * remoived in the `complete' function. Generally used to apply a CSS transition
     * rule only during the transition.
     *
     * @attribute activeClass
     * @type string
     * @default ''
     */
    activeClass: '',

    /**
     * Specifies which CSS property to look for when it receives a `transitionEnd` event
     * to determine whether the transition is complete. If not specified, the first
     * transitionEnd event received will complete the transition.
     *
     * @attribute transitionProperty
     * @type string
     * @default ''
     */
    transitionProperty: ''
  },

  /**
   * True if this transition is complete.
   *
   * @attribute completed
   * @type boolean
   * @default false
   */
  completed: false,

  prepare: function(scope, options) {
    this.boundCompleteFn = this.complete.bind(this, scope);
    if (this.scopeClass) {
      scope.classList.add(this.scopeClass);
    }
  },

  go: function(scope, options) {
    this.completed = false;
    if (this.activeClass) {
      scope.classList.add(this.activeClass);
    }
    scope.addEventListener('transitionend', this.boundCompleteFn, false);
  },

  setup: function(scope) {
    if (!scope._pageTransitionStyles) {
      scope._pageTransitionStyles = {};
    }

    var name = this.calcStyleName();
    
    if (!scope._pageTransitionStyles[name]) {
      this.installStyleInScope(scope, name);
      scope._pageTransitionStyles[name] = true;
    }
  },

  calcStyleName: function() {
    return this.id || this.localName;
  },

  installStyleInScope: function(scope, id) {
    if (!scope.shadowRoot) {
      scope.createShadowRoot().innerHTML = '<content></content>';
    }
    var root = scope.shadowRoot;
    var scopeStyle = document.createElement('core-style');
    root.insertBefore(scopeStyle, root.firstChild);
    scopeStyle.applyRef(id);
  },

  complete: function(scope, e) {
    // TODO(yvonne): hack, need to manage completion better
    if (e.propertyName !== 'box-shadow' && (!this.transitionProperty || e.propertyName.indexOf(this.transitionProperty) !== -1)) {
      this.completed = true;
      this.fire('core-transitionend', this, scope);
    }
  },

  // TODO(sorvell): ideally we do this in complete.
  ensureComplete: function(scope) {
    scope.removeEventListener('transitionend', this.boundCompleteFn, false);
    if (this.scopeClass) {
      scope.classList.remove(this.scopeClass);
    }
    if (this.activeClass) {
      scope.classList.remove(this.activeClass);
    }
  }

});

})();

;

(function() {

  var webkitStyles = '-webkit-transition' in document.documentElement.style
  var TRANSITION_CSSNAME = webkitStyles ? '-webkit-transition' : 'transition';
  var TRANSFORM_CSSNAME = webkitStyles ? '-webkit-transform' : 'transform';
  var TRANSITION_NAME = webkitStyles ? 'webkitTransition' : 'transition';
  var TRANSFORM_NAME = webkitStyles ? 'webkitTransform' : 'transform';

  var hasShadowDOMPolyfill = window.ShadowDOMPolyfill;

  Polymer('hero-transition',{

    go: function(scope, options) {
      var props = [
        'border-radius',
        'width',
        'height',
        TRANSFORM_CSSNAME
      ];

      var duration = options && options.duration || 
          (CoreStyle.g.transitions.heroDuration || 
          CoreStyle.g.transitions.duration);

      scope._heroes.forEach(function(h) {
        var d = h.h0.hasAttribute('hero-delayed') ? CoreStyle.g.transitions.heroDelay : '';
        var wt = [];
        props.forEach(function(p) {
          wt.push(p + ' ' + duration + ' ' + options.easing + ' ' + d);
        });

        h.h1.style[TRANSITION_NAME] = wt.join(', ');
        h.h1.style.borderRadius = h.r1;
        h.h1.style[TRANSFORM_NAME] = '';
      });

      this.super(arguments);

      if (!scope._heroes.length) {
        this.completed = true;
      }
    },

    prepare: function(scope, options) {
      this.super(arguments);
      var src = options.src, dst = options.dst;

      if (scope._heroes && scope._heroes.length) {
        this.ensureComplete(scope);
      } else {
        scope._heroes = [];
      }

      // FIXME(yvonne): basic support for nested pages.
      // Look for heroes in the light DOM and one level of shadow DOM of the src and dst,
      // and also in src.selectedItem or dst.selectedItem, then transform the dst hero to src
      var ss = '[hero]';
      var h$ = this.findAllInShadows(src, ss);
      if (src.selectedItem) {
        hs$ = this.findAllInShadows(src.selectedItem, ss);
        hsa$ = [];
        // De-duplicate items
        Array.prototype.forEach.call(hs$, function(hs) {
          if (h$.indexOf(hs) === -1) {
            hsa$.push(hs);
          }
        })
        h$ = h$.concat(hsa$);
      }

      for (var i=0, h0; h0=h$[i]; i++) {
        var v = h0.getAttribute('hero-id');
        var ds = '[hero][hero-id="' + v + '"]';
        var h1 = this.findInShadows(dst, ds);

        if (!h1 && dst.selectedItem) {
          h1 = this.findInShadows(dst.selectedItem, ds);
        }

        // console.log('src', src);
        // console.log('dst', dst, dst.selectedItem);
        // console.log(v, h0, h1);
        if (v && h1) {
          var c0 = getComputedStyle(h0);
          var c1 = getComputedStyle(h1);
          var h = {
            h0: h0,
            b0: h0.getBoundingClientRect(),
            r0: c0.borderRadius,
            h1: h1,
            b1: h1.getBoundingClientRect(),
            r1: c1.borderRadius
          };

          var dl = h.b0.left - h.b1.left;
          var dt = h.b0.top - h.b1.top;
          var sw = h.b0.width / h.b1.width;
          var sh = h.b0.height / h.b1.height;

          // h.scaley = h.h0.hasAttribute('scaley');
          // if (!h.scaley && (sw !== 1 || sh !== 1)) {
          //   sw = sh = 1;
          //   h.h1.style.width = h.b0.width + 'px';
          //   h.h1.style.height = h.b0.height + 'px';
          // }

          // Also animate the border-radius for the circle-to-square transition
          if (h.r0 !== h.r1) {
            h.h1.style.borderRadius = h.r0;
          }

          // console.log(h);

          h.h1.style[TRANSFORM_NAME] = 'translate(' + dl + 'px,' + dt + 'px)' + ' scale(' + sw + ',' + sh + ')';
          h.h1.style[TRANSFORM_NAME + 'Origin'] = '0 0';

          scope._heroes.push(h);
        }
      }

    },

    // carefully look into ::shadow with polyfill specific hack
    findInShadows: function(node, selector) {
      return node.querySelector(selector) || (hasShadowDOMPolyfill ? 
          queryAllShadows(node, selector) :
          node.querySelector('::shadow ' + selector));
    },

    findAllInShadows: function(node, selector) {
      if (hasShadowDOMPolyfill) {
        var nodes = node.querySelectorAll(selector).array();
        var shadowNodes = queryAllShadows(node, selector, true);
        return nodes.concat(shadowNodes);
      } else {
        return node.querySelectorAll(selector).array().concat(node.shadowRoot ? node.shadowRoot.querySelectorAll(selector).array() : []);
      }
    },

    ensureComplete: function(scope) {
      this.super(arguments);
      if (scope._heroes) {
        scope._heroes.forEach(function(h) {
          h.h1.style[TRANSITION_NAME] = '';
          h.h1.style[TRANSFORM_NAME] = '';
        });
        scope._heroes = [];
      }
    },

    complete: function(scope, e) {
      // if (e.propertyName === TRANSFORM_CSSNAME) {
        var done = false;
        scope._heroes.forEach(function(h) {
          if (h.h1 === e.path[0]) {
            done = true;
          }
        });

        if (done) {
          this.super(arguments);
        }
      // }
    }

  });

  
  // utility method for searching through shadowRoots.
  function queryShadow(node, selector) {
    var m, el = node.firstElementChild;
    var shadows, sr, i;
    shadows = [];
    sr = node.shadowRoot;
    while(sr) {
      shadows.push(sr);
      sr = sr.olderShadowRoot;
    }
    for(i = shadows.length - 1; i >= 0; i--) {
      m = shadows[i].querySelector(selector);
      if (m) {
        return m;
      }
    }
    while(el) {
      m = queryShadow(el, selector);
      if (m) {
        return m;
      }
      el = el.nextElementSibling;
    }
    return null;
  }

  function _queryAllShadows(node, selector, results) {
    var el = node.firstElementChild;
    var temp, sr, shadows, i, j;
    shadows = [];
    sr = node.shadowRoot;
    while(sr) {
      shadows.push(sr);
      sr = sr.olderShadowRoot;
    }
    for (i = shadows.length - 1; i >= 0; i--) {
      temp = shadows[i].querySelectorAll(selector);
      for(j = 0; j < temp.length; j++) {
        results.push(temp[j]);
      }
    }
    while (el) {
      _queryAllShadows(el, selector, results);
      el = el.nextElementSibling;
    }
    return results;
  }

  queryAllShadows = function(node, selector, all) {
    if (all) {
      return _queryAllShadows(node, selector, []);
    } else {
      return queryShadow(node, selector);
    }
  };

})();
;


  Polymer('core-animated-pages',{

    eventDelegates: {
      'core-transitionend': 'transitionEnd'
    },

    /**
     * A space-delimited string of transitions to use when switching between pages in this element.
     * The strings are `id`s of `core-transition-pages` elements included elsewhere. See the
     * individual transition's document for specific details.
     *
     * @attribute transitions
     * @type string
     * @default ''
     */
    transitions: '',

    selected: 0,

    /**
     * The last page selected. This property is useful to dynamically set transitions based
     * on incoming and outgoing pages.
     *
     * @attribute lastSelected
     * @type Object
     * @default null
     */
    lastSelected: null,

    registerCallback: function() {
      this.tmeta = document.createElement('core-transition');
    },

    created: function() {
      this._transitions = [];
      this.transitioning = [];
    },

    transitionsChanged: function() {
      this._transitions = this.transitions.split(' ');
    },

    _transitionsChanged: function(old) {
      if (this._transitionElements) {
        this._transitionElements.forEach(function(t) {
          t.teardown(this);
        }, this);
      }
      this._transitionElements = [];
      this._transitions.forEach(function(transitionId) {
        var t = this.getTransition(transitionId);
        if (t) {
          this._transitionElements.push(t);
          t.setup(this);
        }
      }, this);
    },

    getTransition: function(transitionId) {
      return this.tmeta.byId(transitionId);
    },

    selectionSelect: function(e, detail) {
      this.updateSelectedItem();
      // Wait to call applySelection when we run the transition
    },

    applyTransition: function(src, dst) {
      if (this.animating) {
        this.cancelAsync(this.animating);
        this.animating = null;
      }

      Polymer.flush();

      if (this.transitioning.indexOf(src) === -1) {
        this.transitioning.push(src);
      }
      if (this.transitioning.indexOf(dst) === -1) {
        this.transitioning.push(dst);
      }
      // force src, dst to display 
      src.setAttribute('animate', '');
      dst.setAttribute('animate', '');
      //
      var options = {
        src: src,
        dst: dst,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      };

      // fire an event so clients have a chance to do something when the
      // new page becomes visible but before it draws.
      this.fire('core-animated-pages-transition-prepare');

      //
      // prepare transition
      this._transitionElements.forEach(function(transition) {
        transition.prepare(this, options);
      }, this);
      //
      // force layout!
      src.offsetTop;

      //
      // apply selection
      this.applySelection(dst, true);
      this.applySelection(src, false);
      //
      // start transition
      this._transitionElements.forEach(function(transition) {
        transition.go(this, options);
      }, this);

      if (!this._transitionElements.length) {
        this.complete();
      } else {
        this.animating = this.async(this.complete.bind(this), null, 5000);
      }
    },

    complete: function() {
      if (this.animating) {
        this.cancelAsync(this.animating);
        this.animating = null;
      }

      this.transitioning.forEach(function(t) {
        t.removeAttribute('animate');
      });
      this.transitioning = [];

      this._transitionElements.forEach(function(transition) {
        transition.ensureComplete(this);
      }, this);

      this.fire('core-animated-pages-transition-end');
    },
    
    transitionEnd: function(e) {
      if (this.transitioning.length) {
        var completed = true;
        this._transitionElements.forEach(function(transition) {
          if (!transition.completed) {
            completed = false;
          }
        });
        if (completed) {
          this.job('transitionWatch', function() {
            this.complete();
          }, 100);
        }
      }
    },

    selectedChanged: function(old) {
      this.lastSelected = old;
      this.super(arguments);
    },

    selectedItemChanged: function(oldItem) {
      this.super(arguments);

      if (!oldItem) {
        this.applySelection(this.selectedItem, true);
        return;
      }

      if (this.hasAttribute('no-transition') || !this._transitionElements || !this._transitionElements.length) {
        this.applySelection(oldItem, false);
        this.applySelection(this.selectedItem, true);
        return;
      }

      if (oldItem && this.selectedItem) {
        // TODO(sorvell): allow bindings to update first?
        var self = this;
        Polymer.flush();
        Polymer.endOfMicrotask(function() {
          self.applyTransition(oldItem, self.selectedItem);
        });
      }
    }

  });

;

    (function() {
      var private_router;
      Polymer('flatiron-director', {
        autoHash: false,
        ready: function() {
          this.router.on(/(.*)/, function(route) {
            this.route = route;
          }.bind(this));
          this.route = this.router.getRoute() ? 
            this.router.getRoute().join(this.router.delimiter): '';
        },
        routeChanged: function() {
          if (this.autoHash) {
            window.location.hash = this.route;
          }
          this.fire('director-route', this.route);
        },
        get router() {
          if (!private_router) {
            private_router = new Router();
            private_router.init();
          }
          return private_router;
        }
      });
    })();
  ;


    Polymer('core-xhr', {

      /**
       * Sends a HTTP request to the server and returns the XHR object.
       *
       * @method request
       * @param {Object} inOptions
       *    @param {String} inOptions.url The url to which the request is sent.
       *    @param {String} inOptions.method The HTTP method to use, default is GET.
       *    @param {boolean} inOptions.sync By default, all requests are sent asynchronously. To send synchronous requests, set to true.
       *    @param {Object} inOptions.params Data to be sent to the server.
       *    @param {Object} inOptions.body The content for the request body for POST method.
       *    @param {Object} inOptions.headers HTTP request headers.
       *    @param {String} inOptions.responseType The response type. Default is 'text'.
       *    @param {boolean} inOptions.withCredentials Whether or not to send credentials on the request. Default is false.
       *    @param {Object} inOptions.callback Called when request is completed.
       * @returns {Object} XHR object.
       */
      request: function(options) {
        var xhr = new XMLHttpRequest();
        var url = options.url;
        var method = options.method || 'GET';
        var async = !options.sync;
        //
        var params = this.toQueryString(options.params);
        if (params && method == 'GET') {
          url += (url.indexOf('?') > 0 ? '&' : '?') + params;
        }
        var xhrParams = this.isBodyMethod(method) ? (options.body || params) : null;
        //
        xhr.open(method, url, async);
        if (options.responseType) {
          xhr.responseType = options.responseType;
        }
        if (options.withCredentials) {
          xhr.withCredentials = true;
        }
        this.makeReadyStateHandler(xhr, options.callback);
        this.setRequestHeaders(xhr, options.headers);
        xhr.send(xhrParams);
        if (!async) {
          xhr.onreadystatechange(xhr);
        }
        return xhr;
      },
    
      toQueryString: function(params) {
        var r = [];
        for (var n in params) {
          var v = params[n];
          n = encodeURIComponent(n);
          r.push(v == null ? n : (n + '=' + encodeURIComponent(v)));
        }
        return r.join('&');
      },

      isBodyMethod: function(method) {
        return this.bodyMethods[(method || '').toUpperCase()];
      },
      
      bodyMethods: {
        POST: 1,
        PUT: 1,
        PATCH: 1,
        DELETE: 1
      },

      makeReadyStateHandler: function(xhr, callback) {
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            callback && callback.call(null, xhr.response, xhr);
          }
        };
      },

      setRequestHeaders: function(xhr, headers) {
        if (headers) {
          for (var name in headers) {
            xhr.setRequestHeader(name, headers[name]);
          }
        }
      }

    });

  ;


  Polymer('core-ajax', {
    /**
     * Fired when a response is received.
     *
     * @event core-response
     */

    /**
     * Fired when an error is received.
     *
     * @event core-error
     */

    /**
     * Fired whenever a response or an error is received.
     *
     * @event core-complete
     */

    /**
     * The URL target of the request.
     *
     * @attribute url
     * @type string
     * @default ''
     */
    url: '',

    /**
     * Specifies what data to store in the `response` property, and
     * to deliver as `event.response` in `response` events.
     *
     * One of:
     *
     *    `text`: uses `XHR.responseText`.
     *
     *    `xml`: uses `XHR.responseXML`.
     *
     *    `json`: uses `XHR.responseText` parsed as JSON.
     *
     *    `arraybuffer`: uses `XHR.response`.
     *
     *    `blob`: uses `XHR.response`.
     *
     *    `document`: uses `XHR.response`.
     *
     * @attribute handleAs
     * @type string
     * @default 'text'
     */
    handleAs: '',

    /**
     * If true, automatically performs an Ajax request when either `url` or `params` changes.
     *
     * @attribute auto
     * @type boolean
     * @default false
     */
    auto: false,

    /**
     * Parameters to send to the specified URL, as JSON.
     *
     * @attribute params
     * @type string (JSON)
     * @default ''
     */
    params: '',

    /**
     * The response for the current request, or null if it hasn't
     * completed yet or the request resulted in error.
     *
     * @attribute response
     * @type Object
     * @default null
     */
    response: null,

    /**
     * The error for the current request, or null if it hasn't
     * completed yet or the request resulted in success.
     *
     * @attribute error
     * @type Object
     * @default null
     */
    error: null,

    /**
     * Whether the current request is currently loading.
     *
     * @attribute loading
     * @type boolean
     * @default false
     */
    loading: false,

    /**
     * The progress of the current request.
     *
     * @attribute progress
     * @type {loaded: number, total: number, lengthComputable: boolean}
     * @default {}
     */
    progress: null,

    /**
     * The HTTP method to use such as 'GET', 'POST', 'PUT', or 'DELETE'.
     * Default is 'GET'.
     *
     * @attribute method
     * @type string
     * @default ''
     */
    method: '',

    /**
     * HTTP request headers to send.
     *
     * Example:
     *
     *     <core-ajax
     *         auto
     *         url="http://somesite.com"
     *         headers='{"X-Requested-With": "XMLHttpRequest"}'
     *         handleAs="json"
     *         on-core-response="{{handleResponse}}"></core-ajax>
     *
     * @attribute headers
     * @type Object
     * @default null
     */
    headers: null,

    /**
     * Optional raw body content to send when method === "POST".
     *
     * Example:
     *
     *     <core-ajax method="POST" auto url="http://somesite.com"
     *         body='{"foo":1, "bar":2}'>
     *     </core-ajax>
     *
     * @attribute body
     * @type Object
     * @default null
     */
    body: null,

    /**
     * Content type to use when sending data.
     *
     * @attribute contentType
     * @type string
     * @default 'application/x-www-form-urlencoded'
     */
    contentType: 'application/x-www-form-urlencoded',

    /**
     * Set the withCredentials flag on the request.
     *
     * @attribute withCredentials
     * @type boolean
     * @default false
     */
    withCredentials: false,

    /**
     * Additional properties to send to core-xhr.
     *
     * Can be set to an object containing default properties
     * to send as arguments to the `core-xhr.request()` method
     * which implements the low-level communication.
     *
     * @property xhrArgs
     * @type Object
     * @default null
     */
    xhrArgs: null,

    created: function() {
      this.progress = {};
    },

    ready: function() {
      this.xhr = document.createElement('core-xhr');
    },

    receive: function(response, xhr) {
      if (this.isSuccess(xhr)) {
        this.processResponse(xhr);
      } else {
        this.processError(xhr);
      }
      this.complete(xhr);
    },

    isSuccess: function(xhr) {
      var status = xhr.status || 0;
      return !status || (status >= 200 && status < 300);
    },

    processResponse: function(xhr) {
      var response = this.evalResponse(xhr);
      if (xhr === this.activeRequest) {
        this.response = response;
      }
      this.fire('core-response', {response: response, xhr: xhr});
    },

    processError: function(xhr) {
      var response = xhr.status + ': ' + xhr.responseText;
      if (xhr === this.activeRequest) {
        this.error = response;
      }
      this.fire('core-error', {response: response, xhr: xhr});
    },

    processProgress: function(progress, xhr) {
      if (xhr !== this.activeRequest) {
        return;
      }
      // We create a proxy object here because these fields
      // on the progress event are readonly properties, which
      // causes problems in common use cases (e.g. binding to
      // <paper-progress> attributes).
      var progressProxy = {
        lengthComputable: progress.lengthComputable,
        loaded: progress.loaded,
        total: progress.total
      }
      this.progress = progressProxy;
    },

    complete: function(xhr) {
      if (xhr === this.activeRequest) {
        this.loading = false;
      }
      this.fire('core-complete', {response: xhr.status, xhr: xhr});
    },

    evalResponse: function(xhr) {
      return this[(this.handleAs || 'text') + 'Handler'](xhr);
    },

    xmlHandler: function(xhr) {
      return xhr.responseXML;
    },

    textHandler: function(xhr) {
      return xhr.responseText;
    },

    jsonHandler: function(xhr) {
      var r = xhr.responseText;
      try {
        return JSON.parse(r);
      } catch (x) {
        console.warn('core-ajax caught an exception trying to parse response as JSON:');
        console.warn('url:', this.url);
        console.warn(x);
        return r;
      }
    },

    documentHandler: function(xhr) {
      return xhr.response;
    },

    blobHandler: function(xhr) {
      return xhr.response;
    },

    arraybufferHandler: function(xhr) {
      return xhr.response;
    },

    urlChanged: function() {
      if (!this.handleAs) {
        var ext = String(this.url).split('.').pop();
        switch (ext) {
          case 'json':
            this.handleAs = 'json';
            break;
        }
      }
      this.autoGo();
    },

    paramsChanged: function() {
      this.autoGo();
    },

    bodyChanged: function() {
      this.autoGo();
    },

    autoChanged: function() {
      this.autoGo();
    },

    // TODO(sorvell): multiple side-effects could call autoGo
    // during one micro-task, use a job to have only one action
    // occur
    autoGo: function() {
      if (this.auto) {
        this.goJob = this.job(this.goJob, this.go, 0);
      }
    },

    /**
     * Performs an Ajax request to the specified URL.
     *
     * @method go
     */
    go: function() {
      var args = this.xhrArgs || {};
      // TODO(sjmiles): we may want XHR to default to POST if body is set
      args.body = this.body || args.body;
      args.params = this.params || args.params;
      if (args.params && typeof(args.params) == 'string') {
        args.params = JSON.parse(args.params);
      }
      args.headers = this.headers || args.headers || {};
      if (args.headers && typeof(args.headers) == 'string') {
        args.headers = JSON.parse(args.headers);
      }
      var hasContentType = Object.keys(args.headers).some(function (header) {
        return header.toLowerCase() === 'content-type';
      });
      if (!hasContentType && this.contentType) {
        args.headers['Content-Type'] = this.contentType;
      }
      if (this.handleAs === 'arraybuffer' || this.handleAs === 'blob' ||
          this.handleAs === 'document') {
        args.responseType = this.handleAs;
      }
      args.withCredentials = this.withCredentials;
      args.callback = this.receive.bind(this);
      args.url = this.url;
      args.method = this.method;

      this.response = this.error = this.progress = null;
      this.activeRequest = args.url && this.xhr.request(args);
      if (this.activeRequest) {
        this.loading = true;
        var activeRequest = this.activeRequest;
        // IE < 10 doesn't support progress events.
        if ('onprogress' in activeRequest) {
          this.activeRequest.addEventListener(
              'progress',
              function(progress) {
                this.processProgress(progress, activeRequest);
              }.bind(this), false);
        } else {
          this.progress = {
            lengthComputable: false,
          }
        }
      }
      return this.activeRequest;
    }

  });

;

        Polymer('ma-box', {
            headClass: "",
            boxFit: false,
            noHead: false,
            ready: function () {
                this.async(function(){
                    if (this.querySelector('[head]') == null) {
                        this.$.boxHeader.style.display = "none";
                        this.noHead = true;
                    }
                    else {
                        this.headClass = this.querySelector('[head]').className;
                    }
                },0);
            }
        });
    ;

        Polymer('my-profile-repo', {
            model: {},
            userSession: {},
            ready: function () {
                this.userSession = this.$.authRepo.session(true);
                this.async(function () {
                    this.$.repo.setupContext();
                }, null, 0);
            },
            getUser: function (callback, args) {
                var self = this;
                if (self.userSession) {
                    self.$.repo.context.db.Users.filter(function (usr) {
                        usr.Id == this.Id
                    }, self.userSession).toArray(function (user) {
                        user = user[0];
                        callback(user, args);
                    });
                }
            },
            saveUser: function (updatedUser, callback, selfCallback) {
                var self = this;
                var validation = this.$.repo.context.validateJSON(this.$.repo.context.models.User, updatedUser.initData);
                if (!validation.isValid) {
                    callback(false, validation.errors, selfCallback);
                    return;
                }
                console.log(updatedUser);
                self.saveUserCallback(updatedUser, callback, selfCallback)
            },
            saveUserCallback: function (updatedUser, callback, selfCallback) {
                var self = this;
                self.$.repo.context.db.Users.User.query(function (user) {
                    user.Id == this.Id
                }, self.userSession).then(function (user) {
                    self.$.repo.context.db.Users.attachOrGet(user[0]);
                    for (var key in updatedUser.initData) {
                        user[0][key] = updatedUser.initData[key];
                    };
                    self.$.repo.context.db.Users.saveChanges(function () {
                        callback(user[0], null, selfCallback);
                    });
                });
            }
        });
    ;

        Polymer('task-repo', {
            userSession: {},
            ready: function () {
                this.userSession = this.$.authRepo.session(true);
                this.async(function () {
                    this.$.repo.setupContext();
                }, null, 0);
            },
            setAsComplete: function (callback, id, callbackSelf) {
                var self = this;
                var queryModel = {UserId: self.userSession.Id, TaskId: id};
                self.$.repo.context.db.Tasks
                        .filter(function (task) {
                            task.Id == this.TaskId
                        }, queryModel).toArray(function (items) {
                            var item = items[0];
                            self.$.repo.context.db.Tasks.attach(item);
                            item.CompletedDateTime = (new Date()).getTime();
                            self.$.repo.context.db.saveChanges(function () {
                                callback(true, null, callbackSelf, item);
                            });
                        });
            },
            createTask: function (callback, model, callbackSelf) {
                var self = this;
                var validation = this.$.repo.context.validateJSON(this.$.repo.context.models.Task, model);
                if (!validation.isValid) {
                    callback(false, validation.errors, callbackSelf);
                    return;
                }
                ;
                var item = new self.$.repo.context.db.Tasks.Task();
                item.Details = model.Details;
                item.DeadLine = model.Deadline;
                item.User__Id = self.userSession.Id;
                self.$.repo.context.db.Tasks.addMany([item]);
                self.$.repo.context.db.saveChanges(function () {
                    self.$.notificationRepo.saveNotification("Task", item.Id, item.DeadLine);
                    callback(true, null, callbackSelf);
                });
            },
            deleteTasks: function (callback, items, callbackSelf) {
                var self = this;
                for (var i = 0; i <= items.length; i++) {
                    self.$.repo.context.db.Tasks.Task.remove(items[i]);
                }
                self.$.repo.context.db.saveChanges(function () {
                    callback(callbackSelf);
                });
            },
            getTasks: function (callback, pagination, callbackSelf) {
                var self = this;
                self.$.repo.context.db.Tasks
                        .orderByDescending(function (task) {
                            return task.DeadLine
                        })
                        .filter(function (user) {
                            user.User__Id == this.Id
                        }, self.userSession).toArray(function (items) {
                            pagination.total = items.length;
                            var startElement = (pagination.page - 1) * pagination.pageSize;
                            items = items.slice(startElement, startElement + pagination.pageSize);
                            callback(self.$.repo.context.resultsToJSON(items), pagination.total, callbackSelf);
                        });
            }
        });
    ;

        Polymer('mail-repo', {
            userSession: {},
            ready: function () {
                this.userSession = this.$.authRepo.session(true);
                this.async(function () {
                    this.$.repo.setupContext();
                }, null, 0);
            },
            sendMail: function (callback, mailModel, callbackSelf) {
                var self = this;
                var validation = this.$.repo.context.validateJSON(this.$.repo.context.models.Mail, mailModel);
                if (!validation.isValid) {
                    callback(false, validation.errors, callbackSelf);
                    return;
                }
                ;
                this.$.repo.context.db.Users.User.query(function (user) {
                    user.Email == this.Receiver
                }, mailModel).then(function (receiver) {

                    if (receiver.length == 0) {
                        callback(false, [{error: "The receiver wasn't found"}], callbackSelf);
                        return;
                    }

                    var mail = new self.$.repo.context.db.Mails.Mail();
                    mail.Title = mailModel.Title;
                    mail.Message = mailModel.Message;
                    mail.SentDate = (new Date()).getTime();
                    self.$.repo.context.db.Mails.addMany([mail]);

                    self.$.repo.context.db.saveChanges(function () {

                        var senderUserMail = {};
                        senderUserMail.User__Id = self.userSession.Id;
                        senderUserMail.Sender__Id = self.userSession.Id;
                        senderUserMail.Mail__Id = mail.Id;
                        var receiverUserMail = {};
                        receiverUserMail.User__Id = receiver[0].Id;
                        receiverUserMail.Mail__Id = mail.Id;
                        receiverUserMail.Sender__Id = self.userSession.Id;

                        self.$.repo.context.db.MailUsers.addMany([senderUserMail, receiverUserMail]);
                        self.$.repo.context.db.saveChanges(function () {
                            callback(true, null, callbackSelf);
                        });
                    });
                }).fail(function () {
                    callback(false, null, callbackSelf);
                });
            },
            deleteMails: function (callback, items, callbackSelf) {
                var self = this;
                self.$.repo.context.db.MailUsers.filter(function (mail) {
                    mail.Mail__Id in this > 0
                }, items).toArray(function (mailUsers) {
                    for (var j = 0; j <= mailUsers.length - 1; j++) {
                        self.$.repo.context.db.MailUsers.MailUser.remove(mailUsers[j].Id);
                    }
                    for (var i = 0; i <= items.length; i++) {
                        self.$.repo.context.db.Mails.Mail.remove(items[i]);
                    }
                    self.$.repo.context.db.saveChanges(function () {
                        callback(callbackSelf);
                    });
                });
            },
            getMails: function (callback, pagination, callbackSelf) {
                var self = this;
                self.$.repo.context.db.MailUsers
                        .filter(function (mail) {
                            mail.User__Id == this.Id && mail.Sender__Id != mail.User__Id
                        }, self.userSession).toArray(function (items) {
                            var mailIds = [];
                            items.forEach(function (item) {
                                mailIds.push(item.Mail__Id)
                            });
                            self.$.repo.context.db.Mails.filter(function (mail) {
                                mail.Id in this > 0
                            }, mailIds).toArray(function (mails) {
                                mails.sort(function (a, b) {
                                    return b.SentDate - a.SentDate
                                });
                                pagination.total = mails.length;
                                var startElement = (pagination.page - 1) * pagination.pageSize;
                                mails = mails.slice(startElement, startElement + pagination.pageSize);
                                var returnItems = [];
                                for (var i in mails) {
                                    mails[i]["SenderId"] = items.filter(function (obj) {
                                        return obj.Mail__Id == mails[i].Id
                                    })[0].Sender__Id;
                                    returnItems.push(mails[i]);
                                }
                                self.getMailsCallback(returnItems, callback, pagination, callbackSelf);
                            });
                        });
            },
            getMailsCallback: function (returnItems, callback, pagination, callbackSelf) {
                var self = this;
                var senderIds = [];
                returnItems.forEach(function (item) {
                    senderIds.push(item.SenderId)
                });
                self.$.repo.context.db.Users.filter(function (user) {
                    user.Id in this > 0
                }, senderIds).toArray(function (users) {
                    for (var i in returnItems) {
                        returnItems[i]["Sender"] = users.filter(function (user) {
                            return user.Id == returnItems[i].SenderId
                        })[0].Email;
                    }
                    callback((returnItems), pagination.total, callbackSelf);
                })
            }
        });
    ;

        Polymer('ma-table',{
            ready:function(){
            }
        });
    ;

        Polymer('ma-page-home', {
            model: {
                profile: {},
                tasks: [],
                mails: []
            },
            pagination: {
                pageSize: 5,
                page: 1,
                total: 0
            },
            ready: function () {
                var self = this;
                self.$.myProfileRepo.getUser(self.getUserCallback, self);
                self.getTasks();
                self.getMails();
                self.$.realTimeClient.addEventListener('new-notifications', function (e) {
                    var updateTasks = false, updateMails = false;
                    for (var i = 0; i <= e.detail.length - 1; i++) {
                        if (e.detail[i].NotificationType__Id == 2) {
                            updateTasks = true;
                        } else if (e.detail[i].NotificationType__Id == 1) {
                            updateMails = true;
                        }
                    }
                    if (updateTasks) { self.getTasks(); }
                    if (updateMails) { self.getMails(); }
                });
            },
            getUserCallback: function (user, self) {
                self.model.profile = user;
            },
            getTasks: function () {
                this.$.taskRepo.getTasks(this.tasksCallback, this.pagination, this);
            },
            getMails: function () {
                this.$.mailRepo.getMails(this.mailsCallback, this.pagination, this);
            },
            tasksCallback: function (tasks, total, self) {
                self.model.tasks = [];
                for (var i = 0; i <= tasks.length - 1; i++) {
                    self.model.tasks.push({
                        Details: tasks[i].Details,
                        DeadLine: tasks[i].DeadLine,
                        CompletedDateTime: tasks[i].CompletedDateTime
                    });
                }
            },
            mailsCallback: function (mails, total, self) {
                self.model.mails = [];
                for (var i = 0; i <= mails.length - 1; i++) {
                    self.model.mails.push({
                        Sender: mails[i].Sender,
                        Title: mails[i].Title
                    });
                }
            }
        });
    ;

    Polymer('paper-button',{

      publish: {

        /**
         * If true, the button will be styled with a shadow.
         *
         * @attribute raised
         * @type boolean
         * @default false
         */
        raised: false,

        /**
         * By default the ripple emanates from where the user touched the button.
         * Set this to true to always center the ripple.
         *
         * @attribute recenteringTouch
         * @type boolean
         * @default false
         */
        recenteringTouch: false,

        /**
         * By default the ripple expands to fill the button. Set this to true to
         * constrain the ripple to a circle within the button.
         *
         * @attribute fill
         * @type boolean
         * @default true
         */
        fill: true

      }

    });
  ;

        Polymer('ma-list', {
            itemElement: "",
            pagination: {
                page: 1,
                total: 0,
                pageSize: 5
            },
            toggleAllChecked: function () {
                this.fire('reset-list-checked', {selected: this.shadowRoot.querySelector("#selectAll").checked});
            },
            deleteItems: function () {
                this.fire('action-trigger', {action: 'delete'});
                this.shadowRoot.querySelector("#selectAll").checked = "";
            },
            observe: {
                'pagination.total': 'paginationChanged'
            },
            actionToggle: function () {
                this.shadowRoot.querySelector("#actionDropdown").toggle();
            },
            pageArr: [],
            changePage: function (event, detail, target) {
                this.pagination.page = target.dataset.page;
                this.fire("page-changed");
            },
            paginationChanged: function () {
                var self = this;
                var totalPages = Math.ceil(self.pagination.total / self.pagination.pageSize);
                self.pageArr = [];
                for (var i = 1; i <= totalPages; i++) {
                    self.pageArr.push(i);
                }
            },
            ready: function () {
                this.paginationChanged();
            }
        });
    ;


  Polymer('paper-radio-button', {
    
    /**
     * Fired when the checked state changes due to user interaction.
     *
     * @event change
     */
     
    /**
     * Fired when the checked state changes.
     *
     * @event core-change
     */
    
    publish: {
      /**
       * Gets or sets the state, `true` is checked and `false` is unchecked.
       *
       * @attribute checked
       * @type boolean
       * @default false
       */
      checked: {value: false, reflect: true},
      
      /**
       * The label for the radio button.
       *
       * @attribute label
       * @type string
       * @default ''
       */
      label: '',
      
      /**
       * Normally the user cannot uncheck the radio button by tapping once
       * checked.  Setting this property to `true` makes the radio button
       * toggleable from checked to unchecked.
       *
       * @attribute toggles
       * @type boolean
       * @default false
       */
      toggles: false,
      
      /**
       * If true, the user cannot interact with this element.
       *
       * @attribute disabled
       * @type boolean
       * @default false
       */
      disabled: {value: false, reflect: true}
    },
    
    eventDelegates: {
      tap: 'tap'
    },
    
    tap: function() {
      var old = this.checked;
      this.toggle();
      if (this.checked !== old) {
        this.fire('change');
      }
    },
    
    toggle: function() {
      this.checked = !this.toggles || !this.checked;
    },
    
    checkedChanged: function() {
      this.$.onRadio.classList.toggle('fill', this.checked);
      this.setAttribute('aria-checked', this.checked ? 'true': 'false');
      this.fire('core-change');
    },
    
    labelChanged: function() {
      this.setAttribute('aria-label', this.label);
    }
    
  });
  
;


  Polymer('paper-checkbox', {
    
    /**
     * Fired when the checked state changes due to user interaction.
     *
     * @event change
     */
     
    /**
     * Fired when the checked state changes.
     *
     * @event core-change
     */
    
    toggles: true,

    checkedChanged: function() {
      var cl = this.$.checkbox.classList;
      cl.toggle('checked', this.checked);
      cl.toggle('unchecked', !this.checked);
      cl.toggle('checkmark', !this.checked);
      cl.toggle('box', this.checked);
      this.setAttribute('aria-checked', this.checked ? 'true': 'false');
      this.fire('core-change');
    },

    checkboxAnimationEnd: function() {
      var cl = this.$.checkbox.classList;
      cl.toggle('checkmark', this.checked && !cl.contains('checkmark'));
      cl.toggle('box', !this.checked && !cl.contains('box'));
    }

  });
  
;

        Polymer('task-item', {
            item: {},
            observe: {
                'item.checked': 'checkedChanged'
            },
            setAsComplete: function (event, details, target) {
                this.$.repo.setAsComplete(this.setAsCompleteCallback, target.dataset.itemid, this);
            },
            setAsCompleteCallback: function (success, errors, self, item) {
                if (success) {
                    self.item.CompletedDateTime = item.CompletedDateTime;
                } else {
                    var errorVals = [];
                    errors.forEach(function (err) {
                        errorVals.push(err.error);
                    });
                    self.$.toastError.text = errorVals.join(', ');
                    self.$.toastError.show();
                }
            },
            checkedChanged: function (oldValue, newValue) {
                if (newValue) {
                    this.$.checked.checked = "checked";
                } else {
                    this.$.checked.checked = "";
                }
            },
            checkboxSelected: function (event) {
                this.item.checked = event.target.checked;
                event.stopPropagation();
            }
        });
    ;


  Polymer('paper-dialog-base',{

    publish: {

      /**
       * The title of the dialog.
       *
       * @attribute heading
       * @type string
       * @default ''
       */
      heading: '',

      /**
       * @attribute transition
       * @type string
       * @default ''
       */
      transition: '',

      /**
       * @attribute layered
       * @type boolean
       * @default true
       */
      layered: true
    },

    ready: function() {
      this.super();
      this.sizingTarget = this.$.scroller;
    },

    headingChanged: function(old) {
      var label = this.getAttribute('aria-label');
      if (!label || label === old) {
        this.setAttribute('aria-label', this.heading);
      }
    },

    openAction: function() {
      if (this.$.scroller.scrollTop) {
        this.$.scroller.scrollTop = 0;
      }
    }

  });

;
Polymer('paper-dialog');;


  Polymer('paper-autogrow-textarea',{

    publish: {

        /**
         * The textarea that should auto grow.
         *
         * @attribute target
         * @type HTMLTextAreaElement
         * @default null
         */
        target: null,

        /**
         * The initial number of rows.
         *
         * @attribute rows
         * @type number
         * @default 1
         */
        rows: 1,

        /**
         * The maximum number of rows this element can grow to until it
         * scrolls. 0 means no maximum.
         *
         * @attribute maxRows
         * @type number
         * @default 0
         */
        maxRows: 0
    },

    tokens: null,

    observe: {
      rows: 'updateCached',
      maxRows: 'updateCached'
    },

    constrain: function(tokens) {
      var _tokens;
      tokens = tokens || [''];
      // Enforce the min and max heights for a multiline input to avoid measurement
      if (this.maxRows > 0 && tokens.length > this.maxRows) {
        _tokens = tokens.slice(0, this.maxRows);
      } else {
        _tokens = tokens.slice(0);
      }
      while (this.rows > 0 && _tokens.length < this.rows) {
        _tokens.push('');
      }
      return _tokens.join('<br>') + '&nbsp;';
    },

    valueForMirror: function(input) {
      this.tokens = (input && input.value) ? input.value.replace(/&/gm, '&amp;').replace(/"/gm, '&quot;').replace(/'/gm, '&#39;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;').split('\n') : [''];
      return this.constrain(this.tokens);
    },

    /**
     * Sizes this element to fit the input value. This function is automatically called
     * when the user types in new input, but you must call this function if the value
     * is updated imperatively.
     *
     * @method update
     * @param Element The input
     */
    update: function(input) {
      this.$.mirror.innerHTML = this.valueForMirror(input);
    },

    updateCached: function() {
      this.$.mirror.innerHTML = this.constrain(this.tokens);
    },

    inputAction: function(e) {
      this.update(e.target);
    }

  });

;


  (function() {
  
    var currentToast;
  
    Polymer('paper-toast', {
  
      /**
       * The text shows in a toast.
       *
       * @attribute text
       * @type string
       * @default ''
       */
      text: '',
      
      /**
       * The duration in milliseconds to show the toast.
       *
       * @attribute duration
       * @type number
       * @default 3000
       */
      duration: 3000,
      
      /**
       * Set opened to true to show the toast and to false to hide it.
       *
       * @attribute opened
       * @type boolean
       * @default false
       */
      opened: false,
      
      /**
       * Min-width when the toast changes to narrow layout.  In narrow layout,
       * the toast fits at the bottom of the screen when opened.
       *
       * @attribute responsiveWidth
       * @type string
       * @default '480px'
       */
      responsiveWidth: '480px',
      
      /**
       * If true, the toast can't be swiped.
       *
       * @attribute swipeDisabled
       * @type boolean
       * @default false
       */
      swipeDisabled: false,
      
      /**
       * By default, the toast will close automatically if the user taps
       * outside it or presses the escape key. Disable this behavior by setting
       * the `autoCloseDisabled` property to true.
       *
       * @attribute autoCloseDisabled
       * @type boolean
       * @default false
       */
      autoCloseDisabled: false,
      
      narrowMode: false,
      
      eventDelegates: {
        trackstart: 'trackStart',
        track: 'track',
        trackend: 'trackEnd',
        transitionend: 'transitionEnd'
      },
      
      narrowModeChanged: function() {
        this.classList.toggle('fit-bottom', this.narrowMode);
        if (this.opened) {
          this.$.overlay.resizeHandler();
        }
      },
      
      openedChanged: function() {
        if (this.opened) {
          this.dismissJob = this.job(this.dismissJob, this.dismiss, this.duration);
        } else {
          this.dismissJob && this.dismissJob.stop();
          this.dismiss();
        }
      },
      
      /** 
       * Toggle the opened state of the toast.
       * @method toggle
       */
      toggle: function() {
        this.opened = !this.opened;
      },
      
      /** 
       * Show the toast for the specified duration
       * @method show
       */
      show: function() {
        if (currentToast) {
          currentToast.dismiss();
        }
        currentToast = this;
        this.opened = true;
      },
      
      /** 
       * Dismiss the toast and hide it.
       * @method dismiss
       */
      dismiss: function() {
        if (this.dragging) {
          this.shouldDismiss = true;
        } else {
          this.opened = false;
          if (currentToast === this) {
            currentToast = null;
          }
        }
      },
      
      trackStart: function(e) {
        if (!this.swipeDisabled) {
          e.preventTap();
          this.vertical = e.yDirection;
          this.w = this.offsetWidth;
          this.h = this.offsetHeight;
          this.dragging = true;
          this.classList.add('dragging');
        }
      },
      
      track: function(e) {
        if (this.dragging) {
          var s = this.style;
          if (this.vertical) {
            var y = e.dy;
            s.opacity = (this.h - Math.abs(y)) / this.h;
            s.transform = s.webkitTransform = 'translate3d(0, ' + y + 'px, 0)';
          } else {
            var x = e.dx;
            s.opacity = (this.w - Math.abs(x)) / this.w;
            s.transform = s.webkitTransform = 'translate3d(' + x + 'px, 0, 0)';
          }
        }
      },
      
      trackEnd: function(e) {
        if (this.dragging) {
          this.classList.remove('dragging');
          this.style.opacity = '';
          this.style.transform = this.style.webkitTransform = '';
          var cl = this.classList;
          if (this.vertical) {
            cl.toggle('fade-out-down', e.yDirection === 1 && e.dy > 0);
            cl.toggle('fade-out-up', e.yDirection === -1 && e.dy < 0);
          } else {
            cl.toggle('fade-out-right', e.xDirection === 1 && e.dx > 0);
            cl.toggle('fade-out-left', e.xDirection === -1 && e.dx < 0);
          }
          this.dragging = false;
        }
      },
      
      transitionEnd: function() {
        var cl = this.classList;
        if (cl.contains('fade-out-right') || cl.contains('fade-out-left') || 
            cl.contains('fade-out-down') || cl.contains('fade-out-up')) {
          this.dismiss();
          cl.remove('fade-out-right', 'fade-out-left', 
              'fade-out-down', 'fade-out-up');
        } else if (this.shouldDismiss) {
          this.dismiss();
        }
        this.shouldDismiss = false;
      }
  
    });
    
  })();

;

        Polymer('pickaday-element', {
            inputVal:"",
            inputValChanged:function(oldValue, newValue){

            },
            ready:function () {
                var picker = new Pikaday({
                    field: this.$.datepicker,
                    container: this.$.container,
                    bound: false,
                    showTime:true
                });
                picker.setMoment(moment().dayOfYear(366));
            }
        });
    ;

        Polymer('task-popup', {
            newItemModel: {},
            createTask: function () {
                this.newItemModel.Deadline = new Date(this.$.pickDeadline.inputVal);
                console.log(this.$.pickDeadline.inputVal);
                console.log(this.newItemModel.Deadline);
                this.$.repo.createTask(this.createTaskCallback, this.newItemModel, this);
            },
            createTaskCallback: function (success, errors, self) {
                if (success) {
                    self.$.newItemPopup.close();
                    self.$.toastSuccess.text = "Task Created";
                    self.$.toastSuccess.show();
                    self.fire('task-created');
                } else {
                    var errorVals = [];
                    errors.forEach(function (err) {
                        errorVals.push(err.error);
                    });
                    self.$.toastError.text = errorVals.join(', ');
                    self.$.toastError.show();
                }
            },
            newItem: function () {
                this.newItemModel = {Details: "", Deadline: ""};
                this.$.newItemPopup.toggle();
            }
        });
    ;

        Polymer('ma-page-tasks', {
            list: [],
            ready: function () {
                var self = this;
                self.$.maList.pagination.page = 1;
                this.$.maList.addEventListener("page-changed", function () {
                    self.loadList();
                });
                self.$.maList.addEventListener("reset-list-checked", function (e) {
                    self.resetListChecked(e.detail.selected);
                });
                self.$.maList.addEventListener("action-trigger", function (e) {
                    self.actionTrigger(e.detail);
                });
                self.$.newPopup.addEventListener("task-created", function (e) {
                    self.refreshList(self);
                });
                self.$.realTimeClient.addEventListener('new-notifications', function (e) {
                    var updateList = false;
                    for (var i = 0; i <= e.detail.length - 1; i++) {
                        if (e.detail[i].NotificationType__Id == 2) {
                            updateList = true;
                            break;
                        }
                    }
                    if (updateList) { self.refreshList(self); }
                });
                this.loadList();
            },
            newItem: function () {
                this.$.newPopup.newItem();
            },
            listChanged: function () {
                var self = this;
                self.async(function () {
                    for (var i in self.list) {
                        for (var j in self.$.maList.childNodes) {
                            if (self.$.maList.childNodes[j].id == "maItem" + self.list[i].Id) {
                                self.$.maList.childNodes[j].item = self.list[i];
                            }
                        }
                    }
                }, null, 0);
            },
            resetListChecked: function (selected) {
                for (var i in this.list) {
                    this.list[i].checked = selected;
                }
            },
            actionTrigger: function (action) {
                var self = this;
                var items = [];
                for (var i in self.list) {
                    if (self.list[i].checked) {
                        items.push(self.list[i].Id);
                    }
                }
                if (action.action == "delete") {
                    this.$.repo.deleteTasks(self.refreshList, items, self);
                }
            },
            refreshList: function (self) {
                self.$.maList.pagination.page = 1;
                self.async(function () {
                    self.$.repo.getTasks(self.taskListCallback, self.$.maList.pagination, self);
                }, null, 200);
            },
            loadList: function () {
                this.$.repo.getTasks(this.taskListCallback, this.$.maList.pagination, this);
            },
            taskListCallback: function (taskList, total, self) {
                self.$.maList.pagination.total = total;
                self.list = [];
                for (var key in taskList) {
                    self.list.push({
                        Id: taskList[key].Id,
                        checked: false,
                        Details: taskList[key].Details,
                        Deadline: taskList[key].DeadLine,
                        CompletedDateTime: taskList[key].CompletedDateTime
                    });
                }
            }
        });
    ;

        Polymer('ma-page-my-profile', {
            userModel: {},
            ready: function() {
                this.$.repo.getUser(this.getUserCallback, this);
            },
            getUserCallback: function(user, self) {
                self.userModel = user;
            },
            saveUser: function() {
                this.$.repo.saveUser(this.userModel, this.saveUserCallback, this);
            },
            saveUserCallback: function(user, errors, self) {
                if (user) {
                    self.$.toastSuccess.text = "Changes Saved!";
                    self.$.toastSuccess.show();
                }
                else {
                    self.$.toastError.text = self.$.utils.errorsToStr(errors);
                    self.$.toastError.show();
                }
            }
        });
    ;

    (function() {

      function toNumber(value, allowInfinity) {
        return (allowInfinity && value === 'Infinity') ? Number.POSITIVE_INFINITY : Number(value);
      };

      Polymer('core-animation',{
       /**
        * Fired when the animation completes.
        *
        * @event core-animation-finish
        */

       /**
        *
        * Fired when the web animation object changes.
        *
        * @event core-animation-change
        */

        publish: {

          /**
           * One or more nodes to animate.
           *
           * @property target
           * @type HTMLElement|Node|Array<HTMLElement|Node>
           */
          target: {value: null, reflect: true},

          /**
           * Animation keyframes specified as an array of dictionaries of
           * &lt;css properties&gt;:&lt;array of values&gt; pairs. For example,
           *
           * @property keyframes
           * @type Object
           */
          keyframes: {value: null, reflect: true},

          /**
           * A custom animation function. Either provide this or `keyframes`. The signature
           * of the callback is `EffectsCallback(timeFraction, target, animation)`
           *
           * @property customEffect
           * @type Function(number, Object, Object)
           */
          customEffect: {value: null, reflect: true},

          /**
           * Controls the composition behavior. If set to "replace", the effect overrides
           * the underlying value for the target. If set the "add", the effect is added to
           * the underlying value for the target. If set to "accumulate", the effect is
           * accumulated to the underlying value for the target.
           *
           * In cases such as numbers or lengths, "add" and "accumulate" produce the same
           * value. In list values, "add" is appending to the list, while "accumulate" is
           * adding the individual components of the list.
           *
           * For example, adding `translateX(10px)` and `translateX(25px)` produces
           * `translateX(10px) translateX(25px)` and accumulating produces `translateX(35px)`.
           *
           * @property composite
           * @type "replace"|"add"|"accumulate"
           * @default "replace"
           */
          composite: {value: 'replace', reflect: true},

          /**
           * Animation duration in milliseconds, "Infinity", or "auto". "auto" is
           * equivalent to 0.
           *
           * @property duration
           * @type number|"Infinity"
           * @default "auto"
           */
          duration: {value: 'auto', reflect: true},

          /**
           * Controls the effect the animation has on the target when it's not playing.
           * The possible values are "none", "forwards", "backwards", "both" or "auto".
           *
           * "none" means the animation has no effect when it's not playing.
           *
           * "forwards" applies the value at the end of the animation after it's finished.
           *
           * "backwards" applies the value at the start of the animation to the target
           * before it starts playing and has no effect when the animation finishes.
           *
           * "both" means "forwards" and "backwards". "auto" is equivalent to "none".
           *
           * @property fill
           * @type "none"|"forwards"|"backwards"|"both"|"auto"
           * @default "auto"
           */
          fill: {value: 'auto', reflect: true},

          /**
           * A transition timing function. The values are equivalent to the CSS
           * counterparts.
           *
           * @property easing
           * @type string
           * @default "linear"
           */
          easing: {value: 'linear', reflect: true},

          /**
           * The number of milliseconds to delay before beginning the animation.
           *
           * @property delay
           * @type Number
           * @default 0
           */
          delay: {value: 0, reflect: true},

          /**
           * The number of milliseconds to wait after the animation finishes. This is
           * useful, for example, in an animation group to wait for some time before
           * beginning the next item in the animation group.
           *
           * @property endDelay
           * @type number
           * @default 0
           */
          endDelay: {value: 0, reflect: true},

          /**
           * The number of iterations this animation should run for.
           *
           * @property iterations
           * @type Number|'Infinity'
           * @default 1
           */
          iterations: {value: 1, reflect: true},

          /**
           * Number of iterations into the animation in which to begin the effect.
           * For example, setting this property to 0.5 and `iterations` to 2 will
           * cause the animation to begin halfway through the first iteration but still
           * run twice.
           *
           * @property iterationStart
           * @type Number
           * @default 0
           */
          iterationStart: {value: 0, reflect: true},

          /**
           * (not working in web animations polyfill---do not use)
           *
           * Controls the iteration composition behavior. If set to "replace", the effect for
           * every iteration is independent of each other. If set to "accumulate", the effect
           * for iterations of the animation will build upon the value in the previous iteration.
           *
           * Example:
           *
           *    // Moves the target 50px on the x-axis over 5 iterations.
           *    <core-animation iterations="5" iterationComposite="accumulate">
           *      <core-animation-keyframe>
           *        <core-animation-prop name="transform" value="translateX(10px)"></core-animation-prop>
           *      </core-animation-keyframe>
           *    </core-animation>
           *
           * @property iterationComposite
           * @type "replace"|"accumulate"
           * @default false
           */
          iterationComposite: {value: 'replace', reflect: true},

          /**
           * The playback direction of the animation. "normal" plays the animation in the
           * normal direction. "reverse" plays it in the reverse direction. "alternate"
           * alternates the playback direction every iteration such that even iterations are
           * played normally and odd iterations are reversed. "alternate-reverse" plays
           * even iterations in the reverse direction and odd iterations in the normal
           * direction.
           *
           * @property direction
           * @type "normal"|"reverse"|"alternate"|"alternate-reverse"
           * @default "normal"
           */
          direction: {value: 'normal', reflect: true},

          /**
           * A multiplier to the playback rate to the animation.
           *
           * @property playbackRate
           * @type number
           * @default 1
           */
          playbackRate: {value: 1, reflect: true},

          /**
           * If set to true, play the animation when it is created or a property is updated.
           *
           * @property autoplay
           * @type boolean
           * @default false
           */
          autoplay: {value: false, reflect: true}

        },

        animation: false,

        observe: {
          target: 'apply',
          keyframes: 'apply',
          customEffect: 'apply',
          composite: 'apply',
          duration: 'apply',
          fill: 'apply',
          easing: 'apply',
          iterations: 'apply',
          iterationStart: 'apply',
          iterationComposite: 'apply',
          delay: 'apply',
          endDelay: 'apply',
          direction: 'apply',
          playbackRate: 'apply',
          autoplay: 'apply'
        },

        ready: function() {
          this.apply();
        },

        /**
         * Plays the animation. If the animation is currently paused, seeks the animation
         * to the beginning before starting playback.
         *
         * @method play
         * @return AnimationPlayer The animation player.
         */
        play: function() {
          this.apply();
          if (this.animation && !this.autoplay) {
            this.player = document.timeline.play(this.animation);
            this.player.onfinish = this.animationFinishHandler.bind(this);
            return this.player;
          }
        },

        /**
         * Stops the animation and clears all effects on the target.
         *
         * @method cancel
         */
        cancel: function() {
          if (this.player) {
            this.player.cancel();
          }
        },

        /**
         * Seeks the animation to the end.
         *
         * @method finish
         */
        finish: function() {
          if (this.player) {
            this.player.finish();
          }
        },

        /**
         * Pauses the animation.
         *
         * @method pause
         */
        pause: function() {
          if (this.player) {
            this.player.pause();
          }
        },

        /**
         * @method hasTarget
         * @return boolean True if `target` is defined.
         */
        hasTarget: function() {
          return this.target !== null;
        },

        /**
         * Creates a web animations object based on this object's properties, and
         * plays it if autoplay is true.
         *
         * @method apply
         * @return Object A web animation.
         */
        apply: function() {
          this.animation = this.makeAnimation();
          if (this.autoplay && this.animation) {
            this.play();
          }
          return this.animation;
        },

        makeSingleAnimation: function(target) {
          // XXX(yvonne): for selecting all the animated elements.
          target.classList.add('core-animation-target');
          return new Animation(target, this.animationEffect, this.timingProps);
        },

        makeAnimation: function() {
          if (!this.target) {
            return null;
          }
          var animation;
          if (Array.isArray(this.target)) {
            var array = [];
            this.target.forEach(function(t) {
              array.push(this.makeSingleAnimation(t));
            }.bind(this));
            animation = new AnimationGroup(array);
          } else {
            animation = this.makeSingleAnimation(this.target);
          }
          return animation;
        },

        animationChanged: function() {
          // Sending 'this' with the event so you can always get the animation object
          // that fired the event, due to event retargetting in shadow DOM.
          this.fire('core-animation-change', this);
        },

        targetChanged: function(old) {
          if (old) {
            old.classList.remove('core-animation-target');
          }
        },

        get timingProps() {
          var props = {};
          var timing = {
            delay: {isNumber: true},
            endDelay: {isNumber: true},
            fill: {},
            iterationStart: {isNumber: true},
            iterations: {isNumber: true, allowInfinity: true},
            duration: {isNumber: true},
            playbackRate: {isNumber: true},
            direction: {},
            easing: {}
          };
          for (t in timing) {
            if (this[t] !== null) {
              var name = timing[t].property || t;
              props[name] = timing[t].isNumber && this[t] !== 'auto' ?
                  toNumber(this[t], timing[t].allowInfinity) : this[t];
            }
          }
          return props;
        },

        get animationEffect() {
          var props = {};
          var frames = [];
          var effect;
          if (this.keyframes) {
            frames = this.keyframes;
          } else if (!this.customEffect) {
            var children = this.querySelectorAll('core-animation-keyframe');
            if (children.length === 0 && this.shadowRoot) {
              children = this.shadowRoot.querySelectorAll('core-animation-keyframe');
            }
            Array.prototype.forEach.call(children, function(c) {
              frames.push(c.properties);
            });
          }
          if (this.customEffect) {
            effect = this.customEffect;
          } else {
            // effect = new KeyframeEffect(frames, this.composite);
            effect = frames;
          }
          return effect;
        },

        animationFinishHandler: function() {
          this.fire('core-animation-finish');
        }

      });
    })();
  ;

    Polymer('core-animation-keyframe',{
      publish: {
        /**
         * An offset from 0 to 1.
         *
         * @property offset
         * @type Number
         */
        offset: {value: null, reflect: true}
      },
      get properties() {
        var props = {};
        var children = this.querySelectorAll('core-animation-prop');
        Array.prototype.forEach.call(children, function(c) {
          props[c.name] = c.value;
        });
        if (this.offset !== null) {
          props.offset = this.offset;
        }
        return props;
      }
    });
  ;

    Polymer('core-animation-prop',{
      publish: {
        /**
         * A CSS property name.
         *
         * @property name
         * @type string
         */
        name: {value: '', reflect: true},

        /**
         * The value for the CSS property.
         *
         * @property value
         * @type string|number
         */
        value: {value: '', reflect: true}
      }
    });
  ;

    (function() {

      var ANIMATION_GROUPS = {
        'par': AnimationGroup,
        'seq': AnimationSequence
      };

      Polymer('core-animation-group',{

        publish: {
          /**
           * If target is set, any children without a target will be assigned the group's
           * target when this property is set.
           *
           * @property target
           * @type HTMLElement|Node|Array|Array<HTMLElement|Node>
           */

          /**
           * For a `core-animation-group`, a duration of "auto" means the duration should
           * be the specified duration of its children. If set to anything other than
           * "auto", any children without a set duration will be assigned the group's duration.
           *
           * @property duration
           * @type number
           * @default "auto"
           */
          duration: {value: 'auto', reflect: true},

          /**
           * The type of the animation group. 'par' creates a parallel group and 'seq' creates
           * a sequential group.
           *
           * @property type
           * @type String
           * @default 'par'
           */
          type: {value: 'par', reflect: true}
        },

        typeChanged: function() {
          this.apply();
        },

        targetChanged: function() {
          // Only propagate target to children animations if it's defined.
          if (this.target) {
            this.doOnChildren(function(c) {
              c.target = this.target;
            }.bind(this));
          }
        },

        durationChanged: function() {
          if (this.duration && this.duration !== 'auto') {
            this.doOnChildren(function(c) {
              // Propagate to children that is not a group and has no
              // duration specified.
              if (!c.type && (!c.duration || c.duration === 'auto')) {
                c.duration = this.duration;
              }
            }.bind(this));
          }
        },

        doOnChildren: function(inFn) {
          var children = this.children;
          if (!children.length) {
            children = this.shadowRoot ? this.shadowRoot.childNodes : [];
          }
          Array.prototype.forEach.call(children, function(c) {
            // TODO <template> in the way
            c.apply && inFn(c);
          }, this);
        },

        makeAnimation: function() {
          return new ANIMATION_GROUPS[this.type](this.childAnimations, this.timingProps);
        },

        hasTarget: function() {
          var ht = this.target !== null;
          if (!ht) {
            this.doOnChildren(function(c) {
              ht = ht || c.hasTarget();
            }.bind(this));
          }
          return ht;
        },

        apply: function() {
          // Propagate target and duration to child animations first.
          this.durationChanged();
          this.targetChanged();
          this.doOnChildren(function(c) {
            c.apply();
          });
          return this.super();
        },

        get childAnimationElements() {
          var list = [];
          this.doOnChildren(function(c) {
            if (c.makeAnimation) {
              list.push(c);
            }
          });
          return list;
        },

        get childAnimations() {
          var list = [];
          this.doOnChildren(function(c) {
            if (c.animation) {
              list.push(c.animation);
            }
          });
          return list;
        }
      });

    })();
  ;

        Polymer('mail-popup', {
            newItemModel: {},
            sendMail: function () {
                this.$.repo.sendMail(this.sendMailCallback, this.newItemModel, this);
            },
            sendMailCallback: function (success, errors, self) {
                if (success) {
                    self.$.newItemPopup.close();
                    self.$.toastSuccess.text = "Message Sent";
                    self.$.toastSuccess.show();
                } else {
                    var errorVals = [];
                    errors.forEach(function (err) {
                        errorVals.push(err.error);
                    });
                    self.$.toastError.text = errorVals.join(', ');
                    self.$.toastError.show();
                }
            },
            newItem: function () {
                this.newItemModel = {Receiver: "", Title: "", Message: ""};
                this.$.newItemPopup.toggle();
            }
        });
    ;

        Polymer('mail-item', {
            item: {},
            observe: {
                'item.checked': 'checkedChanged'
            },
            checkedChanged: function (oldValue, newValue) {
                if (newValue) {
                    this.$.checked.checked = "checked";
                } else {
                    this.$.checked.checked = "";
                }
            },
            showDetails: function (event, details, target) {
                var animation = this.$.pageAnimation;
                var itemId = target.dataset.itemid;
                var willHide = false;
                if (this.item.selected) {
                    willHide = true;
                }
                this.fire('reset-list-selected', {selected: false});
                if (!willHide)
                    this.item.selected = true;
                animation.target = target.parentElement.querySelector(".item-details");
                animation.fill = "forwards";
                animation.duration = 200;
                this.player = animation.play();
            },
            checkboxSelected: function (event) {
                this.item.checked = event.target.checked;
                event.stopPropagation();
            }
        });
    ;

        Polymer('ma-page-mails', {
            list: [],
            player: {},
            ready: function () {
                var self = this;
                self.$.maList.pagination.page = 1;
                self.$.maList.pagination.total = 0;
                self.$.maList.addEventListener("page-changed", function () {
                    self.loadList();
                });
                self.$.maList.addEventListener("reset-list-selected", function (e) {
                    self.resetListSelected(e.detail.selected);
                });
                self.$.maList.addEventListener("reset-list-checked", function (e) {
                    self.resetListChecked(e.detail.selected);
                });
                self.$.maList.addEventListener("action-trigger", function (e) {
                    self.actionTrigger(e.detail);
                });
                self.$.realTimeClient.addEventListener('new-notifications', function (e) {
                    var updateList = false;
                    for (var i = 0; i <= e.detail.length - 1; i++) {
                        if (e.detail[i].NotificationType__Id == 1) {
                            updateList = true;
                            break;
                        }
                    }
                    if (updateList) { self.refreshList(self); }
                });
                this.loadList();
            },
            listChanged: function () {
                var self = this;
                self.async(function () {
                    for (var i in self.list) {
                        for (var j in self.$.maList.childNodes) {
                            if (self.$.maList.childNodes[j].id == "maItem" + self.list[i].Id) {
                                self.$.maList.childNodes[j].item = self.list[i];
                            }
                        }
                    }
                }, null, 0);
            },
            actionTrigger:function(action){
                var self = this;
                var items = [];
                for(var i in self.list){
                    if(self.list[i].checked) {
                        items.push(self.list[i].Id);
                    }
                }
                if(action.action == "delete"){
                    this.$.repo.deleteMails(self.refreshList, items, self);
                }
            },
            resetListChecked: function (selected) {
                for (var i in this.list) {
                    this.list[i].checked = selected;
                }
            },
            resetListSelected: function (selected) {
                for (var i in this.list) {
                    this.list[i].selected = selected;
                }
            },
            refreshList: function (self) {
                self.$.maList.pagination.page = 1;
                self.async(function(){
                    self.$.repo.getMails(self.mailListCallback, self.$.maList.pagination, self);
                },null,200);
            },
            newItem: function () {
                this.$.mailPopup.newItem();
            },
            loadList: function () {
                this.$.repo.getMails(this.mailListCallback, this.$.maList.pagination, this);
            },
            mailListCallback: function (list, total, self) {
                self.$.maList.pagination.total = total;
                self.list = [];
                for (var key in list) {
                    self.list.push({
                        Id: list[key].Id,
                        checked: false,
                        Title: list[key].Title,
                        Message: list[key].Message,
                        SentDate: list[key].SentDate,
                        Sender: list[key].Sender
                    });
                }
            }
        });
    ;

        Polymer('material-admin-main', {
            routeUrl: '',
            page: {},
            ready: function() {
                this.pageChanged();
            },
            pageChanged: function() {
                var self = this;
                self.$.pageWrapper.style.display = "none";
                self.async(function() {
                    var selectedPage = self.$.pageWrapper.querySelector(".core-selected");
                    if(selectedPage == null)
                        return;
                    var pageElement = selectedPage.querySelector("ma-page-" + self.page.Link);
                    if(pageElement != null)
                        pageElement.parentElement.removeChild(pageElement);
                        //Polymer.import([self.$.utils.getBaseUrl() + this.page.Url.replace(/^\//, '')], function () {
                            if (selectedPage != null) {
                                selectedPage.innerHTML = "";
                                var div = document.createElement("div");
                                div.innerHTML = "<ma-page-" + self.page.Link + "></ma-page-" + self.page.Link + ">";
                                selectedPage.appendChild(div.childNodes[0]);
                                self.$.pageWrapper.style.display = "";
                            }
                        //});

                }, null, 0);
            }
        });
    ;

        Polymer('material-admin', {
            route: "",
            pages: [],
            page: {},
            ready: function () {
                this.$.maConfigRepo.getPages(this.pagesCallback, this);
            },
            routeChanged: function () {
                for (var key in this.pages) {
                    if (this.pages[key].Link == this.route.trim()) {
                        this.page = this.pages[key];
                        break;
                    }
                }
            },
            pagesCallback: function (items, self) {
                for (var i = 0; i <= items.length - 1; i++) {
                    self.pages.push(items[i]);
                }
                ;
                if (self.route.trim() == '') {
                    self.route = self.pages[0].Link;
                    self.page = self.pages[0];
                    location.hash = self.pages[0].Link;
                } else {
                    self.routeChanged();
                }
            }
        });
    