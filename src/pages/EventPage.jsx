import { useEffect, useState, useContext } from "react";
import { Button, Heading, Dialog, Box, HStack } from '@chakra-ui/react';
import { useParams, useNavigate } from "react-router-dom";
import { EventsContext } from "../context/EventsContext";
import { toaster } from "../toaster";

export const EventPage = () => {
    const { eventId }= useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const {categories,setCategories} = useContext(EventsContext);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const getEvent= async () => {
            const response = await fetch(`http://localhost:3000/events/${eventId}`);
            const data = await response.json();

            setEvent(data);
        };

        const getCategories = async () => {
            const response = await fetch("http://localhost:3000/categories");
            const data = await response.json();

            setCategories(data);
        };

            getEvent();
            getCategories();


        }, [eventId]);

        const handleSubmit = async (submitEvent) => {
            submitEvent.preventDefault();

            try {


            const formData = new FormData(submitEvent.target);

            const updatedEvent = { ...event,
                 title: formData.get("title"),
                 description: formData.get("description"),
                 image: formData.get("image"),
                 startTime: formData.get("startTime"),
                 endTime: formData.get("endTime"),
                 categoryIds: [Number(formData.get("categoryId"))],
            
                
            };

            const response = await fetch(`http://localhost:3000/events/${eventId}`,
                {method:"PUT",
                 headers: {
                    "Content-Type":"application/json",
                 },
                 body: JSON.stringify(updatedEvent),
                }

            );

            if (response.ok) {
                toaster.create({
                    title: "Event updated successfully",
                    type: "success",
                });
            }

            else {

                toaster.create({
                    title: "Failed to update event",
                    type: "error",
                });
                return;
            }

            
           const data = await response.json();
           setEvent(data);
           setIsEditing(false);

        } catch (error) {
            toaster.create({
                title: "Failed to connect to server",
                type: "error",
            });
          console.error(error);

        }

        };

        const handleDelete = async() => {
            try {
         const response= await fetch(`http://localhost:3000/events/${eventId}`,  
            
            { method: "DELETE",
        });
        
        
        if (!response.ok) {
            toaster.create({
                title: "Failed to delete event",
                type: "error",
            });
          return;

        }

        toaster.create({
            title: "Event deleted successfully!",
            type: "success",
        });


        navigate("/");

    } catch (error) {
        toaster.create({
            title: "Failed to connect to server",
            type: "error",
        });

        console.error(error);
    }

        };

        if (!event) {
            return <p>Loading...</p>
        }

        return (
            <>
             <Heading>{event.title}</Heading>

             <p>{event.description}</p>

             <img src={event.image} alt={event.title}
             style={{
                maxWidth: "100%", height: "auto" }}
                />

             <p>{event.startTime}</p>

             <p>{event.endTime}</p>

             {event.categoryIds.map((categoryId) => {
                const category = categories.find((category) =>
                category.id === categoryId);

                return <p key={categoryId}>{category?.name}</p>;
             })}
             <HStack gap={3}>
             <Button
             bg="blue.500"
             color="white"
             onClick={() => setIsEditing(true)}>Edit</Button>

             <Button 
             bg="red.500"
             color="white"
             onClick={handleDelete}>Delete</Button>

             </HStack>

             <Dialog.Root open={isEditing}

             onOpenChange={(details) => setIsEditing(details.open)}
             >

               <Dialog.Backdrop/>

               <Dialog.Positioner>

                <Dialog.Content
                width="95%"
                maxWidth="500px"
                p={4}
                borderWidth="3px"
                borderStyle="solid"
                borderColor="#3182CE"
                >

             {isEditing && (
                 <Box as="form" onSubmit={handleSubmit}
                 css={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    maxWidth: "100%",
                    "& input, & select": {
                        width: "100%",
                        boxSizing: "border-box",
                        backgroundColor: "#000000",
                        color: "white",
                        border: "2px solid #3182CE",
                        borderRadius:"8px",
                        padding: "8px",
                    },
                    }}
                 >

                <input type="text"
                       name="title"

                defaultValue={event.title}
                required/>

               <input type="text"
                      name="description" 

               defaultValue={event.description}
               required/>

               <input type="text"
                      name="image" 

               defaultValue={event.image}
               required/>

               <input type="text"
                      name="startTime"

               defaultValue={event.startTime}
               required/>

                <input type="text"
                       name="endTime"

               defaultValue={event.endTime}
               required/>

               <select
               name="categoryId"

               defaultValue={event.categoryIds[0]}
               required>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                {category.name}

                </option>
              ))}

               </select>

               <Button 
               type="submit"
               bg="#3182CE"
               color="white"
               fontSize="lg"
               fontWeight="bold"
               borderRadius="md"
               px={6}
               py={3}
               mt={2}
               _hover={{ bg: "#3182CE"}}
               >
                Save
            </Button> 

                </Box>
            )}
            
            </Dialog.Content>
            </Dialog.Positioner>
            </Dialog.Root>

            </>
       
    );
};