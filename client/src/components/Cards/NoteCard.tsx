"use client";

import React from "react";
import { MdCreate, MdDelete, MdOutlinePushPin } from "react-icons/md";

interface NoteCardProps {
  title: string;
  date: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onPinNote: () => void;
}

function NoteCard({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}: NoteCardProps) {
  return (
    <>
      <div className="border rounded p-4 bg-gray-200 hover:shadow-xl transition-all ease-in-out shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h6 className="text-sm font-medium">{title}</h6>
            <span className="text-xs text-slate-500">{date}</span>
          </div>

          <MdOutlinePushPin
            className={`text-xl text-black cursor-pointer hover:text-primary
                ${isPinned ? "fill-red-500" : "text-black"}`}
            onClick={onPinNote}
          />
        </div>
        <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 60)}</p>

        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-slate-500">
            {tags.map((tag, index) => `#${tag} `)}
          </div>

          <div className="flex items-center gap-2">
            <MdCreate
              className="text-xl text-black cursor-pointer hover:text-green-600"
              onClick={onEdit}
            />

            <MdDelete
              className="text-xl text-black cursor-pointer hover:text-red-500"
              onClick={onDelete}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default NoteCard;
