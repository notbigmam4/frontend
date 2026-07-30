import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  ChevronDown,
  Clock3,
  Loader2,
  MapPin,
  Monitor,
  RefreshCw,
  Users,
} from 'lucide-react'
import { Button } from '../../@/components/ui/button'
import { Input } from '../../@/components/ui/input'
import {
  getActivityLogsPage,
  type ActivityLogCursor,
} from '../firebase/firebaseUtils'
import type { ActivityEventType, ActivityLog } from '../types/ActivityLog'

const PAGE_SIZE = 50

const eventLabels: Record<ActivityEventType, string> = {
  app_open: 'App åpnet',
  page_view: 'Sidevisning',
  login_success: 'Innlogging',
  login_failure: 'Feilet innlogging',
  session_restore: 'Økt gjenopprettet',
  admin_login_success: 'Admin innlogging',
  admin_login_failure: 'Feilet admin',
}

const eventStyles: Record<ActivityEventType, string> = {
  app_open: 'bg-sky-100 text-sky-800',
  page_view: 'bg-slate-100 text-slate-700',
  login_success: 'bg-emerald-100 text-emerald-800',
  login_failure: 'bg-rose-100 text-rose-800',
  session_restore: 'bg-violet-100 text-violet-800',
  admin_login_success: 'bg-amber-100 text-amber-800',
  admin_login_failure: 'bg-red-100 text-red-800',
}

function formatTimestamp(log:ActivityLog) {
  const date = log.createdAt?.toDate?.() ?? new Date(log.clientTimestamp)
  if (Number.isNaN(date.getTime())) return 'Ukjent tidspunkt'

  return new Intl.DateTimeFormat('nb-NO', {
    dateStyle:'medium',
    timeStyle:'medium',
  }).format(date)
}

function getDeviceLabel(userAgent:string) {
  const device = /iPhone/i.test(userAgent)
    ? 'iPhone'
    : /iPad/i.test(userAgent)
      ? 'iPad'
      : /Android/i.test(userAgent)
        ? 'Android'
        : /Windows/i.test(userAgent)
          ? 'Windows'
          : /Macintosh|Mac OS/i.test(userAgent)
            ? 'Mac'
            : 'Annen enhet'

  const browser = /Edg\//i.test(userAgent)
    ? 'Edge'
    : /CriOS|Chrome\//i.test(userAgent)
      ? 'Chrome'
      : /FxiOS|Firefox\//i.test(userAgent)
        ? 'Firefox'
        : /Safari\//i.test(userAgent)
          ? 'Safari'
          : 'Ukjent nettleser'

  return `${device} · ${browser}`
}

function locationLabel(log:ActivityLog) {
  const place = [log.geo?.city, log.geo?.region, log.geo?.countryCode]
    .filter(Boolean)
    .join(', ')
  return place || 'Ukjent sted'
}

function EventBadge({eventType}:{eventType:ActivityEventType}) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${eventStyles[eventType]}`}>
      {eventLabels[eventType]}
    </span>
  )
}

function SummaryCard({
  icon,
  label,
  value,
}:{icon:React.ReactNode, label:string, value:number}) {
  return (
    <div className='rounded-xl border bg-white p-4 shadow-sm'>
      <div className='mb-3 flex items-center justify-between text-sm text-slate-500'>
        <span>{label}</span>
        {icon}
      </div>
      <p className='text-2xl font-semibold text-slate-900'>{value}</p>
    </div>
  )
}

function LogDetails({log}:{log:ActivityLog}) {
  return (
    <div className='grid gap-4 border-t bg-slate-50 p-4 text-sm sm:grid-cols-2 lg:grid-cols-3'>
      <div>
        <p className='mb-1 font-medium text-slate-900'>Økt</p>
        <p className='break-all text-slate-600'>{log.sessionId}</p>
      </div>
      <div>
        <p className='mb-1 font-medium text-slate-900'>Nettverk</p>
        <p className='text-slate-600'>{log.geo?.ip || 'Ingen IP-data'}</p>
        <p className='text-slate-600'>{log.geo?.isp || 'Ukjent leverandør'}</p>
        {log.geo?.asn && <p className='text-slate-600'>AS{log.geo.asn}</p>}
      </div>
      <div>
        <p className='mb-1 font-medium text-slate-900'>Posisjon</p>
        <p className='text-slate-600'>{locationLabel(log)}</p>
        {typeof log.geo?.latitude === 'number' && typeof log.geo.longitude === 'number' && (
          <p className='text-slate-600'>
            {log.geo.latitude.toFixed(3)}, {log.geo.longitude.toFixed(3)}
          </p>
        )}
      </div>
      <div>
        <p className='mb-1 font-medium text-slate-900'>Skjerm og tilkobling</p>
        <p className='text-slate-600'>
          {log.device.screen} skjerm · {log.device.viewport} visning
        </p>
        <p className='text-slate-600'>
          {log.device.effectiveConnectionType || log.device.connectionType || 'Ukjent nettverk'}
          {typeof log.device.downlinkMbps === 'number' && ` · ${log.device.downlinkMbps} Mbps`}
        </p>
      </div>
      <div>
        <p className='mb-1 font-medium text-slate-900'>Språk og tidssone</p>
        <p className='text-slate-600'>{log.device.languages.join(', ')}</p>
        <p className='text-slate-600'>{log.device.timezone}</p>
      </div>
      <div>
        <p className='mb-1 font-medium text-slate-900'>Teknisk</p>
        <p className='text-slate-600'>
          {log.device.touchPoints} berøringspunkter · {log.device.pixelRatio}x pikseltetthet
        </p>
        <p className='break-all text-slate-600'>{log.device.userAgent}</p>
      </div>
      {log.referrer && (
        <div className='sm:col-span-2 lg:col-span-3'>
          <p className='mb-1 font-medium text-slate-900'>Henviser</p>
          <p className='break-all text-slate-600'>{log.referrer}</p>
        </div>
      )}
    </div>
  )
}

const ActivityLogDashboard = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const cursorRef = useRef<ActivityLogCursor>()
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [search, setSearch] = useState('')
  const [countryFilter, setCountryFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string>()

  const loadLogs = useCallback(async (reset = false) => {
    setLoading(true)
    setError(undefined)
    try {
      const page = await getActivityLogsPage(PAGE_SIZE, reset ? undefined : cursorRef.current)
      setLogs((current)=>{
        if (reset) return page.logs
        const existingIds = new Set(current.map((log)=>log.id))
        return [...current, ...page.logs.filter((log)=>!existingIds.has(log.id))]
      })
      cursorRef.current = page.lastDoc
      setHasMore(page.hasMore)
    } catch {
      setError('Kunne ikke hente aktivitetsloggen. Kontroller Firestore-tilgangen.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(()=>{
    void loadLogs(true)
  }, [loadLogs])

  const appOpenLogs = useMemo(
    ()=>logs.filter((log)=>log.eventType === 'app_open' && Boolean(log.user?.id)),
    [logs]
  )

  const countries = useMemo(
    ()=>Array.from(new Set(appOpenLogs.map((log)=>log.geo?.country).filter((country):country is string=>Boolean(country)))).sort(),
    [appOpenLogs]
  )

  const filteredLogs = useMemo(()=>{
    const normalizedSearch = search.trim().toLowerCase()
    return appOpenLogs.filter((log)=>{
      if (countryFilter !== 'all' && log.geo?.country !== countryFilter) return false
      if (!normalizedSearch) return true

      return [
        log.user?.name,
        log.user?.id,
        log.geo?.ip,
        log.geo?.city,
        log.geo?.region,
        log.geo?.country,
        log.path,
        eventLabels[log.eventType],
        getDeviceLabel(log.device.userAgent),
      ].some((value)=>value?.toLowerCase().includes(normalizedSearch))
    })
  }, [appOpenLogs, countryFilter, search])

  const uniqueUsers = new Set(appOpenLogs.map((log)=>log.user?.id).filter(Boolean)).size

  return (
    <section className='w-full rounded-2xl border bg-slate-50 p-4 shadow-sm sm:p-6'>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm font-medium text-sky-700'>Analyse</p>
          <h2 className='text-2xl font-semibold text-slate-950'>Aktivitetslogg</h2>
          <p className='text-sm text-slate-500'>Viser når brukere åpner appen</p>
        </div>
        <Button
          variant='outline'
          disabled={loading}
          onClick={()=>void loadLogs(true)}
          className='gap-2 bg-white'
        >
          <RefreshCw className={loading ? 'animate-spin' : ''} size={16}/>
          Oppdater
        </Button>
      </div>

      <div className='mb-6 grid gap-3 sm:grid-cols-3'>
        <SummaryCard icon={<Activity size={18}/>} label='Appåpninger' value={appOpenLogs.length}/>
        <SummaryCard icon={<Users size={18}/>} label='Unike brukere' value={uniqueUsers}/>
        <SummaryCard icon={<MapPin size={18}/>} label='Land' value={countries.length}/>
      </div>

      <div className='mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_180px]'>
        <Input
          value={search}
          onChange={(event)=>setSearch(event.target.value)}
          placeholder='Søk etter bruker, IP, sted eller side'
          className='bg-white'
        />
        <select
          value={countryFilter}
          onChange={(event)=>setCountryFilter(event.target.value)}
          className='h-9 rounded-md border border-input bg-white px-3 text-sm shadow-sm'
        >
          <option value='all'>Alle land</option>
          {countries.map((country)=><option key={country} value={country}>{country}</option>)}
        </select>
      </div>

      {error && (
        <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
          {error}
        </div>
      )}

      {!loading && filteredLogs.length === 0 && (
        <div className='rounded-xl border border-dashed bg-white p-10 text-center text-sm text-slate-500'>
          Ingen hendelser samsvarer med filtrene.
        </div>
      )}

      <div className='hidden overflow-hidden rounded-xl border bg-white md:block'>
        <table className='w-full text-left text-sm'>
          <thead className='border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500'>
            <tr>
              <th className='px-4 py-3 font-medium'>Tidspunkt</th>
              <th className='px-4 py-3 font-medium'>Hendelse</th>
              <th className='px-4 py-3 font-medium'>Bruker</th>
              <th className='px-4 py-3 font-medium'>Sted / IP</th>
              <th className='px-4 py-3 font-medium'>Enhet / side</th>
              <th className='w-10 px-2 py-3'><span className='sr-only'>Detaljer</span></th>
            </tr>
          </thead>
          <tbody className='divide-y'>
            {filteredLogs.map((log)=>(
              <Fragment key={log.id}>
                <tr
                  className='cursor-pointer hover:bg-slate-50'
                  onClick={()=>setExpandedId(expandedId === log.id ? undefined : log.id)}
                >
                  <td className='whitespace-nowrap px-4 py-3 text-slate-600'>{formatTimestamp(log)}</td>
                  <td className='px-4 py-3'><EventBadge eventType={log.eventType}/></td>
                  <td className='px-4 py-3'>
                    <p className='font-medium text-slate-900'>{log.user?.name || 'Anonym'}</p>
                    <p className='text-xs text-slate-500'>{log.user?.id || log.sessionId.slice(0, 8)}</p>
                  </td>
                  <td className='px-4 py-3'>
                    <p className='text-slate-900'>{locationLabel(log)}</p>
                    <p className='text-xs text-slate-500'>{log.geo?.ip || 'Ingen IP'}</p>
                  </td>
                  <td className='max-w-[220px] px-4 py-3'>
                    <p className='truncate text-slate-900'>{getDeviceLabel(log.device.userAgent)}</p>
                    <p className='truncate text-xs text-slate-500'>{log.path}</p>
                  </td>
                  <td className='px-2 py-3 text-slate-400'>
                    <ChevronDown className={expandedId === log.id ? 'rotate-180' : ''} size={17}/>
                  </td>
                </tr>
                {expandedId === log.id && (
                  <tr>
                    <td colSpan={6}><LogDetails log={log}/></td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className='space-y-3 md:hidden'>
        {filteredLogs.map((log)=>(
          <article key={log.id} className='overflow-hidden rounded-xl border bg-white'>
            <button
              type='button'
              className='w-full p-4 text-left'
              onClick={()=>setExpandedId(expandedId === log.id ? undefined : log.id)}
            >
              <div className='mb-3 flex items-center justify-between gap-2'>
                <EventBadge eventType={log.eventType}/>
                <ChevronDown className={expandedId === log.id ? 'rotate-180' : ''} size={17}/>
              </div>
              <p className='mb-2 font-medium text-slate-900'>{log.user?.name || 'Anonym bruker'}</p>
              <div className='space-y-1 text-xs text-slate-500'>
                <p className='flex items-center gap-2'><Clock3 size={14}/>{formatTimestamp(log)}</p>
                <p className='flex items-center gap-2'><MapPin size={14}/>{locationLabel(log)} · {log.geo?.ip || 'Ingen IP'}</p>
                <p className='flex items-center gap-2'><Monitor size={14}/>{getDeviceLabel(log.device.userAgent)} · {log.path}</p>
              </div>
            </button>
            {expandedId === log.id && <LogDetails log={log}/>}
          </article>
        ))}
      </div>

      {loading && (
        <div className='flex items-center justify-center gap-2 py-8 text-sm text-slate-500'>
          <Loader2 className='animate-spin' size={18}/> Henter aktivitet
        </div>
      )}

      {!loading && hasMore && (
        <div className='mt-5 flex justify-center'>
          <Button variant='outline' onClick={()=>void loadLogs()} className='bg-white'>
            Last inn flere
          </Button>
        </div>
      )}
    </section>
  )
}

export default ActivityLogDashboard
