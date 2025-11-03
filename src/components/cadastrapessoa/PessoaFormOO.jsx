import React, { useState, useEffect } from "react";
import { Form, Input, Button, Radio, message } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import EnderecoForm from "./EnderecoFormEX";
import TelefoneList from "./TelefoneListOO";
import PFForm from "./PFForm";
import PJForm from "./PJForm";
import "./pessoaform.css";

// === Importação das classes de modelo (todas dentro da pasta /pessoas)
import PF from "../../objetos/pessoas/PF.mjs";
import PJ from "../../objetos/pessoas/PJ.mjs";
import Endereco from "../../objetos/pessoas/Endereco.mjs";
import Telefone from "../../objetos/pessoas/Telefone.mjs";
import Titulo from "../../objetos/pessoas/Titulo.mjs";
import IE from "../../objetos/pessoas/IE.mjs";

import PFDAO from "../../objetos/dao/PFDAOLocal.mjs";
import PJDAO from "../../objetos/dao/PJDAOLocal.mjs";


function PessoaForm() {
  const [tipo, setTipo] = useState("PF");
  const [form] = Form.useForm();
  const [mostrarTopo, setMostrarTopo] = useState(false);

  // =========================
  // Envio do formulário
  // =========================
  async function onFinish(values) {
    try {
      let pessoa;

      // ===== Criar o endereço =====
      const end = new Endereco();
      end.setCep(values.endereco?.cep);
      end.setLogradouro(values.endereco?.logradouro);
      end.setBairro(values.endereco?.bairro);
      end.setCidade(values.endereco?.cidade);
      end.setUf(values.endereco?.uf);
      end.setRegiao(values.endereco?.regiao);

      // ===== Pessoa Física =====
      if (values.tipo === "PF") {
        const pf = new PF();
        pf.setNome(values.nome);
        pf.setEmail(values.email);
        pf.setCPF(values.cpf);
        pf.setEndereco(end);

        // ===== Título Eleitoral (se existir)
        if (values.titulo) {
          const t = new Titulo();
          t.setNumero(values.titulo.numero);
          t.setZona(values.titulo.zona);
          t.setSecao(values.titulo.secao);
          pf.setTitulo(t);
        }

        // ===== Telefones
        if (values.telefones && values.telefones.length > 0) {
          values.telefones.forEach((tel) => {
            const fone = new Telefone();
            fone.setDdd(tel.ddd);
            fone.setNumero(tel.numero);
            pf.addTelefone(fone);
          });
        }

        pessoa = pf;
      }
      // ===== Pessoa Jurídica =====
      else if (values.tipo === "PJ") {
        const pj = new PJ();
        pj.setNome(values.nome);
        pj.setEmail(values.email);
        pj.setCNPJ(values.cnpj);
        pj.setEndereco(end);

        // ===== IE (Inscrição Estadual)
        if (values.ie) {
          const ie = new IE();
          ie.setNumero(values.ie.numero);
          ie.setEstado(values.ie.estado);
          ie.setDataRegistro(values.ie.dataRegistro);
          pj.setIE(ie);
        }

        // ===== Telefones
        if (values.telefones && values.telefones.length > 0) {
          values.telefones.forEach((tel) => {
            const fone = new Telefone();
            fone.setDdd(tel.ddd);
            fone.setNumero(tel.numero);
            pj.addTelefone(fone);
          });
        }

        pessoa = pj;
      }

        // ===== Persistência via DAO =====
    if (pessoa) {
      if (values.tipo === "PF") {
        const pfDAO = new PFDAO();
        pfDAO.salvar(pessoa);
        message.success("Pessoa Física salva com sucesso!");
      } else if (values.tipo === "PJ") {
        const pjDAO = new PJDAO();
        pjDAO.salvar(pessoa);
        message.success("Pessoa Jurídica salva com sucesso!");
      }
    }

      console.clear();
      console.log("✅ OBJETO FINAL INSTANTIADO ===>", pessoa);
      message.success("Objeto criado com sucesso! Veja o console.");
    } catch (erro) {
      console.error("❌ Erro ao criar o objeto:", erro);
      message.error("Erro ao criar o objeto: " + erro.message);
    }
  }

  // =========================
  // Troca de tipo PF/PJ
  // =========================
  function onChangeTipo(e) {
    const novoTipo = e.target.value;
    setTipo(novoTipo);
    const valoresAtuais = form.getFieldsValue();
    form.resetFields();
    form.setFieldsValue({
      ...valoresAtuais,
      tipo: novoTipo,
    });
  }

  // =========================
  // Botão “voltar ao topo”
  // =========================
  useEffect(function () {
    function verificarScroll() {
      if (window.scrollY > 200) {
        setMostrarTopo(true);
      } else {
        setMostrarTopo(false);
      }
    }
    window.addEventListener("scroll", verificarScroll);
    return () => window.removeEventListener("scroll", verificarScroll);
  }, []);

  function voltarAoTopo() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // =========================
  // Renderização
  // =========================
  return (
    <div className="main-scroll">
      <div className="form-container">
        <h2>Cadastro de {tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}</h2>

        <Form layout="vertical" form={form} onFinish={onFinish}>
          {/* Tipo de Pessoa */}
          <Form.Item
            label="Tipo de Pessoa"
            name="tipo"
            initialValue="PF"
            style={{ marginBottom: 10 }}
          >
            <Radio.Group onChange={onChangeTipo}>
              <Radio value="PF">Pessoa Física</Radio>
              <Radio value="PJ">Pessoa Jurídica</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Campos básicos */}
          <Form.Item
            label="Nome"
            name="nome"
            rules={[{ required: true, message: "Informe o nome!" }]}
          >
            <Input placeholder="Nome completo ou razão social" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Informe o e-mail!" },
              { type: "email", message: "Formato de e-mail inválido!" },
            ]}
          >
            <Input placeholder="exemplo@email.com" />
          </Form.Item>

          {/* Endereço e Telefones */}
          <EnderecoForm form={form}/>
          <TelefoneList form={form} />

          {/* PF ou PJ */}
          {tipo === "PF" ? <PFForm /> : <PJForm />}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Botão flutuante */}
      <button
        className={`scroll-top-button ${mostrarTopo ? "" : "hidden"}`}
        onClick={voltarAoTopo}
        title="Voltar ao topo"
      >
        <ArrowUpOutlined />
      </button>
    </div>
  );
}

export default PessoaForm;
