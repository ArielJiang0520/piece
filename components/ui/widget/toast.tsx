import { toast } from 'react-toastify';

export const notify_success = (content: string | React.ReactNode, autoClose: number = 3000) => toast.success(
    content, {
    className: "font-mono text-foreground bg-background text-sm",
    position: "top-right",
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
})


export const notify_error = (content: string | React.ReactNode, autoClose: number = 3000) => toast.error(
    content, {
    className: "font-mono text-foreground bg-background text-sm",
    position: "top-right",
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
})



export const notify_warning = (content: string | React.ReactNode, autoClose: number = 3000) => toast.warn(
    content, {
    className: "font-mono text-foreground bg-background text-sm",
    position: "top-right",
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
})


