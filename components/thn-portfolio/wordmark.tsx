import styles from "./site.module.css";

type WordmarkProps = {
  size: "header" | "hero" | "footer";
};

export default function Wordmark({ size }: WordmarkProps) {
  const sizeClass =
    size === "hero"
      ? styles.heroWordmark
      : size === "footer"
        ? styles.footerWordmark
        : styles.headerWordmark;

  if (size === "hero") {
    return (
      <span className={`${styles.wordmark} ${sizeClass}`} role="img" aria-label="Thn.">
        <span className={styles.heroPartFlight} data-thn-mark-part="t" aria-hidden="true">
          <span className={`${styles.heroPartAssembly} ${styles.heroPartAssemblyT}`}>
            <span className={styles.serifT}>T</span>
          </span>
        </span>
        <span className={styles.heroPartFlight} data-thn-mark-part="hn" aria-hidden="true">
          <span className={`${styles.heroPartAssembly} ${styles.heroPartAssemblyHn}`}>
            <span className={styles.sansHn}>hn</span>
          </span>
        </span>
        <span className={styles.heroPartFlight} data-thn-mark-part="period" aria-hidden="true">
          <span className={`${styles.heroPartAssembly} ${styles.heroPartAssemblyPeriod}`}>
            <span className={styles.period}>.</span>
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className={`${styles.wordmark} ${sizeClass}`} role="img" aria-label="Thn.">
      <span className={styles.serifT} aria-hidden="true">
        T
      </span>
      <span className={styles.sansHn} aria-hidden="true">
        hn
      </span>
      <span className={styles.period} aria-hidden="true">
        .
      </span>
    </span>
  );
}
