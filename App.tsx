import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/Loader";
import Home from "@/pages/Home";

const NossaHistoria = lazy(() => import("@/pages/NossaHistoria"));
const Galeria = lazy(() => import("@/pages/Galeria"));
const Cerimonia = lazy(() => import("@/pages/Cerimonia"));
const DressCode = lazy(() => import("@/pages/DressCode"));
const Presentes = lazy(() => import("@/pages/Presentes"));
const RSVP = lazy(() => import("@/pages/RSVP"));
const Mural = lazy(() => import("@/pages/Mural"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Convidados = lazy(() => import("@/pages/admin/Convidados"));
const Confirmacoes = lazy(() => import("@/pages/admin/Confirmacoes"));
const PresentesAdmin = lazy(() => import("@/pages/admin/PresentesAdmin"));
const MensagensAdmin = lazy(() => import("@/pages/admin/MensagensAdmin"));
const GaleriaAdmin = lazy(() => import("@/pages/admin/GaleriaAdmin"));

function PublicPage({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </MainLayout>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/nossa-historia"
        element={
          <PublicPage>
            <NossaHistoria />
          </PublicPage>
        }
      />
      <Route
        path="/galeria"
        element={
          <PublicPage>
            <Galeria />
          </PublicPage>
        }
      />
      <Route
        path="/cerimonia"
        element={
          <PublicPage>
            <Cerimonia />
          </PublicPage>
        }
      />
      <Route
        path="/dress-code"
        element={
          <PublicPage>
            <DressCode />
          </PublicPage>
        }
      />
      <Route
        path="/presentes"
        element={
          <PublicPage>
            <Presentes />
          </PublicPage>
        }
      />
      <Route
        path="/rsvp"
        element={
          <PublicPage>
            <RSVP />
          </PublicPage>
        }
      />
      <Route
        path="/mural"
        element={
          <PublicPage>
            <Mural />
          </PublicPage>
        }
      />

      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<Loader />}>
            <AdminLogin />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<Loader />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="convidados"
          element={
            <Suspense fallback={<Loader />}>
              <Convidados />
            </Suspense>
          }
        />
        <Route
          path="confirmacoes"
          element={
            <Suspense fallback={<Loader />}>
              <Confirmacoes />
            </Suspense>
          }
        />
        <Route
          path="presentes"
          element={
            <Suspense fallback={<Loader />}>
              <PresentesAdmin />
            </Suspense>
          }
        />
        <Route
          path="mensagens"
          element={
            <Suspense fallback={<Loader />}>
              <MensagensAdmin />
            </Suspense>
          }
        />
        <Route
          path="galeria"
          element={
            <Suspense fallback={<Loader />}>
              <GaleriaAdmin />
            </Suspense>
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <PublicPage>
            <NotFound />
          </PublicPage>
        }
      />
    </Routes>
  );
}

export default App;
