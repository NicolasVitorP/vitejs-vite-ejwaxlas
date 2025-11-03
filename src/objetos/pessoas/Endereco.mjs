export default class Endereco {
    #cep;
    #logradouro;
    #bairro;
    #cidade;
    #uf;
    #regiao;
    #pessoas = [];
  
    addPessoa(pessoa) {
      if (pessoa) {
        this.#pessoas.push(pessoa);
        return true;
      }
      return false;
    }
  
    getPessoas() {
      return this.#pessoas;
    }
  
    setCep(cep) {
      if (cep) {
        this.#cep = cep;
        return true;
      }
      return false;
    }
  
    getCep() {
      return this.#cep;
    }
  
    setLogradouro(logradouro) {
      if (logradouro) {
        this.#logradouro = logradouro;
        return true;
      }
      return false;
    }
  
    getLogradouro() {
      return this.#logradouro;
    }
  
    setBairro(bairro) {
      if (bairro) {
        this.#bairro = bairro;
        return true;
      }
      return false;
    }
  
    getBairro() {
      return this.#bairro;
    }
  
    setCidade(cidade) {
      if (cidade) {
        this.#cidade = cidade;
        return true;
      }
      return false;
    }
  
    getCidade() {
      return this.#cidade;
    }
  
    setUf(uf) {
      if (uf) {
        this.#uf = uf;
        return true;
      }
      return false;
    }
  
    getUf() {
      return this.#uf;
    }
  
    setRegiao(regiao) {
      if (regiao) {
        this.#regiao = regiao;
        return true;
      }
      return false;
    }
  
    getRegiao() {
      return this.#regiao;
    }
  }