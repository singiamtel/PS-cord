import {
    createRef,
    FormEvent,
    HTMLAttributes,
    KeyboardEventHandler,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { PS_context } from './PS_context';
import RoomCard from './components/RoomCard';
import { InfinitySpin } from 'react-loader-spinner';
import MiniSearch, { SearchResult } from 'minisearch';
import NewsCard from './components/NewsCard';

import targetFaceCluster from '../assets/cluster_target_face_nobg.png';

import github from '../assets/github.png';
import discord from '../assets/discord.png';

import { twMerge } from 'tailwind-merge';

const minisearch = new MiniSearch({
    fields: ['title', 'desc'],
    storeFields: ['title', 'desc', 'userCount', 'section'],
    idField: 'title',
});

export default function MainPage(props: HTMLAttributes<'div'>) {
    const { client } = useContext(PS_context);
    const [roomsJSON, setRoomsJSON] = useState<any>({});
    const [input, setInput] = useState<string>('');
    const [miniSearchResults, setMiniSearchResults] = useState<SearchResult[]>(
        [],
    );
    const { setRoom } = useContext(PS_context);
    const [news, setNews] = useState<any[]>([]);

    const formRef = createRef<HTMLFormElement>();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const focus = () => {
            inputRef.current?.focus();
        };
        focus();
        window.addEventListener('focus', focus);
        return () => {
            window.removeEventListener('focus', focus);
        };
    }, []);

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('submit');

        if (!client) return;
        client.join(input);
        setInput('');
    };

    const manageRoomCardClick = (str: string) => {
        if (!client) return;
        client.join(str);
    };

    const onKeyDown: KeyboardEventHandler = (e: any) => {
        if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowRight') {
            if (!formRef.current?.textContent) {
                setRoom(1);
                e.preventDefault();
                return;
            }
        }
        if ((e.key === 'Tab' && e.shiftKey) || e.key === 'ArrowLeft') {
            console.log(formRef.current?.textContent);
            if (!formRef.current?.textContent) {
                setRoom(-1);
                e.preventDefault();
                return;
            }
        }
    };

    useEffect(() => {
        if (!client) return;
        client.queryRooms(setRoomsJSON);
        client.queryNews(setNews);
    }, [client]);

    useEffect(() => {
        if (!roomsJSON?.chat) return;
        minisearch.removeAll();
        minisearch.addAll(roomsJSON.chat);
    }, [roomsJSON]);

    useEffect(() => {
        const search = minisearch.search(input, {
            fuzzy: 0.2,
            prefix: true,
        });
        setMiniSearchResults(search);
    }, [input, setMiniSearchResults]);

    return (
        <div
            className={twMerge(
                'grid grid-cols-7 grid-rows-2 gap-6 m-6',
                props.className,
            )}
        >
            <div className="col-span-3 row-span-1 rounded-lg bg-gray-600 text-white flex flex-col justify-center items-center overflow-hidden relative ">
                <img
                    src={targetFaceCluster}
                    alt="targetFaceCluster"
                    className="opacity-70 h-auto min-h-[110%]"
                />
                <div className="flex flex-col justify-between p-4 absolute">
                    <h1 className="font-bold text-4xl text-center z-10 text-transparent">
            Welcome to Showcord!
                    </h1>
                    <h2 className="font-bold text-2xl text-center z-10 text-transparent">
            Chat with your friends and meet new people
                    </h2>
                </div>
            </div>
            <div className="col-span-2 row-span-1 bg-gray-600 p-4 rounded-lg text-white flex flex-col overflow-y-auto">
                <h2 className="font-bold text-xl text-center mt-2">
          News
                </h2>
                {news?.slice(0, -1).map((n, idx) => (
                    <NewsCard key={idx} news={n} last={idx === news.length - 2} />
                ))}
            </div>
            <div className="col-span-2 row-span-2 p-4 rounded-lg overflow-y-auto text-white bg-gray-600">
                <h2 className="font-bold text-xl text-center">
          Rooms
                </h2>
                <span className="m-2 block">
          Find a chatroom for your favourite metagame or hobby!
                    <form
                        ref={formRef}
                        onSubmit={submit}
                    >
                        <input
                            value={input}
                            ref={inputRef}
                            onKeyDown={onKeyDown}
                            onChange={(e) => {
                                setInput(e.target.value);
                            }}
                            className="w-full rounded my-1 p-2 placeholder-gray-175 bg-gray-375 text-white"
                            placeholder="Search for a room"
                        />
                    </form>
                    <small className="text-gray-125 mb-4">
            Pressing enter will try to join the room.
                    </small>

                    <hr />
                </span>

                {miniSearchResults.length > 0 ?
                    miniSearchResults?.sort((a: any, b: any) =>
                        b.userCount - a.userCount)
                        .map((room: any, idx: number) => (
                            <RoomCard onClick={manageRoomCardClick} key={idx} room={room} />
                        )) :
                    roomsJSON ?
                        roomsJSON.chat?.sort((a: any, b: any) => b.userCount - a.userCount)
                            .map((room: any, idx: number) => (
                                <RoomCard onClick={manageRoomCardClick} key={idx} room={room} />
                            )) :
                        (
                            <div className="h-full flex items-center justify-center !bg-white">
                                <InfinitySpin
                                    width="200"
                                    color="#4fa94d"
                                />
                            </div>
                        )}
            </div>
            <div className="col-span-5 bg-gray-600 p-4 rounded text-white flex items-center justify-center flex-col gap-8 ">
                <a
                    id="discord"
                    className="max-h-full min-h-0 flex items-center gap-2 w-full p-8 rounded-lg hover:bg-gray-700 cursor-pointer text-white hover:text-white visited:text-white"
                    target="_blank"
                    href="https://discord.gg/kxNdKdWxW2"
                >
                    <img
                        src={discord}
                        alt="discord"
                        className="max-h-full h-auto w-auto object-contain"
                    />
                    <span>
                        <p>
              Found a bug? Have a suggestion or feedback? Join our Discord
              community to share your thoughts and help us improve!
                        </p>
                    </span>
                </a>
                <a
                    id="github"
                    className="max-h-full min-h-0 flex items-center gap-2 w-full p-8 rounded-lg hover:bg-gray-700 cursor-pointer text-white hover:text-white visited:text-white"
                    target="_blank"
                    href="https://github.com/singiamtel/Showcord"
                >
                    <img
                        src={github}
                        alt="github"
                        className="max-h-full h-auto w-auto object-contain"
                    />
                    <span>
                        <p>
              All of our code is open source and available on GitHub.
              Contribute, explore, and help us evolve!
                        </p>
                    </span>
                </a>
                <div id="links">
                    <p className="text-center">
            Made with ❤️ by{' '}
                        <a
                            href="https://github.com/singiamtel"
                            target="_blank"
                            className="text-blue-400 hover:text-blue-300 visited:text-blue-300 hover:underline"
                        >
                        singiamtel
                        </a>{' '}
                    </p>
                </div>
            </div>
        </div>
    );
}

// {"chat":[{"title":"Lobby","desc":"Still haven't decided on a room for you? Relax here amidst the chaos.","userCount":626,"section":"Official"},
