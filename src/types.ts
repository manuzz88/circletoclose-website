// Definizione dei tipi per l'applicazione

export type User = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  password?: string;
  isAdmin?: boolean;
  dateOfBirth?: Date | null;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | null;
  bio?: string | null;
  phoneNumber?: string | null;
  isVerified: boolean;
  emailVerified?: boolean;
  lastLogin?: Date | null;
  documentUrl?: string | null;       // URL del documento d'identità caricato
  documentType?: string | null;      // Tipo di documento
  verificationNotes?: string | null; // Note sulla verifica
  createdAt: Date;
  updatedAt: Date;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  maxParticipants?: number;
  price: number;
  womenPrice?: number | null;
  image?: string | null;
  location?: string;
  venue?: string;
  featured?: boolean;
  luxuryLevel?: number;
  categoryId?: string;
  category?: { name: string };
  locationId?: string;
  locationObj?: Location;
  participants?: number;
  participantsList?: Participant[];
  createdAt?: Date;
  updatedAt?: Date;
  amenities?: string[];
  dress_code?: string;
  minimumAge?: number;
  gallery?: string[];
};

export type Participant = {
  id: string;
  userId?: string;
  eventId?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  name?: string;
  email?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Location = {
  id: string;
  name: string;
  description: string;
  city?: string | null;
  zone?: string | null;
  address?: string | null;
  capacity?: number | null;
  price?: string | null;
  features?: string[];
  images?: Image[];
  events?: Event[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type Image = {
  id: string;
  url: string;
  cloudinaryUrl?: string | null;
  locationId?: string;
  eventId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  events?: Event[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type Review = {
  id: string;
  userId: string;
  eventId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  event?: Event;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'EVENT_INVITATION' | 'EVENT_APPROVED' | 'EVENT_REJECTED' | 'SYSTEM';
  link?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
};
