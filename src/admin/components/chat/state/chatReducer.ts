import { Consultation } from '../../../../chat/models/consultation.model';
import { Message } from '../../../../chat/models/message.model';
import { User } from '../../../../users/users.model';

const chatReducer = (state: State, action: any) => {
  switch (action.type) {
    case 'setUser': {
      return {
        ...state,
        user: action.payload.user,
      };
    }
    case 'setConnectionEstablished': {
      return {
        ...state,
        isConnectionEstablished: action.payload.isConnectionEstablished,
      };
    }
    case 'setConsultations': {
      return { ...state, consultations: action.payload.consultations };
    }
    case 'setIsConsultationsFetching': {
      return {
        ...state,
        isConsultationsFetching: action.payload.isConsultationsFetching,
      };
    }
    case 'setCurrentConsultationsPage': {
      return {
        ...state,
        currentConsultationsPage: action.payload.page,
      };
    }
    case 'setIsConsultationsPagesEndReached': {
      return {
        ...state,
        isConsultationsPagesEndReached: action.payload.isReached,
      };
    }
    case 'setClosedConsultations': {
      return {
        ...state,
        closedConsultations: [
          ...state.closedConsultations,
          ...action.payload.consultations,
        ],
      };
    }
    case 'setActiveConsultation': {
      return { ...state, activeConsultation: action.payload.consultation };
    }
    case 'setMessages': {
      return { ...state, messages: action.payload.messages };
    }
    case 'addMessage': {
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
      };
    }
    default:
      break;
  }
  return state;
};

export const initialState = {
  user: null as User | null,
  isConnectionEstablished: false,
  consultations: [] as Consultation[],
  closedConsultations: [] as Consultation[],
  activeConsultation: null as Consultation,
  messages: [] as Message[],
  isConsultationsFetching: false,
  currentConsultationsPage: 0,
  isConsultationsPagesEndReached: false,
  apiUrl: process.env.NODE_ENV !== 'development' ? '/api' : ''
};

export type State = typeof initialState;

export default chatReducer;
