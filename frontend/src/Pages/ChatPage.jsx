import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import MyChats from "../Components/Miscellaneous/MyChats";
import ChatBox from "../Components/Miscellaneous/ChatBox";
import SideDrawer from "../Components/Miscellaneous/SideDrawer";

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
