// ---------- datas ----------
// Trabalhamos com datas "YYYY-MM-DD" como texto, para evitar o bug de fuso horário do new Date('2026-09-06').
const pad = (n) => String(n).padStart(2, '0')

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

export function hojeISO() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// somarDias('2026-10-15', -3) -> '2026-10-12'
export function somarDias(iso, dias) {
  const [a, m, d] = iso.split('-').map(Number)
  const dt = new Date(a, m - 1, d + dias)
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`
}

// '2026-09-06' -> '06/09/2026'
export function formatData(iso) {
  if (!iso) return ''
  const [a, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${a}`
}

// '2026-09-06' -> { dia: '06', mes: 'SET', ano: '2026' }
export function partesData(iso) {
  const [a, m, d] = iso.slice(0, 10).split('-')
  return { dia: d, mes: MESES[Number(m) - 1].slice(0, 3).toUpperCase(), ano: a }
}

// '2026-09-03T18:41:00' -> '03 de setembro de 2026 às 18:41'
export function formatDataHoraExtenso(iso) {
  const dt = new Date(iso)
  return `${pad(dt.getDate())} de ${MESES[dt.getMonth()]} de ${dt.getFullYear()} às ${pad(dt.getHours())}:${pad(dt.getMinutes())}`
}

// ---------- status da vacina ----------
// O status é calculado a partir das datas (não é guardado):
//   aplicada   -> tem data de aplicação
//   atrasada   -> não aplicada e a data programada já passou
//   programada -> não aplicada e a data programada ainda não chegou
export function statusDe(vacina, hoje = hojeISO()) {
  if (vacina.aplicadaEm) return 'aplicada'
  return vacina.programadaPara < hoje ? 'atrasada' : 'programada'
}

// Cores de cada status (menta = sucesso, rose = atenção, azul bebê = futuro)
export const STATUS = {
  aplicada: {
    label: 'Aplicada',
    plural: 'Aplicadas',
    pill: 'bg-mint-100 text-mint-700',
    texto: 'text-mint-700',
    icone: 'text-mint-600',
    fundo: 'bg-mint-100',
    cardAtivo: 'border-mint-300 bg-mint-50',
  },
  atrasada: {
    label: 'Atrasada',
    plural: 'Atrasadas',
    pill: 'bg-rose-100 text-rose-600',
    texto: 'text-rose-600',
    icone: 'text-rose-500',
    fundo: 'bg-rose-100',
    cardAtivo: 'border-rose-300 bg-rose-50',
  },
  programada: {
    label: 'Programada',
    plural: 'Programadas',
    pill: 'bg-brand-100 text-brand-700',
    texto: 'text-brand-700',
    icone: 'text-brand-600',
    fundo: 'bg-brand-100',
    cardAtivo: 'border-brand-300 bg-brand-50',
  },
}