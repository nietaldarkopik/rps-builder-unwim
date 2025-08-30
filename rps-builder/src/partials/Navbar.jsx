import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "./Ui.jsx";

export default function Navbar() {
  const [openRps, setOpenRps] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <div className="text-xl font-bold">SIAKAD</div>
      <ul className="flex space-x-6">
        <li>
          <Button asChild>
            <Link to="/" className="hover:text-blue-600">Dashboard</Link>
          </Button>
        </li>
        <li className="relative">
          <button
            onClick={() => setOpenRps(!openRps)}
            className="block hover:text-blue-600 flex items-center"
          >
            RPS ▼
          </button>
          {openRps && (
            <ul className="absolute mt-2 bg-white shadow-lg rounded-md p-2 w-48 space-y-2">
              <li>
                <Link to="/cp" className="block hover:bg-gray-100 px-2 py-1 rounded">
                  CP
                </Link>
              </li>
              <li>
                <Link to="/cpl" className="block hover:bg-gray-100 px-2 py-1 rounded">
                  CPL
                </Link>
              </li>
              <li>
                <Link to="/cpmk" className="block hover:bg-gray-100 px-2 py-1 rounded">
                  CPMK
                </Link>
              </li>
              <li>
                <Link to="/sub-cpmk" className="block hover:bg-gray-100 px-2 py-1 rounded">
                  Sub-CPMK
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Button asChild>
            <Link to="/mk" className="hover:text-blue-600">Daftar MK</Link>
          </Button>
        </li>
        <li>
          <Button asChild>
            <Link to="/prodi" className="hover:text-blue-600">Program Studi</Link>
          </Button>
        </li>
        <li>
          <Button asChild>
            <Link to="/master" className="hover:text-blue-600">Data Master</Link>
          </Button>
        </li>
      </ul>
    </nav>
  );
}
