import React from "react";
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const NavLink = ({ children, to }) => (
  <ChakraLink
    as={RouterLink}
    to={to}
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    color={useColorModeValue("black", "white")}
    fontSize="16px"
    mx={2}
  >
    {children}
  </ChakraLink>
);

function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate=useNavigate()

  const handleLogout = () => {
    
    localStorage.clear();

   
    navigate("/");
      
  };

  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      px={4}
      position="fixed"
      width="100%"
      zIndex="1"
      top="0"
    >
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Flex alignItems={"center"}>
          <Text
            fontSize={"2xl"}
            fontWeight={"bold"}
            color={useColorModeValue("black", "white")}
            mx={2}
          >
            iitB
          </Text>
          <NavLink to="/adminDashboard">Dashboard</NavLink>
          <NavLink to="/">Sign In</NavLink>
          <NavLink to="/signUp">Sign Up</NavLink>
        </Flex>

        <Flex alignItems={"center"}>
          <Stack direction={"row"} spacing={7}>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>

            <Button
              px={2}
              py={1}
              rounded={"md"}
              _hover={{
                textDecoration: "none",
                bg: useColorModeValue("gray.200", "gray.700"),
              }}
              color={useColorModeValue("black", "white")}
              fontSize={"md"}
              mx={2}
              onClick={handleLogout}
            >
              Logout
            </Button>

            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  size={"sm"}
                  src={"https://avatars.dicebear.com/api/male/username.svg"}
                />
              </MenuButton>
              <MenuList alignItems={"center"}>
                <br />
                <Center>
                  <Avatar
                    size={"2xl"}
                    src={"https://avatars.dicebear.com/api/male/username.svg"}
                  />
                </Center>
                <br />
                <Center>
                  <p>Username</p>
                </Center>
                <br />
                <MenuDivider />
                <MenuItem>Your Servers</MenuItem>
                <MenuItem>Account Settings</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;
