import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  canManageRoomTypes(): boolean {
    return this.authService.isLoggedIn() && this.authService.isAdmin();
  }
}
