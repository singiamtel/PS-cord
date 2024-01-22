import { highlightMsg, stringsToRegex } from '../utils/highlightMsg';
import { Room } from './room';

export interface UserDefinedSettings {
    highlightWords: { [key: string]: string[] };
    theme: 'light' | 'dark';
    chatStyle: 'compact' | 'normal'; // compact = IRC style
    avatar: string;
}

export type SerializedRoom = {
    ID: string;
    lastReadTime: Date;
    open: boolean;
};

export type SavedSettings = {
    rooms: SerializedRoom[];
    username: string;
    userDefinedSettings: UserDefinedSettings;
}

export class Settings {
    readonly defaultRooms = []; // ["lobby", "help", "overused"];
    private rooms: SerializedRoom[] = [];
    /** Only serializable data should be here */
    private userDefinedSettings: UserDefinedSettings = {
        highlightWords: {},
        theme: 'dark',
        chatStyle: 'normal',
        avatar: '',
    };
    private compileHighlightWords: { [key: string]: RegExp } = {};
    private timeout: any;
    private username = '';
    private status = ''; // if status is set, it will be restored on login
    private notes: Map<string, string> = new Map();

    constructor() {
        if (typeof window === 'undefined') {
            return;
        }
        const settingsRaw = localStorage.getItem('settings');
        if (!settingsRaw) {
            return;
        }
        try {
            const settings = JSON.parse(settingsRaw) as SavedSettings;
            settings.rooms.forEach((r) => {
                this.rooms.push(r);
            });
            this.username = settings.username;
            const userDefinedSettings = settings.userDefinedSettings;
            if (userDefinedSettings) {
                this.userDefinedSettings = userDefinedSettings;
            }
            if (this.userDefinedSettings.highlightWords) {
                for (const roomid in this.userDefinedSettings.highlightWords) {
                    this.compileHighlightWords[roomid] = stringsToRegex([...this.userDefinedSettings.highlightWords[roomid], this.username]);
                }
            }
        } catch (e) {
            console.error('Corrupted settings, removing...', e, settingsRaw);
            localStorage.removeItem('settings');
        }
    }

    private saveSettings() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        const savedSettings : SavedSettings = {
            rooms: this.rooms,
            username: this.username,
            userDefinedSettings: this.userDefinedSettings,
        };
        localStorage.setItem('settings', JSON.stringify(savedSettings));
    }


    addRoom(room: Room) {
        if (!this.rooms.find((r) => r.ID === room.ID)) {
            this.rooms.push(room);
        } else {
            console.warn('addRoom', 'room already exists', room.ID);
        }
    }

    updateUsername(username: string, avatar: string) {
        this.username = username;
        this.userDefinedSettings.avatar = avatar;
        this.saveSettings();
    }

    getAvatar() {
        return this.userDefinedSettings.avatar;
    }

    getStatus() {
        return this.status;
    }

    setStatus(status: string) {
        this.status = status;
    }

    getUsername() {
        return this.username;
    }
    setUsername(username: string) {
        this.username = username;
    }
    getHighlightWords(roomid: string) {
        return this.userDefinedSettings.highlightWords[roomid] ?? [];
    }
    setHighlightWords(roomid: string, words: string[]) {
        this.userDefinedSettings.highlightWords[roomid] = [...new Set(words)];
        this.compileHighlightWords[roomid] = stringsToRegex([...words, this.username]);
        this.saveSettings();
    }

    removeRoom(roomid: string) {
        const index = this.rooms.findIndex((r) => r.ID === roomid);
        if (index !== -1) {
            // this.rooms.splice(index, 1);
            this.rooms[index].open = false;
        }
    }

    changeRooms(rooms: Map<string, Room>) {
    // Used to remember which rooms were open when the user logs out
        this.rooms = Array.from(rooms).map((e) => e[1]).filter((e) =>
            e.type === 'chat');
        this.saveSettings();
    }

    getSavedRooms() {
        const settingsRaw = localStorage.getItem('settings');
        if (!settingsRaw) {
            return [];
        }
        const settings = JSON.parse(settingsRaw);
        return settings.rooms as {
            ID: string;
            lastReadTime: Date;
        }[] ?? [];
    }

    addHighlightWord(roomid: string, word: string) {
        if (this.userDefinedSettings.highlightWords[roomid] === undefined) {
            this.userDefinedSettings.highlightWords[roomid] = [];
        }
        // this.userDefinedSettings.highlightWords[roomid]?.push(word);
        this.setHighlightWords(roomid, [...this.userDefinedSettings.highlightWords[roomid], word]);
        this.saveSettings();
    }

    removeHighlightWord(roomid: string, word: string) {
        if (!this.userDefinedSettings.highlightWords[roomid]) {
            console.warn('removeHighlightWord', 'roomid not found', roomid);
            return;
        }
        const regex = new RegExp(word, 'i');
        const words = this.userDefinedSettings.highlightWords[roomid];
        const index = words?.findIndex((w) => w.toString() === regex.toString());
        if (index === undefined || index === -1) {
            console.warn('removeHighlightWord', 'word not found', word);
        } else {
            delete words[index];
        }
    }

    clearHighlightWords(roomid: string) {
        if (!this.userDefinedSettings.highlightWords[roomid]) {
            console.warn('clearHighlightWords', 'roomid not found', roomid);
            return;
        }
        this.userDefinedSettings.highlightWords[roomid] = [];
    }

    highlightMsg(roomid: string, message: string) {
        if (!this.compileHighlightWords[roomid]) {
            this.compileHighlightWords[roomid] = stringsToRegex([...this.getHighlightWords(roomid), this.username]);
        }
        if (highlightMsg(this.compileHighlightWords[roomid], message)) {
            return true;
        }
        if (this.compileHighlightWords['global']) {
            return highlightMsg(this.compileHighlightWords['global'], message);
        }
        return false;
    }
}
