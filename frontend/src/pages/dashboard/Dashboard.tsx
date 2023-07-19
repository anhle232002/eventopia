import { useLogout, useUser } from "@/libs/auth";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function DashBoard() {
  const { data: user, isLoading } = useUser();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  const logout = async () => {
    await logoutMutation.mutateAsync();

    navigate("/", { replace: true });
  };
  if (!isLoading && !user) {
    navigate("/", { replace: true });
  }
  return (
    <div>
      <div className="drawer  md:drawer-open">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content">
          <label
            htmlFor="my-drawer"
            className="btn btn-primary btn-sm btn-circle m-4 drawer-button md:hidden"
          >
            <i className="ri-menu-line text-lg"></i>
          </label>
          <Outlet />
        </div>

        <div className="drawer-side border-r border-neutral/20">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>

          <ul className="menu p-4 lg:w-80 md:w-64 h-full bg-white text-base-content text-lg justify-between">
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
                <div onClick={() => logout()} className="py-3">
                  Logout
                </div>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default DashBoard;
