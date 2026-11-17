import type { CoreHeroIdentityCopy } from "./core-hero";
import { IdentityCopy } from "./core-hero";
import Wordmark from "./wordmark";
import styles from "./core-hero.module.css";

export default function EngineeredFlowHero({ identityCopy }: { identityCopy?: CoreHeroIdentityCopy }) {
  return (
    <section id="hero" className={styles.hero} data-thn-engineered-flow="" aria-labelledby="hero-name">
      <span data-thn-flow-hero-measure="" data-thn-premium-stage="" aria-hidden="true" />
      <div data-thn-flow-content="">
        <div data-thn-premium-brand=""><Wordmark size="hero" /></div>
        <div data-thn-flow-intro=""><IdentityCopy premium identityCopy={identityCopy} /></div>
      </div>
      <span data-thn-flow-horizon="" aria-hidden="true" />
    </section>
  );
}
