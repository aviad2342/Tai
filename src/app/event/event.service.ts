import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Event } from './event.model';
import { Speaker, speakerTitle } from './speaker.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  // tslint:disable-next-line: variable-name
  private _events = new BehaviorSubject<Event[]>([
    new Event(
      '1',
      'חזרה לאמא אדמה',
      'מאיפה הגענו ולאן אנו הולכים',
      new Date(),
      new Date(),
      new Date(),
      'https://www.ilo.org/wcmsp5/groups/public/---dgreports/---dcomm/documents/image/wcms_591481.jpg',
      ['https://www.riconvention.org/sites/default/files/20170614_US_341.jpg',
      'https://static01.nyt.com/images/2020/04/02/us/politics/00convention-delayHFO/00convention-delayHFO-mediumSquareAt3X.jpg',
      'https://wildwoodsnj.com/wp-content/uploads/2018/09/ww-convention-center.jpg',
      'https://www.promptcharters.com/images/convention.jpg' ],
      [new Speaker('1', speakerTitle.MISTER, 'אביעד', 'בן חיון', 'http://localhost:3000/images/aviad@.jpg'),
       new Speaker('2', speakerTitle.MISTER, 'אביעד', 'בן חיון', 'http://localhost:3000/images/aviad@.jpg')],
      150,
      'בית העם הרצליה',
      'ישראל',
      'בנימינה',
      'רותם',
      '3',
      '0',
      '0'
    ),
    new Event(
      '2',
      'חזרה לאמא אדמה',
      'מאיפה הגענו ולאן אנו הולכים',
      new Date(),
      new Date(),
      new Date(),
      'https://www.ilo.org/wcmsp5/groups/public/---dgreports/---dcomm/documents/image/wcms_591481.jpg',
      ['https://www.riconvention.org/sites/default/files/20170614_US_341.jpg',
      'https://static01.nyt.com/images/2020/04/02/us/politics/00convention-delayHFO/00convention-delayHFO-mediumSquareAt3X.jpg',
      'https://wildwoodsnj.com/wp-content/uploads/2018/09/ww-convention-center.jpg',
      'https://www.promptcharters.com/images/convention.jpg' ],
      [new Speaker('1', speakerTitle.MISTER, 'אביעד', 'בן חיון', 'http://localhost:3000/images/aviad@.jpg'),
       new Speaker('2', speakerTitle.MISTER, 'אביעד', 'בן חיון', 'http://localhost:3000/images/aviad@.jpg')],
      150,
      'בית העם הרצליה',
      'ישראל',
      'בנימינה',
      'רותם',
      '3',
      '0',
      '0'
    ),
    new Event(
      '3',
      'חזרה לאמא אדמה',
      'מאיפה הגענו ולאן אנו הולכים',
      new Date(),
      new Date(),
      new Date(),
      'https://www.ilo.org/wcmsp5/groups/public/---dgreports/---dcomm/documents/image/wcms_591481.jpg',
      ['https://www.riconvention.org/sites/default/files/20170614_US_341.jpg',
      'https://static01.nyt.com/images/2020/04/02/us/politics/00convention-delayHFO/00convention-delayHFO-mediumSquareAt3X.jpg',
      'https://wildwoodsnj.com/wp-content/uploads/2018/09/ww-convention-center.jpg',
      'https://www.promptcharters.com/images/convention.jpg' ],
      [new Speaker('1', speakerTitle.MISTER, 'אביעד', 'בן חיון', 'http://localhost:3000/images/aviad@.jpg'),
       new Speaker('2', speakerTitle.MISTER, 'אביעד', 'בן חיון', 'http://localhost:3000/images/aviad@.jpg')],
      150,
      'בית העם הרצליה',
      'ישראל',
      'בנימינה',
      'רותם',
      '3',
      '0',
      '0'
    ),
    new Event(
      '4',
      'חזרה לאמא אדמה',
      'מאיפה הגענו ולאן אנו הולכים',
      new Date(),
      new Date(),
      new Date(),
      'https://www.ilo.org/wcmsp5/groups/public/---dgreports/---dcomm/documents/image/wcms_591481.jpg',
      ['https://www.riconvention.org/sites/default/files/20170614_US_341.jpg',
      'https://static01.nyt.com/images/2020/04/02/us/politics/00convention-delayHFO/00convention-delayHFO-mediumSquareAt3X.jpg',
      'https://wildwoodsnj.com/wp-content/uploads/2018/09/ww-convention-center.jpg',
      'https://www.promptcharters.com/images/convention.jpg' ],
      [new Speaker('1', speakerTitle.MISTER, 'אביעד', 'בן חיון', 'http://localhost:3000/images/aviad@.jpg'),
       new Speaker('2', speakerTitle.MISTER, 'אביעד', 'בן חיון', 'http://localhost:3000/images/aviad@.jpg')],
      150,
      'בית העם הרצליה',
      'ישראל',
      'בנימינה',
      'רותם',
      '3',
      '0',
      '0'
    ),
  ]);


  get events() {
    return this._events.asObservable();
  }

  constructor() { }
}
