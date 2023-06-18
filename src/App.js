import './App.css';

import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import AdminPrivateRoute from './AdminPrivateRoute';
import ErrorBoundary from './ErrorBoundary';
import Home from './components/user/Home';
import Login from './components/user/auth/Login';
import Page403 from './components/errors/Page403';
import Page404 from './components/errors/Page404';
import Register from './components/user/auth/Register';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.withCredentials = true;
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('auth_token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
})

function App() {
  return (
    <div className="App">
      
      <Router>
        <Switch>
        
          <Route exact path='/' component={Home} />

          <Route path="/403" component={Page403} />
          <Route path="/404" component={Page404} />

          {/* <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} /> */}
          <Route path='/login'>
            {localStorage.getItem('auth_token') ? <Redirect to='/' /> : <Login />}
          </Route>
          <Route path='/register'>
            {localStorage.getItem('auth_token') ? <Redirect to='/' /> : <Register />}
          </Route>
          {/* <Route  render={(props) => <MasterLayout {...props} />} /> */}
          <AdminPrivateRoute path='/admin' name='Admin' />
          
        </Switch>
      </Router>
      
      
    </div>
  );
}

export default App;
