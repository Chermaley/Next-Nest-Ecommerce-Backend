import * as React from 'react';
import { Text, Box, Input, Button } from '@adminjs/design-system';
import { Socket } from 'socket.io-client';
import { Consultation } from '../../../chat/models/consultation.model';
import { ChatEvent } from '../index';
import { initialState } from '../state/chatReducer';
import {
  setActiveConsultation,
  setClosedConsultations,
  setCurrentConsultationsPage,
  setIsConsultationsFetching,
  setIsConsultationsPagesEndReached,
} from '../state/actions-creators';
import { useEffect, useState } from 'react';

type ChatListProps = {
  socket: Socket;
  state: typeof initialState;
  dispatch: any;
  token: string;
};

enum Category {
  Consultation,
  Support,
}

const ChatList: React.FC<ChatListProps> = ({
  socket,
  state,
  dispatch,
  token,
}) => {
  const {
    consultations,
    closedConsultations,
    activeConsultation,
    isConnectionEstablished,
    currentConsultationsPage,
    isConsultationsFetching,
    isConsultationsPagesEndReached,
  } = state;
  const [selectedCategory, setSelectedCategory] = useState(
    Category.Consultation,
  );
  const [isHistory, setIsHistory] = useState(false);
  const currentList = isHistory ? closedConsultations : consultations;

  useEffect(() => {
    if (!isConsultationsPagesEndReached) {
      getHistory();
    }
  }, [isConsultationsFetching]);

  const joinConsultation = (consultation: Consultation) => {
    dispatch(setActiveConsultation(consultation));
  };

  const getHistory = async () => {
    dispatch(setIsConsultationsFetching(false));
    const response = await fetch(
      `http://localhost:5000/chat/closedConsultations?pageSize=10&page=${currentConsultationsPage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const closedConsultations = await response.json();
    if (!closedConsultations.length)
      return dispatch(setIsConsultationsPagesEndReached(true));
    dispatch(setCurrentConsultationsPage(currentConsultationsPage + 1));
    dispatch(setClosedConsultations(closedConsultations));
  };

  const onScroll = (e: any) => {
    if (
      e.target.scrollHeight - (e.target.scrollTop + window.innerHeight) <
      100
    ) {
      dispatch(setIsConsultationsFetching(true));
    }
  };

  return (
    <Box height="100%" flex flexDirection="column" variant="white">
      <Box flex justifyContent="space-between" width="100%" marginBottom={10}>
        <Button
          onClick={() => setSelectedCategory(Category.Consultation)}
          variant={
            selectedCategory === Category.Consultation ? 'success' : 'regular'
          }
        >
          Консультации
        </Button>
        <Button
          onClick={() => setSelectedCategory(Category.Support)}
          variant={
            selectedCategory === Category.Support ? 'success' : 'regular'
          }
        >
          Поддержка
        </Button>
      </Box>
      <Button
        marginBottom={10}
        onClick={() => {
          setIsHistory(!isHistory);
          getHistory();
        }}
        variant={isHistory ? 'success' : 'regular'}
      >
        История
      </Button>
      <Input
        placeholder="Введите email пользователя"
        width="100%"
        marginBottom={20}
      />
      <Box overflowY="scroll" maxHeight="70vh" onScroll={onScroll}>
        {currentList.map((consultation) => (
          <Box
            flex
            variant="grey"
            alignItems="center"
            justifyContent="space-between"
            marginBottom={15}
            height={70}
          >
            <Text fontSize={15}>
              Консультация с {consultation.creator.email}
            </Text>
            <Box onClick={() => joinConsultation(consultation)}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.5912 10.5847C6.99117 10.5846 7.37504 10.7435 7.65791 11.0262C7.94093 11.309 8.10009 11.6927 8.10026 12.0929C8.10044 12.4928 7.9418 12.8767 7.65895 13.1597C7.37627 13.4427 6.99273 13.602 6.59259 13.6022C6.19245 13.6026 5.80857 13.4439 5.52553 13.1614C5.24233 12.8788 5.083 12.4952 5.08248 12.0951C5.08248 11.6948 5.24129 11.311 5.52414 11.0276C5.80717 10.7444 6.19089 10.5851 6.59121 10.5848L6.5912 10.5847ZM6.5912 14.3521C7.19027 14.3521 7.76499 14.1141 8.18865 13.6902C8.61232 13.2666 8.85035 12.6917 8.85022 12.0925C8.85004 11.4935 8.61182 10.9188 8.18781 10.4953C7.76396 10.0717 7.18908 9.83396 6.58982 9.83432C5.99075 9.83466 5.41603 10.073 4.99273 10.497C4.56923 10.921 4.33169 11.4959 4.33222 12.0951C4.33274 12.6939 4.57113 13.2678 4.99463 13.691C5.41813 14.1143 5.99247 14.352 6.59124 14.3521L6.5912 14.3521ZM11.9048 10.5847C12.3048 10.5847 12.6885 10.7435 12.9715 11.0264C13.2544 11.3092 13.4135 11.6929 13.4137 12.093C13.4137 12.493 13.2551 12.8767 12.9722 13.1599C12.6895 13.4429 12.3058 13.602 11.9059 13.6022C11.5057 13.6026 11.122 13.4439 10.8388 13.1613C10.5556 12.8786 10.3963 12.4951 10.3959 12.0951C10.3957 11.6948 10.5547 11.3108 10.8376 11.0276C11.1206 10.7444 11.5045 10.5851 11.9048 10.5848L11.9048 10.5847ZM11.9048 14.3521C12.5041 14.3523 13.0788 14.1142 13.5026 13.6906C13.9263 13.2669 14.1643 12.6922 14.1643 12.093C14.1641 11.4938 13.9261 10.9191 13.5021 10.4955C13.0782 10.0718 12.5035 9.83392 11.9043 9.83427C11.305 9.83462 10.7303 10.073 10.3068 10.497C9.88333 10.921 9.6458 11.4959 9.64633 12.0951C9.64685 12.6936 9.88507 13.2676 10.3086 13.6907C10.7321 14.114 11.306 14.3519 11.9048 14.3521V14.3521ZM17.2184 10.5847C17.6186 10.5846 18.0023 10.7432 18.2855 11.026C18.5685 11.3087 18.7279 11.6924 18.728 12.0923C18.7284 12.4925 18.5697 12.8763 18.2871 13.1595C18.0042 13.4427 17.6207 13.6019 17.2205 13.6022C16.8204 13.6025 16.4365 13.4441 16.1533 13.1614C15.8701 12.8788 15.7108 12.4952 15.7104 12.0951C15.7104 11.695 15.869 11.3111 16.1519 11.0279C16.4346 10.7447 16.8181 10.5853 17.2184 10.5847V10.5847ZM17.2184 14.3521C17.8177 14.3523 18.3924 14.1142 18.8162 13.6906C19.2399 13.2669 19.4779 12.6922 19.4779 12.093C19.4778 11.4938 19.2397 10.9191 18.8159 10.4955C18.3919 10.0718 17.8172 9.83392 17.2179 9.83427C16.6186 9.83462 16.0439 10.073 15.6205 10.497C15.197 10.921 14.9594 11.4959 14.9599 12.0951C14.9605 12.6936 15.1987 13.2676 15.6222 13.6907C16.0457 14.114 16.6197 14.3519 17.2184 14.3521ZM0.0344267 22.9244C-0.0178193 23.117 -0.000172808 23.3218 0.0839049 23.5026C0.168153 23.6835 0.313474 23.8288 0.494428 23.9129C0.67521 23.9971 0.88004 24.0146 1.0726 23.9625L6.29942 22.5629H6.29924C8.52677 23.7612 11.0752 24.2276 13.5823 23.8961C16.465 23.5114 19.1103 22.0936 21.0262 19.9058C22.9423 17.718 23.999 14.9091 24 12.0008C24.0002 9.62723 23.2964 7.30703 21.9778 5.33367C20.6593 3.36004 18.7848 1.82179 16.592 0.913454C14.3989 0.00507195 11.9861 -0.232431 9.65792 0.230662C7.3299 0.693931 5.19152 1.83703 3.51303 3.51558C1.64188 5.37401 0.441951 7.80191 0.102177 10.417C-0.225825 12.9233 0.240403 15.4695 1.43545 17.6971L0.0348606 22.9237L0.0344267 22.9244Z"
                  fill="black"
                />
              </svg>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ChatList;
