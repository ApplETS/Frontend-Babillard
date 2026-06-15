import { Tag } from "./tag";

export interface Event {
  id: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  imageAlt?: string;
  cardId?: number;
  tags: Tag[];
}