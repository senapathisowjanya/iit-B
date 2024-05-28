import React, { useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  // const {login}=useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email: email,
      password: password,
    };
    console.log("payload", payload);  
      fetch("https://iiit-bombay-2.onrender.com/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("s", data);

           if (data.msg === "Login Success") {
             localStorage.setItem("role", data.user.role);
             toast.success(data.msg);

             if (data.user.role === "admin") {
               setTimeout(() => {
                  navigate("/adminDashboard");
               },1000)
              
             } else {
               setTimeout(() => {
                   navigate("/userProfile");
               },1000)
              //  console.log("hello");
             }
           } else {
             toast.error(data.msg);
           }
         
          // if (data.msg === "Login Success" && data.user.role === "admin") {
          //   toast.success(data.msg);

          //   navigate("/adminDashboard");
          //    localStorage.setItem("role", data.user.role);
          // } else if (
          //   data.msg === "Login Success" &&
          //   data.user.role === "user"
          // ) {
          //   toast.success(data.msg);
          //    localStorage.setItem("role", data.user.role);
          // } else if (data.msg == "Invalid password") {
          //   toast.error(data.msg);
          //    localStorage.setItem("role", data.user.role);
          // } else {
          //   toast.error(data.msg);
          //   console.log("a");
            
          // }
        })
        .catch((err) => {
          console.log(err.message, "hello");
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
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool <Link color={"blue.400"}>features</Link> ✌️
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
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Link color={"blue.400"} href="/signUp">
                  SignUp
                </Link>
              </Stack>
              <Button
                type="submit"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default Login;
