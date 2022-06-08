import React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals'
import * as ReactDOMClient from 'react-dom/client';

import Connection from './connection';
import { BrowserRouter } from "react-router-dom";
import {BrowserRouter as Router,Route,Routes,Navigate } from "react-router-dom";
import Dashboard from './pages/dashboard';
import Settings from './pages/settings';
import Configure from "./pages/Configure"
import { Helmet } from 'react-helmet';
import MetaTags from 'react-meta-tags';



//const passport = require("passport");



const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);






root.render(
  <div>
    <MetaTags>
            <title>Dynamo</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          </MetaTags>
  <BrowserRouter>
  <Routes>
      <Route path="/" element={<Connection />} />
      <Route path="dashboard/*" element={<Dashboard />} />
      <Route path="dashboard/:guildId" element={<Settings />} />
      <Route path="dashboard/invite" element={<div>test</div>}/>
      <Route path="/connect" element={<Configure />}/>
       
  </Routes>
    </BrowserRouter>
    </div>,
  document.getElementById('root')
,rootElement);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
