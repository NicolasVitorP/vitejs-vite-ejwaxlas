// PFDAO.mjs
export default class PFDAO {
    constructor(storageKey = "pessoasPF") {
      this.storageKey = storageKey;
    }
  
    salvar(pf) {
      const lista = this.listar();
  
      // === Endereço ===
      const end = pf.getEndereco();
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
      const telefones = (pf.getTelefones() || []).map((f) => ({
        ddd: f.getDdd(),
        numero: f.getNumero(),
      }));
  
      // === Título Eleitoral ===
      const titulo = pf.getTitulo()
        ? {
            numero: pf.getTitulo().getNumero(),
            zona: pf.getTitulo().getZona(),
            secao: pf.getTitulo().getSecao(),
          }
        : null;
  
      // === Objeto final serializável ===
      const obj = {
        nome: pf.getNome(),
        email: pf.getEmail(),
        cpf: pf.getCPF(),
        endereco: objEndereco,
        telefones,
        titulo,
      };
  
      lista.push(obj);
      localStorage.setItem(this.storageKey, JSON.stringify(lista));
      return obj;
    }
  
    listar() {
      const dados = localStorage.getItem(this.storageKey);
      return dados ? JSON.parse(dados) : [];
    }
  
    excluir(cpf) {
      const lista = this.listar().filter((p) => p.cpf !== cpf);
      localStorage.setItem(this.storageKey, JSON.stringify(lista));
    }
  
    limpar() {
      localStorage.removeItem(this.storageKey);
    }
  }
  