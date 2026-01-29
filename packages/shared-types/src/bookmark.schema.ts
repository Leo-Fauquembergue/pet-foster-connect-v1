import { z } from "zod";

// BOOKMARK (Favori)
export const BookmarkSchema = z.object({
  // Clé Primaire Composite (User + Animal)
  pfcUserId: z.number().int().positive(), // L'utilisateur qui like
  animalId: z.number().int().positive(), // L'animal liké

  createdAt: z.date(), // Date d'ajout aux favoris
});

export type Bookmark = z.infer<typeof BookmarkSchema>;

// DTOs (Data Transfer Objects)

// CREATE : Ajouter un favori
// Souvent, l'ID est passé dans l'URL (POST /bookmarks/:id),
// mais si on l'envoie dans le body, ce schéma est utile.
export const CreateBookmarkSchema = z.object({
  animalId: z.number().int().positive(),
});

export type CreateBookmarkDto = z.infer<typeof CreateBookmarkSchema>;
