import Reveal from '../components/Reveal';

/**
 * Placeholder for the upcoming CSV Import showcase — keeps the route alive (not a
 * 404) in the same hero language as Quick Add until the real thing is built.
 */
export default function CsvImportPage() {
  return (
    <section className="hero">
      <Reveal>
        <span className="hero-eyebrow">CSV Import</span>
        <h1 className="hero-title">Coming soon.</h1>
        <p className="hero-sub">
          Bulk-import a bank or brokerage CSV export — with smart column mapping,
          fuzzy account resolution, and duplicate detection — without a single manual
          re-type. This showcase is being built next.
        </p>
      </Reveal>
    </section>
  );
}
