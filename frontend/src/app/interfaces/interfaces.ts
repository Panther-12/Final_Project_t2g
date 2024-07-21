export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    bio?: string;
    phone?: number;
    image?: string;
  }
  

  export interface UserProfile {
    id?: string;
    email: string;
    password: string;
    role?: string;
    resetCode?: string | null;
    accountStatus?: string;
    createdAt?: string;
    updatedAt?: string;
    profile: {
      id?: string;
      firstName: string;
      lastName: string;
      bio: string;
      phone: string;
      image: string;
      userId?: string;
      createdAt?: string;
      updatedAt?: string;
    };
  }
  
  export interface updateProfile {
      firstName: string;
      lastName: string;
      bio: string;
      phone: string;
      image: string;
  }