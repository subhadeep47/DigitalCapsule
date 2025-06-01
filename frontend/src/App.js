import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Componants/Layout';
import Home from './Componants/Home';
import NotFound from './Componants/NotFound';
import Auth from './Componants/Auth';
import Dashboard from './UserComponant/Dashboard';
import CreateCapsule from './UserComponant/CreateCapsule';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/*<Route path="capsule/:id" element={<CapsuleDetail />} /> */}
          <Route path="create" element={<CreateCapsule />} />
          {/* <Route path="capsules" element={<CapsuleList />} /> will use this when we will implement public capsule exploration page*/}
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
