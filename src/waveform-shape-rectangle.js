/**
 * @file
 *
 * Defines the {@link WaveformShapeRectangle} class.
 *
 * @module waveform-shape
 */

define(['./utils', 'konva'], function(Utils, Konva) {
  'use strict';

  /**
   * Waveform shape options.
   *
   * @typedef {Object} WaveformShapeRectangleOptions
   * @global
   * @property {String} color Waveform color.
   * @property {WaveformOverview|WaveformZoomView} view The view object
   *   that contains the waveform shape.
   * @property {Segment?} segment If given, render a waveform image
   *   covering the segment's time range. Otherwise, render the entire
   *   waveform duration.
   */

  /**
   * Creates a Konva.Shape object that renders a waveform image.
   *
   * @class
   * @alias WaveformShapeRectangle
   *
   * @param {WaveformShapeRectangleOptions} options
   */

  function WaveformShapeRectangle(options) {
    Konva.Shape.call(this, {
      fill: options.color,
      opacity: options.opacity
    });

    this._view = options.view;
    this._segment = options.segment;

    this.sceneFunc(this._sceneFunc);
  }

  WaveformShapeRectangle.prototype = Object.create(Konva.Shape.prototype);

  WaveformShapeRectangle.prototype.setWaveformColor = function(color) {
    this.fill(color);
  };

  WaveformShapeRectangle.prototype._sceneFunc = function(context) {
    var frameOffset = this._view.getFrameOffset();
    var width = this._view.getWidth();
    var height = this._view.getHeight();

    this._drawWaveform(
      context,
      this._view.getWaveformData(),
      frameOffset,
      this._segment ? this._view.timeToPixels(this._segment.startTime) : frameOffset,
      this._segment ? this._view.timeToPixels(this._segment.endTime)   : frameOffset + width,
      width,
      height
    );
  };

  /**
   * Draws a waveform on a canvas context.
   *
   * @param {Konva.Context} context The canvas context to draw on.
   * @param {WaveformData} waveformData The waveform data to draw.
   * @param {Number} frameOffset The start position of the waveform shown
   *   in the view, in pixels.
   * @param {Number} startPixels The start position of the waveform to draw,
   *   in pixels.
   * @param {Number} endPixels The end position of the waveform to draw,
   *   in pixels.
   * @param {Number} width The width of the waveform area, in pixels.
   * @param {Number} height The height of the waveform area, in pixels.
   */

  WaveformShapeRectangle.prototype._drawWaveform = function(context, waveformData,
    frameOffset, startPixels, endPixels, width, height) {

    if (startPixels < frameOffset) {
      startPixels = frameOffset;
    }

    var limit = frameOffset + width;

    if (endPixels > limit) {
      endPixels = limit;
    }

    if (endPixels > waveformData.length) {
      endPixels = waveformData.length;
    }

    var channels = waveformData.channels;
    var waveformTop = 0;
    var waveformHeight = Math.floor(height / channels);

    context.beginPath();
    context.rect(startPixels - frameOffset, waveformTop, endPixels - startPixels, waveformHeight);
    context.closePath();
    context.fillShape(this);
  };

  return WaveformShapeRectangle;
});
