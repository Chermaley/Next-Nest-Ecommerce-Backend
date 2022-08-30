import * as React from 'react';
import { io, Socket } from 'socket.io-client';
import chatReducer, { initialState } from './state/chatReducer';
import {
  addMessage,
  setConnectionEstablished,
  setConsultations,
  setMessages,
  setUser,
} from './state/actions-creators';
import { Chat } from './components/Chat';
import ChatList from './components/ChatList';
import { BasePropertyProps, useCurrentAdmin } from 'adminjs';
import { Box } from '@adminjs/design-system';
import { Message } from '../../../chat/models/message.model';

// import styled from 'styled-components';
import * as styled from 'styled-components';

export enum ChatEvent {
  CreateConsultation = 'createConsultation',
  LeaveConsultation = 'leaveConsultation',
  GetAllConsultations = 'getAllConsultations',
  Consultations = 'consultations',
  ActiveConsultation = 'activeConsultation',
  JoinConsultation = 'joinConsultationConsult',
  Messages = 'messages',
  SendMessage = 'sendMessage',
  NewMessage = 'newMessage',
  NewConsultation = 'newConsultation',
  NewMessageInConversation = 'newMessageInConsultation',
  CloseConsultation = 'closeConsultation',
  ConsultationClosed = 'consultationClosed',
}

const apiUrl = 'https://onelabcs.ru';

const App: React.FC<BasePropertyProps> = () => {
  const [socket, setSocket] = React.useState<Socket>(null);
  const [state, dispatch] = React.useReducer(chatReducer, initialState);
  const { user } = state;
  const { activeConsultation } = state;
  const [currentAdmin] = useCurrentAdmin();
  const token = currentAdmin.token;
  // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbiIsInJvbGVzIjpbeyJpZCI6MSwidmFsdWUiOiJBRE1JTiIsImRlc2NyaXB0aW9uIjoi0JDQtNC80LjQvdC40YHRgtGA0LDRgtC-0YAiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTI4VDA0OjQ5OjQ5LjE4OVoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTI4VDA0OjQ5OjQ5LjE4OVoiLCJVc2VyUm9sZXMiOnsiaWQiOjEsInJvbGVJZCI6MSwidXNlcklkIjoxfX0seyJpZCI6MiwidmFsdWUiOiJVU0VSIiwiZGVzY3JpcHRpb24iOiLQn9C-0LvRjNC30L7QstCw0YLQtdC70YwiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTI4VDA0OjQ5OjQ5LjE5MVoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTI4VDA0OjQ5OjQ5LjE5MVoiLCJVc2VyUm9sZXMiOnsiaWQiOjIsInJvbGVJZCI6MiwidXNlcklkIjoxfX1dLCJpYXQiOjE2NjE2NzUzODMsImV4cCI6MTY2NDM1Mzc4M30.UGc3VS6xgAWxFh6RMBqZ9Jz3ItOxazmFRPXbz57pFuA';
  React.useEffect(() => {
    (async function getUser() {
      const response = await fetch(`/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = await response.json();
      dispatch(setUser(user));
    })();
  }, []);

  React.useEffect(() => {
    const socket = io(`/chat`, {
      path: '/api/socket.io',
      transports: ['websocket'],
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    socket.on('connect', () => dispatch(setConnectionEstablished(true)));
    socket.on(ChatEvent.Consultations, (consultations) => {
      dispatch(setConsultations(consultations));
    });
    socket.on(ChatEvent.Messages, (messages: Message[]) =>
      dispatch(setMessages(messages)),
    );
    socket.on(ChatEvent.NewMessage, (message: Message) => {
      dispatch(addMessage(message));
    });
    setSocket(socket);
  }, []);

  return (
    user && (
      <Container variant="grey">
        <ChatList
          token={token}
          socket={socket}
          state={state}
          dispatch={dispatch}
        />
        {activeConsultation ? (
          <Chat socket={socket} state={state} dispatch={dispatch} />
        ) : null}
      </Container>
    )
  );
};

const Container = styled(Box)`
  width: 100%;
  max-height: 90vh;
  gap: 10px;
  display: grid;
  grid-template-columns: 2fr 4fr;
  padding-bottom: 24px;
`;

export default App;
