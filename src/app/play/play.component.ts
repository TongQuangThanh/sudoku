import { StorageService } from './../storage.service';
import { AfterViewChecked, Component, HostListener, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, AfterViewChecked {

  results = [];
  array = [];
  level = 'medium';
  size = 9;
  count = 0;
  isWin = false;
  cellWidth: number;

  constructor(private storage: StorageService, private alertController: AlertController, private platform: Platform) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.ngAfterViewChecked();
  }

  async ngOnInit() {
    const p0 = this.storage.get('level');
    const p1 = this.storage.get('size');
    Promise.all([p0, p1]).then((value) => {
      if (value[0] && value[1]) {
        [this.level, this.size] = value;
      }
      this.createBoard();
      this.ngAfterViewChecked();
    });
  }

  ngAfterViewChecked() {
    const cells = document.getElementsByClassName('cell');
    const main = document.getElementById('main');
    const cellWidth = main.clientWidth / (this.size + 1);
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < cells.length; i++) {
      const element = cells[i] as HTMLElement;
      element.style.width = cellWidth + 'px';
      element.style.height = cellWidth + 'px';
    }
  }

  async reset() {
    const alert = await this.alertController.create({
      header: 'Reset all board!',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'OK',
          handler: () => {
            this.createBoard(true);
          }
        }
      ]
    });
    await alert.present();
  }

  getRandom(range: number) {
    return Math.floor(Math.random() * range);
  }

  createBoard(clickReset?: boolean) {
    this.isWin = false;
    this.count = 0;
    const sample = [...Array(this.size).keys()].map(item => item += 1);
    // this.array = ;
    for (let i = 0; i < this.size; i++) {
      const a = Array(this.size).fill('');
      const genIdx = this.getRandom(sample.length);
      a[sample[genIdx] - 1] = i + 1;
      sample.splice(genIdx, 1);
      this.array.push(a);
    }
    console.log(this.array);
  }

  createBoardA(clickReset?: boolean) {
    this.isWin = false;
    this.count = 0;
    const randomStep = Math.floor(Math.random() * this.size);
    const sample = [...Array(this.size).keys()].map(item => item += 1);
    this.results = Array(this.size).fill(sample);
    this.results = this.results.map(
      (arr, i) => arr.map(
        (num: number) => num + i + randomStep > 2 * this.size ?
          num + i + randomStep - 2 * this.size :
          num + i + randomStep > this.size ?
            num + i + randomStep - this.size :
            num + i + randomStep
      )
    );
    console.log(randomStep + ' ' + this.results);
  }

  checkWin(i: number, j: number) {
    return this.isWin;
  }

  undo() {
    this.count--;
  }

  tick(i: number, j: number) {
    if (this.array[i][j] === '' && !this.isWin) {
      this.count++;
    }
  }
}
