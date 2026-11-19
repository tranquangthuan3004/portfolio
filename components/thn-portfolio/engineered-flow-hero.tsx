import Image from "next/image";
import type { CoreHeroIdentityCopy } from "./core-hero";
import { IdentityCopy } from "./core-hero";
import Wordmark from "./wordmark";
import styles from "./core-hero.module.css";

export default function EngineeredFlowHero({ identityCopy }: { identityCopy?: CoreHeroIdentityCopy }) {
  return (
    <section id="hero" className={styles.hero} data-thn-engineered-flow="" data-thn-engineered-identity="" aria-labelledby="hero-name">
      <span data-thn-flow-hero-measure="" data-thn-premium-stage="" aria-hidden="true" />
      <div data-thn-flow-content="">
        <div data-thn-premium-brand=""><Wordmark size="hero" /></div>
        <div data-thn-flow-intro=""><IdentityCopy premium identityCopy={identityCopy} /></div>
      </div>
      <div data-thn-engineered-origin="">
        <figure data-thn-engineered-plate="">
          <svg viewBox="0 0 400 400" aria-hidden="true">
            <g data-thn-engineered-pointer="">
              <g fill="none" stroke="currentColor">
                <path data-thn-engineered-shell="" strokeWidth="1.5" d="M200 20 C299 20 380 101 380 200 C380 299 299 380 200 380 C101 380 20 299 20 200 C20 101 101 20 200 20Z" />
                <circle data-thn-engineered-ring="" cx="200" cy="200" r="164" strokeDasharray="2 7" />
                <path d="M8 112h40l28 28m248 120 28 28h40M112 8v40l28 28m120 248 28 28v40" />
                <path data-thn-engineered-signal="" d="M200 20C299 20 380 101 380 200M20 200C20 157 35 118 60 87" stroke="#FF6A13" strokeWidth="3" />
              </g>
            </g>
          </svg>
          <div data-thn-engineered-aperture="">
            <Image src="/SE182998_1.jpg" alt="Tran Quang Thuan at his FPT University graduation ceremony" fill loading="eager" sizes="(max-width: 820px) 45vw, 400px" />
          </div>
        </figure>
      </div>
      <span data-thn-flow-horizon="" aria-hidden="true" />
    </section>
  );
}
