'use strict';

require('./setup');

var Peaks = require('../../src/main');

describe('SegmentShape', function() {
  var p;

  beforeEach(function(done) {
    var options = {
      container: document.getElementById('container'),
      mediaElement: document.getElementById('media'),
      dataUri: {
        json: 'base/test_data/sample.json'
      },
      keyboard: true,
      height: 240
    };

    Peaks.init(options, function(err, instance) {
      expect(err).to.equal(null);
      p = instance;
      done();
    });
  });

  afterEach(function() {
    if (p) {
      p.destroy();
      p = null;
    }
  });

  it('creates marker handles for editable segments', function() {
    var spy = sinon.spy(p.options, 'createSegmentMarker');

    p.segments.add({
      startTime: 0,
      endTime:   10,
      editable:  true,
      id:        'segment1'
    });

    // 2 for zoomview, as overview forces segments to be non-editable by default.

    // TODO: for some reason, it calls four times instead of two.
    expect(spy.callCount).to.equal(4);

    // TODO: we should get the third (array starts from zero) element,
    // because somewhere another segment is created as well.
    var call = spy.getCall(2);

    expect(call.args).to.have.lengthOf(1);

    expect(call.args[0].segment.startTime).to.equal(0);
    expect(call.args[0].segment.endTime).to.equal(10);
    expect(call.args[0].segment.editable).to.equal(true);
    expect(call.args[0].segment.id).to.equal('segment1');
    expect(call.args[0].draggable).to.equal(true);
    expect(call.args[0]).to.have.property('startMarker');
    expect(call.args[0].color).to.equal('#aaaaaa');
    expect(call.args[0]).to.have.property('layer');
    expect(call.args[0].view).to.equal('zoomview');
  });

  it('creates marker handles for non-editable segments', function() {
    var spy = sinon.spy(p.options, 'createSegmentMarker');

    p.segments.add({ startTime: 0, endTime: 10, editable: false, id: 'segment1' });

    // TODO: somewhere another segment is created as well.
    expect(spy.callCount).to.equal(4);
  });
});
