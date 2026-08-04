interface SignOutProgressOverlayProps {
  visible: boolean
}

export function SignOutProgressOverlay({ visible }: Readonly<SignOutProgressOverlayProps>) {
  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-slate-950/85 px-6 text-center backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-300/30 border-t-cyan-300" aria-hidden />
      <div>
        <p className="font-semibold text-white">Signing you out securely…</p>
        <p className="mt-1 text-sm text-slate-300">Just a moment.</p>
      </div>
    </div>
  )
}
