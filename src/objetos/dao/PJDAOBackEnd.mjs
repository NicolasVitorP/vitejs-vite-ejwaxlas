import PJ from "../pessoas/PJ.mjs";

export default class PJDAO {
  constructor(id = null) {
    this.baseUrl = "https://backend-pessoas.vercel.app/pj";
    this.cache = [];

    if (id) {
      this.cache = [];
      this.buscarPorId(id).then((pessoa) => {
        if (pessoa) this.cache = [pessoa];
      });
    } else {
      this.carregarLista();
    }
  }

  async carregarLista() {
    try {
      const resp = await fetch(this.baseUrl);
      if (!resp.ok) throw new Error("Erro ao listar PJs");

      const data = await resp.json();

      this.cache = data.map((pj) => this.mapPJ(pj));
    } catch (e) {
      console.error("Erro ao carregar lista PJ:", e);
      this.cache = [];
    }
  }

  listar() {
    return this.cache;
  }

  async salvar(pj) {
    try {
      const obj = this.toPlain(pj);
      delete obj.id;

      const resp = await fetch(this.baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });

      if (!resp.ok) throw new Error("Erro ao salvar PJ");

      const data = await resp.json();
      const novo = this.mapPJ(data);

      this.cache.push(novo);

      return novo;
    } catch (e) {
      console.error("Erro ao salvar PJ:", e);
      return null;
    }
  }

  async atualizar(id, novoPJ) {
    try {
      const obj = this.toPlain(novoPJ);
      delete obj.id;

      const resp = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });

      if (!resp.ok) throw new Error("Erro ao atualizar PJ");

      const data = await resp.json();
      const atualizado = this.mapPJ(data);

      const idx = this.cache.findIndex((p) => p.id === id);
      if (idx >= 0) this.cache[idx] = atualizado;

      return atualizado;
    } catch (e) {
      console.error("Erro ao atualizar PJ:", e);
      return null;
    }
  }

  async excluir(id) {
    try {
      const resp = await fetch(`${this.baseUrl}/${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error("Erro ao excluir PJ");

      this.cache = this.cache.filter((p) => p.id !== id);
    } catch (e) {
      console.error("Erro ao excluir PJ:", e);
    }
  }

  mapPJ(pj) {
    const ieData = pj.ie && typeof pj.ie === "object" ? pj.ie.dataRegistro : null;

    return {
      id: pj._id,
      nome: pj.nome,
      email: pj.email,
      cnpj: pj.cnpj,

      // ✔️ seguro mesmo se o backend retornar null
      dataRegistro: ieData ? ieData : null,

      endereco: pj.endereco
        ? {
            cep: pj.endereco.cep,
            logradouro: pj.endereco.logradouro,
            bairro: pj.endereco.bairro,
            cidade: pj.endereco.cidade,
            uf: pj.endereco.uf,
            regiao: pj.endereco.regiao,
          }
        : {},

      telefones: (pj.telefones || []).map((t) => ({
        ddd: t.ddd,
        numero: t.numero,
      })),

      ie: pj.ie && typeof pj.ie === "object"
        ? {
            numero: pj.ie.numero,
            estado: pj.ie.estado,
            dataRegistro: pj.ie.dataRegistro,
          }
        : {},
    };
  }

  toPlain(pj) {
    if (!pj) return {};

    const end = pj.getEndereco?.();
    const ie = pj.getIE?.();
    const telefones = pj.getTelefones?.() || [];

    return {
      nome: pj.getNome?.(),
      email: pj.getEmail?.(),
      cnpj: pj.getCNPJ?.(),

      endereco: end
        ? {
            cep: end.getCep?.(),
            logradouro: end.getLogradouro?.(),
            bairro: end.getBairro?.(),
            cidade: end.getCidade?.(),
            uf: end.getUf?.(),
            regiao: end.getRegiao?.(),
          }
        : {},

      telefones: telefones.map((t) => ({
        ddd: t.getDdd?.(),
        numero: t.getNumero?.(),
      })),

      ie: ie
        ? {
            numero: ie.getNumero?.(),
            estado: ie.getEstado?.(),
            dataRegistro: ie.getDataRegistro?.(),
          }
        : {}
    };
  }

  async buscarPorId(id) {
    const existente = this.cache.find((p) => p.id === id);
    if (existente) return existente;

    try {
      const resp = await fetch(`${this.baseUrl}/${id}`);
      if (!resp.ok) throw new Error("Erro ao buscar PJ por ID");

      const data = await resp.json();
      const pessoa = this.mapPJ(data);

      this.cache.push(pessoa);

      return pessoa;
    } catch (e) {
      console.error("Erro ao buscar PJ por ID:", e);
      return null;
    }
  }
}