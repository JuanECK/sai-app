import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './business/dashboard/dashboard.component';
import { LoginComponent } from './business/authentication/login/login.component';
import { LoginGuardianService } from './core/guadrian/login-guardian.service';
import { Error404Component } from './shared/error404/error404/error404.component';
import { SaiComponent } from './business/sai/sai.component';
import { PerfilGuard } from './core/guadrian/perfil.guard';
import { PerfilSAIGuard  } from './core/guadrian/perfilSAI.guard';
import { ModulAuthorized  } from './core/guadrian/isModuleAuthorized.guard';
import { BrkComponent } from './business/movimientos/brk/brk.component';
import { ClientesComponent } from './business/clientes/clientes/clientes.component';
import { isModAuthGuard } from './core/guadrian/is-mod-auth.guard';
import { isNavHeadNoActiveGuard } from './core/guadrian/is-nav-head-no-active.guard';



export const routes: Routes = [


    {    path:'', component: LayoutComponent, canActivate: [LoginGuardianService] ,
        children: [
            { path:'', redirectTo: 'Inicio', pathMatch: 'full' },
            // { path: componente.inicio, component: componente.componentes ,canActivate: [LoginGuardianService]},
            { path:'Inicio',component: DashboardComponent, canActivate: [PerfilGuard], },
            { path:'sai',component: SaiComponent, canActivate: [PerfilSAIGuard]},
            { path:'Movimientos', component:BrkComponent, canActivate: [isNavHeadNoActiveGuard]},
            { path:'Clientes', component:BrkComponent, canActivate: [isNavHeadNoActiveGuard]},
            { path:'Contratos', component:BrkComponent, canActivate: [isNavHeadNoActiveGuard]},
            { path:'Movimientos/BRK', component:BrkComponent, canActivate: [isModAuthGuard], data:{roles:['Movimientos']}},
            { path:'Clientes/Clientes', component:ClientesComponent, canActivate: [isModAuthGuard],data:{roles:['Clientes']}},
            // { path:'Clientes', component:ClientesComponent, canActivate: [ModulAuthorized],},
        ]
    },
    {
        path:'login',
        component: LoginComponent,
    },
    {
        path:'**',
        component: Error404Component ,
        // data: {roles:['sai']}
    },
    
    // {   path:'**',
    //     redirectTo: 'dashboard',
    //     pathMatch: 'full'
    // }
];

