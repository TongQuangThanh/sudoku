import { SharedService } from './../shared.service';
import { IonRouterOutlet, Platform, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './../storage.service';
import { App } from '@capacitor/app';
import { levels } from 'src/environments/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  maxSize = 20;
  minSize = 3;
  size = 9;
  levels = levels;
  level = levels[0];
  constructor(private storage: StorageService, private router: Router, sharedService: SharedService,
    private routerOutlet: IonRouterOutlet, private platform: Platform, private alertController: AlertController) {
    this.platform.backButton.subscribeWithPriority(-1, () => this.exitApp());
    sharedService.exit$.subscribe(() => this.exitApp());
  }

  ngOnInit() { }

  exitApp() {
    if (!this.routerOutlet.canGoBack()) {
      this.alertController.create({
        header: 'Quit this game!',
        message: 'Do you really want to quit this game?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          }, {
            text: 'Exit',
            handler: () => {
              App.exitApp();
            }
          }
        ]
      }).then((alert) => alert.present());
    }
  }

  async onSubmit() {
    const p0 = this.storage.set('level', this.level);
    const p1 = this.storage.set('size', this.size);
    Promise.all([p0, p1]).then(() => this.router.navigateByUrl('play'));
  }
}
