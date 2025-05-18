import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropDown from "../../components/Inputs/SelectDropDown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import Modal from "../../components/modal";
import DeleteAlert from "../../components/DeleteAlert";

// Import React Leaflet components for map
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon issue with Leaflet in React
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

import { useMap } from "react-leaflet";

const LocationSelector = ({ location, setLocation }) => {
  const map = useMapEvents({
    click(e) {
      setLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        address: "",
      });
    },
  });

  useEffect(() => {
    const fetchAddress = async () => {
      if (location.lat && location.lng && !location.address) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
          );
          const data = await response.json();
          if (data && data.display_name) {
            setLocation((prev) => ({
              ...prev,
              address: data.display_name,
            }));
          }
        } catch (error) {
          console.error("Error reverse geocoding:", error);
        }
      }
    };
    fetchAddress();
  }, [location.lat, location.lng, location.address, setLocation]);

  useEffect(() => {
    if (location.lat && location.lng) {
      map.setView([location.lat, location.lng], map.getZoom(), {
        animate: true,
      });
    }
  }, [location.lat, location.lng, map]);

  return location.lat && location.lng ? (
    <Marker position={[location.lat, location.lng]}></Marker>
  ) : null;
};

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
    location: {
      lat: null,
      lng: null,
      address: "",
    },
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [openConfirmAssignModal, setOpenConfirmAssignModal] = useState(false);
  const [pendingAssignUsers, setPendingAssignUsers] = useState([]);
  const [proceedCreate, setProceedCreate] = useState(false);
  const [openSquareNotification, setOpenSquareNotification] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const updateLocation = (newLocation) => {
    setTaskData((prevData) => ({
      ...prevData,
      location: {
        ...prevData.location,
        ...newLocation,
      },
    }));
  };

  const handleLocationChange = async (key, value) => {
    if (key === "address") {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            value
          )}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          const address = data[0].display_name || `${lat}, ${lng}`;

          setTaskData((prev) => ({
            ...prev,
            location: { lat, lng, address },
          }));
          return;
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    }

    setTaskData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [key]: value,
      },
    }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
      location: {
        lat: null,
        lng: null,
        address: "",
      },
    });
  };

  const createTask = async () => {
    setLoading(true);

    try {
      const todoList = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATH.TASK.CREATE_TASK, {
        ...taskData,
        todoChecklist: todoList,
        dueDate: new Date(taskData.dueDate).toISOString(),
        location: {
          lat: taskData.location.lat,
          lng: taskData.location.lng,
          address: taskData.location.address,
        },
      });

      toast.success("Task Created Successfully");

      clearData();
      setProceedCreate(false);
      setPendingAssignUsers([]);
      setOpenSquareNotification(false);
    } catch (error) {
      console.error("Error creating task:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create task");
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);

    try {
      const todoList = taskData.todoChecklist?.map((item) => {
        const prevTodoCheckList = currentTask?.todoChecklist || [];
        const matchedTask = prevTodoCheckList.find(
          (task) => task.text === item
        );

        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      const assignedUserIds = taskData.assignedTo
        ?.map((user) => {
          if (typeof user === "string") return user;
          if (user && user._id) return user._id;
          return null;
        })
        .filter((id) => id !== null);

      const response = await axiosInstance.put(
        API_PATH.TASK.UPDATE_TASK(taskId),
        {
          ...taskData,
          dueDate: new Date(taskData.dueDate).toISOString(),
          todoChecklist: todoList,
          assignedTo: assignedUserIds,
          location: {
            lat: taskData.location.lat,
            lng: taskData.location.lng,
            address: taskData.location.address,
          },
        }
      );

      toast.success("Task Updated Successfully");
      setOpenSquareNotification(false);
    } catch (error) {
      console.error("Error updating task:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update task");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateTodoChecklist = async (newTodoList) => {
    if (!taskId) return;
    try {
      const todoList = newTodoList.map((item) => {
        const matchedTask = currentTask?.todoChecklist?.find(
          (task) => task.text === item
        );
        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      await axiosInstance.put(API_PATH.TASK.UPDATE_TODO_CHECKLIST(taskId), {
        todoChecklist: todoList,
      });

      setTaskData((prev) => ({ ...prev, todoChecklist: newTodoList }));
      setCurrentTask((prev) => ({ ...prev, todoChecklist: todoList }));
    } catch (error) {
      console.error("Error updating todo checklist:", error);
      toast.error("Failed to update todo checklist");
    }
  };

  const handleSubmit = async () => {
    setError(null);

    if (!taskData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!taskData.dueDate) {
      setError("Due date is required.");
      return;
    }
    if (taskData.assignedTo?.length === 0) {
      setError("Task not assigned to any member.");
      return;
    }
    if (taskData.todoChecklist?.length === 0) {
      setError("Add at least one todo task.");
      return;
    }
    if (!taskData.location.address.trim()) {
      setError("Location address is required.");
      return;
    }
    if (!taskData.location.lat || !taskData.location.lng) {
      setError("Please select a location on the map.");
      return;
    }

    if (
      !proceedCreate &&
      taskData.priority === "High" &&
      taskData.assignedTo.length > 0
    ) {
      try {
        const response = await axiosInstance.post(
          API_PATH.TASK_ASSIGNMENT.CHECK_HIGH_PRIORITY_TASKS,
          {
            userIds: taskData.assignedTo.map((user) =>
              typeof user === "string" ? user : user._id
            ),
          }
        );
        const usersWithHighPriorityTasks = response.data.users || [];

        if (usersWithHighPriorityTasks.length > 0) {
          setPendingAssignUsers(usersWithHighPriorityTasks);
          setOpenSquareNotification(true);
          return;
        }
      } catch (error) {
        console.error("Error checking high priority tasks", error);
        toast.error("Failed to check assigned users' task load");
        return;
      }
    }

    if (taskId) {
      updateTask();
    } else {
      createTask();
    }
  };

  const confirmAssign = () => {
    setOpenSquareNotification(false);
    setOpenConfirmAssignModal(true);
  };

  const cancelSquareNotification = () => {
    setOpenSquareNotification(false);
    setPendingAssignUsers([]);
  };

  const confirmAssignModal = () => {
    setOpenConfirmAssignModal(false);
    setProceedCreate(true);
    handleSubmit();
  };

  const cancelAssignModal = () => {
    setOpenConfirmAssignModal(false);
    setPendingAssignUsers([]);
    setProceedCreate(false);
  };

  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATH.TASK.DELETE_TASK(taskId));

      setOpenDeleteAlert(false);
      toast.success("Task deleted successfully");
      navigate("/admin/tasks");
    } catch (error) {
      console.error(
        "Error deleting task",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to delete task");
    }
  };

  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATH.TASK.GET_TASK_BY_ID(taskId)
      );

      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);

        setTaskData({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist:
            taskInfo?.todoChecklist?.map((item) => item?.text) || [],
          attachments: taskInfo?.attachments || [],
          location: taskInfo?.location || { lat: null, lng: null, address: "" },
        });
      }
    } catch (error) {
      console.error("Error fetching task details", error);
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsByID();
    }
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Tasks">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Hapus
                </button>
              )}
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>
              <input
                placeholder="Enter Task Title"
                className="form-input text-sm text-gray-700"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                placeholder="Enter Task Description"
                className="form-input text-sm text-gray-700"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              ></textarea>
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>
                <SelectDropDown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>
                <input
                  className="form-input"
                  type="date"
                  value={taskData.dueDate}
                  onChange={({ target }) =>
                    handleValueChange("dueDate", target.value)
                  }
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                  Assign To
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) =>
                    handleValueChange("assignedTo", value)
                  }
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                TODO Checklist
              </label>
              <TodoListInput
                todoList={taskData.todoChecklist}
                className="text-sm text-gray-700"
                setTodoList={(value) => {
                  handleValueChange("todoChecklist", value);
                  updateTodoChecklist(value);
                }}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachment
              </label>
              <AddAttachmentsInput
                attachments={taskData.attachments}
                className="text-sm text-gray-700"
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Location Address
              </label>
              <div className="flex gap-2">
                <input
                  className="form-input flex-grow"
                  placeholder="Enter location address"
                  value={taskData.location.address || ""}
                  onChange={({ target }) =>
                    setTaskData((prev) => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        address: target.value,
                      },
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleLocationChange(
                        "address",
                        taskData.location.address
                      );
                    }
                  }}
                />
                <button
                  className="card-btn text-nowrap !px-3 !py-1 text-sm"
                  onClick={() =>
                    handleLocationChange("address", taskData.location.address)
                  }
                >
                  Search
                </button>
              </div>
            </div>

            {/* Added MapContainer and LocationSelector here */}
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Select Location on Map
              </label>
              <div
                style={{
                  height: "300px",
                  width: "100%",
                  zIndex: 0,
                  position: "relative",
                }}
              >
                <MapContainer
                  center={[
                    taskData.location.lat || -6.2,
                    taskData.location.lng || 106.816666,
                  ]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationSelector
                    location={taskData.location}
                    setLocation={handleLocationChange}
                  />
                </MapContainer>
              </div>
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7 z-50 relative">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={() => deleteTask()}
        />
      </Modal>

      <Modal
        isOpen={openSquareNotification}
        onClose={() => setOpenSquareNotification(false)}
        title="Warning"
      >
        <div>
          <p className="mb-4">
            The following users already have 2 or more high priority tasks
            assigned:
          </p>
          <ul className="list-disc list-inside mb-4">
            {pendingAssignUsers.map((user) => (
              <li key={user._id}>{user.name}</li>
            ))}
          </ul>
          <p>Are you sure you want to assign this task to these users?</p>
          <div className="flex justify-end gap-3 mt-5">
            <button
              className="btn btn-secondary px-4 py-1 rounded bg-gray-300"
              onClick={() => cancelSquareNotification()}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary px-4 py-1 rounded bg-blue-600 text-white"
              onClick={() => confirmAssign()}
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={openConfirmAssignModal}
        onClose={() => cancelAssignModal()}
        title="Confirm Task Assignment"
      >
        <div>
          <p className="mb-4">
            The following users already have 2 or more high priority tasks
            assigned:
          </p>
          <ul className="list-disc list-inside mb-4">
            {pendingAssignUsers.map((user) => (
              <li key={user._id}>{user.name}</li>
            ))}
          </ul>
          <p>Are you sure you want to create a task assigned to these users?</p>
          <div className="flex justify-end gap-3 mt-5">
            <button
              className="btn btn-secondary px-4 py-1 rounded bg-gray-300"
              onClick={() => cancelAssignModal()}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary px-4 py-1 rounded bg-blue-600 text-white"
              onClick={() => confirmAssignModal()}
            >
              Yes, Create Task
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
