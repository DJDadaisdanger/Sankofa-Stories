export type SavedItem = {
  id: string;
  type: 'story' | 'poem';
  theme: string;
  content: string;
  imageUrl?: string; // Add imageUrl for the generated image
  createdAt: string;
};
