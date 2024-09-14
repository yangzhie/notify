"use client";

import React, { useState } from "react";
import TagInput from "../Input/TagInput";
import { MdClose, MdEditNote } from "react-icons/md";

interface AddEditNotesProps {
  noteData: string | null;
  type: string;
  onClose: () => void;
}

function AddEditNotes({ noteData, type, onClose }: AddEditNotesProps) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);

  const addNewNote = async () => {};

  const editNote = async () => {};

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter a title.");
      return;
    }

    if (!content) {
      setError("Please enter content.");
      return;
    }

    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };
  return (
    <>
      <div className="relative">
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
          onClick={onClose}
        >
          <MdClose className="text-xl text-slate-400" />
        </button>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-slate-400">TITLE</label>
          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="Go gym at 5"
            value={title}
            // destructure e.target.value for cleaner code
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="text-xs text-slate-400">CONTENT</label>
          <textarea
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="Content"
            rows={10}
            value={content}
            // destructure e.target.value for cleaner code
            onChange={({ target }) => setContent(target.value)}
          />
        </div>

        <div className="mt-3">
          <label className="text-xs text-slate-400">TAGS</label>
          <TagInput tags={tags} setTags={setTags} />
        </div>

        {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

        <button
          className="w-full text-sm bg-primary text-white p-3 rounded my-1 hover:bg-blue-600 font-medium mt-5"
          onClick={handleAddNote}
        >
          ADD
        </button>
      </div>
    </>
  );
}

export default AddEditNotes;
