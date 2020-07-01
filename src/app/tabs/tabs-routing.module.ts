import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
          path: '',
          loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
          }
        ]
      },
      {
        path: 'tab2',
        children: [
          {
          path: '',
          loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
          }
        ]
      },
      {
        path: 'tab3',
        children: [
          {
          path: '',
          loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
          }
        ]
      },
      {
        path: 'user',
        children: [
          {
          path: '',
          loadChildren: () => import('../user/user.module').then( m => m.UserPageModule)
          }
        ]
      },
      {
        path: 'store',
        children: [
          {
          path: '',
          loadChildren: () => import('../store/store.module').then( m => m.StorePageModule)
          }
        ]
      },
      {
        path: 'event',
        children: [
          {
          path: '',
          loadChildren: () => import('../event/event.module').then( m => m.EventPageModule)
          }
        ]
      },
      // {
      //   path: 'tab1',
      //   loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      // },
      // {
      //   path: 'tab2',
      //   loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      // },
      // {
      //   path: 'tab3',
      //   loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      // },
      // {
      //   path: 'user',
      //   loadChildren: () => import('../user/user.module').then( m => m.UserPageModule)
      // },
      // {
      //   path: 'store',
      //   loadChildren: () => import('../store/store.module').then( m => m.StorePageModule)
      // },
      // {
      //   path: 'event',
      //   loadChildren: () => import('../event/event.module').then( m => m.EventPageModule)
      // },
      {
        path: '',
        redirectTo: 'tabs/tabs/user',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/tabs/user',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
