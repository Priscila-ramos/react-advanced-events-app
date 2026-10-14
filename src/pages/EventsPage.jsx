import { useEffect, useState, useContext } from 'react';
import { Heading, Input, Button, Skeleton, HStack, Box } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import { EventsContext } from "../context/EventsContext";

export const EventsPage = () => {
    const { events, setEvents, categories, setCategories } =
    useContext(EventsContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getEvents = async () => {
            try {
                const response = await fetch("http://localhost:3000/events");

            if (!response.ok)
            {
                throw new Error("Failed to load events");
            }

            const data = await response.json();
            setEvents(data); }
            catch (error) {
                console.error("Failed to load events:", error);
            } finally {setIsLoading(false);
            }
        };

        const getCategories = async () => {
            const response = await fetch("http://localhost:3000/categories");
            const data = await response.json();
            setCategories(data);

        };

        getEvents();
        getCategories();

    }, []);

    const filteredEvents = events.filter((event) => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || event.categoryIds.some((id) =>
        selectedCategories.includes(id));

        return matchesSearch && matchesCategory;
    });

    const toggleCategory = (categoryId) => {
    const isSelected = selectedCategories.includes(categoryId);

    if (isSelected) { setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
    );
    }
    else {
        setSelectedCategories([...selectedCategories, categoryId]);
    }
    };

    return (
        <>
         <Heading>List of events</Heading>
         {isLoading && <Skeleton height="100px" />}

         <Input
         id="search-events"
         placeholder="Search events"
         value={searchTerm}
         onChange={(event) => setSearchTerm(event.target.value)}
         borderWidth="2px"
         borderColor="yellow.500"
         borderRadius="md"
         mb={4}
         _placeholder={{ color: "white"}}
         />

        <HStack gap={3}
        flexWrap="wrap">

         {categories.map((category) => (
            <Button 
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            aria-pressed={selectedCategories.includes(category.id)}
            borderWidth= "5px"
            borderStyle="solid"
            borderColor={ selectedCategories.includes(category.id)? "red.500": "transparent"
            }>

         {category.name}       

            </Button>
         ))}
         </HStack>

         {!isLoading && filteredEvents.map((event) => (
            <Box key={event.id}
            bg="black.500"
            borderWidth="3px"
            borderColor="blue.500"
            borderRadius="lg"
            p={4}
            mb={5}
            mt={4}
            maxWidth="550px"
             >
                <Link to={`/event/${event.id}`}>
                <Box as="p" fontSize="xl"
                            fontWeight="bold"
                            color="blue.400"
                            mt={-2}
                            mb={2}
                            >
                        {event.title}
                        </Box>
                
                </Link>

               

                <p>{event.description}</p>

                <img src={event.image} alt={event.title}
                style={{ width: "100%",
                         maxWidth: "500px",
                         aspectRatio: "4 / 3",
                         objectFit: "cover",
                         border: "3px solid #3182CE",
                         borderRadius: "12px",
                         boxSizing: "border-box",
                         marginTop: "12px",
                         marginBottom: "12px",}}
                />

                <p>
                     <span style={{ color:"#60A5FA",
                                   fontWeight:"bold" }}>
                    Starts:
                    </span>{" "}
                     {new Date(event.startTime).toLocaleString("pt-BR", {
                        timeZone: "Europe/Amsterdam",
                        dateStyle: "short",
                        timeStyle: "short",
                    })}
                        </p>

                <p>
                    <span style={{ color:"#60A5FA",
                                   fontWeight:"bold" }}>
                    Ends:
                    </span>{" "}
                    {new Date(event.endTime).toLocaleString("pt-BR", {
                        timeZone: "Europe/Amsterdam",
                        dateStyle: "short",
                        timeStyle: "short",
                    })}
                        </p>

                {event.categoryIds.map((categoryId) => {
                    const category= categories.find((category) => category.id === categoryId);
                    return ( 
                    <p key={categoryId}>
                    <span style={{ color:"#60A5FA",
                                   fontWeight:"bold" }}>
                                   Category: </span>{" "}
                            {category?.name}
                            
                            </p>
                
                   );
                })}

            <p>
                 <span style={{ color:"#60A5FA",
                                   fontWeight:"bold" }}>
                                   Location: </span>{" "}
                            {event.location}
                            
                            </p>
                
            
            </Box>
         ))}
        </>
       
    );
};