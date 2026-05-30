export interface Property {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number | null;
  location: string | null;
  ply_url: string | null;
  thumbnail_url: string | null;
  tags: string[];
  likes: number;
  views: number;
  created_at: string;
}
