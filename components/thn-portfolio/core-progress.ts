import type { ScrollTrigger as ScrollTriggerStatic } from "gsap/ScrollTrigger";

export const CORE_PROGRESS_EVENT = "thn:chapterprogress";

export const CORE_CHAPTERS = [
  { id: "hero", selector: "#hero" },
  { id: "about", selector: "#about" },
  { id: "expertise", selector: "#expertise-heading" },
  { id: "services", selector: "#services" },
  { id: "stack", selector: "#stack" },
  { id: "process", selector: "#process" },
  { id: "work", selector: "#work" },
  { id: "contact", selector: "#contact" },
] as const;

export type CoreChapterId = (typeof CORE_CHAPTERS)[number]["id"];

export type CoreChapterProgress = Readonly<{
  id: CoreChapterId;
  progress: number;
}>;

export type CoreProgressSnapshot = Readonly<{
  activeChapter: CoreChapterId | null;
  progress: number;
  scrollY: number;
  maxScroll: number;
  chapters: readonly CoreChapterProgress[];
}>;

type CoreProgressObserver = {
  onSnapshot?: (snapshot: CoreProgressSnapshot) => void;
  onRefresh?: () => void;
  readScrollY?: () => number;
  triggerElement?: HTMLElement;
};

type ChapterRange = Readonly<{
  id: CoreChapterId;
  start: number;
  end: number;
}>;

const snapshots = new WeakMap<HTMLElement, CoreProgressSnapshot>();

export function readCoreProgressSnapshot(root: HTMLElement) {
  return snapshots.get(root) ?? null;
}

export function observeCoreProgress(
  root: HTMLElement,
  ScrollTrigger: typeof ScrollTriggerStatic,
  observer?: CoreProgressObserver,
) {
  const view = root.ownerDocument.defaultView;
  const scrollElement = root.ownerDocument.scrollingElement;
  const readScrollY = () => observer?.readScrollY?.() ?? view?.scrollY ?? 0;
  let ranges: ChapterRange[] = [];
  let maxScroll = 0;

  const refreshRanges = () => {
    if (!view) return;

    maxScroll = Math.max(
      0,
      (scrollElement?.scrollHeight ?? root.ownerDocument.documentElement.scrollHeight) -
        view.innerHeight,
    );

    const starts = CORE_CHAPTERS.flatMap(({ id, selector }) => {
      const element = root.querySelector<HTMLElement>(selector);
      if (!element) return [];

      return [{
        id,
        start: element.getBoundingClientRect().top + readScrollY(),
      }];
    }).sort((first, second) => first.start - second.start);

    ranges = starts.map((chapter, index) => ({
      ...chapter,
      end: starts[index + 1]?.start ?? maxScroll,
    }));
  };

  const progressFor = (range: ChapterRange, scrollY: number) => {
    const end = Math.min(maxScroll, Math.max(range.start, range.end));
    if (range.start >= maxScroll || end <= range.start) {
      return maxScroll > 0 && scrollY >= range.start ? 1 : 0;
    }

    return Math.max(0, Math.min(1, (scrollY - range.start) / (end - range.start)));
  };

  const publish = () => {
    if (!view) return;

    const scrollY = Math.max(0, Math.min(maxScroll, readScrollY()));
    const activeRange =
      [...ranges].reverse().find((range) => range.start <= scrollY) ?? ranges[0] ?? null;
    const snapshot: CoreProgressSnapshot = {
      activeChapter: activeRange?.id ?? null,
      progress: maxScroll > 0 ? scrollY / maxScroll : 0,
      scrollY,
      maxScroll,
      chapters: ranges.map((range) => ({
        id: range.id,
        progress: progressFor(range, scrollY),
      })),
    };

    snapshots.set(root, snapshot);
    observer?.onSnapshot?.(snapshot);
    root.dispatchEvent(new CustomEvent<CoreProgressSnapshot>(CORE_PROGRESS_EVENT, { detail: snapshot }));
  };

  refreshRanges();

  const trigger = ScrollTrigger.create({
    trigger: observer?.triggerElement ?? root,
    start: observer?.triggerElement ? "top bottom" : "top top",
    end: observer?.triggerElement ? "bottom top" : "bottom bottom",
    invalidateOnRefresh: true,
    onRefresh: () => {
      refreshRanges();
      observer?.onRefresh?.();
      publish();
    },
    onUpdate: publish,
  });

  publish();

  return () => {
    trigger.kill();
    snapshots.delete(root);
  };
}
