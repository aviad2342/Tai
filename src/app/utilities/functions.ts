import { IonIcon, IonInput } from '@ionic/angular';
import { User } from '../user/user.model';

export function togglePasswordVisibility(input: IonInput, icon: IonIcon) {
    if(input.type === 'password') {
      input.type = 'text';
      icon.name = 'eye-outline';
    } else {
      input.type = 'password';
      icon.name = 'eye-off-outline'
    }
  }

export function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = window.atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);
      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

export function onImageChosen(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        alert('חלה תקלה לא ניתן לשמור את התמונה!');
        return;
      }
    } else {
      imageFile = imageData;
    }
    return imageFile;
  }

  export function userFullAddress(user: User) {
    return user.address.street + ' ' +
           user.address.houseNumber + ', ' +
           user.address.city + ', ' +
           user?.address.country;
  }

  export function getUserFullName(user: User) {
    return user.firstName + ' ' + user.lastName;
  }

  export const typesOfTreatments = {
    BOOKS: 'ספרים',
    TREATMENTS: 'טיפולים',
    CONFERENCES: 'כנסים',
    COURSES: 'קורסים',
    ARTICLES: 'מאמרים',
    ACCESSORIES: 'אביזרים',
    OTHER: 'אחר'
  };

  export const updateTypes = {
    PRODUCT: 'מוצר',
    TREATMENT: 'טיפול',
    CONFERENCE: 'כנס',
    COURSE: 'קורס',
    ARTICLE: 'מאמר',
    TESTIMONY: 'עדות',
    THERAPIST: 'מטפל',
    NEWS: 'חדשות',
    OTHER: 'אחר'
  };