export default function CrisisBanner() {
  return (
    <div className="border-b border-rose-400/20 bg-rose-500/10 px-4 py-3">
      <p className="mx-auto max-w-3xl text-center text-xs leading-5 text-rose-100 sm:text-sm">
        <span className="font-semibold">In crisis?</span> You are not alone. Call{" "}
        <a
          href="https://findahelpline.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white"
        >
          findahelpline.com
        </a>{" "}
        or your local emergency number. This app does not replace professional care.
      </p>
    </div>
  );
}
