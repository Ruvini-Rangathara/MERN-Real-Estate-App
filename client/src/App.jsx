import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import About from "./pages/About.jsx";
import Header from "./components/Header.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Home from "./pages/Home.jsx";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import CreateListing from "./pages/CreateListing.jsx";
import UpdateListing from "./pages/UpdateListing.jsx";
import Listing from "./pages/Listing.jsx";
import Search from "./pages/Search.jsx";

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
            <Route path="/search" element={<Search />} />
            <Route path="/listing/:listingId" element={<Listing />} />

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
