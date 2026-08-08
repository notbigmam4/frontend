export function isPwaStandalone(): boolean {
  if (typeof window === 'undefined') return false

  const mediaStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches

  const iosStandalone =
    'standalone' in navigator &&
    (navigator as Navigator & { standalone?: boolean }).standalone === true

  return mediaStandalone || iosStandalone
}

export function applyPwaClass(): void {
  document.documentElement.classList.toggle('pwa', isPwaStandalone())
}
