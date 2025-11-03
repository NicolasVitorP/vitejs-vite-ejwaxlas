export default class Telefone {
    #ddd;
    #numero;
    #pessoas = [];
  
    addPessoa(pessoa) {
      if (pessoa) {
        this.#pessoas.push(pessoa);
        return true;
      }
      return false;
    }
  
    setDdd(ddd) {
      if (ddd) {
        this.#ddd = ddd;
        return true;
      }
      return false;
    }
  
    getDdd() {
      return this.#ddd;
    }
  
    setNumero(numero) {
      if (numero) {
        this.#numero = numero;
        return true;
      }
      return false;
    }
  
    getNumero() {
      return this.#numero;
    }
  }