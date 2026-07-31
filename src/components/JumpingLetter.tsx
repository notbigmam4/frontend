
import React, { useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import OvalCircles from './OvalCircles';

const MIN_Y = 10;
const BOTTOM_INSET = 2;
const TILT_SPAN = 30 * Math.PI / 180;
const ANGLE_FILTER_ALPHA = 0.25;

const clamp = (value: number, minimum: number, maximum: number) =>
    Math.min(Math.max(value, minimum), maximum);

const normalizeAngleDelta = (angle: number) =>
    Math.atan2(Math.sin(angle), Math.cos(angle));

const getScreenOrientation = () => {
    const legacyWindow = window as Window & { orientation?: number };
    return window.screen.orientation?.angle ?? legacyWindow.orientation ?? 0;
};

const getVerticalTilt = (event: DeviceOrientationEvent) => {
    if (event.beta === null || event.gamma === null) {
        return undefined;
    }

    const orientation =
        ((getScreenOrientation() % 360) + 360) % 360;
    const beta = event.beta * Math.PI / 180;
    const gamma = event.gamma * Math.PI / 180;

    if (orientation === 90) {
        return -gamma;
    }
    if (orientation === 180) {
        return -beta;
    }
    if (orientation === 270) {
        return gamma;
    }

    return beta;
};

type JumpingLetterProps = {
    motionEnabled: boolean;
};

const JumpingLetter: React.FC<JumpingLetterProps> = ({ motionEnabled }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);
    const boundsRef = useRef({ minimum: MIN_Y, maximum: MIN_Y });
    const baselineAngleRef = useRef<number>();
    const filteredAngleRef = useRef<number>();
    const positionRatioRef = useRef(0.5);
    const targetY = useMotionValue(MIN_Y);
    const y = useSpring(targetY, {
        stiffness: 240,
        damping: 26,
        mass: 0.7,
    });

    const setPositionFromRatio = useCallback((ratio: number) => {
        const { minimum, maximum } = boundsRef.current;
        targetY.set(minimum + ratio * (maximum - minimum));
    }, [targetY]);

    useEffect(() => {
        const track = trackRef.current;
        const group = groupRef.current;

        if (!track || !group) {
            return;
        }

        const updateBounds = () => {
            const maximum = Math.max(
                MIN_Y,
                track.clientHeight - group.offsetHeight - BOTTOM_INSET,
            );

            boundsRef.current = { minimum: MIN_Y, maximum };
            setPositionFromRatio(positionRatioRef.current);
        };

        updateBounds();

        const observer = new ResizeObserver(updateBounds);
        observer.observe(track);
        observer.observe(group);

        return () => observer.disconnect();
    }, [setPositionFromRatio]);

    useEffect(() => {
        if (!motionEnabled) {
            return;
        }

        const resetBaseline = () => {
            baselineAngleRef.current = undefined;
            filteredAngleRef.current = undefined;
            positionRatioRef.current = 0.5;
            setPositionFromRatio(0.5);
        };

        const handleOrientation = (event: DeviceOrientationEvent) => {
            const angle = getVerticalTilt(event);

            if (angle === undefined) {
                return;
            }

            if (
                baselineAngleRef.current === undefined ||
                filteredAngleRef.current === undefined
            ) {
                baselineAngleRef.current = angle;
                filteredAngleRef.current = angle;
                positionRatioRef.current = 0.5;
                setPositionFromRatio(0.5);
                return;
            }

            const filterDelta = normalizeAngleDelta(
                angle - filteredAngleRef.current,
            );
            const filteredAngle =
                filteredAngleRef.current +
                ANGLE_FILTER_ALPHA * filterDelta;
            filteredAngleRef.current = filteredAngle;

            const relativeTilt = normalizeAngleDelta(
                filteredAngle - baselineAngleRef.current,
            );
            const ratio = clamp(
                0.5 + relativeTilt / TILT_SPAN,
                0,
                1,
            );

            positionRatioRef.current = ratio;
            setPositionFromRatio(ratio);
        };

        const registerOrientationListener = () => {
            resetBaseline();
            window.removeEventListener(
                'deviceorientation',
                handleOrientation,
            );
            window.addEventListener(
                'deviceorientation',
                handleOrientation,
            );
        };

        registerOrientationListener();
        window.addEventListener(
            'motionpermissiongranted',
            registerOrientationListener,
        );
        window.addEventListener('orientationchange', resetBaseline);

        return () => {
            window.removeEventListener(
                'deviceorientation',
                handleOrientation,
            );
            window.removeEventListener(
                'motionpermissiongranted',
                registerOrientationListener,
            );
            window.removeEventListener(
                'orientationchange',
                resetBaseline,
            );
        };
    }, [motionEnabled, setPositionFromRatio]);

    return (
        <div
            ref={trackRef}
            className="pointer-events-none absolute inset-0 z-10 overflow-visible"
            aria-hidden="true"
        >
            <motion.div
                ref={groupRef}
                className="absolute right-[2px] top-0 h-[98px] w-0 overflow-visible"
                style={{ y }}
            >
                <div className="absolute left-[5px] top-[20px] z-10 inline-block text-5xl font-semibold text-[#969696]">
                    N
                </div>
                <OvalCircles />
            </motion.div>
        </div>
    );
};

export default JumpingLetter;
