import React, { useState, useEffect } from "react";
import { Button, Form, Input, Space, List } from "antd";

function TelefoneList(props) {
  const form = props.form;
  const [telefones, setTelefones] = useState([]);
  const [ddd, setDdd] = useState("");
  const [numero, setNumero] = useState("");

  // sincroniza o estado local com o Form do AntD
  useEffect(() => {
    form.setFieldValue("telefones", telefones);
  }, [telefones, form]);

  function adicionarTelefone() {
    if (ddd && numero) {
      const novo = { ddd, numero };
      setTelefones((prev) => [...prev, novo]);
      setDdd("");
      setNumero("");
    }
  }

  function removerTelefone(index) {
    const novos = telefones.filter((_, i) => i !== index);
    setTelefones(novos);
  }

  return (
    <>
      {/* Campo oculto registrado no Form */}
      <Form.Item name="telefones" noStyle>
        <input type="hidden" />
      </Form.Item>

      <Space align="baseline">
        <Form.Item label="DDD">
          <Input
            value={ddd}
            onChange={(e) => setDdd(e.target.value)}
            maxLength={2}
            style={{ width: 60 }}
          />
        </Form.Item>
        <Form.Item label="Número">
          <Input
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            maxLength={9}
            style={{ width: 150 }}
          />
        </Form.Item>
        <Button onClick={adicionarTelefone} type="primary">
          Adicionar
        </Button>
      </Space>

      <List
        size="small"
        bordered
        dataSource={telefones}
        renderItem={(t, index) => (
          <List.Item
            key={index}
            actions={[
              <a key="delete" onClick={() => removerTelefone(index)}>
                Remover
              </a>,
            ]}
          >
            ({t.ddd}) {t.numero}
          </List.Item>
        )}
        style={{ marginTop: 10 }}
      />
    </>
  );
}

export default TelefoneList;
