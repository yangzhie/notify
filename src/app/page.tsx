"use client";

import AddEditNotes from "@/components/AddEditNotes/AddEditNotes";
import NoteCard from "@/components/Cards/NoteCard";
import Navbar from "@/components/Navbar/Navbar";
import { useState } from "react";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";

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
  return (
    <>
      <Navbar />

      <div className="containter mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          <NoteCard
            title="Meeting on Zoom on Tuesday"
            date="3rd of April 2024"
            content="Click this Zoom link"
            tags="#meeting"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
        </div>
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
        />
      </Modal>
    </>
  );
}