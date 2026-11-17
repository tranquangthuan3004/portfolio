import PortraitPlaceholder from "./portrait-placeholder";
import ThnCoreVisualStudy from "./visual-study-page";
import VisualBThemeToggle from "./visual-b-theme-toggle";

function VisualBThemeBootstrap() {
  return (
    <script
      id="thn-visual-b-theme-bootstrap"
      dangerouslySetInnerHTML={{
        __html: `(()=>{const path="/"+location.pathname.split("/").filter(Boolean).join("/");if(path!=="/"&&path!=="/preview/thn-core/visual-b"&&path!=="/preview/thn-core/v2")return;try{if(localStorage.getItem("thn-core-visual-b-theme")==="dark"){const root=document.querySelector("[data-thn-preview]");if(root)root.dataset.thnVisualBTheme="dark"}}catch{}})()`,
      }}
    />
  );
}

export default function SilverEditorialPortfolio({ refinedMotion = false }: { refinedMotion?: boolean } = {}) {
  return (
    <ThnCoreVisualStudy
      variant="silver"
      refinedMotion={refinedMotion}
      identityCopy={{
        education:
          "Software Engineering graduate from FPT University with hands-on experience developing web and cross-platform applications through academic projects and practical training.",
        bio: "I focus on building responsive, maintainable software solutions, with experience across frontend and backend development.",
      }}
      artworkVisual={
        <PortraitPlaceholder
          cinematic={refinedMotion}
          src="/SE182998_1.jpg"
          alt="Thuan in graduation attire holding a red diploma"
        />
      }
      projectIds={["capstone-project"]}
      headerAction={
        <>
          <VisualBThemeBootstrap />
          <VisualBThemeToggle liveThemeTransition={refinedMotion} />
        </>
      }
    />
  );
}
