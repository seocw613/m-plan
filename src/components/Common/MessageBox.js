import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { MessageContext } from "../../contexts/MessageContext";

const MessageLayout = styled.div`
    position: fixed;
    top: 0;
    right: 30px;
    width: 300px;
`;

const MessageContainer = styled.div`
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 0 5px 0 gray;
    margin-top: 20px;
    padding: 16px;
`;

function MessageBox() {
    // 메시지 목록
    const { messages } = useContext(MessageContext);

    return (
        <MessageLayout>
            {messages.map((message) => (
                <MessageContainer key={message.time}>
                    <span>{message.content}</span>
                </MessageContainer>
            ))}
        </MessageLayout>
    );
};

export default MessageBox;