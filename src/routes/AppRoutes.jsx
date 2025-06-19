import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
// import Auth from "../pages/Auth";
// import Settings from "../pages/Settings";
// import Dashboard from "../pages/Dashboard";
// import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />    
      
      
    </Routes>
  );
};

export default AppRoutes;
