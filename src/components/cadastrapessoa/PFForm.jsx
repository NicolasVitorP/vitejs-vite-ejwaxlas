import React from 'react';
import { Form, Input, DatePicker, message } from "antd";
function PFForm() {

  return (
    <>
      {/* <Form.Item
          label="CPF"
          name="cpf"
          rules={[{ required: true, message: "Informe o CPF!" }]}
        >
          <Input placeholder="Somente números" maxLength={11} />
    </Form.Item> */}

      {/* Campo de Data de Nascimento */}
      <Form.Item
        label="Data de Nascimento"
        name="dataNascimento"
        rules={[
          { required: true, message: "Informe a data de nascimento!" },
        ]}
      >
        <DatePicker
          format="DD/MM/YYYY"
          style={{ width: "100%" }}
          placeholder="Selecione a data de nascimento"
        />
      </Form.Item>

      <Form.Item label="Título Eleitoral - Número" name={["titulo", "numero"]}>
        <Input placeholder="Número do título" />
      </Form.Item>
      <Form.Item label="Zona" name={["titulo", "zona"]}>
        <Input placeholder="Zona eleitoral" />
      </Form.Item>
      <Form.Item label="Seção" name={["titulo", "secao"]}>
        <Input placeholder="Seção eleitoral" />
      </Form.Item>
    </>
  );

}
export default PFForm;