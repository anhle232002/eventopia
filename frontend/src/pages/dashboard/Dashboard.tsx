import { useUser } from "@/libs/auth";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function DashBoard() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser();

  if (!isLoading && !user) {
    navigate("/", { replace: true });
  }
  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <Outlet />
        </div>

        <div className="drawer-side border-r border-neutral/20">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <div className="menu p-4 w-80 h-full bg-white text-base-content text-lg justify-between">
            <div>
              <li>
                <Link to="/dashboard" className="py-3">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/events" className="py-3">
                  Your Events
                </Link>
              </li>
              <li>
                <Link to="/dashboard/create-event" className="py-3">
                  Create Event
                </Link>
              </li>
              <li>
                <Link to="/dashboard/create-event" className="py-3">
                  Tickets
                </Link>
              </li>

              <li>
                <Link to="/dashboard/create-event" className="py-3">
                  Followers
                </Link>
              </li>
              <li>
                <Link to="/dashboard/create-event" className="py-3">
                  Send Email
                </Link>
              </li>
            </div>

            <div>
              <li>
                <Link to="/dashboard/tickets/verify" className="py-3">
                  Verify Ticket
                </Link>
              </li>

              <li>
                <Link to="/dashboard/create-event" className="py-3">
                  Logout
                </Link>
              </li>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DashBoard;
