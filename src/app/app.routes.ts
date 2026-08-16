import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'postac/rasy' },
  {
    path: 'postac',
    loadComponent: () => import('./features/pages/section-page/section-page').then((m) => m.SectionPage),
  },
  {
    path: 'postac/:kategoria',
    loadComponent: () => import('./features/pages/section-page/section-page').then((m) => m.SectionPage),
  },
  {
    path: 'statystyki',
    loadComponent: () => import('./features/pages/section-page/section-page').then((m) => m.SectionPage),
  },
  {
    path: 'statystyki/:kategoria',
    loadComponent: () => import('./features/pages/section-page/section-page').then((m) => m.SectionPage),
  },
  {
    path: 'mechaniki',
    loadComponent: () => import('./features/pages/section-page/section-page').then((m) => m.SectionPage),
  },
  {
    path: 'mechaniki/:kategoria',
    loadComponent: () => import('./features/pages/section-page/section-page').then((m) => m.SectionPage),
  },
  {
    path: 'ekwipunek',
    loadComponent: () => import('./features/pages/section-page/section-page').then((m) => m.SectionPage),
  },
  {
    path: 'ekwipunek/:kategoria',
    loadComponent: () => import('./features/pages/section-page/section-page').then((m) => m.SectionPage),
  },
  {
    path: 'walka',
    loadComponent: () => import('./features/pages/section-page/section-page').then((m) => m.SectionPage),
  },
  {
    path: 'walka/:kategoria',
    loadComponent: () => import('./features/pages/section-page/section-page').then((m) => m.SectionPage),
  },
  {
    path: 'bestiariusz',
    loadComponent: () => import('./features/pages/section-page/section-page').then((m) => m.SectionPage),
  },
  {
    path: 'ulubione',
    loadComponent: () => import('./features/pages/ulubione/ulubione-page').then((m) => m.UlubionePage),
  },
  {
    path: 'szukaj',
    loadComponent: () => import('./features/pages/szukaj/szukaj-page').then((m) => m.SzukajPage),
  },
  {
    path: 'karta/:type/:id',
    loadComponent: () => import('./features/pages/karta/karta-page').then((m) => m.KartaPage),
  },
  { path: '**', redirectTo: 'postac/rasy' },
];
