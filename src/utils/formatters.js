// Remove acentos e deixa minúsculo — útil para buscas ("joao" encontra "João")
export const normalize = (texto = '') =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

// "2026-05-10" -> "5 meses" | "3 anos e 2 meses"
export function formatIdade(nascimentoISO) {
  if (!nascimentoISO) return 'Não informada'

  const nasc = new Date(nascimentoISO)
  const hoje = new Date()

  let meses = (hoje.getFullYear() - nasc.getFullYear()) * 12 + (hoje.getMonth() - nasc.getMonth())
  if (hoje.getDate() < nasc.getDate()) meses -= 1

  if (meses < 1) return 'Menos de 1 mês'
  if (meses < 12) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`

  const anos = Math.floor(meses / 12)
  const resto = meses % 12
  const textoAnos = `${anos} ${anos === 1 ? 'ano' : 'anos'}`
  return resto ? `${textoAnos} e ${resto} ${resto === 1 ? 'mês' : 'meses'}` : textoAnos
}