import { MessageAttachment } from '../models/messageAttachment';

export class CreateMessageDto {
  readonly message: string;

  readonly consultationId: number;

  readonly userId: number;

  readonly attachments: MessageAttachment[];
}
