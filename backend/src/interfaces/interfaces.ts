export interface UserProfileInput {
    firstName: string;
    lastName: string;
    bio?: string;
    phone?: string;
    image?: string;
  }
  
  export interface VenueInput {
    name: string;
    address: string;
    capacity: number;
  }

  interface TicketRegistrationInput {
    eventId: string;
    userId: string;
    status: string;
    ticketIds: string[];
  }

export interface user {
    id: string;
    email: string;
    password: string;
    role: string;
    resetCode: string | null;
    createdAt: Date;
    updatedAt: Date;
}