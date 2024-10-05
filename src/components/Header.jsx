import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState(null); // State to hold the logged-in username
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the username from local storage on component mount
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/search/${searchQuery}`);
    }
  };

  const handleLogout = () => {
    // Clear the username from local storage and update state
    localStorage.removeItem('username');
    setUsername(null);
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-black">
      <div className="flex items-center">
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">☰</label>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              <li><a>Sidebar Item 1</a></li>
              <li><a>Sidebar Item 2</a></li>
            </ul>
          </div>
        </div>
        <Link to="/" className="text-xl font-bold">
          YouTube
        </Link>
      </div>
      
      <form onSubmit={handleSearch} className="flex flex-1 mx-4">
        <input
          type="text"
          placeholder="Search"
          className="flex-grow p-2 rounded-l"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="p-2 bg-gray-700 rounded-r">
          🔍
        </button>
      </form>

      <div className="flex items-center">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
              <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {/* If user is logged in, display the username */}
            {username ? (
              <>
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>Username: {username}</li>
                {/* Clear local storage and redirect to login */}
                <li><a onClick={handleLogout}>Logout</a></li>
              </>
            ) : (
              // "Sign up" is now a link rather than an anchor
              <>
                <li><Link to="/signup">Sign up</Link></li>
                <li><Link to="/login">Login</Link></li>
              </>
            )}
          </ul>
        </div>

        <button>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
            <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
