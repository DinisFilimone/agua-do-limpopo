"use client";

type Comum = {
  id: string;
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  erro?: string;
};

const base =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy outline-none transition placeholder:text-navy/40 focus:ring-2 focus:ring-azul/30";
const classe = (erro?: string) => `${base} ${erro ? "border-red-400" : "border-navy/15 focus:border-azul"}`;

function Rotulo({ id, texto, opcional }: { id: string; texto: string; opcional?: boolean }) {
  return (
    <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy">
      {texto}
      {opcional && <span className="font-normal text-navy/50"> (opcional)</span>}
    </label>
  );
}

export function Campo(
  p: Comum & {
    tipo?: string;
    opcional?: boolean;
    area?: boolean;
    placeholder?: string;
    autoComplete?: string;
    inputMode?: "text" | "tel" | "email" | "numeric";
    lista?: string;
  }
) {
  return (
    <div>
      <Rotulo id={p.id} texto={p.rotulo} opcional={p.opcional} />
      {p.area ? (
        <textarea
          id={p.id}
          rows={4}
          value={p.valor}
          onChange={(e) => p.aoMudar(e.target.value)}
          placeholder={p.placeholder}
          aria-invalid={!!p.erro}
          className={classe(p.erro)}
        />
      ) : (
        <input
          id={p.id}
          type={p.tipo ?? "text"}
          value={p.valor}
          onChange={(e) => p.aoMudar(e.target.value)}
          placeholder={p.placeholder}
          autoComplete={p.autoComplete}
          inputMode={p.inputMode}
          list={p.lista}
          aria-invalid={!!p.erro}
          className={classe(p.erro)}
        />
      )}
      {p.erro && <p className="mt-1 text-xs text-red-600">{p.erro}</p>}
    </div>
  );
}

export function Seletor(p: Comum & { opcoes: { id: string; nome: string }[] }) {
  return (
    <div>
      <Rotulo id={p.id} texto={p.rotulo} />
      <select
        id={p.id}
        value={p.valor}
        onChange={(e) => p.aoMudar(e.target.value)}
        className={classe(p.erro)}
      >
        {p.opcoes.map((o) => (
          <option key={o.id} value={o.id}>
            {o.nome}
          </option>
        ))}
      </select>
    </div>
  );
}