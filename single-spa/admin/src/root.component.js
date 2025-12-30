import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from 'react-router-dom';
import PendingList from './screens/PendingList';
import RequestDetail from './screens/RequestDetail';
import './styles.css';


export default function Root() {
  return (
    <div className="admin-container">
      <Router basename="/admin">
        <Header />
        <div className="admin-content">
          <Switch>
            <Route exact path="/" component={PendingList} />
            <Route exact path="/requests/pending" component={PendingList} />
            <Route exact path="/products/:productId" component={RequestDetail} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}


function Header() {
  const history = useHistory();
  useEffect(() => {
    if (history.location.pathname === '/admin') {
      history.replace('/');
    }
  }, [history]);


  return (
    <header className="admin-header">
      <div className="admin-brand">Admin Dashboard</div>
      <nav className="admin-nav">
        <Link to="/">Pending</Link>
      </nav>
    </header>
  );
}






