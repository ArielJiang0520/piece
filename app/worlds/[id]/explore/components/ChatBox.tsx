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

type ChatState = {
    messages: Message[];
    userInput: string
}
const ChatBubble = ({ role, content, onEdit, id }: { role: string, content: string, onEdit: (id: number, newContent: string) => void, id: number }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);

    const handleEditConfirm = () => {
        onEdit(id, editedContent);
        setIsEditing(false);
    }

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedContent(content);  // Reset the edited content to the original content
    }

    return (
        <div className={`flex flex-col space-y-2 justify-center items-start w-full`}>
            <div className="flex flex-row justify-between items-center capitalize text-sm w-full">
                <span>{role}</span>
                {role.includes('You') &&
                    <PencilIcon className="cursor-pointer text-foreground/20 hover:text-brand" onClick={() => setIsEditing(true)} />
                }

            </div>
            <div className={`${role.includes('You') ? "bg-foreground/10" : "bg-foreground/5"} px-4 py-2 whitespace-pre-line w-full border-t border-b`}>
                {
                    isEditing
                        ? (
                            <input
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="outline-none bg-transparent w-full overflow-hidden"
                            />
                        )
                        : content
                }
            </div>
            {isEditing && <div className="flex flex-row justify-end items-center space-x-3 px-2 text-sm w-full">
                <button className="primaryButton py-1 px-3" onClick={handleEditConfirm}>Send</button>
                <button className="secondaryButton" onClick={handleCancelEdit}>Cancel</button>
            </div>}
        </div>
    )
}

function formatMessages(messages: Message[], userRole: string, aiRole: string): string {
    return messages.map(message => `${message.role === "user" ? capitalize(userRole) : capitalize(aiRole)}:\n${message.content}\n`).join('\n');
}

const SaveButton = ({ userRole, aiRole, messages, world }: {
    userRole: string; aiRole: string; messages: Message[]; world: World
}) => {
    const [isPublishWindowOpen, setIsPublishWindowOpen] = useState(false)
    return (
        <>
            <button
                type="button"
                onClick={() => setIsPublishWindowOpen(true)}
                className="rounded-lg border py-1 px-3 mb-2 text-base bg-background"
            >
                <span className="flex flex-row space-x-1 items-center text-foreground/80 "><SaveIcon className="w-3 h-3" /><span>Save Chat</span></span>
            </button>
            <PopupDialog
                isOpen={isPublishWindowOpen}
                setIsOpen={setIsPublishWindowOpen}
                dialogTitle='Publishing New Piece'
                dialogContent=''
                initInputValue={<CaP world={world} initValues={{ ...EmptyPiecePayload, content: formatMessages(messages, userRole, aiRole) }} />}
                confirmAction={() => { }}
                dialogType='display'
            />
        </>
    )
}

export default function ChatBox({ world, userRole, aiRole, scenario }: { world: World, userRole: string, aiRole: string, scenario: string }) {
    const [state, setState] = useState<ChatState>({ messages: [], userInput: '' })
    const chatBoxRef = useRef<HTMLDivElement | null>(null);
    const { lines, isLoading, streamText } = useStreamText()

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
            messages: messagesToSend.map(msg => { return { role: msg.role, content: msg.content } }),
            scenario: scenario
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

    const handleEditMessage = (id: number, newContent: string) => {
        const messageIndex = state.messages.findIndex(m => m.id === id);
        const updatedMessages = state.messages.slice(0, messageIndex + 1); // Get all messages up to and including the edited message
        updatedMessages[messageIndex].content = newContent;  // Update the content of the edited message
        setState({
            ...state,
            messages: updatedMessages
        });
        // Optionally, trigger the conversation to continue from this point by calling your API
        submitToServer(updatedMessages);
    };

    const handleRegenerate = () => {
        // Filter out the latest AI reply
        const updatedMessages = state.messages.filter((message, index) => {
            return !(message.role === 'assistant' && index === state.messages.length - 1);
        });

        // Set the updated messages state
        setState({
            ...state,
            messages: updatedMessages
        });

        // Submit entire message history to the server
        submitToServer(updatedMessages);
    };

    return <>

        <div className="flex flex-col space-y-4 items-start justify-start w-full overflow-y-auto text-foreground max-h-[500px] lg:max-h-[800px]" ref={chatBoxRef}>
            {state.messages.map((message, index) => (
                <ChatBubble key={message.id} role={`${message.role === "user" ? `${userRole} (You)` : `${aiRole} (AI)`}`} content={message.content} onEdit={handleEditMessage} id={message.id} />

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
                <div className="flex flex-row justify-center space-x-2">
                    <button
                        type="button"
                        onClick={handleRegenerate}
                        className="rounded-lg border py-1 px-3 mb-2 text-base bg-background"
                    >
                        <span className="flex flex-row space-x-1 items-center text-foreground/80 "><ResetIcon className="w-3 h-3" /><span>Regenerate</span></span>
                    </button>
                    <SaveButton world={world} messages={state.messages} userRole={userRole} aiRole={aiRole} />
                </div>


                <div className="flex flex-row items-center justify-center w-full max-w-2xl  space-x-3">
                    <input
                        placeholder="Type your message..."
                        className="flex-grow p-3 border rounded text-sm outline-none text-foreground bg-background"
                        value={state.userInput}
                        onChange={handleUserInputChange}
                    />

                    <button
                        type="submit"
                        className="cursor-pointer focus:outline-none"
                    >
                        <SendIcon className="w-5 h-5 text-foreground/50 hover:text-brand" />
                    </button>
                </div>
            </form>
        </div>
    </>


}