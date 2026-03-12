'use client';

import { Suspense, lazy, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';

// Using any for Application to avoid strict typing errors if @splinetool/runtime types are missing
const Spline = lazy(() => import('@splinetool/react-spline'));

export interface InteractiveRobotRef {
    setTargetDirection: (x: number, y: number) => void;
    resetDirection: () => void;
}

interface InteractiveRobotSplineProps {
    scene: string;
    className?: string;
}

export const InteractiveRobotSpline = forwardRef<InteractiveRobotRef, InteractiveRobotSplineProps>(
    ({ scene, className }, ref) => {
        const splineApp = useRef<any>(null);
        const frameRef = useRef<number>();

        // Target rotation (normalized -1 to 1)
        const targetRot = useRef({ x: 0, y: 0 });
        const currentRot = useRef({ x: 0, y: 0 });

        useImperativeHandle(ref, () => ({
            setTargetDirection: (x: number, y: number) => {
                // x and y are normalized direction vectors (-1 to 1)
                // Clamp to ±15deg for X-axis (tilt) and ±25deg for Y-axis (pan)
                const limitX = 15 * (Math.PI / 180);
                const limitY = 25 * (Math.PI / 180);

                targetRot.current = {
                    x: Math.max(-limitX, Math.min(limitX, y * limitX)), // Vertical diff affects X-axis rotation
                    y: Math.max(-limitY, Math.min(limitY, x * limitY)), // Horizontal diff affects Y-axis rotation
                };
            },
            resetDirection: () => {
                targetRot.current = { x: 0, y: 0 };
            }
        }));

        const animate = () => {
            // Smooth interpolation using damping
            currentRot.current.x += (targetRot.current.x - currentRot.current.x) * 0.08;
            currentRot.current.y += (targetRot.current.y - currentRot.current.y) * 0.08;

            if (splineApp.current) {
                const app = splineApp.current;
                // Attempt to rotate the entire scene
                if (app._scene) {
                    app._scene.rotation.x = currentRot.current.x;
                    // Spline Y axis might need inversion depending on scene setup
                    app._scene.rotation.y = currentRot.current.y;
                }
            }

            frameRef.current = requestAnimationFrame(animate);
        };

        const handleLoad = (app: any) => {
            splineApp.current = app;
            frameRef.current = requestAnimationFrame(animate);
        };

        useEffect(() => {
            return () => {
                if (frameRef.current) {
                    cancelAnimationFrame(frameRef.current);
                }
            };
        }, []);

        return (
            <Suspense
                fallback={
                    <div className={`w-full h-full flex items-center justify-center bg-transparent text-white ${className}`}>
                        <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
                    </div>
                }
            >
                <Spline
                    scene={scene}
                    className={className}
                    onLoad={handleLoad}
                />
            </Suspense>
        );
    }
);

InteractiveRobotSpline.displayName = 'InteractiveRobotSpline';
