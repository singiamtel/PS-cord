import {
  createRef,
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { PS_context } from "./PS_context";
import RoomCard from "./components/RoomCard";
import { InfinitySpin } from "react-loader-spinner";
import MiniSearch, { SearchResult } from "minisearch";

const minisearch = new MiniSearch({
  fields: ["title", "desc"],
  storeFields: ["title", "desc", "userCount", "section"],
  idField: "title",
});

export default function MainPage() {
  const { client } = useContext(PS_context);
  const [roomsJSON, setRoomsJSON] = useState<any>({});
  const [input, setInput] = useState<string>("");
  const [miniSearchResults, setMiniSearchResults] = useState<SearchResult[]>(
    [],
  );

  const formRef = createRef<HTMLFormElement>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focus = () => {
      inputRef.current?.focus();
    };
    focus();
    window.addEventListener("focus", focus);
    return () => {
      window.removeEventListener("focus", focus);
    };
  }, []);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");

    if (!client) return;
    client.join(input);
    setInput("");
  };

  useEffect(() => {
    if (!client) return;
    client.queryRooms(setRoomsJSON);
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
    <div className="w-full grid grid-cols-7 grid-rows-2">
      <div className="col-span-3 bg-gray-600 m-4 p-4 rounded text-white flex items-center justify-center">
        Ladder will be here when I get around to it :S
      </div>
      <div className="col-span-2 bg-gray-600 m-4 p-4 rounded text-white flex items-center justify-center">
        And this will be a cool friends list
      </div>
      <div
        className="col-span-2 row-span-2 m-4 p-4 rounded overflow-y-auto text-white bg-gray-600"
        style={{ scrollbarGutter: "stable" }}
      >
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
              onChange={(e) => {
                setInput(e.target.value);
              }}
              className="w-full rounded p-2 placeholder-gray-175 bg-gray-375 text-white"
              placeholder="Search for a room"
            />
          </form>
          <small className="text-gray-125 mb-4">
            Pressing enter will try to join the room.
          </small>

          <hr />
        </span>

        {miniSearchResults.length > 0
          ? miniSearchResults?.sort((a: any, b: any) =>
            b.userCount - a.userCount
          )
            .map((room: any, idx: number) => <RoomCard key={idx} room={room} />)
          : roomsJSON
          ? roomsJSON.chat?.sort((a: any, b: any) => b.userCount - a.userCount)
            .map((room: any, idx: number) => <RoomCard key={idx} room={room} />)
          : (
            <div className="h-full flex items-center justify-center !bg-white">
              <InfinitySpin
                width="200"
                color="#4fa94d"
              />
            </div>
          )}
      </div>
      <div className="col-span-5 bg-gray-600 m-4 p-4 rounded text-white flex items-center justify-center">
        And some random links here, like credits, repos, discord etc
      </div>
    </div>
  );
}

// {"chat":[{"title":"Lobby","desc":"Still haven't decided on a room for you? Relax here amidst the chaos.","userCount":626,"section":"Official"},
