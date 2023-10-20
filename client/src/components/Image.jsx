import React from "react";

export default function Image({ src, ...rest }) {
  const path = src && src.startsWith("https://") ? src : "/" + src;
  return <img {...rest} src={path} alt="" />;
}
