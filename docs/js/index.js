(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

module.exports = function (data) {
  var svg = d3.select('svg').node();
  var canvas = d3.select('#canvas');
  var tooltip = d3.select('#tooltip');
  var fmt = d3.format('.3f');
  var scy = d3.scaleLinear().domain(data.yearDomain()).range([0, 250]);
  var scm = d3.scaleLinear().domain(data.monthDomain()).range([0, 100]);
  var scc = d3.scaleSequential(d3.interpolateYlOrRd).domain(data.varianceDomain());

  var mouseOver = function mouseOver() {
    tooltip.attr('display', null);
  };

  var mouseMove = function mouseMove(d) {
    var point = svg.createSVGPoint();
    point.x = d3.event.clientX;
    point.y = d3.event.clientY;
    point = point.matrixTransform(svg.getScreenCTM().inverse());
    tooltip.attr('transform', 'translate(' + (point.x + 5) + ',' + (point.y + 5) + ')').attr('data-year', d.year);
    tooltip.select('#d').text(d.year + ', ' + data.monthData()[d.month - 1]);
    tooltip.select('#v').text(fmt(d.variance + data.baseTemperature()) + ' (' + fmt(d.variance) + ') °C');
  };

  var mouseOut = function mouseOut() {
    tooltip.attr('display', 'none');
  };

  canvas.selectAll('g').data(data.yearData()).enter().selectAll('rect').data(function (d) {
    return d;
  }).enter().append('rect').on('mouseover', mouseOver).on('mousemove', mouseMove).on('mouseout', mouseOut).attr('class', 'cell').attr('x', function (d) {
    return scy(d.year);
  }).attr('y', function (d) {
    return scm(d.month);
  }).attr('width', 2).attr('height', 9).attr('style', function (d) {
    return 'fill: ' + scc(d.variance);
  }).attr('data-year', function (d) {
    return d.year;
  }).attr('data-month', function (d) {
    return d.month - 1;
  }).attr('data-temp', function (d) {
    return d.temp;
  });
  tooltip.attr('display', 'none');
  tooltip.append('rect').attr('id', 'b').attr('width', 42).attr('height', 23);
  tooltip.append('text').attr('id', 'd');
  tooltip.append('text').attr('id', 'v');
};

},{}],2:[function(require,module,exports){
"use strict";

var res = function () {
  var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
  var data;

  var _baseTemperature;

  var _varianceDomain;

  var _varianceData;

  var step;
  var pos;

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
            return d.variance;
          });
          step = (_varianceDomain[1] - _varianceDomain[0]) / 5;
          pos = _varianceDomain[0];
          _varianceData = [0, 0, 0, 0, 0].map(function (d, i) {
            var j = i * step + pos;
            return {
              v: j,
              i: i,
              t: _baseTemperature + j
            };
          });
          data = res.monthlyVariance.reduce(function (p, c) {
            if (actYear !== c.year) {
              actYear = c.year;
              p.push(thisYear = []);
            }

            c.temp = _baseTemperature + c.variance;
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
    varianceData: function varianceData() {
      return _varianceData;
    },
    monthDomain: function monthDomain() {
      return _monthDomain;
    },
    monthData: function monthData() {
      return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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

  require('./legend.js')(data);
});

},{"./canvas.js":1,"./data.js":2,"./legend.js":4,"./xaxis.js":5,"./yaxis.js":6}],4:[function(require,module,exports){
"use strict";

module.exports = function (data) {
  var scc = d3.scaleSequential(d3.interpolateYlOrRd).domain(data.varianceDomain());
  var legend = d3.select('#legend');
  var form = d3.format('.3f');
  var step = 55;
  var pos = -135;
  var height = 12;
  legend.append('g').selectAll('rect').data(data.varianceData).enter().append('rect').attr('transform', function (d) {
    return "translate(".concat(pos + d.i * step, ",0)");
  }).attr('style', function (d) {
    return 'fill: ' + scc(d.v);
  }).attr('width', step).attr('height', height);
  legend.append('g').selectAll('text').data(data.varianceData).enter().append('text').attr('class', 'c3').text(function (d) {
    return "".concat(form(d.t), " (").concat(form(d.v), ")");
  }).attr('transform', function (d) {
    return "translate(".concat(pos + 4 + d.i * step, ", 9)");
  });
  legend.append('text').attr('class', 'c9').text('Temperatures are in Celsius. Anomalies relative to the Jan 1951-Dec 1980 average are in braces.');
  legend.append('text').attr('class', 'c10').text('Estimated Jan 1951-Dec 1980 absolute temperature in ℃: 8.66 +/- 0.07');
};

},{}],5:[function(require,module,exports){
"use strict";

module.exports = function (data) {
  var sc = d3.scaleLinear().domain(data.yearDomain()).range([0, 251]);
  var ax = d3.axisBottom(sc).tickFormat(d3.format('d'));
  d3.select('#x-axis').attr('transform', 'translate(83, 155)').call(ax);
};

},{}],6:[function(require,module,exports){
"use strict";

module.exports = function (data) {
  var sc = d3.scaleOrdinal().domain(data.monthData()).range([0, 9.1, 17.2, 26.3, 35.4, 44.5, 53.6, 62.7, 71.8, 80.9, 90, 100]);
  var ax = d3.axisLeft(sc);
  d3.select('#y-axis').attr('transform', 'translate(76, 45)').call(ax);
};

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY2FudmFzLmpzIiwic3JjL2pzL2RhdGEuanMiLCJzcmMvanMvaW5kZXguanMiLCJzcmMvanMvbGVnZW5kLmpzIiwic3JjL2pzL3hheGlzLmpzIiwic3JjL2pzL3lheGlzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFDLElBQUQsRUFBVTtBQUN6QixNQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBSCxDQUFVLEtBQVYsRUFBaUIsSUFBakIsRUFBVjtBQUNBLE1BQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFILENBQVUsU0FBVixDQUFiO0FBQ0EsTUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLE1BQUgsQ0FBVSxVQUFWLENBQWQ7QUFFQSxNQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBSCxDQUFVLEtBQVYsQ0FBVjtBQUVBLE1BQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxXQUFILEdBQ1AsTUFETyxDQUNBLElBQUksQ0FBQyxVQUFMLEVBREEsRUFFUCxLQUZPLENBRUQsQ0FBQyxDQUFELEVBQUksR0FBSixDQUZDLENBQVY7QUFJQSxNQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsV0FBSCxHQUNQLE1BRE8sQ0FDQSxJQUFJLENBQUMsV0FBTCxFQURBLEVBRVAsS0FGTyxDQUVELENBQUMsQ0FBRCxFQUFJLEdBQUosQ0FGQyxDQUFWO0FBSUEsTUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLGVBQUgsQ0FBbUIsRUFBRSxDQUFDLGlCQUF0QixFQUNQLE1BRE8sQ0FDQSxJQUFJLENBQUMsY0FBTCxFQURBLENBQVY7O0FBR0EsTUFBSSxTQUFTLEdBQUcsU0FBWixTQUFZLEdBQU07QUFDcEIsSUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLFNBQWIsRUFBd0IsSUFBeEI7QUFDRCxHQUZEOztBQUlBLE1BQUks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TCxFQURELEVBRU4sS0FGTSxDQUVBLENBQUMsQ0FBRCxFQUFJLEdBQUosRUFBUyxJQUFULEVBQWUsSUFBZixFQUFxQixJQUFyQixFQUEyQixJQUEzQixFQUFpQyxJQUFqQyxFQUF1QyxJQUF2QyxFQUE2QyxJQUE3QyxFQUFtRCxJQUFuRCxFQUF5RCxFQUF6RCxFQUE2RCxHQUE3RCxDQUZBLENBQVQ7QUFJQSxNQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBSCxDQUFZLEVBQVosQ0FBVDtBQUVBLEVBQUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxTQUFWLEVBQ0csSUFESCxDQUNRLFdBRFIsRUFDcUIsbUJBRHJCLEVBRUcsSUFGSCxDQUVRLEVBRlI7QUFHRCxDQVZEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibW9kdWxlLmV4cG9ydHMgPSAoZGF0YSkgPT4ge1xuICBsZXQgc3ZnID0gZDMuc2VsZWN0KCdzdmcnKS5ub2RlKClcbiAgbGV0IGNhbnZhcyA9IGQzLnNlbGVjdCgnI2NhbnZhcycpXG4gIGxldCB0b29sdGlwID0gZDMuc2VsZWN0KCcjdG9vbHRpcCcpXG5cbiAgbGV0IGZtdCA9IGQzLmZvcm1hdCgnLjNmJylcblxuICBsZXQgc2N5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgIC5kb21haW4oZGF0YS55ZWFyRG9tYWluKCkpXG4gICAgLnJhbmdlKFswLCAyNTBdKVxuICBcbiAgbGV0IHNjbSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAuZG9tYWluKGRhdGEubW9udGhEb21haW4oKSlcbiAgICAucmFuZ2UoWzAsIDEwMF0pXG5cbiAgbGV0IHNjYyA9IGQzLnNjYWxlU2VxdWVudGlhbChkMy5pbnRlcnBvbGF0ZVlsT3JSZClcbiAgICAuZG9tYWluKGRhdGEudmFyaWFuY2VEb21haW4oKSlcblxuICBsZXQgbW91c2VPdmVyID0gKCkgPT4ge1xuICAgIHRvb2x0aXAuYXR0cignZGlzcGxheScsIG51bGwpXG4gIH1cbiAgXG4gIGxldCBtb3VzZU1vdmUgPSAoZCkgPT4ge1xuICAgIGxldCBwb2ludCA9IHN2Zy5jcmVhdGVTVkdQb2ludCgpXG4gICAgcG9pbnQueCA9IGQzLmV2ZW50LmNsaWVudFhcbiAgICBwb2ludC55ID0gZDMuZXZlbnQuY2xpZW50WVxuICAgIHBvaW50ID0gcG9pbnQubWF0cml4VHJhbnNmb3JtKHN2Zy5nZXRTY3JlZW5DVE0oKS5pbnZlcnNlKCkpXG5cbiAgICB0b29sdGlwXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKHBvaW50LnggKyA1KSArICcsJyArIChwb2ludC55ICsgNSkgKyAnKScpXG4gICAgICAuYXR0cignZGF0YS15ZWFyJywgZC55ZWFyKVxuICAgIFxuICAgIHRvb2x0aXBcbiAgICAgIC5zZWxlY3QoJyNkJylcbiAgICAgIC50ZXh0KGQueWVhciArICcsICcgKyBkYXRhLm1vbnRoRGF0YSgpW2QubW9udGggLSAxXSlcblxuICAgIHRvb2x0aXBcbiAgICAgIC5zZWxlY3QoJyN2JylcbiAgICAgIC50ZXh0KGZtdChkLnZhcmlhbmNlICsgZGF0YS5iYXNlVGVtcGVyYXR1cmUoKSkgKyAnICgnICsgZm10KGQudmFyaWFuY2UpICsgJykgwrBDJylcbiAgfVxuICAgIFxuICBsZXQgbW91c2VPdXQgPSAoKSA9PiB7XG4gICAgdG9vbHRpcC5hdHRyKCdkaXNwbGF5JywgJ25vbmUnKVxuICB9XG4gICAgXG4gIGNhbnZhc1xuICAgIC5zZWxlY3RBbGwoJ2cnKVxuICAgIC5kYXRhKGRhdGEueWVhckRhdGEoKSlcbiAgICAuZW50ZXIoKVxuICAgIC5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgIC5kYXRhKChkKSA9PiB7IHJldHVybiBkIH0gKVxuICAgIC5lbnRlcigpXG4gICAgLmFwcGVuZCgncmVjdCcpXG4gICAgLm9uKCdtb3VzZW92ZXInLCBtb3VzZU92ZXIpXG4gICAgLm9uKCdtb3VzZW1vdmUnLCBtb3VzZU1vdmUpXG4gICAgLm9uKCdtb3VzZW91dCcsIG1vdXNlT3V0KVxuICAgIC5hdHRyKCdjbGFzcycsICdjZWxsJylcbiAgICAuYXR0cigneCcsIGQgPT4geyByZXR1cm4gc2N5KGQueWVhcikgfSlcbiAgICAuYXR0cigneScsIGQgPT4geyByZXR1cm4gc2NtKGQubW9udGgpIH0pXG4gICAgLmF0dHIoJ3dpZHRoJywgMilcbiAgICAuYXR0cignaGVpZ2h0JywgOSlcbiAgICAuYXR0cignc3R5bGUnLCAoZCkgPT4ge1xuICAgICAgcmV0dXJuICdmaWxsOiAnICsgc2NjKGQudmFyaWFuY2UpXG4gICAgfSlcbiAgICAuYXR0cignZGF0YS15ZWFyJywgZCA9PiB7IHJldHVybiBkLnllYXIgfSlcbiAgICAuYXR0cignZGF0YS1tb250aCcsIGQgPT4geyByZXR1cm4gZC5tb250aCAtIDEgfSlcbiAgICAuYXR0cignZGF0YS10ZW1wJywgZCA9PiB7IHJldHVybiBkLnRlbXAgfSlcblxuICB0b29sdGlwXG4gICAgLmF0dHIoJ2Rpc3BsYXknLCAnbm9uZScpXG5cbiAgdG9vbHRpcFxuICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgIC5hdHRyKCdpZCcsICdiJylcbiAgICAuYXR0cignd2lkdGgnLCA0MilcbiAgICAuYXR0cignaGVpZ2h0JywgMjMpICBcblxuICB0b29sdGlwXG4gICAgLmFwcGVuZCgndGV4dCcpXG4gICAgLmF0dHIoJ2lkJywgJ2QnKVxuICBcbiAgdG9vbHRpcFxuICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgIC5hdHRyKCdpZCcsICd2Jylcbn1cbiIsImxldCByZXMgPSAoKCkgPT4ge1xuICBsZXQgdXJsID0gJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9GcmVlQ29kZUNhbXAvUHJvamVjdFJlZmVyZW5jZURhdGEvbWFzdGVyL2dsb2JhbC10ZW1wZXJhdHVyZS5qc29uJ1xuICBsZXQgZGF0YVxuICBsZXQgYmFzZVRlbXBlcmF0dXJlXG4gIGxldCB2YXJpYW5jZURvbWFpblxuICBsZXQgdmFyaWFuY2VEYXRhXG4gIGxldCBzdGVwXG4gIGxldCBwb3NcbiAgbGV0IG1vbnRoRG9tYWluXG4gIGxldCB5ZWFyRG9tYWluXG5cbiAgcmV0dXJuIHtcbiAgICBkbzogKGYpID0+IHtcbiAgICAgIGQzLmpzb24odXJsLCAoZXJyb3IsIHJlcykgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMuc3RhdHVzLCByZXMucmVzcG9uc2VUZXh0KVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGxldCBhY3RZZWFyID0gMFxuICAgICAgICAgIGxldCB0aGlzWWVhclxuICAgICAgICAgIGJhc2VUZW1wZXJhdHVyZSA9IHJlcy5iYXNlVGVtcGVyYXR1cmVcbiAgICAgICAgICB5ZWFyRG9tYWluID0gZDMuZXh0ZW50KHJlcy5tb250aGx5VmFyaWFuY2UsIChkKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZC55ZWFyXG4gICAgICAgICAgfSlcbiAgICAgICAgICBtb250aERvbWFpbiA9IFsxLCAxMl1cbiAgICAgICAgICB2YXJpYW5jZURvbWFpbiA9IGQzLmV4dGVudChyZXMubW9udGhseVZhcmlhbmNlLCAoZCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGQudmFyaWFuY2VcbiAgICAgICAgICB9KVxuICAgICAgICAgIHN0ZXAgPSAodmFyaWFuY2VEb21haW5bMV0gLSB2YXJpYW5jZURvbWFpblswXSkgLyA1XG4gICAgICAgICAgcG9zID0gdmFyaWFuY2VEb21haW5bMF1cbiAgICAgICAgICB2YXJpYW5jZURhdGEgPSBbMCwwLDAsMCwwXS5tYXAoKGQsaSkgPT4ge1xuICAgICAgICAgICAgbGV0IGogPSBpICogc3RlcCArIHBvcyBcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHY6IGosXG4gICAgICAgICAgICAgIGk6IGksXG4gICAgICAgICAgICAgIHQ6IGJhc2VUZW1wZXJhdHVyZSArIGpcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIGRhdGEgPSByZXMubW9udGhseVZhcmlhbmNlLnJlZHVjZSgocCxjKSA9PiB7XG4gICAgICAgICAgICBpZiAoYWN0WWVhciAhPT0gYy55ZWFyKSB7XG4gICAgICAgICAgICAgIGFjdFllYXIgPSBjLnllYXJcbiAgICAgICAgICAgICAgcC5wdXNoKHRoaXNZZWFyID0gW10pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjLnRlbXAgPSBiYXNlVGVtcGVyYXR1cmUgKyBjLnZhcmlhbmNlXG4gICAgICAgICAgICB0aGlzWWVhci5wdXNoKGMpXG4gICAgICAgICAgICByZXR1cm4gcFxuICAgICAgICAgIH0sIFtdKVxuICAgICAgICAgIGYoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sXG4gICAgc2VsOiAoZlllYXIsIGZNb250aCkgPT4ge1xuICAgICAgZlllYXIgKz0gJ3knXG4gICAgICByZXR1cm4gZGF0YVtmWWVhcl1bZk1vbnRoIC0gMV1cbiAgICB9LFxuICAgIGJhc2VUZW1wZXJhdHVyZTogKCkgPT4geyByZXR1cm4gYmFzZVRlbXBlcmF0dXJlIH0sXG4gICAgdmFyaWFuY2VEb21haW46ICgpID0+IHsgcmV0dXJuIHZhcmlhbmNlRG9tYWluIH0sXG4gICAgdmFyaWFuY2VEYXRhOiAoKSA9PiB7IHJldHVybiB2YXJpYW5jZURhdGEgfSxcbiAgICBtb250aERvbWFpbjogKCkgPT4geyByZXR1cm4gbW9udGhEb21haW4gfSxcbiAgICBtb250aERhdGE6ICgpID0+IHsgXG4gICAgICByZXR1cm4gWyBcbiAgICAgICAgJ0phbnVhcnknLCBcbiAgICAgICAgJ0ZlYnJ1YXJ5JywgXG4gICAgICAgICdNYXJjaCcsIFxuICAgICAgICAnQXByaWwnLCBcbiAgICAgICAgJ01heScsIFxuICAgICAgICAnSnVuZScsIFxuICAgICAgICAnSnVseScsIFxuICAgICAgICAnQXVndXN0JywgXG4gICAgICAgICdTZXB0ZW1iZXInLCBcbiAgICAgICAgJ09jdG9iZXInLCBcbiAgICAgICAgJ05vdmVtYmVyJywgXG4gICAgICAgICdEZWNlbWJlcicgXG4gICAgICBdIFxuICAgIH0sXG4gICAgeWVhckRvbWFpbjogKCkgPT4geyByZXR1cm4geWVhckRvbWFpbiB9LFxuICAgIHllYXJEYXRhOiAoKSA9PiB7IHJldHVybiBkYXRhIH1cbiAgfVxufSkoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlc1xuIiwiY29uc3QgZGF0YSAgID0gcmVxdWlyZSgnLi9kYXRhLmpzJylcblxuZGF0YS5kbygoKSA9PiB7XG4gIHJlcXVpcmUoJy4veWF4aXMuanMnKShkYXRhKVxuICByZXF1aXJlKCcuL3hheGlzLmpzJykoZGF0YSlcbiAgcmVxdWlyZSgnLi9jYW52YXMuanMnKShkYXRhKVxuICByZXF1aXJlKCcuL2xlZ2VuZC5qcycpKGRhdGEpXG59KVxuIiwibW9kdWxlLmV4cG9ydHMgPSAoZGF0YSkgPT4ge1xuICBsZXQgc2NjID0gZDMuc2NhbGVTZXF1ZW50aWFsKGQzLmludGVycG9sYXRlWWxPclJkKVxuICAgIC5kb21haW4oZGF0YS52YXJpYW5jZURvbWFpbigpKVxuXG4gIGxldCBsZWdlbmQgPSBkMy5zZWxlY3QoJyNsZWdlbmQnKVxuICBsZXQgZm9ybSA9IGQzLmZvcm1hdCgnLjNmJylcbiAgbGV0IHN0ZXAgPSA1NVxuICBsZXQgcG9zID0gLTEzNVxuICBsZXQgaGVpZ2h0ID0gMTJcblxuICBsZWdlbmRcbiAgICAuYXBwZW5kKCdnJylcbiAgICAuc2VsZWN0QWxsKCdyZWN0JylcbiAgICAuZGF0YShkYXRhLnZhcmlhbmNlRGF0YSlcbiAgICAuZW50ZXIoKVxuICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBkID0+IGB0cmFuc2xhdGUoJHtwb3MgKyBkLmkgKiBzdGVwfSwwKWApXG4gICAgLmF0dHIoJ3N0eWxlJywgZCA9PiAnZmlsbDogJyArIHNjYyhkLnYpKVxuICAgIC5hdHRyKCd3aWR0aCcsIHN0ZXApXG4gICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcblxuICBsZWdlbmRcbiAgICAuYXBwZW5kKCdnJylcbiAgICAuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAuZGF0YShkYXRhLnZhcmlhbmNlRGF0YSlcbiAgICAuZW50ZXIoKVxuICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgIC5hdHRyKCdjbGFzcycsICdjMycpXG4gICAgLnRleHQoZCA9PiBgJHtmb3JtKGQudCl9ICgke2Zvcm0oZC52KX0pYClcbiAgICAuYXR0cigndHJhbnNmb3JtJywgZCA9PiBgdHJhbnNsYXRlKCR7cG9zICsgNCArIGQuaSAqIHN0ZXB9LCA5KWApXG5cbiAgbGVnZW5kXG4gICAgLmFwcGVuZCgndGV4dCcpXG4gICAgLmF0dHIoJ2NsYXNzJywgJ2M5JylcbiAgICAudGV4dCgnVGVtcGVyYXR1cmVzIGFyZSBpbiBDZWxzaXVzLiBBbm9tYWxpZXMgcmVsYXRpdmUgdG8gdGhlIEphbiAxOTUxLURlYyAxOTgwIGF2ZXJhZ2UgYXJlIGluIGJyYWNlcy4nKVxuXG4gIGxlZ2VuZFxuICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgIC5hdHRyKCdjbGFzcycsICdjMTAnKVxuICAgIC50ZXh0KCdFc3RpbWF0ZWQgSmFuIDE5NTEtRGVjIDE5ODAgYWJzb2x1dGUgdGVtcGVyYXR1cmUgaW4g4oSDOiA4LjY2ICsvLSAwLjA3Jylcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gKGRhdGEpID0+IHtcbiAgbGV0IHNjID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgIC5kb21haW4oZGF0YS55ZWFyRG9tYWluKCkpXG4gICAgLnJhbmdlKFswLCAyNTFdKVxuICBcbiAgbGV0IGF4ID0gZDMuYXhpc0JvdHRvbShzYylcbiAgICAudGlja0Zvcm1hdChkMy5mb3JtYXQoJ2QnKSlcblxuICBkMy5zZWxlY3QoJyN4LWF4aXMnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDgzLCAxNTUpJylcbiAgICAuY2FsbChheClcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gKGRhdGEpID0+IHtcbiAgbGV0IHNjID0gZDMuc2NhbGVPcmRpbmFsKClcbiAgICAuZG9tYWluKGRhdGEubW9udGhEYXRhKCkpXG4gICAgLnJhbmdlKFswLCA5LjEsIDE3LjIsIDI2LjMsIDM1LjQsIDQ0LjUsIDUzLjYsIDYyLjcsIDcxLjgsIDgwLjksIDkwLCAxMDBdKVxuXG4gIGxldCBheCA9IGQzLmF4aXNMZWZ0KHNjKVxuXG4gIGQzLnNlbGVjdCgnI3ktYXhpcycpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoNzYsIDQ1KScpXG4gICAgLmNhbGwoYXgpXG59XG4iXX0=
