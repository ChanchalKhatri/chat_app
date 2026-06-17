import { useEffect, useState } from "react";

import { mockMedia, mockDocs, mockLinks } from "../constants/galleryMockData";

export const useGalleryData = (messages = []) => {
  const [mediaList, setMediaList] = useState([]);

  const [docList, setDocList] = useState([]);

  const [linkList, setLinkList] = useState([]);

  useEffect(() => {
    const realMedia = [];
    const realDocs = [];
    const realLinks = [];

    messages.forEach((msg) => {
      if (msg.type === "image" || msg.type === "video" || msg.fileType === "image" || msg.fileType === "video") {
        realMedia.push({
          id: msg._id || msg.id,
          url: msg.file || msg.text,
          type: msg.type || msg.fileType || "image",
          time: new Date(msg.createdAt || Date.now()).toLocaleDateString(),
        });
      }
      else if (msg.type === "document" || msg.type === "file" || msg.fileType === "document") {
        const fileUrl = msg.file || "";
        const fileName = msg.text || fileUrl.substring(fileUrl.lastIndexOf("/") + 1) || "Document.pdf";
        realDocs.push({
          id: msg._id || msg.id,
          name: fileName,
          url: fileUrl,
          size: "1.2 MB",
          time: new Date(msg.createdAt || Date.now()).toLocaleDateString(),
        });
      }
      if (msg.text && (msg.text.includes("http://") || msg.text.includes("https://") || msg.text.includes("www."))) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matches = msg.text.match(urlRegex);
        if (matches) {
          matches.forEach((url) => {
            realLinks.push({
              id: `${msg._id || msg.id}-${url}`,
              url: url,
              title: url.replace("https://", "").replace("http://", "").split("/")[0],
              time: new Date(msg.createdAt || Date.now()).toLocaleDateString(),
            });
          });
        }
      }
    });

    setMediaList([...realMedia, ...mockMedia]);
    setDocList([...realDocs, ...mockDocs]);
    setLinkList([...realLinks, ...mockLinks]);
  }, [messages]);

  return {
    mediaList,
    docList,
    linkList,
  };
};
