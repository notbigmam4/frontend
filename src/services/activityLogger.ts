import { addActivityLog } from '../firebase/firebaseUtils'
import type {
  ActivityDevice,
  ActivityEventType,
  ActivityGeo,
  ActivityUser,
} from '../types/ActivityLog'

// Prototype only. Before treating these events as an audit trail, move writes
// behind a rate-limited backend and protect reads with Firebase Auth and rules.
const SESSION_ID_KEY = 'activity_session_id'
const GEO_KEY = 'activity_geo'
const APP_OPEN_KEY = 'activity_app_opened_v2'

let fallbackSessionId: string | undefined
let geoPromise: Promise<ActivityGeo | undefined> | undefined

type NavigatorWithConnection = Navigator & {
  connection?: {
    type?: string
    effectiveType?: string
    downlink?: number
    rtt?: number
  }
}

type GeoResponse = {
  success?: boolean
  ip?: string
  city?: string
  region?: string
  country?: string
  country_code?: string
  continent?: string
  latitude?: number
  longitude?: number
  timezone?: { id?: string }
  connection?: { isp?: string; asn?: number }
}

function createSessionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function getActivitySessionId() {
  try {
    const existing = sessionStorage.getItem(SESSION_ID_KEY)
    if (existing) return existing

    const sessionId = createSessionId()
    sessionStorage.setItem(SESSION_ID_KEY, sessionId)
    return sessionId
  } catch {
    fallbackSessionId ??= createSessionId()
    return fallbackSessionId
  }
}

export function claimAppOpen() {
  try {
    if (sessionStorage.getItem(APP_OPEN_KEY)) return false
    sessionStorage.setItem(APP_OPEN_KEY, 'true')
    return true
  } catch {
    return true
  }
}

function getDeviceInfo(): ActivityDevice {
  const connection = (navigator as NavigatorWithConnection).connection

  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform || 'unknown',
    languages: navigator.languages?.length
      ? [...navigator.languages]
      : [navigator.language],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
    screen: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    pixelRatio: window.devicePixelRatio || 1,
    colorDepth: window.screen.colorDepth,
    touchPoints: navigator.maxTouchPoints || 0,
    online: navigator.onLine,
    cookiesEnabled: navigator.cookieEnabled,
    ...(navigator.doNotTrack ? { doNotTrack: navigator.doNotTrack } : {}),
    ...(connection?.type ? { connectionType: connection.type } : {}),
    ...(connection?.effectiveType
      ? { effectiveConnectionType: connection.effectiveType }
      : {}),
    ...(typeof connection?.downlink === 'number'
      ? { downlinkMbps: connection.downlink }
      : {}),
    ...(typeof connection?.rtt === 'number'
      ? { roundTripTimeMs: connection.rtt }
      : {}),
  }
}

function sanitizeUrl(value:string) {
  try {
    const parsed = new URL(value)
    return `${parsed.origin}${parsed.pathname}`
  } catch {
    return value.split('?')[0].split('#')[0]
  }
}

async function getGeoInfo(): Promise<ActivityGeo | undefined> {
  try {
    const cached = sessionStorage.getItem(GEO_KEY)
    if (cached) return JSON.parse(cached) as ActivityGeo
  } catch {
    // Continue without cached data when storage is unavailable.
  }

  try {
    const controller = new AbortController()
    const timeout = window.setTimeout(()=>controller.abort(), 5000)
    const response = await fetch('https://ipwho.is/', {
      headers: { Accept: 'application/json' },
      signal:controller.signal,
    })
    window.clearTimeout(timeout)
    if (!response.ok) return undefined

    const data = (await response.json()) as GeoResponse
    if (data.success === false) return undefined

    const geo: ActivityGeo = {
      ...(data.ip ? { ip: data.ip } : {}),
      ...(data.city ? { city: data.city } : {}),
      ...(data.region ? { region: data.region } : {}),
      ...(data.country ? { country: data.country } : {}),
      ...(data.country_code ? { countryCode: data.country_code } : {}),
      ...(data.continent ? { continent: data.continent } : {}),
      ...(typeof data.latitude === 'number' ? { latitude: data.latitude } : {}),
      ...(typeof data.longitude === 'number'
        ? { longitude: data.longitude }
        : {}),
      ...(data.timezone?.id ? { timezone: data.timezone.id } : {}),
      ...(data.connection?.isp ? { isp: data.connection.isp } : {}),
      ...(typeof data.connection?.asn === 'number'
        ? { asn: data.connection.asn }
        : {}),
    }

    try {
      sessionStorage.setItem(GEO_KEY, JSON.stringify(geo))
    } catch {
      // Caching is optional.
    }
    return geo
  } catch {
    return undefined
  }
}

export type LogActivityOptions = {
  user?: ActivityUser
  details?: Record<string, string | number | boolean>
}

export async function logActivity(
  eventType: ActivityEventType,
  options: LogActivityOptions = {},
) {
  try {
    geoPromise ??= getGeoInfo()
    const geo = await geoPromise

    await addActivityLog({
      eventType,
      clientTimestamp: new Date().toISOString(),
      sessionId: getActivitySessionId(),
      path:window.location.pathname,
      url:sanitizeUrl(window.location.href),
      ...(document.referrer ? { referrer:sanitizeUrl(document.referrer) } : {}),
      ...(options.user ? { user: options.user } : {}),
      ...(geo && Object.keys(geo).length ? { geo } : {}),
      device: getDeviceInfo(),
      ...(options.details ? { details: options.details } : {}),
    })
  } catch {
    // Analytics must never interrupt authentication or navigation.
  }
}
