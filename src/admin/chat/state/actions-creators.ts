import { Consultation } from '../../../chat/models/consultation.model';
import { Message } from '../../../chat/models/message.model';
import { User } from '../../../users/users.model';

export const setUser = (user: User) => ({
  type: 'setUser',
  payload: { user },
});

export const setConnectionEstablished = (isConnectionEstablished: boolean) => ({
  type: 'setConnectionEstablished',
  payload: { isConnectionEstablished },
});

export const setConsultations = (consultations: Consultation[]) => ({
  type: 'setConsultations',
  payload: { consultations },
});

export const setIsConsultationsFetching = (
  isConsultationsFetching: boolean,
) => ({
  type: 'setIsConsultationsFetching',
  payload: { isConsultationsFetching },
});

export const setCurrentConsultationsPage = (page: number) => ({
  type: 'setCurrentConsultationsPage',
  payload: { page },
});

export const setIsConsultationsPagesEndReached = (isReached: boolean) => ({
  type: 'setIsConsultationsPagesEndReached',
  payload: { isReached },
});

export const setClosedConsultations = (consultations: Consultation[]) => ({
  type: 'setClosedConsultations',
  payload: { consultations },
});

export const setActiveConsultation = (consultation: Consultation) => ({
  type: 'setActiveConsultation',
  payload: { consultation },
});

export const setMessages = (messages: Message[]) => ({
  type: 'setMessages',
  payload: { messages },
});

export const addMessage = (message: Message) => ({
  type: 'addMessage',
  payload: { message },
});
