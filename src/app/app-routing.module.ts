import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  {
    path: 'signup',
    loadChildren: './pages/signup/signup.module#SignupPageModule'
  },
  {
    path: 'reset-password',
    loadChildren:
      './pages/reset-password/reset-password.module#ResetPasswordPageModule'
  },
  {
    path: 'profile',
    loadChildren: './pages/profile/profile.module#ProfilePageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
