import { ConsultationType } from '../models/consultation.model';

export class CreateConsultationDto {
  readonly type: ConsultationType;

  readonly creatorId: number;
}
