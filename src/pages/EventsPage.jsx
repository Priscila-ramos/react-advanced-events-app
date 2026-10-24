import { useEffect, useState, useContext } from 'react';
import { Heading, Input, Button, Skeleton, HStack, Box, SimpleGrid } from '@chakra-ui/react';
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
         <Heading textAlign="center"
                  mb={8}
                  fontSize={{ base: "28px", md: "36px", lg: "48px"}}
                  color="blue.400">List of events
                  </Heading>

         {isLoading && (<SimpleGrid columns={{ base: 1, md: 2, xl: 3 }}
                                gap={5}
                                maxW="1400px"
                                mx="auto"
                                mt={4}> {[1, 2, 3, 4, 5, 6].map ((item) => (
                                    <Skeleton key={item}
                                    
                                 height="350px" 
                                 borderRadius= "lg"
                                 />
                                ))}
                                </SimpleGrid>
    )}

         <Input
         id="search-events"
         placeholder="Search events"
         value={searchTerm}
         onChange={(event) => setSearchTerm(event.target.value)}
         borderWidth="2px"
         borderColor="red.500"
         borderRadius="md"
         mb={4}
         maxW="500px"
         w="100%"
         display="block"
         mx="auto"
         _placeholder={{ color: "white"}}
         />

        <HStack gap={6}
        flexWrap="wrap"
        justify="center"
        >

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

         <SimpleGrid columns={{ base: 1, md: 2, xl: 3}} 
                     gap={5}
                     maxW="1400px"
                     mx="auto"
                     justifyItems={{ base: "center", md: "stretch" }}
                     >
        

        {!isLoading && filteredEvents.length === 0 && (
             <Box color="white"
                  fontSize="lg"
                  mt={4}
                >
                    No events found.
                </Box>
                )}


         {!isLoading && filteredEvents.map((event) => (
            <Box key={event.id}
            bg="black.500"
            borderWidth="3px"
            borderColor="blue.500"
            borderRadius="lg"
            p={4}
            mb={5}
            mt={4}
           
             >
                <Link to={`/event/${event.id}`}>
                <Box as="p" fontSize="xl"
                            fontWeight="bold"
                            color="white"
                            mt={-2}
                            mb={2}
                            bg="blue.600"
                            px={4}
                            py={2}
                            borderRadius={"md"}
                            w="fit-content"
                            cursor="pointer"
                            transition="all 0.2s"
                            _hover={{
                                bg: "blue.400",
                                transform: "translateY(-2px)",
                            }}
                            >
                        {event.title}
                        </Box>
                
                </Link>

               

                <p>{event.description}</p>

                <img src={event.image} alt={event.title}
                style={{ width: "100%",
                         maxWidth: "700px",
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

         </SimpleGrid>

        </>
       
    );
};