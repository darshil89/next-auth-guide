import { getSession } from 'next-auth/react';

import UserProfile from '../components/profile/user-profile';

function ProfilePage(props) {
  const {session} = props;
  // console.log(session);
  return <UserProfile data={session} />;
}
//below code is the restriction for accessing the page without login
export async function getServerSideProps(context) {
  
  const session = await getSession({ req: context.req });
  
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }
  
  return {
    props: { session },
  };
}

export default ProfilePage;