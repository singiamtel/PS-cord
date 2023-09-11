import { userColor } from "@/utils/namecolour";
import { MouseEventHandler, MutableRefObject } from "react";
import { clamp, toID } from "@/utils/generic";
import { Roboto_Mono } from 'next/font/google'

export const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})

export function UsernameComponent(
  { user, alignRight, onClick, colon }: {
    user: string;
    alignRight?: boolean;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
    colon?: boolean;
  },
) {
  const rank = user.charAt(0);
  const rankDisplay = alignRight ? rank.padEnd(2, " ") : (rank === ' ' ? '' : rank );
  return (
    <>
      <span className={"text-[#9D9488] font-mono whitespace-pre " + roboto_mono.className}>
        {rankDisplay}
      </span>
      <a onClick={onClick} style={onClick && { cursor: "pointer" } }>
        <span style={{ color: userColor(user) }} className="font-bold " data-message='true'>
          {user.slice(1)}{colon && ":"}
        </span>
      </a>
    </>
  );
}

const margin = 15;
export function UserCard(
  { user, name, position, forwardRef }: {
    user: any;
    name: string;
    position: { x: number; y: number };
    forwardRef: MutableRefObject<any>;
  },
) { // user is a json
  return (
    <div
      ref={forwardRef}
      className="absolute bg-gray-600 rounded-lg p-2 w-[500px] h-[300px] text-white shadow-sm shadow-black"
      style={{
        left: clamp(position.x, margin, window.innerWidth - 500 - margin),
        top: clamp(position.y, margin, window.innerHeight - 300 - margin)
      }}
    >
      <strong><a target="_blank" href={"https://pokemonshowdown.com/users/"+toID(name)}>{name}</a></strong>
      <div className="text-xs text-gray-100">
        {user ? user.status : ""}
      </div>
    </div>
  );
}
