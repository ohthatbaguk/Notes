import styles from "../../../app.module.scss";
import close from "../../../svg/close.svg";
import React from "react";
import { INote } from "../../../service/note";

interface ListOfNotesParams {
  notes: INote[];
  rawSearch: string;
  activeNoteId: string;
  setActiveNoteId: (note: string) => void;
  handleDeleteClick: (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
    noteId: string
  ) => void;
  filteredNotes: INote[];
}

export default function ListOfNotes({
  notes,
  rawSearch,
  activeNoteId,
  setActiveNoteId,
  handleDeleteClick,
  filteredNotes,
}: ListOfNotesParams) {
  return (
    <ul className={styles.ul}>
      {(rawSearch ? filteredNotes : notes)?.map((note) => (
        <li
          key={note.id}
          className={
            activeNoteId === note.id ? styles.activeLi : styles.nonActive
          }
          onClick={() => setActiveNoteId(note.id)}
        >
          <p className={styles.liTitle}>{note.title || "Empty title"}</p>
          <p className={styles.content}>{note.content || "Empty content"}</p>
          <img
            onClick={(event) => handleDeleteClick(event, note.id)}
            className={styles.close}
            src={close}
            alt="close"
            width="30"
          />
        </li>
      ))}
    </ul>
  );
}
