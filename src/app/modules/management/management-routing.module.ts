import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'customer'
  },
  {
    path: 'customer',
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
    data: {
      title: 'Customers'
    }
  },
  {
    path: 'task',
    loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
    data: {
      title: 'Tasks'
    }
  }
  
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
