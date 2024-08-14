"use strict";

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  var angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
};
const drawArc = (x, y, radius, startAngle, endAngle) => {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);
  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  var d = ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
  return d;
};
const scaleValue = (value, from, to) => {
  var scale = (to[1] - to[0]) / (from[1] - from[0]);
  var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
  return ~~(capped * scale + to[0]);
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _renderprops = require("react-spring/renderprops");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const SegmentedRoundDisplay = _ref => {
  let {
    segments = [],
    filledArcWidth = 7,
    emptyArcWidth = 7,
    arcSpacing = 7,
    totalArcSize = 280,
    radius = 150,
    style,
    emptyArcColor = '#ADB1CC',
    filledArcColor = '#5ECCAA',
    animationDuration = 1000,
    animated = true,
    formatValue,
    incompleteArcColor = '#23318C',
    strokeLinecap = 'round',
    displayValue = false,
    valueBoxColor = '#23318C',
    valueFontColor = '#FFFFFF',
    valueBoxType = 'default'
  } = _ref;
  const [arcs, setArcs] = (0, _react.useState)([]);
  const totalArcs = segments.length;
  const totalSpaces = totalArcs - 1;
  const totalSpacing = totalSpaces * arcSpacing;
  const arcSize = (totalArcSize - totalSpacing) / totalArcs;
  const arcsStart = 90 - totalArcSize / 2;
  const margin = 35;
  const svgWidth = (radius + filledArcWidth) * 2 + 2 * margin;
  const svgHeight = (radius + filledArcWidth) * 2 + 2 * margin;
  const totalFilledValue = segments.reduce((acc, actual) => acc + actual.filled, 0);
  const createArcs = (0, _react.useCallback)(() => {
    const newArcs = segments.map((goal, index) => {
      const newArc = {
        centerX: radius + filledArcWidth + margin,
        centerY: radius + filledArcWidth + margin,
        start: arcsStart + index * arcSize,
        end: arcsStart + arcSize + index * arcSize,
        isComplete: goal.total == goal.filled
      };
      if (index !== 0) {
        newArc.start += arcSpacing * index;
        newArc.end += arcSpacing * index;
      }
      newArc.filled = scaleValue(goal.filled, [0, goal.total], [newArc.start, newArc.end]);
      return newArc;
    });
    setArcs(newArcs);
  }, [segments, arcSize, arcSpacing, filledArcWidth, arcsStart, radius]);
  const renderDisplayValue = (angle, value) => {
    const arc = arcs[arcs.length - 1];
    if (!arc) {
      return /*#__PURE__*/_react.default.createElement("g", null);
    }
    const pos = polarToCartesian(arc.centerX, arc.centerY, radius, (angle || arc.filled) + 3);
    const boxFinalPosition = {
      x: pos.x - 40,
      y: pos.y + 6
    };
    const formatedValue = formatValue ? formatValue(value || totalFilledValue) : parseInt(value || totalFilledValue);
    var displayValueBox;
    switch (valueBoxType) {
      case "needle":
        displayValueBox = /*#__PURE__*/_react.default.createElement("g", null, /*#__PURE__*/_react.default.createElement("rect", {
          x: -57,
          y: 0,
          width: "90",
          height: "8",
          fill: valueBoxColor,
          transform: `translate(${pos.x},${pos.y}) rotate(${angle})`,
          rx: 0
        }));
        break;
      default:
        displayValueBox = /*#__PURE__*/_react.default.createElement("g", null, /*#__PURE__*/_react.default.createElement("rect", {
          x: boxFinalPosition.x,
          y: boxFinalPosition.y,
          width: "80",
          height: "25",
          fill: valueBoxColor,
          rx: 3
        }), /*#__PURE__*/_react.default.createElement("rect", {
          width: "10",
          height: "10",
          fill: valueBoxColor,
          transform: `translate(${pos.x},${pos.y}) rotate(45)`,
          rx: 2
        }), /*#__PURE__*/_react.default.createElement("text", {
          x: pos.x,
          "font-weight": "bold",
          fontSize: 14,
          y: boxFinalPosition.y + 18,
          fill: valueFontColor,
          "text-anchor": "middle"
        }, formatedValue));
    }
    return displayValueBox;
  };
  (0, _react.useEffect)(() => {
    createArcs();
  }, [segments, createArcs]);
  if (arcs.length == 0) {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
  }
  return /*#__PURE__*/_react.default.createElement("svg", {
    width: svgWidth,
    height: svgHeight,
    style: style
  }, arcs.map((arc, index) => /*#__PURE__*/_react.default.createElement("g", {
    key: index.toString()
  }, /*#__PURE__*/_react.default.createElement("path", {
    fill: "none",
    stroke: emptyArcColor,
    strokeWidth: emptyArcWidth,
    strokeLinecap: strokeLinecap,
    d: drawArc(arc.centerX, arc.centerY, radius, arc.start, arc.end)
  }), animated && arc.filled > arc.start && /*#__PURE__*/_react.default.createElement(_renderprops.Spring, {
    from: {
      x: arc.start,
      y: 0
    },
    to: {
      x: arc.filled + 0.6,
      y: filledArcWidth
    },
    config: {
      duration: animationDuration / totalArcs,
      delay: animationDuration / totalArcs * index
    }
  }, props => /*#__PURE__*/_react.default.createElement("path", {
    fill: "none",
    stroke: arc.isComplete ? filledArcColor : incompleteArcColor || filledArcColor,
    strokeWidth: props.y,
    strokeLinecap: strokeLinecap,
    d: drawArc(arc.centerX, arc.centerY, radius, arc.start, props.x)
  })), !animated && arc.filled > arc.start && /*#__PURE__*/_react.default.createElement("path", {
    fill: "none",
    stroke: arc.isComplete ? filledArcColor : incompleteArcColor || filledArcColor,
    strokeWidth: filledArcWidth,
    strokeLinecap: strokeLinecap,
    d: drawArc(arc.centerX, arc.centerY, radius, arc.start, arc.filled)
  }))), displayValue && /*#__PURE__*/_react.default.createElement("g", null, !animated && renderDisplayValue(), animated && /*#__PURE__*/_react.default.createElement(_renderprops.Spring, {
    from: {
      x: arcsStart,
      value: 0
    },
    to: {
      x: arcs[arcs.length - 1].filled,
      value: totalFilledValue
    },
    config: {
      duration: animationDuration
    }
  }, props => renderDisplayValue(props.x, props.value))));
};
SegmentedRoundDisplay.propTypes = {
  segments: _propTypes.default.arrayOf(_propTypes.default.shape({
    total: _propTypes.default.number.isRequired,
    filled: _propTypes.default.number.isRequired
  })),
  filledArcWidth: _propTypes.default.number,
  emptyArcWidth: _propTypes.default.number,
  arcSpacing: _propTypes.default.number,
  totalArcSize: _propTypes.default.number,
  radius: _propTypes.default.number,
  emptyArcColor: _propTypes.default.string,
  filledArcColor: _propTypes.default.string,
  formatAmount: _propTypes.default.func,
  style: _propTypes.default.object,
  animationDuration: _propTypes.default.number,
  animated: _propTypes.default.bool,
  formatValue: _propTypes.default.func,
  incompleteArcColor: _propTypes.default.string,
  strokeLinecap: _propTypes.default.string,
  displayValue: _propTypes.default.bool,
  valueBoxColor: _propTypes.default.string,
  valueFontColor: _propTypes.default.string,
  valueBoxType: _propTypes.default.string
};
var _default = exports.default = SegmentedRoundDisplay;
