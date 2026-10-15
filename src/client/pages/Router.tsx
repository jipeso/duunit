import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'

import AuthRoute from '../components/AuthRoute'
import PageLoader from '../components/common/PageLoader'

const Home = lazy(() => import('./Home'))
const Login = lazy(() => import('./Login'))
const Register = lazy(() => import('./Register'))
const Profile = lazy(() => import('./Profile'))
const Admin = lazy(() => import('./Admin'))
const Applications = lazy(() => import('./Applications'))
const Application = lazy(() => import('./Application'))
const NewApplication = lazy(() => import('./NewApplication'))
const EditApplication = lazy(() => import('./EditApplication'))
const Resumes = lazy(() => import('./Resumes'))
const Resume = lazy(() => import('./Resume'))
const JobAnalysis = lazy(() => import('./JobAnalysis'))
const Privacy = lazy(() => import('./Privacy'))

const Router = () => {
  return (
    <Suspense fallback={<PageLoader />}>
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
          <Route path='/job-analysis' element={<JobAnalysis />} />
        </Route>
        <Route element={<AuthRoute access='admin' />}>
          <Route path='/admin' element={<Admin />} />
        </Route>
        <Route path='/privacy' element={<Privacy />} />
        <Route path='*' element={<Home />} />
      </Routes>
    </Suspense>
  )
}

export default Router
