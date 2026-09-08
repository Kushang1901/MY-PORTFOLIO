"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./WelcomeLoader.module.css";

export default function WelcomeLoader() {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const phaseMessages = [
    "INITIALIZING WORKSPACE...",
    "LOADING ARCHITECTURAL MODULES...",
    "CURATING PORTFOLIO SYSTEMS...",
    "SYSTEM READY // WELCOME",
  ];

  const handleComplete = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsDone(true);
      document.body.style.overflow = "";
    }, 1100);
  }, []);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  useEffect(() => {
    // Lock body scrolling during load
    document.body.style.overflow = "hidden";

    // Smooth progress simulation
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Accelerate smoothly
      const increment = Math.max(
        1,
        Math.floor(Math.random() * 3) + (currentProgress > 75 ? 3 : 2)
      );
      currentProgress = Math.min(100, currentProgress + increment);
      setProgress(currentProgress);

      if (currentProgress < 30) {
        setPhaseIndex(0);
      } else if (currentProgress < 65) {
        setPhaseIndex(1);
      } else if (currentProgress < 95) {
        setPhaseIndex(2);
      } else {
        setPhaseIndex(3);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          handleComplete();
        }, 320);
      }
    }, 32);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleComplete, handleSkip]);

  if (isDone) return null;

  return (
    <div
      className={`${styles.loaderOverlay} ${isExiting ? styles.exiting : ""}`}
      role="status"
      aria-label="Welcome loader animation"
    >
      {/* Background ambient lighting */}
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.gridOverlay} aria-hidden="true" />

      {/* Top bar with system status and skip */}
      <div className={styles.loaderTopBar}>
        <div className={styles.systemTag}>
          <span className={styles.systemDot} />
          <span>PORTFOLIO OS // V2.6</span>
        </div>
        <button
          type="button"
          onClick={handleSkip}
          className={styles.skipBtn}
          aria-label="Skip intro animation"
        >
          <span>SKIP [ESC]</span>
          <span className="material-symbols-outlined" style={{ fontSize: "0.88rem" }}>
            fast_forward
          </span>
        </button>
      </div>

      {/* Center Stage */}
      <div className={styles.centerStage}>
        {/* Luxury Insignia Monogram */}
        <div className={styles.insigniaWrap}>
          <div className={styles.insigniaRing} />
          <div className={styles.insigniaBox}>
            <span className={styles.monogram}>KA</span>
          </div>
          <div className={styles.cornerTL} />
          <div className={styles.cornerTR} />
          <div className={styles.cornerBL} />
          <div className={styles.cornerBR} />
        </div>

        {/* Name and Editorial Title */}
        <div className={styles.brandGroup}>
          <h1 className={styles.brandName}>
            KUSHANG <span className={styles.brandAccent}>ACHARYA</span>
          </h1>
          <p className={styles.brandRole}>FRONTEND ARCHITECT &amp; SOFTWARE ENGINEER</p>
        </div>

        {/* Progress Display */}
        <div className={styles.progressContainer}>
          <div className={styles.progressMetrics}>
            <span className={styles.phaseText}>{phaseMessages[phaseIndex]}</span>
            <span className={styles.progressNumber}>
              {String(progress).padStart(2, "0")}%
            </span>
          </div>

          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${progress}%` }}>
              <div className={styles.fillGlow} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Coordinates & Date */}
      <div className={styles.loaderFooter}>
        <span className={styles.footerLabel}>EST. GUJARAT, INDIA</span>
        <span className={styles.footerLabel}>LAT 22.30° N / LON 73.18° E</span>
      </div>
    </div>
  );
}
