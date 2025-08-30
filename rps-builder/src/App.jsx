import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./partials/Navbar.jsx";
import Mk from "./pages/Mk.jsx";
import Master from "./pages/Master.jsx";
import RpsBuilder from "./pages/RpsBuilder.jsx";

function Dashboard() {
  return <h1 className="p-6 text-2xl font-semibold">Dashboard</h1>;
}

function MkController() {
  return <Mk />;
}

function CP() {
  return <h1 className="p-6 text-2xl font-semibold">Halaman CP</h1>;
}

function CPL() {
  return <h1 className="p-6 text-2xl font-semibold">Halaman CPL</h1>;
}

function CPMK() {
  return <h1 className="p-6 text-2xl font-semibold">Halaman CPMK</h1>;
}

function SubCPMK() {
  return <h1 className="p-6 text-2xl font-semibold">Halaman Sub-CPMK</h1>;
}

function Prodi() {
  return <h1 className="p-6 text-2xl font-semibold">Program Studi</h1>;
}

function MasterData() {
  return <Master />;
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cp" element={<CP />} />
        <Route path="/cpl" element={<CPL />} />
        <Route path="/cpmk" element={<CPMK />} />
        <Route path="/sub-cpmk" element={<SubCPMK />} />
        <Route path="/mk" element={<MkController />} />
        <Route path="/prodi" element={<Prodi />} />
        <Route path="/master" element={<MasterData />} />
        <Route path="/rps-builder" element={<RpsBuilder />} />
      </Routes>
    </Router>
  );
}