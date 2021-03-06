import Image from "next/image";
// import * as React from 'react';
import {
  Button,
  IconButton,
  Typography,
  AppBar,
  Box,
  Toolbar,
  LinearProgress,
  CircularProgress,
  Menu
} from "@mui/material";

import companyLogo from "../public/companyLogo.ico";

import { useRouter } from "next/router";

import { useContext } from "react";

import { SidebarContext } from "./Layout/Layout";

import { useSession, signIn, signOut } from "next-auth/react";

export default function ButtonAppBar() {
  const router = useRouter()

  const [sidebar, setSidebar] = useContext(SidebarContext);
  const { data: session } = useSession();

  return (
    <Box sx={{ flexGrow: 1, position: "relative" }}>
      <AppBar position="static" sx={{ bgcolor: "#272727" }}>
        <Toolbar>
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setSidebar(true)}
          >
            &#9776;
          </IconButton>


          <Box sx={{ width: '12%', cursor: 'pointer', ml: 5, display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick={()=> router.push('/movies/1')}>
            <Image src={companyLogo} alt="logo" height={30} width={30} style={{margin: 'auto', }}/>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontSize: 17, fontWeight: 700, ml: 2}}
            >
              MovieApp
            </Typography>
          </Box>
          <Box sx={{width: '60%'}}>
            {/* <Typography>something</Typography> */}
          </Box>

          <Box sx={{ width: '25%', float: 'right' }}>
            <Button
              color="inherit"
              size="large"
              variant="text"
              sx={{ fontWeight: 700, float: 'right' }}
              onClick={() => {
                !session ? signIn("google") : signOut();
              }}
            >
              {session ? "Logout" : "Login"}
            </Button>


          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
