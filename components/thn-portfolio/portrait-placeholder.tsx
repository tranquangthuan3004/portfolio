import Image from "next/image";
import styles from "./portrait-placeholder.module.css";

type PortraitPlaceholderProps = (
  | { src?: undefined; alt?: undefined }
  | { src: string; alt: string }
) & { cinematic?: boolean };

export default function PortraitPlaceholder(props: PortraitPlaceholderProps = {}) {
  const image = props.src === undefined ? null : (
    <Image
      className={styles.image}
      src={props.src}
      alt={props.alt}
      fill
      sizes={props.cinematic
        ? "(max-width: 820px) 42vw, (max-width: 1100px) 44vw, 480px"
        : "(max-width: 390px) 136px, (max-width: 576px) 33vw, (max-width: 820px) 190px, (max-width: 900px) 48.5vw, 440px"}
    />
  );

  return (
    <div className={styles.placeholder} data-thn-portrait-placeholder="">
      {props.cinematic && image ? (
        <div data-thn-portrait-depth="">
          <div data-thn-portrait-pointer="">{image}</div>
        </div>
      ) : image ?? <span className={styles.paper} aria-hidden="true" />}
      {image ? null : (
        <p className={styles.label}>
          <span>Portrait</span>
          <span>
            <span aria-hidden="true">/</span> Coming soon
          </span>
        </p>
      )}
    </div>
  );
}
