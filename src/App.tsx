import { Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { ShowcaseHome } from "./showcase/Home";
import { DemoPage } from "./showcase/DemoPage";
import { Jobs } from "./site/Jobs";
import { JobDetail } from "./site/JobDetail";
import { Register } from "./site/Register";
import { AvailabilityReply, PhoneText, PhoneEmail } from "./site/Worker";

const CrmApp = lazy(() => import("./crm/CrmApp"));
const Shot = lazy(() => import("./showcase/platform/Shot"));
const Login = lazy(() => import("./crm/Login"));

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith("/crm") || pathname === "/login") window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<ShowcaseHome />} />
        <Route path="/demo/:slug" element={<DemoPage />} />
        <Route path="/shot/:slug" element={<Suspense fallback={null}><Shot /></Suspense>} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/a/:code" element={<AvailabilityReply />} />
        <Route path="/m/text" element={<PhoneText />} />
        <Route path="/m/email" element={<PhoneEmail />} />
        <Route
          path="/login"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#f7f8fa]" />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/crm/*"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#f7f8fa]" />}>
              <CrmApp />
            </Suspense>
          }
        />
        <Route path="*" element={<ShowcaseHome />} />
      </Routes>
    </>
  );
}
