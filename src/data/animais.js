import { responsaveisMock } from './responsaveis'

// Dados de exemplo — depois isso vem da API Laravel.
// Aqui os animais são derivados dos responsáveis, para os dois cadastros ficarem sempre consistentes.
// Na API, cada animal já vem com o responsável aninhado (como montado abaixo).
const codigos = { 101: 7547467, 102: 7547512, 103: 7547530, 104: 7547531, 105: 7547588 }

export const animaisMock = responsaveisMock.flatMap((r) =>
  r.animais.map((a) => ({
    ...a,
    codigo: codigos[a.id],
    criadoEm: r.criadoEm,
    responsavel: {
      id: r.id,
      nome: r.nome,
      documento: r.documento,
      celular: r.celular,
      telefone: r.telefone,
    },
  })),
)