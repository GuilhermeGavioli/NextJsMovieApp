import { Container } from "@mui/material";

import MenuAppBar from "../MenuAppBar";
import SideAppBar from "../SideAppBar";
import FooterApp from '../FooterApp';


import { useState } from "react";
import { createContext } from "react";
export const SidebarContext = createContext();


export default function Layout(props) {
  const [sidebar, setSidebar] = useState(false); // ToggleSidebar
  const closeSidebar = () => setSidebar(false);
 
  return (
    <SidebarContext.Provider value={[sidebar, setSidebar, closeSidebar]}>
      <SideAppBar />
      <MenuAppBar />
      <Container
        maxWidth="lg"
        sx={{
          bgcolor: "rgb(240,240,240)",
          height: "fit-content",
            transition: "ease-out 0.2s",
          minHeight: '170vh'
          ,
          paddingBottom: 25
        }}
        style={sidebar ? { filter: "opacity(65%)" } : {}}
        onClick={closeSidebar}
      >
        {props.children}
          </Container>
          
      <FooterApp />
      
      {/* here */}
      
{/* there */}






      
    </SidebarContext.Provider>
  );
}
