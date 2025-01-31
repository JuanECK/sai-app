import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './business/dashboard/dashboard.component';
import { LoginComponent } from './business/authentication/login/login.component';
import { LoginGuardianService } from './core/guadrian/login-guardian.service';
import { Error404Component } from './shared/error404/error404/error404.component';
import { MovimientosComponent } from './business/movimientos/movimientos.component';

export const routes: Routes = [
    {   path:'', component: LayoutComponent, canActivate: [LoginGuardianService],
        children: [
            { path:'dashboard',component: DashboardComponent, canActivate: [LoginGuardianService], },
            { path:'', redirectTo: 'dashboard', pathMatch: 'full' },
            { path:'movimientos', component:MovimientosComponent, canActivate: [LoginGuardianService],},
        ]
    },
    {
        path:'login',
        component: LoginComponent,
    },
    {
        path:'**',
        component: Error404Component
    },
    
    // {   path:'**',
    //     redirectTo: 'dashboard',
    //     pathMatch: 'full'
    // }
];
