import { describe, expect, it, vi } from "vitest";
import {
  createIntroGate,
  INTRO_DONE_CLASS,
  INTRO_FALLBACK_MS,
  INTRO_SKIP_CLASS,
  introSkipScript,
} from "./components/intro-gate";

function fakeClassList(initial: string[] = []) {
  const set = new Set(initial);
  return {
    add: (...names: string[]) => names.forEach((name) => set.add(name)),
    contains: (name: string) => set.has(name),
  };
}

function runSkipScript(pathname: string, hash = "") {
  const classList = fakeClassList();
  new Function("document", "location", introSkipScript)(
    { documentElement: { classList } },
    { pathname, hash },
  );
  return classList.contains(INTRO_SKIP_CLASS);
}

describe("intro skip script", () => {
  it("plays on every full load of home", () => {
    expect(runSkipScript("/")).toBe(false);
  });

  it("skips deep links and other pages", () => {
    expect(runSkipScript("/", "#work")).toBe(true);
    expect(runSkipScript("/work/lienzo")).toBe(true);
  });
});

describe("intro gate", () => {
  it("reveals right away when the loader is skipped", () => {
    const gate = createIntroGate(() => fakeClassList([INTRO_SKIP_CLASS]));
    const listener = vi.fn();
    gate.onReveal(listener);
    expect(gate.pending()).toBe(false);
    expect(listener).toHaveBeenCalledOnce();
  });

  it("waits for release, fires once, and stays done for client navigation", () => {
    const classList = fakeClassList();
    const gate = createIntroGate(() => classList);
    const listener = vi.fn();
    const removed = vi.fn();
    gate.onReveal(listener);
    gate.onReveal(removed)();
    expect(listener).not.toHaveBeenCalled();

    gate.release();
    gate.release();
    expect(listener).toHaveBeenCalledOnce();
    expect(removed).not.toHaveBeenCalled();
    expect(classList.contains(INTRO_DONE_CLASS)).toBe(true);
    expect(classList.contains(INTRO_SKIP_CLASS)).toBe(false);
    expect(gate.pending()).toBe(false);
  });

  it("releases on its own if the loader never finishes", () => {
    vi.useFakeTimers();
    const gate = createIntroGate(() => fakeClassList());
    const listener = vi.fn();
    gate.onReveal(listener);
    vi.advanceTimersByTime(INTRO_FALLBACK_MS);
    expect(listener).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });
});
