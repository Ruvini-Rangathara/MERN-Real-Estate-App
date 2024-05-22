import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import Profile from "./pages/Profile.tsx";
import About from "./pages/About.tsx";
import Header from "./components/Header.tsx";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home.tsx";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import CreateListing from "./pages/CreateListing.tsx";
import UpdateListing from "./pages/UpdateListing.tsx";

function App() {
    const currentUser = useSelector((state) => state.user.currentUser);
    useEffect(() => {
        // Redirect to sign-in page if currentUser is not available and the current route is not sign-in or sign-up
        if (!currentUser && window.location.pathname !== "/sign-in" && window.location.pathname !== "/sign-up") {
            window.location.replace("/sign-in");
        }
    }, [currentUser]);

  return (
      <BrowserRouter>
        <Header/>
        <Routes>
            <Route path="/" element={<SignIn/>} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/home" element={<Home />} />

            <Route element={<PrivateRoute />} >
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-listing" element={<CreateListing />} />
                <Route path="/update-listing/:listingId" element={<UpdateListing />} />
            </Route>

            <Route path="*" element={<Navigate to="/sign-in" />} />

        </Routes>
      </BrowserRouter>
  )
}

export default App
