"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Profile } from "../components/types";

export default function MatchesPage() {
  const [matches, setMatches] = useState<Profile[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tinder_matches") || "[]") as Profile[];
    setMatches(stored);
  }, []);

  if (matches.length === 0) {
    return (
      <main className="matches-page">
        <header className="header">
          <h1>Your Matches</h1>
          <Link href="/">Back</Link>
        </header>
        <div className="empty">
          <p>No matches yet — like people to start matching.</p>
          <Link className="btn" href="/">
            Start swiping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="matches-page">
      <header className="header">
        <h1>Your Matches</h1>
        <Link href="/">Back</Link>
      </header>

      <div className="matches-grid">
        {matches.map((m) => (
          <div key={m.id} className="match-card">
            <img className="match-image" src={m.avatar} alt={m.name} />
            <div className="match-info">
              <div className="match-name">
                {m.name}, <span className="muted">{m.age}</span>
              </div>
              <div className="match-bio">{m.bio}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
  