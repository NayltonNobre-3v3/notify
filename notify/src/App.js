import React from "react";

import "./Global.css";
import Route from "./routes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <>
      <Route />
      <ToastContainer autoClose={2000}>
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      </ToastContainer>
    </>
  );
}

export default App;
