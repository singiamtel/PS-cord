import { HTMLAttributes, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, cubicBezier, motion } from 'framer-motion';

import ChatBox from '../single/chatbox';
import UserList from '../single/UserList';
import Chat from '../single/chat';
import { cn } from '@/lib/utils';
import BattleWindow from './battle/Battle';
import BattleControls from './battle/BattleControls';
import Calcs from './battle/Calcs';

export default function BattleRoom(props: HTMLAttributes<HTMLDivElement>) {
    const [userListOpen, setUserListOpen] = useState(false);

    return (
        <div
            id="big-panel"
            className={cn(
                props.className,
                'flex break-normal h-screen overflow-x-hidden',
            )}
        >
            <div className="flex flex-col w-3/4">
                <BattleWindow/>
                <BattleControls/>
                <Calcs/>
            </div>

            <div className="w-1/4 flex flex-col bg-gray-sidebar-light dark:bg-gray-600">
                <div
                    className="border bg-gray-251 dark:bg-gray-250 z-10 p-2 m-1 rounded-xl w-10 h-10 flex justify-center items-center cursor-pointer"
                    onClick={() => {
                        setUserListOpen(!userListOpen);
                    }}
                >
                    {
                        userListOpen ?
                            <FontAwesomeIcon icon={faCommentAlt} height={16} width={16} /> :
                            <FontAwesomeIcon icon={faUsers} height={16} width={16} />
                    }

                </div>
                <div
                    className="dark:bg-gray-300 flex flex-col min-h-0 w-full max-w-full"
                >
                    <AnimatePresence initial={false} mode="wait">
                        {userListOpen &&
                        <motion.div
                            initial={
                                {
                                    height: 0,
                                    opacity: 0,
                                }}
                            animate={
                                {
                                    height: 'fit-content',
                                    opacity: 1,
                                    transition: {
                                        height: {
                                            duration: 0.3,
                                        },
                                        opacity: {
                                            duration: 0.15,
                                            delay: 0.15,
                                        },
                                    },
                                }
                            }
                            exit={{
                                height: 0,
                                opacity: 0,
                                transition: {
                                    height: {
                                        duration: 0.3,
                                    },
                                    opacity: {
                                        duration: 0.15,
                                    },
                                },
                            }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            <UserList />
                        </motion.div>
                        }
                    </AnimatePresence>
                    <Chat className='p-2 transition-all'/>
                    <ChatBox className='transition-all'/>
                </div>

            </div>
        </div>

    );
}
