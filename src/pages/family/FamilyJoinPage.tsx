import { useNavigate } from 'react-router-dom';

import { FamilyJoinForm } from '@/features/auth/ui/family/FamilyJoinForm';

export function FamilyJoinPage() {
  const navigate = useNavigate();

  return <FamilyJoinForm onHome={() => navigate('/', { replace: true })} />;
}
