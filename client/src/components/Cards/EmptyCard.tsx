import React from "react";

function EmptyCard() {
  return (
    <>
      <div className="flex justify-center mt-10">
        <div className="w-1/2 border-b-2 p-4 hover:shadow-lg transition-all ease-in-out">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-medium text-white">
                No notes found
              </h2>
            </div>
          </div>
          <p className="text-sm text-black mt-2">
            There are no notes to display here. Please add notes by clicking the
            button in the bottom right.
          </p>
        </div>
      </div>
    </>
  );
}

export default EmptyCard;
