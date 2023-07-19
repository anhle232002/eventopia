import { useLogout, useUser } from "@/libs/auth";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const { data: user } = useUser();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const handleOnCreateEvent = () => {
    if (!user) {
      (window as any).login_modal.showModal();
    } else if (user.role !== "organizer") {
      (window as any).create_profile_modal.showModal();
    } else {
      navigate("/dashboard", { replace: true });
    }
  };
  return (
    <div className="flex px-4 items-center h-16 justify-between border-b border-zinc-300">
      <div className="flex items-center gap-8">
        <Link to="/">
          <h3 className="text-orange-600">Eventopia</h3>
        </Link>

        <Link
          to="/search"
          role="button"
          className="flex items-center gap-2 px-4 py-2 bg-[#fafafa] rounded lg:w-[400px]"
        >
          <i className="ri-search-line"></i>

          <div className="text-sm md:block hidden">Search events</div>
        </Link>
      </div>

      <div className="flex gap-6 text-sm h-full items-center">
        <div
          role="button"
          onClick={handleOnCreateEvent}
          className="h-full md:center px-3 hover:bg-[#fafafa]  hidden"
        >
          <div>Create an event</div>
        </div>

        <Link to="/find-tickets" className="h-full center px-3 hover:bg-[#fafafa]">
          <div>Find your tickets</div>
        </Link>
        {user ? (
          <div className="flex items-center gap-4 group relative">
            <div className="dropdown dropdown-bottom dropdown-end">
              <label role="button" tabIndex={0} className=" flex items-center gap-3">
                <div>
                  <img className="w-7 h-7 rounded-full" src={user.picture} alt="" />
                </div>
                <div>{`${user.givenName}`}</div>
                <i className="ri-arrow-drop-down-line text-xl"></i>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a href="/dashboard" className="py-3">
                    <i className="ri-profile-fill text-xl"></i>
                    <span className="ml-2">Create Event</span>
                  </a>
                </li>
                <li>
                  <a className="py-3">
                    <i className="ri-profile-fill text-xl"></i>
                    <span className="ml-2">Profile</span>
                  </a>
                </li>
                <li>
                  <a className="py-3">
                    <i className="ri-settings-2-line text-xl"></i>
                    <span className="ml-2">Settings</span>
                  </a>
                </li>
                <li>
                  <a onClick={logout} className="py-3">
                    <i className="ri-logout-box-r-line text-xl"></i>
                    <span className="ml-2">Logout</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <Link to={"/login"} className="h-full center px-3 hover:bg-[#fafafa]">
              <div>Log In</div>
            </Link>
            <Link to={"/signup"} className="h-full center px-3 hover:bg-[#fafafa]">
              <div>Sign Up</div>
            </Link>
          </>
        )}
      </div>

      <dialog id="login_modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">You are not login yet</h3>
          <p className="py-4">Login now and start creating your event</p>
          <div className="modal-action justify-between">
            <button className="btn">Close</button>

            <Link to={"/login"}>
              <button className="btn">Login</button>
            </Link>
          </div>
        </form>
      </dialog>

      <dialog id="create_profile_modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">You are not a organizer</h3>
          <p className="py-4">You need to register as a organizer</p>
          <div className="modal-action justify-between">
            <button className="btn">Close</button>

            <div>
              <button
                onClick={() => {
                  (window as any).create_profile_modal.close();
                  navigate("/organizer/register");
                }}
                className="btn"
              >
                Register
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </div>
  );
}
export default Navbar;
