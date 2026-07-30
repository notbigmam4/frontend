import { useState } from 'react';
import { motion } from 'framer-motion';
import { Move3D, X } from 'lucide-react';
import { Button } from '../../@/components/ui/button';

type DeviceOrientationPermissionEvent = typeof DeviceOrientationEvent & {
    requestPermission?: () => Promise<'granted' | 'denied'>;
};

type PermissionState =
    | 'idle'
    | 'requesting'
    | 'denied'
    | 'insecure'
    | 'unavailable';

type MotionPermissionPopupProps = {
    display: boolean;
    onClose: () => void;
};

const MotionPermissionPopup = ({
    display,
    onClose,
}: MotionPermissionPopupProps) => {
    const [permissionState, setPermissionState] =
        useState<PermissionState>('idle');

    async function requestMotionPermission() {
        if (!window.isSecureContext) {
            setPermissionState('insecure');
            return;
        }

        const orientationEvent =
            window.DeviceOrientationEvent as
                | DeviceOrientationPermissionEvent
                | undefined;

        if (!orientationEvent?.requestPermission) {
            setPermissionState('unavailable');
            return;
        }

        setPermissionState('requesting');

        try {
            const permission = await orientationEvent.requestPermission();

            if (permission === 'granted') {
                sessionStorage.setItem(
                    'device_orientation_permission_granted_v2',
                    'true',
                );
                window.dispatchEvent(new Event('motionpermissiongranted'));
                onClose();
                return;
            }

            setPermissionState('denied');
        } catch {
            setPermissionState('denied');
        }
    }

    if (!display) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[160] flex h-screen w-screen items-center justify-center overflow-y-hidden bg-black/50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex w-[calc(100%_-_32px)] max-w-[420px] flex-col items-center rounded-lg bg-white px-8 py-8 text-center"
            >
                <button
                    type="button"
                    aria-label="Lukk"
                    className="absolute left-6 top-6 cursor-pointer text-gray-500"
                    onClick={onClose}
                >
                    <X size={18} />
                </button>

                <Move3D size={40} className="mb-4 mt-2 text-[#444f55]" />
                <h1 className="text-lg font-bold">Aktiver bevegelse</h1>
                <p className="mt-2 text-gray-500">
                    Tillat bevegelsessensoren for å la N-en bevege seg når du
                    vipper telefonen.
                </p>

                {permissionState === 'insecure' && (
                    <p className="mt-4 text-sm text-gray-500">
                        Bevegelse kan bare aktiveres fra den sikre HTTPS-versjonen
                        av siden.
                    </p>
                )}
                {permissionState === 'denied' && (
                    <p className="mt-4 text-sm text-destructive">
                        Tillatelsen ble avslått. Du kan prøve igjen.
                    </p>
                )}
                {permissionState === 'unavailable' && (
                    <p className="mt-4 text-sm text-gray-500">
                        Bevegelsessensoren er ikke tilgjengelig i denne
                        nettleseren.
                    </p>
                )}

                <div className="mt-6 flex gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Ikke nå
                    </Button>
                    <Button
                        onClick={requestMotionPermission}
                        disabled={permissionState === 'requesting'}
                    >
                        {permissionState === 'requesting'
                            ? 'Venter...'
                            : 'Aktiver bevegelse'}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default MotionPermissionPopup;
