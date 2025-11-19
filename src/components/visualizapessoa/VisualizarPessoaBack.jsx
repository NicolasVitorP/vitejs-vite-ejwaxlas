import React, { useEffect, useState } from "react";
import { Card, Descriptions, Button, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import PFDAO from "../../objetos/dao/PFDAOBackEnd.mjs";
import PJDAO from "../../objetos/dao/PJDAOBackEnd.mjs";

export default function VisualizaPessoa() {
  const { tipo, id } = useParams();
  const navigate = useNavigate();

  const [pessoa, setPessoa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      setLoading(true);

      const dao = tipo === "PF" ? new PFDAO() : new PJDAO();

      // 🔹 Aguarda carregar do back-end
      await dao.carregarLista();

      const lista = dao.listar();
      const encontrada = lista.find((p) => p.id === id);

      setPessoa(encontrada ?? null);
      setLoading(false);
    }

    carregar();
  }, [tipo, id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!pessoa) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <h3>Nenhuma pessoa encontrada.</h3>
        <Button type="primary" onClick={() => navigate("/listar")}>
          Voltar à lista
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "24px auto",
        background: "#fff",
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Card
        title={`Detalhes da ${tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}`}
        bordered={false}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Nome">{pessoa.nome}</Descriptions.Item>
          <Descriptions.Item label="E-mail">{pessoa.email}</Descriptions.Item>

          {tipo === "PF" ? (
            <Descriptions.Item label="CPF">{pessoa.cpf}</Descriptions.Item>
          ) : (
            <Descriptions.Item label="CNPJ">{pessoa.cnpj}</Descriptions.Item>
          )}

          <Descriptions.Item label="Endereço">
            {pessoa.endereco?.logradouro}, {pessoa.endereco?.bairro} -{" "}
            {pessoa.endereco?.cidade}/{pessoa.endereco?.uf}
            <br />
            CEP: {pessoa.endereco?.cep} | Região: {pessoa.endereco?.regiao}
          </Descriptions.Item>

          <Descriptions.Item label="Telefones">
            {pessoa.telefones?.length > 0
              ? pessoa.telefones
                  .map((t) => `(${t.ddd}) ${t.numero}`)
                  .join(" | ")
              : "Não informado"}
          </Descriptions.Item>

          {tipo === "PF" ? (
            <Descriptions.Item label="Título Eleitoral">
              {pessoa.titulo?.numero
                ? `Nº ${pessoa.titulo.numero} - Zona ${pessoa.titulo.zona} / Seção ${pessoa.titulo.secao}`
                : "Não informado"}
            </Descriptions.Item>
          ) : (
            <Descriptions.Item label="Inscrição Estadual">
              {pessoa.ie?.numero
                ? `Nº ${pessoa.ie.numero} - ${pessoa.ie.estado} (${pessoa.ie.dataRegistro})`
                : "Não informado"}
            </Descriptions.Item>
          )}
        </Descriptions>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Button
            type="primary"
            onClick={() => navigate(`/editar/${tipo}/${pessoa.id}`)}
            style={{ marginRight: 12 }}
          >
            Editar
          </Button>
          <Button onClick={() => navigate("/listar")}>Voltar</Button>
        </div>
      </Card>
    </div>
  );
}

