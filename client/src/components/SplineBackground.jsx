import React from 'react';
import Spline from '@splinetool/react-spline';

export default function SplineBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
        </div>
    );
}
