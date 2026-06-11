import type { CreatePetInvitationCodeResponse } from '@/features/auth';

export interface InvitationCodeState extends CreatePetInvitationCodeResponse {
  createdAt: number;
}
