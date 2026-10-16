import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import PlaceholderView from '@/views/PlaceholderView.vue'

export const menu = [
  { path: '/', name: 'inicio', label: 'Início', icon: 'House' },
  { path: '/painel', name: 'painel', label: 'Painel de Controle', icon: 'LayoutDashboard', pro: true },
  { path: '/responsaveis', name: 'responsaveis', label: 'Responsáveis', icon: 'Users' },
  { path: '/animais', name: 'animais', label: 'Animais', icon: 'PawPrint' },
  { path: '/historico', name: 'historico', label: 'Histórico', icon: 'History' },
  { path: '/retornos', name: 'retornos', label: 'Retornos', icon: 'CalendarClock' },
  { path: '/agenda', name: 'agenda', label: 'Agenda', icon: 'CalendarDays', pro: true },
  { path: '/internacao', name: 'internacao', label: 'Internação', icon: 'BedDouble', pro: true },
  { path: '/modelos', name: 'modelos', label: 'Modelos Personalizados', icon: 'FileText', pro: true },
  { path: '/vacinas', name: 'vacinas', label: 'Vacinas', icon: 'Syringe' },
  { path: '/protocolos', name: 'protocolos', label: 'Protocolos de Vacinas', icon: 'ClipboardList', pro: true },
  { path: '/insumos', name: 'insumos', label: 'Insumos', icon: 'FlaskConical', pro: true },
  { path: '/servicos', name: 'servicos', label: 'Serviços', icon: 'BriefcaseMedical', pro: true },
  { path: '/financeiro', name: 'financeiro', label: 'Financeiro', icon: 'DollarSign', pro: true },
  { path: '/ajuda', name: 'ajuda', label: 'Ajuda', icon: 'CircleHelp', submenu: true },
]

const views = {
  '/responsaveis': () => import('@/views/ResponsaveisView.vue'),
  '/animais': () => import('@/views/AnimaisView.vue'),
  '/vacinas': () => import('@/views/VacinasView.vue'),
  '/retornos': () => import('@/views/RetornosView.vue'),
}

const routes = [
  { path: '/', name: 'inicio', component: DashboardView, meta: { title: 'Início' } },
  ...menu
    .filter((m) => m.path !== '/')
    .map((m) => ({
      path: m.path,
      name: m.name,
      component: views[m.path] ?? PlaceholderView,
      meta: { title: m.label },
    })),
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
