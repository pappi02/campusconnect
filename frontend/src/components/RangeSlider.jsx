import React, { useState, useEffect, useRef, useCallback } from "react";

const RangeSlider = ({ min, max, step, value, onChange }) => {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Update range track styling
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  // Notify parent component
  useEffect(() => {
    onChange([minVal, maxVal]);
  }, [minVal, maxVal, onChange]);

  return (
    <div className="relative w-full">
      {/* Left thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={(e) => {
          const val = Math.min(Number(e.target.value), maxVal - step);
          setMinVal(val);
        }}
        className="thumb thumb--left absolute w-full appearance-none bg-transparent cursor-pointer"
        style={{ zIndex: minVal > max - 100 ? "5" : "unset" }}
      />

      {/* Right thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={(e) => {
          const val = Math.max(Number(e.target.value), minVal + step);
          setMaxVal(val);
        }}
        className="thumb thumb--right absolute w-full appearance-none bg-transparent cursor-pointer"
      />

      {/* Track and labels */}
      <div className="slider relative">
        <div className="slider__track bg-gray-300 h-3 rounded-full"></div>
        <div
          ref={range}
          className="slider__range absolute h-3 rounded-full bg-yellow-400"
        ></div>
        <div
          className="slider__left-value absolute top-6 text-xs text-gray-700"
          style={{ left: `${getPercent(minVal)}%` }}
        >
          Ksh {minVal.toLocaleString()}
        </div>
        <div
          className="slider__right-value absolute top-6 text-xs text-gray-700"
          style={{ left: `${getPercent(maxVal)}%` }}
        >
          Ksh {maxVal.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
