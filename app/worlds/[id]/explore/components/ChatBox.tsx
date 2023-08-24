import { World } from "@/types/types"
import { useState, useRef, useEffect } from "react";
import { SendIcon } from "@/components/icon/icon";
import useStreamText from "@/hooks/useStreamText";

type Message = {
    id: number,
    role: "user" | "assistant",
    content: string
}

type ChatState = {
    messages: Message[];
    userInput: string
}

const ChatBubble = ({ role, content }: { role: string, content: string }) => (
    <div className={`flex flex-col space-y-2 justify-center items-start w-full`}>
        <div className="capitalize text-sm">{role}</div>
        <div className="bg-foreground/5 rounded-2xl px-4 py-2 whitespace-pre-line">
            {content}
        </div>
    </div>)

export default function ChatBox({ world, userRole, aiRole }: { world: World, userRole: string, aiRole: string }) {
    const [state, setState] = useState<ChatState>({ messages: [], userInput: '' })
    const chatBoxRef = useRef<HTMLDivElement | null>(null);
    const { lines, isLoading, streamText } = useStreamText()

    const aiCurrentMessageRef = useRef<string>("");

    // useEffect to accumulate tokens from 'lines' into AI's current message
    useEffect(() => {
        // On every new piece of the stream
        if (isLoading && lines.length) {
            const currentContent = lines.join('');

            // If this is the very first piece of the stream, add a new 'assistant' message
            if (state.messages.length === 0 || state.messages[state.messages.length - 1].role === 'user') {
                setState(prevState => ({
                    ...prevState,
                    messages: [...prevState.messages, { id: Date.now(), role: 'assistant', content: currentContent }]
                }));
            }
            // Otherwise, update the last 'assistant' message's content
            else {
                const updatedMessages = [...state.messages];
                updatedMessages[updatedMessages.length - 1].content = currentContent;
                setState({ ...state, messages: updatedMessages });
            }
        }

        // Once streaming stops, no special handling required as the message is already in the state
    }, [lines, isLoading]);

    useEffect(() => {
        if (chatBoxRef.current) {
            const element = chatBoxRef.current;
            element.scrollTop = element.scrollHeight;
        }
    }, [state.messages]);

    const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, userInput: e.target.value });
    };

    const submitToServer = async (messagesToSend: Message[]) => {
        const data = {
            world: world,
            userRole: userRole,
            aiRole: aiRole,
            messages: messagesToSend.map(msg => { return { role: msg.role, content: msg.content } })
        }
        await streamText(data, '/api/generate/roleplay')
            .then()
            .catch((error: Error) => {
                alert(error.message);
            });
    }

    const sendMessage = () => {
        const userMessage: Message = {
            id: Date.now(),
            content: state.userInput,
            role: 'user',
        };

        const updatedMessages = [...state.messages, userMessage];

        setState({
            ...state,
            messages: updatedMessages,
            userInput: '',
        });

        submitToServer(updatedMessages);
    };

    return <>

        <div className="flex flex-col space-y-3 items-start justify-center w-full overflow-y-auto max-h-[500px]" ref={chatBoxRef}>
            {state.messages.map((message, index) => (
                <ChatBubble key={message.id} role={`${message.role === "user" ? `${userRole} (You)` : `${aiRole} (AI)`}`} content={message.content} />
            ))}
        </div>


        <div className="block h-20" />


        <div className="fixed bottom-0 left-0 px-4 w-full flex flex-col items-center justify-center h-20">
            <form className="relative w-full max-w-2xl "
                onSubmit={(e) => {
                    e.preventDefault();  // Prevent the page from refreshing
                    sendMessage();
                }}>
                <input
                    placeholder="Type your message..."
                    className="w-full p-3 border rounded text-sm outline-none"
                    value={state.userInput}
                    onChange={handleUserInputChange}

                />
                <button
                    type="submit"
                    className="cursor-pointer absolute bottom-2 right-2 focus:outline-none"
                >
                    <SendIcon className="w-4 h-4 text-foreground/50 hover:text-brand" />
                </button>
            </form>
        </div>
    </>


}