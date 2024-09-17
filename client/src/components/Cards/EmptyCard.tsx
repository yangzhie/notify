import React from "react";

function EmptyCard() {
  return (
    <>
      <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
        <div className="flex items-center justify-between">
          <div>
            <h6 className="text-sm font-medium">No notes</h6>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-2">There are no notes to display here. Please add notes by clicking the button in the bottom right.</p>
      </div>
    </>
  );
}

export default EmptyCard;
