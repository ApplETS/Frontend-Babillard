import { Tag } from "./tag";
import { User } from "./user";

export interface Event {
  id: string;
  title?: string;
  content?: string;
  imageUrl: string;
  imageAltText: string;
  cardId?: number;
  eventStartDate: string;
 	eventEndDate: string;
  organizer: User | null;
  tags: Tag[];
}