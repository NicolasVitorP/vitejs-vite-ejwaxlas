import React, { useState, useEffect } from "react";
import { Table, Button, Select, Input, Space, Popconfirm, message } from "antd";
import { Link } from "react-router-dom";
import PFDAO from "../../objetos/dao/PFDAOLocal.mjs";
import PJDAO from "../../objetos/dao/PJDAOLocal.mjs";

const { Option } = Select;

function ListaPessoas() {
  const [tipo, setTipo] = useState("PF");
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [dados, setDados] = useState([]);

  const pfDAO = new PFDAO();
  const pjDAO = new PJDAO();

  useEffect(() => {
    carregarDados();
  }, [tipo, nomeFiltro]);

  function carregarDados() {
    let lista =
      tipo === "PF" ? pfDAO.listar() : pjDAO.listar();

    if (nomeFiltro.trim() !== "") {
      lista = lista.filter((p) =>
        p.nome.toLowerCase().includes(nomeFiltro.toLowerCase())
      );
    }

    setDados(lista);
  }

  function excluirPessoa(id) {
    if (tipo === "PF") pfDAO.excluir(id);
    else pjDAO.excluir(id);

    message.success("Registro excluído com sucesso!");
    carregarDados();
  }

  const colunasPF = [
    { title: "Nome", dataIndex: "nome", key: "nome" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "CPF", dataIndex: "cpf", key: "cpf" },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <Space>
          <Link to={`/visualizar/PF/${record.cpf}`}>
            <Button type="link">Visualizar</Button>
          </Link>
          <Popconfirm
            title="Excluir pessoa?"
            onConfirm={() => excluirPessoa(record.cpf)}
          >
            <Button danger type="link">Excluir</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const colunasPJ = [
    { title: "Nome", dataIndex: "nome", key: "nome" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "CNPJ", dataIndex: "cnpj", key: "cnpj" },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <Space>
          <Link to={`/visualizar/PJ/${record.cnpj}`}>
            <Button type="link">Visualizar</Button>
          </Link>
          <Popconfirm
            title="Excluir pessoa?"
            onConfirm={() => excluirPessoa(record.cnpj)}
          >
            <Button danger type="link">Excluir</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Select value={tipo} onChange={setTipo} style={{ width: 160 }}>
          <Option value="PF">Pessoa Física</Option>
          <Option value="PJ">Pessoa Jurídica</Option>
        </Select>
        <Input
          placeholder="Filtrar por nome..."
          value={nomeFiltro}
          onChange={(e) => setNomeFiltro(e.target.value)}
          style={{ width: 200 }}
        />
        <Button onClick={carregarDados}>Atualizar</Button>
      </Space>

      <Table
        dataSource={dados}
        columns={tipo === "PF" ? colunasPF : colunasPJ}
        rowKey={tipo === "PF" ? "cpf" : "cnpj"}
        pagination={{ pageSize: 5 }}
      />
    </>
  );
}

export default ListaPessoas;
