//react-router
import {BrowserRouter, Routes, Route} from "react-router-dom"
//components
import Home from "./pages/Home"
import CityPage from "./pages/CityPage"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/:localInformation' element={<CityPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
