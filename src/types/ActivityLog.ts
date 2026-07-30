import type { Timestamp } from 'firebase/firestore'

export type ActivityEventType =
  | 'app_open'
  | 'page_view'
  | 'login_success'
  | 'login_failure'
  | 'session_restore'
  | 'admin_login_success'
  | 'admin_login_failure'

export type ActivityUser = {
  id: string
  name?: string
}

export type ActivityGeo = {
  ip?: string
  city?: string
  region?: string
  country?: string
  countryCode?: string
  continent?: string
  latitude?: number
  longitude?: number
  timezone?: string
  isp?: string
  asn?: number
}

export type ActivityDevice = {
  userAgent: string
  platform: string
  languages: string[]
  timezone: string
  screen: string
  viewport: string
  pixelRatio: number
  colorDepth: number
  touchPoints: number
  online: boolean
  cookiesEnabled: boolean
  doNotTrack?: string
  connectionType?: string
  effectiveConnectionType?: string
  downlinkMbps?: number
  roundTripTimeMs?: number
}

export type ActivityLogInput = {
  eventType: ActivityEventType
  clientTimestamp: string
  sessionId: string
  path: string
  url: string
  referrer?: string
  user?: ActivityUser
  geo?: ActivityGeo
  device: ActivityDevice
  details?: Record<string, string | number | boolean>
}

export type ActivityLog = ActivityLogInput & {
  id: string
  createdAt?: Timestamp | null
}
