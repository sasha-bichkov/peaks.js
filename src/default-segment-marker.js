/**
 * @file
 *
 * Defines the {@link DefaultSegmentMarker} class.
 *
 * @module default-segment-marker
 */

define([
  './utils',
  'konva'
  ], function(
    Utils,
    Konva) {
  'use strict';

  /**
   * Creates a segment marker handle.
   *
   * @class
   * @alias DefaultSegmentMarker
   *
   * @param {CreateSegmentMarkerOptions} options
   */

  function DefaultSegmentMarker(options) {
    this._options = options;
  }

  DefaultSegmentMarker.prototype.init = function(group) {
    var handleWidth  = 10;
    var handleHeight = 20;
    var handleX      = -(handleWidth / 2) + 0.5; // Place in the middle of the marker

    var xPosition = this._options.startMarker ? -8 : 8;

    var time = this._options.startMarker ? this._options.segment.startTime :
                                           this._options.segment.endTime;

    // Label - create with default y, the real value is set in fitToView().
    this._label = new Konva.Text({
      x:          xPosition,
      y:          13,
      text:       Utils.formatTime(time, false),
      fontSize:   10,
      fontFamily: 'sans-serif',
      fontStyle:  'bold',
      fill:       '#000',
      textAlign:  'center'
    });

    this._label.hide();

    // Handle - create with default y, the real value is set in fitToView().
    if (this._options.segment.editable && this._options.showMarkers) {
      var offset = this._options.startMarker ? 0 : -10;

      this._handle = new Konva.Rect({
        x:           offset,
        y:           0,
        width:       handleWidth,
        height:      handleHeight,
        fill:        this._options.color,
        stroke:      this._options.color,
        strokeWidth: 1
      });
    }

    // Vertical Line - create with default y and points, the real values
    // are set in fitToView().
    this._line = new Konva.Line({
      x:           0,
      y:           0,
      stroke:      this._options.color,
      strokeWidth: 2
    });

    this._line.on('mouseover touchstart', function(e) {
      e.evt.target.style.cursor = 'ew-resize';
    });

    this._line.on('mouseout touchend', function(e) {
      e.evt.target.style.cursor = 'default';
    });

    group.add(this._label);
    group.add(this._line);

    if (this._handle) {
      group.add(this._handle);
    }

    this.fitToView();

    this.bindEventHandlers(group);
  };

  DefaultSegmentMarker.prototype.bindEventHandlers = function(group) {
    var self = this;

    var xPosition = self._options.startMarker ? -8 : 8;

    if (self._options.draggable) {
      group.on('dragstart', function() {
        if (self._options.startMarker) {
          self._label.setX(xPosition - self._label.getWidth());
        }

        self._label.show();
        self._options.layer.draw();
      });

      group.on('dragend', function() {
        self._label.hide();
        self._options.layer.draw();
      });
    }

    if (self._handle) {
      self._handle.on('mouseover touchstart', function(e) {
        e.evt.target.style.cursor = 'ew-resize';

        if (self._options.startMarker) {
          self._label.setX(xPosition - self._label.getWidth());
        }

        self._label.show();
        self._options.layer.draw();
      });

      self._handle.on('mouseout touchend', function(e) {
        e.evt.target.style.cursor = 'ew-resize';

        self._label.hide();
        self._options.layer.draw();
      });
    }
  };

  DefaultSegmentMarker.prototype.fitToView = function() {
    var height = this._options.layer.getHeight();

    // this._label.y(height / 2 - 5);

    if (this._handle) {
      this._handle.y(0);
    }

    this._line.points([0.5, 0, 0.5, height]);
  };

  DefaultSegmentMarker.prototype.timeUpdated = function(time) {
    this._label.setText(Utils.formatTime(time, false));
  };

  return DefaultSegmentMarker;
});
