import React, { useEffect, useRef, useState } from "react";
import styles from "./app.module.scss";
import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import NoteEditor from "./components/Note/NoteEditor";
import plus from "../src/svg/plus.svg";
import pencil from "../src/svg/pencil.svg";
import close from "../src/svg/close.svg";
import ModalWindow from "./components/Modal/ModalWindow";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "./service/localStorage";
import { createEmptyNote, INote } from "./service/note";
const { v4: uuidv4 } = require("uuid");
const debounce = require("debounce");

function getInitialNotes(): INote[] {
  const notes = getFromLocalStorage("notes");
  if (notes.length) return notes;
  return [createEmptyNote()];
}

function App() {
  const [notes, setNotes] = useState<INote[]>(getInitialNotes);
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id);
  const [noteIdToDelete, setNoteIdToDelete] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [rawSearch, setRawSearch] = useState<string>("");
  const ref = React.useRef<HTMLInputElement>(null);

  const activeNote = notes.find((note) => note.id === activeNoteId);
  const filteredNotes = notes?.filter((item) =>
    item.tags?.some((tag) => tag.includes(search))
  );

  useEffect(() => {
    saveToLocalStorage("notes", notes);
  }, [notes]);

  const saveNote = (note: INote): void => {
    setNotes([...notes, note]);
    setActiveNoteId(note.id);
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

  useEffect(() => {
    if (!activeNote) {
      setActiveNoteId(notes[0]?.id);
    }
  }, [activeNote, notes]);

  const deleteNote = (noteId: string | null): void => {
    if (!noteId) return;
    setNotes((prevNotes) => {
      const newNotes = [...prevNotes].filter((item) => item.id !== noteId);
      return newNotes.length ? newNotes : [createEmptyNote()];
    });
    setNoteIdToDelete(null);
  };

  const handleDeleteClick = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
    noteId: string
  ) => {
    event.stopPropagation();
    const note = notes.find((note) => note.id === noteId);
    if (note && !note.title && !note.content) {
      deleteNote(noteId);
      return;
    }
    setNoteIdToDelete(noteId);
  };

  const createNewNote = (): void => {
    const note: INote = { id: uuidv4(), title: "", content: "", tags: [] };
    saveNote(note);
    setActiveNoteId(note.id);
  };

  const debouncedSetSearch = useRef(debounce(setSearch, 300)).current;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRawSearch(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  const forceSetSearch = (value: string = "") => {
    debouncedSetSearch.clear();
    setRawSearch(value);
    setSearch(value);
  };

  const setTagToSearch = (tag: string) => forceSetSearch(tag);
  const clearSearch = () => forceSetSearch();

  return (
    <div className={styles.app}>
      <section className={styles.leftSection}>
        <aside className={styles.aside}>
          <img src={pencil} alt="pencil" width="60" />
          <h3 className={styles.title}>Notes</h3>
          <section className={styles.ulContainer}>
            <InputGroup size="md">
              <Input
                ref={ref}
                onChange={handleSearchChange}
                value={rawSearch}
                className={styles.search}
                ml="27px"
                pr="4.5rem"
                placeholder="Search"
                width={60}
              />
              <InputRightElement width="9rem">
                <Button
                  onClick={clearSearch}
                  colorScheme="pink"
                  h="1.75rem"
                  size="sm"
                >
                  Delete
                </Button>
              </InputRightElement>
            </InputGroup>
            <ul className={styles.ul}>
              {(rawSearch ? filteredNotes : notes)?.map((note) => (
                <li
                  key={note.id}
                  className={
                    activeNoteId === note.id
                      ? styles.activeLi
                      : styles.nonActive
                  }
                  onClick={() => setActiveNoteId(note.id)}
                >
                  <p className={styles.liTitle}>
                    {note.title || "Empty title"}
                  </p>
                  <p className={styles.content}>
                    {note.content || "Empty content"}
                  </p>
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
            <Button
              colorScheme="pink"
              className={styles.button}
              onClick={createNewNote}
            >
              <img src={plus} width="40" alt="plus-button" />
            </Button>
          </section>
        </aside>
      </section>
      <NoteEditor
        key={activeNote?.id}
        note={activeNote}
        saveNote={saveNote}
        editNote={editNote}
        onTagClick={setTagToSearch}
      />
      <ModalWindow
        isOpen={!!noteIdToDelete}
        onClose={() => setNoteIdToDelete(null)}
        onConfirm={() => deleteNote(noteIdToDelete)}
      />
    </div>
  );
}

export default App;
