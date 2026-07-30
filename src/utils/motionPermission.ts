export const MOTION_PERMISSION_KEY =
    'device_orientation_permission_granted_v2';

type DeviceOrientationPermissionEvent = typeof DeviceOrientationEvent & {
    requestPermission?: () => Promise<'granted' | 'denied'>;
};

export type MotionPermissionResult =
    | 'granted'
    | 'denied'
    | 'insecure'
    | 'unavailable';

export function needsMotionPermission() {
    const orientationEvent =
        window.DeviceOrientationEvent as
            | DeviceOrientationPermissionEvent
            | undefined;

    return (
        typeof orientationEvent?.requestPermission === 'function' &&
        sessionStorage.getItem(MOTION_PERMISSION_KEY) !== 'true'
    );
}

export async function requestMotionPermission():
    Promise<MotionPermissionResult> {
    if (!window.isSecureContext) {
        return 'insecure';
    }

    const orientationEvent =
        window.DeviceOrientationEvent as
            | DeviceOrientationPermissionEvent
            | undefined;

    if (!orientationEvent?.requestPermission) {
        return 'unavailable';
    }

    try {
        const permission = await orientationEvent.requestPermission();

        if (permission !== 'granted') {
            sessionStorage.removeItem(MOTION_PERMISSION_KEY);
            return 'denied';
        }

        sessionStorage.setItem(MOTION_PERMISSION_KEY, 'true');
        window.dispatchEvent(new Event('motionpermissiongranted'));
        return 'granted';
    } catch {
        sessionStorage.removeItem(MOTION_PERMISSION_KEY);
        return 'denied';
    }
}
