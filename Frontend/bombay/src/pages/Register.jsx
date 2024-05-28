import React, { useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [dob, setDob] = useState("");
  const [photo, setPhoto] = useState(null);
  const [resume, setResume] = useState(null);
  const navigate=useNavigate()

  const handleClick = () => {
    navigate("/")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
   const formData = new FormData();
   formData.append("email", email);
   formData.append("password", password);
   formData.append("username", userName);
   formData.append("dob", dob);
   formData.append("profilePic", photo);
    formData.append("resume", resume);
    console.log("resume", resume.name);

    fetch("https://iiit-bombay-2.onrender.com/users/register", {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        if (data.msg === "User Successfully Registered") {
          toast.success(data.msg);
          localStorage.clear();
          setTimeout(() => {
            navigate("/userProfile");
          },2000)
          
        } else {
          toast.error(data.msg);
        }
      })
      .catch((err) => {
        console.log(err.message);
        toast.error(err.message);
      });
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <ToastContainer />
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          as="form"
          onSubmit={handleSubmit}
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>User Name</FormLabel>
                  <Input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="dob" isRequired>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="imageUpload" isRequired>
              <FormLabel>Upload Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                sx={{
                  "::file-selector-button": {
                    height: "100%",
                    padding: "0 1rem",
                    margin: "0",
                    border: "1px solid",
                    borderColor: useColorModeValue("gray.300", "gray.600"),
                    borderRadius: "md",
                    backgroundColor: useColorModeValue("gray.50", "gray.800"),
                    _hover: {
                      backgroundColor: useColorModeValue(
                        "gray.100",
                        "gray.700"
                      ),
                    },
                  },
                }}
              />
            </FormControl>
            <FormControl id="resumeUpload" isRequired>
              <FormLabel>Upload Resume</FormLabel>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files[0])}
                sx={{
                  "::file-selector-button": {
                    height: "100%",
                    padding: "0 1rem",
                    margin: "0",
                    border: "1px solid",
                    borderColor: useColorModeValue("gray.300", "gray.600"),
                    borderRadius: "md",
                    backgroundColor: useColorModeValue("gray.50", "gray.800"),
                    _hover: {
                      backgroundColor: useColorModeValue(
                        "gray.100",
                        "gray.700"
                      ),
                    },
                  },
                }}
              />
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                type="submit"
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user? <Link onClick={handleClick} color={"blue.400"}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default Register;
