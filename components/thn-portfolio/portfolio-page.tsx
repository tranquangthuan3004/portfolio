import { Fragment, type ComponentType, type ReactNode } from "react";
import type { Project } from "@/data/projects";
import PortfolioSections, { PortfolioContact } from "./portfolio-sections";
import PreviewMotion, { type PreviewProfile } from "./preview-motion";
import SiteHeader from "./site-header";
import styles from "./site.module.css";
import Wordmark from "./wordmark";

type MotionWrapperProps = {
  children: ReactNode;
  className: string;
  id: string;
  profile?: PreviewProfile;
};

type ContentWrapperProps = {
  children: ReactNode;
};

export default function ThnPortfolioPage({
  profile = "v1",
  motionWrapper,
  contentWrapper,
  heroVisual,
  heroComposition,
  projectIds,
  headerAction,
  backgroundVisual,
}: {
  profile?: PreviewProfile;
  motionWrapper?: ComponentType<MotionWrapperProps>;
  contentWrapper?: ComponentType<ContentWrapperProps>;
  heroVisual?: ReactNode;
  heroComposition?: ReactNode;
  projectIds?: readonly Project["id"][];
  headerAction?: ReactNode;
  backgroundVisual?: ReactNode;
} = {}) {
  const MotionWrapper = motionWrapper ?? PreviewMotion;
  const ContentWrapper = contentWrapper ?? Fragment;

  return (
    <MotionWrapper className={styles.preview} id="top" profile={profile}>
      {backgroundVisual}
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>

      <SiteHeader headerAction={headerAction} />

      <ContentWrapper>
      <main id="main-content" className={styles.main} tabIndex={-1}>
        <div className={styles.heroAboutScene} data-thn-hero-about-scene="">
          {heroComposition ?? (
          <section className={styles.hero} id="hero" aria-labelledby="hero-name">
            <div className={styles.heroContent}>
              <div className={styles.markField}>
                {heroVisual}
                <div className={styles.heroWordmarkFlight} data-thn-moving-wordmark="">
                  <Wordmark size="hero" />
                </div>
              </div>

              <div className={styles.identity}>
                <p className={styles.role}>Software Engineer</p>
                <h1 id="hero-name">Tran Quang Thuan</h1>
                <p className={styles.education}>
                  Completed Software Engineering coursework at FPT University; awaiting capstone
                  results and graduation confirmation.
                </p>
                <p className={styles.bio}>
                  I develop web application interfaces with a focus on frontend architecture,
                  responsive behavior, and maintainable implementation.
                </p>
                <div className={styles.actions}>
                  <a className={styles.primaryAction} href="#work" data-thn-primary-action="">
                    Explore engineering work
                    <span aria-hidden="true">↓</span>
                  </a>
                  <a className={styles.secondaryAction} href="#contact">
                    Contact me
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.toolLine} data-thn-tool-line="">
              <span className={styles.toolLabel}>Working with</span>
              <span>React / Next.js / TypeScript / Tailwind CSS</span>
            </div>
          </section>
          )}

          <section
            id="about"
            className={styles.aboutSection}
            aria-labelledby="about-heading"
            tabIndex={-1}
          >
            <div className={styles.aboutGrid}>
              <div className={styles.aboutTopline} data-thn-folio-band="">
                <div
                  className={styles.aboutWordmarkDock}
                  data-thn-wordmark-dock=""
                  aria-hidden="true"
                />
                <span
                  className={styles.aboutFolioRule}
                  data-thn-folio-rule=""
                  aria-hidden="true"
                />
                <p className={styles.aboutEyebrow}>About / Practice</p>
              </div>
              <div className={styles.aboutLead}>
                <h2
                  id="about-heading"
                  className={styles.aboutHeading}
                  data-thn-about-heading=""
                >
                  <span className={styles.aboutHeadingLead} data-thn-about-line="sans">
                    Engineering the
                  </span>
                  {" "}
                  <span className={styles.aboutHeadingEmphasis} data-thn-about-line="serif">
                    interface.
                  </span>
                </h2>
              </div>
              <div className={styles.aboutAside}>
                <div className={styles.aboutIdentity}>
                  <p className={styles.aboutName}>Tran Quang Thuan</p>
                  <p className={styles.aboutRole}>Software Engineer</p>
                </div>
                <div className={styles.aboutCopy}>
                  <p>I value readable code and maintainable structure.</p>
                  <p>
                    I focus on clear hierarchy, responsive behavior, and purposeful interactions that
                    make software straightforward to use.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className={styles.siteSections}>
          <PortfolioSections projectIds={projectIds} />
        </div>
        <PortfolioContact />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerFinaleRule} data-thn-finale-rule="" aria-hidden="true" />
          <div className={styles.footerIdentity} data-thn-finale-signature="">
            <span>Tran Quang Thuan</span>
            <Wordmark size="footer" />
          </div>
          <nav className={styles.footerNav} aria-label="Footer navigation">
            <a href="#about">About</a>
            <a href="#expertise">Expertise</a>
            <a href="#work">Engineering</a>
            <a href="#contact">Contact</a>
          </nav>
          <a className={styles.footerTop} href="#top">
            Back to top <span aria-hidden="true">↑</span>
          </a>
          <p className={styles.footerMeta}>© 2026 Tran Quang Thuan · React · Next.js · TypeScript</p>
        </div>
      </footer>
      </ContentWrapper>
    </MotionWrapper>
  );
}
