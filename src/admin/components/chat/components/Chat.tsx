import * as React from 'react';
import {Socket} from 'socket.io-client';
import {Box, Button, FormGroup, Text, TextArea} from '@adminjs/design-system';
import {initialState} from '../state/chatReducer';
import {Message} from '../../../../chat/models/message.model';
import {setActiveConsultation} from '../state/actions-creators';

import {ChatEvent} from '../types/Event';
// import * as styled from 'styled-components';
import styled from 'styled-components';

type ChatProps = {
  socket: Socket;
  state: typeof initialState;
  dispatch: any;
};

const useChatScroll = (dep: any) => {
  const ref = React.useRef<any>(null);
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dep]);
  return ref;
};

const Chat: React.FC<ChatProps> = ({ socket, state, dispatch }) => {
  const { messages, user, activeConsultation } = state;
  const scrollRef = useChatScroll(messages);

  const sendMessage = (text: string) => {
    if (user) {
      socket.emit(ChatEvent.SendMessage, {
        message: text,
        userId: user.id,
        consultationId: activeConsultation.id,
      });
    }
  };


  const closeConsultation = () => {
    socket.emit(ChatEvent.CloseConsultation, activeConsultation.id);
    dispatch(setActiveConsultation(null));
  };


  return (
    <Box height="100%" variant="white">
      <Box
        flex
        justifyContent="space-between"
        alignItems="center"
        variant="grey"
        marginBottom={15}
      >
        <Text fontSize={16}>Консультация c id: {activeConsultation.id}</Text>
        {activeConsultation.status === 'Open' && (
          <Button onClick={closeConsultation}>Закрыть</Button>
        )}
      </Box>
      <Box variant="light">
        <Box flex flexDirection="column" height="75vh">
          <Box
            flex={1}
            marginBottom="10px"
            padding="20px 10px 0 10px"
            overflowY="scroll"
            position="relative"
            ref={scrollRef}
          >
            {messages?.map((message) => (
              <MessageItem
                key={message.id}
                isAuthor={user.id === message.userId}
                message={message}
              />
            ))}
          </Box>
          {activeConsultation.status === 'Open' && (
            <Input submit={sendMessage} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;

const MessageItem: React.FC<{ message: Message; isAuthor: boolean }> = ({
  message,
  isAuthor,
}) => {
  const MessageContent: React.FC<{ children: React.ReactElement }> = ({
    children,
  }) =>
    !isAuthor ? (
      <MessageRightContent>{children}</MessageRightContent>
    ) : (
      <MessageLeftContent>{children}</MessageLeftContent>
    );

  return (
    <Box
      flex
      position="relative"
      marginBottom="25px"
      justifyContent={!isAuthor && 'flex-end'}
    >
      <MessageContent>
        <Box flex alignItems="center">
          <Text color={!isAuthor ? '#fff' : 'black'}>{message.message}</Text>
        </Box>
      </MessageContent>
      {/*<div className={styles.info}>*/}
      {/*  <div className={styles.time}>121</div>*/}
      {/*</div>*/}
    </Box>
  );
};

const MessageRightContent = styled(Box)`
  flex-direction: column;
  max-width: 250px;
  display: inline-flex;
  padding: 10px 15px;
  background-color: #0667eb;
  border-radius: 16px 16px 0 16px;
  justify-content: flex-end;
`;

const MessageLeftContent = styled(Box)`
  flex-direction: column;
  max-width: 250px;
  display: inline-flex;
  padding: 10px 15px;
  background-color: #d0cccc;
  border-radius: 16px 16px 16px 0;
`;

const MIN_TEXTAREA_HEIGHT = 10;
const MAX_TEXTAREA_HEIGHT = 150;

type InputProps = {
  submit: (message: string) => void;
};

const Input: React.FC<InputProps> = ({ submit }) => {
  const [value, setValue] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useLayoutEffect(() => {
    if (textareaRef.current) {
      if (textareaRef.current.scrollHeight < MAX_TEXTAREA_HEIGHT) {
        textareaRef.current.style.height = 'inherit';
        textareaRef.current.style.height = `${Math.max(
          textareaRef.current.scrollHeight,
          MIN_TEXTAREA_HEIGHT,
        )}px`;
      }
    }
  }, [value]);

  const onChangeText = (value: string) => {
    setValue(value);
  };

  const onSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (value.trim()) {
      submit(value);
      setValue('');
    }
  };

  const onEnterPress = (e: any) => {
    if (e.keyCode == 13 && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <FormGroup ref={formRef} onSubmit={onSubmit}>
      <Box
        flex
        flexDirection="row"
        alignItems="flex-end"
        width="100%"
        border="2px solid #a19999"
        borderRadius="20px"
        background="src/admin/components/chat/components/Chat#FAFAFA"
      >
        <NormalTextarea
          placeholder="Введите сообщение"
          rows={1}
          onKeyDown={onEnterPress}
          ref={textareaRef}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
        />
        <SendButton type="submit">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.68533 7.1962L6.50805 8.39034C6.56709 8.4055 6.62105 8.43631 6.66424 8.47949C6.70742 8.52268 6.73823 8.57664 6.75339 8.63568L7.99308 13.5265C8.06376 13.8024 8.22051 14.0492 8.44051 14.2309C8.6605 14.4126 8.93224 14.5197 9.21612 14.5367C9.50001 14.5537 9.78121 14.4796 10.0188 14.3253C10.2563 14.171 10.4378 13.9444 10.5367 13.6787L14.882 1.98669C14.9715 1.74693 14.9898 1.48591 14.9348 1.2349C14.8797 0.983882 14.7535 0.753517 14.5714 0.571394C14.3893 0.389272 14.1589 0.263114 13.9079 0.208033C13.6569 0.152951 13.3959 0.171281 13.1561 0.260826L1.51898 4.64966C1.25235 4.74922 1.02531 4.93186 0.871158 5.17078C0.717009 5.4097 0.643872 5.69233 0.662479 5.97718C0.681087 6.26203 0.790458 6.53412 0.974546 6.75351C1.15863 6.97291 1.40774 7.12806 1.68533 7.1962Z"
              fill="#0667eb"
            />
          </svg>
        </SendButton>
      </Box>
    </FormGroup>
  );
};

const NormalTextarea = styled(TextArea)`
  outline: none;
  border: none;
  resize: none;
  background-color: transparent;
  width: 100%;
  flex: 1;
  position: relative;
  padding: 10px;
  border-radius: 20px;
  &:focus {
    border-color: transparent;
    box-shadow: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
`;

const SendButton = styled(Button)`
  margin-bottom: 5px;
  margin-right: 5px;
  background: #e4e4e4;
  border: 1px solid #e4e4e4;
  border-radius: 100px;
  width: 30px;
  height: 30px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;
