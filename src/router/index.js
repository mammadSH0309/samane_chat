import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import NamaPage from "../pages/NamaPage";
import DetailsPage from "../pages/DetailsPage";
import LoginPage from "../pages/LoginPage";


export const router = createBrowserRouter([

    {
        path: '/',
        Component: App,
        children: [
            {
                path: '',
                Component: NamaPage , 
                
            },
            {
                path : 'details', 
                Component : DetailsPage
            },
       


        ], 
        
    },
    {
        path : '/login',
        Component : LoginPage
    }





])