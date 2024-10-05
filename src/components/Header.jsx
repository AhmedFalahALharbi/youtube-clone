import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState(null); // State to hold the logged-in username
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the username from local storage on component mount
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search/${searchQuery}`);
    }
  };

  const handleLogout = () => {
    // Clear the username from local storage and update state
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between p-2 bg-base-100 text-primary sm:p-4">
      {/* Drawer and logo */}
      <div className="flex items-center">
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="my-drawer" className="btn btn-ghost drawer-button text-lg">
              ☰
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"></label>
            <ul className="menu bg-base-100 text-primary min-h-full w-60 p-4">
              <li>
                <a>
                  <img
                    src="https://freepnglogo.com/images/all_img/1701508998white-youtube-logo-png.png"
                    alt=""
                    className="w-28"
                  />
                </a>
              </li>
              <li><Link to="/">HomePage</Link></li>
              <li><Link to="/shorts">Shorts</Link></li>
              <li><Link to="/subscriptions">Subscription</Link></li>
              <hr />
              <li><Link to="/channel">Your Channel</Link></li>
              <li><Link to="/history">History</Link></li>
              <li><Link to="/playlist">Playlist</Link></li>
              <li><Link to="/your-videos">Your Videos</Link></li>
              <li><Link to="/watch-later">Watch Later</Link></li>
            </ul>
          </div>
        </div>
        <Link to="/" className="w-28 sm:w-40">
          <img
            src="https://freepnglogo.com/images/all_img/1701508998white-youtube-logo-png.png"
            alt=""
            className="w-full"
          />
        </Link>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-4 sm:w-auto sm:mx-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full lg:w-96 p-2 rounded-l-full bg-neutral text-primary border-secondary border-[1px] placeholder:text-secondary active:border-[1px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="p-2 bg-secondary rounded-r-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#F1F1F1">
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </svg>
        </button>
      </form>

      {/* User menu and profile */}
      <div className="flex items-center">
        {/* Notifications */}
        <button className="hidden sm:block mx-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#F1F1F1">
            <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
          </svg>
        </button>

        {/* Profile avatar dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar border-2 bg-secondary rounded-full p-2 mx-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#F1F1F1">
              <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-52 p-2 shadow bg-secondary">
            <li><a>@{username}</a></li>
            <hr />
            <li><a>Google Account</a></li>
            <li><a>Change Account</a></li>
            <li><a onClick={handleLogout}>Logout</a></li>
            <hr />
            <li><a>YouTube Studio</a></li>
            <li><a>Payment</a></li>
            <hr />
            <li><a>Data in YouTube</a></li>
            <li><a>Device look</a></li>
            <li><a>Language:English</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
