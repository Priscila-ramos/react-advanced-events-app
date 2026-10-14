import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Box } from '@chakra-ui/react';

export const Root = () => {
    return (
        <Box p={{
            base: 4, md: 6, lg: 8 }}
        
        >
            <Navigation />
            <Outlet />
        </Box >
    );
};