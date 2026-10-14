import { createContext, useState } from "react";

export const EventsContext = createContext();
export const EventsProvider = ({ children }) => {
    const [events, setEvents] = useState([]);

    const [categories, setCategories] = useState([]);

return (
    <EventsContext.Provider
        value={{ events, setEvents, categories, setCategories }}>
        {children}
        
    </EventsContext.Provider>
);
};