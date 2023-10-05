import { World, EmptyPiecePayload } from "@/types/types"
import { useState, useRef, useEffect } from "react";
import { PencilIcon, ResetIcon, SaveIcon, SendIcon, UploadIcon } from "@/components/icon/icon";
import useStreamText from "@/hooks/useStreamText";
import PopupDialog from "@/components/ui/input/PopupDialog";
import CaP from "@/app/create-a-piece/components/CaP";
import { capitalize } from "@/utils/helpers";

type Message = {
    id: number,
    role: "user" | "assistant",
    content: string
}

const ChatBubble = ({ role, content }: { role: string, content: string }) => {
    return (
        <div className={`flex flex-col space-y-2 justify-center items-start w-full`}>
            <div className="flex flex-row justify-between items-center capitalize text-sm w-full">
                <span>{role}</span>
            </div>
            <div className={`${role.includes('You') ? "bg-foreground/10" : "bg-foreground/5"} px-4 py-2 whitespace-pre-line w-full border-t border-b`}>
                {content}
            </div>
        </div>
    )
}


export default function ChatBoxSimulation({ world, aiRole1, aiRole2, scenario, openingMsg }: { world: World, aiRole1: string, aiRole2: string, scenario: string; openingMsg: string; }) {
    const [messages, setMessages] = useState<Message[]>([{ id: Date.now(), role: 'user', content: openingMsg }])
    const chatBoxRef = useRef<HTMLDivElement | null>(null);
    const [currentRole, setCurrentRole] = useState<'user' | 'assistant'>('assistant')
    const { lines, isLoading, streamText } = useStreamText()

    // useEffect to accumulate tokens from 'lines' into AI's current message
    useEffect(() => {
        // On every new piece of the stream
        if (isLoading && lines.length) {
            const currentContent = lines.join('');

            // If this is the very first piece of the stream, add a new 'assistant' message
            if (messages[messages.length - 1].role === 'user' && currentRole === "assistant") {
                setMessages([...messages, { id: Date.now(), role: 'assistant', content: currentContent }]);
            } else if (messages[messages.length - 1].role === 'assistant' && currentRole === "user") {
                setMessages([...messages, { id: Date.now(), role: 'user', content: currentContent }]);
            }
            // Otherwise, update the last 'assistant' message's content
            else {
                const updatedMessages = [...messages];
                updatedMessages[updatedMessages.length - 1].content = currentContent;
                setMessages(updatedMessages);
            }
        }

        // Once streaming stops, no special handling required as the message is already in the state
    }, [lines, isLoading]);

    useEffect(() => {
        if (chatBoxRef.current) {
            const element = chatBoxRef.current;
            element.scrollTop = element.scrollHeight;
        }
    }, [messages]);

    const submitToServer = async (messagesToSend: Message[], reverse = false) => {
        let data = {};

        if (!reverse) {
            data = {
                world: world,
                scenario: scenario,

                aiRole1: aiRole2,
                aiRole2: aiRole2,
                messages: messagesToSend.map(msg => { return { role: msg.role, content: msg.content } })
            }
        } else {
            data = {
                world: world,
                scenario: scenario,

                aiRole1: aiRole2,
                aiRole2: aiRole1,
                messages: messagesToSend.map(msg => { return { role: msg.role === 'user' ? 'assistant' : 'user', content: msg.content } })
            }
        }


        await streamText(data, '/api/generate/simulation')
            .then()
            .catch((error: Error) => {
                alert(error.message);
            });
    }

    const sendMessage = () => {
        // If the last message is from 'user' (i.e., aiRole1), request a message from the 'assistant' (i.e., aiRole2)
        if (messages[messages.length - 1].role === 'user') {
            setCurrentRole('assistant')
            submitToServer(messages);
        }
        // If the last message is from the 'assistant' (i.e., aiRole2), request a message from 'user' (i.e., aiRole1)
        else {
            setCurrentRole('user')
            submitToServer(messages, true);
        }
    };


    return <>

        <div className="flex flex-col space-y-4 items-start justify-start w-full overflow-y-auto text-foreground max-h-[500px] lg:max-h-[800px]" ref={chatBoxRef}>
            {messages.map((message, index) => (
                <ChatBubble key={message.id} role={`${message.role === "user" ? `${aiRole1} (AI 1)` : `${aiRole2} (AI 2)`}`} content={message.content} />
            ))}
        </div>

        <div className="block h-20" />

        <div className="fixed bottom-0 left-0 pb-4 px-4 w-full flex flex-col items-center justify-center">
            <form
                className="flex flex-col items-center justify-center w-full max-w-2xl space-y-1"
                onSubmit={(e) => {
                    e.preventDefault();  // Prevent the page from refreshing
                    sendMessage();
                }}
            >

                <button
                    type="submit"
                    className="rounded-lg border py-1 px-3 mb-2 text-base bg-background"
                >
                    Next
                </button>
            </form>
        </div>
    </>


}