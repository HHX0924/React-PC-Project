import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import React from 'react';
import {AuthComponent} from "@/components/AuthComponents";
import Publish from "@/pages/Publish";
import Article from "@/pages/Article";
import Home from "@/pages/Home";
function App() {
  return (
      //路由配置
      <BrowserRouter>
          <div className="App">
              {/*  创建路由path和组件对应关系   */}
            <Routes>
                <Route path='/' element={
                    <AuthComponent>
                        <Layout />
                    </AuthComponent>
                }>
                    <Route index element={<Home />}></Route>
                    <Route path='article' element={<Article />}></Route>
                    <Route path='publish' element={<Publish />}></Route>
                </Route>
                <Route path='/login' element={<Login />}></Route>
            </Routes>
          </div>
      </BrowserRouter>

  );
}

export default App;
