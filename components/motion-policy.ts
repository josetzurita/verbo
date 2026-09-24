export const FINE_POINTER_QUERY = "(pointer: fine) and (hover: hover)";

export function shouldAnimateMotion(
  reduce: boolean | null | undefined,
): boolean {
  return !reduce;
}

export function shouldEnableParallax(options: {
  reduce: boolean | null | undefined;
  viewportWidth: number | null;
  disableBelow?: number;
}): boolean {
  if (!shouldAnimateMotion(options.reduce)) {
    return false;
  }
  if (
    options.disableBelow != null &&
    options.viewportWidth != null &&
    options.viewportWidth < options.disableBelow
  ) {
    return false;
  }
  return true;
}

export function shouldEnableMagnetic(options: {
  reduce: boolean | null | undefined;
  finePointer: boolean;
  pointerType?: string;
}): boolean {
  if (!shouldAnimateMotion(options.reduce)) {
    return false;
  }
  if (!options.finePointer) {
    return false;
  }
  if (
    options.pointerType &&
    options.pointerType !== "mouse" &&
    options.pointerType !== "pen"
  ) {
    return false;
  }
  return true;
}

export function shouldEnablePointerAccent(options: {
  enabled: boolean;
  reduce: boolean | null | undefined;
  finePointer: boolean;
  pointerType?: string;
}): boolean {
  if (!options.enabled) {
    return false;
  }
  return shouldEnableMagnetic({
    reduce: options.reduce,
    finePointer: options.finePointer,
    pointerType: options.pointerType,
  });
}
