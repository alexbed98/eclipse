import { useState } from "react";

export function useNotification() {
    const [notification, setNotification] = useState(null);

    const showNotification = (text, type = 'success') => {
        setNotification({text, type});
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    return {notification, showNotification};
}