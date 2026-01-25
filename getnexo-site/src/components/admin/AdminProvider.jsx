'use client';

// React import removed (not needed for JSX in modern React/Vite)
import { ThemeProvider } from '../../design-system/theme/ThemeContext';
import { ToastProvider } from '../../design-system/components/Toast';

export const AdminProvider = ({ children }) => {
    return (
        <ThemeProvider>
            <ToastProvider position="top-right" duration={3000}>
                {children}
            </ToastProvider>
        </ThemeProvider>
    );
};

export default AdminProvider;
