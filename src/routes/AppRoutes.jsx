import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout.jsx";
import PessoaForm from "../components/cadastrapessoa/PessoaFormOO.jsx";
import ListaPessoas from "../components/listapessoas/ListaPessoas.jsx";
import VisualizaPessoa from "../components/visualizapessoa/VisualizaPessoa.jsx";

function AppRoutes() {
  return (
    <Routes>
      {/* Todas as rotas dentro do layout principal */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="cadastrar" replace />} />
        <Route path="cadastrar"  element={<PessoaForm />} />
        <Route path="listar" element={<ListaPessoas />} />
        <Route path="visualizar/:tipo/:id" element={<VisualizaPessoa />} />
        <Route path="atualizar/:tipo/:id" element={<VisualizaPessoa />} /> 
      </Route>
    </Routes>
  );
}

export default AppRoutes;
