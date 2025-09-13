"use client";

import React from "react";

interface Props {
  onLike: () => void;
  onDislike: () => void;
  onSuperLike: () => void;
}

export default function Controls({ onLike, onDislike, onSuperLike }: Props) {
  return (
    <div className="controls" role="toolbar" aria-label="Swipe controls">
      <button aria-label="Dislike" className="btn circle dislike" onClick={onDislike}>
        ✖
      </button>
      <button aria-label="Super like" className="btn circle super" onClick={onSuperLike}>
        ★
      </button>
      <button aria-label="Like" className="btn circle like" onClick={onLike}>
        ❤
      </button>
    </div>
  );
}
  