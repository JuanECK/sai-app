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
import { InversionComponent } from './business/movimientos/inversion/inversion.component';
import { isModAuthGuard } from './core/guadrian/is-mod-auth.guard';
import { isNavHeadNoActiveGuard } from './core/guadrian/is-nav-head-no-active.guard';
import { ComisionistasComponent } from './business/clientes/comisionistas/comisionistas.component';
import { InversionistaComponent } from './business/clientes/inversionista/inversionista.component';
import { ProveedoresComponent } from './business/clientes/proveedores/proveedores.component';
import { PublicoComponent } from './business/clientes/publico/publico.component';
import { CuentasComponent } from './business/cuentas/cuentas.component';
import { NoReconocidosComponent } from './business/no-reconocidos/no-reconocidos.component';
import { ProveedorComponent } from './business/movimientos/proveedor/proveedor.component';
import { OficinaComponent } from './business/movimientos/oficina/oficina.component';
import { InmobiliarioComponent } from './business/movimientos/inmobiliario/inmobiliario.component';
import { FacturasComponent } from './business/movimientos/facturas/facturas.component';
import { PresupuestoComponent } from './business/movimientos/presupuesto/presupuesto.component';
import { PrestamosComponent } from './business/movimientos/prestamos/prestamos.component';
import { ComisionesComponent } from './business/movimientos/comisiones/comisiones.component';
import { DivisasComponent } from './business/movimientos/divisas/divisas.component';
import { EliminadosComponent } from './business/movimientos/eliminados/eliminados.component';
import { FinanciamientoComponent } from './business/financiamiento/financiamiento.component';
import { ReportesComponent } from './business/reportes/reportes.component';


export const routes: Routes = [

    {    path:'', component: LayoutComponent, canActivate: [LoginGuardianService] ,
        children: [
            { path:'', redirectTo: 'Inicio', pathMatch: 'full' },
            // { path: componente.inicio, component: componente.componentes ,canActivate: [LoginGuardianService]},
            { path:'Inicio',component: DashboardComponent, canActivate: [PerfilGuard], },
            { path:'sai',component: SaiComponent, canActivate: [PerfilSAIGuard]},
            { path:'Movimientos', component:InversionComponent, canActivate: [isNavHeadNoActiveGuard]},
            { path:'Clientes', component:InversionComponent, canActivate: [isNavHeadNoActiveGuard]},
            { path:'Contratos', component:InversionComponent, canActivate: [isNavHeadNoActiveGuard]},
            { path:'Movimientos/Inversión', component:InversionComponent, canActivate: [isModAuthGuard], data:{roles:['Movimientos']}},
            { path:'Movimientos/Proveedor', component:ProveedorComponent, canActivate: [isModAuthGuard], data:{roles:['Movimientos']}},
            { path:'Movimientos/Oficina', component:OficinaComponent, canActivate: [isModAuthGuard], data:{roles:['Movimientos']}},
            { path:'Movimientos/Inmobiliario', component:InmobiliarioComponent, canActivate: [isModAuthGuard], data:{roles:['Movimientos']}},
            { path:'Movimientos/Facturación', component:FacturasComponent, canActivate: [isModAuthGuard], data:{roles:['Movimientos']}},
            { path:'Movimientos/Presupuesto', component:PresupuestoComponent, canActivate: [isModAuthGuard], data:{roles:['Movimientos']}},
            { path:'Movimientos/Préstamos', component:PrestamosComponent, canActivate: [isModAuthGuard], data:{roles:['Movimientos']}},
            { path:'Movimientos/Comisión', component:ComisionesComponent, canActivate: [isModAuthGuard], data:{roles:['Movimientos']}},
            { path:'Movimientos/Comisión', component:ComisionesComponent, canActivate: [isModAuthGuard], data:{roles:['Movimientos']}},
            { path:'Movimientos/Divisas', component:DivisasComponent, canActivate: [isModAuthGuard], data:{roles:['Movimientos']}},
            { path:'Movimientos/Eliminados', component:EliminadosComponent, canActivate: [isModAuthGuard], data:{roles:['Movimientos']}},
            { path:'Clientes/Público', component:PublicoComponent, canActivate: [isModAuthGuard],data:{roles:['Clientes']}},
            { path:'Clientes/Proveedores', component:ProveedoresComponent, canActivate: [isModAuthGuard],data:{roles:['Clientes']}},
            { path:'Clientes/Comisionistas', component:ComisionistasComponent, canActivate: [isModAuthGuard],data:{roles:['Clientes']}},
            { path:'Clientes/Inversionistas', component:InversionistaComponent, canActivate: [isModAuthGuard],data:{roles:['Clientes']}},
            { path:'Cuentas', component:CuentasComponent, canActivate: [isModAuthGuard],data:{roles:['Cuentas']}},
            { path:'Reportes', component:ReportesComponent, canActivate: [isNavHeadNoActiveGuard]},
            { path:'Reportes/Individuales', component:ReportesComponent, canActivate: [isModAuthGuard],data:{roles:['Reportes']}},
            { path:'No reconocidos', component:NoReconocidosComponent, canActivate: [isModAuthGuard],data:{roles:['No reconocidos']}},
            { path:'Financiamiento', component:FinanciamientoComponent, canActivate: [isModAuthGuard],data:{roles:['Financiamiento']}},
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

