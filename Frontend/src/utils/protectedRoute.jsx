import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/authContext";
import AuthModal from "../components/AuthModel";
import { useState } from "react";

export default function ProtectedRoute({ children }) {

   const [isAuthModalOpen, setIsAuthModalOpen] = useState(true)
      const [activeAuthTab, setActiveAuthTab] = useState("register")
      const {isLoggedIn} = useAuth();

  return isLoggedIn ? children :  <AuthModal
  isOpen={isAuthModalOpen}
  onClose={() => setIsAuthModalOpen(false)}
  activeTab={activeAuthTab}
  onTabChange={setActiveAuthTab}
/>;
}
