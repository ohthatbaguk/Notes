import styles from "./noteEditor.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { INote } from "../../App";
import { HighlightWithinTextarea } from "react-highlight-within-textarea";
const debounce = require("debounce");
const { v4: uuidv4 } = require("uuid");

interface INoteParams {
  note?: INote;
  saveNote: (note: INote) => void;
  editNote: (note: INote) => void;
  onTagClick: (tag: string) => void;
}

const RegExp = /#[0-9A-Za-zА-Яа-яё]+/g;

export default function NoteEditor({
  saveNote,
  editNote,
  note,
  onTagClick,
}: INoteParams) {
  const [text, setText] = useState<string>(noteToText(note));

  const updateNotes = (text: string, note: INote) => {
    const [title, ...content] = text.split("\n");
    const contentLines = content.join("\n");
    const tags = (contentLines.match(RegExp) ?? []).map((item) =>
      item.slice(1)
    );

    if (note) {
      editNote({ id: note.id, title: title, content: contentLines, tags });
    } else {
      saveNote({ id: uuidv4(), title: title, content: contentLines, tags });
    }
  };

  const deboucedFn = useRef(debounce(updateNotes, 500));

  useEffect(() => {
    setText(noteToText(note));
  }, [note]);

  const handleChange = (value: string) => {
    setText(value);
    deboucedFn.current(value, note);
  };

  return (
    <div className={styles.textareaContainer}>
      <HighlightWithinTextarea
        highlight={RegExp}
        value={text}
        onChange={handleChange}
        placeholder="Notes"
      />
      <ul className={styles.tags}>
        {note?.tags.map((item, index) => (
          <li
            key={index}
            className={styles.tag}
            onClick={() => onTagClick(item)}
          >
            #{item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function noteToText(note?: INote): string {
  if (!note) return "";
  if (!note.title) return note.content;
  return note.title + "\n" + note.content;
}
