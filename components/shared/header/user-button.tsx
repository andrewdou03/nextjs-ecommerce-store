// app/components/user-button.server.tsx
import { auth } from '@/auth';
import UserButtonClient from './user-button-client';

const UserButtonServer = async () => {
  const session = await auth();

  return <UserButtonClient session={session} />;
};

export default UserButtonServer;
