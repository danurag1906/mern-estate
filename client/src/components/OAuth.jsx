import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      //this app contains all the firebase congif details
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      //   console.log(result)  This will display all the details firebase retures on successful gmail login . we will get our display-name, email,photourl from the user collection

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      // console.log(data);
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("could not sign in with google", error);
    }
  };

  return (
    //type='button' to avoid form submission when the button is clicked as it is a part of <form> in Signin and Signup pages.
    <button
      onClick={handleGoogleAuth}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg hover:opacity-90"
    >
      CONTINUE WITH GOOGLE
    </button>
  );
}
