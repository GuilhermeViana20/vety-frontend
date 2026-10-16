import { animaisMock } from './animais'
import { hojeISO, somarDias } from '@/utils/vacinas'

// Dados de exemplo — depois isso vem da API Laravel.
// As datas são relativas a "hoje", assim a demonstração sempre mostra vacinas
// aplicadas, atrasadas e programadas (o status é calculado pelas datas).
const hoje = hojeISO()
const dia = (n) => somarDias(hoje, n)

// Monta o animal "resumido" que a API devolveria junto com cada vacina
function animal(id) {
  const a = animaisMock.find((x) => x.id === id)
  return {
    id: a.id,
    nome: a.nome,
    codigo: a.codigo,
    especie: a.especie,
    foto: a.foto,
    responsavel: { nome: a.responsavel.nome },
  }
}

const REGISTRADOR = 'Micaella da Cruz dos Santos'
const registro = (n) => `${dia(n)}T18:41:00`

const V8 = 'V8 - Vanguard HTLP 5 CV-L, ampola'
const V10 = 'V10 - Vanguard HTLP 5 CV-L, ampola'
const RAIVA = 'Antirrábica - Defensor, dose única'

export const vacinasMock = [
  // Mel — esquema V8 em 3 doses (3ª atrasada)
  { id: 1, animal: animal(101), vacina: V8, dose: 1, totalDoses: 3, programadaPara: dia(-64), aplicadaEm: dia(-64),
    lembrete: false, lote: 'VG2406', fabricante: 'Zoetis', via: 'Subcutânea', aplicadoPor: 'Dra. Micaella', observacoes: '',
    registradoPor: REGISTRADOR, registradoEm: registro(-64) },
  { id: 2, animal: animal(101), vacina: V8, dose: 2, totalDoses: 3, programadaPara: dia(-43), aplicadaEm: dia(-43),
    lembrete: false, lote: 'VG2406', fabricante: 'Zoetis', via: 'Subcutânea', aplicadoPor: 'Dra. Micaella', observacoes: 'Sem reações.',
    registradoPor: REGISTRADOR, registradoEm: registro(-64) },
  { id: 3, animal: animal(101), vacina: V8, dose: 3, totalDoses: 3, programadaPara: dia(-22), aplicadaEm: null,
    lembrete: false, lote: '', fabricante: 'Zoetis', via: 'Subcutânea', aplicadoPor: '', observacoes: '',
    registradoPor: REGISTRADOR, registradoEm: registro(-64) },

  // Thor
  { id: 4, animal: animal(102), vacina: RAIVA, dose: 1, totalDoses: 1, programadaPara: dia(-30), aplicadaEm: dia(-30),
    lembrete: false, lote: 'AR1188', fabricante: 'Zoetis', via: 'Subcutânea', aplicadoPor: 'Dra. Micaella', observacoes: '',
    registradoPor: REGISTRADOR, registradoEm: registro(-30) },
  { id: 5, animal: animal(102), vacina: 'Gripe canina - Nobivac KC', dose: 1, totalDoses: 1, programadaPara: dia(3), aplicadaEm: null,
    lembrete: false, lote: '', fabricante: 'MSD', via: 'Intranasal', aplicadoPor: '', observacoes: '',
    registradoPor: REGISTRADOR, registradoEm: registro(-1) },

  // Luna — programada para o mesmo dia do Thor (dois animais na mesma data)
  { id: 6, animal: animal(103), vacina: 'V4 felina - Felocell 4', dose: 2, totalDoses: 3, programadaPara: dia(3), aplicadaEm: null,
    lembrete: true, lote: '', fabricante: 'Zoetis', via: 'Subcutânea', aplicadoPor: '', observacoes: '',
    registradoPor: REGISTRADOR, registradoEm: registro(-12) },

  // Tico — atrasada
  { id: 7, animal: animal(104), vacina: RAIVA, dose: 1, totalDoses: 1, programadaPara: dia(-5), aplicadaEm: null,
    lembrete: false, lote: '', fabricante: 'Zoetis', via: 'Subcutânea', aplicadoPor: '', observacoes: '',
    registradoPor: REGISTRADOR, registradoEm: registro(-20) },

  // Bob — dois registros no mesmo dia
  { id: 8, animal: animal(105), vacina: V10, dose: 3, totalDoses: 3, programadaPara: dia(-2), aplicadaEm: dia(-2),
    lembrete: false, lote: 'VG2511', fabricante: 'Zoetis', via: 'Subcutânea', aplicadoPor: 'Dra. Micaella', observacoes: '',
    registradoPor: REGISTRADOR, registradoEm: registro(-2) },
  { id: 9, animal: animal(105), vacina: 'Giárdia - GiardiaVax', dose: 1, totalDoses: 2, programadaPara: dia(-2), aplicadaEm: dia(-2),
    lembrete: false, lote: 'GV0932', fabricante: 'Zoetis', via: 'Subcutânea', aplicadoPor: 'Dra. Micaella', observacoes: 'Retorno em 21 dias.',
    registradoPor: REGISTRADOR, registradoEm: registro(-2) },
]