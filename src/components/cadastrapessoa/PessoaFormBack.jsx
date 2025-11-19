import React, { useState, useEffect } from "react";
import { Form, Input, Button, Radio, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// === Subcomponentes ===
import EnderecoForm from "./EnderecoFormEXV2.jsx";
import TelefoneList from "./TelefoneListOOV2.jsx";
import PFForm from "./PFForm.jsx";
import PJForm from "./PJForm.jsx";

// === DAOs ===
import PFDAO from "../../objetos/dao/PFDAOBackEnd.mjs";
import PJDAO from "../../objetos/dao/PJDAOBackEnd.mjs";

// === Classes ===
import PF from "../../objetos/pessoas/PF.mjs";
import PJ from "../../objetos/pessoas/PJ.mjs";
import Endereco from "../../objetos/pessoas/Endereco.mjs";
import Telefone from "../../objetos/pessoas/Telefone.mjs";
import Titulo from "../../objetos/pessoas/Titulo.mjs";
import IE from "../../objetos/pessoas/IE.mjs";

export default function PessoaForm() {
  const [tipo, setTipo] = useState("PF");
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false); // ⭐ SPIN
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const { tipo: tipoParam, id } = useParams();

  const pfDAO = new PFDAO();
  const pjDAO = new PJDAO();

  // ============================================================
  //  EFEITO: Carregar dados do backend no modo edição
  // ============================================================
  useEffect(() => {
    async function carregarEdicao() {
      if (id && tipoParam) {
        setLoading(true); // inicia SPIN
        setEditando(true);
        setTipo(tipoParam);

        const dao = tipoParam === "PF" ? pfDAO : pjDAO;

        // 🔹 aguarda backend carregar lista
        await dao.carregarLista();
        const lista = dao.listar();

        const pessoa = lista.find((p) => p.id === id);

        if (!pessoa) {
          message.error("Pessoa não encontrada!");
          navigate("/listar");
          setLoading(false);
          return;
        }

        window.scrollTo({ top: 0, behavior: "smooth" });

        // 🔹 Monta objeto de valores compatíveis com o formulário
        const valores = {
          tipo: tipoParam,
          nome: pessoa.nome,
          email: pessoa.email,
          endereco: pessoa.endereco || {},
          telefones: pessoa.telefones || [],
        };

        if (tipoParam === "PF") {
          valores.cpf = pessoa.cpf;
          valores.titulo = pessoa.titulo || { numero: "", zona: "", secao: "" };
        } else {
          const ieObj = pessoa.ie || {};
          valores.cnpj = pessoa.cnpj;
          valores.ie = {
            numero: ieObj.numero || "",
            estado: ieObj.estado || "",
            dataRegistro:
              ieObj.dataRegistro && ieObj.dataRegistro !== ""
                ? dayjs(ieObj.dataRegistro)
                : null,
          };
        }

        form.setFieldsValue(valores);
        setLoading(false); // finaliza SPIN
      }
    }

    carregarEdicao();
  }, [id, tipoParam]);

  // ============================================================
//  LIMPAR FORMULÁRIO AO ENTRAR EM /cadastrar
// ============================================================
useEffect(() => {
  if (!id) {
    // Se não tem ID, estamos em modo cadastro
    setEditando(false);
    setTipo("PF"); // volta ao padrão
    form.resetFields();
  }
}, [id]);


  // ============================================================
  // TROCA PF/PJ
  // ============================================================
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

  // ============================================================
  // SALVAR / ATUALIZAR
  // ============================================================
  async function onFinish(values) {
    try {
      setLoading(true);

      let pessoa;
      const endVals = values.endereco || {};

      const end = new Endereco();
      end.setCep(endVals.cep);
      end.setLogradouro(endVals.logradouro);
      end.setBairro(endVals.bairro);
      end.setCidade(endVals.cidade);
      end.setUf(endVals.uf);
      end.setRegiao(endVals.regiao);

      if (values.tipo === "PF") {
        const pf = new PF();
        pf.setNome(values.nome);
        pf.setEmail(values.email);
        pf.setCPF(values.cpf);
        pf.setEndereco(end);

        if (values.titulo) {
          const t = new Titulo();
          t.setNumero(values.titulo.numero);
          t.setZona(values.titulo.zona);
          t.setSecao(values.titulo.secao);
          pf.setTitulo(t);
        }

        if (values.telefones?.length > 0) {
          values.telefones.forEach((tel) => {
            const fone = new Telefone();
            fone.setDdd(tel.ddd);
            fone.setNumero(tel.numero);
            pf.addTelefone(fone);
          });
        }

        pessoa = pf;
      } else {
        const pj = new PJ();
        pj.setNome(values.nome);
        pj.setEmail(values.email);
        pj.setCNPJ(values.cnpj);
        pj.setEndereco(end);

        if (values.ie) {
          const ie = new IE();
          ie.setNumero(values.ie.numero);
          ie.setEstado(values.ie.estado);

          const dr = values.ie.dataRegistro;
          const dataRegistro =
            dr && typeof dr === "object" && typeof dr.format === "function"
              ? dr.format("YYYY-MM-DD")
              : dr || "";

          ie.setDataRegistro(dataRegistro);
          pj.setIE(ie);
        }

        if (values.telefones?.length > 0) {
          values.telefones.forEach((tel) => {
            const fone = new Telefone();
            fone.setDdd(tel.ddd);
            fone.setNumero(tel.numero);
            pj.addTelefone(fone);
          });
        }

        pessoa = pj;
      }

      const dao = tipo === "PF" ? pfDAO : pjDAO;

      if (editando && id) {
        await dao.atualizar(id, pessoa);
        message.success("Registro atualizado com sucesso!");
      } else {
        await dao.salvar(pessoa);
        message.success("Registro criado com sucesso!");
      }

      form.resetFields();
      navigate("/listar");
    } catch (erro) {
      console.error("❌ Erro ao salvar:", erro);
      message.error("Erro ao salvar registro.");
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // ⭐ RENDER COM SPIN
  // (design original mantido 100%)
  // ============================================================
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9f9f9"
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // ============================================================
  // RENDER NORMAL
  // ============================================================
  return (
    <div
      className="main-scroll"
      style={{
        overflowY: "auto",
        overflowX: "hidden",
        height: "100vh",
        background: "#f9f9f9",
      }}
    >
      <div
        className="form-container"
        style={{
          maxWidth: 800,
          margin: "24px auto",
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          {editando
            ? `Editar ${tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}`
            : `Cadastro de ${tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}`}
        </h2>

        <Form form={form} layout="vertical" onFinish={onFinish}>
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
              { type: "email", message: "Formato inválido!" },
            ]}
          >
            <Input />
          </Form.Item>

          {tipo === "PF" ? (
            <Form.Item
              label="CPF"
              name="cpf"
              rules={[{ required: true, message: "Informe o CPF!" }]}
            >
              <Input maxLength={11} placeholder="Somente números" />
            </Form.Item>
          ) : (
            <Form.Item
              label="CNPJ"
              name="cnpj"
              rules={[{ required: true, message: "Informe o CNPJ!" }]}
            >
              <Input maxLength={18} placeholder="Somente números" />
            </Form.Item>
          )}

          <EnderecoForm />
          <TelefoneList form={form} />

          {tipo === "PF" ? <PFForm /> : <PJForm />}

          <Form.Item style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit" block>
              {editando ? "Salvar Alterações" : "Salvar"}
            </Button>
          </Form.Item>

          {editando && (
            <Form.Item>
              <Button block onClick={() => navigate("/listar")}>
                Cancelar
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  );
}

