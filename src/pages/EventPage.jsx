import { useEffect, useState, useContext } from "react";
import { Button, Heading, Dialog, Box, HStack, Skeleton } from '@chakra-ui/react';
import { useParams, useNavigate } from "react-router-dom";
import { EventsContext } from "../context/EventsContext";
import { toaster } from "../toaster";

const formatDateTimeLocal= (date) => {
    const parts = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Europe/Amsterdam",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).format(new Date(date));

    return parts.replace(" ", "T");
};

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
                 startTime: new Date(formData.get("startTime")).toISOString(),
                 endTime: new Date(formData.get("endTime")).toISOString(),
                 categoryIds: formData.getAll("categoryIds").map(Number),
            
                
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
        return (
       <Box maxW="700px" mx="auto" mt={8} p={4}>
      <Skeleton height="40px" mb={4} borderRadius="md" />
      <Skeleton height="350px" mb={4} borderRadius="lg" />
      <Skeleton height="80px" borderRadius="md" />
    </Box>
  );
}

        return (
            <Box maxW="600px"
            mx="auto"
            px={4}
                textAlign="center"
                >
             <Heading color="#60A5FA">{event.title}</Heading>

             <p>{event.description}</p>

             <img src={event.image} alt={event.title}
             style={{ width: "100%",
                maxWidth: "600px", 
                maxHeight: "350px",
                objectFit: "contain",
                marginTop: "15px",
                marginBottom: "20px",
                border: "3px solid #3182CE",
                borderRadius:"12px",
                boxSizing:"border-box" }}
                />

             <p>
                <strong style={{ color:"#60A5FA" }}>Starts: </strong>
                {new Date(event.startTime).toLocaleString("pt-BR",
                    { timeZone: "Europe/Amsterdam",
                      dateStyle: "short",
                      timeStyle: "short",  
                    })}
                </p>

             <p>
                <strong style={{ color:"#60A5FA" }}>Ends: </strong>
                {new Date(event.endTime).toLocaleString("pt-BR",
                    { timeZone: "Europe/Amsterdam",
                      dateStyle: "short",
                      timeStyle: "short",  
                    })}
                </p>

             {event.categoryIds.map((categoryId) => {
                const category = categories.find((category) =>
                category.id === categoryId);

                return ( <p key={categoryId}>
                         <strong style={{ color:"#60A5FA" }}>
                Category:{" "}
                 </strong>
                 {category?.name}
                </p>
             );
             })}

             <HStack gap={3}
             justify="center"
             mt={5}
             >
             <Button
             bg="blue.500"
             color="white"
             onClick={() => setIsEditing(true)}>Edit</Button>

             <Button 
             bg="red.500"
             color="white"
             onClick={() => {
                if (window.confirm("Are you sure you want to delete this event?")) {
                    handleDelete();
                }
            }}
            
                    >Delete
            </Button>

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

               <input type="datetime-local"
                      name="startTime"

               defaultValue={formatDateTimeLocal(event.startTime)}
               required/>

                <input type="datetime-local"
                       name="endTime"

               defaultValue={formatDateTimeLocal(event.endTime)}
               required/>

              <Box>
  <p>Categories:</p>

  {categories.map((category) => (
    <label
      key={category.id}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "10px",
        justifyContent:"flex-start",
        width: "fit-content",
        marginBottom:"8px",
      }}
    >
      <input
        type="checkbox"
        name="categoryIds"
        value={category.id}
        defaultChecked={event.categoryIds.includes(category.id)}
      />
      {category.name}
    </label>
  ))}
</Box>

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

            </Box>
       
    );
};