// chat/EmojiPickerBox.jsx

import React from "react";

import EmojiPicker from "emoji-picker-react";

const EmojiPickerBox = ({ onEmojiClick }) => {
  return (
    <div className="absolute bottom-[80px] left-4 z-50 shadow-2xl">
      <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
    </div>
  );
};

export default EmojiPickerBox;
