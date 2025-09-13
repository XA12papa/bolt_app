"use client";

import React from "react";
import type { Profile } from "./types";

interface Props {
  profile: Profile;
  onClose: () => void;
}

export default function MatchModal({ profile, onClose }: Props) {
  return (
    <div className="match-modal" role="dialog" aria-modal="true" aria-label="It's a match">
      <div className="match-content">
        <h2>It's a match!</h2>
        <img className="match-avatar" src={profile.avatar} alt={profile.name} />
        <p className="match-name">{profile.name}</p>
        <div className="match-actions">
          <button className="btn" onClick={onClose}>
            Keep swiping
          </button>
          <a className="btn" href="/matches">
            View matches
          </a>
        </div>
      </div>
    </div>
  );
}
  