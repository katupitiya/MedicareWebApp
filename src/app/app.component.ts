import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MedicareWebApp';

  showComponent = false; // Controls the visibility of MyNewComponent

  toggleComponent() {
    this.showComponent = !this.showComponent; // Toggle visibility on button click
  }
}
