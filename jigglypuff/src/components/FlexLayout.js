import React from "react";

function getJustify(justify) {
  if (justify === "start") {
    return "flex-start";
  }
  if (justify === "end") {
    return "flex-end";
  }
  if (justify === "center") {
    return "center";
  }
  if (justify === "between") {
    return "space-between";
  }
  if (justify === "around") {
    return "space-around";
  }
  throw Error("unimplemented");
}

function getDirection(direction, reverse) {
  if (direction === "horizontal") {
    if (reverse) {
      return "row-reverse";
    }
    return "row";
  }
  if (reverse) {
    return "column-reverse";
  }
  return "column";
}

function FlexLayout({
  children,
  direction = "horizontal",
  justify = "start",
  reverse = false,
  align = "stretch",
  style,
}) {
  return (
    <div
      style={{
        ...style,
        width: "100%",
        padding: style?.padding ?? 0,
        display: "flex",
        alignItems: align,
        flexDirection: getDirection(direction, reverse),
        justifyContent: getJustify(justify),
      }}
    >
      {children}
    </div>
  );
}

export default FlexLayout;
