import { Routes } from '@angular/router';
import { MainMenu } from './pages/main-menu/main-menu';
import { RunOverview } from './pages/run-overview/run-overview';
import { Battle } from './pages/battle/battle';
import { MoveManager } from './pages/move-manager/move-manager';

export const routes: Routes = [
    { path: '', component: MainMenu },
    { path: 'run-overview', component: RunOverview },
    { path: 'battle', component: Battle },
    { path: 'move-manager', component: MoveManager },
];
