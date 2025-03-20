// Definizione dei tipi per l'applicazione CircleToClose

export type User = {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  subcategories?: Subcategory[];
};

export type Subcategory = {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  location?: string;
  venue?: string;
  image?: string | null;
  price: number;
  priceFemale?: number | null;
  maxParticipants?: number;
  minimumAge?: number;
  featured?: boolean;
  luxuryLevel?: number;
  hostId?: string;
  categoryId?: string;
  subcategoryId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  host?: User;
  category?: Category;
  subcategory?: Subcategory;
};

export type EventParticipant = {
  id: string;
  userId: string;
  eventId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLIST';
  createdAt?: Date;
  user?: User;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
};

export type Review = {
  id: string;
  content: string;
  rating: number;
  eventId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
};

// Aggiornato per corrispondere al modello Prisma e includere tutte le proprietà
export type Location = {
  id: string;
  name: string;
  url?: string;  // URL originale della location
  description?: string;
  city?: string;
  zone?: string;  // Zona di Milano
  address?: string;
  location?: string; // Posizione geografica o indirizzo completo
  capacity?: number;
  price?: string;
  features?: string[];
  imageUrl?: string; // Immagine principale
  images?: string[]; // Tutte le immagini disponibili
  createdAt?: Date;
  updatedAt?: Date;
};

export type MembershipTier = {
  id: string;
  name: string;
  description: string;
  price: number;
  benefits: string[];
  featuredColor?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  image?: string;
};
