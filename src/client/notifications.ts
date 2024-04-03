import { toast } from '@/components/ui/use-toast';

export type RoomNotification = {
    room: string;
    mentions: number;
    unread: number;
};

export type clientNotification = {
    user: string;
    readonly message: string;
    readonly room: string;
    readonly roomType: string;
};

function limitString(str: string, limit: number) {
    if (str.length <= limit) return str;
    return `${str.slice(0, limit - 3)}...`;
}

class NotificationsEngine {
    private permission = Notification.permission;

    askPermission() {
        if (this.permission === 'default') {
            Notification.requestPermission().then((permission) => {
                this.permission = permission;
            });
            return;
        }
    }

    sendNotification(
        notification: clientNotification,
        selectedRoom?: string,
    ) {
        if (document.hasFocus()) {
            notification.user = notification.user.trim();
            if (selectedRoom !== notification.room) {
                // Toasts don't have a title so we merge everything into the message
                // const message = notification.roomType === 'pm' ?
                //     `PM from ${notification.user}: ${notification.message}` :
                //     `${notification.room} - ${notification.user}: ${notification.message}`;
                // toast(limitString(message, 150)); //TODO: Move to UI
                toast({
                    title: 'PM from ' + notification.user,
                    description: limitString(notification.message, 150),
                });
            }
        } else {
            if (this.permission !== 'granted') return;
            const title = notification.roomType === 'pm' ?
                `PM from ${notification.user}` :
                `${notification.room} - ${notification.user}`;
            const body = notification.message;
            const icon = '';
            new Notification(title, {
                body,
                icon,
            });
        }
    }
}

export const notificationsEngine = new NotificationsEngine();
