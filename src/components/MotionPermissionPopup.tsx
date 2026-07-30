import { useState } from 'react';
import { motion } from 'framer-motion';
import { Move3D } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../@/components/ui/button';
import { requestMotionPermission } from '../utils/motionPermission';

type MotionPermissionPopupProps = {
    display: boolean;
    onClose: () => void;
};

const MotionPermissionPopup = ({
    display,
    onClose,
}: MotionPermissionPopupProps) => {
    const navigate = useNavigate();
    const [requesting, setRequesting] = useState(false);

    async function enableMotion() {
        setRequesting(true);
        const permission = await requestMotionPermission();

        if (permission === 'granted') {
            onClose();
            return;
        }

        navigate('/permission-required', {
            replace: true,
            state: { reason: permission },
        });
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
                <Move3D size={40} className="mb-4 mt-2 text-[#444f55]" />
                <h1 className="text-lg font-bold">Aktiver bevegelse</h1>
                <p className="mt-2 text-gray-500">
                    Tillat bevegelsessensoren for å la N-en bevege seg når du
                    vipper telefonen.
                </p>

                <Button
                    className="mt-6"
                    onClick={enableMotion}
                    disabled={requesting}
                >
                    {requesting ? 'Venter...' : 'Aktiver bevegelse'}
                </Button>
            </motion.div>
        </div>
    );
};

export default MotionPermissionPopup;
