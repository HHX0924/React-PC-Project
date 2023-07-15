import {Routes, Route} from "react-router-dom";
import React from 'react';
import {AuthComponent} from "@/components/AuthComponents";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { history } from "@/utils/history";
// 导入必要组件
import { lazy, Suspense } from 'react'
// 按需导入路由组件
const Login = lazy(() => import('./pages/Login'))
const Layout = lazy(() => import('./pages/Layout'))
const Home = lazy(() => import('./pages/Home'))
const Article = lazy(() => import('./pages/Article'))
const Publish = lazy(() => import('./pages/Publish'))
function App() {
  return (
      //路由配置
      <HistoryRouter history={history}>
          <div className="App">
              <Suspense
                  fallback={
                      <div
                          style={{
                              textAlign: 'center',
                              marginTop: 200
                          }}
                      >
                          loading...
                      </div>
                  }
              >
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
              </Suspense>
          </div>
      </HistoryRouter>

  );
}

export default App;
