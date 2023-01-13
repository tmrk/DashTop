import React, { useState } from "react";
import FormatClearIcon from '@mui/icons-material/FormatClear';

const emojisToCopy = ["👍", "🙏", "👈", "👉", "👆", "👇", "😁", "😛", "😊"];

export default function Clipboard() {

  const [copyMessage, setCopyMessage] = useState("");

  const handleClick = () => {
    navigator.clipboard
    .readText()
    .then(
      (clipText) => {
        navigator.clipboard.writeText(clipText.trim());
        console.log("Cleared formatting: " + clipText);
        setCopyMessage("Cleared formatting: " + clipText)
        setTimeout(() => {
          setCopyMessage("");
        }, 1000);
      }
    );
  };
  
  const copyToClipboard = (str) => {
    navigator.clipboard.writeText(str);
    console.log("Copied to clipboard: " + str);
    setCopyMessage("Copied to clipboard: " + str);
    setTimeout(() => {
      setCopyMessage("");
    }, 1000);
  }

  return (
    <div id="clipboard">
      <div id="clearformat">
        <div onClick={handleClick}>
          <FormatClearIcon />
          <span>Clear format</span>
        </div>
      </div>
      <div id="emojicopy">
        {emojisToCopy.map((emoji) => (
          <span key={emoji} onClick={() => copyToClipboard(emoji)}>{emoji}</span>
        ))}
      </div>
      <div id="copymessage">{copyMessage}</div>
    </div>
  );
}