import Layout from "./Layout.jsx";

import Home from "./Home";

import Dreams from "./Dreams";

import Profile from "./Profile";

import Fortune from "./Fortune";

import Horoscopes from "./Horoscopes";

import Tarot from "./Tarot";

import Admin from "./Admin";

import Runes from "./Runes";

import Astrology from "./Astrology";

import SonicAlchemy from "./SonicAlchemy";

import Landing from "./Landing";

import Contact from "./Contact";

import Terms from "./Terms";

import Privacy from "./Privacy";

import FAQ from "./FAQ";

import Refund from "./Refund";

import Disclaimer from "./Disclaimer";

import Checkout from "./Checkout";

import PaymentSuccess from "./PaymentSuccess";

import UserRegistration from "./UserRegistration";

import Dashboard from "./Dashboard";

import CreateSandyUser from "./CreateSandyUser";

import SimpleUserCreator from "./SimpleUserCreator";

import UserCreator from "./UserCreator";

import Sandy from "./Sandy";

import DivinationHub from "./DivinationHub";

import AstrologyHub from "./AstrologyHub";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Dreams: Dreams,
    
    Profile: Profile,
    
    Fortune: Fortune,
    
    Horoscopes: Horoscopes,
    
    Tarot: Tarot,
    
    Admin: Admin,
    
    Runes: Runes,
    
    Astrology: Astrology,
    
    SonicAlchemy: SonicAlchemy,
    
    Landing: Landing,
    
    Contact: Contact,
    
    Terms: Terms,
    
    Privacy: Privacy,
    
    FAQ: FAQ,
    
    Refund: Refund,
    
    Disclaimer: Disclaimer,
    
    Checkout: Checkout,
    
    PaymentSuccess: PaymentSuccess,
    
    UserRegistration: UserRegistration,
    
    Dashboard: Dashboard,
    
    CreateSandyUser: CreateSandyUser,
    
    SimpleUserCreator: SimpleUserCreator,
    
    UserCreator: UserCreator,
    
    Sandy: Sandy,
    
    DivinationHub: DivinationHub,
    
    AstrologyHub: AstrologyHub,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Dreams" element={<Dreams />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Fortune" element={<Fortune />} />
                
                <Route path="/Horoscopes" element={<Horoscopes />} />
                
                <Route path="/Tarot" element={<Tarot />} />
                
                <Route path="/Admin" element={<Admin />} />
                
                <Route path="/Runes" element={<Runes />} />
                
                <Route path="/Astrology" element={<Astrology />} />
                
                <Route path="/SonicAlchemy" element={<SonicAlchemy />} />
                
                <Route path="/Landing" element={<Landing />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/Terms" element={<Terms />} />
                
                <Route path="/Privacy" element={<Privacy />} />
                
                <Route path="/FAQ" element={<FAQ />} />
                
                <Route path="/Refund" element={<Refund />} />
                
                <Route path="/Disclaimer" element={<Disclaimer />} />
                
                <Route path="/Checkout" element={<Checkout />} />
                
                <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
                
                <Route path="/UserRegistration" element={<UserRegistration />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/CreateSandyUser" element={<CreateSandyUser />} />
                
                <Route path="/SimpleUserCreator" element={<SimpleUserCreator />} />
                
                <Route path="/UserCreator" element={<UserCreator />} />
                
                <Route path="/Sandy" element={<Sandy />} />
                
                <Route path="/DivinationHub" element={<DivinationHub />} />
                
                <Route path="/AstrologyHub" element={<AstrologyHub />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}