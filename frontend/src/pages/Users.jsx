import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // baseURL for your API
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your token retrieval logic
  },
});

function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [modal, setModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("view"); // 'view', 'update', or 'delete'
  const [formData, setFormData] = useState({
    username: "",
    emailId: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    axiosInstance
      .get("/users/")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);


  const openModal = (user, type) => {
    setSelectedUser(user);
    setModalType(type);
    setIsModalOpen(true);
    setFormData({
      username: user.username,
      emailId: user.emailId,
      password: "",
      role: user.role,
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setFormData({ username: "", emailId: "", password: "", role: "" });
  };

  const handleDelete = () => {
    axiosInstance
      .delete(`/users/${selectedUser.id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        closeModal();
      })
      .catch((error) => console.error("Error deleting user:", error));
  };


   const handleUpdate = (e) => {
    e.preventDefault();
    axiosInstance
      .put(`/users/${selectedUser.id}`, formData)
      .then(() => {
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id ? { ...user, ...formData } : user
          )
        );
        closeModal();
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChat = (user) => {
    navigate(`/chat?userId=${user.id}&role=${user.role}`);
  };
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4 px-2">User List</h2>
      <Link to="/chat" className="ext-blue-500 hover:text-blue-700 mt-10 mb-2 flex justify-end">Chat Window</Link>
      <div className="w-full max-w-5xl p-6 border border-gray-300 rounded-lg shadow-md">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-20 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.emailId}</td>
                <td className="px-1 py-4 whitespace-nowrap">
                  <button
                    data-modal-target="view-modal"
                    data-modal-toggle="view-modal"
                    className="text-blue-500 hover:text-blue-700 ml-10"
                    onClick={() => {
                      setSelectedUser(user);
                      console.log(selectedUser);
                      setModal("view");
                    }}
                  >
                    View
                  </button>
                  <button
                    data-modal-target="update-modal"
                    data-modal-toggle="update-modal"
                    className="text-purple-700 hover:text-purple-900 ml-10"
                    onClick={() => {
                      setSelectedUser(user);
                      console.log(selectedUser);
                      setModal("update");
                    }}
                  >
                    Update
                  </button>
                  <button
                    data-modal-target="delete-modal"
                    data-modal-toggle="delete-modal"
                    className="text-red-500 hover:text-red-700 ml-10"
                    onClick={() => {
                      setSelectedUser(user);
                      console.log(selectedUser);
                      setModal("delete");
                    }}
                  >
                    Delete
                  </button>
                  <button
                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 ml-4"
                  onClick={() => handleChat(user)}
                >
                  Chat
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {selectedUser && modal === "view" && (
        <div
          id="view-modal"
          tabIndex="-1"
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-2 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedUser.username}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-7 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="view-modal"
                  onClick={() => {
                    setSelectedUser(null);
                    setModal(null);
                  }}
                >
                  <svg
                    className="w-3 h-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    ``
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4">
                <p className="mb-2">
                  <strong className="font-medium">Username:</strong>{" "}
                  {selectedUser.username}
                </p>
                <p className="mb-2">
                  <strong className="font-medium">Email:</strong>{" "}
                  {selectedUser.emailId}
                </p>
                <p>
                  <strong className="font-medium">Role:</strong>{" "}
                  {selectedUser.role}
                </p>
              </div>
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  data-modal-hide="view-modal"
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  onClick={() => {
                    setSelectedUser(null);
                    setModal(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {selectedUser && modal === "update" && (
        <div
          id="update-modal"
          tabIndex="-1"
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-2 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedUser.username}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-7 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="update-modal"
                  onClick={() => {
                    setSelectedUser(null);
                    setModal(null);
                  }}
                >
                  <svg
                    className="w-3 h-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    ``
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4">
                <form onSubmit={handleUpdate}>
                  <input
                    type="text"
                    name="username"
                    placeholder={selectedUser.username}
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                  <input
                    type="email"
                    name="emailId"
                    placeholder={selectedUser.emailId}
                    value={formData.emailId}
                    onChange={handleChange}
                    className="block w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="block w-full p-2 mb-4 border border-gray-300 rounded"
                  >
                    <option value="">Select role</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="institute">Institute</option>
                  </select>
                  <div className="flex w-full justify-between">
                    <button
                      type="submit"
                      className="w-1/3 p-2 bg-blue-500 text-white rounded ml-10"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="w-1/3 p-2 bg-gray-500 text-white rounded items-right mr-10"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  data-modal-hide="update-modal"
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  onClick={() => {
                    setSelectedUser(null);
                    setModal(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {selectedUser && modal === "delete" && (
        <div
          id="delete-modal"
          tabIndex="-1"
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-2 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedUser.username}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-7 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="update-modal"
                  onClick={() => {
                    setSelectedUser(null);
                    setModal(null);
                  }}
                >
                  <svg
                    className="w-3 h-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    ``
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4">
                <div>
                  <p>
                    Are you sure you want to delete {selectedUser.username}?
                  </p>
                </div>
              </div>
              <div className="flex justify-between p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  onClick={handleDelete}
                  className="w-1/3 p-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setModal(null);
                  }}
                  className="w-1/3 p-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Link to="/" className="text-blue-500 hover:text-blue-700 mt-10">Back to Home Page</Link>
    </div>
  );
}

export default UserList;
