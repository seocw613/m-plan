import { useRef, useState } from "react";

export function useMessage() {
    // 메시지 목록
    const [messages, setMessages] = useState([]);
    // 비동기 처리를 해결하기 위한 메시지 목록
    const messagesRef = useRef([]);

    // 메시지 추가
    const addMessage = (content) => {
        // 메시지 추가
        const message = { time: Date.now(), content: content };
        messagesRef.current.push(message);
        setMessages([...messagesRef.current]);
        // 일정 시간 표시 후 메시지 삭제
        setTimeout(() => {
            deleteMessage();
        }, 3000);
    };

    // 메시지 삭제
    const deleteMessage = () => {
        messagesRef.current.shift();
        setMessages([...messagesRef.current]);
    };

    return { messages, addMessage };
};