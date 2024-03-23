
import { Slide, ToastContainer } from 'react-toastify';

interface ToastProviderProps {
    children: React.ReactNode;
}

export default function ToastProvider({ children }: Readonly<ToastProviderProps>) {
    return (
        <>
            {children}
            <ToastContainer transition={Slide} theme='dark' hideProgressBar autoClose={2500}/>
        </>
    );
}
