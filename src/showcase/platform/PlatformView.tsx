import { lazy, Suspense, useMemo, useState, type FC } from "react";
import { PLATFORM } from "./registry";
import {
  ExpandButton,
  FullSize,
  PlatformWindow,
  ScaleToFit,
  WIN_H,
  APP_W,
} from "./shells";

const cache = new Map<string, FC>();
function screenFor(slug: string): FC | null {
  const e = PLATFORM[slug];
  if (!e) return null;
  if (!cache.has(slug)) {
    cache.set(
      slug,
      lazy(() =>
        e.group().then((m) => ({ default: m.screens[slug] ?? (() => null) })),
      ),
    );
  }
  return cache.get(slug)!;
}

/** One automation's screen in its platform, in a browser window, sized to fit. */
export function PlatformScreen({ slug }: { slug: string }) {
  const e = PLATFORM[slug];
  const Screen = useMemo(() => screenFor(slug), [slug]);
  if (!e || !Screen) return null;
  return (
    <PlatformWindow brand={e.brand} path={e.path}>
      <Suspense
        fallback={
          <div
            style={{ width: APP_W, height: WIN_H - 36 }}
            className="bg-white"
          />
        }
      >
        <Screen />
      </Suspense>
    </PlatformWindow>
  );
}

export function PlatformView({ slug, title }: { slug: string; title: string }) {
  const [open, setOpen] = useState(false);
  const e = PLATFORM[slug];
  if (!e) return null;
  const where = e.brand === "avolon" ? "Avolon's platform" : "Glo CRM";
  const label = `${e.screen} in ${where}, for "${title}", with made-up data`;
  return (
    <figure className="m-0">
      <div role="img" aria-label={label}>
        <div aria-hidden="true">
          <ScaleToFit>
            <PlatformScreen slug={slug} />
          </ScaleToFit>
        </div>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-[13px] text-gmuted">
          {e.screen} in {where}. Every name and figure is made up.
        </span>
        <ExpandButton onClick={() => setOpen(true)} />
      </figcaption>
      <FullSize open={open} onClose={() => setOpen(false)} label={label}>
        <div aria-hidden="true">
          <PlatformScreen slug={slug} />
        </div>
      </FullSize>
    </figure>
  );
}
