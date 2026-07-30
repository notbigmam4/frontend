import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../@/components/ui/button';
import {
    requestMotionPermission,
    type MotionPermissionResult,
} from '../utils/motionPermission';

type PermissionRouteState = {
    reason?: MotionPermissionResult;
};

const PermissionRequired = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const routeState = location.state as PermissionRouteState | null;
    const [reason, setReason] = useState<MotionPermissionResult | undefined>(
        routeState?.reason,
    );
    const [requesting, setRequesting] = useState(false);

    async function tryAgain() {
        setRequesting(true);
        const permission = await requestMotionPermission();

        if (permission === 'granted') {
            navigate('/f', { replace: true });
            return;
        }

        setReason(permission);
        setRequesting(false);
    }

    return (
        <main className="flex min-h-screen w-screen items-center justify-center bg-white px-6">
            <section className="flex w-full max-w-[420px] flex-col items-center text-center">
                <AlertTriangle size={44} className="mb-5 text-destructive" />
                <h1 className="text-2xl font-semibold text-[#444f55]">
                    Tillatelse er påkrevd
                </h1>
                <p className="mt-3 text-gray-500">
                    Nødvendig tilgang til bevegelsessensoren ble ikke gitt.
                    Appen kan derfor ikke fungere som den skal.
                </p>

                {reason === 'insecure' && (
                    <p className="mt-4 text-sm text-gray-500">
                        Bevegelse kan bare aktiveres fra den sikre HTTPS-versjonen
                        av siden.
                    </p>
                )}
                {reason === 'unavailable' && (
                    <p className="mt-4 text-sm text-gray-500">
                        Bevegelsessensoren er ikke tilgjengelig i denne
                        nettleseren.
                    </p>
                )}

                <Button
                    className="mt-7"
                    onClick={tryAgain}
                    disabled={requesting}
                >
                    {requesting ? 'Venter...' : 'Prøv igjen'}
                </Button>

                <p className="mt-5 text-sm leading-5 text-gray-500">
                    Hvis det ikke vises et nytt tillatelsesvindu, lukk fanen
                    helt og åpne appen på nytt.
                </p>
            </section>
        </main>
    );
};

export default PermissionRequired;
