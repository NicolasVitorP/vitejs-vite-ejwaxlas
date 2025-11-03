// PJDAO.mjs
export default class PJDAO {
    constructor(storageKey = "pessoasPJ") {
      this.storageKey = storageKey;
    }
  
    salvar(pj) {
      const lista = this.listar();
  
      // === Endereço ===
      const end = pj.getEndereco();
      const objEndereco = end
        ? {
            cep: end.getCep(),
            logradouro: end.getLogradouro(),
            bairro: end.getBairro(),
            cidade: end.getCidade(),
            uf: end.getUf(),
            regiao: end.getRegiao(),
          }
        : null;
  
      // === Telefones ===
      const telefones = (pj.getTelefones() || []).map((f) => ({
        ddd: f.getDdd(),
        numero: f.getNumero(),
      }));
  
      // === Inscrição Estadual ===
      const ie = pj.getIE()
        ? {
            numero: pj.getIE().getNumero(),
            estado: pj.getIE().getEstado(),
            dataRegistro: pj.getIE().getDataRegistro(),
          }
        : null;
  
      // === Objeto final serializável ===
      const obj = {
        nome: pj.getNome(),
        email: pj.getEmail(),
        cnpj: pj.getCNPJ(),
        endereco: objEndereco,
        telefones,
        ie,
      };
  
      lista.push(obj);
      localStorage.setItem(this.storageKey, JSON.stringify(lista));
      return obj;
    }
  
    listar() {
      const dados = localStorage.getItem(this.storageKey);
      return dados ? JSON.parse(dados) : [];
    }
  
    excluir(cnpj) {
      const lista = this.listar().filter((p) => p.cnpj !== cnpj);
      localStorage.setItem(this.storageKey, JSON.stringify(lista));
    }
  
    limpar() {
      localStorage.removeItem(this.storageKey);
    }
  }
  