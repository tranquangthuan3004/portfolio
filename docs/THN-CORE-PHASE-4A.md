# THN. CORE Phase 4A — Scroll Narrative

> Historical implementation/evidence record. Its native-scroll, progress-linked typography and retired-route descriptions predate the current ScrollSmoother/Lenis and independent reveal implementations. This is not the current production specification; consult the current design brief and decision log. Existing external evidence paths are references only.

**Scope:** `/preview/thn-core` only. The route remains an experimental preview, not a production selection.

## Narrative

The page uses one native scroll sequence: Hero arrival, Hero-to-About unfold, Expertise, Engineering / Work, and a quiet Contact close. The Fluid Construct remains in the hero and leaves with it. Expertise, services, tools, process, project indices, and Contact continue the motion in existing DOM elements; later chapters do not keep or reintroduce the 3D sculpture. No section is pinned and no new content or scroll distance is added.

## Progress ownership

`observeCoreProgress` owns one root `ScrollTrigger` and publishes the current scroll snapshot. The Core premium motion module uses that snapshot for the hero scene and all DOM sequences. It measures element ranges only when ScrollTrigger refreshes; the scroll callback uses cached start/end positions and does not read layout. The default observer behavior and comparison routes remain unchanged.

The scene progress is a compact 0–1 ref value derived from the same snapshot. Its measured response window starts at page arrival and ends after 40% of the stage height on desktop or 50% on compact layouts, capped at the measured stage exit. Current 1440×900, 768×1024, and 390×844 measurements produce response windows of about 219px, 140px, and 98px respectively. The outer R3F group applies the chapter pose and component spacing; the inner drag group owns the user's quaternion. R3F interpolates from refs without React state updates. Returning to the top restores the resting assembly.

About timing follows the heading's measured viewport entry. The remaining DOM ranges use these existing elements and viewport landmarks:

| Chapter | Progress range | Motion cue |
| --- | --- | --- |
| Expertise | section top at 88% to 54% viewport height | Heading and serif emphasis settle onto one axis in sequence |
| Services | each row top at 88% to 62% | Rule extends beside the row copy |
| Tools | section top at 88% to 50% | Lead settles, then the existing groups follow in order |
| Process | section top at 78% to section bottom at 34% | Track progress and numbered steps share one range |
| Engineering / Work | section top at 88% to 54%; each project row at 88% to 60% | The heading introduces the list; only the decorative index moves with each row |
| Contact | contact top at 86% to footer bottom at the viewport bottom | Existing statement and copy settle by a few pixels; the footer rule resolves last |

These are direct, reversible progress mappings. The time-based entrance uses the hero's DOM targets; scroll choreography may begin immediately if the visitor scrolls during that entrance. Project names, descriptions, status, metadata, and links stay readable and are never faded or hidden by the motion.

## Accessibility and scene safety

Native page and touch scrolling remain in charge. Existing drag, arrow-key, reset, and button controls retain their behavior. The outer scroll pose does not overwrite the inner user rotation. Reduced motion and the 320px layout keep the static SVG and meaningful content without requiring the chapter scene. Existing delayed-load, WebGL failure, context-loss, offscreen pause/resume, and resource disposal paths remain in place. The narrative uses no new library or global progress bus.

## Verification record

The candidate production build returned HTTP 200 at port 3015. Matched Phase 3D production captures used port 3014. Evidence is stored outside the repository under `E:\Portfolio-QA\Thn\THN-CORE\Phase-4A`:

- The production viewport matrix covers 1440, 768, 390, and 320 CSS pixels. The 320px, no-JavaScript, reduced-motion, WebGL-denied, and context-loss cases retain the visible SVG and hide controls that cannot act.
- A 2.5-second delay on the Core scene chunk left the SVG visible and controls hidden until the Canvas became ready; the scene and controls then recovered.
- At reduced-motion changes on one live route, the route's progress trigger marker and tracked window scroll listener moved from one to zero and back to one. Canvas unmount deleted all 22 shader programs observed as created in that run. These are route-local observations; the app does not expose GSAP's global trigger registry to the QA page.
- The About, Expertise, Work, Contact, and top anchors remained on one progress owner through browser Back/Forward. The retained `/preview/thn-core-studies` route returned to the base Core preview through browser history; Canvas and controls became ready and stayed ready for eight consecutive one-second samples. This is a full-document route navigation because the preview has no in-page route link.
- With the hero stage fully offscreen, three consecutive 600ms windows recorded zero WebGL draw calls. Draws resumed after returning to the hero. The earlier immediate-after-scroll sample included transition frames and is superseded by this settled sample.
- The actual production recordings cover desktop wheel forward/reverse with a drag, plus mobile native touch forward/reverse. Review sheets use browser screenshots captured at labeled points in the same sessions; they are not decoded frames extracted from WebM.
- The matched performance JSON records build, browser, viewport, renderer, resource, draw, triangle, long-task, CLS, and callback-interval samples. A separate fixed-window probe records startup and scroll intervals plus WebGL API call spans. Runs use Microsoft Edge headless ANGLE SwiftShader, so callback intervals and draw samples are not physical-device FPS or GPU benchmarks.

The fixed-window probe used one instrumented run per viewport and build in a separate Edge process per build. Before the scroll sequence, the observed Long Tasks were 114ms and 812ms on the 1440px Phase 3D baseline, 491ms and 376ms on its candidate, 572ms and 951ms on the 390px baseline, and 596ms and 72ms on its candidate. During the wheel sequence it observed one 51ms desktop task in the baseline and one 52ms task in the candidate, with none on mobile in that run. Their attribution was `unknown`; the WebGL `compileShader` and `linkProgram` wrappers measured below timer resolution and `getProgramParameter` calls peaked at 4.1ms. This does not isolate the longer tasks, establish a gain, or explain the previously observed 440ms and 1,319ms tasks. Those earlier samples have no usable call stacks. The separate three-context measurements also vary, so they are not a causal startup comparison.

The production comparison shows the V1 route retained the same ten JavaScript requests and 197,030 encoded JS bytes; Core's 14-request JavaScript total rose by 3,244 encoded bytes. A 1440px CLS value of 0.036219 is present in both the Phase 3D baseline samples and Phase 4A candidate samples; the source capture identifies the existing SVG-to-Canvas mount size change. No startup performance change was retained.
