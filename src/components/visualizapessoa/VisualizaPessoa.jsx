import React, { useEffect, useState } from "react";
import { Descriptions, Button } from "antd";
import { useParams, Link } from "react-router-dom";
import PFDAO from "../../objetos/dao/PFDAOLocal.mjs";
import PJDAO from "../../objetos/dao/PJDAOLocal.mjs";

function VisualizaPessoa() {
  const { tipo, id } = useParams();
  const [pessoa, setPessoa] = useState(null);

  useEffect(() => {
    const dao = tipo === "PF" ? new PFDAO() : new PJDAO();
    const lista = dao.listar();
    const encontrada =
      tipo === "PF"
        ? lista.find((p) => p.cpf === id)
        : lista.find((p) => p.cnpj === id);
    setPessoa(encontrada);
  }, [tipo, id]);

  if (!pessoa) {
    return <p>Pessoa não encontrada.</p>;
  }

  return (
    <>
      <Descriptions
        title={`Detalhes da ${tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}`}
        bordered
        column={1}
      >
        <Descriptions.Item label="Nome">{pessoa.nome}</Descriptions.Item>
        <Descriptions.Item label="Email">{pessoa.email}</Descriptions.Item>
        {tipo === "PF" ? (
          <Descriptions.Item label="CPF">{pessoa.cpf}</Descriptions.Item>
        ) : (
          <Descriptions.Item label="CNPJ">{pessoa.cnpj}</Descriptions.Item>
        )}

        <Descriptions.Item label="Endereço">
          {pessoa.endereco
            ? `${pessoa.endereco.logradouro}, ${pessoa.endereco.bairro}, ${pessoa.endereco.cidade} - ${pessoa.endereco.uf} (${pessoa.endereco.regiao})`
            : "Não informado"}
        </Descriptions.Item>

        <Descriptions.Item label="Telefones">
          {pessoa.telefones && pessoa.telefones.length > 0
            ? pessoa.telefones.map((t) => `(${t.ddd}) ${t.numero}`).join(", ")
            : "Nenhum telefone"}
        </Descriptions.Item>

        {tipo === "PF" && pessoa.titulo && (
          <>
            <Descriptions.Item label="Título Eleitoral">
              {pessoa.titulo.numero}
            </Descriptions.Item>
            <Descriptions.Item label="Zona">{pessoa.titulo.zona}</Descriptions.Item>
            <Descriptions.Item label="Seção">{pessoa.titulo.secao}</Descriptions.Item>
          </>
        )}

        {tipo === "PJ" && pessoa.ie && (
          <>
            <Descriptions.Item label="Inscrição Estadual">
              {pessoa.ie.numero}
            </Descriptions.Item>
            <Descriptions.Item label="Estado">{pessoa.ie.estado}</Descriptions.Item>
            <Descriptions.Item label="Data Registro">
              {pessoa.ie.dataRegistro}
            </Descriptions.Item>
          </>
        )}
      </Descriptions>

      <Link to="/listar">
        <Button type="primary" style={{ marginTop: 16 }}>
          Voltar
        </Button>
      </Link>
    </>
  );
}

export default VisualizaPessoa;
