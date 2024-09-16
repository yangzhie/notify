"use client";

import AddEditNotes from "@/components/AddEditNotes/AddEditNotes";
import NoteCard from "@/components/Cards/NoteCard";
import Navbar from "@/components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import moment from "moment";
import Toast from "@/components/Toast/Toast";
import EmptyCard from "@/components/Cards/EmptyCard";

interface OpenModalProps {
  isShown: boolean;
  type: "add" | "edit";
  data: string | null;
}

export default function Home() {
  const [openModal, setOpenModal] = useState<OpenModalProps>({
    isShown: false,
    type: "add",
    data: null,
  });

  const [userInfo, setUserInfo] = useState<string[] | null>(null);
  const [allNotes, setAllNotes] = useState<string[]>([]);

  const [showToast, setShowToast] = useState<{}>({
    isShown: false,
    message: "",
    type: "add",
  });
  const router = useRouter();

  const handleEdit = (noteDetails: any) => {
    setOpenModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const handleCloseToast = () => {
    setShowToast({ isShown: false, message: "" });
  };

  const handleShowToast = (message: string, type: string) => {
    setShowToast({ isShown: true, message, type });
  };

  // get user info API
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");

      if (response.data) {
        setUserInfo(response.data.user);
      }
    } catch (error: any | unknown) {
      if (error.response.status === 401) {
        localStorage.clear();
        router.push("/login");
      }
    }
  };

  // get all notes API
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("Unexpected error, please try again.");
    }
  };

  // delete note API
  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.data && !response.data.error) {
        handleShowToast("Note deleted successfully.", "delete");
        getAllNotes();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.message) {
        console.log("Unexpected error, please try again.");
      }
    }
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);
  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allNotes.map((note, index) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={moment(note.createdOn).format("Do MMM YYYY")}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() => handleEdit(note)}
                onDelete={() => deleteNote(note)}
                onPinNote={() => {}}
              />
            ))}
          </div>
        ) : (
          <EmptyCard />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openModal.type}
          noteData={openModal.data}
          onClose={() =>
            setOpenModal({ isShown: false, type: "add", data: null })
          }
          getAllNotes={getAllNotes}
          handleShowToast={handleShowToast}
        />
      </Modal>

      <Toast
        isShown={showToast.isShown}
        message={showToast.message}
        type={showToast.type}
        onClose={handleCloseToast}
      />
    </>
  );
}
