export default class Titulo {
    #numero;
    #zona;
    #secao;
    #pf;
  
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
  
    setZona(zona) {
      if (zona) {
        this.#zona = zona;
        return true;
      }
      return false;
    }
  
    getZona() {
      return this.#zona;
    }
  
    setSecao(secao) {
      if (secao) {
        this.#secao = secao;
        return true;
      }
      return false;
    }
  
    getSecao() {
      return this.#secao;
    }
  
    setPF(pf) {
      if (pf) {
        this.#pf = pf;
        return true;
      }
      return false;
    }
  
    getPF() {
      return this.#pf;
    }
  }