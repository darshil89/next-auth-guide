import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";

function UserProfile(props) {
  const { data } = props;
  // console.log(data.user.email);
  async function changePasswordHandler(passwordData) {
    const response = await fetch("/api/user/change-password", {
      method: "PATCH",
      body: JSON.stringify(passwordData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(passwordData);
    
    const data = await response.json();
    
    console.log(data.message);
  }

  return (
    <section className={classes.profile}>
      <h2>Welcome - {data.user.email}</h2>
      <ProfileForm onChangePassword={changePasswordHandler} />
    </section>
  );
}

export default UserProfile;
