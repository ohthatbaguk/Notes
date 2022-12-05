import React, { useEffect, useState } from "react";
import styles from "./app.module.scss";
import { Button } from "@chakra-ui/react";
import NoteEditor from "./components/Note/NoteEditor";
import plus from "../src/svg/plus.svg";
import pencil from "../src/svg/pencil.svg";
import close from "../src/svg/close.svg";
import ModalWindow from "./components/Modal/ModalWindow";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "./service/localStorage";
const { v4: uuidv4 } = require("uuid");

export interface INote {
  id: string;
  title: string;
  content: string;
}

function App() {
  const [activeNoteId, setActiveNoteId] = useState<string>("");
  const [notes, setNotes] = useState<INote[]>(getFromLocalStorage("todos"));
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    saveToLocalStorage("todos", notes);
  }, [notes]);

  const activeNote = notes.find((note) => note.id === activeNoteId);

  const handleClick = (id: string): void => {
    setActiveNoteId(id);
  };

  const saveNote = (note: INote): void => {
    setNotes([...notes, note]);
  };

  const editNote = (note: INote): void => {
    setNotes((prevNotes) => {
      const newNotes = [...prevNotes];
      newNotes.splice(
        newNotes.findIndex((item) => item.id === note.id),
        1,
        note
      );
      return newNotes;
    });
  };

  const deleteNote = (activeNote?: INote): void => {
    console.log(activeNote);
    if (!activeNote) return;
    setNotes((prevNotes) => {
      const newNotes = [...prevNotes];
      return newNotes.filter((item) => item.id !== activeNote.id);
    });
    setIsOpen(false);
  };

  const handleButtonClick = (): void => {
    const note: INote = { id: uuidv4(), title: "", content: "" };
    saveNote(note);
    setActiveNoteId(note.id);
  };

  return (
    <div className={styles.app}>
      <section className={styles.leftSection}>
        <aside className={styles.aside}>
          <img src={pencil} alt="pencil" width="60" />
          <h3 className={styles.title}>Notes</h3>
          <section className={styles.ulContainer}>
            <ul className={styles.ul}>
              {notes?.map((note) => (
                <li
                  className={
                    activeNoteId === note.id
                      ? styles.activeLi
                      : styles.nonActive
                  }
                  key={note.id}
                >
                  <p onClick={() => handleClick(note.id)}>
                    {note.title || "New note"}
                  </p>
                  <p className={styles.content}>
                    {note.content || "No content"}
                  </p>
                  <img
                    onClick={() => setIsOpen(true)}
                    className={styles.close}
                    src={close}
                    alt="close"
                    width="30"
                  />
                </li>
              ))}
            </ul>
            <Button
              colorScheme="pink"
              className={styles.button}
              onClick={handleButtonClick}
            >
              <img src={plus} width="40" alt="plus-button" />
            </Button>
          </section>
        </aside>
      </section>
      <NoteEditor note={activeNote} saveNote={saveNote} editNote={editNote} />
      <ModalWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        deleteNote={() => deleteNote(activeNote)}
      />
    </div>
  );
}

export default App;
