export const INTRO_SKIP_CLASS = "intro-skip";
/** Set when the loader lifts. Unlike the skip class, it does not hide the loader mid-lift. */
export const INTRO_DONE_CLASS = "intro-done";

/** Longest the hero waits on the loader before it plays anyway. */
export const INTRO_FALLBACK_MS = 8000;

/**
 * Runs in <head> before first paint. The loader is server rendered and plays on
 * every full load of home. This hides it on deep links and any other page.
 * Client navigation back home keeps <html>, so its done/skip class still applies.
 */
export const introSkipScript = `(function(){if(location.pathname!=="/"||location.hash){document.documentElement.classList.add("${INTRO_SKIP_CLASS}")}})();`;

type ClassListLike = Pick<DOMTokenList, "add" | "contains">;

export function createIntroGate(getClassList: () => ClassListLike | null) {
  const listeners = new Set<() => void>();
  let fallback: ReturnType<typeof setTimeout> | undefined;

  const pending = () => {
    const classList = getClassList();
    return classList
      ? !classList.contains(INTRO_SKIP_CLASS) && !classList.contains(INTRO_DONE_CLASS)
      : false;
  };

  const release = () => {
    if (fallback !== undefined) {
      clearTimeout(fallback);
      fallback = undefined;
    }
    getClassList()?.add(INTRO_DONE_CLASS);
    const queued = Array.from(listeners);
    listeners.clear();
    for (const listener of queued) {
      listener();
    }
  };

  /** Calls `listener` when the loader lifts, or right away when there is no loader. */
  const onReveal = (listener: () => void) => {
    if (!pending()) {
      listener();
      return () => undefined;
    }
    listeners.add(listener);
    fallback ??= setTimeout(release, INTRO_FALLBACK_MS);
    return () => {
      listeners.delete(listener);
    };
  };

  return { pending, release, onReveal };
}

const gate = createIntroGate(() =>
  typeof document === "undefined" ? null : document.documentElement.classList,
);

export const introPending = gate.pending;
export const releaseIntro = gate.release;
export const onIntroReveal = gate.onReveal;

/** Fired once the home hero's entrance has finished (or skipped under reduced motion). */
export const HERO_DONE_EVENT = "verbo:hero-done";
/** Longest anything waits on the hero before going ahead anyway. */
export const HERO_FALLBACK_MS = INTRO_FALLBACK_MS + 4000;

let heroDone = false;

export function markHeroDone() {
  if (heroDone) {
    return;
  }
  heroDone = true;
  window.dispatchEvent(new Event(HERO_DONE_EVENT));
}

/** Calls `listener` once the hero has played, right away if it already has. */
export function onHeroDone(listener: () => void) {
  if (heroDone) {
    listener();
    return () => undefined;
  }
  const run = () => {
    clearTimeout(fallback);
    window.removeEventListener(HERO_DONE_EVENT, run);
    listener();
  };
  const fallback = setTimeout(run, HERO_FALLBACK_MS);
  window.addEventListener(HERO_DONE_EVENT, run);
  return () => {
    clearTimeout(fallback);
    window.removeEventListener(HERO_DONE_EVENT, run);
  };
}
