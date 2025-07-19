import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for supported locations
export type Location = 'Mumbai' | 'Delhi' | 'Kochi';

export interface Movie {
  movie_id: string;
  title: string;
  poster_url: string;
  release_date: string;
}

export interface Theater {
  theater_id: string;
  name: string;
  location: string;
}

interface LocationContextType {
  location: Location;
  setLocation: (loc: Location) => void;
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie | null) => void;
  selectedTheaters: string[];
  setSelectedTheaters: (ids: string[]) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<Location>('Mumbai');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTheaters, setSelectedTheaters] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  return (
    <LocationContext.Provider value={{ location, setLocation, selectedMovie, setSelectedMovie, selectedTheaters, setSelectedTheaters, selectedDate, setSelectedDate }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within a LocationProvider');
  return ctx;
}; 