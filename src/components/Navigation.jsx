import { Flex, Link } from '@chakra-ui/react';
import { useLocation } from "react-router-dom";

export const Navigation = () => {
    const location = useLocation();

    return (
        <nav>
            <Flex gap={2}>
                <Link href="/"
                bg="green.500"
                color="white"
                px={4}
                py={2}
                borderRadius="md"
                borderWidth="4px"
                borderStyle="solid"
                borderColor={location.pathname === "/" ? "red.500" : "transparent"}
             >Events</Link>

                <Link href="/add-event"
                bg="purple.500"
                color="white"
                px={4}
                py={2}
                borderRadius="md"
                 borderWidth="4px"
                borderStyle="solid"
                borderColor={location.pathname === "/add-event" ? "red.500" : "transparent"}
                >Add Event</Link>
            </Flex>
        </nav>
    );
};