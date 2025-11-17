import PF from "../pessoas/PF.mjs";

export default class PFDAO {
  constructor(id = null) {
    this.baseUrl = "https://backend-pessoas.vercel.app/pf";
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
      if (!resp.ok) throw new Error("Erro ao listar PFs");

      const data = await resp.json();

      this.cache = data.map((pf) => this.mapPF(pf));
    } catch (e) {
      console.error("Erro ao carregar lista PF:", e);
      this.cache = [];
    }
  }

  listar() {
    return this.cache;
  }

  async salvar(pf) {
    try {
      const obj = this.toPlain(pf);
      delete obj.id;

      const resp = await fetch(this.baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });

      if (!resp.ok) throw new Error("Erro ao salvar PF");

      const data = await resp.json();
      const novo = this.mapPF(data);

      this.cache.push(novo);

      return novo;
    } catch (e) {
      console.error("Erro ao salvar PF:", e);
      return null;
    }
  }

  async atualizar(id, novoPF) {
    try {
      const obj = this.toPlain(novoPF);
      delete obj.id;

      const resp = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });

      if (!resp.ok) throw new Error("Erro ao atualizar PF");

      const data = await resp.json();
      const atualizado = this.mapPF(data);

      const idx = this.cache.findIndex((p) => p.id === id);
      if (idx >= 0) this.cache[idx] = atualizado;

      return atualizado;
    } catch (e) {
      console.error("Erro ao atualizar PF:", e);
      return null;
    }
  }

  async excluir(id) {
    try {
      const resp = await fetch(`${this.baseUrl}/${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error("Erro ao excluir PF");

      this.cache = this.cache.filter((p) => p.id !== id);
    } catch (e) {
      console.error("Erro ao excluir PF:", e);
    }
  }

  mapPF(pf) {
    return {
      id: pf._id,
      nome: pf.nome,
      email: pf.email,
      cpf: pf.cpf,

      // ✔️ se backend retornar null/undefined/vazio, não quebra
      dataNascimento: pf.dataNascimento ?? null,

      endereco: pf.endereco
        ? {
            cep: pf.endereco.cep,
            logradouro: pf.endereco.logradouro,
            bairro: pf.endereco.bairro,
            cidade: pf.endereco.cidade,
            uf: pf.endereco.uf,
            regiao: pf.endereco.regiao,
          }
        : {},

      telefones: (pf.telefones || []).map((t) => ({
        ddd: t.ddd,
        numero: t.numero,
      })),
    };
  }

  toPlain(pf) {
    if (!pf) return {};

    const end = pf.getEndereco?.();
    const telefones = pf.getTelefones?.() || [];

    return {
      nome: pf.getNome?.(),
      email: pf.getEmail?.(),
      cpf: pf.getCPF?.(),

      dataNascimento: pf.getDataNascimento?.() || null,

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
    };
  }

  async buscarPorId(id) {
    const existente = this.cache.find((p) => p.id === id);
    if (existente) return existente;

    try {
      const resp = await fetch(`${this.baseUrl}/${id}`);
      if (!resp.ok) throw new Error("Erro ao buscar PF por ID");

      const data = await resp.json();
      const pessoa = this.mapPF(data);

      this.cache.push(pessoa);

      return pessoa;
    } catch (e) {
      console.error("Erro ao buscar PF por ID:", e);
      return null;
    }
  }
}