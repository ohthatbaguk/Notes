import styles from "../../app.module.scss";
import { Textarea } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { INote } from "../../App";
const debounce = require("debounce");
const { v4: uuidv4 } = require("uuid");

interface INoteParams {
  note?: INote;
  saveNote: (note: INote) => void;
  editNote: (note: INote) => void;
}

export default function NoteEditor({ saveNote, editNote, note }: INoteParams) {
  const [text, setText] = useState<string>(noteToText(note));

  const updateNotes = (text: string, note: INote) => {
    const [title, ...content] = text.split("\n");
    const contentLines = content.join("\n");
    if (note) {
      editNote({ id: note.id, title: title, content: contentLines });
    } else {
      saveNote({ id: uuidv4(), title: title, content: contentLines });
    }
  };

  const deboucedFn = useRef(debounce(updateNotes, 500));

  useEffect(() => {
    setText(noteToText(note));
  }, [note]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    deboucedFn.current(event.target.value, note);
  };

  return (
    <div className={styles.textareaContainer}>
      <Textarea
        className={styles.textarea}
        value={text}
        onChange={handleChange}
        placeholder="Start typing..."
      />
    </div>
  );
}

function noteToText(note?: INote): string {
  if (!note) return "";
  return note.title + "\n" + note.content;
}
