import type { ReactNode } from "react";
import CoreVisual from "./core-visual";
import styles from "./core-hero.module.css";
import site from "./site.module.css";
import Wordmark from "./wordmark";

export type CoreMobileLayout = "split" | "layered";
export type CoreHeroIdentityCopy = {
  education: string;
  bio: string;
};

export function IdentityCopy({ premium = false, identityCopy }: { premium?: boolean; identityCopy?: CoreHeroIdentityCopy }) {
  return (
    <>
      <p className={`${site.role} ${styles.role}`} data-thn-premium-role={premium ? "" : undefined}>
        Software Engineer
      </p>
      <h1 className={styles.name} id="hero-name" data-thn-premium-name={premium ? "" : undefined}>
        Tran Quang Thuan
      </h1>
      <p className={`${site.education} ${styles.education}`} data-thn-premium-education={premium ? "" : undefined}>
        {identityCopy?.education ?? "Completed Software Engineering coursework at FPT University; awaiting capstone results and graduation confirmation."}
      </p>
      <p className={`${site.bio} ${styles.bio}`} data-thn-premium-bio={premium ? "" : undefined}>
        {identityCopy?.bio ?? "I develop web application interfaces with a focus on frontend architecture, responsive behavior, and maintainable implementation."}
      </p>
      <div className={`${site.actions} ${styles.actions}`} data-thn-premium-actions={premium ? "" : undefined}>
        <a className={site.primaryAction} href="#work" data-thn-primary-action="">
          Explore engineering work
          <span aria-hidden="true">↓</span>
        </a>
        <a className={site.secondaryAction} href="#contact">
          Contact me
        </a>
      </div>
    </>
  );
}

function Artwork({
  mobileLayout,
  interactive = false,
  touchRotation = false,
  artworkVisual,
  cinematic = false,
}: {
  mobileLayout?: CoreMobileLayout;
  interactive?: boolean;
  touchRotation?: boolean;
  artworkVisual?: ReactNode;
  cinematic?: boolean;
}) {
  const hasCustomArtwork = artworkVisual !== undefined;

  return (
    <figure
      className={styles.artwork}
      data-thn-premium-artwork={interactive ? "" : undefined}
      aria-labelledby={interactive ? undefined : "fluid-candidate-caption"}
      aria-label={interactive && !hasCustomArtwork ? "Fluid Construct sculpture" : undefined}
      role={mobileLayout && !hasCustomArtwork ? "figure" : undefined}
    >
      <div className={styles.stage} data-thn-premium-stage={interactive ? "" : undefined}>
        {cinematic && (
          <div data-thn-cinematic-space="" aria-hidden="true">
            <span data-thn-cinematic-frame="">
              <span data-thn-spatial-plane="ceiling" />
              <span data-thn-spatial-plane="wall" />
              <span data-thn-spatial-plane="floor" />
              <span data-thn-spatial-gate="far" />
              <span data-thn-spatial-gate="near" />
              <span data-thn-spatial-seam="" />
            </span>
          </div>
        )}
        {hasCustomArtwork ? (
          cinematic ? (
            <div data-thn-cinematic-portal="">
              <div data-thn-cinematic-aperture="">{artworkVisual}</div>
            </div>
          ) : artworkVisual
        ) : (
          <>
            <span className={styles.lightPool} data-thn-premium-light={interactive ? "" : undefined} aria-hidden="true" />
            <span className={styles.floorShadow} data-thn-premium-shadow={interactive ? "" : undefined} aria-hidden="true" />
            <CoreVisual
              concept="fluid"
              presentation="hero"
              interactive={interactive}
              touchRotation={touchRotation}
            />
          </>
        )}
        {interactive && !hasCustomArtwork && (
          <span className={site.visuallyHidden} id="fluid-rotation-help">
            Drag to rotate the sculpture. When the sculpture is focused, use the arrow keys to rotate
            it, or press Home or R to reset its view.
          </span>
        )}
      </div>
      {!interactive && (
        <figcaption className={styles.caption} id="fluid-candidate-caption">
          <span>Fluid Construct / exploratory candidate</span>
          <a href="/preview/thn-core">View CORE reference</a>
        </figcaption>
      )}
    </figure>
  );
}

export default function CoreFluidHero({
  mobileLayout,
  interactive = false,
  touchRotation = false,
  artworkVisual,
  identityCopy,
  showToolLine = true,
  cinematic = false,
}: {
  mobileLayout?: CoreMobileLayout;
  interactive?: boolean;
  touchRotation?: boolean;
  artworkVisual?: ReactNode;
  identityCopy?: CoreHeroIdentityCopy;
  showToolLine?: boolean;
  cinematic?: boolean;
}) {
  return (
    <section className={styles.hero} id="hero" aria-labelledby="hero-name" data-thn-cinematic-hero={cinematic ? "" : undefined}>
      {cinematic && <div data-thn-cinematic-atmosphere="" aria-hidden="true"><span data-thn-cinematic-light="" /></div>}
      <div
        className={styles.layout}
        data-mobile-layout={mobileLayout}
        data-thn-interactive-layout={interactive ? "" : undefined}
      >
        <div className={styles.identity}>
          <div className={styles.brand} data-thn-premium-brand={interactive ? "" : undefined}>
            <Wordmark size="hero" />
          </div>
          {mobileLayout ? (
            <div className={styles.identityCopy}>
              <IdentityCopy premium={interactive} identityCopy={identityCopy} />
            </div>
          ) : (
            <IdentityCopy premium={interactive} identityCopy={identityCopy} />
          )}
        </div>

        <Artwork
          mobileLayout={mobileLayout}
          interactive={interactive}
          touchRotation={touchRotation}
          artworkVisual={artworkVisual}
          cinematic={cinematic}
        />
      </div>

      {showToolLine && (
        <div
          className={`${site.toolLine} ${styles.toolLine}`}
          data-thn-tool-line=""
          data-thn-premium-tool-line={interactive ? "" : undefined}
        >
          <span className={site.toolLabel}>Working with</span>
          <span>React / Next.js / TypeScript / Tailwind CSS</span>
        </div>
      )}
      {cinematic && <span data-thn-cinematic-threshold="" aria-hidden="true" />}
    </section>
  );
}
