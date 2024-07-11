import { Routes } from '@angular/router';
import { LandingComponent } from './components/core/landing/landing/landing.component';
import { EventsComponent } from './components/users/events/events/events.component';
import { SingleEventComponent } from './components/users/single-event/single-event/single-event.component';
import { ContactComponent } from './components/users/contact/contact/contact.component';
import { BaseComponent } from './components/users/base/base/base.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { AnalyticsComponent } from './components/admin/analytics/analytics/analytics.component';
import { LoginComponent } from './components/core/auth/login/login.component';
import { RegistrationComponent } from './components/core/auth/registration/registration.component';
import { NotFoundComponent } from './components/core/not-found/not-found/not-found.component';
import { AdminEventsComponent } from './components/admin/events/admin-events/admin-events.component';
import { AdminTicketsComponent } from './components/admin/tickets/admin-tickets/admin-tickets.component';
import { AdminAttendeesComponent } from './components/admin/attendees/admin-attendees/admin-attendees.component';
import { NewsComponent } from './components/users/news/news/news.component';
import { AdminBaseComponent } from './components/admin/base/admin-base/admin-base.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home'},
    { path: 'home', component: LandingComponent},
    { path: 'users', component:BaseComponent, children: [
        { path: '', pathMatch: 'full', redirectTo: 'events'},
        { path: 'events', component: EventsComponent},
        { path: 'single-event', component: SingleEventComponent},
        { path: 'contact', component: ContactComponent},
        { path: 'news', component: NewsComponent},
        { path: 'auth', children: [
            { path: '', pathMatch: 'full', redirectTo: 'register'},
            { path: 'login', component:LoginComponent},
            { path: 'register', component: RegistrationComponent}
        ]},
    ]},
    { path: 'admin', component: AdminBaseComponent, children:[
        { path: '', pathMatch: 'full', redirectTo:'analytics'},
        { path: 'analytics', component: AnalyticsComponent},
        { path:'events', component: AdminEventsComponent},
        { path: 'tickets', component: AdminTicketsComponent},
        { path: 'attendees', component: AdminAttendeesComponent}
    ]},
    { path: '**', component: NotFoundComponent }
];
