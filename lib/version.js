// lib/version.js
export const APP_VERSION = "0.12";
export const VERSION_DATE = "2025-09-27";
export const ENVIRONMENT = process.env.NODE_ENV || "development";

export const getVersionBadgeClass = () => {
    if (typeof window !== 'undefined') {
        const isLocalhost = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';

        if (isLocalhost) {
            return "text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded font-medium";
        }
    }
    return "text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded";
};