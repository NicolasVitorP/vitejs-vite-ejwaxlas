import React, { useState } from "react";
import { Form, Input, Row, Col, Select, message, Spin } from "antd";

const { Option } = Select;

function EnderecoForm(props) {
  const form = props.form;
  const [carregando, setCarregando] = useState(false);

  // Função chamada sempre que o usuário digita no campo CEP
  async function handleCepChange(e) {
    const cep = e.target.value.replace(/\D/g, ""); // mantém só números
    form.setFieldValue(["endereco", "cep"], cep);

    if (cep.length === 8) {
      setCarregando(true);
      try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

        if (!resposta.ok) {
          throw new Error("Erro na comunicação com o ViaCEP");
        }

        const dados = await resposta.json();

        if (dados.erro) {
          throw new Error("CEP não encontrado.");
        }

        // Atualiza o formulário com os dados vindos do ViaCEP
        form.setFieldsValue({
          endereco: {
            cep: dados.cep?.replace("-", ""),
            logradouro: dados.logradouro,
            bairro: dados.bairro,
            cidade: dados.localidade,
            uf: dados.uf,
            regiao: obterRegiaoPorUF(dados.uf),
          },
        });

        message.success("Endereço localizado com sucesso!");
      } catch (erro) {
        console.error("Erro ao buscar CEP:", erro);
        message.error("CEP inválido ou não encontrado.");
      } finally {
        setCarregando(false);
      }
    }
  }

  // Função auxiliar: obtém a região a partir da UF
  function obterRegiaoPorUF(uf) {
    const mapa = {
      AC: "Norte",
      AL: "Nordeste",
      AM: "Norte",
      AP: "Norte",
      BA: "Nordeste",
      CE: "Nordeste",
      DF: "Centro-Oeste",
      ES: "Sudeste",
      GO: "Centro-Oeste",
      MA: "Nordeste",
      MT: "Centro-Oeste",
      MS: "Centro-Oeste",
      MG: "Sudeste",
      PA: "Norte",
      PB: "Nordeste",
      PR: "Sul",
      PE: "Nordeste",
      PI: "Nordeste",
      RJ: "Sudeste",
      RN: "Nordeste",
      RS: "Sul",
      RO: "Norte",
      RR: "Norte",
      SC: "Sul",
      SE: "Nordeste",
      SP: "Sudeste",
      TO: "Norte",
    };
    return mapa[uf] || "";
  }

  return (
    <>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            label="CEP"
            name={["endereco", "cep"]}
            rules={[
              { required: true, message: "Informe o CEP!" },
              {
                pattern: /^[0-9]{8}$/,
                message: "O CEP deve conter 8 números sem traço.",
              },
            ]}
          >
            <Input
              placeholder="Somente números"
              maxLength={8}
              onChange={handleCepChange}
            />
          </Form.Item>
        </Col>
        <Col span={4} style={{ display: "flex", alignItems: "center" }}>
          {carregando && <Spin size="small" />}
        </Col>
      </Row>

      <Form.Item
        label="Logradouro"
        name={["endereco", "logradouro"]}
        rules={[{ required: true, message: "Informe o logradouro!" }]}
      >
        <Input placeholder="Rua / Avenida" />
      </Form.Item>

      <Form.Item
        label="Bairro"
        name={["endereco", "bairro"]}
        rules={[{ required: true, message: "Informe o bairro!" }]}
      >
        <Input placeholder="Bairro" />
      </Form.Item>

      <Row gutter={8}>
        <Col span={10}>
          <Form.Item
            label="Cidade"
            name={["endereco", "cidade"]}
            rules={[{ required: true, message: "Informe a cidade!" }]}
          >
            <Input placeholder="Cidade" />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            label="UF"
            name={["endereco", "uf"]}
            rules={[{ required: true, message: "Informe a UF!" }]}
          >
            <Input placeholder="UF" maxLength={2} />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            label="Região"
            name={["endereco", "regiao"]}
            rules={[{ required: true, message: "Selecione a região!" }]}
          >
            <Select placeholder="Selecione">
              <Option value="Norte">Norte</Option>
              <Option value="Nordeste">Nordeste</Option>
              <Option value="Centro-Oeste">Centro-Oeste</Option>
              <Option value="Sudeste">Sudeste</Option>
              <Option value="Sul">Sul</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
export default EnderecoForm;
