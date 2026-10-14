import { useNavigate } from "react-router-dom";
import { toaster } from "../toaster";
import { Box, Button } from "@chakra-ui/react";

export const AddEventPage = () => {
    const navigate = useNavigate();

    const handleSubmit = async (event) => {

        event.preventDefault();
        try {
            const formData = new FormData(event.target);
        

        const newEvent = Object.fromEntries(formData);
        newEvent.categoryIds = [];
        const response = await fetch("http://localhost:3000/events", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",},
            body: JSON.stringify(newEvent),
            

        });
        
        if (response.ok) {

            toaster.create({
                title: "Event created successfully",
                type: "success",
            });
        }

        else {

           toaster.create({
            title: "Failed to create event",
            type: "error",
           }); 
           return;
        }


        console.log(response);

        console.log(newEvent);

        navigate("/");

    } catch (error) {
        toaster.create({
        title: "Failed to connect to server",
        type: "error", });
      
    console.error(error);
    }

    };

    return (
        <>
        <Box
        as="h1"
        fontSize="36px"
        fontWeight="bold"
        color="purple.400"
        mb={4}
        >
            New Event
            </Box>

         <Box as="form" onSubmit={handleSubmit}
         css={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxWidth: "100%",
            "& label": {
                display: "flex",
                flexDirection: "column",
                gap: "4px"
            },
            "& input": {
                maxWidth: "100%",
                boxSizing: "border-box",
                backgroundColor: "#000000",
                color: "white",
                border: "2px solid #A855F7",
                borderRadius: "8px",
                padding: "8px",
            }

        }}
         
         >

            <label>Title
                    <input
                    type="text"
                    name="title"
                    required />
            </label>

            <label>Description
                   <input
                   type="text"
                   name="description"
                   required />

            </label>  

            <label>Image
                   <input
                   type="text"
                   name="image"
                   required />     

            </label>

            <label>Location
                   <input
                   type="text"
                   name="location"
                   required />     

            </label>


            <label>Start Time
                   <input
                   type="datetime-local"
                   name="startTime"
                   required/> 
            </label>

             <label>End Time
                   <input
                   type="datetime-local"
                   name="endTime"
                   required/> 
            </label>

            <Button
            type="submit"
            bg="purple.500"
            color="white"
            fontSize="lg"
            fontWeight="bold"
            borderRadius="md"
            px={6}
            py={3}
            mt= "10px"
            _hover={{ bg:"purple.600"}}
            >
                Add Event
            </Button>

         </Box>
        </>
       
    );
};