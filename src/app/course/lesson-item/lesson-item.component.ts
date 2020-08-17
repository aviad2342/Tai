import { Component, OnInit, Input } from '@angular/core';
import { Lesson } from '../lesson.model';

@Component({
  selector: 'app-lesson-item',
  templateUrl: './lesson-item.component.html',
  styleUrls: ['./lesson-item.component.scss'],
})
export class LessonItemComponent implements OnInit {

  @Input() lesson: Lesson;

  constructor() { }

  ngOnInit() {}

}
