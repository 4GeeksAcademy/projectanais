import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/Home.jsx";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext, { Context } from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import Login from './pages/Login.jsx'; 
import PasswordResetRequest from './pages/PasswordResetRequest.jsx'
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import { Signup } from "./pages/Signup.jsx";
import { HomeGuest } from "./pages/HomeGuest.jsx";
import { Favorites } from "./pages/Favorites.jsx";
import { Movies } from "./pages/Movies.jsx";
import { RecommendationWizard } from "./pages/RecomendationWizard.jsx";
import { Recommendations } from "./pages/Recommendations.jsx";
import { About } from "./pages/About.jsx";
import Auth from "./pages/Auth.jsx";

//create your first component
const Layout = () => {
    const { store } = useContext(Context);
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div className="app-container">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <div className="content">
                        <Routes>
                            <Route element={store.isLoggedIn ? <Home /> : <HomeGuest />} path="/" />
                            <Route element={<Demo />} path="/demo" />
                            <Route element={<Single />} path="/single/:theid" />
                            <Route element={<h1>Not found!</h1>} />
                            <Route element={<Login />} path="/login" />
                            <Route element={<PasswordResetRequest />} path="/reset-password" />
                            <Route element={<PrivacyPolicy />} path="/privacy-policy" />
                            <Route element={<Signup />} path="/signup" />
                            <Route element={<Favorites />} path="/favorites" />
                            <Route element={<Movies />} path="/movies" />
                            <Route element={<RecommendationWizard />} path="/recommendation-wizard" />
                            <Route element={<Recommendations />} path="/recommendations" />
                            <Route element={<About />} path="/about" />





                        </Routes>
                    </div>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);