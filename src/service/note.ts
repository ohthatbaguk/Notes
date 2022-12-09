import { v4 as uuidv4 } from "uuid";

export interface INote {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export function createEmptyNote(): INote {
  return { id: uuidv4(), title: "", content: "", tags: [] };
}
