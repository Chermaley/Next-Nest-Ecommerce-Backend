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
import Chat from './components/Chat';
import ChatList from './components/ChatList';
import { BasePropertyProps, useCurrentAdmin } from 'adminjs';
import { Box } from '@adminjs/design-system';
import { Message } from '../../../chat/models/message.model';

// import * as styled from 'styled-components';
import styled from 'styled-components';

import { ChatEvent } from './types/Event';

const App: React.FC<BasePropertyProps> = () => {
  const [socket, setSocket] = React.useState<Socket>(null);
  const [state, dispatch] = React.useReducer(chatReducer, initialState);
  const { user, apiUrl } = state;
  const { activeConsultation } = state;
  const [currentAdmin] = useCurrentAdmin();
  const token = currentAdmin.token;

  React.useEffect(() => {
    (async function getUser() {
      const response = await fetch(`${apiUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'omit',
      });
      const user = await response.json();
      dispatch(setUser(user));
    })();
  }, []);

  React.useEffect(() => {
    const socket = io(`/chat`, {
      path: `${apiUrl}/socket.io`,
      auth: { token },
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
    return () => {
      socket.off('connect');
      socket.off(ChatEvent.Consultations);
      socket.off(ChatEvent.Messages);
      socket.off(ChatEvent.NewMessage);
    };
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
