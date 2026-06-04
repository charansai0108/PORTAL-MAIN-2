import React from 'react';
import { YellowScribbleHighlight } from './SetuIllustrations';

/**
 * One-line title: Lexend uppercase prefix + bold Caveat highlight with yellow scribble.
 */
export default function SetuTitleLine({
  prefix,
  highlight,
  className = '',
  size = 'hero',
}) {
  const sizeClass =
    size === 'hero'
      ? 'setu-title-line--hero'
      : size === 'section'
        ? 'setu-title-line--section'
        : 'setu-title-line--medium';

  return (
    <h2 className={`setu-title-line ${sizeClass} ${className}`}>
      <span className="setu-display setu-title-prefix">{prefix}</span>
      <span className="setu-title-highlight">
        <YellowScribbleHighlight className="setu-title-scribble" />
        <span className="setu-script setu-title-emphasis">{highlight}</span>
      </span>
    </h2>
  );
}
