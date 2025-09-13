"use client";

import React, { useEffect, useRef, useState } from "react";
import Card, { CardHandle } from "./Card";
import { sampleProfiles } from "./data";
import type { Profile } from "./types";
import Controls from "./Controls";
import MatchModal from "./MatchModal";
import Link from "next/link";

export default function Deck() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const cardRef = useRef<CardHandle | null>(null);
  const [matchProfile, setMatchProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("tinder_swipes") || "[]") : [];
    const skippedIds = stored.filter((s: any) => s.dir === "left").map((s: any) => s.id);
    const likedIds = stored.filter((s: any) => s.dir === "right").map((s: any) => s.id);
    const remaining = sampleProfiles.filter((p) => !skippedIds.includes(p.id) && !likedIds.includes(p.id));
    setProfiles(remaining);
  }, []);

  function saveSwipe(profile: Profile, dir: "left" | "right" | "up") {
    const key = "tinder_swipes";
    const existing = JSON.parse(localStorage.getItem(key) || "[]") as { id: string; dir: string }[];
    existing.push({ id: profile.id, dir });
    localStorage.setItem(key, JSON.stringify(existing));
    if (dir === "right") {
      if (profile.likesYou) {
        const matchesKey = "tinder_matches";
        const matches = JSON.parse(localStorage.getItem(matchesKey) || "[]") as Profile[];
        matches.push(profile);
        localStorage.setItem(matchesKey, JSON.stringify(matches));
        setMatchProfile(profile);
      }
    }
  }

  function handleSwipe(dir: "left" | "right" | "up") {
    if (profiles.length === 0) return;
    const [current, ...rest] = profiles;
    saveSwipe(current, dir);
    setProfiles(rest);
  }

  function swipeFromControls(dir: "left" | "right" | "up") {
    if (!cardRef.current) return;
    cardRef.current.swipe(dir);
  }

  function reset() {
    localStorage.removeItem("tinder_swipes");
    localStorage.removeItem("tinder_matches");
    setProfiles(sampleProfiles.slice());
    setMatchProfile(null);
  }

  const top = profiles[0];
  const next = profiles[1];
  const next2 = profiles[2];

  return (
    <section className="deck-page">
      <header className="header">
        <h1>Simple Tinder</h1>
        <div className="actions">
          <Link className="matches-link" href="/matches">
            Matches
          </Link>
          <button className="btn small" onClick={reset}>
            Reset
          </button>
        </div>
      </header>

      <div className="deck">
        {next2 && (
          <div className="card card-back" aria-hidden>
            <img className="card-image" src={next2.avatar} alt={next2.name} />
            <div className="card-info">
              <div className="card-name">
                {next2.name}, <span className="muted">{next2.age}</span>
              </div>
              <div className="card-bio">{next2.bio}</div>
            </div>
          </div>
        )}

        {next && (
          <div className="card card-back" style={{ transform: "scale(0.98) translateY(-8px)" }} aria-hidden>
            <img className="card-image" src={next.avatar} alt={next.name} />
            <div className="card-info">
              <div className="card-name">
                {next.name}, <span className="muted">{next.age}</span>
              </div>
              <div className="card-bio">{next.bio}</div>
            </div>
          </div>
        )}

        {top ? (
          <Card ref={cardRef} profile={top} onSwipe={(dir) => handleSwipe(dir)} />
        ) : (
          <div className="empty-stack">
            <p>No more profiles</p>
            <button className="btn" onClick={reset}>
              See them again
            </button>
          </div>
        )}
      </div>

      <Controls onLike={() => swipeFromControls("right")} onDislike={() => swipeFromControls("left")} onSuperLike={() => swipeFromControls("up")} />

      {matchProfile && <MatchModal profile={matchProfile} onClose={() => setMatchProfile(null)} />}
    </section>
  );
}
  