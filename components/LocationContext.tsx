import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for supported locations
export type Location = 'Mumbai' | 'Delhi' | 'Kochi';

export interface Movie {
  movie_id: string;
  title: string;
  poster_url: string;
  release_date: string;
}

interface LocationContextType {
  location: Location;
  setLocation: (loc: Location) => void;
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<Location>('Mumbai');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  return (
    <LocationContext.Provider value={{ location, setLocation, selectedMovie, setSelectedMovie }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within a LocationProvider');
  return ctx;
}; 