/* eslint-disable @typescript-eslint/prefer-for-of */
import { StorageService } from './../storage.service';
import { AfterViewChecked, Component, HostListener, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { levels } from 'src/environments/constants';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, AfterViewChecked {

  results = [];
  array = [];
  quiz = [];
  numbers = [];
  level = 'Easy';
  levels = levels;
  size = 9;
  count = 0;
  isWin = false;
  cellWidth: number;
  selectedI: number;
  selectedJ: number;
  buttons = [
    { name: 'Clear', icon: 'backspace-outline' },
    { name: 'Redo', icon: 'arrow-redo-circle-outline' },
    { name: 'Undo', icon: 'arrow-undo-circle-outline' },
    { name: 'Hint', icon: 'bulb-outline' },
    { name: 'Note', icon: 'pencil-outline' },
    { name: 'Reset', icon: 'refresh-circle-outline' }
  ];

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
            this.array = JSON.parse(JSON.stringify(this.quiz));
          }
        }
      ]
    });
    await alert.present();
  }

  getRandom(range: number) {
    return Math.floor(Math.random() * range);
  }

  sumZone(idX: number, idY: number) { // idx: row on UI, column on console
    let sum = 0;
    for (let i = 0; i < 3; i++) {
      sum += this.array[idX + i].reduce((total: number, val: number, index: number) => {
        if (idY <= index && index < idY + 3 && val > 0) {
          total += val;
        }
        return total;
      }, 0);
    }
    return sum;
  }

  createBoard() {
    this.isWin = false;
    this.count = 0;
    this.numbers = [...Array(this.size).keys()].map(item => item += 1);
    const sample = [...Array(this.size).keys()].map(item => item += 1);
    // this.array = ;
    for (let i = 0; i < this.size; i++) {
      const a = Array(this.size).fill('');
      const genIdx = this.getRandom(sample.length);
      a[sample[genIdx] - 1] = i + 1;
      sample.splice(genIdx, 1);
      this.array.push(a);
    }

    const levelIdx = levels.indexOf(this.level) + 1;
    let emptyCell = 0;
    let stepLevel = 0;
    if (levels.length === 2) {
      stepLevel = this.size / 3;
      emptyCell = levelIdx * stepLevel;
    } else if (levels.length === 3) {
      stepLevel = Math.floor((this.size - 2) / 2);
      emptyCell = 1 + stepLevel;
    } else {
      stepLevel = Math.floor((this.size - 2) / (levels.length - 2));
      emptyCell = 1 + stepLevel * levelIdx;
    }
    const levelNumber = this.size - emptyCell;
    console.log('emptyCell', emptyCell);
    for (let i = 0; i < this.array.length; i++) {
      const curArray = this.array[i];
      // for (let j = 0; j < levelNumber - 1; j++) {
      //   let genIdx = this.getRandom(sample.length);
      // }
      console.log(curArray);
    }
    console.log(this.array);
    this.quiz = JSON.parse(JSON.stringify(this.array));
  }

  createBoardA() {
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
    this.selectedI = i;
    this.selectedJ = j;
  }

  clickNumber(num: number) {
    if (this.selectedI >= 0 && this.selectedJ >= 0 && this.quiz[this.selectedI][this.selectedJ] === '') {
      if (this.array[this.selectedI][this.selectedJ] === '' && !this.isWin) {
        this.count++;
      }
      this.array[this.selectedI][this.selectedJ] = num;
      if (this.array.flat().every(ele => ele !== '')) {
        console.log('All filled');
      }
    }
  }

  clickButton(button: { name: string; icon: string}) {
    if (button.name.toLowerCase() === 'clear') {
      if (this.selectedI && this.selectedJ) {
        this.array[this.selectedI][this.selectedJ] = '';
      }
    } else if (button.name.toLowerCase() === 'redo') {

    } else if (button.name.toLowerCase() === 'undo') {

    } else if (button.name.toLowerCase() === 'hint') {

    } else if (button.name.toLowerCase() === 'note') {

    } else if (button.name.toLowerCase() === 'reset') {
      this.reset();
    }
  }
}
