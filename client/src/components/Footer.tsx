export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface mt-12">
      <div className="max-w-[1400px] mx-auto px-[5%] py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-secondary">
        <span className="font-bold text-brand text-base">Rego</span>
        <p>Kjøp og selg brukte ting, enkelt og trygt.</p>
        <p className="text-ink-muted">© {new Date().getFullYear()} Rego</p>
      </div>
    </footer>
  );
}