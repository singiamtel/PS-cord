import Sidebar from './components/single/sidebar';
import BigPanel from './components/single/BigPanel';
import ToastProvider from './components/single/ToastProvider';
import PS_contextProvider from './components/single/PS_context';
import { useState } from 'react';

export default function Home() {
    const [darkMode, setDarkMode] = useState(true);
    function toggleDarkMode() {
        setDarkMode(!darkMode);
    }
    return (
        <PS_contextProvider>
            <ToastProvider>
                <div className={`grid grid-cols-7 grid-rows-1 h-screen bg-gray-300 w-screen ${darkMode ? '' : ''}`}>
                    <Sidebar className="col-span-1" />
                    <BigPanel className="col-span-6" />
                </div>
            </ToastProvider>
        </PS_contextProvider>
    );
}
