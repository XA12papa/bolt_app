"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { Profile } from "./types";

type Direction = "left" | "right" | "up";

export type CardHandle = {
  swipe: (dir: Direction) => void;
};

interface CardProps {
  profile: Profile;
  onSwipe: (dir: Direction) => void;
  isInteractive?: boolean;
  className?: string;
}

const Card = forwardRef<CardHandle, CardProps>(
  ({ profile, onSwipe, isInteractive = true, className = "" }, ref) => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [transition, setTransition] = useState("");
    const dragging = useRef(false);
    const start = useRef({ x: 0, y: 0 });
    const animTimeout = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({
      swipe(dir: Direction) {
        if (!isInteractive) return;
        animateSwipe(dir);
      },
    }));

    useEffect(() => {
      return () => {
        if (animTimeout.current) {
          window.clearTimeout(animTimeout.current);
        }
      };
    }, []);

    function animateSwipe(dir: Direction) {
      setTransition("transform 300ms ease, opacity 300ms ease");
      const w = typeof window !== "undefined" ? window.innerWidth : 1000;
      const h = typeof window !== "undefined" ? window.innerHeight : 800;
      const offX = dir === "right" ? w * 1.2 : dir === "left" ? -w * 1.2 : 0;
      const offY = dir === "up" ? -h * 0.6 : 0;
      const rot = dir === "right" ? 25 : dir === "left" ? -25 : 0;
      setPos({ x: offX, y: offY });
      setRotation(rot);
      animTimeout.current = window.setTimeout(() => {
        onSwipe(dir);
        // reset visual state so if the same component is reused it starts centered
        setTransition("");
        setPos({ x: 0, y: 0 });
        setRotation(0);
      }, 300);
    }

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
      if (!isInteractive) return;
      dragging.current = true;
      start.current = { x: e.clientX, y: e.clientY };
      setTransition("none");
      (e.target as Element).setPointerCapture(e.pointerId);
    }

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
      if (!dragging.current) return;
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;
      setPos({ x: dx, y: dy });
      setRotation(dx / 10);
    }

    function handlePointerUp() {
      if (!dragging.current) return;
      dragging.current = false;
      const dx = pos.x;
      const dy = pos.y;
      const threshold = 120;
      const upThreshold = -160;
      if (dx > threshold) {
        animateSwipe("right");
        return;
      }
      if (dx < -threshold) {
        animateSwipe("left");
        return;
      }
      if (dy < upThreshold) {
        animateSwipe("up");
        return;
      }
      // return to center
      setTransition("transform 200ms ease");
      setPos({ x: 0, y: 0 });
      setRotation(0);
    }

    return (
      <div
        className={`card ${className}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) rotate(${rotation}deg)`,
          transition,
          touchAction: isInteractive ? "none" : "auto",
          cursor: isInteractive ? "grab" : "default",
        }}
      >
        <img className="card-image" src={profile.avatar} alt={profile.name} />
        <div
          className="card-badge left"
          style={{
            opacity: pos.x < -80 ? Math.min(1, Math.abs(pos.x) / 120) : 0,
          }}
        >
          NOPE
        </div>
        <div
          className="card-badge right"
          style={{ opacity: pos.x > 80 ? Math.min(1, pos.x / 120) : 0 }}
        >
          LIKE
        </div>

        <div className="card-info">
          <div className="card-name">
            {profile.name}, <span className="muted">{profile.age}</span>
          </div>
          <div className="card-bio">{profile.bio}</div>
        </div>
      </div>
    );
  }
);

export default Card;
  