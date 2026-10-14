import React from 'react';
import ReactDOM from 'react-dom/client';
import { EventPage } from './pages/EventPage';
import { EventsPage } from './pages/EventsPage';
import { AddEventPage } from './pages/AddEventPage';
import { Provider } from './components/ui/provider';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './components/Root';
import {EventsProvider} from "./context/EventsContext"; 
import { AppToaster } from "./toaster";   

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/',
                element: <EventsPage />,
                // loader: postListLoader,
            },

            {
                path: '/add-event',
                element: <AddEventPage />,
            },


            {
                path: '/event/:eventId',
                element: <EventPage />,
                // loader: postLoader,
                // action: addComment,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider>
            
            <EventsProvider>

            <RouterProvider router={router} />
            
            </EventsProvider>

            <AppToaster />
        </Provider>
    </React.StrictMode>,
);