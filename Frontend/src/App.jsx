"use client"

import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import MediaCarousel from "./components/MediaCarousel"
import AuthModal from "./components/AuthModel"
import MediaDetail from "./pages/MediaDetails"
import WatchList from "./pages/WatchList"
import { useAuth } from "./utils/authContext"
import ProtectedRoute from "./utils/protectedRoute"
import SearchResultsList from "./components/searchResults"
import Recommanded from "./components/RecommendedMovies"

export default function App() 
{
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [activeAuthTab, setActiveAuthTab] = useState("register")
    const [watchLaterList, setWatchLaterList] = useState([])
    const {isLoggedin} = useAuth();
    const [searchText,setSearchText] = useState("");
    const handleWatchLater = (item) => 
    {
        setWatchLaterList((prev) => 
        {
            const exists = prev.find((i) => i.id === item.id)
            return exists ? prev.filter((i) => i.id !== item.id) : [...prev, item]
        })
    }

    return (
        <>
        
        <div className="min-h-screen bg-gray-50">
        <ProtectedRoute>
            <Navbar
                onRegisterClick={() => 
                {
                    setIsAuthModalOpen(true)
                    setActiveAuthTab("register")
                }}

                setSearch = {setSearchText}
            />
            
            <Routes>
                <Route
                    path="/"
                    element={
                        <main className="container mx-auto px-6">
                            <MediaCarousel onWatchLater={handleWatchLater} />
                        </main>
                    }
                />
                <Route path="/title/:id" element={<MediaDetail onWatchLater={handleWatchLater} />} />
                <Route path="/movies" element={<Recommanded/>}/>
                <Route path="/watchlist" element={<WatchList items={watchLaterList} onWatchLater={handleWatchLater} />} />
                <Route path="/searchResults" element={<SearchResultsList searchTerm={searchText} /> }/>
            </Routes>
        </ProtectedRoute>
        </div>
        </>
    )
}



// "use client";

// import { useState } from "react";
// import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import MediaCarousel from "./components/MediaCarousel";
// import AuthModal from "./components/AuthModel";
// import MediaDetail from "./pages/MediaDetails";

// export default function App() 
// {
//     const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//     const [activeAuthTab, setActiveAuthTab] = useState("register"); // 'register' or 'signin'

//     return (
//         <div className="min-h-screen bg-white">
//             <Navbar
//                 onRegisterClick={() => {
//                     setIsAuthModalOpen(true);
//                     setActiveAuthTab("register");
//                 }}
//             />
//             <Routes>
//                 <Route
//                     path="/"
//                     element={
//                         <main className="container mx-auto px-4 py-8">
//                             <MediaCarousel />
//                         </main>
//                     }
//                 />
//                 <Route path="/title/:id" element={<MediaDetail />} />
//             </Routes>
//             <AuthModal
//                 isOpen={isAuthModalOpen}
//                 onClose={() => setIsAuthModalOpen(false)}
//                 activeTab={activeAuthTab}
//                 onTabChange={setActiveAuthTab}
//             />
//         </div>
//     );
// }





// "use client"

// import { React, useState } from "react"
// import Navbar from "./components/Navbar.jsx"
// import MediaCarousel from "./components/MediaCarousel.jsx"
// import AuthModal from "./components/AuthModel.jsx"
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// export default function App() {
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
//   const [activeAuthTab, setActiveAuthTab] = useState("register") // 'register' or 'signin'

//   return (

      
//     <div className="min-h-screen bg-white">
//       <Navbar
//         onRegisterClick={() => {
//           setIsAuthModalOpen(true)
//           setActiveAuthTab("register")
//         }}
//       />
//       <main className="container mx-auto px-4 py-8">
//         <MediaCarousel />
//       </main>
//       <AuthModal
//         isOpen={isAuthModalOpen}
//         onClose={() => setIsAuthModalOpen(false)}
//         activeTab={activeAuthTab}
//         onTabChange={setActiveAuthTab}
//       />
//     </div>
 

    
//   )
// }