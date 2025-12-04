import React from 'react';
import Spline from '@splinetool/react-spline';

const SplineBackground = () => {
    return (
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
            {/* Placeholder scene. Replace with actual Spline URL */}
            {/* <Spline scene="https://prod.spline.design/your-scene-url/scene.splinecode" /> */}
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary opacity-10"></div>
        </div>
    );
};

export default SplineBackground;
