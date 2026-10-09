import { Routes, Route } from 'react-router'

import Home from './Home'
import Login from './Login'
import Register from './Register'
import Profile from './Profile'
import Admin from './Admin'
import Applications from './Applications'
import Application from './Application'
import NewApplication from './NewApplication'
import EditApplication from './EditApplication'
import Resumes from './Resumes'
import Resume from './Resume'
import AuthRoute from '../components/AuthRoute'

const Router = () => {
  return (
    <Routes>
      <Route element={<AuthRoute access='guest' />}>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Route>
      <Route element={<AuthRoute access='user' />}>
        <Route path='/profile' element={<Profile />} />
        <Route path='/applications' element={<Applications />} />
        <Route path='/applications/:id' element={<Application />} />
        <Route path='/applications/new' element={<NewApplication />} />
        <Route path='/applications/:id/edit' element={<EditApplication />} />
        <Route path='/resumes' element={<Resumes />} />
        <Route path='/resumes/:id' element={<Resume />} />
      </Route>
      <Route element={<AuthRoute access='admin' />}>
        <Route path='/admin' element={<Admin />} />
      </Route>
      <Route path='*' element={<Home />} />
    </Routes>
  )
}

export default Router
