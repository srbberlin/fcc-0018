(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

module.exports = function (data) {
  var fmt = d3.format('.3f');
  var scy = d3.scaleLinear().domain(data.yearDomain()).range([0, 250]);
  var scm = d3.scaleLinear().domain(data.monthDomain()).range([0, 100]);
  var scc = d3.scaleSequential(d3.interpolateYlOrRd).domain(data.varianceDomain());

  var mouseOver = function mouseOver() {
    box.attr('display', null);
  };

  var mouseMove = function mouseMove(d) {
    var x = Math.round(d3.event.layerX) + 90;
    var y = Math.round(d3.event.layerY) + 10;
    box.attr('transform', 'translate(' + x + ',' + y + ')');
    box.select('#d').text(d.year + ', ' + data.monthData()[d.month - 1][0]);
    box.select('#v').text(fmt(d.variance + data.baseTemperature()) + ' (' + fmt(d.variance) + ') °C');
  };

  var mouseOut = function mouseOut() {
    box.attr('display', 'none');
  };

  d3.select('#canvas').selectAll('g').data(data.yearData()).enter().selectAll('rect').data(function (d) {
    return d;
  }).enter().append('rect').on('mouseover', mouseOver).on('mousemove', mouseMove).on('mouseout', mouseOut).attr('x', function (d) {
    return scy(d.year);
  }).attr('y', function (d) {
    return scm(d.month);
  }).attr('width', 2).attr('height', 9).attr('style', function (d) {
    return 'fill: ' + scc(d.variance);
  });
  var box = d3.select('#box').attr('display', 'none');
  box.append('rect').attr('id', 'b').attr('width', 42).attr('height', 23);
  box.append('text').attr('id', 'd');
  box.append('text').attr('id', 'v');
};

},{}],2:[function(require,module,exports){
"use strict";

var res = function () {
  var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
  var data;

  var _baseTemperature;

  var _varianceDomain;

  var _monthDomain;

  var _yearDomain;

  return {
    do: function _do(f) {
      d3.json(url, function (error, res) {
        if (error) {
          console.log(res.status, res.responseText);
        } else {
          var actYear = 0;
          var thisYear;
          _baseTemperature = res.baseTemperature;
          _yearDomain = d3.extent(res.monthlyVariance, function (d) {
            return d.year;
          });
          _monthDomain = [1, 12];
          _varianceDomain = d3.extent(res.monthlyVariance, function (d) {
            return (d.variance + 1) / 2;
          });
          data = res.monthlyVariance.reduce(function (p, c) {
            if (actYear !== c.year) {
              actYear = c.year;
              p.push(thisYear = []);
            }

            thisYear.push(c);
            return p;
          }, []);
          f();
        }
      });
    },
    sel: function sel(fYear, fMonth) {
      fYear += 'y';
      return data[fYear][fMonth - 1];
    },
    baseTemperature: function baseTemperature() {
      return _baseTemperature;
    },
    varianceDomain: function varianceDomain() {
      return _varianceDomain;
    },
    monthDomain: function monthDomain() {
      return _monthDomain;
    },
    monthData: function monthData() {
      return [['January', 1], ['February', 2], ['March', 3], ['April', 4], ['May', 5], ['June', 6], ['July', 7], ['August', 8], ['September', 9], ['October', 10], ['November', 11], ['December', 12]];
    },
    yearDomain: function yearDomain() {
      return _yearDomain;
    },
    yearData: function yearData() {
      return data;
    }
  };
}();

module.exports = res;

},{}],3:[function(require,module,exports){
"use strict";

var data = require('./data.js');

data.do(function () {
  require('./yaxis.js')(data);

  require('./xaxis.js')(data);

  require('./canvas.js')(data);
});

},{"./canvas.js":1,"./data.js":2,"./xaxis.js":4,"./yaxis.js":5}],4:[function(require,module,exports){
"use strict";

module.exports = function (data) {
  var sc = d3.scaleLinear().domain(data.yearDomain()).range([0, 251]);
  var ax = d3.axisBottom(sc).tickFormat(d3.format('d'));
  d3.select('#bottomAxis').attr('transform', 'translate(83, 155)').attr('style', 'font-family: sans-serif; font-size: 5px').call(ax);
};

},{}],5:[function(require,module,exports){
"use strict";

module.exports = function (data) {
  var sc = d3.scaleLinear().domain(data.monthDomain()).range([0, 100]);
  var root = d3.select('#leftAxis').attr('transform', 'translate(0, 40)').attr('style', 'font-family: sans-serif; font-size: 5px').selectAll('g').data(data.monthData()).enter().append('g');
  root.append('text').attr('text-anchor', 'end').text(function (d) {
    return d[0];
  }).attr('y', function (d) {
    return sc(d[1]) + 6;
  }).attr('x', 78);
};

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY2FudmFzLmpzIiwic3JjL2pzL2RhdGEuanMiLCJzcmMvanMvaW5kZXguanMiLCJzcmMvanMveGF4aXMuanMiLCJzcmMvanMveWF4aXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQUMsSUFBRCxFQUFVO0FBQ3pCLE1BQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFILENBQVUsS0FBVixDQUFWO0FBRUEsTUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLFdBQUgsR0FDUCxNQURPLENBQ0EsSUFBSSxDQUFDLFVBQUwsRUFEQSxFQUVQLEtBRk8sQ0FFRCxDQUFDLENBQUQsRUFBSSxHQUFKLENBRkMsQ0FBVjtBQUlBLE1BQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxXQUFILEdBQ1AsTUFETyxDQUNBLElBQUksQ0FBQyxXQUFMLEVBREEsRUFFUCxLQUZPLENBRUQsQ0FBQyxDQUFELEVBQUksR0FBSixDQUZDLENBQVY7QUFJQSxNQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsZUFBSCxDQUFtQixFQUFFLENBQUMsaUJBQXRCLEVBQ1AsTUFETyxDQUNBLElBQUksQ0FBQyxjQUFMLEVBREEsQ0FBVjs7QUFHQSxNQUFJLFNBQVMsR0FBRyxTQUFaLFNBQVksR0FBTTtBQUNwQixJQUFBLEdBQUcsQ0FBQyxJQUFKLENBQVMsU0FBVCxFQUFvQixJQUFwQjtBQUNELEdBRkQ7O0FBSUEsTUFBSSxTQUFTLEdBQUcsU0FBWixTQUFZLENBQUMsQ0FBRCxFQUFPO0FBQ3JCLFFBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFMLENBQVcsRUFBRSxDQUFDLEtBQUgsQ0FBUyxNQUFwQixJQUE4QixFQUF0QztBQUNBLFFBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFMLENBQVcsRUFBRSxDQUFDLEtBQUgsQ0FBUyxNQUFwQixJ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QUhILENBR1EsVUFBQSxDQUFDLEVBQUk7QUFBRSxXQUFPLENBQUMsQ0FBQyxDQUFELENBQVI7QUFBYSxHQUg1QixFQUlHLElBSkgsQ0FJUSxHQUpSLEVBSWEsVUFBQSxDQUFDLEVBQUk7QUFBRSxXQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBRCxDQUFGLENBQUYsR0FBVyxDQUFsQjtBQUFxQixHQUp6QyxFQUtHLElBTEgsQ0FLUSxHQUxSLEVBS2EsRUFMYjtBQU1ELENBbkJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibW9kdWxlLmV4cG9ydHMgPSAoZGF0YSkgPT4ge1xuICBsZXQgZm10ID0gZDMuZm9ybWF0KCcuM2YnKVxuXG4gIGxldCBzY3kgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgLmRvbWFpbihkYXRhLnllYXJEb21haW4oKSlcbiAgICAucmFuZ2UoWzAsIDI1MF0pXG4gIFxuICBsZXQgc2NtID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgIC5kb21haW4oZGF0YS5tb250aERvbWFpbigpKVxuICAgIC5yYW5nZShbMCwgMTAwXSlcblxuICBsZXQgc2NjID0gZDMuc2NhbGVTZXF1ZW50aWFsKGQzLmludGVycG9sYXRlWWxPclJkKVxuICAgIC5kb21haW4oZGF0YS52YXJpYW5jZURvbWFpbigpKVxuXG4gIGxldCBtb3VzZU92ZXIgPSAoKSA9PiB7XG4gICAgYm94LmF0dHIoJ2Rpc3BsYXknLCBudWxsKVxuICB9XG4gIFxuICBsZXQgbW91c2VNb3ZlID0gKGQpID0+IHtcbiAgICBsZXQgeCA9IE1hdGgucm91bmQoZDMuZXZlbnQubGF5ZXJYKSArIDkwXG4gICAgbGV0IHkgPSBNYXRoLnJvdW5kKGQzLmV2ZW50LmxheWVyWSkgKyAxMFxuXG4gICAgYm94XG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgeCArICcsJyArIHkgKyAnKScpXG4gICAgXG4gICAgYm94XG4gICAgICAuc2VsZWN0KCcjZCcpXG4gICAgICAudGV4dChkLnllYXIgKyAnLCAnICsgZGF0YS5tb250aERhdGEoKVtkLm1vbnRoIC0gMV1bMF0pXG5cbiAgICBib3hcbiAgICAgIC5zZWxlY3QoJyN2JylcbiAgICAgIC50ZXh0KGZtdChkLnZhcmlhbmNlICsgZGF0YS5iYXNlVGVtcGVyYXR1cmUoKSkgKyAnICgnICsgZm10KGQudmFyaWFuY2UpICsgJykgwrBDJylcbiAgfVxuICAgIFxuICBsZXQgbW91c2VPdXQgPSAoKSA9PiB7XG4gICAgYm94LmF0dHIoJ2Rpc3BsYXknLCAnbm9uZScpXG4gIH1cbiAgICBcbiAgZDMuc2VsZWN0KCcjY2FudmFzJylcbiAgICAuc2VsZWN0QWxsKCdnJylcbiAgICAuZGF0YShkYXRhLnllYXJEYXRhKCkpXG4gICAgLmVudGVyKClcbiAgICAuc2VsZWN0QWxsKCdyZWN0JylcbiAgICAuZGF0YSggKGQpID0+IHsgcmV0dXJuIGQgfSApXG4gICAgLmVudGVyKClcbiAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAub24oJ21vdXNlb3ZlcicsIG1vdXNlT3ZlcilcbiAgICAub24oJ21vdXNlbW92ZScsIG1vdXNlTW92ZSlcbiAgICAub24oJ21vdXNlb3V0JywgbW91c2VPdXQpXG4gICAgLmF0dHIoJ3gnLCBkID0+IHsgcmV0dXJuIHNjeShkLnllYXIpIH0pXG4gICAgLmF0dHIoJ3knLCBkID0+IHsgcmV0dXJuIHNjbShkLm1vbnRoKSB9KVxuICAgIC5hdHRyKCd3aWR0aCcsIDIpXG4gICAgLmF0dHIoJ2hlaWdodCcsIDkpXG4gICAgLmF0dHIoJ3N0eWxlJywgKGQpID0+IHtcbiAgICAgIHJldHVybiAnZmlsbDogJyArIHNjYyhkLnZhcmlhbmNlKVxuICAgIH0pXG5cbiAgbGV0IGJveCA9IGQzLnNlbGVjdCgnI2JveCcpXG4gICAgLmF0dHIoJ2Rpc3BsYXknLCAnbm9uZScpXG5cbiAgYm94XG4gICAgLmFwcGVuZCgncmVjdCcpXG4gICAgLmF0dHIoJ2lkJywgJ2InKVxuICAgIC5hdHRyKCd3aWR0aCcsIDQyKVxuICAgIC5hdHRyKCdoZWlnaHQnLCAyMykgIFxuXG4gIGJveFxuICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgIC5hdHRyKCdpZCcsICdkJylcbiAgXG4gIGJveFxuICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgIC5hdHRyKCdpZCcsICd2Jylcbn1cbiIsImxldCByZXMgPSAoKCkgPT4ge1xuICBsZXQgdXJsID0gJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9GcmVlQ29kZUNhbXAvUHJvamVjdFJlZmVyZW5jZURhdGEvbWFzdGVyL2dsb2JhbC10ZW1wZXJhdHVyZS5qc29uJ1xuICBsZXQgZGF0YVxuICBsZXQgYmFzZVRlbXBlcmF0dXJlXG4gIGxldCB2YXJpYW5jZURvbWFpblxuICBsZXQgbW9udGhEb21haW5cbiAgbGV0IHllYXJEb21haW5cbiAgXG4gIHJldHVybiB7XG4gICAgZG86IChmKSA9PiB7XG4gICAgICBkMy5qc29uKHVybCwgKGVycm9yLCByZXMpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzLnN0YXR1cywgcmVzLnJlc3BvbnNlVGV4dClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBsZXQgYWN0WWVhciA9IDBcbiAgICAgICAgICBsZXQgdGhpc1llYXJcbiAgICAgICAgICBiYXNlVGVtcGVyYXR1cmUgPSByZXMuYmFzZVRlbXBlcmF0dXJlXG4gICAgICAgICAgeWVhckRvbWFpbiA9IGQzLmV4dGVudChyZXMubW9udGhseVZhcmlhbmNlLCAoZCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGQueWVhclxuICAgICAgICAgIH0pXG4gICAgICAgICAgbW9udGhEb21haW4gPSBbMSwgMTJdXG4gICAgICAgICAgdmFyaWFuY2VEb21haW4gPSBkMy5leHRlbnQocmVzLm1vbnRobHlWYXJpYW5jZSwgKGQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoZC52YXJpYW5jZSArIDEpIC8gMiBcbiAgICAgICAgICB9KVxuICAgICAgICAgIGRhdGEgPSByZXMubW9udGhseVZhcmlhbmNlLnJlZHVjZSgocCxjKSA9PiB7XG4gICAgICAgICAgICBpZiAoYWN0WWVhciAhPT0gYy55ZWFyKSB7XG4gICAgICAgICAgICAgIGFjdFllYXIgPSBjLnllYXJcbiAgICAgICAgICAgICAgcC5wdXNoKHRoaXNZZWFyID0gW10pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzWWVhci5wdXNoKGMpXG4gICAgICAgICAgICByZXR1cm4gcFxuICAgICAgICAgIH0sIFtdKVxuICAgICAgICAgIGYoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sXG4gICAgc2VsOiAoZlllYXIsIGZNb250aCkgPT4ge1xuICAgICAgZlllYXIgKz0gJ3knXG4gICAgICByZXR1cm4gZGF0YVtmWWVhcl1bZk1vbnRoIC0gMV1cbiAgICB9LFxuICAgIGJhc2VUZW1wZXJhdHVyZTogKCkgPT4geyByZXR1cm4gYmFzZVRlbXBlcmF0dXJlIH0sXG4gICAgdmFyaWFuY2VEb21haW46ICgpID0+IHsgcmV0dXJuIHZhcmlhbmNlRG9tYWluIH0sXG4gICAgbW9udGhEb21haW46ICgpID0+IHsgcmV0dXJuIG1vbnRoRG9tYWluIH0sXG4gICAgbW9udGhEYXRhOiAoKSA9PiB7IFxuICAgICAgcmV0dXJuIFsgXG4gICAgICAgIFsnSmFudWFyeScsMV0sIFxuICAgICAgICBbJ0ZlYnJ1YXJ5JywyXSwgXG4gICAgICAgIFsnTWFyY2gnLDNdLCBcbiAgICAgICAgWydBcHJpbCcsNF0sIFxuICAgICAgICBbJ01heScsNV0sIFxuICAgICAgICBbJ0p1bmUnLDZdLCBcbiAgICAgICAgWydKdWx5Jyw3XSwgXG4gICAgICAgIFsnQXVndXN0Jyw4XSwgXG4gICAgICAgIFsnU2VwdGVtYmVyJyw5XSwgXG4gICAgICAgIFsnT2N0b2JlcicsMTBdLCBcbiAgICAgICAgWydOb3ZlbWJlcicsMTFdLCBcbiAgICAgICAgWydEZWNlbWJlcicsMTJdIFxuICAgICAgXSBcbiAgICB9LFxuICAgIHllYXJEb21haW46ICgpID0+IHsgcmV0dXJuIHllYXJEb21haW4gfSxcbiAgICB5ZWFyRGF0YTogKCkgPT4geyByZXR1cm4gZGF0YSB9XG4gIH1cbn0pKClcblxubW9kdWxlLmV4cG9ydHMgPSByZXNcbiIsImNvbnN0IGRhdGEgICA9IHJlcXVpcmUoJy4vZGF0YS5qcycpXG5cbmRhdGEuZG8oKCkgPT4ge1xuICByZXF1aXJlKCcuL3lheGlzLmpzJykgKGRhdGEpXG4gIHJlcXVpcmUoJy4veGF4aXMuanMnKSAoZGF0YSlcbiAgcmVxdWlyZSgnLi9jYW52YXMuanMnKShkYXRhKVxufSlcbiIsIm1vZHVsZS5leHBvcnRzID0gKGRhdGEpID0+IHtcbiAgbGV0IHNjID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgIC5kb21haW4oZGF0YS55ZWFyRG9tYWluKCkpXG4gICAgLnJhbmdlKFswLCAyNTFdKVxuICBcbiAgbGV0IGF4ID0gZDMuYXhpc0JvdHRvbShzYylcbiAgICAudGlja0Zvcm1hdChkMy5mb3JtYXQoJ2QnKSlcblxuICBkMy5zZWxlY3QoJyNib3R0b21BeGlzJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSg4MywgMTU1KScpXG4gICAgLmF0dHIoJ3N0eWxlJywgJ2ZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmOyBmb250LXNpemU6IDVweCcpXG4gICAgLmNhbGwoYXgpXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IChkYXRhKSA9PiB7XG4gIGxldCBzYyA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAuZG9tYWluKGRhdGEubW9udGhEb21haW4oKSlcbiAgICAucmFuZ2UoWzAsIDEwMF0pXG4gIFxuICBsZXQgcm9vdCA9IGQzLnNlbGVjdCgnI2xlZnRBeGlzJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCA0MCknKVxuICAgIC5hdHRyKCdzdHlsZScsICdmb250LWZhbWlseTogc2Fucy1zZXJpZjsgZm9udC1zaXplOiA1cHgnKVxuICAgIC5zZWxlY3RBbGwoJ2cnKVxuICAgIC5kYXRhKGRhdGEubW9udGhEYXRhKCkpXG4gICAgLmVudGVyKClcbiAgICAuYXBwZW5kKCdnJylcblxuICByb290XG4gICAgLmFwcGVuZCgndGV4dCcpXG4gICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ2VuZCcpXG4gICAgLnRleHQoZCA9PiB7IHJldHVybiBkWzBdIH0pXG4gICAgLmF0dHIoJ3knLCBkID0+IHsgcmV0dXJuIHNjKGRbMV0pICsgNiB9KVxuICAgIC5hdHRyKCd4JywgNzgpXG59XG4iXX0=
