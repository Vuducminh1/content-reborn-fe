import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useApp } from '../lib/contexts';

export default function ProtectedRoute({ children }: { children?: React.ReactNode }) {
    // const { isAuthenticated } = useApp();
    // const location = useLocation();

    // TEMPORARY: Bypass protection
    // if (!isAuthenticated) {
    //    return <Navigate to="/login" state={{ from: location }} replace />;
    // }

    return <>{children}</>;
}