import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import "./App.css";
import MainLayout from "./components/layouts/MainLayout";
import CreateEvent from "./pages/dashboard/CreateEvent";
import DashBoard from "./pages/dashboard/Dashboard";
import EditEvent from "./pages/dashboard/EditEvent";
import Events from "./pages/dashboard/Events";
import VerifyTicket from "./pages/dashboard/VerifyTicket";
import EventDetail from "./pages/EventDetail";
import FindTickets from "./pages/FindTickets";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PaymentSuccess from "./pages/PaymentSuccess";
import RegisterOrganizer from "./pages/RegisterOrganizer";
import SearchEvents from "./pages/SearchEvents";
import SignUp from "./pages/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Home },
      { path: "/login", Component: Login },
      { path: "/signup", Component: SignUp },
      { path: "/payment/success", Component: PaymentSuccess },
      { path: "/organizer/register", Component: RegisterOrganizer },
      { path: "/search", Component: SearchEvents },
      { path: "/find-tickets", Component: FindTickets },

      {
        path: "/e/:event",
        Component: EventDetail,
        loader: (args) => {
          const id = args.params.event?.split("-").at(-1);

          return id || null;
        },
      },
    ],
  },
  {
    path: "/dashboard",
    Component: DashBoard,
    children: [
      {
        path: "/dashboard/create-event",
        Component: CreateEvent,
      },
      {
        path: "/dashboard/events",
        Component: Events,
      },
      {
        path: "/dashboard/events/edit/:event",
        loader: (args) => {
          const id = args.params.event?.split("-").at(-1);

          return id || null;
        },
        Component: EditEvent,
      },
      {
        path: "/dashboard/tickets/verify",
        Component: VerifyTicket,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
