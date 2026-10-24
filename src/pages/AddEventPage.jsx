import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { EventsContext } from "../context/EventsContext";
import { toaster } from "../toaster";
import { Box, Button, SimpleGrid } from "@chakra-ui/react";

export const AddEventPage = () => {
    const navigate = useNavigate();

    const { categories, setCategories }= useContext(EventsContext);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await fetch("http://localhost:3000/categories");

                if (!response.ok) {
                    throw new Error("Failed to load categories");
                }

                const data= await response.json();

                setCategories(data);
            } catch (error) {

                console.error("Failed to load categories:", error);
                }
            };

            getCategories(); }, [setCategories]);
        
    

    const handleSubmit = async (event) => {

        event.preventDefault();
        try {
            const formData = new FormData(event.target);
        

        const newEvent = Object.fromEntries(formData);
        newEvent.categoryIds = formData.getAll("categoryIds").map(Number);
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
            maxWidth: "1000px",
            width: "100%",
            margin: "0 auto",
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

         <SimpleGrid columns={{ base:1, md: 2 }}
         gap={5}
         w="100%"
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
         
         </SimpleGrid>

            <Box>
             <p>Categories:</p>
             

             {categories.map((category) => (
                <label key={category.id}style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent:"flex-start",
                    gap: "10px",
                }}
                >
                    <input
                    type="checkbox"
                    name="categoryIds"
                    value={category.id}
                    />
                    {category.name}
                </label>
             ))}

            </Box>


            <Button
            type="submit"
            w="200px"
            alignSelf="center"
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