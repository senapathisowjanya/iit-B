import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";

import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Stack,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  HStack,
} from "@chakra-ui/react";
import { FiMoreVertical } from "react-icons/fi";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const dummyPhoto = "https://via.placeholder.com/50";
const ITEMS_PER_PAGE = 5; 

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState({
    _id: "",
    username: "",
    dob: "",
    email: "",
    password: "",
    photo: null,
    resume: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const borderColor = useColorModeValue("blue.400", "blue.600");
  const bgColor = useColorModeValue("white", "gray.700");

  useEffect(() => {
    fetch("https://iiit-bombay-2.onrender.com/users/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        console.log(data);
      })
      .catch((err) => toast.error(err.message));
  }, []);

  const toggleApproval = (userId) => {
    fetch(`https://iiit-bombay-2.onrender.com/users/approve/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId
                ? { ...user, isApproved: !user.isApproved }
                : user
            )
          );
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const deleteUser = (userId) => {
    fetch(`https://iiit-bombay-2.onrender.com/users/delete/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userId)
          );
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const openEditModal = (user) => {
    console.log("user", user);

    setEditUser({
      _id: user._id,
      username: user.username,
      dob: user.dob,
      email: user.email,
      password: user.password,
      photo: null,
      resume: null,
    });
    setTimeout(() => {
      console.log("edituser", editUser);
    }, 2000);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditUser({
      _id: "",
      username: "",
      dob: "",
      email: "",
      password: "",
      photo: null,
      resume: null,
    });
    setEditModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const obj = {
      username: editUser.username,
      dob: editUser.dob,
      email: editUser.email,
    };
    const formData = new FormData();
    console.log("name", editUser.username);
    formData.append("username", editUser.username);
    formData.append("dob", editUser.dob);
    formData.append("email", editUser.email);

    fetch(`https://iiit-bombay-2.onrender.com/users/update/${editUser._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === editUser._id ? { ...user, ...editUser } : user
            )
          );
          toast.success(data.msg);
          closeEditModal();
        } else {
          toast.error(data.msg);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const filteredUsers = users.filter((user) => {
    if (user.role !== "user") {
      return false; 
    }
    if (filter === "approve") {
      return user.isApproved;
    } else if (filter === "disapprove") {
      return !user.isApproved;
    } else {
      return true; 
    }
  });

  const downloadResume = (resumeUrl, fileName) => {
    const fileurl = `${resumeUrl}`;
    fetch(fileurl)
      .then((response) => response.blob())
      .then((blob) => {
        saveAs(blob, fileName);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const indexOfLastUser = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <Box p={6} display="flex" justifyContent="center">
      <ToastContainer />
      <Stack spacing={4} width="100%" maxW="1200px">
        <Box mb={4}>
          <Button
            onClick={() => setFilter("all")}
            colorScheme={filter === "all" ? "blue" : "gray"}
            mr={4}
          >
            All
          </Button>
          <Button
            onClick={() => setFilter("approve")}
            colorScheme={filter === "approve" ? "green" : "gray"}
            mr={4}
          >
            Approved
          </Button>
          <Button
            onClick={() => setFilter("disapprove")}
            colorScheme={filter === "disapprove" ? "red" : "gray"}
          >
            Disapproved
          </Button>
        </Box>
        {currentUsers.map((user, index) => (
          <Flex
            key={user._id}
            align="center"
            p={4}
            bg={bgColor}
            boxShadow="lg"
            rounded="md"
            _hover={{ border: "2px solid", borderColor }}
          >
            <Text width="50px" textAlign="center" mr={4}>
              {index + 1 + indexOfFirstUser}
            </Text>
            <Image
              borderRadius="full"
              boxSize="50px"
              src={
                user.photo
                  ? `https://iiit-bombay-2.onrender.com/photo/${user.photo}`
                  : dummyPhoto
              }
              alt={user.username}
              mr={4}
            />
            <Box flex="1" minW="150px" mr={4}>
              <Text fontWeight="bold">{user.username}</Text>
            </Box>
            <Box flex="1" minW="200px" mr={4}>
              <Text>{user.email}</Text>
            </Box>
            <Button
              width="150px"
              colorScheme={user.isApproved ? "green" : "red"}
              onClick={() => toggleApproval(user._id)}
              mr={4}
            >
              {user.isApproved ? "Approved" : "Disapproved"}
            </Button>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                variant="ghost"
                ml={2}
              />
              <MenuList>
                <MenuItem
                  icon={<EditIcon />}
                  onClick={() => openEditModal(user)}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  icon={<DownloadIcon />}
                  onClick={() =>
                    downloadResume(
                      `https://iiit-bombay-2.onrender.com/photo/${user.resume}`,
                      user.username + "_resume"
                    )
                  }
                >
                  Download
                </MenuItem>
                <MenuItem
                  icon={<DeleteIcon />}
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        ))}
        
        {/* Pagination */}
        <Box mt={4} textAlign="center">
          <IconButton
            icon={<ChevronLeftIcon />}
            onClick={() => paginate(currentPage - 1)}
            colorScheme="gray"
            disabled={currentPage === 1}
          />
          <Button colorScheme="gray" mx={1} disabled>
            {currentPage}
          </Button>
          <IconButton
            icon={<ChevronRightIcon />}
            onClick={() => paginate(currentPage + 1)}
            colorScheme="gray"
            disabled={currentPage >= totalPages}
          />
        </Box>
      </Stack>

      {/* Edit Modal */}
      <Modal isOpen={editModalOpen} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleEditSubmit}>
              <Stack spacing={4}>
                <FormControl id="username" isRequired>
                  <FormLabel>User Name</FormLabel>
                  <Input
                    type="text"
                    value={editUser.username}
                    onChange={(e) =>
                      setEditUser({ ...editUser, username: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl id="dob" isRequired>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    type="date"
                    value={editUser.dob}
                    onChange={(e) =>
                      setEditUser({ ...editUser, dob: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    value={editUser.email}
                    onChange={(e) =>
                      setEditUser({ ...editUser, email: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={editUser.password}
                      onChange={(e) =>
                        setEditUser({ ...editUser, password: e.target.value })
                      }
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
                <FormControl id="photo">
                  <FormLabel>Upload Image</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setEditUser({ ...editUser, photo: e.target.files[0] })
                    }
                    sx={{
                      "::file-selector-button": {
                        height: "100%",
                        padding: "0 1rem",
                        margin: "0",
                        border: "1px solid",
                        borderColor: useColorModeValue("gray.300", "gray.600"),
                        borderRadius: "md",
                        backgroundColor: useColorModeValue(
                          "gray.50",
                          "gray.800"
                        ),
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
                <FormControl id="resume">
                  <FormLabel>Upload Resume</FormLabel>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setEditUser({ ...editUser, resume: e.target.files[0] })
                    }
                    sx={{
                      "::file-selector-button": {
                        height: "100%",
                        padding: "0 1rem",
                        margin: "0",
                        border: "1px solid",
                        borderColor: useColorModeValue("gray.300", "gray.600"),
                        borderRadius: "md",
                        backgroundColor: useColorModeValue(
                          "gray.50",
                          "gray.800"
                        ),
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
                    Save
                  </Button>
                </Stack>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminDashboard;
